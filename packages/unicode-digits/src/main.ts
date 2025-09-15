/**
 * A mapping of language keys to the Unicode code point for their digit '0'.
 * This is used to calculate the code points for other digits (1-9).
 * @private
 */
const supportedLanguageList = {
  en: 0x0030,
  ar: 0x0660,
  fa: 0x06f0,
  nko: 0x07c0,
  hi: 0x0966, // devanagari
  bn: 0x09e6, // bengali
  pa: 0x0a66, // gurmukhi, punjabi
  gu: 0x0ae6, // gujarati
  or: 0x0b66, // oriya
  ta: 0x0be6, // tamil
  te: 0x0c66, // telugu
  kn: 0x0ce6, // kannada
  mal: 0x0d66, // malayalam
  sinhala_lith: 0x0de6,
  thai: 0x0e50,
  lao: 0x0ed0,
  tibetan: 0x0f20,
  myanmar: 0x1040,
  myanmar_shan: 0x1090,
  khmer: 0x17e0,
  mongolian: 0x1810,
  limbu: 0x1946,
  new_tai_lue: 0x19d0,
  tai_tham_hora: 0x1a80,
  tai_tham_tham: 0x1a90,
  balinese: 0x1b50,
  sundanese: 0x1bb0,
  lepcha: 0x1c40,
  ol_chiki: 0x1c50,
  vai: 0xa620,
  saurashtra: 0xa8d0,
  kayah_li: 0xa900,
  javanese: 0xa9d0,
  myanmar_tai_laing: 0xa9f0,
  cham: 0xaa50,
  meetei_mayek: 0xabf0,
  fullwidth: 0xff10,
  osmanya: 0x104a0,
  brahmi: 0x11066,
  sora_sompeng: 0x110f0,
  chakma: 0x11136,
  sharada: 0x111d0,
  khudawadi: 0x112f0,
  newa: 0x11450,
  tirhuta: 0x114d0,
  modi: 0x11650,
  takri: 0x116c0,
  ahom: 0x11730,
  warang_citi: 0x118e0,
  bhaiksuki: 0x11c50,
  mro: 0x16a60,
  pahawh_hmong: 0x16b50,
  mathematical_bold: 0x1d7ce,
  'mathematical_double-struck': 0x1d7d8,
  'mathematical_sans-serif': 0x1d7e2,
  'mathematical_sans-serif_bold': 0x1d7ec,
  mathematical_monospace: 0x1d7f6,
  fula: 0x1e950, // adlam script in fula lang
} as const;

/**
 * A type representing the keys for supported languages with unique Unicode digit sets.
 */
export type UnicodeLangKeys = keyof typeof supportedLanguageList;

/**
 * A list of commonly used languages for digit conversion.
 * @private
 */
const commonLangList: UnicodeLangKeys[] = ['en', 'fa', 'ar'];

/**
 * A class for converting strings of digits from one Unicode numeral system to another.
 */
export class UnicodeDigits {
  /**
   * The Unicode code point for the digit '0' in the target language.
   * @protected
   */
  protected _toLangZeroCode: number;

  /**
   * A regular expression used to find and capture digits from the source languages.
   * @protected
   */
  protected _searchRegExt: RegExp;

  /**
   * A replacer function used with `String.prototype.replace` to perform the digit conversion.
   * @param _ - The matched substring (a single digit).
   * @param args - Capture groups from the regex, where the index of the non-null value corresponds to the digit's value.
   * @returns The translated digit character.
   * @protected
   */
  protected _replacer(_: string, ...args: number[]): string {
    return String.fromCharCode(this._toLangZeroCode + args.findIndex((v) => v != null));
  }

  /**
   * Constructs a new `UnicodeDigits` converter.
   *
   * @param {UnicodeLangKeys} toLanguage - The target language key to which digits will be converted.
   * @param {UnicodeLangKeys[] | 'all'} [fromLanguages=['en', 'fa', 'ar']] - A list of source languages.
   *
   * @example
   * ```ts
   * // Create a converter to translate Persian/Arabic digits to English digits.
   * const toEnglish = new UnicodeDigits('en', ['fa', 'ar']);
   * console.log(toEnglish.translate('۱۲۳۴۵')); // '12345'
   *
   * // Create a converter to translate English digits to Persian.
   * const toPersian = new UnicodeDigits('fa', ['en']);
   * console.log(toPersian.translate('Amount: 1,234.50')); // 'Amount: ۱,۲۳۴.۵۰'
   * ```
   */
  public constructor(toLanguage: UnicodeLangKeys, fromLanguages: UnicodeLangKeys[] | 'all' = [...commonLangList]) {
    if (fromLanguages === 'all') {
      fromLanguages = Object.keys(supportedLanguageList) as UnicodeLangKeys[];
    }

    const removeSelf = fromLanguages.indexOf(toLanguage);
    if (removeSelf !== -1) fromLanguages.splice(removeSelf, 1);

    this._toLangZeroCode = supportedLanguageList[toLanguage];

    const regParts: string[] = [];
    for (let n = 0; n < 10; n++) {
      const part = fromLanguages.map((langKey) => String.fromCharCode(supportedLanguageList[langKey] + n)).join('|');
      regParts.push(`(${part})`);
    }

    this._searchRegExt = new RegExp(regParts.join('|'), 'g');
    this._replacer = this._replacer.bind(this);
  }

  /**
   * Translates a string containing digits from the configured source languages to the target language.
   *
   * @param {string} str - The input string to translate.
   * @returns {string} The translated string.
   *
   * @example
   * ```ts
   * const toEnglish = new UnicodeDigits('en', 'all');
   * const mixedDigits = 'English: 123, Persian: ۱۲۳, Arabic: ١٢٣';
   * console.log(toEnglish.translate(mixedDigits));
   * // Output: English: 123, Persian: 123, Arabic: 123
   * ```
   */
  public translate(str: string): string {
    return str.trim() === '' ? str : str.replace(this._searchRegExt, this._replacer);
  }
}
