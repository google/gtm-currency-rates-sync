# Google Finance Currency Rates to GTM Lookup Table

## Overview

A sheets bound Apps Script that enables maintaining an up to date GTM (Google
Tag Manager) Lookup Table variable with all the currency rates available in
Google Finance data via sheets. The resulting lookup table can be leveraged by
custom GTM variable scripts for applying currency conversion on tags data.

Example: Utilising the lookup table to updating revenue data in Floodlight tags
on multi-currency sites before sending them into DCM or DS.

## Setup instructions

-   Create a new Google Sheet or use your existing one on Drive

-   Setup the Google App Script on it by navigating to Tools > Script Editor

-   Click on Resources > Advanced Google Services and enable the "Tag Manager
    API" V2

-   Follow the "Google API Console" link in the bottom to navigate to the Google
    Cloud Console. Enable the Google Tag Manager API there by searching for it
    under "Enable APIs and Services" by searching for it on that page and
    hitting enable. Once that is done, go back to the Apps Script editor.

-   Paste the contents of code.js into the default Code.gs file. Create a new
    script file named Config.gs paste the contents of config.js in that.

-   In order to configure the script with your account specific parameters,
    navigate to *File -> Project properties* and select the *Script properties*
    tab. In this section, you can set script wide key value pairs that can be
    used as a configuration for the script. Fill into the table the following
    properties:

    -   *accountId* The ID of your GTM account
    -   *containerId* The numeric ID of the GTM container. This value is
        different from the form GTM-XXXX. Below you can find an explanation on
        how to obtain from the GTM account.
    -   *workspaceName* Name of the GTM workspace. Note: In case you rename the
        workspace this needs to be updated in the script. That is why we'll be
        doing lookup by name for getting the workspace ID before every API
        request. Instead of setting the workspace ID in the configuration.
    -   *lookupTableVarId* The variable ID of the look-up table that you're
        updating.

        Name of the input variable for the lookup table should be named
        "currency" in GTM, given the current code setup. In case you wish to use
        another variable name in GTM, that should also be update in the code.js
        file in `buildLookupTable_` function when defining the `tableResource`.
        Having incosistent lookup table variable names between the GTM container
        and the code would return a compile error.

        Obtaining the values: *accountId*, *containerId*, and *lookupTableVarId*
        can be done by extracting the values from the URL path in the browser
        when accessing these objects. For example, accessing a variable's config
        page should have the following path:

        tagmanager.google.com/#/container/accounts/[ACCOUNT_ID]/
        containers/[CONTAINER_ID]/workspaces/[WORKSPACE_ID]/variables/[VARIABLE_ID]

        The variable's direct config page is accessible by right clicking on the
        variable link in UI -> "open link in new tab". Directly clicking on the
        variable wont load the full URL path including the variable id.

Once all of this is set, you can validate that the script is running properly by
running *runSync* in Code.gs or using the custom UI menu in the bound sheet
(this will show up after saving changes and refreshing the sheet page).

The Apps Script can also be extended to have it run based on time
[triggers](https://developers.google.com/apps-script/guides/triggers/)

## Disclaimer

This is not an official Google product.
