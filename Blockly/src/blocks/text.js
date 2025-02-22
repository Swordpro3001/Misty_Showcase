/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';

// Create a custom block called 'add_text' that adds
// text to the output div on the sample app.
// This is just an example and you should replace this with your
// own custom blocks.
const addText = {
  type: 'add_text',
  message0: 'Add text %1',
  args0: [
    {
      type: 'input_value',
      name: 'TEXT',
      check: 'String',
    },
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 160,
  tooltip: '',
  helpUrl: '',
};

const misty_drive = {
  type: 'misty_drive',
  message0: 'Drive %1 for %2',
  args0: [
      {
          type: 'field_dropdown',
          name: 'DIRECTION',
          options: [
              ['Forward', 'forward'],
              ['Backward', 'backward'],
          ],
      },
      {
          type: 'field_number',
          name: 'Blocks',
          value: 0,
          min: 0,
          max: 100,
      },
  ],
}

const misty_rotate =  {
  type: 'misty_rotate',
  message0: 'Rotate %1 ',
  args0: [
      {
          type: 'field_dropdown',
          name: 'DIRECTION',
          options: [
              ['Left', 'left'],
              ['Right', 'right'],
          ],
      },
  ],
}

const misty_display_image = {
  type: 'misty_display_image',
  message0: 'Display image %1',
  args0: [
      {
          type: 'field_dropdown',
          name: 'IMAGE',
          options: [
              ['Happy', 'happy'],
              ['Sad', 'sad'],
              ['Angry', 'angry'],
              ['Neutral', 'neutral'],
          ],
      },
  ],
}

const misty_display_text = {
  type: 'misty_display_text',
  message0: 'Display text %1',
  args0: [
      {
          type: 'input_value',
          name: 'TEXT',
          check: 'String',
      },
  ],
}

const misty_display_audio = {
  type: 'misty_display_audio',
  message0: 'Play audio %1',
  args0: [
      {
          type: 'field_dropdown',
          name: 'AUDIO',
          options: [
              ['Happy', 'happy'],
              ['Sad', 'sad'],
              ['Angry', 'angry'],
              ['Neutral', 'neutral'],
          ],
      },
  ],
}
// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  addText, misty_drive, misty_rotate, misty_display_image, misty_display_text, misty_display_audio 
]);
