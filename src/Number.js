// @requires Tian.js

//=============================================================
// Namespace: Tian.Number
// Contains convenience functions for number manipulation.
//-------------------------------------------------------------

Tian.Number = {
    /**
     * Property: dsep
     * Decimal separator to use when formatting numbers.
     */
    dsep: ".",
    
    /**
     * Property: tsep
     * Thousands separator to use when formatting numbers.
     */
    tsep: ",",
    
    /**
     * APIFunction: limitSigDigs
     * Limit the number of significant digits on a float.
     * 
     * Parameters:
     * num - {Float}
     * sig - {Integer}
     * 
     * Returns:
     * {Float} The number, rounded to the specified number of significant
     *     digits.
     */
    limitSigDigs: function(num, sig) {
        var fig = 0;
        if (sig > 0) {
            fig = parseFloat(num.toPrecision(sig));
        }
        return fig;
    },
    
    /**
     * APIFunction: limitFixDigs
     * Limit the number of fixed digits on a float.
     * 
     * Parameters:
     * num - {Float}
     * sig - {Integer}
     * 
     * Returns:
     * {Float} The number, rounded to the specified number of fixed
     *     digits.
     */
    limitFixDigs: function(num, fix) {
        var fig = 0;
        if (typeof fix === 'number') {
            fig = parseFloat(num.toFixed(fix));
        }
        return fig;
    },
    
    /**
     * APIFunction: format
     * Formats a number for output.
     * 
     * Parameters:
     * num  - {Float}
     * dec  - {Integer} Number of decimal places to round to.
     *        Defaults to 0. Set to null to leave decimal places unchanged.
     * tsep - {String} Thousands separator.
     *        Default is ",".
     * dsep - {String} Decimal separator.
     *        Default is ".".
     *
     * Returns:
     * {String} A string representing the formatted number.
     */
    format: function(num, dec, tsep, dsep) {
        dec = (typeof dec != "undefined") ? dec : 0; 
        tsep = (typeof tsep != "undefined") ? tsep :
            Tian.Number.tsep; 
        dsep = (typeof dsep != "undefined") ? dsep :
            Tian.Number.dsep;

        if (dec != null) {
            num = parseFloat(num.toFixed(dec));
        }

        var parts = num.toString().split(".");
        if (parts.length == 1 && dec == null) {
            // integer where we do not want to touch the decimals
            dec = 0;
        }
        
        var integer = parts[0];
        if (tsep) {
            var thousands = /(-?[0-9]+)([0-9]{3})/; 
            while(thousands.test(integer)) { 
                integer = integer.replace(thousands, "$1" + tsep + "$2"); 
            }
        }
        
        var str;
        if (dec == 0) {
            str = integer;
        } else {
            var rem = parts.length > 1 ? parts[1] : "0";
            if (dec != null) {
                rem = rem + new Array(dec - rem.length + 1).join("0");
            }
            str = integer + dsep + rem;
        }
        return str;
    },
    
    // add zeros before number
    zeroize: function(value, length) {
        if (!length) length = 2;
		value = value + '';
		for (var i = 0, zeros = ''; i < (length-value.length); i++) {
			zeros += '0';
		}

		return zeros + value;
    }
};

