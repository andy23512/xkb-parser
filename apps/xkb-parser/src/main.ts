import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { fromName } from 'keysym';
import {
  KeyBoardLayout,
  KeyboardLayoutKey,
  KlfcResult,
  WSKCode,
} from './model';

const KLFC_RESULT_KEY_POS_TO_WSK_CODE = new Map<string, WSKCode>([
  ['~', 'Backquote'],
  ['1', 'Digit1'],
  ['2', 'Digit2'],
  ['3', 'Digit3'],
  ['4', 'Digit4'],
  ['5', 'Digit5'],
  ['6', 'Digit6'],
  ['7', 'Digit7'],
  ['8', 'Digit8'],
  ['9', 'Digit9'],
  ['0', 'Digit0'],
  ['-', 'Minus'],
  ['+', 'Equal'],
  ['Q', 'KeyQ'],
  ['W', 'KeyW'],
  ['E', 'KeyE'],
  ['R', 'KeyR'],
  ['T', 'KeyT'],
  ['Y', 'KeyY'],
  ['U', 'KeyU'],
  ['I', 'KeyI'],
  ['O', 'KeyO'],
  ['P', 'KeyP'],
  ['[', 'BracketLeft'],
  [']', 'BracketRight'],
  ['A', 'KeyA'],
  ['S', 'KeyS'],
  ['D', 'KeyD'],
  ['F', 'KeyF'],
  ['G', 'KeyG'],
  ['H', 'KeyH'],
  ['J', 'KeyJ'],
  ['K', 'KeyK'],
  ['L', 'KeyL'],
  [';', 'Semicolon'],
  ["'", 'Quote'],
  ['\\', 'Backslash'],
  ['Iso', 'IntlBackslash'],
  ['Z', 'KeyZ'],
  ['X', 'KeyX'],
  ['C', 'KeyC'],
  ['V', 'KeyV'],
  ['B', 'KeyB'],
  ['N', 'KeyN'],
  ['M', 'KeyM'],
  [',', 'Comma'],
  ['.', 'Period'],
  ['/', 'Slash'],
]);

const basePath = '/Users/nanoha/git/xkeyboard-config/symbols';

// const result1 = execSync(`klfc --from-xkb "${basePath}/us"`, {encoding:'utf8'});
const result = execSync(`klfc --from-xkb "${basePath}/fr(bre)"`, {
  encoding: 'utf8',
});
const keyboardLayout = convertKlfcResultToKeyboardLayout(JSON.parse(result));
writeFileSync('./output.json', JSON.stringify(keyboardLayout));

function convertKlfcResultToKeyboardLayout(result: KlfcResult): KeyBoardLayout {
  const layoutRecords: KeyBoardLayout['layout'] = {};
  result.keys.forEach((k) => {
    const code = convertKlfcResultKeyPosToWSKCode(k.pos);
    if (!code) {
      return;
    }
    const shiftlevels = k.shiftlevels ?? result.shiftlevels;
    const keyboardLayoutKey: Partial<KeyboardLayoutKey> = {};
    k.letters.forEach((letter, index) => {
      const shiftlevel = shiftlevels[index];
      const normalizedLetter = normalizeLetter(letter);
      switch (shiftlevel) {
        case 'None':
          keyboardLayoutKey.unmodified = normalizedLetter;
          return;
        case 'Shift':
          keyboardLayoutKey.withShift = normalizedLetter;
          return;
        case 'AltGr':
          keyboardLayoutKey.withAltGraph = normalizedLetter;
          return;
        case 'Shift+AltGr':
          keyboardLayoutKey.withShiftAltGraph = normalizedLetter;
          return;
      }
    });
    layoutRecords[code] = keyboardLayoutKey;
  });
  if (layoutRecords.KeyM) {
    layoutRecords.KeyM.unmodified = 'ch';
    layoutRecords.KeyM.withShift = 'Ch';
  }
  if (layoutRecords.KeyQ) {
    layoutRecords.KeyQ.unmodified = 'c’h';
    layoutRecords.KeyQ.withShift = 'C’h';
  }
  return {
    id: `${result.name}@xkeyboard`,
    name: result.fullName,
    reference:
      'https://xkeyboard-config.freedesktop.org/layouts/analyzer/#?model=iso-60&layout=' +
      encodeURIComponent('fr(bre)'),
    layout: layoutRecords,
  };
}

function convertKlfcResultKeyPosToWSKCode(pos: string): WSKCode | null {
  return KLFC_RESULT_KEY_POS_TO_WSK_CODE.get(pos) ?? null;
}

function normalizeLetter(letter: string) {
  if (
    [
      'circumflex',
      'diaeresis',
      'tilde',
      'abovering',
      'grave',
      'acute',
      'macron',
      'abovedot',
    ].includes(letter)
  ) {
    return (
      '◌' + String.fromCodePoint(fromName('dead_' + letter)?.unicode as number)
    );
  }
  return letter;
}
