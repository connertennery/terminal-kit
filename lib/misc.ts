/*
	Terminal Kit

	Copyright (c) 2009 - 2021 Cédric Ronvel

	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

"use strict";



const stringKit = require('string-kit');


enum colorNameToIndexDict {
	// ANSI
	black = 0,
	red = 1,
	green = 2,
	yellow = 3,
	blue = 4,
	magenta = 5,
	violet = 5,
	cyan = 6,
	white = 7,
	grey = 8,
	gray = 8,
	brightblack = 8,
	brightred = 9,
	brightgreen = 10,
	brightyellow = 11,
	brightblue = 12,
	brightmagenta = 13,
	brightviolet = 13,
	brightcyan = 14,
	brightwhite = 15
};

type colorStrings = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'violet' | 'cyan' | 'white' | 'grey' | 'gray' | 'brightblack' | 'brightred' | 'brightgreen' | 'brightyellow' | 'brightblue' | 'brightmagenta' | 'brightviolet' | 'brightcyan' | 'brightwhite'

/**
 * Color name to index
 * @param color Name of the color
 */
export const colorNameToIndex = (color: colorStrings) => {
	switch (color) {
		case 'black':
			return colorNameToIndexDict.black;
		case 'red':
			return colorNameToIndexDict.red;
		case 'green':
			return colorNameToIndexDict.green;
		case 'yellow':
			return colorNameToIndexDict.yellow;
		case 'blue':
			return colorNameToIndexDict.blue;
		case 'magenta':
			return colorNameToIndexDict.magenta;
		case 'violet':
			return colorNameToIndexDict.violet;
		case 'cyan':
			return colorNameToIndexDict.cyan;
		case 'white':
			return colorNameToIndexDict.white;
		case 'grey':
			return colorNameToIndexDict.grey;
		case 'gray':
			return colorNameToIndexDict.gray;
		case 'brightblack':
			return colorNameToIndexDict.brightblack;
		case 'brightred':
			return colorNameToIndexDict.brightred;
		case 'brightgreen':
			return colorNameToIndexDict.brightgreen;
		case 'brightyellow':
			return colorNameToIndexDict.brightyellow;
		case 'brightblue':
			return colorNameToIndexDict.brightblue;
		case 'brightmagenta':
			return colorNameToIndexDict.brightmagenta;
		case 'brightviolet':
			return colorNameToIndexDict.brightviolet;
		case 'brightcyan':
			return colorNameToIndexDict.brightcyan;
		case 'brightwhite':
			return colorNameToIndexDict.brightwhite;
	}
}



const indexToColorNameArray = [
	"black", "red", "green", "yellow", "blue", "magenta", "cyan", "white",
	"gray", "brightRed", "brightGreen", "brightYellow", "brightBlue", "brightMagenta", "brightCyan", "brightWhite"
];

/**
 * Converts index to a color name
 * @param index Index of the color
 */
export const indexToColorName = (index: number) => indexToColorNameArray[index];

/**
 * Converts a hex color string to RGBA
 * @param hex Color in hex format
 */
export const hexToRgba = (hex: string) => {
	// Strip the # if necessary
	if (hex[0] === '#') { hex = hex.slice(1); }

	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}

	return {
		r: parseInt(hex.slice(0, 2), 16),
		g: parseInt(hex.slice(2, 4), 16),
		b: parseInt(hex.slice(4, 6), 16),
		a: hex.length > 6 ? parseInt(hex.slice(6, 8), 16) : 255
	};
};



/**
 * @deprecated
 */
export const color2index = colorNameToIndex;
/**
 * @deprecated
 */
export const index2color = indexToColorName;
/**
 * @deprecated
 */
export const hexToColor = hexToRgba;

/**
 * Strip all control chars, if newline is true, only newline control chars are preserved
 * @param str
 * @param newline
 */
export const stripControlChars = (str: string, newline: boolean) => {
	if (newline) { return str.replace(/[\x00-\x09\x0b-\x1f\x7f]/g, ''); }
	return str.replace(/[\x00-\x1f\x7f]/g, '');
};



// From https://stackoverflow.com/questions/25245716/remove-all-ansi-colors-styles-from-strings
const escapeSequenceRegex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
const escapeSequenceParserRegex = /([\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><])|([^\u001b\u009b]+)/g;


