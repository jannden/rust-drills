// Great resources for keyboard layouts in different languages:
// https://www.branah.com/
// https://www.sttmedia.com/characterfrequencies

// The EQUALS sign is used to add an empty space among the keys

export const keyboardLayouts = {
  en: { default: ['q w e r t y u i o p', '= a s d f g h j k l =', '= = z x c v b n m = ='] },
  de: {
    default: ['= = = = ß ü ö ä = = = =', 'q w e r t z u i o p', '= a s d f g h j k l =', '= = y x c v b n m = ='],
  },
  es: {
    default: ['= = á é í ñ ó ú = =', 'q w e r t y u i o p', '= a s d f g h j k l =', '= = z x c v b n m = ='],
  },
  it: {
    default: ['= = à é è ì ò ù = =', 'q w e r t y u i o p', '= a s d f g h j k l =', '= = z x c v b n m = ='],
  },
  fr: {
    default: ['à é è ù ç ê â î ô û', 'a z e r t y u i o p', 'q s d f g h j k l m', '= = w x c v b n = = ='],
  },
  ru: {
    default: ['й ц у к е н г ш щ з х ъ', '= ф ы в а п р о л д ж э =', '= = я ч с м и т ь б ю = ='],
  },
  sk: {
    default: [
      '= = ľ š č ť ž ý á í é = =',
      'q w e r t z u i o p ú ä ň',
      '= a s d f g h j k l ô =',
      '= = = y x c v b n m = = =',
    ],
  },
  cs: {
    default: [
      '= = ě š č ř ž ý á í é = =',
      'q w e r t z u i o p ú',
      '= a s d f g h j k l ů =',
      '= = = y x c v b n m = = =',
    ],
  },
  bg: {
    default: ['я в е р т ъ у и о п ш щ', '= а с д ф г х й к л =', '= = ч з ь ц ж б н м = ='],
  },
}

export const keyboardButtonTheme = [
  {
    class: 'hidden-key',
    buttons: '=',
  },
]

export const diacriticChars = {
  é: 'e',
  è: 'e',
  ě: 'e',
  ê: 'e',
  í: 'i',
  ì: 'i',
  î: 'i',
  á: 'a',
  à: 'a',
  ä: 'a',
  â: 'a',
  ò: 'o',
  ó: 'o',
  ö: 'o',
  ô: 'o',
  ú: 'u',
  ù: 'u',
  ü: 'u',
  ů: 'u',
  û: 'u',
  ý: 'y',
  ß: 's',
  ñ: 'n',
  ç: 'c',
  ľ: 'l',
  š: 's',
  č: 'c',
  ť: 't',
  ž: 'z',
  ň: 'n',
  ř: 'r',
}

export const confirmationKeys = ['Enter', 'ArrowRight']

export const ignoredKeys = [
  ' ',
  'Unidentified',
  'Enter',
  'Backspace',
  'Escape',
  'Tab',
  'Shift',
  'Control',
  'Alt',
  'CapsLock',
  'Meta',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'PageUp',
  'PageDown',
  'F1',
  'F2',
  'F3',
  'F4',
  'F5',
  'F6',
  'F7',
  'F8',
  'F9',
  'F10',
  'F11',
  'F12',
  'NumLock',
  'ScrollLock',
  'Insert',
  'Delete',
  'ContextMenu',
  'AudioVolumeMute',
  'AudioVolumeDown',
  'AudioVolumeUp',
  'MediaTrackNext',
  'MediaTrackPrevious',
  'MediaStop',
  'MediaPlayPause',
  'LaunchMail',
  'LaunchMediaPlayer',
  'LaunchApp2',
  'BrowserSearch',
  'BrowserHome',
  'BrowserBack',
  'BrowserForward',
  'BrowserStop',
  'BrowserRefresh',
  'BrowserFavorites',
  '[',
  ']',
  '{',
  '}',
  '(',
  ')',
  '<',
  '>',
  '\\',
  '|',
  '_',
  '^',
  '±',
  '§',
  '`',
  '~',
  '´',
  '¨',
  '°',
  ...Array.from({ length: 10 }, (_, i) => i.toString()), // All numbers
  ...Array.from({ length: 33 }, (_, i) => String.fromCharCode(i + 33)), // Dots, commas, semicolons, colons, apostrophes, quotes, brackets, braces, slashes, backslashes, hyphens, underscores, plus signs, equal signs, asterisks, ampersands, exclamation marks, question marks, and spaces
]
