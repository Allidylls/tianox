// @requires Tian.js
// @requires Class.js
// @requires Function.js

//=============================================================
// Namespace: Tian.Event
// Utility functions for event handling.
//-------------------------------------------------------------

Tian.Event = {

    /** 
     * Property: observers 
     * {Object} A hashtable cache of the event observers. Keyed by
     * element._eventCacheID 
     */
    observers: false,
    
    /**
     * Constant: KEY_SPACE
     * {int}
     */
    KEY_SPACE: 32,
    
    /** 
     * Constant: KEY_BACKSPACE 
     * {int} 
     */
    KEY_BACKSPACE: 8,

    /** 
     * Constant: KEY_TAB 
     * {int} 
     */
    KEY_TAB: 9,

    /** 
     * Constant: KEY_RETURN 
     * {int} 
     */
    KEY_RETURN: 13,

    /** 
     * Constant: KEY_ESC 
     * {int} 
     */
    KEY_ESC: 27,

    /** 
     * Constant: KEY_LEFT 
     * {int} 
     */
    KEY_LEFT: 37,

    /** 
     * Constant: KEY_UP 
     * {int} 
     */
    KEY_UP: 38,

    /** 
     * Constant: KEY_RIGHT 
     * {int} 
     */
    KEY_RIGHT: 39,

    /** 
     * Constant: KEY_DOWN 
     * {int} 
     */
    KEY_DOWN: 40,

    /** 
     * Constant: KEY_DELETE 
     * {int} 
     */
    KEY_DELETE: 46,


    /**
     * Method: element
     * Cross browser event element detection.
     * 
     * Parameters:
     * event - {Event} 
     * 
     * Returns:
     * {DOMElement} The element that caused the event 
     */
    element: function(event) {
        return event.target || event.srcElement;
    },

    /**
     * Method: isSingleTouch
     * Determine whether event was caused by a single touch
     *
     * Parameters:
     * event - {Event}
     *
     * Returns:
     * {Boolean}
     */
    isSingleTouch: function(event) {
        return event.touches && event.touches.length == 1;
    },

    /**
     * Method: isMultiTouch
     * Determine whether event was caused by a multi touch
     *
     * Parameters:
     * event - {Event}
     *
     * Returns:
     * {Boolean}
     */
    isMultiTouch: function(event) {
        return event.touches && event.touches.length > 1;
    },

    /**
     * Method: isLeftClick
     * Determine whether event was caused by a left click. 
     *
     * Parameters:
     * event - {Event} 
     * 
     * Returns:
     * {Boolean}
     */
    isLeftClick: function(event) {
        return (((event.which) && (event.which == 1)) ||
                ((event.button) && (event.button == 1)));
    },

    /**
     * Method: isRightClick
     * Determine whether event was caused by a right mouse click. 
     *
     * Parameters:
     * event - {Event} 
     * 
     * Returns:
     * {Boolean}
     */
    isRightClick: function(event) {
        return (((event.which) && (event.which == 3)) ||
                ((event.button) && (event.button == 2)));
    },
     
    /**
     * Method: stop
     * Stops an event from propagating. 
     *
     * Parameters: 
     * event - {Event} 
     * allowDefault - {Boolean} If true, we stop the event chain but 
     *     still allow the default browser behaviour (text selection,
     *     radio-button clicking, etc). Default is false.
     */
    stop: function(event, allowDefault) {
        
        if (!allowDefault) { 
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        }
                
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },

    /** 
     * Method: findElement
     * 
     * Parameters:
     * event - {Event} 
     * tagName - {String} 
     * 
     * Returns:
     * {DOMElement} The first node with the given tagName, starting from the
     * node the event was triggered on and traversing the DOM upwards
     */
    findElement: function(event, tagName) {
        var element = Tian.Event.element(event);
        while (element.parentNode && (!element.tagName ||
              (element.tagName.toUpperCase() != tagName.toUpperCase()))){
            element = element.parentNode;
        }
        return element;
    },

    /** 
     * Method: observe
     * 
     * Parameters:
     * elementParam - {DOMElement || String} 
     * name - {String} 
     * observer - {function} 
     * useCapture - {Boolean} 
     */
    observe: function(elementParam, name, observer, useCapture) {
        var element = Tian.getElement(elementParam);
        useCapture = useCapture || false;

        if (name == 'keypress' &&
           (navigator.appVersion.match(/Konqueror|Safari|KHTML/)
           || element.attachEvent)) {
            name = 'keydown';
        }

        //if observers cache has not yet been created, create it
        if (!this.observers) {
            this.observers = {};
        }

        //if not already assigned, make a new unique cache ID
        if (!element._eventCacheID) {
            var idPrefix = "eventCacheID_";
            if (element.id) {
                idPrefix = element.id + "_" + idPrefix;
            }
            element._eventCacheID = Tian.createUniqueID(idPrefix);
        }

        var cacheID = element._eventCacheID;

        //if there is not yet a hash entry for this element, add one
        if (!this.observers[cacheID]) {
            this.observers[cacheID] = [];
        }

        //add a new observer to this element's list
        this.observers[cacheID].push({
            'element': element,
            'name': name,
            'observer': observer,
            'useCapture': useCapture
        });

        //add the actual browser event listener
        if (element.addEventListener) {
            element.addEventListener(name, observer, useCapture);
        } else if (element.attachEvent) {
            element.attachEvent('on' + name, observer);
        }
    },

    /** 
     * Method: stopObservingElement
     * Given the id of an element to stop observing, cycle through the 
     *   element's cached observers, calling stopObserving on each one, 
     *   skipping those entries which can no longer be removed.
     * 
     * parameters:
     * elementParam - {DOMElement || String} 
     */
    stopObservingElement: function(elementParam) {
        var element = Tian.getElement(elementParam);
        var cacheID = element._eventCacheID;

        this._removeElementObservers(Tian.Event.observers[cacheID]);
    },

    /**
     * Method: _removeElementObservers
     *
     * Parameters:
     * elementObservers - {Array(Object)} Array of (element, name, 
     *                                         observer, usecapture) objects, 
     *                                         taken directly from hashtable
     */
    _removeElementObservers: function(elementObservers) {
        if (elementObservers) {
            for(var i = elementObservers.length-1; i >= 0; i--) {
                var entry = elementObservers[i];
                var args = new Array(entry.element,
                                     entry.name,
                                     entry.observer,
                                     entry.useCapture);
                var removed = Tian.Event.stopObserving.apply(this, args);
            }
        }
    },

    /**
     * Method: stopObserving
     * 
     * Parameters:
     * elementParam - {DOMElement || String} 
     * name - {String} 
     * observer - {function} 
     * useCapture - {Boolean} 
     *  
     * Returns:
     * {Boolean} Whether or not the event observer was removed
     */
    stopObserving: function(elementParam, name, observer, useCapture) {
        useCapture = useCapture || false;
    
        var element = Tian.getElement(elementParam);
        var cacheID = element._eventCacheID;

        if (name == 'keypress') {
            if ( navigator.appVersion.match(/Konqueror|Safari|KHTML/) || 
                 element.detachEvent) {
              name = 'keydown';
            }
        }

        // find element's entry in this.observers cache and remove it
        var foundEntry = false;
        var elementObservers = Tian.Event.observers[cacheID];
        if (elementObservers) {
    
            // find the specific event type in the element's list
            var i=0;
            while(!foundEntry && i < elementObservers.length) {
                var cacheEntry = elementObservers[i];
    
                if ((cacheEntry.name == name) &&
                    (cacheEntry.observer == observer) &&
                    (cacheEntry.useCapture == useCapture)) {
    
                    elementObservers.splice(i, 1);
                    if (elementObservers.length == 0) {
                        delete Tian.Event.observers[cacheID];
                    }
                    foundEntry = true;
                    break; 
                }
                i++;           
            }
        }
    
        //actually remove the event listener from browser
        if (foundEntry) {
            if (element.removeEventListener) {
                element.removeEventListener(name, observer, useCapture);
            } else if (element && element.detachEvent) {
                element.detachEvent('on' + name, observer);
            }
        }
        return foundEntry;
    },
    
    /** 
     * Method: unloadCache
     * Cycle through all the element entries in the events cache and call
     *   stopObservingElement on each. 
     */
    unloadCache: function() {
        // check for Tian.Event before checking for observers, because
        // Tian.Event may be undefined in IE if no map instance was
        // created
        if (Tian.Event && Tian.Event.observers) {
            for (var cacheID in Tian.Event.observers) {
                var elementObservers = Tian.Event.observers[cacheID];
                Tian.Event._removeElementObservers.apply(this, 
                                                           [elementObservers]);
            }
            Tian.Event.observers = false;
        }
    }
};

