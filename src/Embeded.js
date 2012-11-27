
//=============================================================
// Tian Embeded Applications Framework
//
// Note: the app must be running within an iframe window.
// And, access resources by
// 1, top.Tian
// 2, top.xxxx
//
// Within the iframe, the global function 'tianMain' 
// will be called when all resources ready.
// You should create an app in the main function like this
// MyApp = top.Tian.Class(top.Tian.Embeded, {
//     define your app here...
// });
// function tianMain(options) {
//   return new MyApp(options);
// }
//
// Copyright 2011-2012 yantaotian@gmail.com
//-------------------------------------------------------------

// @requires Class.js
// @requires Window.js
// @requires App.js
// @requires Device.js

Tian.Embeded = Tian.Class({
    // the window running with this application
    theWin: null,
    
    // the application
    theApp: null,
    
    // dictionaries hash for internationalization
    // structure: dictionaries[code][key] = value
    dictionaries: null,

    // constructor
    initialize: function (options) {
        // get the super objects
        this.theWin = (options && options.win) ? options.win : null;
        
        // get the super objects
        this.theApp = (options && options.app) ? options.app : null;
        
        // register event handlers of the application's window
        if (this.theWin) {
            this.theWin.onselect    = top.Tian.Function.bind(this.onSelect, this);
            this.theWin.ondeselect  = top.Tian.Function.bind(this.onDeselect, this);
            this.theWin.oniconize   = top.Tian.Function.bind(this.onIconize, this);
            this.theWin.onhttperror = top.Tian.Function.bind(this.onHttpError, this);
            this.theWin.onunload    = top.Tian.Function.bind(this.onUnload, this);
        }
        
        // run app here
        this.onRun();
    },

    // entry
    onRun: function () {
        // may set document.domain for communications with OS
    },
    
    // destructor
    destroy: function () {
        this.theWin = null;
        this.theApp = null;
        this.dictionaries = null;
    },
    
    // Looks up a key from a dictionary based on the current language string.
    // Dictionaries are stored in property dictionaries.
    i18n: function(key) {
        var dictionary = this.dictionaries && this.dictionaries[top.Tian.Lang.getCode()];
        var message = dictionary && dictionary[key];
        if (!message) {
            // Message not found, fall back to message key
            message = key;
        }
        return message;
    },
    
    // update default title
    setTitle: function(title) {
        if (this.theApp) {
            this.theApp.setTitle(title);
        }
    },
    
    // update default icon
    setIcon: function(iconurl) {
        if (this.theApp) {
            this.theApp.setIcon(iconurl);
        }
    },
    
    // get app title
    getTitle: function() {
        if (this.theApp) {
            return this.theApp.title;
        }
        
        return '';
    },

    // get the instance of Tian observing system
    getOS: function() {
        if (this.theApp) {
            return this.theApp.getOS();
        }
        
        return null;
    },
    
    getMap: function() {
        var os = this.getOS();
        if (os) {
            return os.getMap();
        }
        
        return null;
    },
    
    // window event handlers
    // should be overridden by all derived classes
    
    // This event is fired when the window is selected.
    onSelect: function() {
    },
    
    // This event is fired when the window is deselected.
    onDeselect: function() {
    },
    
    // This event is fired when the window is iconized.
    onIconize: function() {
    },
    
    // This event is fired BEFORE a new content is loaded 
    // (ie loadUrl/loadUrlX method) or BEFORE the window is closed.
    // The event handler can return false to abort the operation.
    onUnload: function() {
        this.destroy();
        return true;
    },
    
    // This event is fired on http error and overrides the default http error handler.
    onHttpError: function(xhr, url) {
    },

    CLASS_NAME: "Tian.Embeded"
});

