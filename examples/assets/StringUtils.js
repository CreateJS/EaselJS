/*
* Copyright (c) 2010 Grant Skinner
* 
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

function StringUtils() { }

/**
*	Returns everything after the first occurrence of the provided character in the string.
*
*	@param p_begin The character or sub-string.
*
*	@returns String
*/
String.prototype.afterFirst = function(p_char) {
	var idx = this.indexOf(p_char);
	if (idx == -1) { return ''; }
	idx += p_char.length;
	return this.substr(idx);
}

/**
*	Returns everything after the last occurence of the provided character in this.
*
*	@param p_char The character or sub-string.
*
*	@returns String
*/
String.prototype.afterLast = function(p_char) {
	var idx = this.lastIndexOf(p_char);
	if (idx == -1) { return ''; }
	idx += p_char.length;
	return this.substr(idx);
}

/**
*	Determines whether the specified string begins with the specified prefix.
*
*	@param p_begin The prefix that will be tested against the string.
*
*	@returns Boolean
*/
String.prototype.beginsWith = function(p_begin) {
	return this.indexOf(p_begin) == 0;
}

/**
*	Returns everything before the first occurrence of the provided character in the string.
*
*	@param p_begin The character or sub-string.
*
*	@returns String
*/
String.prototype.beforeFirst = function(p_char) {
	var idx = this.indexOf(p_char);
	if (idx == -1) { return ''; }
	return this.substr(0, idx);
}

/**
*	Returns everything before the last occurrence of the provided character in the string.
*
*	@param p_begin The character or sub-string.
*
*	@returns String
*/
String.prototype.beforeLast = function(p_char) {
	var idx = this.lastIndexOf(p_char);
	if (idx == -1) { return ''; }
	return this.substr(0, idx);
}

/**
*	Returns everything after the first occurance of p_start and before
*	the first occurrence of p_end in this.
*
*	@param p_start The character or sub-string to use as the start index.
*
*	@param p_end The character or sub-string to use as the end index.
*
*	@returns String
*/
String.prototype.between = function(p_start, p_end) {
	var str = '';
	var startIdx = this.indexOf(p_start);
	if (startIdx != -1) {
		startIdx += p_start.length; // RM: should we support multiple chars? (or ++startIdx);
		var endIdx = this.indexOf(p_end, startIdx);
		if (endIdx != -1) { str = this.substr(startIdx, endIdx-startIdx); }
	}
	return str;
}

/**
*	Capitallizes the first word in a string or all words.
*
*	@param p_all (optional) Boolean value indicating if we should
*	capitalize all words or only the first.
*
*	@returns String
*/
StringUtils.capitalize = function(str, p_all) {
	var str = StringUtils.trimLeft(str);
	if (p_all === true) { return str.replace(/^.|\s+(.)/, StringUtils._upperCase);}
	else { return str.replace(/(^\w)/, StringUtils._upperCase); }
}
String.prototype.capitalize = function() {
	return StringUtils.capitalize(this);
};


String.prototype.ljust = function(p_width, p_pad) {
	if (p_pad == null) { p_pad = ' '; }
	var pad = p_pad.substr(0, 1);
	if (this.length < p_width) {
		return this + this.repeat(p_width - this.length, pad);
	} else { return this; }
}

String.prototype.rjust = function(p_width, p_pad) {
	if (p_pad == null) { p_pad = ' '; }
	var pad = p_pad.substr(0, 1);
	if (this.length < p_width) {
		return this.repeat(p_width - this.length, pad) + this;
	} else { return this; }
}

String.prototype.center = function(p_width, p_pad) {
	if (p_pad == null) { p_pad = ' '; }
	
	var pad = p_pad.substr(0,1);
	
	if (this.length < p_width) {
		var len = p_width - this.length;
		var rem = (len % 2 == 0) ? '' : pad;
		var pads = this.repeat(Math.round(len/2), pad);
		return pads + this + pads + rem;
	} else { return this; }
	
}

String.prototype.repeat = function(p_count, p_string) {
	if  (isNaN(p_count)) { p_count = 1; }
	var s = '';
	while (p_count--) {	s += p_string || this;	}
	return s;
}

String.prototype.base64Encode = function() {
	var out = '';
	var i = 0;
	var len = this.length;
	var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	
	while (i < len) {
		var c1 = this.charCodeAt(i++) & 0xff;
		if (i == len) {
			out += b64.charAt(c1>>2)
				+ b64.charAt((c1 & 0x3) << 4)
				+ '==';
			break;
		}
		var c2 = this.charCodeAt(i++);
		if (i == len) {
			out += b64.charAt(c1 >> 2)
				+ b64.charAt(((c1&0x3) << 4) | ((c2&0xF0) >> 4))
				+ '=';
			break;
		}
		var c3 = this.charCodeAt(i++);
		out += b64.charAt(c1>>2)
			+ b64.charAt(((c1&0x3) << 4) | ((c2&0xF0) >> 4))
			+ b64.charAt(((c2 & 0xF) << 2) | ((c3&0xC0) >> 6))
			+ b64.charAt(c3 & 0x3F);
	}
	return out;
}