/* prevent memory leaks in IE */
Tian.Event.observe(window, 'unload', Tian.Event.unloadCache, false);


//=============================================================
// Class: Tian.Events
// Tian styled events engine.
//-------------------------------------------------------------

Tian.Events = Tian.Class({
    /** 
     * Constant: BROWSER_EVENTS
     * {Array(String)} supported events 
     */
    BROWSER_EVENTS: [
        "mouseover", "mouseout",
        "mousedown", "mouseup", "mousemove", 
        "click", "dblclick", "rightclick", "dblrightclick",
        "resize", "focus", "blur",
        "touchstart", "touchmove", "touchend",
        "keydown"
    ],

    /** 
     * Property: listeners 
     * {Object} Hashtable of Array(Function): events listener functions  
     */
    listeners: null,

    /** 
     * Property: object 
     * {Object}  the code object issuing application events 
     */
    object: null,

    /** 
     * Property: element 
     * {DOMElement}  the DOM element receiving browser events 
     */
    element: null,

    /** 
     * Property: eventHandler 
     * {Function}  bound event handler attached to elements 
     */
    eventHandler: null,

    /** 
     * APIProperty: fallThrough 
     * {Boolean} 
     */
    fallThrough: null,

    /** 
     * APIProperty: includeXY
     * {Boolean} Should the .xy property automatically be created for browser
     *    mouse events? In general, this should be false. If it is true, then
     *    mouse events will automatically generate a '.xy' property on the 
     *    event object that is passed. Otherwise, you can call it on the
     *    relevant events handler on the object available via the 'evt.object'
     *    property of the evt object. So, for most events, you can call:
     *    function named(evt) { 
     *        this.xy = this.object.events.getMousePosition(evt) 
     *    } 
     *
     *    This option typically defaults to false for performance reasons:
     *    when creating an events object whose primary purpose is to manage
     *    relatively positioned mouse events within a div, it may make
     *    sense to set it to true.
     *
     *    This option is also used to control whether the events object caches
     *    offsets. If this is false, it will not: the reason for this is that
     *    it is only expected to be called many times if the includeXY property
     *    is set to true. If you set this to true, you are expected to clear 
     *    the offset cache manually (using this.clearMouseCache()) if:
     *        the border of the element changes
     *        the location of the element in the page changes
    */
    includeXY: false,
    
    /**
     * APIProperty: extensions
     * {Object} Event extensions registered with this instance. Keys are
     *     event types, values are {Tian.Events.*} extension instances or
     *     {Boolean} for events that an instantiated extension provides in
     *     addition to the one it was created for.
     *
     * Extensions create an event in addition to browser events, which usually
     * fires when a sequence of browser events is completed. Extensions are
     * automatically instantiated when a listener is registered for an event
     * provided by an extension.
     *
     * Extensions are created in the <Tian.Events> namespace using
     * <Tian.Class>, and named after the event they provide.
     * The constructor receives the target <Tian.Events> instance as
     * argument. Extensions that need to capture browser events before they
     * propagate can register their listeners events using <register>, with
     * {extension: true} as 4th argument.
     *
     * If an extension creates more than one event, an alias for each event
     * type should be created and reference the same class. The constructor
     * should set a reference in the target's extensions registry to itself.
     *
     * Below is a minimal extension that provides the "foostart" and "fooend"
     * event types, which replace the native "click" event type if clicked on
     * an element with the css class "foo":
     *
     * (code)
     *   Tian.Events.foostart = Tian.Class({
     *       initialize: function(target) {
     *           this.target = target;
     *           this.target.register("click", this, this.doStuff, {extension: true});
     *           // only required if extension provides more than one event type
     *           this.target.extensions["foostart"] = true;
     *           this.target.extensions["fooend"] = true;
     *       },
     *       destroy: function() {
     *           var target = this.target;
     *           target.unregister("click", this, this.doStuff);
     *           delete this.target;
     *           // only required if extension provides more than one event type
     *           delete target.extensions["foostart"];
     *           delete target.extensions["fooend"];
     *       },
     *       doStuff: function(evt) {
     *           var propagate = true;
     *           if (Tian.Event.element(evt).className === "foo") {
     *               propagate = false;
     *               var target = this.target;
     *               target.emit("foostart");
     *               window.setTimeout(function() {
     *                   target.emit("fooend");
     *               }, 1000);
     *           }
     *           return propagate;
     *       }
     *   });
     *   // only required if extension provides more than one event type
     *   Tian.Events.fooend = Tian.Events.foostart;
     * (end)
     * 
     */
    extensions: null,
    
    /**
     * Property: extensionCount
     * {Object} Keys are event types (like in <listeners>), values are the
     *     number of extension listeners for each event type.
     */
    extensionCount: null,  

    /**
     * Method: clearMouseListener
     * A version of <clearMouseCache> that is bound to this instance so that
     *     it can be used with <Tian.Event.observe> and
     *     <Tian.Event.stopObserving>.
     */
    clearMouseListener: null,

    /**
     * Constructor: Tian.Events
     * Construct an Tian.Events object.
     *
     * Parameters:
     * object - {Object} The js object to which this Events object  is being added
     * element - {DOMElement} A dom element to respond to browser events
     * fallThrough - {Boolean} Allow events to fall through after these have been handled?
     * options - {Object} Options for the events object.
     */
    initialize: function (object, element, fallThrough, options) {
        Tian.extend(this, options);
        this.object      = object;
        this.fallThrough = fallThrough;
        this.listeners   = {};
        this.extensions = {};
        this.extensionCount = {};
        
        // if a dom element is specified, add a listeners list 
        // for browser events on the element and register them
        if (element != null) {
            this.attachToElement(element);
        }
    },

    /**
     * APIMethod: destroy
     */
    destroy: function () {
        for (var e in this.extensions) {
            if (typeof this.extensions[e] !== "boolean") {
                this.extensions[e].destroy();
            }
        }
        this.extensions = null;
        if (this.element) {
            Tian.Event.stopObservingElement(this.element);
            if(this.element.hasScrollEvent) {
                Tian.Event.stopObserving(
                    window, "scroll", this.clearMouseListener
                );
            }
        }
        this.element = null;

        this.listeners = null;
        this.object = null;
        this.fallThrough = null;
        this.eventHandler = null;
    },

    /**
     * Method: attachToElement
     *
     * Parameters:
     * element - {HTMLDOMElement} a DOM element to attach browser events to
     */
    attachToElement: function (element) {
        if (this.element) {
            Tian.Event.stopObservingElement(this.element);
        } else {
            // keep a bound copy of handleBrowserEvent() so that we can
            // pass the same function to both Event.observe() and .stopObserving()
            this.eventHandler = Tian.Function.bindAsEventListener(
                this.handleBrowserEvent, this
            );
            
            // to be used with observe and stopObserving
            this.clearMouseListener = Tian.Function.bind(
                this.clearMouseCache, this
            );
        }
        this.element = element;
        for (var i=0, len=this.BROWSER_EVENTS.length; i<len; i++) {
            // register the event cross-browser
            Tian.Event.observe(element, this.BROWSER_EVENTS[i], this.eventHandler);
        }
        // disable dragstart in IE so that mousedown/move/up works normally
        Tian.Event.observe(element, "dragstart", Tian.Event.stop);
    },
    
    /**
     * APIMethod: on
     * Convenience method for registering listeners with a common scope.
     *     Internally, this method calls <register> as shown in the examples
     *     below.
     *
     * Example use:
     * (code)
     * // register a single listener for the "loadstart" event
     * events.on({"loadstart": loadStartListener});
     *
     * // this is equivalent to the following
     * events.register("loadstart", undefined, loadStartListener);
     *
     * // register multiple listeners to be called with the same `this` object
     * events.on({
     *     "loadstart": loadStartListener,
     *     "loadend": loadEndListener,
     *     scope: object
     * });
     *
     * // this is equivalent to the following
     * events.register("loadstart", object, loadStartListener);
     * events.register("loadend", object, loadEndListener);
     * (end)
     *
     * Parameters:
     *  object - {Object}     
     */
    on: function(object) {
        for(var type in object) {
            if(type != "scope" && object.hasOwnProperty(type)) {
                this.register(type, object.scope, object[type]);
            }
        }
    },

    /**
     * APIMethod: register
     * Register an event on the events object.
     *
     * When the event is triggered, the 'func' function will be called, in the
     * context of 'obj'.
     * Parameters:
     * type - {String} Name of the event to register
     * obj - {Object} The object to bind the context to for the callback.
     *     If no object is specified, default is the Events's 'object' property.
     * func - {Function} The callback function. If no callback is 
     *     specified, this function does nothing.
     * priority - {Boolean} If true, adds the new listener to the front of
     *         the events queue istead of to the end.
     *
     * Valid options for priority:
     * extension - {Boolean} If true, then the event will be registered as
     *     extension event. Extension events are handled before all other
     *     events.
     */
    register: function (type, obj, func, priority) {
        if (type in Tian.Events && !this.extensions[type]) {
            this.extensions[type] = new Tian.Events[type](this);
        }
        if (func != null) {
            if (obj == null)  {
                obj = this.object;
            }
            var listeners = this.listeners[type];
            if (!listeners) {
                listeners = [];
                this.listeners[type] = listeners;
                this.extensionCount[type] = 0;
            }
            var listener = {obj: obj, func: func};
            if (priority) {
                listeners.splice(this.extensionCount[type], 0, listener);
                if (typeof priority === "object" && priority.extension) {
                    this.extensionCount[type]++;
                }
            } else {
                listeners.push(listener);
            }
        }
    },

    /**
     * APIMethod: registerPriority
     * Same as register() but adds the new listener to the *front* of the
     *     events queue instead of to the end.
     *    
     *     TODO: get rid of this in 3.0 - Decide whether listeners should be 
     *     called in the order they were registered or in reverse order.
     *
     *
     * Parameters:
     * type - {String} Name of the event to register
     * obj - {Object} The object to bind the context to for the callback.
     *                If no object is specified, default is the Events's 
     *                'object' property.
     * func - {Function} The callback function. If no callback is 
     *                   specified, this function does nothing.
     */
    registerPriority: function (type, obj, func) {
        this.register(type, obj, func, true);
    },
    
    /**
     * APIMethod: un
     * Convenience method for unregistering listeners with a common scope.
     *     Internally, this method calls <unregister> as shown in the examples
     *     below.
     *
     * Example use:
     * (code)
     * // unregister a single listener for the "loadstart" event
     * events.un({"loadstart": loadStartListener});
     *
     * // this is equivalent to the following
     * events.unregister("loadstart", undefined, loadStartListener);
     *
     * // unregister multiple listeners with the same `this` object
     * events.un({
     *     "loadstart": loadStartListener,
     *     "loadend": loadEndListener,
     *     scope: object
     * });
     *
     * // this is equivalent to the following
     * events.unregister("loadstart", object, loadStartListener);
     * events.unregister("loadend", object, loadEndListener);
     * (end)
     */
    un: function(object) {
        for(var type in object) {
            if(type != "scope" && object.hasOwnProperty(type)) {
                this.unregister(type, object.scope, object[type]);
            }
        }
    },

    /**
     * APIMethod: unregister
     *
     * Parameters:
     * type - {String} 
     * obj - {Object} If none specified, defaults to this.object
     * func - {Function} 
     */
    unregister: function (type, obj, func) {
        if (obj == null)  {
            obj = this.object;
        }
        var listeners = this.listeners[type];
        if (listeners != null) {
            for (var i=0, len=listeners.length; i<len; i++) {
                if (listeners[i].obj == obj && listeners[i].func == func) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    },

    /** 
     * Method: remove
     * Remove all listeners for a given event type. If type is not registered,
     *     does nothing.
     *
     * Parameters:
     * type - {String} 
     */
    remove: function(type) {
        if (this.listeners[type] != null) {
            this.listeners[type] = [];
        }
    },

    /**
     * APIMethod: emit
     * Trigger a specified registered event.  
     * 
     * Parameters:
     * type - {String} 
     * evt - {Event - {object, element, type}}
     *
     * Returns:
     * {Boolean} The last listener return.  If a listener returns false, the
     *     chain of listeners will stop getting called.
     */
    emit: function (type, evt) {
        var listeners = this.listeners[type];

        // fast path
        if(!listeners || listeners.length == 0) {
            return undefined;
        }

        // prep evt object with object & div references
        if (evt == null) {
            evt = {};
        }
        evt.object = this.object;
        evt.element = this.element;
        if(!evt.type) {
            evt.type = type;
        }
    
        // execute all callbacks registered for specified type
        // get a clone of the listeners array to
        // allow for splicing during callbacks
        listeners = listeners.slice();
        var continueChain;
        for (var i=0, len=listeners.length; i<len; i++) {
            var callback = listeners[i];
            // bind the context to callback.obj
            continueChain = callback.func.apply(callback.obj, [evt]);

            if ((continueChain != undefined) && (continueChain == false)) {
                // if callback returns false, execute no more callbacks.
                break;
            }
        }
        // don't fall through to other DOM elements
        if (!this.fallThrough) {           
            Tian.Event.stop(evt, true);
        }
        return continueChain;
    },

    /**
     * Method: handleBrowserEvent
     * Basically just a wrapper to the emit() function, but takes 
     *     care to set a property 'xy' on the event with the current mouse 
     *     position.
     *
     * Parameters:
     * evt - {Event} 
     */
    handleBrowserEvent: function (evt) {
        var type = evt.type, listeners = this.listeners[type];
        if(!listeners || listeners.length == 0) {
            // noone's listening, bail out
            return;
        }
        // add clientX & clientY to all events - corresponds to average x, y
        var touches = evt.touches;
        if (touches && touches[0]) {
            var x = 0;
            var y = 0;
            var num = touches.length;
            var touch;
            for (var i=0; i<num; ++i) {
                touch = touches[i];
                x += touch.clientX;
                y += touch.clientY;
            }
            evt.clientX = x / num;
            evt.clientY = y / num;
        }
        if (this.includeXY) {
            evt.xy = this.getMousePosition(evt);
        } 
        this.emit(type, evt);
    },

    /**
     * APIMethod: clearMouseCache
     * Clear cached data about the mouse position. This should be called any 
     *     time the element that events are registered on changes position 
     *     within the page.
     */
    clearMouseCache: function() { 
        this.element.scrolls = null;
        this.element.lefttop = null;
        // Tian.pagePosition needs to use
        // element. getBoundingClientRect to correctly calculate the offsets
        // for the iPhone, but once the page is scrolled, getBoundingClientRect
        // returns incorrect offsets. So our best bet is to not invalidate the
        // offsets once we have them, and hope that the page was not scrolled
        // when we did the initial calculation.
        var body = document.body;
        if (body && !((body.scrollTop != 0 || body.scrollLeft != 0) &&
                                    navigator.userAgent.match(/iPhone/i))) {
            this.element.offsets = null;
        }
    },      

    /**
     * Method: getMousePosition
     * 
     * Parameters:
     * evt - {Event} 
     * 
     * Returns:
     * {<pixel object {x=0,y=0}>} The current xy coordinate of the mouse, adjusted
     *                      for offsets
     */
    getMousePosition: function (evt) {
        if (!this.includeXY) {
            this.clearMouseCache();
        } else if (!this.element.hasScrollEvent) {
            Tian.Event.observe(window, "scroll", this.clearMouseListener);
            this.element.hasScrollEvent = true;
        }
        
        if (!this.element.scrolls) {
            var viewportElement = Tian.getViewportElement();
            this.element.scrolls = [
                viewportElement.scrollLeft,
                viewportElement.scrollTop
            ];
        }

        if (!this.element.lefttop) {
            this.element.lefttop = [
                (document.documentElement.clientLeft || 0),
                (document.documentElement.clientTop  || 0)
            ];
        }
        
        if (!this.element.offsets) {
            this.element.offsets = Tian.pagePosition(this.element);
        }

        var xy = {
            x: (evt.clientX + this.element.scrolls[0]) - this.element.offsets[0] - this.element.lefttop[0], 
            y: (evt.clientY + this.element.scrolls[1]) - this.element.offsets[1] - this.element.lefttop[1]
        };
        
        return xy; 
    },

    CLASS_NAME: "Tian.Events"
});

