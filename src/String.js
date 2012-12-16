// @requires Tian.js

//=============================================================
// Namespace: Tian.String
// Contains convenience functions for string manipulation.
//-------------------------------------------------------------

Tian.String = {

    /**
     * APIFunction: startsWith
     * Test whether a string starts with another string. 
     * 
     * Parameters:
     * str - {String} The string to test.
     * sub - {String} The substring to look for.
     *  
     * Returns:
     * {Boolean} The first string starts with the second.
     */
    startsWith: function(str, sub) {
        return (str.indexOf(sub) == 0);
    },

    /**
     * APIFunction: contains
     * Test whether a string contains another string.
     * 
     * Parameters:
     * str - {String} The string to test.
     * sub - {String} The substring to look for.
     * 
     * Returns:
     * {Boolean} The first string contains the second.
     */
    contains: function(str, sub) {
        return (str.indexOf(sub) != -1);
    },
    
    /**
     * APIFunction: trim
     * Removes leading and trailing whitespace characters from a string.
     * 
     * Parameters:
     * str - {String} The (potentially) space padded string.  This string is not
     *     modified.
     * 
     * Returns:
     * {String} A trimmed version of the string with all leading and 
     *     trailing spaces removed.
     */
    trim: function(str) {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    },
    
    /**
     * APIFunction: camelize
     * Camel-case a hyphenated string. 
     *     Ex. "chicken-head" becomes "chickenHead", and
     *     "-chicken-head" becomes "ChickenHead".
     *
     * Parameters:
     * str - {String} The string to be camelized.  The original is not modified.
     * 
     * Returns:
     * {String} The string, camelized
     */
    camelize: function(str) {
        var oStringList = str.split('-');
        var camelizedString = oStringList[0];
        for (var i=1, len=oStringList.length; i<len; i++) {
            var s = oStringList[i];
            camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
        }
        return camelizedString;
    },
    
    /**
     * APIFunction: format
     * Given a string with tokens in the form ${token}, return a string
     *     with tokens replaced with properties from the given context
     *     object.  Represent a literal "${" by doubling it, e.g. "${${".
     *
     * Parameters:
     * template - {String} A string with tokens to be replaced.  A template
     *     has the form "literal ${token}" where the token will be replaced
     *     by the value of context["token"].
     * context - {Object} An optional object with properties corresponding
     *     to the tokens in the format string.  If no context is sent, the
     *     window object will be used.
     * args - {Array} Optional arguments to pass to any functions found in
     *     the context.  If a context property is a function, the token
     *     will be replaced by the return from the function called with
     *     these arguments.
     *
     * Returns:
     * {String} A string with tokens replaced from the context object.
     */
    format: function(template, context, args) {
        context = context || window;
        
        /**
        * tokenRegEx
        * Used to find tokens in a string.
        * Examples: ${a}, ${a.b.c}, ${a-b}, ${5}
        */
        var tokenRegEx = /\$\{([\w.]+?)\}/g;

        // Example matching: 
        // str   = ${foo.bar}
        // match = foo.bar
        var replacer = function(str, match) {
            var replacement;

            // Loop through all subs. Example: ${a.b.c}
            // 0 -> replacement = context[a];
            // 1 -> replacement = context[a][b];
            // 2 -> replacement = context[a][b][c];
            var subs = match.split(/\.+/);
            for (var i=0; i< subs.length; i++) {
                if (i == 0) {
                    replacement = context;
                }

                replacement = replacement[subs[i]];
            }

            if(typeof replacement == "function") {
                replacement = args ?
                    replacement.apply(null, args) :
                    replacement();
            }

            // If replacement is undefined, return the string 'undefined'.
            // This is a workaround for a bugs in browsers not properly 
            // dealing with non-participating groups in regular expressions:
            // http://blog.stevenlevithan.com/archives/npcg-javascript
            if (typeof replacement == 'undefined') {
                return 'undefined';
            } else {
                return replacement; 
            }
        };

        return template.replace(tokenRegEx, replacer);
    },
    
    /**
     * APIFunction: isNumeric
     * Determine whether a string contains only a numeric value.
     *
     * Examples:
     * (code)
     * Tian.String.isNumeric("6.02e23") // true
     * Tian.String.isNumeric("12 dozen") // false
     * Tian.String.isNumeric("4") // true
     * Tian.String.isNumeric(" 4 ") // false
     * (end)
     *
     * Returns:
     * {Boolean} String contains only a number.
     */
    isNumeric: function(value) {
        /**
        * numberRegEx
        * Used to test strings as numbers.
        */
        var numberRegEx = /^([+-]?)(?=\d|\.\d)\d*(\.\d*)?([Ee]([+-]?\d+))?$/;
        return numberRegEx.test(value);
    },
    
    /**
     * APIFunction: numericIf
     * Converts a string that appears to be a numeric value into a number.
     * 
     * Returns
     * {Number|String} a Number if the passed value is a number, a String
     *     otherwise. 
     */
    numericIf: function(value) {
        return Tian.String.isNumeric(value) ? parseFloat(value) : value;
    },
    
    // APIFunction: isEmail
    // Determine whether a string is an email address.
    isEmail: function(email) {
        var emailRegEx = /^([\w\d_\.-]+)@([\w\d_-]+\.)+\w{2,5}$/;
        return emailRegEx.test(email);
    },
    
    // APIFunction: isURL
    // Determine whether a string is an url.
    isURL: function(url) {
        var urlRegEx = /^(https?:\/\/)?([\w\d_-]+\.)+\w{2,5}(\/[\w\d\.\?-_%=&]+)*$/;
        return urlRegEx.test(url);
    },
    
    // APIFunction: sprintf
    // formatted printings
    sprintf: function () {
        // http://kevin.vanzonneveld.net
        // +   original by: Ash Searle (http://hexmen.com/blog/)
        // + namespaced by: Michael White (http://getsprink.com)
        // +    tweaked by: Jack
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +      input by: Paulo Freitas
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +      input by: Brett Zamir (http://brett-zamir.me)
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: Dj
        // +   improved by: Allidylls
        // *     example 1: sprintf("%01.2f", 123.1);
        // *     returns 1: 123.10
        // *     example 2: sprintf("[%10s]", 'monkey');
        // *     returns 2: '[    monkey]'
        // *     example 3: sprintf("[%'#10s]", 'monkey');
        // *     returns 3: '[####monkey]'
        // *     example 4: sprintf("%d", 123456789012345);
        // *     returns 4: '123456789012345'
        var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
        var a = arguments,
            i = 0,
            format = a[i++];

        // pad()
        var pad = function (str, len, chr, leftJustify) {
            if (!chr) {
                chr = ' ';
            }
            var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
            return leftJustify ? str + padding : padding + str;
        };

        // justify()
        var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
            var diff = minWidth - value.length;
            if (diff > 0) {
                if (leftJustify || !zeroPad) {
                    value = pad(value, minWidth, customPadChar, leftJustify);
                } else {
                    value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
                }
            }
            return value;
        };

        // formatBaseX()
        var formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
            // Note: casts negative numbers to positive ones
            var number = value >>> 0;
            prefix = prefix && number && {
                '2': '0b',
                '8': '0',
                '16': '0x'
            }[base] || '';
            value = prefix + pad(number.toString(base), precision || 0, '0', false);
            return justify(value, prefix, leftJustify, minWidth, zeroPad);
        };

        // formatString()
        var formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
            if (precision != null) {
                value = value.slice(0, precision);
            }
            return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
        };

        // doFormat()
        var doFormat = function (substring, valueIndex, flags, minWidth, _, precision, type) {
            var number;
            var prefix;
            var method;
            var textTransform;
            var value;

            if (substring == '%%') {
                return '%';
            }

            // parse flags
            var leftJustify = false,
                positivePrefix = '',
                zeroPad = false,
                prefixBaseX = false,
                customPadChar = ' ';
            var flagsl = flags.length;
            for (var j = 0; flags && j < flagsl; j++) {
                switch (flags.charAt(j)) {
                case ' ':
                    positivePrefix = ' ';
                    break;
                case '+':
                    positivePrefix = '+';
                    break;
                case '-':
                    leftJustify = true;
                    break;
                case "'":
                    customPadChar = flags.charAt(j + 1);
                    break;
                case '0':
                    zeroPad = true;
                    break;
                case '#':
                    prefixBaseX = true;
                    break;
                }
            }

            // parameters may be null, undefined, empty-string or real valued
            // we want to ignore null, undefined and empty-string values
            if (!minWidth) {
                minWidth = 0;
            } else if (minWidth == '*') {
                minWidth = +a[i++];
            } else if (minWidth.charAt(0) == '*') {
                minWidth = +a[minWidth.slice(1, -1)];
            } else {
                minWidth = +minWidth;
            }

            // Note: undocumented perl feature:
            if (minWidth < 0) {
                minWidth = -minWidth;
                leftJustify = true;
            }

            if (!isFinite(minWidth)) {
                throw new Error('sprintf: (minimum-)width must be finite');
            }

            if (!precision) {
                precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : undefined;
            } else if (precision == '*') {
                precision = +a[i++];
            } else if (precision.charAt(0) == '*') {
                precision = +a[precision.slice(1, -1)];
            } else {
                precision = +precision;
            }

            // grab value using valueIndex if required?
            value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

            switch (type) {
            case 's':
                return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
            case 'c':
                return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
            case 'b':
                return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'o':
                return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'x':
                return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'X':
                return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
            case 'u':
                return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'i':
            case 'd':
                number = +value || 0;
                number = Math.round(number - number % 1); // Plain Math.round doesn't just truncate
                prefix = number < 0 ? '-' : positivePrefix;
                value = prefix + pad(String(Math.abs(number)), precision, '0', false);
                return justify(value, prefix, leftJustify, minWidth, zeroPad);
            case 'e':
            case 'E':
            case 'f': // Should handle locales (as per setlocale)
            case 'F':
            case 'g':
            case 'G':
                number = +value;
                prefix = number < 0 ? '-' : positivePrefix;
                method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
                textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
                value = prefix + Math.abs(number)[method](precision);
                return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
            default:
                return substring;
            }
        };

        return format.replace(regex, doFormat);
    },
    
    // APIFunction: sscanf
    sscanf: function (str, format) {
        // +   original by: Brett Zamir (http://brett-zamir.me)
        // %        note 1: Since JS does not support scalar reference variables, any additional arguments to the function will
        // %        note 1: only be allowable here as strings referring to a global variable (which will then be set to the value
        // %        note 1: found in 'str' corresponding to the appropriate conversion specification in 'format'
        // %        note 2: I am unclear on how WS is to be handled here because documentation seems to me to contradict PHP behavior
        // *     example 1: sscanf('SN/2350001', 'SN/%d');
        // *     returns 1: [2350001]
        // *     example 2: var myVar; // Will be set by function
        // *     example 2: sscanf('SN/2350001', 'SN/%d', 'myVar');
        // *     returns 2: 1
        // *     example 3: sscanf("10--20", "%2$d--%1$d"); // Must escape '$' in PHP, but not JS
        // *     returns 3: [20, 10]

        // SETUP
        var retArr = [],
            _NWS = /\S/,
            args = arguments,
            that = this,
            digit;

        var _setExtraConversionSpecs = function (offset) {
            // Since a mismatched character sets us off track from future legitimate finds, we just scan
            // to the end for any other conversion specifications (besides a percent literal), setting them to null
            // sscanf seems to disallow all conversion specification components (of sprintf) except for type specifiers
            //var matches = format.match(/%[+-]?([ 0]|'.)?-?\d*(\.\d+)?[bcdeufFosxX]/g); // Do not allow % in last char. class
            var matches = format.slice(offset).match(/%[cdeEufgosxX]/g); // Do not allow % in last char. class;
            // b, F,G give errors in PHP, but 'g', though also disallowed, doesn't
            if (matches) {
                var lgth = matches.length;
                while (lgth--) {
                    retArr.push(null);
                }
            }
            return _finish();
        };

        var _finish = function () {
            if (args.length === 2) {
                return retArr;
            }
            for (var i = 0; i < retArr.length; ++i) {
                that.window[args[i + 2]] = retArr[i];
            }
            return i;
        };

        var _addNext = function (j, regex, cb) {
            if (assign) {
                var remaining = str.slice(j);
                var check = width ? remaining.substr(0, width) : remaining;
                var match = regex.exec(check);
                var testNull = retArr[digit !== undefined ? digit : retArr.length] = match ? (cb ? cb.apply(null, match) : match[0]) : null;
                if (testNull === null) {
                    throw 'No match in string';
                }
                return j + match[0].length;
            }
            return j;
        };

        if (arguments.length < 2) {
                throw 'Not enough arguments passed to sscanf';
        }

        // PROCESS
        for (var i = 0, j = 0; i < format.length; i++) {

            var width = 0,
                assign = true;

            if (format.charAt(i) === '%') {
                if (format.charAt(i + 1) === '%') {
                    if (str.charAt(j) === '%') { // a matched percent literal
                        ++i, ++j; // skip beyond duplicated percent
                        continue;
                    }
                    // Format indicated a percent literal, but not actually present
                    return _setExtraConversionSpecs(i + 2);
                }

                // CHARACTER FOLLOWING PERCENT IS NOT A PERCENT

                var prePattern = new RegExp('^(?:(\\d+)\\$)?(\\*)?(\\d*)([hlL]?)', 'g'); // We need 'g' set to get lastIndex

                var preConvs = prePattern.exec(format.slice(i + 1));

                var tmpDigit = digit;
                if (tmpDigit && preConvs[1] === undefined) {
                    throw 'All groups in sscanf() must be expressed as numeric if any have already been used';
                }
                digit = preConvs[1] ? parseInt(preConvs[1], 10) - 1 : undefined;

                assign = !preConvs[2];
                width = parseInt(preConvs[3], 10);
                var sizeCode = preConvs[4];
                i += prePattern.lastIndex;

                // Fix: Does PHP do anything with these? Seems not to matter
                if (sizeCode) { // This would need to be processed later
                    switch (sizeCode) {
                    case 'h':
                        // Treats subsequent as short int (for d,i,n) or unsigned short int (for o,u,x)
                    case 'l':
                        // Treats subsequent as long int (for d,i,n), or unsigned long int (for o,u,x);
                        //    or as double (for e,f,g) instead of float or wchar_t instead of char
                    case 'L':
                        // Treats subsequent as long double (for e,f,g)
                        break;
                    default:
                        throw 'Unexpected size specifier in sscanf()!';
                    }
                }
                
                // PROCESS CHARACTER
                try {
                    switch (format.charAt(i + 1)) {
                    // For detailed explanations, see http://web.archive.org/web/20031128125047/http://www.uwm.edu/cgi-bin/IMT/wwwman?topic=scanf%283%29&msection=
                    // Also http://www.mathworks.com/access/helpdesk/help/techdoc/ref/sscanf.html
                    // p, S, C arguments in C function not available
                    // DOCUMENTED UNDER SSCANF
                    case 'F':
                        // Not supported in PHP sscanf; the argument is treated as a float, and
                        //  presented as a floating-point number (non-locale aware)
                        // sscanf doesn't support locales, so no need for two (see %f)
                        break;
                    case 'g':
                        // Not supported in PHP sscanf; shorter of %e and %f
                        // Irrelevant to input conversion
                        break;
                    case 'G':
                        // Not supported in PHP sscanf; shorter of %E and %f
                        // Irrelevant to input conversion
                        break;
                    case 'b':
                        // Not supported in PHP sscanf; the argument is treated as an integer, and presented as a binary number
                        // Not supported - couldn't distinguish from other integers
                        break;
                    case 'i':
                        // Integer with base detection (Equivalent of 'd', but base 0 instead of 10)
                        j = _addNext(j, /([+-])?(?:(?:0x([\da-fA-F]+))|(?:0([0-7]+))|(\d+))/, function (num, sign, hex, oct) {
                            return hex ? parseInt(num, 16) : oct ? parseInt(num, 8) : parseInt(num, 10);
                        });
                        break;
                    case 'n':
                        // Number of characters processed so far
                        retArr[digit !== undefined ? digit : retArr.length - 1] = j;
                        break;
                        // DOCUMENTED UNDER SPRINTF
                    case 'c':
                        // Get character; suppresses skipping over whitespace! (but shouldn't be whitespace in format anyways, so no difference here)
                        // Non-greedy match
                        j = _addNext(j, new RegExp('.{1,' + (width || 1) + '}'));
                        break;
                    case 'D':
                        // sscanf documented decimal number; equivalent of 'd';
                    case 'd':
                        // Optionally signed decimal integer
                        j = _addNext(j, /([+-])?(?:0*)(\d+)/, function (num, sign, dec) {
                            // Ignores initial zeroes, unlike %i and parseInt()
                            var decInt = parseInt((sign || '') + dec, 10);
                            //if (decInt < 0) { // PHP also won't allow less than -2147483648
                            //    return decInt < -2147483648 ? -2147483648 : decInt; // integer overflow with negative
                            //} else { // PHP also won't allow greater than -2147483647
                            //    return decInt < 2147483647 ? decInt : 2147483647;
                            //}
                            return decInt;
                        });
                        break;
                    case 'f':
                        // Although sscanf doesn't support locales, this is used instead of '%F'; seems to be same as %e
                    case 'E':
                        // These don't discriminate here as both allow exponential float of either case
                    case 'e':
                        j = _addNext(j, /([+-])?(?:0*)(\d*\.?\d*(?:[eE]?\d+)?)/, function (num, sign, dec) {
                            if (dec === '.') {
                                return null;
                            }
                            return parseFloat((sign || '') + dec); // Ignores initial zeroes, unlike %i and parseFloat()
                        });
                        break;
                    case 'u':
                        // unsigned decimal integer
                        // We won't deal with integer overflows due to signs
                        j = _addNext(j, /([+-])?(?:0*)(\d+)/, function (num, sign, dec) {
                            // Ignores initial zeroes, unlike %i and parseInt()
                            var decInt = parseInt(dec, 10);
                            if (sign === '-') { // PHP also won't allow greater than 4294967295
                                return 4294967296 - decInt; // integer overflow with negative
                            } else {
                                return decInt < 4294967295 ? decInt : 4294967295;
                            }
                        });
                        break;
                    case 'o':
                        // Octal integer // Fix: add overflows as above?
                        j = _addNext(j, /([+-])?(?:0([0-7]+))/, function (num) {
                            return parseInt(num, 8);
                        });
                        break;
                    case 's':
                        // Greedy match
                        j = _addNext(j, /\S+/);
                        break;
                    case 'X':
                        // Same as 'x'?
                    case 'x':
                        // Fix: add overflows as above?
                        // Initial 0x not necessary here
                        j = _addNext(j, /([+-])?(?:(?:0x)?([\da-fA-F]+))/, function (num) {
                            return parseInt(num, 16);
                        });
                        break;
                    case '':
                        // If no character left in expression
                        throw 'Missing character after percent mark in sscanf() format argument';
                    default:
                        throw 'Unrecognized character after percent mark in sscanf() format argument';
                    }
                } catch (e) {
                    if (e === 'No match in string') { // Allow us to exit
                        return _setExtraConversionSpecs(i + 2);
                    }
                }++i; // Calculate skipping beyond initial percent too
            } else if (format.charAt(i) !== str.charAt(j)) {
                // Fix: Double-check i whitespace ignored in string and/or formats
                _NWS.lastIndex = 0;
                if ((_NWS).test(str.charAt(j)) || str.charAt(j) === '') { // Whitespace doesn't need to be an exact match)
                    return _setExtraConversionSpecs(i + 1);
                } else {
                    // Adjust strings when encounter non-matching whitespace, so they align in future checks above
                    str = str.slice(0, j) + str.slice(j + 1); // Ok to replace with j++;?
                    i--;
                }
            } else {
                j++;
            }
        }

        // POST-PROCESSING
        return _finish();
    }
};

