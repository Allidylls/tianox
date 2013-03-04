/**
 * @requires Class.js
 * @requires Window.js
 */
//
// Class Tian.Winager
// Tian Window Manager

Tian.Winager = Tian.Class({
    // array of windows
    windows: null,
    
    // selected window reference
    winSelected: null,
    
    // dragging window reference
    winDragging: null,
    
    // mouse position cache
    mouse: null,
    
    opts: null,
    
    // constructor
    initialize: function(options) {
        this.windows = [];
        this.mouse = {
            cur: {x: 0, y: 0},
            click: {x: 0, y: 0}
        };
        
        // default options
        this.opts = {
            classWindow: 'txWindow',
		    classActiveWindow: 'txWindowActive',
		    classContent: (Tian.BROWSER === 'safari' ? 'txWinContentSafari' : 'txWinContent'),
		    classFrame: 'txWinFrame',
		    classTitle: 'txWinTitle txWidgetNoSelect',
		    classIcon: 'txWinTaskBarIcon',
		    classActiveIcon: 'txWinTaskBarIconActive',
		    baseZIndex: 5000,
		    taskbar: null,
		    container: document.body,
		    iconImageURL: '',
		    defaultX: 32,
		    defaultY: 32,
		    defaultWidth: 500,
		    defaultHeight: 300,
		    shiftOffset: 32,
		    movable: true,
		    httpErrorHandler: null,
		    containerBoundaries: 64,
		    iconWidth: 36,
		    resizeIcons: true,
		    afterLoad: null,
		    cacheXHR: false
        };
        
        Tian.extend(this.opts, options);
        
        // check resize
        Tian.Event.observe(window, 'resize', Tian.Function.bind(this.checkResize, this));
    },
    
    destroy: function() {
        Tian.Event.stopObserving(window, 'resize', Tian.Function.bind(this.checkResize, this));
        
        // close all windows
        var wins = this.getAllWindows();
        for (var i=0; i< wins.length; i++) {
            wins[i].close();
            wins[i] = undefined;
        }
    },
    
    checkResize: function() {
        for(var a=0; a< this.windows.length; a++) {
            var window_a = this.windows[a];
            if(window_a.state != 'maximized') {
                continue;
            }
            var Dw = window_a.win.offsetWidth - parseInt(window_a.win.style.width);
            var Dh = window_a.win.offsetHeight - parseInt(window_a.win.style.height);	
            var w = window_a.getContainerWidth() - Dw;
            var h = window_a.getContainerHeight() - Dh;
		
		    window_a._setSize(w,h,false,'resize');	
        }
    
        this._resizeIcons();
    },
    
    _resizeIcons: function() {
        var gs = function (e,p){
            var n = parseInt(Tian.getStyle(e,p));
            return ( isNaN(n) ? 0 : n );
        };
	
        var a, icns = [];
        //save icons attached to default icons container
        for(a=0; a<this.windows.length; a++) {
            var window_a = this.windows[a];
            if(window_a.taskbarIcon && window_a.taskbarIcon.parentNode == this.opts.taskbar) {
                icns.push(window_a.taskbarIcon);
            }
        }

        if(icns.length < 1) return;

        var tbw = this.opts.taskbar.clientWidth - gs(this.opts.taskbar,'padding-left') -
                    gs(this.opts.taskbar,'padding-right') - 1;
        var iw = parseInt(tbw/icns.length);

        for(a=0; a<icns.length;a++) {
            var icns_a = icns[a];
            var Dw = ( icns_a.offsetWidth + gs(icns_a,'margin-left') +
                    gs(icns_a,'margin-right') ) - gs(icns_a,'width');		
            if( (this.opts.iconWidth + Dw) > iw){
                icns_a.style.width = (iw-Dw-1) + 'px';
            } else {
                icns_a.style.width = this.opts.iconWidth + 'px';
            }
        }
    },
    
    createWindow: function(opts) {
	    opts = opts || {};

        // one window one id
	    if(opts.id && this.getWindow(opts.id) != null) {
	        return null;
	    }
	
	    var container = opts.container || this.opts.container;
	    var state = opts.state || this.opts.defaultState;
	
	    var w = new Tian.Window(opts, this);
	
	    w.win = document.createElement('div');
    	w.content = document.createElement('div');

	    if (this.opts.shiftOffset > 0) {
		    var a;
		    do {
			    for(a=0; a<this.windows.length; a++){
				    var p = this.windows[a];
				    if( (p.x===w.x || p.userX===w.x) && (p.y===w.y || p.userY===w.y) ){
					    w.x += this.opts.shiftOffset;
					    w.y += this.opts.shiftOffset;
					    if (w.x + w.w > this.getContainerWidth()) {
					        w.x = this.opts.defaultX;
					    }
					    if (w.y + w.h > this.getContainerHeight()) {
					        w.y = this.opts.defaultY;
					    }
					    break;
				    }
			    }
		    } while(a != this.windows.length);
	    }

	    w.userX = w.x;
	    w.userY = w.y;
	    w.win.className = this.opts.classWindow;
	    w.win.style.cssText = "z-index:"+this.opts.baseZIndex+";position:absolute;top:"+(w.y)+"px;left:"+(w.x)+"px;";				
	
	    //margins and position on content are not allowed
	    // IMPORTANT: init width n height
	    w.content.className = this.opts.classContent;
	    w.content.style.cssText = 'width:0px;height:0px';
	
		w.title = document.createElement('div');
		w.title.className = this.opts.classTitle;
		
		// icon image
		w.components.iconImage = document.createElement('img');
		w.components.iconImage.className = 'txWinIconImage';
		w.components.iconImage.src = w.iconImageURL;
		w.title.appendChild(w.components.iconImage);
		// title text
		w.titleSpan = document.createElement('div');
		w.titleSpan.className = 'txWinTitleText';
		w.titleSpan.innerHTML = w.titleText;
		w.title.appendChild(w.titleSpan);
		// close button
	    w.components.close = document.createElement('div');	
		w.components.close.className = 'txWinCloseBox';
		w.title.appendChild(w.components.close);
		// maximize button
		w.components.maximizer = document.createElement('div');		
		w.components.maximizer.className = 'txWinMaxBox';
		w.title.appendChild(w.components.maximizer);
		// iconize button
		if(this.opts.taskbar) {
			w.components.iconizer = document.createElement('div');			
			w.components.iconizer.className = 'txWinMinBox';
			w.title.appendChild(w.components.iconizer);
		}
		
		w.win.appendChild(w.title);
		w.components.titlebar = w.title;

	    w.win.appendChild(w.content);
	    w.components.content = w.content;
	    // loading image
	    w.loading = document.createElement('div');
	    w.loading.className = 'txWinLoading';
	    if(w.title) {
		    w.title.appendChild(w.loading);
        } else {
	        w.win.appendChild(w.loading);
	    }
	    w.components.loading = w.loading;

	    container.appendChild(w.win);
	    w.components.window = w.win;
	    w._setSize(w.w,w.h,false,'');
	    this.windows.push(w);
	
	    if(this.opts.taskbar) {
	        w._createTaskbarIcon();
	    }
	
	    this._selectWindow(w, true);
	    if(state != 'window') {
	        w.setState(state);
	    }
    
        w.attachEvents();
        w.closeConfirm = opts.closeConfirm || '';
    
	    return w;
    },
    
    getWindow: function(id) {
        var a
	    for(var a=0; a<this.windows.length; a++){
	        var win = this.windows[a];
		    if(win.id == id) {
		        return win;
		    }
	    }
	    return null;
    },
    
    getSelectedWindow: function() { 
	    return this.selectedWindow;
    },
    
    getAllWindows: function() {
	    var ret=[];
	    for(var a = this.windows.length-1; a >=0  ; a--){
		    ret.push(this.windows[a]);
	    }
	    return ret;
    },
    
    getContainerHeight: function() {
	    if(this.opts.container === document.body) {
	        return this.getBodySize().height;
	    }
	    return this.opts.container.clientHeight;
    },
    
    getContainerWidth: function() {
	    if(this.opts.container == document.body) {
	        return this.getBodySize().width;
	    }
	    return this.opts.container.clientWidth;
    },
    
    _getFirstVisibleWindow: function() {
	    for(var a = (this.windows.length-1); a>=0 ; a--) {
	        var win = this.windows[a];
		    if(win.win.style.visibility != 'hidden') return win;
	    }
	    return null;
    },
    
    _selectWindow: function(win) {
	    if (win == this.selectedWindow /*|| !win.scope*/) return;
	    if (this.selectedWindow && this.selectedWindow.ondeselect) this.selectedWindow.ondeselect();
		
	    if (!win.alwaysOnTop) {
		    for (var a=0; a< this.windows.length; a++) {
			    if (this.windows[a] == win) {
				    var tmp = this.windows.splice(a,1);
				    for (var b=this.windows.length-1; b>=0; b--) {
					    if (!this.windows[b].alwaysOnTop) break;
					}
				    this.windows.splice(b+1,0,tmp[0]);
				    break;
			    }
		    }
	    }
	
	    for (var a=0; a< this.windows.length; a++) { // no need to restack all windows...
	        var window_a = this.windows[a];
		    window_a.win.style.zIndex = (this.opts.baseZIndex + a);
		    window_a.win.className = this.opts.classWindow;
		    if (window_a.taskbarIcon) window_a.taskbarIcon.className = this.opts.classIcon;
		    if (window_a.components.close) window_a.components.close.className = 'txWinCloseBox';
	    }
	    
	    win.win.style.display = '';
	    win.win.style.visibility = 'visible';
	    win.win.className = this.opts.classActiveWindow;
	    if (win.taskbarIcon) win.taskbarIcon.className = this.opts.classActiveIcon;
	    if (win.components.close) win.components.close.className = 'txWinCloseBoxActive';
	    this.selectedWindow = win;
	    if(win.state=='icon' || win.state=='hidden'){
		    win.state = win.prvState;
		    win.prvState = null;
	    }
	    if (win.onselect) win.onselect();
    },
    
    _destroyWindow: function(w) {
	    for (var a=0; a< this.windows.length; a++) {
	        var win_a = this.windows[a];
		    if (win_a == w) {
			    if (!win_a._unload(false)) {
			        return false;
			    }
			
			    //this.opts.container.removeChild(this.windows[a].win);
			    win_a.getContainer().removeChild(win_a.win);
			    if (win_a.taskbarIcon != null) {				
				    win_a._removeTaskbarIcon();
			    }
			    // save a reference to removed win to handle onclose() event
			    var closed = this.windows.splice(a,1)[0];
			    for (var b=0; b< this.windows.length; b++) {
				    this.windows[b].win.style.zIndex = (this.opts.baseZIndex + b);
			    }
			    if(typeof closed.onclose === 'function') {
			        closed.onclose();
			        closed.onclose = null;
			    }
			    closed = null;	
			
			    var fw = this._getFirstVisibleWindow();
			    if (fw) fw.select();
			
			    return;
		    }
	    }
	
	    return null;
    },
    
    // utilities
    handleBrowserEvent: function(evt) {
        // add clientX & clientY to all events - corresponds to average x, y
        var touches = evt.touches;
        if (touches && touches[0]) {
            var x = 0;
            var y = 0;
            var num = touches.length;
            var touch;
            for (var i=0; i<num; ++i) {
                touch = Tian.Event.getTouchClientXY(touches[i]);
                x += touch.clientX;
                y += touch.clientY;
            }
            evt.clientX = x / num;
            evt.clientY = y / num;
        }
        
        return evt;
    },
    
    getEventXY: function(evt, element) {
        evt = this.handleBrowserEvent(evt);
        
        if (!element.scrolls) {
            var viewportElement = Tian.getViewportElement();
            element.scrolls = [
                viewportElement.scrollLeft,
                viewportElement.scrollTop
            ];
        }

        if (!element.lefttop) {
            element.lefttop = [
                (document.documentElement.clientLeft || 0),
                (document.documentElement.clientTop  || 0)
            ];
        }
        
        if (!element.offsets) {
            element.offsets = Tian.pagePosition(element);
        }

        var xy = {
            x: (evt.clientX + element.scrolls[0]) - element.offsets[0] - element.lefttop[0], 
            y: (evt.clientY + element.scrolls[1]) - element.offsets[1] - element.lefttop[1]
        };
        
        return xy;
    },
    
    getBodySize: function() {
	    var w = (window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth);
	    var h = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
	    return { width: w, height: h };
    },
    
    CLASS_NAME: "Tian.Winager"
});

