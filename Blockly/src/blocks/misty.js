/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';


const misty_drive  = {
    type: 'misty_drive',
    message0: 'Drive %1',
    args0: [
      {
        type: 'field_dropdown',
        name: 'DIRECTION',
        options: [
          ['forward', 'forward'],
          ['backward', 'backward'],
          ['left', 'left'],
          ['right', 'right'],
        ],
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 160,
    tooltip: '',
    helpUrl: '',
};

export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
     misty_drive
]);