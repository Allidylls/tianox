// @requires Tian.js
// @requires Class.js
// @requires Array.js

//=============================================================
// Class: Tian.Buffer
// Contains convenience functions for fixed octet buffer array.
// Thanks to node.js.
//-------------------------------------------------------------

(function(global) {

//=============================================================
// private constants and static functions
//-------------------------------------------------------------

// HEX encoding and decoding

var toHex = function(n) {
    if (typeof n === 'number' && Math.floor(n) === n && n >= 0 && n <= 255) {
        if (n < 16) {
            return '0' + n.toString(16);
        } else {
            return n.toString(16);
        }
    }
    
    return '';
};

var hexEncode = function(buffer) {
    var str = '';
    var i, len = buffer.length;

    for(i=0; i<len; i+=1) {
        str += toHex(buffer[i]);
    }

    return (str);
};

var hexDecode = function(string) {
    string = string.replace(/[^A-Fa-f0-9]/g, '');
    
    var buffer = [];
    
    for (var i=0, len=string.length; i<len; i+=2) {
        buffer.push(parseInt(string.slice(i, i+2), 16));
    }
    
    return (buffer);
};

// Base64 encoding and decoding
// Thanks to http://ats.oka.nu/titaniumcore/js/tools/binary.js

var I2A = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'];

var A2I = [
    -1,   -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1, -1,
    -1,   -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1, -1,
    -1,   -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  62,  -1,  -1,  -1, 63,
    52,   53,  54,  55,  56,  57,  58,  59,  60,  61,  -1,  -1,  -1,  -1,  -1, -1,
    -1,    0,   1,   2,   3,   4,   5,   6,   7,   8,   9,  10,  11,  12,  13, 14,
    15,   16,  17,  18,  19,  20,  21,  22,  23,  24,  25,  -1,  -1,  -1,  -1, -1,
    -1,   26,  27,  28,  29,  30,  31,  32,  33,  34,  35,  36,  37,  38,  39, 40,
    41,   42,  43,  44,  45,  46,  47,  48,  49,  50,  51];

var getA2I = function(c) {
    return ( (0<=c) && (c<A2I.length) ? A2I[c] : -1 );
};

var base64Encode = function(buf) {
    var length = buf && buf.length ? buf.length : 0;
    var groupCount = Math.floor(length / 3);
    var remaining = length - 3*groupCount;
    var str = '';

    var idx = 0;
    for (var i=0; i<groupCount; i++) {
	    var b0 = buf[idx++] & 0xff;
	    var b1 = buf[idx++] & 0xff;
	    var b2 = buf[idx++] & 0xff;
	    str += ( I2A[ b0 >> 2] );
	    str += ( I2A[(b0 << 4) & 0x3f | (b1 >> 4)] );
	    str += ( I2A[(b1 << 2) & 0x3f | (b2 >> 6)] );
	    str += ( I2A[ b2 & 0x3f] );
    }

    if (remaining == 1) {
	    var b0 = buf[idx++] & 0xff;
	    str += ( I2A[ b0 >> 2 ] );
	    str += ( I2A[ (b0 << 4) & 0x3f] );
	    str += ( "==" );
    } else if (remaining == 2) {
	    var b0 = buf[idx++] & 0xff;
	    var b1 = buf[idx++] & 0xff;
	    str += ( I2A[ b0 >> 2 ] );
	    str += ( I2A[(b0 << 4) & 0x3f | (b1 >> 4)]);
	    str += ( I2A[(b1 << 2) & 0x3f ] );
	    str += ('=');
    }
    
    return (str);
};

var base64Decode = function(str) {
    var length = str && str.length ? str.length : 0;
    var buf = [];
    
    var groupCount = Math.floor(length/4);
    if (4*groupCount !== length) {
        return (buf);
    }

    var missing = 0;
    if (length > 0) {
	    if (str.charAt(length - 1) === '=') {
	        missing += 1;
	        groupCount -= 1;
	    }
	    if (str.charAt(length - 2) === '=') {
	        missing += 1;
	    }
    }
    
    var idx_in = 0;
    for (var i=0; i<groupCount; i++) {
	    var c0 = getA2I(str.charCodeAt(idx_in++));
	    var c1 = getA2I(str.charCodeAt(idx_in++));
	    var c2 = getA2I(str.charCodeAt(idx_in++));
	    var c3 = getA2I(str.charCodeAt(idx_in++));
	    buf.push( 0xFF & ((c0 << 2) | (c1 >> 4)) );
	    buf.push( 0xFF & ((c1 << 4) | (c2 >> 2)) );
	    buf.push( 0xFF & ((c2 << 6) | c3) );
    }

    if (missing == 1) {
	    var c0 = getA2I(str.charCodeAt(idx_in++));
	    var c1 = getA2I(str.charCodeAt(idx_in++));
	    var c2 = getA2I(str.charCodeAt(idx_in++));
	    buf.push( 0xFF & ((c0 << 2) | (c1 >> 4)) );
	    buf.push( 0xFF & ((c1 << 4) | (c2 >> 2)) );
    } else if (missing == 2) {
	    var c0 = getA2I(str.charCodeAt(idx_in++));
	    var c1 = getA2I(str.charCodeAt(idx_in++));
	    buf.push( 0xFF & ((c0 << 2) | (c1 >> 4)) );
    }
    
    return (buf);
};

// Copyright (c) 2008, Fair Oaks Labs, Inc.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//  * Redistributions of source code must retain the above copyright notice,
//    this list of conditions and the following disclaimer.
//
//  * Redistributions in binary form must reproduce the above copyright notice,
//    this list of conditions and the following disclaimer in the documentation
//    and/or other materials provided with the distribution.
//
//  * Neither the name of Fair Oaks Labs, Inc. nor the names of its contributors
//    may be used to endorse or promote products derived from this software
//    without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.
//
//
// Modifications to writeIEEE754 to support negative zeroes made by Brian White

var readIEEE754 = function(buf, offset, isBE, mLen, nBytes) {
    var e, m,
        eLen = nBytes * 8 - mLen - 1,
        eMax = (1 << eLen) - 1,
        eBias = eMax >> 1,
        nBits = -7,
        i = isBE ? 0 : (nBytes - 1),
        d = isBE ? 1 : -1,
        s = buf[offset + i];

    i += d;

    e = s & ((1 << (-nBits)) - 1);
    s >>= (-nBits);
    nBits += eLen;
    for (; nBits > 0; e = e * 256 + buf[offset + i], i += d, nBits -= 8);

    m = e & ((1 << (-nBits)) - 1);
    e >>= (-nBits);
    nBits += mLen;
    for (; nBits > 0; m = m * 256 + buf[offset + i], i += d, nBits -= 8);

    if (e === 0) {
        e = 1 - eBias;
    } else if (e === eMax) {
        return m ? NaN : ((s ? -1 : 1) * Infinity);
    } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
    }
        
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

var writeIEEE754 = function(buf, value, offset, isBE, mLen, nBytes) {
    var e, m, c,
        eLen = nBytes * 8 - mLen - 1,
        eMax = (1 << eLen) - 1,
        eBias = eMax >> 1,
        rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
        i = isBE ? (nBytes - 1) : 0,
        d = isBE ? -1 : 1,
        s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

    value = Math.abs(value);

    if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
    } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
        }
        if (e + eBias >= 1) {
            value += rt / c;
        } else {
            value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
            e++;
            c /= 2;
        }

        if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
        } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
        } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
        }
    }

    for (; mLen >= 8; buf[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

    e = (e << mLen) | m;
    eLen += mLen;
    for (; eLen > 0; buf[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

    buf[offset + i - d] |= s * 128;
};

//-------------------------------------------------------------
// end of private constants and static functions
//=============================================================
    
// exports api
global.Buffer = global.Class({
    buffer: null,
    
    /**
     * Constructor: Tian.Buffer
     * Construct an Tian.Buffer instance.
     *
     * Usage:
     * new Tian.Buffer(size)
     * new Tian.Buffer(array)
     * new Tian.Buffer(string, encoding)
     * Support encodings: hex, base64
     */
    initialize: function(obj, encoding) {
        var i, len;
        
        if (typeof obj === 'number') {
            // initialize buffer with 0x00
            this.buffer = [];
            len = parseInt(obj, 10);
            for (i=0; i<len; i+=1) {
                this.buffer.push(0);
            }
        } else if (global.Array.isArray(obj)) {
            this.buffer = obj;
        } else if (typeof obj === 'string') {
            switch (encoding) {
            case 'hex':
                this.buffer = hexDecode(obj);
                break;
            case 'base64':
                this.buffer = base64Decode(obj);
                break;
            default:
                this.buffer = hexDecode(obj);
            }
        } else {
            this.buffer = [];
        }
    },
    
    getLength: function() {
        return this.buffer.length;
    },
    
    // convert buffer to hex string
    toString: function(encoding) {
        switch (encoding) {
        case 'hex':
            return hexEncode(this.buffer);
        case 'base64':
            return base64Encode(this.buffer);
        default:
            return hexEncode(this.buffer);
        }
        
        return '';
    },
    
    verify: function(value, type) {
        switch (type) {
        case 'offset':
            return (typeof value === 'number' && value >= 0 && value < this.buffer.length && Math.floor(value) === value);
        case 'char':
            return (typeof value === 'string' && value.length === 1 && value.charCodeAt(0) < 0x80);
        case 'string':
            return (typeof value === 'string' && value.length > 0);
        case 'uint8':
            return (typeof value === 'number' && value >= 0 && value <= 0xff && Math.floor(value) === value);
        case 'uint16':
            return (typeof value === 'number' && value >= 0 && value <= 0xffff && Math.floor(value) === value);
        case 'uint32':
            return (typeof value === 'number' && value >= 0 && value <= 0xffffffff && Math.floor(value) === value);
        case 'int8':
            return (typeof value === 'number' && value >= -0x80 && value <= 0x7f && Math.floor(value) === value);
        case 'int16':
            return (typeof value === 'number' && value >= -0x8000 && value <= 0x7fff && Math.floor(value) === value);
        case 'int32':
            return (typeof value === 'number' && value >= -0x80000000 && value <= 0x7fffffff && Math.floor(value) === value);
        case 'float':
            return (typeof value === 'number' && value >= -3.4028234663852886e+38 && value <= 3.4028234663852886e+38);
        case 'double':
            return (typeof value === 'number' && value >= -1.7976931348623157E+308 && value <= 1.7976931348623157E+308);
        default:
            return false;
        }
    },
    
    // basic io
    getChar: function(offset) {
        if (this.verify(offset, 'offset')) {
            return String.fromCharCode(this.buffer[offset]);
        }
        
        return undefined;
    },
    
    // ASCII character 0 ~ 0x80
    setChar: function(value, offset) {
        if (this.verify(value, 'char') && this.verify(offset, 'offset')) {
            this.buffer[offset] = value.charCodeAt(0);
            return true;
        }
        
        return false;
    },
    
    // support utf8
    getString: function(offset, length) {
        var str = '', i, c;
        
        if (this.verify(offset, 'offset') && this.verify(offset + length - 1, 'offset')) {
            length = offset + length;
            for (i=offset; i<length; ) {
	            c = this.buffer[i++];
	            if (c < 0x80) { // 1 byte
	                str += String.fromCharCode(c);
	            } else if (c < 0xE0) { // 2 bytes
	                str += String.fromCharCode(
		                ( ( 0x1F & c                ) <<  6 ) |
		                ( ( 0x3F & this.buffer[i++] ) <<  0 ) );
	            } else if (c < 0xF0) { // 3 bytes
	                str += String.fromCharCode(
		                ( ( 0x0F & c                ) << 12 ) |
		                ( ( 0x3F & this.buffer[i++] ) <<  6 ) |
		                ( ( 0x3F & this.buffer[i++] ) <<  0 ) );
	            } else if (c < 0xF8) { // 4 bytes
	                str += String.fromCharCode(
		                ( ( 0x07 & c                ) << 18 ) |
		                ( ( 0x3F & this.buffer[i++] ) << 12 ) |
		                ( ( 0x3F & this.buffer[i++] ) <<  6 ) |
		                ( ( 0x3F & this.buffer[i++] ) <<  0 ) );
	            } else if (c < 0xFC) { // 5 bytes
	                str += String.fromCharCode(
		                ( ( 0x03 & c                ) << 24 ) |
		                ( ( 0x3F & this.buffer[i++] ) << 18 ) |
		                ( ( 0x3F & this.buffer[i++] ) << 12 ) |
		                ( ( 0x3F & this.buffer[i++] ) <<  6 ) |
		                ( ( 0x3F & this.buffer[i++] ) <<  0 ) );
	            } else if (c < 0xFE) { // 6 bytes
	                str += String.fromCharCode(
		                ( ( 0x01 & c                ) << 30 ) |
		                ( ( 0x3F & this.buffer[i++] ) << 24 ) |
		                ( ( 0x3F & this.buffer[i++] ) << 18 ) |
		                ( ( 0x3F & this.buffer[i++] ) << 12 ) |
		                ( ( 0x3F & this.buffer[i++] ) <<  6 ) |
		                ( ( 0x3F & this.buffer[i++] ) <<  0 ) );
	            }
            }
            return (str);
        }
        
        return undefined;
    },
    
    // support utf8
    setString: function(value, offset) {
        var i, len, c, buf = [];
        
        if (!this.verify(value, 'string') || !this.verify(offset, 'offset')) {
            return false;
        }
        
        // get char code of utf8 string
        for (i=0, len=value.length; i<len; i++) {
            c = value.charCodeAt(i);
            if (c < 0x80) { // 1 byte
                buf.push(c);
            } else if (c < 0x800) { // 2 bytes
                buf.push(0xC0 | ((c & 0x7C0) >>> 6));
                buf.push(0x80 | (c & 0x3F));
            } else if (c < 0x10000) { // 3 bytes
                buf.push(0xE0 | ((c & 0xF000) >>> 12));
                buf.push(0x80 | ((c & 0xFC0) >>> 6));
                buf.push(0x80 | (c & 0x3F));
            } else { // 4 bytes
                buf.push(0xF0 | ((c & 0x1C0000) >>> 18));
                buf.push(0x80 | ((c & 0x3F000) >>> 12));
                buf.push(0x80 | ((c & 0xFC0) >>> 6));
                buf.push(0x80 | (c & 0x3F));
            }
        }
        
        if (this.verify(offset + buf.length - 1, 'offset')) {
            for (i=0, len=buf.length; i<len; i++) {
                this.buffer[offset+i] = buf[i];
            }
            return true;
        }
        
        return false;
    },
    
    getUInt8: function(offset) {
        if (this.verify(offset, 'offset')) {
            return (this.buffer[offset]);
        }
        
        return undefined;
    },
    
    setUInt8: function(value, offset) {
        if (this.verify(value, 'uint8') && this.verify(offset, 'offset')) {
            this.buffer[offset] = value;
            return true;
        }
        
        return false;
    },
    
    getUInt16: function(offset, bigEndian) {
        var val = 0;
        if (this.verify(offset, 'offset') && this.verify(offset + 1, 'offset')) {
            if (bigEndian) {
                val = this.buffer[offset] << 8;
                val |= this.buffer[offset + 1];
            } else {
                val = this.buffer[offset];
                val |= this.buffer[offset + 1] << 8;
            }
            return (val);
        }
        
        return undefined;
    },
    
    setUInt16: function(value, offset, bigEndian) {
        if (this.verify(value, 'uint16') && this.verify(offset, 'offset') && this.verify(offset + 1, 'offset')) {
            if (bigEndian) {
                this.buffer[offset] = (value & 0xff00) >>> 8;
                this.buffer[offset + 1] = value & 0x00ff;
            } else {
                this.buffer[offset + 1] = (value & 0xff00) >>> 8;
                this.buffer[offset] = value & 0x00ff;
            }
            return true;
        }
        
        return false;
    },
    
    getUInt32: function(offset, bigEndian) {
        var val = 0;
        if (this.verify(offset, 'offset') && this.verify(offset + 3, 'offset')) {
            if (bigEndian) {
                val = this.buffer[offset + 1] << 16;
                val |= this.buffer[offset + 2] << 8;
                val |= this.buffer[offset + 3];
                val = val + (this.buffer[offset] << 24 >>> 0);
            } else {
                val = this.buffer[offset + 2] << 16;
                val |= this.buffer[offset + 1] << 8;
                val |= this.buffer[offset];
                val = val + (this.buffer[offset + 3] << 24 >>> 0);
            }
            return (val);
        }
        
        return undefined;
    },
    
    setUInt32: function(value, offset, bigEndian) {
        if (this.verify(value, 'uint32') && this.verify(offset, 'offset') && this.verify(offset + 3, 'offset')) {
            if (bigEndian) {
                this.buffer[offset] = (value >>> 24) & 0xff;
                this.buffer[offset + 1] = (value >>> 16) & 0xff;
                this.buffer[offset + 2] = (value >>> 8) & 0xff;
                this.buffer[offset + 3] = value & 0xff;
            } else {
                this.buffer[offset + 3] = (value >>> 24) & 0xff;
                this.buffer[offset + 2] = (value >>> 16) & 0xff;
                this.buffer[offset + 1] = (value >>> 8) & 0xff;
                this.buffer[offset] = value & 0xff;
            }
            return true;
        }
        
        return false;
    },
    
    getInt8: function(offset) {
        if (this.verify(offset, 'offset')) {
            if (this.buffer[offset] & 0x80) { // negative
                return ((0xff - this.buffer[offset] + 1) * -1);
            } else { // positive
                return (this.buffer[offset]);
            }
        }
        
        return undefined;
    },
    
    setInt8: function(value, offset) {
        if (this.verify(value, 'int8') && this.verify(offset, 'offset')) {
            if (value >= 0) {
                return this.setUInt8(value, offset);
            } else {
                return this.setUInt8(0xff + value + 1, offset);
            }
        }
        
        return false;
    },
    
    getInt16: function(offset, bigEndian) {
        var val = 0;
        if (this.verify(offset, 'offset') && this.verify(offset + 1, 'offset')) {
            val = this.getUInt16(offset, bigEndian);
            if (val & 0x8000) { // negative
                val = (0xffff - val + 1) * -1;
            }
            return (val);
        }
        
        return undefined;
    },
    
    setInt16: function(value, offset, bigEndian) {
        if (this.verify(value, 'int16') && this.verify(offset, 'offset') && this.verify(offset + 1, 'offset')) {
            if (value >= 0) {
                return this.setUInt16(value, offset, bigEndian);
            } else {
                return this.setUInt16(0xffff + value + 1, offset, bigEndian);
            }
        }
        
        return false;
    },
    
    getInt32: function(offset, bigEndian) {
        var val = 0;
        if (this.verify(offset, 'offset') && this.verify(offset + 3, 'offset')) {
            val = this.getUInt32(offset, bigEndian);
            if (val & 0x80000000) { // negative
                val = (0xffffffff - val + 1) * -1;
            }
            return (val);
        }
        
        return undefined;
    },
    
    setInt32: function(value, offset, bigEndian) {
        if (this.verify(value, 'int32') && this.verify(offset, 'offset') && this.verify(offset + 3, 'offset')) {
            if (value >= 0) {
                return this.setUInt32(value, offset, bigEndian);
            } else {
                return this.setUInt32(0xffffffff + value + 1, offset, bigEndian);
            }
        }
        
        return false;
    },
    
    getFloat: function(offset, bigEndian) {
        if (this.verify(offset, 'offset') && this.verify(offset + 3, 'offset')) {
            return readIEEE754(this.buffer, offset, bigEndian, 23, 4);
        }
        
        return undefined;
    },
    
    setFloat: function(value, offset, bigEndian) {
        if (this.verify(value, 'float') && this.verify(offset, 'offset') && this.verify(offset + 3, 'offset')) {
            writeIEEE754(this.buffer, value, offset, bigEndian, 23, 4);
            return true;
        }
        
        return false;
    },
    
    getDouble: function(offset, bigEndian) {
        if (this.verify(offset, 'offset') && this.verify(offset + 7, 'offset')) {
            return readIEEE754(this.buffer, offset, bigEndian, 52, 8);
        }
        
        return undefined;
    },
    
    setDouble: function(value, offset, bigEndian) {
        if (this.verify(value, 'double') && this.verify(offset, 'offset') && this.verify(offset + 7, 'offset')) {
            writeIEEE754(this.buffer, value, offset, bigEndian, 52, 8);
            return true;
        }
        
        return false;
    }
});

// end of exports

})(Tian);

