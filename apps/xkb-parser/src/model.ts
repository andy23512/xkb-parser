// Reference: https://w3c.github.io/uievents-code/#key-alphanumeric-writing-system
export type WSKCode =
  | 'Backquote'
  | 'Backslash'
  | 'BracketLeft'
  | 'BracketRight'
  | 'Comma'
  | 'Digit0'
  | 'Digit1'
  | 'Digit2'
  | 'Digit3'
  | 'Digit4'
  | 'Digit5'
  | 'Digit6'
  | 'Digit7'
  | 'Digit8'
  | 'Digit9'
  | 'Equal'
  | 'IntlBackslash'
  | 'IntlRo'
  | 'IntlYen'
  | 'KeyA'
  | 'KeyB'
  | 'KeyC'
  | 'KeyD'
  | 'KeyE'
  | 'KeyF'
  | 'KeyG'
  | 'KeyH'
  | 'KeyI'
  | 'KeyJ'
  | 'KeyK'
  | 'KeyL'
  | 'KeyM'
  | 'KeyN'
  | 'KeyO'
  | 'KeyP'
  | 'KeyQ'
  | 'KeyR'
  | 'KeyS'
  | 'KeyT'
  | 'KeyU'
  | 'KeyV'
  | 'KeyW'
  | 'KeyX'
  | 'KeyY'
  | 'KeyZ'
  | 'Minus'
  | 'Period'
  | 'Quote'
  | 'Semicolon'
  | 'Slash';

export interface KeyboardLayoutKeyOutput {
  type: 'text' | 'dead-key';
  value: string;
}

/**
 * Output character information of a key on a keyboard layout.
 */
export type KeyboardLayoutKey = Record<
  'unmodified' | 'withShift' | 'withAltGraph' | 'withShiftAltGraph',
  KeyboardLayoutKeyOutput
>;

/**
 * Data of a keyboard layout (OS layout), which map key codes to keyboard layout keys
 */
export interface KeyBoardLayout {
  id: string;
  name: string;
  reference: string;
  layout: Partial<Record<WSKCode, Partial<KeyboardLayoutKey>>>;
}

export type KlfcResultShiftLevel = 'None' | 'Shift' | 'AltGr' | 'Shift+AltGr';

export interface KlfcResultKey {
  pos: string;
  letters: string[];
  shiftlevels?: KlfcResultShiftLevel[];
}

export interface KlfcResult {
  fullName: string;
  name: string;
  singletonKeys: string[][];
  shiftlevels: KlfcResultShiftLevel[];
  keys: KlfcResultKey[];
}
