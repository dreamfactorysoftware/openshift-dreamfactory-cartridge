/*!
 * This file is part of the DreamFactory Services Platform(tm) (DSP)
 *
 * DreamFactory Services Platform(tm) <http://github.com/dreamfactorysoftware/dsp-core>
 * Copyright 2012-2014 DreamFactory Software, Inc. <support@dreamfactory.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Example custom script with math functions and an API call
 */

/**
 * Adds a to b
 * @param {number} a
 * @param {number} b
 * @returns {*}
 * @private
 */
var _add = function(a, b) {
	var _result = a + b;

	print('a + b = ' + _result + '\n');

	return _result;
};

/**
 * Subtracts b from a
 * @param {number} a
 * @param {number} b
 * @returns {number}
 * @private
 */
var _sub = function(a, b) {
	var _result = a - b;

	print('a - b = ' + _result + '\n');

	return _result;
};

/**
 * increment a by 1
 * @param {number} a
 * @returns {number}
 * @private
 */
var _incr = function(a) {
	var _result = a + 1;

	print('increment a (' + a + '): ' + _result + '\n');

	return _result;
};

/**
 * Decrement a by 1
 * @param {number} a
 * @returns {number}
 * @private
 */
var _decr = function(a) {
	var _result = a - 1;

	print('decrement a (' + a + '): ' + _result + '\n');

	return _result;
};

//	Test variables
/** @var {number} _a */
var _a = 10;
/** @var {number} _b */
var _b = 5;

//	This will trigger any event scripts
var _rows = platform.api.get('db/todo');

if (!_rows || !_rows.length) {
	print('The "todo" table has no data.\n');
} else {
	print('The "todo" table has ' + _rows.length + ' row(s)\n');
}

/** Run through the test functions. */
return {'a': _a, 'b': _b, 'add': _add(_a, _b), 'sub': _sub(_a, _b), 'incr': _incr(_a), 'decr': _decr(_a), 'todo_rows': _rows.length || 0};
