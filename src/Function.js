// @requires Tian.js

//=============================================================
// Namespace: Tian.Function
// Contains convenience functions for function manipulation.
//-------------------------------------------------------------

Tian.Function = {
    /**
     * APIFunction: bind
     * Bind a function to an object. Method to easily create closures with 'this' altered.
     * 
     * Parameters:
     * func - {Function} Input function.
     * object - {Object} The object to bind to the input function (as this).
     * 
     * Returns:
     * {Function} A closure with 'this' set to the passed in object.
     */
    bind: function(func, object) {
        // create a reference to all arguments past the second one
        var args = Array.prototype.slice.apply(arguments, [2]);
        return function() {
            // Push on any additional arguments from the actual function call.
            // These will come after those sent to the bind call.
            var newArgs = args.concat(
                Array.prototype.slice.apply(arguments, [0])
            );
            return func.apply(object, newArgs);
        };
    },
    
    /**
     * APIFunction: bindAsEventListener
     * Bind a function to an object, and configure it to receive the event
     *     object as first parameter when called. 
     * 
     * Parameters:
     * func - {Function} Input function to serve as an event listener.
     * object - {Object} A reference to this.
     * 
     * Returns:
     * {Function}
     */
    bindAsEventListener: function(func, object) {
        return function(event) {
            return func.call(object, event || window.event);
        };
    },
    
    /**
     * APIFunction: False
     * A simple function to that just does "return false". We use this to 
     * avoid attaching anonymous functions to DOM event handlers, which 
     * causes "issues" on IE<8.
     * 
     * Usage:
     * document.onclick = Tian.Function.False;
     * 
     * Returns:
     * {Boolean}
     */
    False : function() {
        return false;
    },

    /**
     * APIFunction: True
     * A simple function to that just does "return true". We use this to 
     * avoid attaching anonymous functions to DOM event handlers, which 
     * causes "issues" on IE<8.
     * 
     * Usage:
     * document.onclick = Tian.Function.True;
     * 
     * Returns:
     * {Boolean}
     */
    True : function() {
        return true;
    },
    
    /**
     * APIFunction: Void
     * A reusable function that returns ``undefined``.
     *
     * Returns:
     * {undefined}
     */
    Void: function() {}
};

