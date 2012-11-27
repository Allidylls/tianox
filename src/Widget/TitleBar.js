/* Copyright (c) 2012-2012 by yantaotian@gmail.com */

/**
 * @requires Widget.js
 */

// extend languages
Tian.Lang.add('en', 'txTitleBarWelcome', 'Welcome: ');
Tian.Lang.add('en', 'txTitleBarAnonymous', 'Sign in');
Tian.Lang.add('zh-CN', 'txTitleBarWelcome', '欢迎您: ');
Tian.Lang.add('zh-CN', 'txTitleBarAnonymous', '登录');

// Class: Tian.TitleBar
Tian.Widget.TitleBar = Tian.Class(Tian.Widget, {
    spanWelcome: null,
    spanAccount: null,
    spanNotify: null,
    
    notifications: null,
    
    initialize: function() {
        Tian.Widget.prototype.initialize.apply(this, arguments);
        this.notifications = [];
    },
    
    draw: function() {
        Tian.Widget.prototype.draw.apply(this, arguments);
        
        this.div.className = 'txWidgetTitleBar txWidgetNoSelect';
        
        this.spanWelcome = document.createElement('span');
        this.spanWelcome.className = 'txWidgetTitleBarWelcome';
        this.spanWelcome.innerHTML = Tian.i18n('txTitleBarWelcome');
        this.div.appendChild(this.spanWelcome);
        
        this.spanAccount = document.createElement('span');
        this.spanAccount.className = 'txWidgetTitleBarAccount';
        this.spanAccount.innerHTML = Tian.i18n('txTitleBarAnonymous');
        this.div.appendChild(this.spanAccount);
        // shortcut of account app
        Tian.Event.observe(this.spanAccount, 'click', Tian.Function.bindAsEventListener(this.onAccount, this));
        
        this.spanNotify = document.createElement('span');
        this.spanNotify.className = 'txWidgetTitleBarNotification';
        this.div.appendChild(this.spanNotify);
        // shortcut of notifications center app
        Tian.Event.observe(this.spanNotify, 'click', Tian.Function.bindAsEventListener(this.onNotify, this));
        
        return this.div;
    },
    
    destroy: function() {
        Tian.Event.stopObservingElement(this.spanAccount);
        Tian.Event.stopObservingElement(this.spanNotify);
        
        this.notifications = null;
        Tian.Widget.prototype.destroy.apply(this, arguments);
    },
    
    setAccount: function(account) {
        if (typeof account === 'string') {
            this.spanAccount.innerHTML = account;
        }
    },
    
    notify: function(notification) {
        if (typeof notification === 'string') {
            this.spanNotify.innerHTML = notification;
            var notify = Tian.Date.format(new Date(), 'yyyy-mm-dd HH:MM:SS - ') + notification;
            this.os.getEvents().triggerEvent('notify', {notification: notify});
            this.notifications.push(notify);
        }
    },
    
    clearNotifications: function() {
        this.spanNotify.innerHTML = '';
        this.notifications = [];
    },
    
    onAccount: function(evt) {
        if (!this.os) {
            return;
        }
        
        // get account app
        var apps = this.os.getMainPanel().getAllApps();
        if (apps) {
            for (var i=0; i<apps.length; i++) {
                if (apps[i] instanceof Tian.App &&
                    apps[i].page.indexOf('apps/account/index.html') !== -1) {
                    apps[i].onOpen();
                    break;
                }
            }
        }
        
        if (evt != null) {
            Tian.Event.stop(evt);
        }
    },
    
    onNotify: function(evt) {
        if (!this.os) {
            return;
        }
        
        // get account app
        var apps = this.os.getMainPanel().getAllApps();
        if (apps) {
            for (var i=0; i<apps.length; i++) {
                if (apps[i] instanceof Tian.App &&
                    apps[i].page.indexOf('apps/notification/index.html') !== -1) {
                    apps[i].onOpen();
                    break;
                }
            }
        }
        
        if (evt != null) {
            Tian.Event.stop(evt);
        }
    },
    
    CLASS_NAME: "Tian.Widget.TitleBar"
});
