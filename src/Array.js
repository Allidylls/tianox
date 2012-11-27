// @requires Tian.js

//=============================================================
// Namespace: Tian.Array
// Contains convenience functions for array manipulation.
//-------------------------------------------------------------

Tian.Array = {
    // Returns true if an object is an array, false if it is not.
    isArray: function(obj) {
        // use the build-in function if available.
        if (typeof Array.isArray === 'function') {
            return Array.isArray(obj);
        } else {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
    },
    
    /** 
    * APIMethod: indexOf
    * Seems to exist already in FF, but not in MOZ.
    * 
    * Parameters:
    * array - {Array}
    * obj - {*}
    * 
    * Returns:
    * {Integer} The index at, which the first object was found in the array.
    *           If not found, returns -1.
    */
    indexOf: function(array, obj) {
        // use the build-in function if available.
        if (typeof array.indexOf === "function") {
            return array.indexOf(obj);
        } else {
            for (var i = 0, len = array.length; i < len; i++) {
                if (array[i] == obj) {
                    return i;
                }
            }
            return -1;
        }
    },
    
    /** 
    * APIMethod: removeItem
     * Remove an object from an array. Iterates through the array
    *     to find the item, then removes it.
    *
    * Parameters:
    * array - {Array}
    * item - {Object}
    * 
    * Return
    * {Array} A reference to the array
    */
    removeItem: function(array, item) {
        for(var i = array.length - 1; i >= 0; i--) {
            if(array[i] == item) {
                array.splice(i,1);
                //break;more than once??
            }
        }
        return array;
    },

    /**
     * APIMethod: filter
     * Filter an array.  Provides the functionality of the
     *     Array.prototype.filter extension to the ECMA-262 standard.  Where
     *     available, Array.prototype.filter will be used.
     *
     * Based on well known example from http://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/filter
     *
     * Parameters:
     * array - {Array} The array to be filtered.  This array is not mutated.
     *     Elements added to this array by the callback will not be visited.
     * callback - {Function} A function that is called for each element in
     *     the array.  If this function returns true, the element will be
     *     included in the return.  The function will be called with three
     *     arguments: the element in the array, the index of that element, and
     *     the array itself.  If the optional caller parameter is specified
     *     the callback will be called with this set to caller.
     * caller - {Object} Optional object to be set as this when the callback
     *     is called.
     *
     * Returns:
     * {Array} An array of elements from the passed in array for which the
     *     callback returns true.
     */
    filter: function(array, callback, caller) {
        var selected = [];
        if (Array.prototype.filter) {
            selected = array.filter(callback, caller);
        } else {
            var len = array.length;
            if (typeof callback != "function") {
                throw new TypeError();
            }
            for(var i=0; i<len; i++) {
                if (i in array) {
                    var val = array[i];
                    if (callback.call(caller, val, i, array)) {
                        selected.push(val);
                    }
                }
            }        
        }
        return selected;
    }
};

