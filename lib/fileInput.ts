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

import { autoComplete } from './autoComplete.js';
import * as fs from 'fs';
import * as path from 'path';



/*
	/!\ Document that!!! /!\
*/
export const fileInput = async (options: { baseDir?: string } = {}, callback?: Function) => {
	let baseDir: string;

	if (options.baseDir) {
		baseDir = path.resolve(options.baseDir);

		if (!path.isAbsolute(baseDir)) {
			fs.realpath(options.baseDir, (error, resolvedPath) => {
				if (error) {
					if (callback) { callback(error); }
					else { throw error; }
					return;
				}

				options.baseDir = resolvedPath;

				fileInput(options).then(
					(input: any) => {
						if (callback) { callback(input); }
						else { return input; }
					},
					(error_: Error) => {
						if (callback) { callback(error_); }
						else { throw error_; }
					}
				);
			});
		}
	}
	else {
		baseDir = process.cwd();
	}

	if (baseDir[baseDir.length - 1] !== '/') { baseDir += '/'; }

	const autoCompleter = async function autoCompleter(inputString: string) {
		var inputDir, inputFile, currentDir, files, completion;

		if (inputString[inputString.length - 1] === '/') {
			inputDir = inputString;
			inputFile = '';
		}
		else {
			inputDir = path.dirname(inputString);
			inputDir = inputDir === '.' ? '' : inputDir + '/';
			inputFile = path.basename(inputString);
		}


		// If the input start with a '/', then forget about the baseDir
		if (path.isAbsolute(inputString)) { currentDir = inputDir; }
		else { currentDir = baseDir + inputDir; }


		//console.error( "### '" + inputDir +"' '"+ inputFile +"' '"+ currentDir + "'" ) ;
		try {
			files = await readdir(currentDir);
		}
		catch (error) {
			return inputString;
		}

		if (!Array.isArray(files) || !files.length) { return inputString; }

		completion = autoComplete(files, inputFile, true);

		// force inputField() to prefix that *AFTER* singleLineMenu()
		if (Array.isArray(completion)) { completion.prefix = inputDir; }
		else { completion = path.normalize(inputDir + completion); }

		return completion;
	};

	// Transmit options to inputField()
	const inputOptions = Object.assign({}, options, { autoComplete: autoCompleter, autoCompleteMenu: true, minLength: 1 });

	inputField(inputOptions).promise.then(
		(input: any) => {
			if (!input && typeof input !== 'string') {
				input = undefined;
			}
			else {
				input = path.resolve(path.isAbsolute(input) ? input : baseDir + input);
			}

			if (callback) { callback(undefined, input); }
			else { return input; }
		},
		(error: Error) => {
			if (callback) { callback(error); }
			else { throw error; }
		}
	);
};



// Like fs.readdir(), but performs fs.stat() for each file in order to add a '/' to directories
export const readdir = async (dir: string) => {

	if (dir[dir.length - 1] !== '/') { dir += '/'; }

	fs.readdir(dir, (error, files) => {

		if (error) { throw error }

		const promises: Promise<any>[] = [];
		files.forEach((file: string) => {
			const promise = new Promise((resolve, reject): any => {
				fs.lstat(dir + file, (error_, stats) => {
					if (error_) { reject(error_); return; }
					if (stats.isDirectory()) { file += '/'; }
					resolve(file);
				});
				return;
			});
			promises.push(promise);
		});

		return Promise.all(promises);
	});
}

