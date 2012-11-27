/* Copyright (c) 2012-2012 by Tian Yantao */

/**
 * @requires Tian.js
 * @requires Class.js
 * @requires DB.js
 * @requires Event.js
 * @requires Function.js
 * @requires Lang.js
 * @requires Number.js
 */

// Tian.OS
// Class of Tian Observing System Framework
Tian.OS = Tian.Class({
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
    
    /**
     * APIProperty: map
     * {<OpenLayers.Map>} An map instance
     */
    map: null,
    
    /* window manager*/
    wm: null,
    
    /**
     * APIProperty: dataHost
     * {String} to identify user and load user's account settings
     */
    // format in http://data.host
    dataHost: '',
    
    /**
     * APIProperty: theme
     * {String} default theme of application
     */
    theme: 'default',
    themeHost: '', //'http://fanghuanweiran.googlecode.com/svn/trunk/theme/',
    imagePath: '',
    
    /**
     * APIProperty: events
     * {<Tian.Events>}
     */
    // Supported events list:
    // signin
    // signout
    // wedata
    // notify
    // socketconnect
    // socketdisconnect
    // socketmessage
    // socketwedata
    // devicecreate
    // devicedelete
    // deviceupdate
    // devicedragged
    events: null,
    
    // current user account object
    account: null,
    
    // account instance
    accInstance: null,
    
    // web socket connecting dataHost
    socket: null,
    
    // socket session id
    socketid: null,
    
    // device layer
    devices: null,
    
    /**
     * Constructor: Tian.OS
     */
    initialize: function(datahost, themehost) {
        // create a canvas
        var body = document.getElementsByTagName("body")[0] || document.documentElement;
        this.div = document.createElement('div');
        this.div.className = 'txOS';
        body.insertBefore(this.div, body.firstChild);
        
        if (typeof datahost == 'string' && datahost.length > 0) {
            if (datahost.charAt(datahost.length-1) == '/') {
                datahost = datahost.slice(0, datahost.length-1);
            }
            this.dataHost = datahost;
        }
        
        if (typeof themehost == 'string' && themehost.length > 0) {
            if (themehost.charAt(themehost.length-1) != '/') {
                themehost += '/';
            }
            this.themeHost = themehost;
        }
        
        
        // set a proxy host for query georss data on remote servers
        if (typeof OpenLayers != 'undefined') {
            OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
        }
    },
    
    /**
     * Method: boot
     * Entry of the OS
     */
    boot: function () {
        // load default theme and required js libraries
        if (this.themeHost) {
            Tian.requireCSS(this.themeHost + this.theme + '/style.css');
            this.setImagePath();
        }
        
        // create an event engine
        this.events = new Tian.Events(this, null, true);
        
        // create main panel
        this.mainPanel = new Tian.Widget.MainPanel();
        this.div.appendChild(this.mainPanel.draw());
        this.mainPanel.setOS(this);
        
        // craete title bar
        this.titleBar = new Tian.Widget.TitleBar();
        this.div.appendChild(this.titleBar.draw());
        this.titleBar.setOS(this);
        
        // create taskbar
        this.taskbar = new Tian.Widget.Taskbar();
        this.div.appendChild(this.taskbar.draw());
        this.taskbar.setOS(this);
        
        // create window manager
        this.createWindowManager();
        
        // create a map instance, requires OpenLayers
        if (typeof OpenLayers !== 'undefined') {
            this.createMap();
            // create device layer and drag/select control
            this.createDeviceLayer();
        }
        
        // create a socket instance, requires socket.io client
        if (typeof io !== 'undefined' && this.dataHost) {
            this.createSocket();
        }
        
        // register event handlers
        this.events.register('wedata', this, this.onWeData);
        this.events.register('signin', this, this.onSignIn);
        this.events.register('signout', this, this.onSignOut);
        this.events.register('devicecreate', this, this.onDeviceCreate);
        this.events.register('devicedelete', this, this.onDeviceDelete);
        this.events.register('deviceupdate', this, this.onDeviceUpdate);
        
        // restore account data from local db, auto sign in to system
        var acc = Tian.DB.get(Tian.md5(this.CLASS_NAME + '_account'));
        if (typeof acc === 'object') {
            this.events.triggerEvent('signin', {account: acc, localdb: true});
        }
    },
    
    /**
     * Method: exit
     * Quit the application and destroy all elements
     */
    exit: function () {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        
        if (this.map) {
            this.map.destroy();
            this.map = null;
            if (this.devices) {
                this.devices.deviceDragger = null;
                this.devices = null;
            }
        }
        
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
    
    createWindowManager: function() {
        this.wm = new Tian.Winager({
            container: this.div,
            taskbar: this.taskbar.div,
            defaultX: 50,
            defaultY: 35,
            iconWidth: 36,
            cacheXHR: true
        });
    },
    
    createMap: function () {
        // create a map with global settings
        this.map = new OpenLayers.Map(this.div, {
            theme: null, // let Tian.OS do it
            projection: new OpenLayers.Projection("EPSG:900913"),
            displayProjection: new OpenLayers.Projection("EPSG:4326"),
            units: "m",
            maxResolution: 156543.0339,
            maxExtent: new OpenLayers.Bounds(-20037509, -20037508.34, 20037508.34, 20037508.34),
            layers: [
                // default layers
                new OpenLayers.Layer.OSM(OpenLayers.i18n('OSM_Mapnik'), [
                    "http://a.tile.openstreetmap.org/${z}/${x}/${y}.png",
                    "http://b.tile.openstreetmap.org/${z}/${x}/${y}.png",
                    "http://c.tile.openstreetmap.org/${z}/${x}/${y}.png"
                ], {
                    attribution: "Tiles @ <a target='_blank' href='http://www.openstreetmap.org/' >Open Street Map</a>"
                }),
                new OpenLayers.Layer.OSM(OpenLayers.i18n('OSM_Cycle'), [
                    "http://a.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
                    "http://b.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
                    "http://c.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png"
                ], {
                    attribution: "Tiles @ <a target='_blank' href='http://www.opencyclemap.org/' >Open Cycle Map</a>",
                    numZoomLevels: 17
                }),
                new OpenLayers.Layer.OSM(OpenLayers.i18n('OSM_Transport'), [
                    "http://a.tile2.opencyclemap.org/transport/${z}/${x}/${y}.png",
                    "http://b.tile2.opencyclemap.org/transport/${z}/${x}/${y}.png",
                    "http://c.tile2.opencyclemap.org/transport/${z}/${x}/${y}.png"
                ], {
                    attribution: "Tiles @ <a target='_blank' href='http://www.opencyclemap.org/' >Open Cycle Map</a>"
                }),
                new OpenLayers.Layer.OSM(OpenLayers.i18n('OSM_MapQuest'), [
                    "http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                    "http://otile2.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                    "http://otile3.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                    "http://otile4.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png"
                ], {
                    attribution: "Tiles @ <a target='_blank' href='http://www.mapquest.com/' >MapQuest Open</a>"
                })
            ],
            controls: [
                // default controls
                new OpenLayers.Control.ArgParser(),
                new OpenLayers.Control.TouchNavigation(),
                new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.KeyboardDefaults(),
                new OpenLayers.Control.PanZoomBar(),
                new OpenLayers.Control.Attribution(),
                new OpenLayers.Control.ScaleLine({maxWidth:150, geodesic:true}),
                new OpenLayers.Control.MousePosition({numDigits:6, displayProjection:new OpenLayers.Projection("EPSG:4326")}),
                new OpenLayers.Control.LoadingPanel(),
                new OpenLayers.Control.WeOverviewMap()
            ]
        });
        
        // set default center or restore from local db if available
        var maxExtent = this.map.getMaxExtent();
        var centerLon = Tian.DB.get(Tian.md5(this.CLASS_NAME+'_mapcenterlon'));
        var centerLat = Tian.DB.get(Tian.md5(this.CLASS_NAME+'_mapcenterlat'));
        var zoom = Tian.DB.get(Tian.md5(this.CLASS_NAME+'_mapzoom'));
        if (centerLon != null && centerLat != null && zoom != null) {
            this.map.setCenter(new OpenLayers.LonLat(centerLon, centerLat).transform(
                this.map.displayProjection, this.map.getProjectionObject()
            ), zoom);
        } else {
            this.map.setCenter(maxExtent.getCenterLonLat(), this.map.getZoomForExtent(maxExtent) + 1);
        }
        
        // listene some map evnets
        this.map.events.register('moveend', this, this.onMapMoveEnd);
        this.map.events.register('zoomend', this, this.onMapZoomEnd);
    },
    
    createDeviceLayer: function() {
        if (!this.map) return;
        
        this.devices = new OpenLayers.Layer.Vector(Tian.i18n('txDevice'), {alwaysInRange: true});
        
        this.devices.deviceDragger = new OpenLayers.Control.DragFeature(this.devices, {
            autoActivate: true,
            onStart: Tian.Function.bind(this.onDeviceDragDown, this),
            onDrag: Tian.Function.bind(this.onDeviceDrag, this),
            onUp: Tian.Function.bind(this.onDeviceDragUp, this),
            onComplete: Tian.Function.bind(this.onDeviceDragDone, this),
            upFeature: function(pixel) {
                this.onUp(this.feature, pixel);
                if(!this.over) {
                    this.handlers.drag.deactivate();
                }
            }
        });
        
        this.devices.events.register('visibilitychanged', this, this.onDeviceLayerVC);
        
        this.map.addLayer(this.devices);
        this.map.addControl(this.devices.deviceDragger);
    },
    
    createSocket: function() {
        // create a new web socket
        this.socket = io.connect(this.dataHost, {'force new connection': true});
        
        if (this.socket) {
            this.socket.on('connect',    Tian.Function.bind(this.onSocketConnect, this));
            this.socket.on('disconnect', Tian.Function.bind(this.onSocketDisconnect, this));
            this.socket.on('message',    Tian.Function.bind(this.onSocketMessage, this));
            this.socket.on('wedata',     Tian.Function.bind(this.onSocketWeData, this));
        }
    },
    
    // map event handlers
    onMapMoveEnd: function (evt) {
        // save current map center to local db
        var center = this.map.getCenter().transform(this.map.getProjectionObject(), this.map.displayProjection);
        Tian.DB.set(Tian.md5(this.CLASS_NAME+'_mapcenterlon'), center.lon);
        Tian.DB.set(Tian.md5(this.CLASS_NAME+'_mapcenterlat'), center.lat);
    },
    
    onMapZoomEnd: function (evt) {
        // save current map zoom to local db
        Tian.DB.set(Tian.md5(this.CLASS_NAME+'_mapzoom'), this.map.getZoom());
        
        // recalculate device feature geometry bounds to avoid the feature disappearing at some zooms
        var sn, device;
        if (this.devices && this.account && this.account.weDevices) {
            for (sn in this.account.weDevices) {
                device = this.account.weDevices[sn];
                if (device instanceof Tian.Device) {
                    device.feature.geometry.calculateBounds();
                    device.feature.layer.drawFeature(device.feature);
                }
            }
        }
    },
    
    // on device layer visibility changed
    onDeviceLayerVC: function(evt) {
        if (this.devices.getVisibility()) {
            this.devices.deviceDragger.activate();
        } else {
            this.devices.deviceDragger.deactivate();
        }
    },
    
    // socket event handlers
    onSocketConnect: function () {
        // subscribe remote data for this session
        if (!this.socketid) {
            this.socketid = this.socket.socket.sessionid;
        }
        this.socket.emit('subscribe', this.socketid);
        
        this.notify('OS online');
        this.events.triggerEvent('socketconnect');
    },
    
    onSocketDisconnect: function () {
        this.notify('OS offline');
        this.events.triggerEvent('socketdisconnect');
    },
    
    onSocketMessage: function(msg) {
        this.notify('Message: ' + msg);
        this.events.triggerEvent('socketmessage', {message: msg});
    },
    
    onSocketWeData: function(data) {
        this.events.triggerEvent('socketwedata', {wedata: data});
    },
    
    // self events, send event data to server
    onWeData: function(event) {
        if (this.socket && event.wedata) {
            this.socket.emit('wedata', event.wedata);
        }
    },
    
    onSignIn: function(event) {
        if (!event.account || !event.account.user) {
            return;
        }
        
        this.account = event.account;
        
        // save a local copy of account data
        if (!event.localdb) {
            Tian.DB.set(Tian.md5(this.CLASS_NAME+'_account'), this.account);
        }
        
        this.accInstance = {
            weDevices: {},
            weApps: {},
            weLayers: {},
            weFeatures: {}
        };
        
        // apply account data
        if (this.account.user) {
            this.titleBar.setAccount(this.account.user);
        }

        // add devices
        var i, len, device, options, weDevice;
        if (Tian.Array.isArray(this.account.devices)) {
            for (i=0, len=this.account.devices.length; i<len; i++) {
                device = this.account.devices[i];
                options = {};
                if (this.devices && device && device.sn && typeof device.opts === 'object') {
                    Tian.extend(options, device.opts);
                    options.os = this;
                    // set device serial number as device id
                    options.id = device.sn;
                    // set device key to access remote device data
                    options.key = (device.key || '');
                    weDevice = new Tian.Device(options);
                    // add to device layer
                    this.devices.addFeatures([weDevice.feature]);
                    this.accInstance.weDevices[device.sn] = weDevice;
                }
            }
        }
        
        // add apps
        var app, weApp;
        if (Tian.Array.isArray(this.account.apps)) {
            for (i=0, len=this.account.apps.length; i<len; i++) {
                app = this.account.apps[i];
                if (app && app.name && typeof app.opts === 'object') {
                    weApp = new Tian.App(app.opts);
                    this.mainPanel.addApp(weApp);
                    this.accInstance.weApps[app.name] = weApp;
                }
            }
        }
        
        // add base layers

        // add features
    },
    
    onSignOut: function(event) {
        // delete account data
        this.titleBar.setAccount(Tian.i18n('txTitleBarAnonymous'));
        
        // delete devices
        var key;
        for (key in this.accInstance.weDevices) {
            if (this.accInstance.weDevices[key] instanceof Tian.Device) {
                this.accInstance.weDevices[key].destroy();
                delete this.accInstance.weDevices[key];
            }
        }
        
        // delete apps
        for (key in this.accInstance.weApps) {
            if (this.accInstance.weApps[key] instanceof Tian.App) {
                this.mainPanel.delApp(this.accInstance.weApps[key]);
                this.accInstance.weApps[key].destroy();
                delete this.accInstance.weApps[key];
            }
        }
        
        // delete layers
        
        // delete features
        
        // delete memory copy
        this.account = null;
        this.accInstance = null;
        
        // delete local copy
        Tian.DB.deleteKey(Tian.md5(this.CLASS_NAME + '_account'));
    },
    
    onDeviceCreate: function(event) {
        if (!this.account || !event.device || !event.device.sn) {
            return;
        }
        
        var device = event.device;
        
        // add device to account.devices array
        this.account.devices.push(device);
        
        // update local db
        Tian.DB.set(Tian.md5(this.CLASS_NAME+'_account'), this.account);
        
        // create an instance of Tian.Device
        if (this.devices) {
            var options = {};
            if (typeof device.opts === 'object') {
                Tian.extend(options, device.opts);
            }
            options.os = this;
            options.id = device.sn; // set device serial number as device id
            options.key = (device.key || ''); // key to access remove device data
        
            var deviceApp = new Tian.Device(options);
            this.devices.addFeatures([deviceApp.feature]);
            this.accInstance.weDevices[device.sn] = deviceApp;
        
            // reset map
            var extent = this.devices.getDataExtent();
            if (extent) {
                this.map.zoomToExtent(extent);
            }
        }
    },
    
    onDeviceDelete: function(event) {
        if (!this.account || !event.device || !event.device.sn) {
            return;
        }
        
        var sn = event.device.sn;
        
        // delete device from account.devices array
        var i, len;
        for (i=0, len=this.account.devices.length; i<len; i++) {
            if (this.account.devices[i].sn === sn) {
                this.account.devices.splice(i, 1);
                break;
            }
        }
        
        // update local db
        Tian.DB.set(Tian.md5(this.CLASS_NAME+'_account'), this.account);
        
        // delete device instance
        if (this.accInstance.weDevices[sn] instanceof Tian.Device) {
            this.accInstance.weDevices[sn].destroy();
            delete this.accInstance.weDevices[sn];
        }
    },
    
    onDeviceUpdate: function(event) {
        if (!this.account || !event.device || !event.device.sn) {
            return;
        }
        
        var device = event.device;
        
        // update account.devices array
        var i, len;
        for (i=0, len=this.account.devices.length; i<len; i++) {
            if (this.account.devices[i].sn === device.sn) {
                if (device.title) {
                    this.account.devices[i].opts.title = device.title;
                }
                if (device.icon) {
                    this.account.devices[i].opts.icon = device.icon;
                }
                if (device.alarm) {
                    this.account.devices[i].opts.alarm = device.alarm;
                }
                if (Tian.Array.isArray(device.lonlat) && device.lonlat.length === 2) {
                    this.account.devices[i].opts.lonlat[0] = device.lonlat[0];
                    this.account.devices[i].opts.lonlat[1] = device.lonlat[1];
                }
                break;
            }
        }
        
        // update local db
        Tian.DB.set(Tian.md5(this.CLASS_NAME+'_account'), this.account);
        
        // update device instance
        if (this.accInstance.weDevices[device.sn] instanceof Tian.Device) {
            if (device.title) {
                this.accInstance.weDevices[device.sn].setTitle(device.title);
            }
            if (device.icon) {
                this.accInstance.weDevices[device.sn].setIcon(device.icon);
            }
            if (device.alarm) {
                this.accInstance.weDevices[device.sn].setAlarm(device.alarm);
            }
            if (Tian.Array.isArray(device.lonlat) && device.lonlat.length === 2) {
                this.accInstance.weDevices[device.sn].setPosition(device.lonlat);
            }
        }
    },
    
    onDeviceDragDown: function(feature, px) {
        if (feature && feature.attributes) {
            feature.attributes.dragged = false;
        }
    },
    
    onDeviceDrag: function(feature, px) {
        if (feature && feature.attributes) {
            feature.attributes.dragged = true;
            // enlarge feature
            if (feature.style.graphicWidth !== 48) {
                feature.style.graphicWidth = 48;
                feature.style.graphicHeight = 48;
                feature.layer && feature.layer.drawFeature(feature);
            }
        }
    },
    
    onDeviceDragUp: function(feature, px) {
        if (!feature || !feature.attributes) {
            return;
        }
        
        if (!feature.attributes.dragged && feature.attributes.device) {
            // not drag, just click
            feature.attributes.device.onSelect();
        }
    },
    
    onDeviceDragDone: function(feature, px) {
        if (feature && feature.attributes && feature.attributes.device) {
            // reset feature
            if (feature.style.graphicWidth !== 32) {
                feature.style.graphicWidth = 32;
                feature.style.graphicHeight = 32;
                feature.geometry.calculateBounds();
                feature.layer && feature.layer.drawFeature(feature);
            }
            
            var point = feature.geometry.getCentroid();
            if (point) {
                point.transform(this.map.getProjectionObject(), this.map.displayProjection);
                this.events.triggerEvent('devicedragged', {device: {
                    sn: feature.attributes.device.id,
                    lonlat: [
                        Tian.Number.limitFixDigs(point.x, 6),
                        Tian.Number.limitFixDigs(point.y, 6)
                    ]
                }});
            }
        }
    },
    
    // Export apis
    //------------
    
    setImagePath: function (path) {
        if (path) {
            this.imagePath = path;
        } else {
            this.imagePath = this.themeHost + this.theme + '/img/';
        }
        if (typeof OpenLayers !== 'undefined') {
            OpenLayers.ImgPath = this.imagePath;
        }
    },
    
    getImagePath: function() {
        if (!this.imagePath) {
            this.setImagePath();
        }
        return this.imagePath;
    },
    
    // change theme of application
    changeTheme: function (theme) {
        var scripturl, newurl, oldurl;
        if ((theme) && (theme != this.theme)) {
            newurl = this.themeHost + theme + '/style.css';
            oldurl = this.themeHost + this.theme + '/style.css';
            Tian.replaceCSS(oldurl, newurl);
            this.theme = theme;
            this.setImagePath();
            // update panzoombar control
            var panZoomBars = this.map.getControlsByClass('OpenLayers.Control.PanZoomBar');
            if (panZoomBars && panZoomBars.length > 0) {
                panZoomBars[0].redraw();
            }
        }
    },
    
    // notify a message
    notify: function (str) {
        if (this.titleBar) {
            this.titleBar.notify(str);
        }
    },
    
    // get a reference to the map
    getMap: function () {
        return this.map;
    },
    
    // get a reference to the window manager
    getWindowManager: function () {
        return this.wm;
    },
    
    // get the events engine
    getEvents: function () {
        return this.events;
    },
    
    // get the main panel
    getMainPanel: function () {
        return this.mainPanel;
    },
    
    // get a reference to current account object
    getAccount: function () {
        return this.account;
    },
    
    getDeviceLayer: function () {
        return this.devices;
    },
    
    // get data host server
    getHost: function () {
        return this.dataHost;
    },
    
    CLASS_NAME: "Tian.OS"
});
