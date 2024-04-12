/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

// let host = 'localhost'
let host='172.27.10.230'
export const environment = {
  production: true,

  websocket: `http://${host}:8445/graph_data`,
  baseUrl: `http://${host}:8445/api`,
};