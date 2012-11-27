// @requires Tian.js
// @requires Number.js

//=============================================================
// Namespace: Tian.Date
// Contains convenience functions for datetime manipulation.
//-------------------------------------------------------------

Tian.Date = {
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
    
    // get day of year
    doy: function(date) {
        if (!date) {
            date = new Date();
        }
        
        var dt = new Date(date.getFullYear(), 0, 1);
        return Math.ceil((date-dt)/86400000);
    }
};

