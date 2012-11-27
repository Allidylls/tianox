/* Copyright (c) 2012-2012 by Tian Yantao */

/**
 * @requires Tian.js
 * @requires Class.js
 * @requires Event.js
 * @requires Winager.js
 * @requires Widget/MainPanel.js
 * @requires Widget/TitleBar.js
 * @requires Widget/Taskbar.js
 */

// Tian.OS
// Class of Tian Observing System Framework
Tian.OS = Tian.Class({
    // title text in titlebar
    title: '',

    // canvas div
    div: null,
    
    // Tian.Widget.MainPanel
    mainPanel: null,
    
    // Tian.Widget.TitleBar
    titleBar: null,
    
    // Tian.Widget.Taskbar
    taskbar: null,
    
    // array of Tian.Widget
    widgets: null,
    
    /* window manager*/
    wm: null,
    
    /**
     * APIProperty: theme
     * {String} default theme of application
     */
    theme: 'default',
    themeHost: '',
    imagePath: '',
    
    /**
     * APIProperty: events
     * {<Tian.Events>}
     */
    // Supported events list:
    // notify
    events: null,
    
    /**
     * Constructor: Tian.OS
     */
    initialize: function(title, themehost) {
        this.title = title ? title : 'TianOX';
        
        if (typeof themehost == 'string' && themehost.length > 0) {
            if (themehost.charAt(themehost.length-1) != '/') {
                themehost += '/';
            }
            this.themeHost = themehost;
        }
    },
    
    /**
     * Method: boot
     * Entry of the OS
     */
    boot: function () {
        // create a canvas
        var body = document.getElementsByTagName("body")[0] || document.documentElement;
        this.div = document.createElement('div');
        this.div.className = 'txOS';
        body.insertBefore(this.div, body.firstChild);
        
        // load default theme
        if (this.themeHost) {
            Tian.requireCSS(this.themeHost + this.theme + '/style.css');
            this.setImagePath();
        }
        
        // create an event engine
        this.events = new Tian.Events(this, null, true);
        
        // create main panel
        this.createMainPanel();
        
        // craete title bar
        this.createTitleBar();
        
        // create taskbar
        this.createTaskbar();
        
        // create window manager
        this.createWindowManager();
    },
    
    /**
     * Method: exit
     * Quit the application and destroy all elements
     */
    exit: function () {
        // destroy windows and widgets
        this.wm.destroy();
        this.wm = null;
        
        this.titleBar.destroy();
        this.titleBar = null;
        
        this.taskbar.destroy();
        this.taskbar = null;
        
        this.mainPanel.destroy();
        this.mainPanel = null;

        this.events.destroy();
        this.events = null;
    },
    
    createMainPanel: function () {
        this.mainPanel = new Tian.Widget.MainPanel();
        this.div.appendChild(this.mainPanel.draw());
        this.mainPanel.setOS(this);
    },
    
    createTitleBar: function () {
        this.titleBar = new Tian.Widget.TitleBar();
        this.div.appendChild(this.titleBar.draw());
        this.titleBar.setOS(this);
    },
    
    createTaskbar: function () {
        this.taskbar = new Tian.Widget.Taskbar();
        this.div.appendChild(this.taskbar.draw());
        this.taskbar.setOS(this);
    },
    
    createWindowManager: function () {
        this.wm = new Tian.Winager({
            container: this.div,
            taskbar: this.taskbar !== null ? this.taskbar.div : null,
            defaultX: 50,
            defaultY: 35,
            iconWidth: 36,
            cacheXHR: true
        });
    },
    
    // Export apis
    //------------
    
    // notify a message
    notify: function (str) {
        var time = new Date();
        this.events.emit('notify', {data: {
            timestamp: time.getTime(),
            notification: ''+str
        }});
    },
    
    // change theme of application
    changeTheme: function (theme) {
        var newurl, oldurl;
        if ((theme) && (theme != this.theme)) {
            newurl = this.themeHost + theme + '/style.css';
            oldurl = this.themeHost + this.theme + '/style.css';
            Tian.replaceCSS(oldurl, newurl);
            this.theme = theme;
            this.setImagePath();
        }
    },
    
    setImagePath: function (path) {
        if (path) {
            this.imagePath = path;
        } else {
            this.imagePath = this.themeHost + this.theme + '/img/';
        }
    },
    
    getImagePath: function() {
        if (!this.imagePath) {
            this.setImagePath();
        }
        return this.imagePath;
    },
    
    getWindowManager: function () {
        return this.wm;
    },
    
    getEvents: function () {
        return this.events;
    },
    
    getMainPanel: function () {
        return this.mainPanel;
    },
    
    getTitleBar: function () {
        return this.titleBar;
    },
    
    // get current theme
    getTheme: function () {
        return this.theme;
    },
    
    CLASS_NAME: "Tian.OS"
});
