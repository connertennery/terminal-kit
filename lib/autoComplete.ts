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
/*
	Ideally, this should be done using a graph algorithm, but we will just brute-force it for instance...
*/

export const autoComplete = (array: string[], startString: string, returnAlternatives: boolean, prefix: string, postfix: string) => {
	let completed = startString;
	let hasCompleted = false;
	let candidate: string[] & { prefix?: string, postfix?: string } = [];

	if (!prefix) { prefix = ''; }
	if (!postfix) { postfix = ''; }

	for (let i = 0; i < array.length; i++) {
		if (array[i].slice(0, startString.length) === startString) { candidate.push(array[i]); }
	}

	if (!candidate.length) {
		return prefix + completed + postfix;
	}

	if (candidate.length === 1) {
		return prefix + candidate[0] + postfix;
	}

	// Multiple candidate, complete only the part they have in common
	let exitLoop = false;
	for (let startLength = startString.length; startLength < candidate[0].length; startLength++) {
		for (let i = 1; i < candidate.length; i++) {
			if (candidate[i][startLength] !== candidate[0][startLength]) { exitLoop = true; break; }
		}

		if (exitLoop) { break; }

		completed += candidate[0][startLength];
		hasCompleted = true;
	}

	if (returnAlternatives && !hasCompleted) {
		candidate.prefix = prefix;
		candidate.postfix = postfix;
		return candidate;
	}

	return prefix + completed + postfix;
};

