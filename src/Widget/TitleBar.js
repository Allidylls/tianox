/**
 * @requires Widget.js
 */

// Class: Tian.TitleBar
Tian.Widget.TitleBar = Tian.Class(Tian.Widget, {
    spanTitle: null,
    spanNotify: null,
    
    notifications: null,
    
    initialize: function() {
        Tian.Widget.prototype.initialize.apply(this, arguments);
        this.notifications = [];
    },
    
    draw: function() {
        Tian.Widget.prototype.draw.apply(this, arguments);
        
        this.div.className = 'txWidgetTitleBar txWidgetNoSelect';
        
        this.spanTitle = document.createElement('span');
        this.spanTitle.className = 'txWidgetTitleBarTitle';
        this.div.appendChild(this.spanTitle);
        
        this.spanNotify = document.createElement('span');
        this.spanNotify.className = 'txWidgetTitleBarNotification';
        this.div.appendChild(this.spanNotify);
        
        return this.div;
    },
    
    destroy: function() {
        this.os && this.os.events.unregister('notify', this, this.onNotify);
        this.notifications = null;
        
        Tian.Widget.prototype.destroy.apply(this, arguments);
    },
    
    setOS: function () {
        Tian.Widget.prototype.setOS.apply(this, arguments);
        
        if (this.os) {
            this.spanTitle.innerHTML = this.os.title;
            this.os.events.register('notify', this, this.onNotify);
        }
    },
    
    onNotify: function(evt) {
        if (evt && evt.data) {
            this.spanNotify.innerHTML = evt.data.notification;
            this.notifications.push(evt.data);
            if (this.notifications.length > 999) {
                this.notifications.shift();
            }
        }
    },
    
    clearNotifications: function() {
        this.spanNotify.innerHTML = '';
        this.notifications = [];
    },
    
    CLASS_NAME: "Tian.Widget.TitleBar"
});
