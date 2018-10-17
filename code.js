/**
 * Copyright 2018 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function onOpen() {
  var ui = SpreadsheetApp.getUi();

  ui.createMenu('GFinance to GTM')
      .addItem('Sync Currencies', 'runSync')
      .addToUi();
}

/**
 * This is the main script. It initializes or refreshes a currency table in
 * sheets and writes the data into a GTM lookup table on the container. This
 * function can be either triggered by a time trigger or the custom menu on the
 * sheet.
 */
function runSync() {
  var sheet = SpreadsheetApp.getActiveSheet();

  refreshCurrencies_(
      sheet, CONFIG['baseCurrency'], CONFIG['currencies'],
      CONFIG['convertToBase']);

  var workspaceId = getWorkspaceId_(
          CONFIG['accountId'], CONFIG['containerId'], CONFIG['workspaceName']),

      currencyRates = getCurrencies_(sheet);

  var lookupTableResource = buildLookupTable_(currencyRates, 'currencyTable');

  publishLookupTable_(
      lookupTableResource, CONFIG['accountId'], CONFIG['containerId'],
      workspaceId, CONFIG['lookupTableVarId']);
}

/**
 * Create or overwrite a table of currency rates in the bound sheet based on
 * Google Finance formulas
 *
 * @param {object} activeSheet
 * @param {string} baseCurrency
 * @param {array} currencyCodes
 * @param {boolean} convertToBase
 */
function refreshCurrencies_(
    activeSheet, baseCurrency, currencyCodes, convertToBase) {
  var dataTable = [], formulaTemplate = '';

  currencyCodes.forEach(function(currencyCode) {
    if (convertToBase) {
      // We won't get a result for converting the baseCurrency, rather a `#NA`
      if(currencyCode === baseCurrency){
        formulaTemplate = 1.00;
      }
      else {
      formulaTemplate =
          '=GoogleFinance("CURRENCY:' + currencyCode + baseCurrency + '")';
    } else {
      formulaTemplate =
          '=GoogleFinance("CURRENCY:' + baseCurrency + currencyCode + '")';
    }

    dataTable.push([currencyCode, formulaTemplate]);
  });

  activeSheet.clearContents();
  activeSheet.getRange(1, 1, dataTable.length, dataTable[0].length)
      .setValues(dataTable);
}


/**
 * Extract the currency table rates in the bound sheet into a set of key:value
 * pairs.
 * @param {object} activeSheet
 * @return {object} ratesObject
 */
function getCurrencies_(activeSheet) {
  var ratesObject = {};

  activeSheet.getRange('A:B').getValues().forEach(function(item) {
    ratesObject[item[0]] = item[1];
  });

  return ratesObject;
}


/**
 * Creates a new lookup table resource object with the latest data to be sent to
 * GTM.
 *
 * @param {object} currencyRates
 * @param {string} tableName
 * @return {object} tableResource
 */
function buildLookupTable_(currencyRates, tableName) {
  var lookupTableMap = [];

  for (var key in currencyRates) {
    lookupTableMap.push({
      'type': 'map',
      'map': [
        {'type': 'template', 'key': 'key', 'value': key},
        {'type': 'template', 'key': 'value', 'value': currencyRates[key]}
      ]
    });
  }

  var tableResource = {
    'name': tableName,
    'type': 'smm',
    'parameter': [
      {'type': 'template', 'key': 'input', 'value': '{{currency}}'},
      {'type': 'list', 'key': 'map', 'list': lookupTableMap},
      {'type': 'template', 'key': 'defaultValue', 'value': 1}
    ]
  };

  return tableResource;
}


/**
 * Finds a GTM workpace ID by name.
 * Note: The API foesn't support workspace lookup by name. At the same time,
 * the workspace ID can't  be included in the script configuration directly as
 * it's subject to change change after every submission of a new container
 * version.
 *
 * @param {string} accountId
 * @param {string} containerId
 * @param {string} workspaceName
 * @return {string} workspaceId
 */
function getWorkspaceId_(accountId, containerId, workspaceName) {
  var workspaceId,
      workspaces = TagManager.Accounts.Containers.Workspaces.list(
          'accounts/' + accountId + '/containers/' + containerId);

  workspaces['workspace'].forEach(function(workspace) {
    if (workspace.name === workspaceName) {
      workspaceId = workspace.workspaceId;
    }
  });

  if (typeof (workspaceId) === 'undefined') {
    throw 'Workspace ' + workspaceName + ' not found!';
  }

  return workspaceId;
}


/**
 * Updates a given lookup table variable, via the API, under the specified
 * container. As a side effect of publishing the new lookup table, this function
 * creates and publishes new container version in the given workspace.
 *
 * @param {object} lookupTableResource
 * @param {string} accountId
 * @param {string} containerId
 * @param {string} workspaceId
 * @param {string} lookupTableVarId
 */
function publishLookupTable_(
    lookupTableResource, accountId, containerId, workspaceId,
    lookupTableVarId) {
  try {
    TagManager.Accounts.Containers.Workspaces.Variables.update(
        lookupTableResource,
        'accounts/' + accountId + '/containers/' + containerId +
            '/workspaces/' + workspaceId + '/variables/' + lookupTableVarId);
  } catch (err) {
    throw new Error(
        'Failed to update lookup table variable. Check validity of accountId,' +
        'containerId, workspaceId and lookup variable id');
  }

  try {
    var newContainerVersion =
        TagManager.Accounts.Containers.Workspaces.create_version(
            {},
            'accounts/' + accountId + '/containers/' + containerId +
                '/workspaces/' + workspaceId);
  } catch (err) {
    throw new Error(
        'Failed to create container: Check validity of accountId, ' +
        'containerId, and workspaceId values');
  }

  if (newContainerVersion.compilerError) {
    throw new Error(
        'Container has compile errors. Review and fix variables ' +
        'in GTM under "Preview" for pending changes');
  }

  try {
    TagManager.Accounts.Containers.Versions.publish(
        newContainerVersion.containerVersion.path);
  } catch (err) {
    throw new Error('Failed to publish container.');
  }
}
