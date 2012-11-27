// Copyright (c) 2012-2012 by yantaotian@gmail.com

/**
 * @requires OS.js
 */

// extend languages
Tian.Lang.add('en', 'txDevice', 'Tian Certified Device');
Tian.Lang.add('en', 'txDeviceAlarm', 'reports ALARM');
Tian.Lang.add('en', 'txDeviceConfirm', 'Press [OK] to close, or [Cancel] to minimize the window.');
Tian.Lang.add('zh-CN', 'txDevice', '未然认证设备');
Tian.Lang.add('zh-CN', 'txDeviceAlarm', '告警');
Tian.Lang.add('zh-CN', 'txDeviceConfirm', '按【确定】关闭，或按【取消】最小化窗口。');

/**
 * Class: Tian.Device
 * All sensors data must be displayed within an iframe.
 */
Tian.Device = Tian.Class({
    // device serial number
    id: '',
    
    // key to access device data on remote host
    key: '',
    
    // reference to the os
    os: null,
    
    // [lon, lat] device position
    lonlat: null,
    
    // device data host server
    host: '',
    
    // icon url of this device
    icon: '',
    
    // device title 
    title: '',
    
    // rotation in degrees
    angle: 0,
    
    // external web page url of this device
    page: '',
    
    // alarm sound url of this device
    alarm: '',
    
    // default width of window
    width: 540,
    
    // default height of window
    height: 300,
    
    // OpenLayers.Feature.Vector
    feature: null,
    
    // Tian.Events
    // Supported events:
    // appdevicedata
    // socketconnect
    // socketdisconnect
    // socketmessage
    // socketdevicedata
    events: null,
    
    // instance of jwim.Window
    window: null,
    
    // embeded device app
    theApp: null,
    
    // timer to alarm
    alarmTimer: null,
    alarmInterval: 618,
    // sound created by soundManager
    alarmSound: null,
    
    // socket.io
    // socket events:
    // connect
    // disconnect
    // message
    // devicedata: {
    //  id: device_sn,
    //  lonlat: [lon, lat],
    //  angle: angle,
    //  alarm: false,
    //  etc...
    //}
    socket: null,
    
    // last device data object
    lastDeviceData: null,

    /**
     * Constructor: Tian.Device
     * Parameters:
     * options - {Object}, eg: {
     *               os: os,
     *               id: '123456789012345678901234',
     *               key: 'abcdefghijklmnopqrstuvwxyz',
     *               title: 'device',
     *               lonlat: [120.0, 30.0],
     *               icon: 'url',
     *               page: 'url',
     *               alarm: 'url',
     *               width: 540,
     *               height: 300
     *               // camera: 'camera_url', ?
     *               // host: 'host.name:port', ?
     *               // imei: 'imei', ?
     *               // ...... ?
     *           }
     */
    initialize: function(options) {
        Tian.extend(this, options);
        
        if (!this.id) {
            this.id = Tian.createUniqueID('txDevice_');
        }
        if (!this.key) {
            this.key = this.id;
        }
        if (!this.title) {
            this.title = Tian.i18n('txDevice');
        }
        if (!Tian.Array.isArray(this.lonlat) || this.lonlat.length !== 2) {
            this.lonlat = [116.391499, 39.903177]; // Beijing Tiananmen
        }
        if (!this.icon && this.os) {
            this.icon = this.os.getImagePath() + 'default_device_icon.png';
        }
        if (!this.alarm && this.os) {
            this.alarm = this.os.getImagePath() + 'default_device_alarm.mp3';
        }

        // create feature
        if (typeof OpenLayers !== 'undefined') {
            var point = new OpenLayers.Geometry.Point(this.lonlat[0], this.lonlat[1]);
            if (this.os != null && this.os.getMap() != null) {
                point.transform(
                    this.os.getMap().displayProjection,
                    this.os.getMap().getProjectionObject()
                );
            }
            var self = this;
            this.feature = new OpenLayers.Feature.Vector(point, {
                // internal reference to the device
                device: self,
                dragged: false
            }, {
                graphicWidth: 32,
                graphicHeight: 32,
                graphicOpacity: 1,
                externalGraphic: self.icon,
                rotation: self.angle,
                label: self.title,
                labelAlign: 'lm',
                labelXOffset: 16,
                fontColor: "black",
                fontSize: "12px"
            });
        }
        
        // create alarm sound
        if (typeof soundManager !== 'undefined' && soundManager.ok()) {
            var sound = soundManager.createSound({
                id: self.id,
                url: self.alarm,
                loops: 1000000,
                autoLoad: false,
                autoPlay: false,
                multiShot: false,
                onload: function(){sound.stop(); sound.play();}
            });
            this.alarmSound = sound;
        }
        
        // create socket
        if (typeof io !== 'undefined' && this.host) {
            this.socket = io.connect(this.host, {'force new connection': true});
        }
        // listen socket events
        if (this.socket) {
            this.socket.on('connect',    Tian.Function.bind(this.onSocketConnect, this));
            this.socket.on('disconnect', Tian.Function.bind(this.onSocketDisconnect, this));
            this.socket.on('message',    Tian.Function.bind(this.onSocketMessage, this));
            this.socket.on('devicedata', Tian.Function.bind(this.onSocketDeviceData, this));
        }
        
        // create an event engine
        this.events = new Tian.Events(this, null, true);
        
        this.events.register('appdevicedata', this, this.onAppDeviceData);
    },
    
    destroy: function() {
        this.stopAlarm();
        
        // destroy socket
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        
        // destroy window
        if (this.window) {
            this.window.close();
            this.window = null;
        }
        
        // destroy events
        if (this.events) {
            this.events.destroy();
            this.events = null;
        }
        
        // destroy feature
        if (this.feature) {
            if (this.feature.layer) {
                this.feature.layer.removeFeatures([this.feature]);
            }
            if (this.feature.attributes) {
                this.feature.attributes.device = null;
            }
            this.feature.destroy();
            this.feature = null;
        }
        
        // destroy sound
        if (this.alarmSound) {
            this.alarmSound.destruct();
            this.alarmSound = null;
        }
        
        this.os = null;
        this.lastDeviceData = null;
    },
    
    startAlarm: function() {
        // play sound
        if (this.alarmSound) {
            this.alarmSound.play();
        }
        
        // viberate feature
        if (!this.alarmTimer) {
            this.alarmTimer = setInterval(Tian.Function.bind(this.doAlarm, this), this.alarmInterval);
        }
    },
    
    stopAlarm: function() {
        // stop sound
        if (this.alarmSound) {
            this.alarmSound.stop();
        }
        
        // stop viberating
        if (this.alarmTimer) {
            clearInterval(this.alarmTimer);
            this.alarmTimer = null;
        }
        
        // reset feature
        if (this.feature && this.feature.style.graphicOpacity !== 1) {
            this.feature.style.graphicOpacity = 1;
            this.feature.layer && this.feature.layer.drawFeature(this.feature);
        }
    },
    
    doAlarm: function() {
        if (this.feature) {
            // reset opacity of feature
            if (this.feature.style.graphicOpacity === 1) {
                this.feature.style.graphicOpacity = 0.2;
                this.feature.layer && this.feature.layer.drawFeature(this.feature);
            } else {
                this.feature.style.graphicOpacity = 1;
                this.feature.layer && this.feature.layer.drawFeature(this.feature);
            }
        }
    },
    
    getID: function() {
        return this.id;
    },
    
    getKey: function() {
        return this.key;
    },
    
    setOS: function(os) {
        if (!this.os) {
            this.os = os;
        }
    },
    
    getOS: function() {
        return this.os;
    },
    
    getEvents: function() {
        return this.events;
    },
    
    getLastDeviceData: function() {
        return this.lastDeviceData;
    },
    
    // set the device title
    setTitle: function(title) {
        if (typeof title === 'string' && title !== this.title) {
            this.title = title;
            if (this.feature) {
                this.feature.style.label = this.title;
                this.feature.layer && this.feature.layer.drawFeature(this.feature);
            }
            this.window && this.window.setTitle(title);
        }
    },
    
    getTitle: function() {
        return this.title;
    },

    // set the device icon
    setIcon: function(icon) {
        if (typeof icon === 'string' && icon !== this.icon) {
            this.icon = icon;
            if (this.feature) {
                this.feature.style.externalGraphic = this.icon;
                this.feature.layer && this.feature.layer.drawFeature(this.feature);
            }
            this.window && this.window.setIconImage(icon);
        }
    },
    
    // set the device alarm sound
    setAlarm: function(alarm) {
        if (typeof alarm === 'string' && alarm !== this.alarm) {
            this.alarm = alarm;
            // create new alarm sound
            if (typeof soundManager !== 'undefined' && soundManager.ok()) {
                // destroy old alarm sound
                if (this.alarmSound) {
                    this.alarmSound.destruct();
                    this.alarmSound = null;
                }
                this.alarmSound = soundManager.createSound({
                    id: this.id,
                    url: this.alarm,
                    loops: 1000000,
                    autoLoad: false,
                    autoPlay: false,
                    multiShot: false,
                    onload: function(){this.stop();this.play();}
                });
            }
        }
    },
    
    // set device position on map
    setPosition: function(lonlat, angle) {
        if (this.feature && Tian.Array.isArray(lonlat) && lonlat.length === 2) {
            this.lonlat = lonlat;
            var point = new OpenLayers.Geometry.Point(
                this.lonlat[0],
                this.lonlat[1]
            ).transform(
                this.os.getMap().displayProjection,
                this.os.getMap().getProjectionObject()
            );
            this.feature.geometry.x = point.x;
            this.feature.geometry.y = point.y;
            if (typeof angle === 'number' && angle !== this.angle) {
                this.angle = angle;
                this.feature.style.rotation = this.angle;
            }
            this.feature.geometry.calculateBounds();
            this.feature.layer && this.feature.layer.drawFeature(this.feature);
        }
    },
    
    // called from os
    onSelect: function() {
        // stop alarm
        this.stopAlarm();
        
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
        ww = Tian.DB.get(Tian.md5(this.id + '_ww'));
        wh = Tian.DB.get(Tian.md5(this.id + '_wh'));
        wx = Tian.DB.get(Tian.md5(this.id + '_wx'));
        wy = Tian.DB.get(Tian.md5(this.id + '_wy'));
        this.window = wm.createWindow({
            title: this.title,
            state: 'window',
            width: ww ? ww : this.width,
            height: wh ? wh : this.height,
            x: wx ? wx : null,
            y: wy ? wy : null,
            iconImageURL: this.icon,
            closeConfirm: Tian.i18n('txDeviceConfirm')
        });
        
        // listen window events
        this.window.onclose = Tian.Function.bind(this.onWinClose, this);
        this.window.onmove = Tian.Function.bind(this.onWinMove, this);
        this.window.onresize = Tian.Function.bind(this.onWinResize, this);
        
        // try to load the external device page
        // all devices app must be running within an iframe
        if (this.page) {
            this.window.loadUrlX(this.page, Tian.Function.bind(this.onWinLoad, this));
        }
    },
    
    // socket event handlers
    onSocketConnect: function () {
        // subscribe remote data
        this.socket.emit('subscribe', {id: this.id, key: this.key});
        this.events.triggerEvent('socketconnect');
        
        if (this.os) {
            this.os.notify(this.title + ' online');
        }
    },
    
    onSocketDisconnect: function () {
        this.events.triggerEvent('socketdisconnect');
        
        if (this.os) {
            this.os.notify(this.title + ' offline');
        }
    },
    
    onSocketMessage: function(msg) {
        this.events.triggerEvent('socketmessage', {message: msg});
    },
    
    // data from remote server to device app
    onSocketDeviceData: function(data) {
        if (!data || data.id !== this.id) {
            return;
        }
        
        if (data.type === 'devicertdata') {
            if (data.lonlat) {
                this.setPosition(data.lonlat, data.angle);
            }
            if (data.alarm) {
                this.startAlarm();
                // notify
                if (this.os) {
                    this.os.notify(Tian.i18n('txDevice') + ' [' + this.title + '] ' + Tian.i18n('txDeviceAlarm'));
                }
            } else {
                this.stopAlarm();
            }
            
            // save this realtime data
            this.lastDeviceData = data;
        }
        
        // tell device app to update its content information
        this.events.triggerEvent('socketdevicedata', {devicedata: data});
    },
    
    // data from device app to remote server
    onAppDeviceData: function(event) {
        if (this.socket && event && event.devicedata) {
            this.socket.emit('devicedata', event.devicedata);
        }
    },
    
    // window events
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
        Tian.DB.set(Tian.md5(this.id + '_wx'), x);
        Tian.DB.set(Tian.md5(this.id + '_wy'), y);
    },
    
    onWinResize: function (w, h, a) {
        // save status into local db
        switch (a) {
            case 'resize':
                Tian.DB.set(Tian.md5(this.id + '_ww'), w);
                Tian.DB.set(Tian.md5(this.id + '_wh'), h);
                break;
            case 'maximize':
                break;
            case 'restore':
                break;
        }
    },

    CLASS_NAME: "Tian.Device"
});