/**
 *
 */
export const stripEscapeSequences = (str: string) => str.replace(escapeSequenceRegex, '');




/**
 * Return the real width of the string (i.e. as displayed in the terminal)
 * @param str
 */
export const stringWidth = (str: string) => {
	var matches, width = 0;

	// Reset
	escapeSequenceParserRegex.lastIndex = 0;

	while ((matches = escapeSequenceParserRegex.exec(str))) {
		if (matches[2]) {
			width += string.unicode.width(matches[2]);
		}
	}

	return width;
};

export const ansiWidth = stringWidth;


// Userland may use this, it is more efficient than .truncateString() + .stringWidth(),
// and BTW even more than testing .stringWidth() then .truncateString() + .stringWidth()
var lastTruncateWidth = 0;
export const getLastTruncateWidth = () => lastTruncateWidth;

/**
 * Truncate a string to a given real width
 */
export const truncateString = (str: string, maxWidth: number) => {
	var matches, width = 0;

	lastTruncateWidth = 0;

	// Reset
	escapeSequenceParserRegex.lastIndex = 0;

	while ((matches = escapeSequenceParserRegex.exec(str))) {
		if (matches[2]) {
			width += string.unicode.width(matches[2]);

			if (width >= maxWidth) {
				if (width === maxWidth) {
					return str.slice(0, matches.index + matches[2].length);
				}

				return str.slice(0, matches.index) + string.unicode.truncateWidth(matches[2], maxWidth - lastTruncateWidth);
			}

			lastTruncateWidth = width;
		}
	}

	return str;
};
export const truncateAnsiString = truncateString;


/**
 * width of a string with a markup, without control chars
 * @param str
 */
export const markupWidth = (str: string) => {
	return string.unicode.width(str.replace(/\^\[[^\]]*]|\^(.)/g, (match, second) => {
		if (second === ' ' || second === '^') {
			return second;
		}

		return '';
	}));
};


/**
 * Truncate a string to a given real width, the string may contains markup, but no control chars
 * @param str
 * @param maxWidth
 */
misc.truncateMarkupString = (str: string, maxWidth: number) => {
	var index = 0, charWidth,
		strArray = string.unicode.toArray(str);

	lastTruncateWidth = 0;

	while (index < strArray.length) {
		if (strArray[index] === '^') {
			index++;

			if (strArray[index] === '[') {
				while (index < strArray.length && strArray[index] !== ']') { index++; }
				index++;
				continue;
			}

			if (strArray[index] !== ' ' && strArray[index] !== '^') {
				index++;
				continue;
			}
		}

		charWidth = string.unicode.isFullWidth(strArray[index]) ? 2 : 1;

		if (lastTruncateWidth + charWidth > maxWidth) {
			strArray.length = index;
			return strArray.join('');
		}

		lastTruncateWidth += charWidth;
		index++;
	}

	return str;
};


// TODO: many issues remaining
/**
 * Function used for sequenceSkip option of string-kit's .wordwrap()
 * @param strArray
 * @param index
 */
export const escapeSequenceSkipFn = (strArray: string[], index: number) => {
	//console.error( '>>> Entering' ) ;
	var code;

	if (strArray[index] !== '\x1b') { return index; }
	index++;
	if (strArray[index] !== '[') { return index; }
	index++;

	for (; index < strArray.length; index++) {
		code = strArray[index].charCodeAt(0);
		//console.error( 'code:' , strArray[ index ] , code.toString( 16 ) ) ;

		if ((code >= 0x41 && code <= 0x5a) || (code >= 0x61 && code <= 0x7a)) {
			//console.error( "<<< break!" ) ;
			index++;
			break;
		}
	}

	return index;
};

/**
 *
 * @param str
 * @param width
 */
