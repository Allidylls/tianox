/**
 * @requires OS.js
 * @requires DB.js
 * @requires Lang.js
 */

/**
 * Class: Tian.App
 */

Tian.App = Tian.Class({
    // reference to Tian.OS
    os: null,
    
    /** 
     * Property: div 
     * {DOMElement} 
     */
    div: null,
    childTitle: null,
    childIcon: null,
    
    /**
    * Property: title  
    * {string}  This property is used for showing a tooltip over the  
    * App.  
    */ 
    title: '',
    
    // icon url of this App displaying in the main panel
    icon: '',
    
    // external web page url of this App
    page: '',
    
    // main window of this App
    // {jwim.Window} instance of jwim.Window
    window: null,
    
    // default width of window
    width: 450,
    
    // default height of window
    height: 250,
    
    // the embeded app
    theApp: null,

    /**
     * Constructor: Tian.App
     * Parameters:
     * options: {Object}, eg: {
     *               os: os,
     *               title: {'en': 'app', 'zh-CN': 'app'}, // or title: 'app'
     *               icon: 'url',
     *               page: 'url',
     *               width: 900,
     *               height: 500
     *           }
     */
    initialize: function (options) {
        Tian.extend(this, options);
        
        if (this.title) {
            if (typeof this.title == 'object') {
                var lang = Tian.Lang.getCode();
                if (typeof this.title[lang] == 'string') {
                    this.title = this.title[lang];
                } else {
                    // use first property of this object
                    for (var key in this.title) {
                        this.title = this.title[key] + '';
                        break;
                    }
                }
            } else {
                this.title += '';
            }
        } else {
            this.title = 'Unknwon App';
        }
    },

    /**
     * Method: destroy
     * The destroy method is used to perform any clean up before the control
     * is dereferenced.  Typically this is where event listeners are removed
     * to prevent memory leaks.
     */
    destroy: function () {
        // close the window if opened
        if (this.window) {
            this.window.close();
            this.window = null;
        }
        
        Tian.Event.stopObservingElement(this.div);
        
        // remove this div from parent node
        if (this.div.parentNode) {
            this.div.parentNode.removeChild(this.div);
        }
        this.div = null;
        this.childIcon = null;
        this.childTitle = null;
        this.os = null;
    },
  
    /**
     * Method: draw
     * The draw method is called when the App is ready to be displayed
     * on the page.  If a div has not been created one is created.  Apps
     * with a visual component will almost always want to override this method 
     * to customize the look of App. 
     *
     * Returns:
     * {DOMElement} A reference to the DIV DOMElement containing the App icon
     */
    draw: function () {
        if (!this.icon && this.os) {
            this.icon = this.os.getImagePath() + 'default_app_icon.png';
        }
        
        if (this.div == null) {
            this.div = document.createElement('div');
        }
        
        this.div.className = 'txApp';
        
        if (this.icon) {
            this.childIcon = document.createElement('img');
            this.childIcon.src = this.icon;
            this.div.appendChild(this.childIcon);
        }
        
        if (this.title) {
            this.childTitle = document.createElement('p');
            this.childTitle.innerHTML = this.title;
            this.div.appendChild(this.childTitle);
        }
        
        Tian.Event.observe(this.div, "click", Tian.Function.bindAsEventListener(this.onOpen, this));
        
        return this.div;
    },
    
    setOS: function(os) {
        if (!this.os) {
            this.os = os;
        }
    },
    
    getOS: function() {
        return this.os;
    },
    
    // create or show the window of this App
    onOpen: function (evt) {
        if (evt) {
            Tian.Event.stop(evt);                                        
        }
        
        // create or select window
        if (this.window) {
            this.window.select();
            return;
        }
        
        if (!this.os) {
            return;
        }
        
        var wm = this.os.getWindowManager();
        
        // create a new plain window here
        // ww wh wx and wy can use settings stored in local db
        var ww = null, wh = null, wx = null, wy= null;
        ww = Tian.DB.get(Tian.md5(this.title + '_ww'));
        wh = Tian.DB.get(Tian.md5(this.title + '_wh'));
        wx = Tian.DB.get(Tian.md5(this.title + '_wx'));
        wy = Tian.DB.get(Tian.md5(this.title + '_wy'));
        this.window = wm.createWindow({
            title: this.title,
            state: 'window',
            width: ww ? ww : this.width,
            height: wh ? wh : this.height,
            x: wx ? wx : null,
            y: wy ? wy : null,
            iconImageURL: this.icon
        });
        
        // listen window events
        this.window.onclose = Tian.Function.bind(this.onWinClose, this);
        this.window.onmove = Tian.Function.bind(this.onWinMove, this);
        this.window.onresize = Tian.Function.bind(this.onWinResize, this);
        
        // try to load the external App page
        // all apps must be running within an iframe
        if (this.page) {
            this.window.loadUrlX(this.page, Tian.Function.bind(this.onWinLoad, this));
        }
    },
    
    // set the app title
    setTitle: function(title) {
        if (title && title !== this.title) {
            this.title = title;
            this.childTitle.innerHTML = title;
            this.window && this.window.setTitle(title);
        }
    },
    
    // get the app title
    getTitle: function() {
        return this.title;
    },
        
    // set the app icon
    setIcon: function(icon) {
        if (icon && icon !== this.icon) {
            this.icon = icon;
            this.childIcon.src = icon;
            this.window && this.window.setIconImage(icon);
        }
    },
    
    // window event handlers
    onWinLoad: function(window) {
        if (!window) {
            return;
        }

        // run the embeded application
        var theFrame = window.getElement('theFrame');
        if (theFrame && theFrame.contentWindow &&
            typeof theFrame.contentWindow.tianMain === 'function') {
            this.theApp = theFrame.contentWindow.tianMain.call(
                theFrame.contentWindow,
                {app: this, win: window}
            );
        }
    },
    
    onWinClose: function() {
        this.window = null;
        this.theApp = null;
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

    CLASS_NAME: "Tian.App"
});