/**
*	Determines whether the specified string contains any instances of p_char.
*
*	@param p_char The character or sub-string we are looking for.
*
*	@returns Boolean
*/
String.prototype.contains = function(p_char) {
	return this.indexOf(p_char) != -1;
}


/**
*	Levenshtein distance (editDistance) is a measure of the similarity between two strings,
*	The distance is the number of deletions, insertions, or substitutions required to
*	transform p_source into p_target.
*
*	@param p_source The source string.
*
*	@param p_target The target string.
*
*	@returns uint
*/
StringUtils.editDistance = function(p_source, p_target) {
	if (p_source == null) { p_source = ''; }
	if (p_target == null) { p_target = ''; }

	if (p_source == p_target) { return 0; }

	var d = [];
	var cost;
	var n = p_source.length;
	var m = p_target.length;

	if (n == 0) { return m; }
	if (m == 0) { return n; }

	for (var a=0; a<=n; a++) { d[a] = []; }
	for (var b=0; b<=n; b++) { d[b][0] = b; }
	for (var c=0; c<=m; c++) { d[0][c] = c; }

	for (var i=1; i<=n; i++) {

		var s_i = p_source.charAt(i-1);
		for (var j=1; j<=m; j++) {

			var t_j = p_target.charAt(j-1);

			if (s_i == t_j) { cost = 0; }
			else { cost = 1; }

			d[i][j] = Math.min(d[i-1][j]+1, d[i][j-1]+1, d[i-1][j-1]+cost);
		}
	}
	return d[n][m];
}
String.prototype.editDistance = function(p_target) {
	return StringUtils.editDistance(this, p_target);
}

/**
*	Determines whether the specified string ends with the specified suffix.
*
*	@param p_end The suffix that will be tested against the string.
*
*	@returns Boolean
*/
String.prototype.endsWith = function(p_end) {
	return new RegExp(p_end+"$").test(this);
}

/**
*	Determines whether the specified string contains text.
*
*	@returns Boolean
*/
String.prototype.hasText = function() {
	var str = this.removeExtraWhitespace();
	return !!str.length;
}

/**
*	Determines whether the specified string contains any characters.
*
*	@returns Boolean
*/
String.prototype.isEmpty = function() {
	return !this.length;
}

/**
*	Determines whether the specified string is numeric.
*
*	@returns Boolean
*/
String.prototype.isNumeric = function() {
	var regx = /^[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?$/;
	return regx.test(this);
}

/**
* Pads this with specified character to a specified length from the left.
*
*	@param p_padChar Character for pad.
*
*	@param p_length Length to pad to.
*
*	@returns String
*/
String.prototype.padLeft = function(p_padChar, p_length) {
	var s = this;
	while (s.length < p_length) { s = p_padChar + s; }
	return s;
}

/**
* Pads this with specified character to a specified length from the right.
*
*	@param p_padChar Character for pad.
*
*	@param p_length Length to pad to.
*
*	@returns String
*/
String.prototype.padRight = function(p_padChar, p_length) {
	var s = this;
	while (s.length < p_length) { s += p_padChar; }
	return s;
}

/**
*	Properly cases' the string in "sentence format".
*
*	@returns String.
*/
String.prototype.properCase = function() {
	var str = this.toLowerCase().replace(/\b([^.?;!]+)/, StringUtils.capitalize);
	return str.replace(/\b[i]\b/, "I");
}

String.prototype.quote = function() {
	var regx = /[\\"\r\n]/g;
	return '"'+ this.replace(regx, this._quote) +'"';
}

/**
*	Removes all instances of the remove string in the input string.
*
*	@param p_remove The string that will be removed from the input string.
*
*	@param p_caseSensitive An optional boolean indicating if the replace is case sensitive. Default is true.
*
*	@returns String
*/
String.prototype.remove = function(p_remove, p_caseSensitive) {
	if (p_caseSensitive === null) { p_caseSensitive = true; }
	var rem = StringUtils.escapePattern(p_remove);
	var flags = (!p_caseSensitive) ? 'ig' : 'g';
	return this.replace(new RegExp(rem, flags), '');
}

/**
*	Removes extraneous whitespace (extra spaces, tabs, line breaks, etc) from the
*	specified string.
*
*	@returns String
*/
String.prototype.removeExtraWhitespace = function() {
	var str = this.trim(this);
	return str.replace(/\s+/g, ' ');
}

/**
*	Returns the specified string in reverse character order.

*
*	@returns String
*/
String.prototype.reverse = function() {
	return this.split('').reverse().join('');
}

/**
*	Returns the specified string in reverse word order.
*
*	@returns String
*/
String.prototype.reverseWords = function() {
	return this.split(/\s+/).reverse().join(' ');
}

/**
*	Determines the percentage of similiarity, based on editDistance
*
*	@param p_target The target string.
*
*	@returns Number
*/
String.prototype.similarity = function(p_target) {
	var ed = StringUtils.editDistance(this, p_target);
	var maxLen = Math.max(this.length, p_target.length);
	if (maxLen == 0) { return 1; }
	else { return (1 - ed/maxLen); }
}

/**
*	Remove's all html tags from a string
*
*	@returns String
*/
String.prototype.stripTags = function() {
	return this.replace(/<\/?[^>]+>/igm, '');
}

/**
 *	Replaces instances of the form {digit} or {name} in string with corresponding arguments or values.
 *
 * @param string0..stringN     Strings or
 * @param object               Object
 * @return String
 */
String.prototype.supplant = function() {
	var str = this;
	if(arguments[0] instanceof Object) {
		for (var n in arguments[0]) {
			str = str.replace(new RegExp('\\{'+n+'\\}', 'g'), arguments[0][n]);
		}
	} else {
		var l = arguments.length;
		for (var i=0; i<l; i++) {
			str = str.replace(new RegExp('\\{'+i+'\\}', 'g'), arguments[i]);
		}
	}
	return str;
}

/**
*	Swaps the casing of a string.
*
*	@returns String
*/
String.prototype.swapCase = function() {
	return this.replace(/(\w)/, StringUtils._swapCase);
}

/**
*	Removes whitespace from the front and the end of the specified
*	string.
*
*	@returns String
*/
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, '');
}

