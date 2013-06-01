/**
 * @requires Class.js
 */
// Class Tian.Window
// Tian Window System

Tian.Window = Tian.Class({
    id: '',
    
    // window manager
    wm: null,
    
    // extents and coordinates
    w: 0,
    h: 0,
    x: 0,
    y: 0,
    userW: 0,
	userH: 0,
	userX: 0,
	userY: 0,
	
	movable: false,
	alwaysOnTop: false,
	// dragging
	resizing: false,
	moving: false,
	// animation
	animating: false,
	
	titleText: '',
	title: null,
	titleSpan: null,
	
	iconImageURL: '',
	
	state: 'window', // window, iconized, maximized
	// prevous state
	prvState: '',
	
	// children
	win: null,
	content: null,
	taskbarIcon: null,
	taskbarIconSpan: null,
	taskbarIconImage: null,
	
	components: null,
	
	// content url
	currentUrl: '',
	closeConfirm: '',
	
	// callbacks
	onunload: null,
	onselect: null,
	onresize: null,
	onmove: null,
	oniconize: null,
	ondeselect: null,
	onclose: null,

    // constructor
    initialize: function(opts, manager) {
	    this.id = opts.id || Tian.createUniqueID();
        this.wm = manager;	
	    this.w = (typeof opts.width == 'number' ?  opts.width : manager.opts.defaultWidth);
	    this.h = (typeof opts.height == 'number' ?  opts.height : manager.opts.defaultHeight);
	    this.x = (typeof opts.x == 'number' ?  opts.x : manager.opts.defaultX);
	    this.y = (typeof opts.y == 'number' ?  opts.y : manager.opts.defaultY);
	    if (opts.centered) {
	        this.x = (manager.getContainerWidth() - this.w)/2;
	        this.y = (manager.getContainerHeight() - this.h)/2;
	        if (this.x < 0) {
	            this.x = 0;
	        }
	        if (this.y < 0) {
	            this.y = 0;
	        }
	    }
	    this.userW = this.w;
	    this.userH = this.h;
	    
	    this.movable = (typeof opts.movable == 'undefined' ? manager.opts.movable : opts.movable);
	    this.alwaysOnTop = opts.alwaysOnTop || false;
	    this.titleText = opts.title || '';
	    this.iconImageURL = opts.iconImageURL || '';
	
	    this.components = {
		    titlebar:   null,
		    window: null,
		    content:    null,
		    close:  null,
		    iconizer:   null,
		    maximizer:  null,
		    loading:    null,
		    zoomer: null,
		    icon:   null
	    };
    },
    
    // destructor
    destroy: function() {
    },
    
    attachEvents: function() {
        var span = this.titleSpan;
        if (span) {
            Tian.Event.observe(span, 'mousedown',  Tian.Function.bind(this.onTitleMouseDown, this));
            Tian.Event.observe(span, 'touchstart', Tian.Function.bind(this.onTitleMouseDown, this));
            Tian.Event.observe(span, 'mousemove', Tian.Function.bind(this.onTitleMouseMove, this));
            Tian.Event.observe(span, 'touchmove', Tian.Function.bind(this.onTitleMouseMove, this));
            Tian.Event.observe(span, 'mouseup',  Tian.Function.bind(this.onTitleMouseUp, this));
            Tian.Event.observe(span, 'mouseout', Tian.Function.bind(this.onTitleMouseUp, this));
            Tian.Event.observe(span, 'touchend', Tian.Function.bind(this.onTitleMouseUp, this));
        }
        var close = this.components.close;
        if (close) {
            Tian.Event.observe(close, 'click', Tian.Function.bind(this.onCloseClick, this));
        }
        var maximizer = this.components.maximizer;
        if (maximizer) {
            Tian.Event.observe(maximizer, 'click', Tian.Function.bind(this.onMaxClick, this));
        }
        var iconizer = this.components.iconizer;
        if (iconizer) {
            Tian.Event.observe(iconizer, 'click', Tian.Function.bind(this.onMinClick, this));
        }
        var zoomer = this.components.zoomer;
        if (zoomer) {
            Tian.Event.observe(zoomer, 'mousedown',  Tian.Function.bind(this.onZoomMouseDown, this));
            Tian.Event.observe(zoomer, 'touchstart', Tian.Function.bind(this.onZoomMouseDown, this));
            Tian.Event.observe(zoomer, 'mousemove', Tian.Function.bind(this.onZoomMouseMove, this));
            Tian.Event.observe(zoomer, 'touchmove', Tian.Function.bind(this.onZoomMouseMove, this));
            Tian.Event.observe(zoomer, 'mouseup',  Tian.Function.bind(this.onZoomMouseUp, this));
            Tian.Event.observe(zoomer, 'mouseout', Tian.Function.bind(this.onZoomMouseUp, this));
            Tian.Event.observe(zoomer, 'touchend', Tian.Function.bind(this.onZoomMouseUp, this));
        }
        if (this.win) {
            Tian.Event.observe(this.win, 'click', Tian.Function.bind(this.onWinClick, this));
        }
    },
    
    detachEvents: function() {
        var span = this.titleSpan;
        if (span) {
            Tian.Event.stopObservingElement(span);
        }
        var close = this.components.close;
        if (close) {
            Tian.Event.stopObservingElement(close);
        }
        var maximizer = this.components.maximizer;
        if (maximizer) {
            Tian.Event.stopObservingElement(maximizer);
        }
        var iconizer = this.components.iconizer;
        if (iconizer) {
            Tian.Event.stopObservingElement(iconizer);
        }
        var zoomer = this.components.zoomer;
        if (zoomer) {
            Tian.Event.stopObservingElement(zoomer);
        }
        if (this.win) {
            Tian.Event.stopObservingElement(this.win);
        }
    },
    
    // event handlers
    onTitleMouseDown: function(e) {
        if (this.animating || this.state === 'maximized') return;
        Tian.Event.stop(e);
        this.select();
    
	    if (!this.movable) {
	        return;
	    }
	
        this.moving = true;
    
	    if (!e) {
	        e = window.event;
	    }
        var xy = this.wm.getEventXY(e, this.titleSpan);
	    this.wm.mouse.click.x = xy.x - this.x;
	    this.wm.mouse.click.y = xy.y - this.y;
    },
    
    onTitleMouseMove: function(e) {
        if (this.animating || this.state === 'maximized' || !this.moving) return;
        Tian.Event.stop(e);
    
        // move window
	    if(!e) {
	        e = window.event;
	    }
	    this.state = 'window';
	
	    var xy = this.wm.getEventXY(e, this.titleSpan);
	    this.wm.mouse.cur.x = xy.x;
	    this.wm.mouse.cur.y = xy.y;
	
	    var y = (this.wm.mouse.cur.y - this.wm.mouse.click.y);
	    var x = (this.wm.mouse.cur.x - this.wm.mouse.click.x);
	
	    if(this.wm.opts.containerBoundaries > 0) {
		    // these vals may be cached while moving..
		    var minx = -1*(this.getWidth() - this.wm.opts.containerBoundaries);
		    var maxx = this.getContainerWidth() - this.wm.opts.containerBoundaries;
		    var maxy = this.getContainerHeight() - this.wm.opts.containerBoundaries;
		    if (x < minx) x = minx;
		    if (x > maxx) x = maxx;		
		    if (y > maxy) y = maxy;
	    }
	    if (this.wm.opts.containerBoundaries > -1) {		
		    if(y < 0) y = 0;
	    }
	    this.win.style.left = x + 'px';
	    this.win.style.top  = y + 'px';

	    if(typeof this.onmove === 'function') {
	        this.onmove(x,y);
        }
    },
    
    onTitleMouseUp: function(e) {
        if (this.animating || this.state === 'maximized' || !this.moving) return;
        Tian.Event.stop(e);
        this.moving = false;
    
	    if(this.state === 'window') { // if state=='window'  resize or move have been called
		    this.w = parseInt(this.win.style.width, 10);
		    this.h = parseInt(this.win.style.height, 10);
		    this.x = parseInt(this.win.style.left, 10);
		    this.y = parseInt(this.win.style.top, 10);
		    this.userW = this.w;
		    this.userH = this.h;
		    this.userX = this.x
		    this.userY = this.y
	    }
    },
    
    onZoomMouseDown: function(e) {
        if (this.animating || this.state === 'maximized') return;
        Tian.Event.stop(e);
        this.select();
        this.resizing = true;
    
	    if (!e) {
	        e = window.event;	
	    }
	
        var xy = this.wm.getEventXY(e, this.components.zoomer);
	    this.wm.mouse.click.rx = xy.x;
	    this.wm.mouse.click.ry = xy.y;
	    this.wm.mouse.click.x = xy.x - this.x;
        this.wm.mouse.click.y = xy.y - this.y;
    },
    
    onZoomMouseMove: function(e) {
        if (this.animating || this.state === 'maximized' || !this.resizing) return;
        Tian.Event.stop(e);
	
	    this.state = 'window';
	    
	    if(!e) {
	        e = window.event;
	    }
	    var xy = this.wm.getEventXY(e, this.components.zoomer);
	    this.wm.mouse.cur.x = xy.x;
	    this.wm.mouse.cur.y = xy.y;
	
	    // move verticaly
        var y = (this.wm.mouse.cur.y - this.wm.mouse.click.y);
	    if (this.wm.opts.containerBoundaries > 0) {
		    // these vals may be cached while moving..
		    var maxy = this.getContainerHeight() - this.wm.opts.containerBoundaries;
		    if (y > maxy) y = maxy;
	    }
	    if (this.wm.opts.containerBoundaries > -1) {
		    if(y < 0) y = 0;
	    }
	    this.win.style.top  = y + 'px';

	    // resize
	    var h = (this.h + (this.wm.mouse.click.ry - this.wm.mouse.cur.y));
	    var w = (this.w + (this.wm.mouse.cur.x - this.wm.mouse.click.rx));
	    if (w < 90) w = 90;
	    if (h < 50) h = 50;
	    this._setSize(w, h, true, 'resize');
    },

    onZoomMouseUp: function(e) {
        if (this.animating || this.state === 'maximized' || !this.resizing) return;
        Tian.Event.stop(e);
        this.resizing = false;
    
	    if(this.state === 'window') { // if state=='window'  resize or move have been called
		    this.w = parseInt(this.win.style.width, 10);
		    this.h = parseInt(this.win.style.height, 10);
		    this.x = parseInt(this.win.style.left, 10);
		    this.y = parseInt(this.win.style.top, 10);
		    this.userW = this.w;
		    this.userH = this.h;
		    this.userX = this.x
		    this.userY = this.y
	    }
    },
    
    onCloseClick: function(e) {
        Tian.Event.stop(e);
        this.select();
    
        if (this.closeConfirm) {
            if (window.confirm(this.closeConfirm)) {
                this.close();
            }
        } else {
            this.close();
        }
    },
    
    onMaxClick: function(e) {
        Tian.Event.stop(e);
        this.select();
        this._maximize();
    },
    
    onMinClick: function(e) {
        Tian.Event.stop(e);
        this.select();
        this._iconify();
    },
    
    onWinClick: function() {
        this.select();
    },
    
    // public methods
    
    getElement: function(eid, o) {
	    if (!o) o = this.content;
	    for (var a=0; a<o.childNodes.length; a++) {
		    if (o.childNodes[a].getAttribute && o.childNodes[a].getAttribute("data-wid") == eid) {
			    return o.childNodes[a];
		    }
		    var t = this.getElement(eid,o.childNodes[a]);
		    if (t) return t;
	    }
	    return null;
    },
    
    setState: function(state) {
	    switch (state){
		case 'maximized':
			if (this.state=='maximized') {
			    return;
			}
			this._maximize();
			return;
		case 'window':
			if (this.state=='maximized') {
				this._maximize();
				return;
			}
			this.state = 'window';
			this.select();
			return;
		case 'icon':
			this._iconify();
			return;
		case 'hidden':
			this.hide();
			return;
	    }
    },
    
    setSize: function(w, h) {
	    this.state = 'window';
	    this._setSize(w, h, false, 'resize');
	    this.userW = w;
	    this.userH = h;
    },
    
    autoSize: function() { // maybe in the future...
	    this.win.style.height = 0 + 'px';
	    this.win.style.width =  0 + 'px';
	    this.content.style.height =0 + 'px';
	    this.content.style.width = 0 + 'px';
	    var w = this.content.scrollWidth + 30;
		var h = this.content.scrollHeight + 70;
	    this.setSize(w, h);
	    this.state = 'window';
    },
    
    setPosition: function(x, y) {
	    this._setPosition(x, y);
	    this.userX = x;
	    this.userY = y ;
	    if (typeof this.onmove === 'function') this.onmove(x, y);
    },
    
    moveToCenter: function() {
        var x,y;
        x = (this.getContainerWidth()-this.w)/2;
        y = (this.getContainerHeight()-this.h)/2;
        if (y<0) y=0;
        this.setPosition(x,y);
    },
    
    close: function() {
	    this.wm._destroyWindow(this);
    },
    
    select: function() {
	    this.wm._selectWindow(this);
    },
    
    hide: function() { 
	    this.prvState = this.state;
	    this.state = 'hidden';
	    this.win.style.visibility = 'hidden';
	    this.win.style.display = 'none';
    },
    
    show: function () {
	    this.state = this.prvState;
	    this.win.style.visibility = 'visible';
	    this.win.style.display = '';
    },
    
    attachTo: function(el) {
	    el = el || this.wm.opts.container;
	    el.appendChild(this.win);
    },
    
    setContent: function(html, element) {
	    if (!element) {
		    element = this.content;
	    }
	    element.innerHTML = html.replace(/<script.*?>[\s\S]*?<\/.*?script>/gi,"");
    },
    
    // load page cross-domain with iframe
    loadUrlX: function(url, onload) {
        var win = this;
	    win.showLoading();
	    
	    var content = win.content;
	    content.innerHTML = '';
	
	    // add an iframe tag into content div
	    var frame = document.createElement('iframe');
	    frame.className = win.wm.opts.classFrame;
	    frame.setAttribute('data-wid', 'theFrame');
	    frame.src = url;
	    content.appendChild(frame);
	    
	    var on_frame_load = function () {
	        win.currentUrl = url;
	        win.showLoading(false);
	        // call the outside handler
	        if(typeof onload === 'function') {
	            onload.apply(win, [win]);
	        }
	        // clear memory
	        Tian.Event.stopObservingElement(frame);
	        frame = null;
	        win = null;
	    };
	    
        Tian.Event.observe(frame, 'load', on_frame_load);
    },
    
    showLoading: function(show) {
        var is_show = (typeof show == 'undefined' || show);
        var style = this.loading.style;
        style.display = is_show ? '' : 'none';
        style.visibility = is_show ? 'visible' : 'hidden';
    },
    
    setTitle: function(title) {
	    if (title) {
		    this.titleText = title;
		    if (this.titleSpan) this.titleSpan.innerHTML = title;
		    if (this.taskbarIcon) this.taskbarIcon.setAttribute('title', title);
		    if (this.taskbarIconSpan) this.taskbarIconSpan.innerHTML = title;
	    }
    },
    
    setIconImage: function(iconUrl) {
        if (iconUrl && iconUrl !== this.iconImageURL) {
            this.iconImageURL = iconUrl;
            if (this.taskbarIconImage) this.taskbarIconImage.src = iconUrl;
        }
    },
    
    setCloseConfirm: function (str) {
        this.closeConfirm = str;
    },
    
    setMovable: function(v) { 
	    this.movable = v;
    },
    
    setAlwaysOnTop: function(v) {
	    if(v) this.select();
	    this.alwaysOnTop = v;
    },
    
    isMovable: function() { 
	    return this.movable;
    },
    
    isAlwaysOnTop: function() { 
	    return this.alwaysOnTop;
    },
    
    isSelected: function() {
        return (this === this.getManager().getSelectedWindow()); 
    },
    
    getManager: function(){
	    return this.wm;
    },
    
    getComponent: function(elem) {
	    return this.components[elem];
    },
    
    getWidth: function() { 
	    return this.w;
    },
    
    getHeight: function() {
	    return this.h;
    },
    
    getX: function() { 
	    return this.x;
    },

    getY: function() { 
	    return this.y;
    },
    
    getContentWidth: function() { 
	    return parseInt(this.content.style.width, 10);
    },

    getContentHeight: function() { 
	    return parseInt(this.content.style.height, 10);
    },
    
    getId: function() { 
	    return this.id;
    },

    getTitle: function() {
	    return this.titleText;
    },

    getCurrentUrl: function() { 
	    return this.currentUrl;
    },

    getState: function() { 
	    return this.state;
    },
    
    getContainer: function() { 
	    return this.win.parentNode;
    },
    
    getContainerWidth: function() { 
	    var c = this.getContainer();
	    if( c === document.body) {
	        return this.wm.getBodySize().width;
		}
	    return c.clientWidth;
    },
    
    getContainerHeight: function() { 
	    var c =this.getContainer();
	    if( c === document.body) {
	        return this.wm.getBodySize().height;
        }
	    return c.clientHeight;
    },
    
    // private methods
    
    _setPosition: function(x, y) {
	    this.win.style.left = x + 'px';
	    this.win.style.top = y + 'px';
	    this.x = x;
	    this.y = y ;
    },
    
    // action is used to tell enevn handler what fired the event.
    // if action=='' event is NOT fired
    _setSize: function(w, h, isResize, action) {
	    this.win.style.height = h +'px';
	    this.win.style.width = w +'px';
	    
	    var contw = w - (this.content.offsetWidth - parseInt(this.content.style.width, 10));
	    var conth = h - (this.content.offsetHeight- parseInt(this.content.style.height, 10)) - this.content.offsetTop;
	    this.content.style.height = conth + 'px';
	    this.content.style.width = contw + 'px';
	    
	    if(!isResize){
		    this.w = w;
		    this.h = h;
	    }

	    if(action && typeof this.onresize === 'function')  this.onresize(w,h,action);
    },
    
    _maximize: function() {
        // just wait done the last action
        if (this.animating) return;
        
		var interval = 20;
	    var counter = 10;
	    var win = this;
		var Dw = this.win.offsetWidth - parseInt(this.win.style.width);
		var Dh = this.win.offsetHeight - parseInt(this.win.style.height);
		var ew = this.getContainerWidth() - Dw;
		var eh = this.getContainerHeight() - Dh;
		var step_x = Math.abs(0-this.userX)/counter;
		var step_y = Math.abs(0-this.userY)/counter;
		var step_w = Math.abs(ew-this.userW)/counter;
		var step_h = Math.abs(eh-this.userH)/counter;
		var state = this.state;
		var animator = function () {
		    counter -= 1;
		    var idx = state === 'maximized' ? (10-counter) : counter;
	        win._setPosition(0 + idx*step_x, 0 + idx*step_y);
	        win._setSize(ew - idx*step_w, eh - idx*step_h, false);
	        if (counter > 0) {
	            setTimeout(animator, interval);
	        } else {
	            // done animation
	            if (state === 'maximized') {
		            win._setPosition(win.userX, win.userY);
		            win._setSize(win.userW, win.userH, false, 'restore');
		            win.state = 'window';
		        } else {
		            win._setPosition(0, 0);
		            win._setSize(ew, eh, false, 'maximize');
		            win.state = 'maximized';
		        }
	            win.animating = false;
	            win = null;
	            animator = null;
	        }
		};
		this.animating = true;
		setTimeout(animator, interval);
    },
    
    _iconify: function() {
        // just wait done the last action
        if (this.animating) return;
        
	    var ex = this.taskbarIcon.offsetLeft + this.taskbarIcon.offsetParent.offsetLeft;
	    var ey = this.taskbarIcon.offsetTop + this.taskbarIcon.offsetParent.offsetTop;
	    var interval = 20;
	    var counter = 10;
	    var step_x = (ex-this.userX)/counter;
	    var step_y = (ey-this.userY)/counter;
	    var step_w = this.userW/counter;
	    var step_h = this.userH/counter;
	    var state = this.state;
	    var win = this;
	    var animator = function () {
	        counter -= 1;
	        var idx = counter;
	        if (state === 'icon') {
	            idx = 10 - counter;
	        }
	        win._setPosition(ex - idx*step_x, ey - idx*step_y);
	        win._setSize(idx*step_w, idx*step_h, false);
	        
	        if (counter > 0) {
	            setTimeout(animator, interval);
	        } else {
	            // done animation
	            win.animating = false;
	            if (state === 'icon') {
	                win.state = 'window';
	            } else {
	                win.hide();
	                win.state = 'icon';
	                var fw = win.wm._getFirstVisibleWindow();
	                if (fw) {
	                    fw.select();
	                }
	                if(typeof win.oniconize === 'function') {
	                    win.oniconize();
	                }
	            }
	            win = null;
	            animator = null;
	        }
        };
        
	    if (this.isSelected()) { // minimize
	        if(!this.wm.taskbar || this.state === 'icon') {
	            return;
	        }
	        if (!this.taskbarIcon) {
	            this._createTaskbarIcon();
	        }
	        this.taskbarIcon.className = this.wm.opts.classIcon;
	        if(this.wm.selectedWindow === this) {
	            this.wm.selectedWindow = null;
	        }
	        // do an animation current -> icon
	        this.animating = true;
	        setTimeout(animator, interval);
	    } else if (this.state == 'icon') { // restore
	        this.select();
	        // do an animation icon -> user xy
	        this.animating = true;
	        setTimeout(animator, interval);
	    } else {
	        this.select();
	    }
    },
    
    _createTaskbarIcon: function() {
	    if (!this.wm.taskbar) return;
	    
	    var icon = document.createElement('div');
	    icon.className = this.wm.opts.classIcon;
	    icon.setAttribute('title',this.titleText);
	    icon.style.width = this.wm.opts.iconWidth + 'px';
	    
	    var icon_image = document.createElement('img');
		icon_image.src = this.iconImageURL;
		icon_image.setAttribute('title', this.titleText);
		icon.appendChild(icon_image);
		this.taskbarIconImage = icon_image;

        var icon_span = document.createElement('span');
	    icon_span.innerHTML = this.titleText;
	    icon.appendChild(icon_span);
	    this.taskbarIconSpan = icon_span;
	
	    this.wm.taskbar.appendChild(icon);
	    this.components.icon = icon;
	    
	    if (this.wm.opts.resizeIcons) this.wm._resizeIcons();

	    Tian.Event.observe(icon, 'click', Tian.Function.bind(this.onTaskbarIconClick, this));
	    this.taskbarIcon = icon;
    },
    
    _removeTaskbarIcon: function() {
        Tian.Event.stopObservingElement(this.taskbarIcon);
	    // note that taskbaricon may be attached somewhere else at runtime
	    this.taskbarIcon.parentNode.removeChild(this.taskbarIcon);
	    this.taskbarIcon = null;
	    if (this.wm.opts.resizeIcons) this.wm._resizeIcons();
    },
    
    onTaskbarIconClick: function(e) {
        Tian.Event.stop(e);
	    this._iconify();
    },
    
    _unload: function() {
	    if(typeof this.onunload === 'function') {
	        if (!this.onunload()) {
	            return false;
	        }
	    }
	    // clear all event listeners
	    this.detachEvents();
	    this.onunload = null;
	    this.onselect = null;
	    this.onresize = null;
	    this.onmove = null;
	    this.oniconize = null;
	    this.ondeselect = null;
	
	    return true;
    },

    CLASS_NAME: "Tian.Window"
});

