/**
 * @requires Widget.js
 * @requires App.js
 */

// extend languages
Tian.Lang.add('en', 'txMainPanelTitle', 'Main Panel');
Tian.Lang.add('zh-CN', 'txMainPanelTitle', '系统面板');

/**
 * Class: Tian.Widget.MainPanel
 * Tian main panel for accessing apps
 */
Tian.Widget.MainPanel = Tian.Class(Tian.Widget, {
    // may private properties here ...
    mainDiv: null,
    
    // app window
    window: null,
    windowOpened: false,
    
    // default width of window
    width: 540,
    
    // default height of window
    height: 300,
    
    /**
     * Property: apps
     * {Array(<Tian.App>)}
     */
    apps: null,
    
    initialize: function() {
        Tian.Widget.prototype.initialize.apply(this, arguments);
        // initialize private settings here ...
        this.title = Tian.i18n('txMainPanelTitle');
        this.apps = [];
    },

    draw: function() {
        Tian.Widget.prototype.draw.apply(this, arguments);
        
        this.div.className = 'txWidgetMainPanel txWidgetNoSelect';
        
        // create an div to hold all app icons
        this.mainDiv = document.createElement('div');
        this.mainDiv.className = 'txWidgetMainPanelContent';
        
        Tian.Event.observe(
            this.div, 
            "click", 
            Tian.Function.bindAsEventListener(this.onClick, this)
        );
        
        return this.div;
    },

    destroy: function() {
        // destroy all apps
        if (this.apps) {
            for(var i = this.apps.length - 1 ; i >= 0; i--) {
                this.delApp(this.apps[i]);
                this.apps[i].destroy();
            }
            this.apps = null;
        }
        
        // close the window if opened
        if (this.windowOpened) {
            this.window.close();
            this.window = null;
            this.windowOpened = false;
        }
        
        if (this.mainDiv) {
            this.mainDiv = null;
        }
        
        Tian.Event.stopObservingElement(this.div);
        
        // process parent destroying
        Tian.Widget.prototype.destroy.apply(this, arguments);
    },
    
    onClick: function(evt) {
        if (evt) {
            Tian.Event.stop(evt);                                        
        }
        
        if (this.windowOpened) {
            this.window.select();
            return;
        }
        
        if (!this.os) {
            return;
        }
        
        var wm = this.os.getWindowManager();
        
        // create a new plain window here
        // w h x and y can use settings stored in local db
        var ww = null, wh = null, wx = null, wy= null;
        ww = Tian.DB.get(Tian.md5(this.title + '_ww'));
        wh = Tian.DB.get(Tian.md5(this.title + '_wh'));
        wx = Tian.DB.get(Tian.md5(this.title + '_wx'));
        wy = Tian.DB.get(Tian.md5(this.title + '_wy'));
        this.window = wm.createWindow({
            title: this.title,
            centered: true,
            state: 'window',
            width: ww ? ww : this.width,
            height: wh ? wh : this.height,
            x: wx ? wx : null,
            y: wy ? wy : null,
            iconImageURL: (this.getOS().getImagePath() + 'main_icon.png')
        });
        this.windowOpened = true;
        
        // set window content
        this.window.getComponent('content').innerHTML = '';
        this.window.getComponent('content').appendChild(this.mainDiv);
        this.window.getComponent('content').style.overflow = 'auto';
        
        // listen window events
        this.window.onclose = Tian.Function.bind(this.onWinClose, this);
        this.window.onmove = Tian.Function.bind(this.onWinMove, this);
        this.window.onresize = Tian.Function.bind(this.onWinResize, this);
    },
    
    // closure
    onWinClose: function (isClose) {
        this.window = null;
        this.windowOpened = false;
    },
    
    onWinMove: function (x, y) {
        // save status into local db
        Tian.DB.set(Tian.md5(this.title + '_wx'), x);
        Tian.DB.set(Tian.md5(this.title + '_wy'), y);
    },
    
    onWinResize: function (w, h, a) {
        // save status into local db
        switch (a) {
            case 'resize':
                Tian.DB.set(Tian.md5(this.title + '_ww'), w);
                Tian.DB.set(Tian.md5(this.title + '_wh'), h);
                break;
            case 'maximize':
                break;
            case 'restore':
                break;
        }
    },
    
    /**
     * APIMethod: addApp
     * To build a toolbar, you add a set of apps to it. addApp
     * lets you add a single app to the Main Panel.
     *
     * Parameters:
     * app - {<Tian.App>} App to add in the panel.
     */
    addApp: function(app) {
        if (app instanceof Tian.App) {
            app.setOS(this.os);
            this.mainDiv.appendChild(app.draw());
            this.apps.push(app);
        }
    },
    
    /**
     * APIMethod: delApp
     * Parameters:
     * app - {<Tian.App>} App to delete from the panel. The app is not destroyed here.
     */
    delApp: function(app) {
        if (app instanceof Tian.App) {
            this.mainDiv.removeChild(app.div);
            // do not destroy the app here, just remove it from the list
            Tian.Array.removeItem(this.apps, app);
            // close the window of app if opened
            if (app.active && app.window) {
                app.window.close();
                app.window = null;
                app.active = false;
            }
        }
    },
    
    // clear all apps
    clearApps: function() {
        // destroy all apps
        if (this.apps) {
            for(var i = this.apps.length - 1 ; i >= 0; i--) {
                this.delApp(this.apps[i]);
                this.apps[i].destroy();
            }
            this.apps = [];
        }
    },
    
    // return the apps array
    getAllApps: function() {
        return this.apps;
    },
    
    // may event handlers here ...
    
    CLASS_NAME: "Tian.Widget.MainPanel"
});

