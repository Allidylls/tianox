/* Copyright (c) 2012-2012 by yantaotian@gmail.com */

/**
 * @requires Class.js
 */

// Class: Tian.Widget
// A widget is a div appending to the main OS div
Tian.Widget = Tian.Class({
    div: null,
    title: null,
    baseZIndex: 1000,
    
    // reference to the os
    os: null,
    
    initialize: function() {
    },
    
    draw: function() {
        this.div = document.createElement('div');
        this.div.id = Tian.createUniqueID('txWidgetID_');
        this.div.style.zIndex = (this.baseZIndex + parseInt(this.div.id.slice(11), 10));
        if (this.title) {
            this.div.title = this.title;
        }
        
        return this.div;
    },
    
    destroy: function() {
        var parent = this.div.parentNode;
        if (parent && parent.removeChild) {
            parent.removeChild(this.div);
        }
        this.div = null;
        this.os = null;
    },
    
    // set os
    setOS: function(os) {
        if (!this.os) {
            this.os = os;
        }
    },
    
    // get os
    getOS: function() {
        return this.os;
    },
    
    CLASS_NAME: "Tian.Widget"
});
