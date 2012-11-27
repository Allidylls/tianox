// @requires Tian.js

//=============================================================
// Class hierarchy related functions
//-------------------------------------------------------------

/**
* Function: inherit
*
* Parameters:
* C - {Object} the class that inherits
* P - {Object} the superclass to inherit from
*
* In addition to the mandatory C and P parameters, an arbitrary number of
* objects can be passed, which will extend C.
*/
Tian.inherit = function(C, P) {
    var F = function() {};
    F.prototype = P.prototype;
    C.prototype = new F;
    var i, l, o;
    for(i=2, l=arguments.length; i<l; i++) {
        o = arguments[i];
        if(typeof o === "function") {
            o = o.prototype;
        }
        Tian.extend(C.prototype, o);
    }
};

// Tian.Class
Tian.Class = function() {
    var len = arguments.length;
    var P = arguments[0];
    var F = arguments[len-1];

    var C = typeof F.initialize === "function" ?
        F.initialize :
        function(){ P.apply(this, arguments); };

    if (len > 1) {
        var newArgs = [C, P].concat(
                Array.prototype.slice.call(arguments).slice(1, len-1), F);
        Tian.inherit.apply(null, newArgs);
    } else {
        C.prototype = F;
    }
    
    return C;
};

