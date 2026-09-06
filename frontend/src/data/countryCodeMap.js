// ISO 3166-1 numeric → alpha-2 code mapping (subset for world map)
// Used to link TopoJSON country IDs to our COUNTRIES data.
export const NUMERIC_TO_ALPHA2 = {
  4: 'AF', 8: 'AL', 12: 'DZ', 24: 'AO', 32: 'AR', 36: 'AU', 40: 'AT',
  50: 'BD', 56: 'BE', 64: 'BT', 68: 'BO', 76: 'BR', 100: 'BG', 104: 'MM',
  116: 'KH', 120: 'CM', 124: 'CA', 140: 'CF', 144: 'LK', 152: 'CL',
  156: 'CN', 170: 'CO', 178: 'CG', 180: 'CD', 188: 'CR', 191: 'HR',
  192: 'CU', 196: 'CY', 203: 'CZ', 208: 'DK', 214: 'DO', 218: 'EC',
  818: 'EG', 222: 'SV', 231: 'ET', 246: 'FI', 250: 'FR', 266: 'GA',
  288: 'GH', 300: 'GR', 320: 'GT', 332: 'HT', 340: 'HN', 348: 'HU',
  356: 'IN', 360: 'ID', 364: 'IR', 368: 'IQ', 372: 'IE', 376: 'IL',
  380: 'IT', 388: 'JM', 392: 'JP', 400: 'JO', 398: 'KZ', 404: 'KE',
  408: 'KP', 410: 'KR', 414: 'KW', 422: 'LB', 430: 'LR', 434: 'LY',
  484: 'MX', 458: 'MY', 466: 'ML', 504: 'MA', 508: 'MZ', 516: 'NA',
  524: 'NP', 528: 'NL', 554: 'NZ', 558: 'NI', 562: 'NE', 566: 'NG',
  578: 'NO', 586: 'PK', 591: 'PA', 598: 'PG', 600: 'PY', 604: 'PE',
  608: 'PH', 616: 'PL', 620: 'PT', 630: 'PR', 634: 'QA', 642: 'RO',
  643: 'RU', 646: 'RW', 682: 'SA', 686: 'SN', 694: 'SL', 706: 'SO',
  710: 'ZA', 728: 'SS', 724: 'ES', 729: 'SD', 756: 'CH', 760: 'SY',
  762: 'TJ', 764: 'TH', 788: 'TN', 792: 'TR', 800: 'UG', 804: 'UA',
  784: 'AE', 826: 'GB', 840: 'US', 858: 'UY', 860: 'UZ', 862: 'VE',
  704: 'VN', 887: 'YE', 894: 'ZM', 716: 'ZW', 232: 'ER', 702: 'SG',
  340: 'HN', 152: 'CL', 276: 'DE', 616: 'PL', 232: 'ER', 270: 'GM',
  234: 'FO', 260: 'TF', 175: 'YT', 638: 'RE', 654: 'SH', 84: 'BZ',
  90: 'SB', 96: 'BN', 132: 'CV', 148: 'TD', 174: 'KM', 184: 'CK',
  242: 'FJ', 238: 'FK', 258: 'PF', 288: 'GH', 308: 'GD', 312: 'GP',
  316: 'GU', 324: 'GN', 328: 'GY', 334: 'HM', 352: 'IS', 384: 'CI',
  418: 'LA', 426: 'LS', 442: 'LU', 450: 'MG', 454: 'MW', 462: 'MV',
  478: 'MR', 480: 'MU', 496: 'MN', 498: 'MD', 496: 'MN', 690: 'SC',
  740: 'SR', 768: 'TG', 776: 'TO', 780: 'TT', 798: 'TV', 807: 'MK',
};

// Quick reverse lookup: alpha2 → numeric
export const ALPHA2_TO_NUMERIC = Object.fromEntries(
  Object.entries(NUMERIC_TO_ALPHA2).map(([num, a2]) => [a2, Number(num)])
);