export const wordWrapAnsi = (str: string, width: number) => stringKit.wordwrap(str, {
	width: width,
	noJoin: true,
	fill: true,
	regroupFn: (strArray: string[]) => {
		var sequence = '',
			csi = false,
			newStrArray: string[] = [];

		strArray.forEach(char => {
			var charCode;

			if (csi) {
				sequence += char;
				charCode = char.charCodeAt(0);

				if ((charCode >= 0x41 && charCode <= 0x5a) || (charCode >= 0x61 && charCode <= 0x7a)) {
					newStrArray.push(sequence);
					sequence = '';
					csi = false;
				}
			}
			else if (sequence) {
				sequence += char;

				if (char === '[') {
					csi = true;
				}
				else {
					newStrArray.push(sequence);
					sequence = '';
				}
			}
			else if (char === '\x1b') {
				sequence = char;
			}
			else {
				newStrArray.push(char);
			}
		});

		return newStrArray;
	},
	charWidthFn: (char: string) => {
		if (char[0] === '\x1b') { return 0; }
		return string.unicode.charWidth(char);
	}
});



export const wordWrapMarkup = (str: string, width: number) => string.wordwrap(str, {
	width: width,
	noJoin: true,
	fill: true,
	regroupFn: (strArray: string[]) => {
		var markup = '',
			complexMarkup = false,
			newStrArray: string[] = [];

		strArray.forEach(char => {
			if (complexMarkup) {
				markup += char;

				if (char === ']') {
					newStrArray.push(markup);
					markup = '';
					complexMarkup = false;
				}
			}
			else if (markup) {
				markup += char;

				if (char === '[') {
					complexMarkup = true;
				}
				else {
					newStrArray.push(markup);
					markup = '';
				}
			}
			else if (char === '^') {
				markup = char;
			}
			else {
				newStrArray.push(char);
			}
		});

		return newStrArray;
	},
	charWidthFn: (char: string) => {
		if (char[0] === '^' && char[1]) {
			if (char[1] === '^' || char[1] === ' ') { return 1; }
			return 0;
		}

		return string.unicode.charWidth(char);
	}
});



misc.preserveMarkupFormat = string.createFormatter({
	argumentSanitizer: (str: string) => str.replace(/[\x00-\x1f\x7f^]/g, char => char === '^' ? '^^' : ''),
	noMarkup: true
});


/**
 * @deprecated
 */
export const wordwrapMarkup = wordWrapMarkup;

export const markupOptions = {
	complexMarkupAliases: {
		c: 'color',
		fg: 'color',
		bg: 'bgColor'
	},
	shiftMarkup: {
		'#': 'background'
	},
	markup: {
		':': { reset: true },
		' ': { reset: true, raw: ' ' },
		';': { reset: true, special: true },		// "Special reset" can reset forced attr (Document-model)

		'-': { dim: true },
		'+': { bold: true },
		'_': { underline: true },
		'/': { italic: true },
		'!': { inverse: true },

		'k': { color: 0 },
		'r': { color: 1 },
		'g': { color: 2 },
		'y': { color: 3 },
		'b': { color: 4 },
		'm': { color: 5 },
		'c': { color: 6 },
		'w': { color: 7 },
		'K': { color: 8 },
		'R': { color: 9 },
		'G': { color: 10 },
		'Y': { color: 11 },
		'B': { color: 12 },
		'M': { color: 13 },
		'C': { color: 14 },
		'W': { color: 15 }
	},
	shiftedMarkup: {
		background: {
			':': { reset: true, defaultColor: true, bgDefaultColor: true },
			' ': {
				reset: true, defaultColor: true, bgDefaultColor: true, raw: ' '
			},
			';': {
				reset: true, special: true, defaultColor: true, bgDefaultColor: true
			},

			'k': { bgColor: 0 },
			'r': { bgColor: 1 },
			'g': { bgColor: 2 },
			'y': { bgColor: 3 },
			'b': { bgColor: 4 },
			'm': { bgColor: 5 },
			'c': { bgColor: 6 },
			'w': { bgColor: 7 },
			'K': { bgColor: 8 },
			'R': { bgColor: 9 },
			'G': { bgColor: 10 },
			'Y': { bgColor: 11 },
			'B': { bgColor: 12 },
			'M': { bgColor: 13 },
			'C': { bgColor: 14 },
			'W': { bgColor: 15 }
		}
	}
};



// /!\ Should be moved to string-kit once finished /!\
const parseMarkupRegexp = /\^\[([^\]]*)]|\^(.)|([^^]+)/g;

