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

var scriptProperties = PropertiesService.getScriptProperties(),
    CONFIG = {
  'accountId': scriptProperties.getProperty('accountId'),
  'containerId': scriptProperties.getProperty('containerId'),
  'workspaceName': scriptProperties.getProperty('workspaceName'),
  'lookupTableVarId': scriptProperties.getProperty('lookupTableVarId'),
  'baseCurrency': 'USD',
  'convertToBase': true,
  'currencies': [
    'AFN', 'EUR', 'ALL', 'DZD', 'USD', 'AOA', 'XCD', 'ARS', 'AMD', 'AWG', 'SHP',
    'AUD', 'AZN', 'BSD', 'BHD', 'BDT', 'BBD', 'BYN', 'BZD', 'XOF', 'BMD', 'BTN',
    'BOB', 'BAM', 'BWP', 'BRL', 'BND', 'BGN', 'BIF', 'CVE', 'KHR', 'XAF', 'CAD',
    'KYD', 'NZD', 'CLP', 'CNY', 'COP', 'KMF', 'CDF', 'CRC', 'HRK', 'CUP', 'ANG',
    'CZK', 'DKK', 'DJF', 'DOP', 'EGP', 'ERN', 'ETB', 'FKP', 'FJD', 'XPF', 'GMD',
    'GEL', 'GHS', 'GIP', 'GTQ', 'GNF', 'GYD', 'HTG', 'HNL', 'HKD', 'HUF', 'ISK',
    'INR', 'IDR', 'XDR', 'IRR', 'IQD', 'ILS', 'JMD', 'JPY', 'JOD', 'KZT', 'KES',
    'KWD', 'KGS', 'LAK', 'LBP', 'LSL', 'LRD', 'LYD', 'CHF', 'MOP', 'MKD', 'MGA',
    'MWK', 'MYR', 'MVR', 'MRO', 'MUR', 'MXN', 'MDL', 'MNT', 'MAD', 'MZN', 'MMK',
    'NAD', 'NPR', 'NIO', 'NGN', 'KPW', 'NOK', 'OMR', 'PKR', 'PGK', 'PYG', 'PEN',
    'PHP', 'PLN', 'QAR', 'RON', 'RUB', 'RWF', 'WST', 'STD', 'SAR', 'RSD', 'SCR',
    'SLL', 'SGD', 'SBD', 'SOS', 'ZAR', 'GBP', 'KRW', 'LKR', 'SDG', 'SRD', 'SZL',
    'SEK', 'SYP', 'TWD', 'TJS', 'TZS', 'THB', 'TOP', 'TTD', 'TND', 'TRY', 'TMT',
    'UGX', 'UAH', 'AED', 'UYU', 'UZS', 'VUV', 'VEF', 'VND', 'YER', 'ZMW'
  ]
};