/**
*	Removes whitespace from the front (left-side) of the specified string.
*
*	@returns String
*/
StringUtils.trimLeft = function(str) {
	return str.replace(/^\s+/, '');
}

String.prototype.trimLeft = function() {
	return StringUtils.trimLeft(this);
}

/**
*	Removes whitespace from the end (right-side) of the specified string.
*
*	@returns String
*/
StringUtils.trimRight = function(str) {
	return str.replace(/\s+$/, '');
}
String.prototype.trimRight = function () {
	return StringUtils.trimLeft(this);
}

/**
*	Returns a string truncated to a specified length with optional suffix
*
*	@param p_len The length the string should be shortend to
*
*	@param p_suffix (optional, default=...) The string to append to the end of the truncated string.
*
*	@returns String
*/
String.prototype.truncate = function(p_len, p_suffix) {
	if (p_suffix == null) { p_suffix = '...'; }
	if (p_len == 0) { p_len = this.length; }
	p_len -= p_suffix.length;
	var trunc = this;
	if (trunc.length > p_len) {
		trunc = trunc.substr(0, p_len);
		if (/[^\s]/.test(trunc.charAt(p_len))) {
			trunc = StringUtils.trimRight(trunc.replace(/\w+$|\s+$/, ''));
		}
		trunc += p_suffix;
	}
	
	return trunc;
}

/**
*	Determins the number of words in a string.
*
*	@returns uint
*/
String.prototype.wordCount = function() {
	return this.match(/\b\w+\b/g).length;
}

String.prototype.countOf = function(p_char, p_caseSensitive) {
    p_caseSensitive = p_caseSensitive === true;
    var c = StringUtils.escapePattern(p_char);
    var flags = (!p_caseSensitive) ? 'ig' : 'g';
    var match = this.match(new RegExp(c, flags));
    return match==null?0:match.length;
}

/* **************************************************************** */
/*	These are helper methods used by some of the above methods.		*/
/* **************************************************************** */
StringUtils.escapePattern = function(p_pattern) {
	// RM: might expose this one, I've used it a few times already.
	return p_pattern.replace(/(\]|\[|\{|\}|\(|\)|\*|\+|\?|\.|\\)/g, '\\$1');
}

StringUtils.prototype._quote = function() {
	switch (this) {
		case "\\":
			return "\\\\";
		case "\r":
			return "\\r";
		case "\n":
			return "\\n";
		case '"':
			return '\\"';
	}
	return null;
}

StringUtils._upperCase = function(p_char) {
	return p_char.toUpperCase();
}

StringUtils._swapCase =  function(p_char) {
	var lowChar = p_char.toLowerCase();
	var upChar = p_char.toUpperCase();
	switch (p_char) {
		case lowChar:
			return upChar;
		case upChar:
			return lowChar;
		default:
			return p_char;
	}
}