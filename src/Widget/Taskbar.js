/**
 * @requires Widget.js
 */

// Class: Tian.Widget.Taskbar
Tian.Widget.Taskbar = Tian.Class(Tian.Widget, {
    draw: function() {
        Tian.Widget.prototype.draw.apply(this, arguments);
        
        if (this.div) {
            this.div.className = 'txWidgetTaskbar txWidgetNoSelect';
        }
        
        return this.div;
    },
    
    CLASS_NAME: "Tian.Widget.Taskbar"
});
