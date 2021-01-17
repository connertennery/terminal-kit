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

require('./patches.js');
import { exec, execFile } from 'child_process';
const spawn = require('child_process').spawn;

const XCLIP_SELECTION_ARG = {
	c: 'clipboard',
	p: 'primary',
	s: 'secondary'
};

const throwNoClipboard = () => { throw new Error('No clipboard manipulation program found') };

export const getClipboard = async (source: 'c' | 'p' | 's') => {
	if (!(process.platform === 'linux')) throwNoClipboard();

	var arg = XCLIP_SELECTION_ARG[source] || 'clipboard';
	return await execFile('xclip', ['-o', '-selection', arg]);
};

exports.setClipboard = async (str: string, source: 'c' | 'p' | 's') => {
	if (!(process.platform === 'linux')) throwNoClipboard();

	var arg = XCLIP_SELECTION_ARG[source] || 'clipboard';
	var xclip = spawn('xclip', ['-i', '-selection', arg]);

	xclip.on('error', (error: Error) => {
		throw error;
	});

	xclip.on('exit', (code: number) => {
		if (code !== 0) {
			throw code;
		}
		else {
			return;
		}
	});

	// Send the string to push to the clipboard
	xclip.stdin.end(str);
};

