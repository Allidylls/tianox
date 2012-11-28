// @requires Tian.js

//=============================================================
// Dynamicaly loading js/css file functions
//-------------------------------------------------------------

// require js files
// usage:
// Tian.require('1.js');
// Tian.require(['1.js', '2.js', '3.js'], function(err) {}, document);
Tian.require = function(urls, callback, doc) {
    doc = doc || document;
    
    var head = doc.getElementsByTagName("head")[0] || doc.documentElement;
    if (!head) {
        callback && callback.call(null, 'error');
        return;
    }
    
    if (typeof urls === 'string') {
        urls = [urls];
    }
    
    var count = 0, dones = [], nodes = [];
    
    for (var i=0, len=urls.length; i<len; i++) {
        if (typeof urls[i] === 'string') {
            dones[i] = false;
            // create a scirpt node
            nodes[i] = doc.createElement('script');
            nodes[i].charset = 'utf-8';
            nodes[i].src = urls[i];
            
            // attach handlers for all browsers
            nodes[i].onload = nodes[i].onreadystatechange = (function(idx) { return function() {
                if (!dones[idx] &&
                    //(!this.readyState || this.readyState==='loaded' || this.readyState==='complete')) {
                    (!nodes[idx].readyState || /loaded|complete/.test(nodes[idx].readyState))) {
                    dones[idx] = true;
                    count += 1;
                    // handle memory leak for IE
                    nodes[idx].onload = nodes[idx].onreadystatechange = null;
                    if (head && nodes[idx].parentNode) {
                        head.removeChild(nodes[idx]);
                    }
                    // Dereference the node
                    nodes[idx] = undefined;
                    // call the callback function if all done
                    if (count === urls.length) {
                        callback && callback.call(null);
                    }
                }
            }}(i));
            
            // Use insertBefore instead of appendChild to circumvent an IE6 bug.
            // This arises when a base node is used
            head.insertBefore(nodes[i], head.firstChild);
        }
    }
};

Tian.requireCSS = function (url, callback, doc) {
    doc = doc || document;
    
    // do not load the same url many times
    var found = false;
    var allNodes = doc.getElementsByTagName('link');
    for (var i=0; i<allNodes.length; i++) { 
        if (allNodes[i] && allNodes[i].href == url) {
            found = true;
            break;
        }
    }
    
    if (!found) {
        var node = doc.createElement("link");
        node.type = 'text/css';
        node.rel = 'stylesheet';
        node.href = url;
        var head = doc.getElementsByTagName("head")[0] || doc.documentElement;
        head.insertBefore(node, head.firstChild);
    }
    
    // simulate the onload event handler
    callback && callback.call(null);
};

Tian.removeCSS = function (url, callback, doc) {
    doc = doc || document;
    
    var allNodes = doc.getElementsByTagName('link');
    //search backwards within nodelist for matching elements to remove
    for (var i = allNodes.length; i >= 0; i--) { 
        if (allNodes[i] && 
            allNodes[i].href != null && 
            allNodes[i].href.indexOf(url) != -1 &&
            allNodes[i].parentNode) {
            allNodes[i].parentNode.removeChild(allNodes[i]);
        }
    }
    
    callback && callback.call(null);
};

Tian.replaceCSS = function (oldurl, newurl, callback, doc) {
    doc = doc || document;

    Tian.requireCSS(newurl, doc);
    Tian.removeCSS(oldurl, doc);
    
    callback && callback.call(null);
};

//=============================================================
// Bootstrap mechanism
// Look for data-boot script attribute, whick link to the boot.
//-------------------------------------------------------------

(function() {
    var ss = document.getElementsByTagName('script'),
        boot = false;
    
    for(var i=0; i<ss.length; i++) {
        boot = ss[i].getAttribute('data-boot');
        if(boot) {
            // start this boot
            Tian.require(boot);
            return;
        }
    }
    
    // start default bootstrap sequence
    //Tian.require('http://host.name/boot.min.js');
})();

