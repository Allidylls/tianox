// @requires Tian.js
// @requires Number.js

//=============================================================
// Namespace: Tian.Date
// Contains convenience functions for datetime manipulation.
//-------------------------------------------------------------

Tian.Date = {
    /**
     * APIMethod: format
     * Returns a default formatted date-time string. 
     * If a mask is set, the format of mask will be used. Supported masks:
     * yy: short year, eg: 12
     * yyyy: long year, eg: 2012
     * m: short month, 0 - 12
     * mm: long month, 00 - 12
     * d: short day of month, 0 - 31
     * dd: long day of month, 00 - 31
     * h: short hour, 0 - 11
     * hh: 2-digit hour, 00-11
     * H: short hour, 0 - 23
     * HH: 2-digit hour, 00 - 23
     * M: short minute, 0 - 59
     * MM: 2-digit minute, 00 - 59
     * S: short second, 0 - 59
     * SS: 2-digit second, 00 - 59
     * l: 2-digit millisecond, 00 - 99
     * L: 3-digit millisecond, 000 - 999
     *
     * Examples:
     * Weiran.Date.format(new Date()) // "Tue Mar 06 2012 10:24:55 GMT+0800 (CST)"
     * Weiran.Date.format(new Date(), "dd/mm/yy") // "06/03/12"
     * Weiran.Date.format(new Date(), "yyyy-mm-dd HH:MM:SS") // "2012-03-06 10:27:31"
     * Weiran.Date.format(new Date(), "yyyy-mm-dd HH:MM:SS.L") // "2012-03-06 10:28:22.464"
     *
     * Parameters:
     * date - {Date} A date object
     * mask - {String} Optional mask string
     *
     * Returns:
     * {String} Formatted date string
     */
    format: function(date, mask) {
        if (!mask) {
            return date.toString();
        }
        
        var maskRegEx = /"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMSlLtT])\1?|[lLZ])\b/g;
        
        return mask.replace(maskRegEx, function(tt) {
            switch(tt) {
            case 'd':	return date.getDate();
			case 'dd':	return Tian.Number.zeroize(date.getDate());
			//case 'ddd':	return ['Sun','Mon','Tue','Wed','Thr','Fri','Sat'][date.getDay()];
			//case 'dddd':return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][date.getDay()];
			case 'm':	return date.getMonth() + 1;
			case 'mm':	return Tian.Number.zeroize(date.getMonth() + 1);
			//case 'mmm':	return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][date.getMonth()];
			//case 'mmmm':return ['January','February','March','April','May','June','July','August','September','October','November','December'][date.getMonth()];
			case 'yy':	return String(date.getFullYear()).substr(2);
			case 'yyyy':return date.getFullYear();
			case 'h':	return date.getHours() % 12 || 12;
			case 'hh':	return Tian.Number.zeroize(date.getHours() % 12 || 12);
			case 'H':	return date.getHours();
			case 'HH':	return Tian.Number.zeroize(date.getHours());
			case 'M':	return date.getMinutes();
			case 'MM':	return Tian.Number.zeroize(date.getMinutes());
			case 'S':	return date.getSeconds();
			case 'SS':	return Tian.Number.zeroize(date.getSeconds());
			case 'l':	var m = date.getMilliseconds();
					    if (m > 99) m = Math.round(m / 10);
					    return Tian.Number.zeroize(m);
			case 'L':	return Tian.Number.zeroize(date.getMilliseconds(), 3);
			//case 'tt':	return date.getHours() < 12 ? 'am' : 'pm';
			//case 'TT':	return date.getHours() < 12 ? 'AM' : 'PM';
			//case 'Z':	return date.toUTCString().match(/[A-Z]+$/);
			// Return quoted strings with the surrounding quotes removed
			default:	return tt.substr(1, tt.length - 2);
		    }
        });
    },
    
    /**
     * APIMethod: doy
     * Get day of year.
     *
     * Parameters:
     * date - {Date} A date object.
     *
     * Returns:
     * {Number} The day of year.
     */
    doy: function(date) {
        if (!date) {
            date = new Date();
        }
        
        var dt = new Date(date.getFullYear(), 0, 1);
        return Math.ceil((date-dt)/86400000);
    },
    
    /**
     * APIMethod: parse
     * Generate a date object from a string.  The format for the string follows
     *     the profile of ISO 8601 for date and time on the Internet (see
     *     http://tools.ietf.org/html/rfc3339).  We don't call the native
     *     Date.parse because of inconsistency between implmentations.  In
     *     Chrome, calling Date.parse with a string that doesn't contain any
     *     indication of the timezone (e.g. "2011"), the date is interpreted
     *     in local time.  On Firefox, the assumption is UTC.
     *
     * Parameters:
     * str - {String} A string representing the date (e.g.
     *     "2010", "2010-08", "2010-08-07", "2010-08-07T16:58:23.123Z",
     *     "2010-08-07T11:58:23.123-06").
     *
     * Returns:
     * {Date} A date object.  If the string could not be parsed, an invalid
     *     date is returned (i.e. isNaN(date.getTime())).
     */
    parse: function(str) {
        var date;
        var dateRegEx = /^(?:(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?)?(?:(?:T(\d{1,2}):(\d{2}):(\d{2}(?:\.\d+)?)(Z|(?:[+-]\d{1,2}(?::(\d{2}))?)))|Z)?$/;
        var match = str.match(dateRegEx);
        if (match && (match[1] || match[7])) { // must have at least year or time
            var year = parseInt(match[1], 10) || 0;
            var month = (parseInt(match[2], 10) - 1) || 0;
            var day = parseInt(match[3], 10) || 1;
            date = new Date(Date.UTC(year, month, day));
            // optional time
            var type = match[7];
            if (type) {
                var hours = parseInt(match[4], 10);
                var minutes = parseInt(match[5], 10);
                var secFrac = parseFloat(match[6]);
                var seconds = secFrac | 0;
                var milliseconds = Math.round(1000 * (secFrac - seconds));
                date.setUTCHours(hours, minutes, seconds, milliseconds);
                // check offset
                if (type !== "Z") {
                    var hoursOffset = parseInt(type, 10);
                    var minutesOffset = parseInt(match[8], 10) || 0;
                    var offset = -1000 * (60 * (hoursOffset * 60) + minutesOffset * 60);
                    date = new Date(date.getTime() + offset);
                }
            }
        } else {
            date = new Date("invalid");
        }
        return date;
    }
};

