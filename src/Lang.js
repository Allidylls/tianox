// @requires Tian.js

//=============================================================
// Namespace: Tian.Lang
// Internationalization functions.
//-------------------------------------------------------------

Tian.Lang = {
    /** 
     * Property: code
     * {String}  Current language code to use in Tian.  Use the
     *     <setCode> method to set this value and the <getCode> method to
     *     retrieve it.
     */
    code: null,

    /** 
     * APIProperty: defaultCode
     * {String} Default language to use when a specific language can't be
     *     found.  Default is "en".
     */
    defaultCode: "en",
        
    /**
     * APIFunction: getCode
     * Get the current language code.
     *
     * Returns:
     * The current language code.
     */
    getCode: function() {
        if(!Tian.Lang.code) {
            Tian.Lang.setCode();
        }
        return Tian.Lang.code;
    },
    
    /**
     * APIFunction: setCode
     * Set the language code for string translation.  This code is used by
     *     the <Tian.Lang.translate> method.
     *
     * Parameters-
     * code - {String} These codes follow the IETF recommendations at
     *     http://www.ietf.org/rfc/rfc3066.txt.  If no value is set, the
     *     browser's language setting will be tested.
     */
    setCode: function(code) {
        var lang;
        if(!code) {
            code = (Tian.BROWSER == "msie") ?
                navigator.userLanguage : navigator.language;
        }
        
        var parts = code.split('-');
        parts[0] = parts[0].toLowerCase();
        lang = parts[0];

        // check for regional extensions
        if(parts[1]) {
            lang = parts[0] + '-' + parts[1].toUpperCase();
        }
        
        if(!lang) {
            lang = Tian.Lang.defaultCode;
        }
        
        Tian.Lang.code = lang;
    },

    /**
     * APIMethod: translate
     * Looks up a key from a dictionary based on the current language string.
     *     The value of <getCode> will be used to determine the appropriate
     *     dictionary.  Dictionaries are stored in <Tian.Lang>.
     *
     * Parameters:
     * key - {String} The key for an i18n string value in the dictionary.
     * 
     * Returns:
     * {String} A internationalized string.
     */
    translate: function(key) {
        var dictionary = Tian.Lang[Tian.Lang.getCode()];
        var message = dictionary && dictionary[key];
        if(!message) {
            // Message not found, fall back to message key
            message = key;
        }
        return message;
    },
    
    // dynamicly extend the language dictionaries
    add: function(code, key, word) {
        // check the code, if not exist then create one
        if (typeof Tian.Lang[code] !== 'object') {
            Tian.Lang[code] = {};
        }
        // check the key
        if (typeof Tian.Lang[code][key] === 'string') {
            return false;
        }
        // ok, add key-word to code
        Tian.Lang[code][key] = word;
        
        return true;
    }
};

/**
 * APIMethod: Tian.i18n
 * Alias for <Tian.Lang.translate>.  Looks up a key from a dictionary
 *     based on the current language string. The value of
 *     <Tian.Lang.getCode> will be used to determine the appropriate
 *     dictionary.  Dictionaries are stored in <Tian.Lang>.
 *
 * Parameters:
 * key - {String} The key for an i18n string value in the dictionary.
 * 
 * Returns:
 * {String} A internationalized string.
 */
Tian.i18n = Tian.Lang.translate;