export const parseMarkup = (str: string, options: any) => {
	var complex, markup, raw, match,
		base = options.markup,
		output = [];

	parseMarkupRegexp.lastIndex = 0;

	while ((match = parseMarkupRegexp.exec(str))) {
		[, complex, markup, raw] = match;

		if (complex) {
			let custom: { [key: string]: string | boolean } = {};
			complex.split(',').forEach(part => {
				var [k, v] = part.split(':');
				if (options.complexMarkupAliases[k]) { k = options.complexMarkupAliases[k]; }
				custom[k] = v || true;
			});

			output.push({ markup: custom });
		}
		else if (raw) { output.push(raw); }
		else if (markup === '^') { output.push('^'); }
		else if (options.shiftMarkup[markup]) { base = options.shiftedMarkup[options.shiftMarkup[markup]]; continue; }
		else if (base[markup]) { output.push({ markup: base[markup] }); }

		base = options.markup;
	}

	return output;
};


type ANSI_CODES_KEYS = '0' | '1' | '2' | '22' | '3' | '23' | '4' | '24' | '5' | '25' | '7' | '27' | '8' | '28' | '9' | '29' | '30' | '31' | '32' | '33' | '34' | '35' | '36' | '37' | '39' | '90' | '91' | '92' | '93' | '94' | '95' | '96' | '97' | '40' | '41' | '42' | '43' | '44' | '45' | '46' | '47' | '49' | '100' | '101' | '102' | '103' | '104' | '105' | '106' | '107'

const getANSI_CODES = (code: string) => {
	switch (code) {
		case '0':
			return { reset: true };
		case '1':
			return { bold: true };
		case '2':
			return { dim: true };
		case '22':
			return { bold: false, dim: false };
		case '3':
			return { italic: true };
		case '23':
			return { italic: false };
		case '4':
			return { underline: true };
		case '24':
			return { underline: false };
		case '5':
			return { blink: true };
		case '25':
			return { blink: false };
		case '7':
			return { inverse: true };
		case '27':
			return { inverse: false };
		case '8':
			return { hidden: true };
		case '28':
			return { hidden: false };
		case '9':
			return { strike: true };
		case '29':
			return { strike: false };
		case '30':
			return { color: 0 };
		case '31':
			return { color: 1 };
		case '32':
			return { color: 2 };
		case '33':
			return { color: 3 };
		case '34':
			return { color: 4 };
		case '35':
			return { color: 5 };
		case '36':
			return { color: 6 };
		case '37':
			return { color: 7 };
		case '39':
			return { defaultColor: true };
		case '90':
			return { color: 8 };
		case '91':
			return { color: 9 };
		case '92':
			return { color: 10 };
		case '93':
			return { color: 11 };
		case '94':
			return { color: 12 };
		case '95':
			return { color: 13 };
		case '96':
			return { color: 14 };
		case '97':
			return { color: 15 };
		case '40':
			return { bgColor: 0 };
		case '41':
			return { bgColor: 1 };
		case '42':
			return { bgColor: 2 };
		case '43':
			return { bgColor: 3 };
		case '44':
			return { bgColor: 4 };
		case '45':
			return { bgColor: 5 };
		case '46':
			return { bgColor: 6 };
		case '47':
			return { bgColor: 7 };
		case '49':
			return { bgDefaultColor: true };
		case '100':
			return { bgColor: 8 };
		case '101':
			return { bgColor: 9 };
		case '102':
			return { bgColor: 10 };
		case '103':
			return { bgColor: 11 };
		case '104':
			return { bgColor: 12 };
		case '105':
			return { bgColor: 13 };
		case '106':
			return { bgColor: 14 };
		case '107':
			return { bgColor: 15 };
		default:
			throw Error('Supplied bad ANSI_CODE');
	}
};



// /!\ Should be moved to string-kit once finished /!\
const parseAnsiRegexp = /\x1b\[([0-9;]+)m|(.[^\x1b]+)/g;

export const parseAnsi = (str: string) => {
	var match, ansiCodes, raw, output = [];

	// const keys = Object.keys(ANSI_CODES);

	parseAnsiRegexp.lastIndex = 0;

	while ((match = parseAnsiRegexp.exec(str))) {
		[, ansiCodes, raw] = match;

		if (raw) { output.push(raw); }
		else {
			ansiCodes.split(/;/g).forEach((ansiCode: string) => {
				output.push({ markup: getANSI_CODES(ansiCode) });
			});
		}
	}

	return output;
};


