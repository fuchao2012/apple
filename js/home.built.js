(function e(b, g, d) {
    function c(k, i) {
        if (!g[k]) {
            if (!b[k]) {
                var h = typeof require == "function" && require;
                if (!i && h) {
                    return h(k, !0)
                }
                if (a) {
                    return a(k, !0)
                }
                throw new Error("Cannot find module '" + k + "'")
            }
            var j = g[k] = {
                exports: {}
            };
            b[k][0].call(j.exports, function (l) {
                var m = b[k][1][l];
                return c(m ? m : l)
            }, j, j.exports, e, b, g, d)
        }
        return g[k].exports
    }
    var a = typeof require == "function" && require;
    for (var f = 0; f < d.length; f++) {
        c(d[f])
    }
    return c
})({
    1: [
        function (b, c, a) {
            c.exports = b("./ac-promomanager/PromoManager")
}, {
            "./ac-promomanager/PromoManager": 2
        }],
    2: [
        function (h, f, j) {
            var c = h("ac-base").Array;
            var l = h("ac-base").Class;
            var a = h("ac-base").Element;
            var i = h("ac-base").Log;
            var g = h("ac-base").Object;
            var d = h("ac-storage");
            var b = h("./PromoManager/History");
            var m = h("./PromoManager/Promo");
            var k = new l({
                __defaultOptions: {
                    prefixString: "pm-",
                    appendLocale: true,
                    rotate: false,
                    rotateInterval: 3000,
                    rotateAnimation: true
                },
                initialize: function (p, q, o) {
                    if (d === undefined) {
                        throw "AC.PromoManager requires that AC.Storage exists on page."
                    }
                    this._options = g.extend(g.clone(this.__defaultOptions), o || {});
                    this._history = null;
                    this._storageName = null;
                    this._promos = null;
                    this._currentPromo = -1;
                    this._delegate = {};
                    g.synthesize(this);
                    this.setStorageName(p);
                    var n = this.setPromos(q);
                    if (n.length < 2) {
                        return null
                    }
                    this.__weightPromos();
                    this.__selectFirstPromo();
                    if (this._options.rotate) {
                        window.setInterval(function () {
                            this.selectNextPromo(this._options.rotateAnimation)
                        }.bind(this), this._options.rotateInterval)
                    }
                    k.instances.push(this)
                },
                selectPromo: function (n, o) {
                    var p = this.promos();
                    o = !!o;
                    if (p[n]) {
                        if (p[this.currentPromo()]) {
                            p[this.currentPromo()].hide(o)
                        }
                        p[n].show(o);
                        this.setCurrentPromo(n);
                        this.history().add(n)
                    }
                },
                selectNextPromo: function (o) {
                    var n = this.currentPromo() + 1;
                    if (n >= this.promos().length) {
                        n = 0
                    }
                    this.selectPromo(n, o)
                },
                currentPromoElement: function () {
                    return this.promos()[this.currentPromo()]._promo
                },
                __selectFirstPromo: function () {
                    var n = -1;
                    var p = this.promos();
                    var o = this.history().data();
                    p.forEach(function (q, r) {
                        if ((r !== o[0]) && ((n === -1) || (q.weight() > p[n].weight()))) {
                            n = r
                        }
                    });
                    this.selectPromo(n, false)
                },
                __lowestWeight: function () {
                    var n = 1;
                    this.promos().forEach(function (o) {
                        var p = o.weight();
                        if (p < n) {
                            n = p
                        }
                    });
                    return n
                },
                __weightPromos: function () {
                    var p = [];
                    var n = 0;
                    var o = 0;
                    this.promos().forEach(function (q) {
                        var r = q.weight();
                        if (typeof r !== "number" || r <= 0) {
                            p.push(q)
                        } else {
                            n += r
                        } if (n > 1) {
                            new i("Promo weighting total is > 100%.")
                        }
                    });
                    if (p.length > 0) {
                        o = ((1 - n) / p.length);
                        p.forEach(function (q) {
                            q.setWeight(o)
                        })
                    }
                    this.__loadHistory(this.storageName());
                    this.__historicallyWeightPromos()
                },
                __loadHistory: function (p) {
                    var n;
                    var q;
                    if (!this.promos()) {
                        throw "Cannot load history until we know how many promos there are."
                    }
                    n = Math.floor(1 / (this.__lowestWeight() || 1)) - 1;
                    q = new b(p, n);
                    var o = q.load();
                    this.setHistory(q);
                    return o
                },
                __historicallyWeightPromos: function () {
                    var p = this.promos();
                    var o = this.history().data();
                    var n = (1 / o.length) * -1;
                    o.forEach(function (q) {
                        if (p[q] !== undefined) {
                            p[q].offsetWeight(n)
                        }
                    })
                },
                setStorageName: function (n) {
                    if (typeof this._storageName === "string") {
                        throw "Storage name cannot change after it is set."
                    }
                    this._storageName = this.options().prefixString + n;
                    if (this.options().appendLocale === true) {
                        this._storageName += "-" + window.document.documentElement.getAttribute("lang")
                    }
                    return this._storageName
                },
                setHistory: function (n) {
                    if (n === undefined) {
                        throw "Cannot set PromoManager history to undefined."
                    }
                    if (this._history !== null) {
                        throw "Cannot set PromoManager history more than once for the same Promo Slot."
                    }
                    this._history = n;
                    return this._history
                },
                setPromos: function (o) {
                    if (this._promos !== null) {
                        throw "Cannot set promos more than once for the same Promo Slot."
                    }
                    var n = this;
                    n._promos = [];
                    o = (typeof o === "string") ? a.selectAll("." + o) : c.toArray(o);
                    if (o.length < 2) {
                        return n._promos
                    }
                    o.forEach(function (p) {
                        n._promos.push(m.promoFromElementOrObject(p))
                    });
                    return n._promos
                },
                setCurrentPromo: function (n) {
                    if (typeof n === "number" && this.promos()[n] !== undefined) {
                        this._currentPromo = n
                    }
                    return this._currentPromo
                }
            });
            k.instances = [];
            f.exports = k
        }, {
            "./PromoManager/History": 3,
            "./PromoManager/Promo": 4,
            "ac-base": false,
            "ac-storage": 5
        }],
    3: [
        function (d, f, b) {
            var a = d("ac-base").Object;
            var c = d("ac-storage");
            var g = function (j, h, i) {
                this._data = [];
                a.synthesize(this);
                this.__key = j;
                this.__maxLength = h || 1;
                this.__expiration = i || 30
            };
            g.prototype = {
                add: function (h) {
                    var i = this.data();
                    i = [h].concat(i);
                    this.setData(i);
                    this.save();
                    return this.data()
                },
                save: function () {
                    var j = this.data();
                    var i = this.__key;
                    var h = this.__expiration;
                    if (typeof i === "string") {
                        c.setItem(i, j, h)
                    }
                },
                load: function () {
                    if (typeof this.__key === "string") {
                        var h = c.getItem(this.__key);
                        if (h) {
                            return this.setData(h)
                        }
                    }
                },
                setData: function (h) {
                    if (Array.isArray(h)) {
                        if (h.length > this.__maxLength) {
                            h = h.slice(0, this.__maxLength)
                        }
                        this._data = h
                    }
                    return this._data
                }
            };
            f.exports = g
        }, {
            "ac-base": false,
            "ac-storage": 5
        }],
    4: [
        function (f, c, h) {
            var b = f("ac-base").EasingFunctions;
            var a = f("ac-base").Element;
            var j = f("ac-base").Environment;
            var k = f("ac-base").Function;
            var d = f("ac-base").Object;
            var g = f("ac-base").String;
            var i = function (m, n, l) {
                if (!a.isElement(m)) {
                    throw "AC.PromoManager.Promo require Element Node as first argument."
                }
                this._options = d.extend(d.clone(this.__defaultOptions), l || {});
                this._promo = m;
                this._weight = 0;
                d.synthesize(this);
                this.setWeight(n || 0);
                if (this.options().hideOnInit === true) {
                    this.hide()
                }
            };
            i.prototype = {
                __defaultOptions: {
                    hideOnInit: true,
                    animationDuration: 0.4,
                    animationTimingFunction: "ease-out",
                    animationZIndex: 1000
                },
                offsetWeight: function (l) {
                    if (!isNaN(l)) {
                        this.setWeight(this.weight() + l)
                    }
                    return this.weight()
                },
                show: function (l) {
                    if (!l) {
                        a.setStyle(this.promo(), {
                            display: "block"
                        })
                    } else {
                        this.__animate(1)
                    }
                },
                hide: function (l) {
                    if (!l) {
                        a.setStyle(this.promo(), {
                            display: "none"
                        })
                    } else {
                        this.__animate(0)
                    }
                },
                __animate: function (m) {
                    var l = this.promo();
                    var p = a.getStyle(l, "z-index") || "auto";
                    var n = this.options().animationZIndex;
                    var o = function () {
                        a.setStyle(l, {
                            "z-index": p
                        });
                        if (m === 0) {
                            a.setStyle(l, {
                                display: "none"
                            })
                        }
                    };
                    if (m > 0) {
                        a.setStyle(l, {
                            display: "block"
                        })
                    }
                    a.setStyle(l, {
                        "z-index": n
                    });
                    if (j.Feature.cssPropertyAvailable("transition")) {
                        this.__animateWithCSS(m, o)
                    } else {
                        this.__animateWithJS(m, o)
                    }
                },
                __animateWithCSS: function (m, o) {
                    var l = this.promo();
                    var n;
                    a.setVendorPrefixStyle(l, "transition", "opacity " + this.options().animationDuration + "s " + this.options().animationTimingFunction);
                    a.setStyle(l, {
                        opacity: 0
                    });
                    n = function (p) {
                        if (p.target === l && p.propertyName === "opacity") {
                            o();
                            a.removeVendorPrefixEventListener(l, "transitionEnd", n)
                        }
                    };
                    a.addVendorPrefixEventListener(l, "transitionEnd", n)
                },
                __animateWithJS: function (n, q) {
                    var m = this.promo();
                    var p = g.toCamelCase(this.options().animationTimingFunction);
                    var o;
                    if ((p === "easeOut") || (p === "easein") || (p === "easeinOut")) {
                        p += "Quad"
                    }
                    o = b[p];
                    var l = function (r) {
                        if (n === 0) {
                            r = (1 - r)
                        }
                        if (typeof o === "function") {
                            r = o(r, 0, 1, 1)
                        }
                        a.setStyle(m, {
                            opacity: r
                        })
                    };
                    k.iterateFramesOverAnimationDuration(l, this.options().animationDuration, q)
                },
                setWeight: function (l) {
                    if (!isNaN(l)) {
                        this._weight = l
                    }
                    return this._weight
                }
            };
            i.promoFromElementOrObject = function (l) {
                if (a.isElement(l)) {
                    return i.promoFromElement(l)
                } else {
                    return i.promoFromObject(l)
                }
            };
            i.promoFromElement = function (m) {
                if (!a.isElement(m)) {
                    throw "Promo is not an element."
                }
                var l = new i(m);
                return l
            };
            i.promoFromObject = function (m) {
                if (m === undefined || !a.isElement(m.promo)) {
                    throw "Promo object not formatted as expected."
                }
                var l = new i(m.promo, m.weight);
                return l
            };
            c.exports = i
        }, {
            "ac-base": false
        }],
    5: [
        function (d, g, a) {
            var h = "ac-storage-";
            var c = d("./ac-storage/Item");
            var i = d("./ac-storage/Storage");
            var b = d("./ac-storage/Storage/storageAvailable");
            var f = new i(h);
            f.Item = c;
            f.storageAvailable = b;
            g.exports = f
        }, {
            "./ac-storage/Item": 6,
            "./ac-storage/Storage": 13,
            "./ac-storage/Storage/storageAvailable": 15
        }],
    6: [
        function (d, b, j) {
            var a = d("ac-base").adler32;
            var i = d("ac-base").Object;
            var k = d("./Item/apis");
            var c = d("./Item/createExpirationDate");
            var l = d("./Item/encoder");
            var h = 1000 * 60 * 60 * 24;
            var g = 30;

            function f(m) {
                if (!m || typeof m !== "string") {
                    throw "ac-storage/Item: Key for Item must be a string"
                }
                this._key = m;
                this._checksum = null;
                this._expirationDate = null;
                this._metadata = null;
                this._value = null;
                i.synthesize(this);
                this.setExpirationDate(f.createExpirationDate(g))
            }
            f.prototype = {
                save: function () {
                    var o;
                    var n;
                    var p;
                    var m = {};
                    o = k.best(m);
                    if (o) {
                        if (this.value() === null && typeof o.removeItem === "function") {
                            return o.removeItem(this.key())
                        } else {
                            if (typeof o.setItem === "function") {
                                n = this.__state();
                                p = l.encode(n);
                                return o.setItem(this.key(), p, this.expirationDate())
                            }
                        }
                    }
                    return false
                },
                load: function () {
                    var m;
                    var n;
                    m = k.best();
                    if (m && typeof m.getItem === "function") {
                        n = m.getItem(this.key());
                        this.__updateState(l.decode(n));
                        if (n === null || this.hasExpired()) {
                            this.remove();
                            return false
                        } else {
                            return true
                        }
                    } else {
                        return false
                    }
                },
                remove: function () {
                    var m;
                    this.__updateState(null);
                    m = k.best();
                    return m.removeItem(this.key())
                },
                hasExpired: function (m) {
                    if (((this.expirationDate() !== false) && (this.expirationDate() <= Date.now())) || !this.__checksumIsValid(m)) {
                        return true
                    }
                    return false
                },
                value: function (m) {
                    if (this.hasExpired(m)) {
                        this.remove()
                    }
                    return this._value
                },
                setChecksum: function (m) {
                    if (m === null) {
                        this._checksum = m
                    } else {
                        if (typeof m === "string" && m !== "") {
                            this._checksum = a(m)
                        } else {
                            throw "ac-storage/Item#setChecksum: Checksum must be null or a string"
                        }
                    }
                },
                setExpirationDate: function (m) {
                    if (m === null) {
                        m = f.createExpirationDate(g)
                    }
                    if (m !== false) {
                        if (typeof m === "string") {
                            m = new Date(m).getTime()
                        }
                        if (m && typeof m.getTime === "function") {
                            m = m.getTime()
                        }
                        if (!m || isNaN(m)) {
                            throw "ac-storage/Item: Invalid date object provided as expirationDate"
                        }
                        m -= m % h;
                        if (m <= Date.now()) {
                            m = false
                        }
                    }
                    this._expirationDate = m
                },
                __state: function () {
                    var m = {};
                    m.checksum = this.checksum();
                    m.expirationDate = this.expirationDate();
                    m.metadata = this.metadata();
                    m.value = this.value();
                    return m
                },
                __updateState: function (m) {
                    var o;
                    var n;
                    if (m === null) {
                        m = {
                            checksum: null,
                            expirationDate: null,
                            metadata: null,
                            value: null
                        }
                    }
                    for (o in m) {
                        n = "set" + o.charAt(0).toUpperCase() + o.slice(1);
                        if (typeof this[n] === "function") {
                            this[n](m[o])
                        }
                    }
                },
                __checksumIsValid: function (m) {
                    if (m) {
                        m = a(m);
                        if (!this.checksum()) {
                            throw "ac-storage/Item: No checksum exists to determine if this Item’s value is valid. Try loading context from persistent storage first."
                        } else {
                            if (m === this.checksum()) {
                                return true
                            }
                        }
                        return false
                    } else {
                        if (this.checksum()) {
                            throw "ac-storage/Item: No checksum passed, but checksum exists in Item’s state."
                        }
                    }
                    return true
                },
                setKey: function () {
                    throw "ac-storage/Item: Cannot set key after synthesizing"
                }
            };
            f.createExpirationDate = c;
            b.exports = f
        }, {
            "./Item/apis": 7,
            "./Item/createExpirationDate": 10,
            "./Item/encoder": 11,
            "ac-base": false
        }],
    7: [
        function (d, g, b) {
            var h = d("ac-base").log;
            var c = d("./apis/localStorage");
            var a = d("./apis/userData");
            var f = {
                _list: [c, a],
                list: function () {
                    return this._list
                },
                all: function (k) {
                    h("ac-storage/Item/apis.all: Method is deprecated");
                    var i = Array.prototype.slice.call(arguments, 1);
                    if (typeof k !== "string") {
                        throw "ac-storage/Item/apis.all: Method name must be provided as a string"
                    }
                    var j = this.list().map(function (l) {
                        if (l.available()) {
                            if (typeof l[k] === "function") {
                                return l[k].apply(l, i)
                            } else {
                                throw "ac-storage/Item/apis.all: Method not available on api"
                            }
                        }
                        return false
                    });
                    return j
                },
                best: function () {
                    var i = null;
                    this.list().some(function (j) {
                        if (j.available()) {
                            i = j;
                            return true
                        }
                    });
                    return i
                }
            };
            g.exports = f
        }, {
            "./apis/localStorage": 8,
            "./apis/userData": 9,
            "ac-base": false
        }],
    8: [
        function (d, f, b) {
            var a = d("ac-base").Environment.Feature;
            var g = window.localStorage;
            var i = window.sessionStorage;
            var h;
            var c = {
                name: "localStorage",
                available: function () {
                    if (h === undefined) {
                        h = a.localStorageAvailable()
                    }
                    return h
                },
                getItem: function (j) {
                    return g.getItem(j) || i.getItem(j)
                },
                setItem: function (k, l, j) {
                    if (j === false) {
                        i.setItem(k, l)
                    } else {
                        g.setItem(k, l)
                    }
                    return true
                },
                removeItem: function (j) {
                    g.removeItem(j);
                    i.removeItem(j);
                    return true
                }
            };
            f.exports = c
        }, {
            "ac-base": false
        }],
    9: [
        function (d, f, c) {
            var g = d("ac-base").Element;
            var i = 1000 * 60 * 60 * 24;
            var a = "ac-storage";
            var h;
            var b = {
                name: "userData",
                available: function () {
                    if (h === undefined) {
                        h = false;
                        if (document && document.body) {
                            var j = this.element();
                            if (g.isElement(j) && j.addBehavior !== undefined) {
                                h = true
                            }
                            if (h === false) {
                                this.removeElement()
                            }
                        } else {
                            throw "ac-storage/Item/apis/userData: DOM must be ready before using #userData."
                        }
                    }
                    return h
                },
                getItem: function (j) {
                    var k = this.element();
                    k.load(a);
                    return k.getAttribute(j) || null
                },
                setItem: function (k, m, j) {
                    var l = this.element();
                    l.setAttribute(k, m);
                    if (j === false) {
                        j = new Date(Date.now() + i)
                    }
                    if (j && typeof j.toUTCString === "function") {
                        l.expires = j.toUTCString()
                    }
                    l.save(a);
                    return true
                },
                removeItem: function (j) {
                    var k = this.element();
                    k.removeAttribute(j);
                    k.save(a);
                    return true
                },
                _element: null,
                element: function () {
                    if (this._element === null) {
                        this._element = document.createElement("meta");
                        this._element.setAttribute("id", "userData");
                        this._element.setAttribute("name", "ac-storage");
                        this._element.style.behavior = "url('#default#userData')";
                        document.getElementsByTagName("head")[0].appendChild(this._element)
                    }
                    return this._element
                },
                removeElement: function () {
                    if (this._element !== null) {
                        g.remove(this._element)
                    }
                    return this._element
                }
            };
            f.exports = b
        }, {
            "ac-base": false
        }],
    10: [
        function (b, c, a) {
            var f = 1000 * 60 * 60 * 24;
            var d = function (h, g) {
                if (typeof h !== "number") {
                    throw "ac-storage/Item/createExpirationDate: days parameter must be a number."
                }
                if (g === undefined || typeof g === "number") {
                    g = g === undefined ? new Date() : new Date(g)
                }
                if (typeof g.toUTCString !== "function" || g.toUTCString() === "Invalid Date") {
                    throw "ac-storage/Item/createExpirationDate: fromDate must be a date object, timestamp, or undefined."
                }
                g.setTime(g.getTime() + (h * f));
                return g.getTime()
            };
            c.exports = d
        }, {}],
    11: [
        function (b, c, a) {
            var f = b("./encoder/compressor");
            var d = {
                encode: function (i) {
                    var g;
                    var h;
                    h = f.compress(i);
                    try {
                        g = JSON.stringify(h)
                    } catch (j) {}
                    if (!this.__isValidStateObjString(g)) {
                        throw "ac-storage/Item/encoder/encode: state object is invalid or cannot be saved as string"
                    }
                    return g
                },
                decode: function (g) {
                    var h;
                    var i;
                    if (!this.__isValidStateObjString(g)) {
                        if (g === undefined || g === null || g === "") {
                            return null
                        }
                        throw "ac-storage/Item/encoder/decode: state string does not contain a valid state object"
                    }
                    try {
                        h = JSON.parse(g)
                    } catch (j) {
                        throw "ac-storage/Item/encoder/decode: Item state object could not be decoded"
                    }
                    i = f.decompress(h);
                    return i
                },
                __isValidStateObjString: function (g) {
                    try {
                        if (g !== undefined && g.substring(0, 1) === "{") {
                            return true
                        }
                        return false
                    } catch (h) {
                        return false
                    }
                }
            };
            c.exports = d
        }, {
            "./encoder/compressor": 12
        }],
    12: [
        function (b, c, a) {
            var g = 1000 * 60 * 60 * 24;
            var d = 14975;
            var f = {
                mapping: {
                    key: "k",
                    checksum: "c",
                    expirationDate: "e",
                    metadata: "m",
                    value: "v"
                },
                compress: function (j) {
                    var h = {};
                    var i = f.mapping;
                    for (var l in i) {
                        if (j.hasOwnProperty(l) && j[l]) {
                            if (l === "expirationDate") {
                                var k = this.millisecondsToOffsetDays(j[l]);
                                h[i[l]] = k
                            } else {
                                h[i[l]] = j[l]
                            }
                        }
                    }
                    return h
                },
                decompress: function (h) {
                    var k = {};
                    var j = f.mapping;
                    for (var l in j) {
                        if (h.hasOwnProperty(j[l])) {
                            if (l === "expirationDate") {
                                var i = this.offsetDaysToMilliseconds(h[j[l]]);
                                k[l] = i
                            } else {
                                k[l] = h[j[l]]
                            }
                        }
                    }
                    return k
                },
                millisecondsToOffsetDays: function (h) {
                    return Math.floor(h / g) - d
                },
                offsetDaysToMilliseconds: function (h) {
                    return (h + d) * g
                }
            };
            c.exports = f
        }, {}],
    13: [
        function (g, h, d) {
            var c = g("ac-base").Object;
            var f = g("./Item/apis/localStorage");
            var b = g("./Storage/registry");
            var a = {};

            function i(k, j) {
                this._namespace = k || "";
                this._options = c.extend(c.clone(a), j || {});
                c.synthesize(this)
            }
            i.prototype = {
                getItem: function (j) {
                    var k = this.__item(j);
                    k.load();
                    return k.value()
                },
                setItem: function (j, l) {
                    var k = this.__item(j);
                    if (l === undefined) {
                        throw "ac-storage/Storage#setItem: Must provide value to set key to. Use #removeItem to remove."
                    }
                    k.setValue(l);
                    return k.save()
                },
                removeItem: function (j) {
                    var k = this.__item(j);
                    b.remove(k.key(), true);
                    return k.save()
                },
                removeExpired: function () {
                    var p;
                    var n;
                    if (f.available()) {
                        for (n = 0; n < window.localStorage.length; n++) {
                            p = this.__item(window.localStorage.key(n));
                            if (p.hasExpired() && JSON.parse(window.localStorage[window.localStorage.key(n)]).v !== "undefined") {
                                p.remove()
                            }
                        }
                    } else {
                        var l = "ac-storage";
                        var o = document.getElementById("userData");
                        o.load(l);
                        var k;
                        var q = o.xmlDocument;
                        var m = q.firstChild.attributes;
                        var j = m.length;
                        n = -1;
                        while (++n < j) {
                            k = m[n];
                            p = this.__item(k.nodeName);
                            if (p.hasExpired() && JSON.parse(k.nodeValue).v !== "undefined") {
                                p.remove()
                            }
                        }
                    }
                },
                __item: function (j) {
                    if (typeof j !== "string" || j === "") {
                        throw "ac-storage/Storage: Key must be a String."
                    }
                    var k = b.item(this.namespace() + j);
                    return k
                }
            };
            h.exports = i
        }, {
            "./Item/apis/localStorage": 8,
            "./Storage/registry": 14,
            "ac-base": false
        }],
    14: [
        function (f, g, c) {
            var d = f("../Item");
            var b = {};
            var a = {
                item: function (h) {
                    var i = b[h];
                    if (!i) {
                        i = this.register(h)
                    }
                    return i
                },
                register: function (h) {
                    var i = b[h];
                    if (!i) {
                        i = new d(h);
                        b[h] = i
                    }
                    return i
                },
                clear: function (i) {
                    var h;
                    for (h in b) {
                        this.remove(h, i)
                    }
                    return true
                },
                remove: function (h, i) {
                    var j = b[h];
                    if (j && !!i) {
                        j.remove()
                    }
                    b[h] = null;
                    return true
                }
            };
            g.exports = a
        }, {
            "../Item": 6
        }],
    15: [
        function (c, f, a) {
            var d = c("../Item/apis");
            var g;
            f.exports = function b() {
                if (g !== undefined) {
                    return g
                }
                g = !!d.best();
                return g
            }
        }, {
            "../Item/apis": 7
        }],
    16: [
        function (c, f, b) {
            var h = c("ac-base").Element;
            var d = c("ac-storage");

            function a(j, l, k, i) {
                this.element = h.getElementById(j);
                this.prefix = l;
                this.count = k;
                this.key = i || "home-applewatch-hero";
                this._last = d.getItem(this.key);
                this.next()
            }
            var g = a.prototype = {};
            g.next = function () {
                var i = (this._last || 0) + 1;
                if (i > this.count) {
                    i = 1
                }
                h.removeClassName(this.element, this.prefix + this._last);
                h.addClassName(this.element, this.prefix + i);
                this._last = i
            };
            g.store = function () {
                d.setItem(this.key, this._last)
            };
            f.exports = a
        }, {
            "ac-base": false,
            "ac-storage": 5
        }],
    17: [
        function (b, c, a) {
            b("./globalNavDataClickShim.js");
            var h = b("ac-base").Element;
            var f = b("ac-analytics");

            function d() {
                var j = document.getElementById("promos");
                var i = h.selectAll("ul li a", j);
                i.forEach(function (k) {
                    k.setAttribute("data-analytics-click", "prefix:p")
                })
            }

            function g(p) {
                var n;
                var j;
                var k;
                var m;
                var o = "analytics-promo-id";
                var l = {
                    data: {
                        eVar44: window.innerHeight,
                        eVar43: "{PLATFORM}"
                    }
                };
                d();
                new f.observer.Page(l);
                new f.observer.Click();
                new f.observer.Link()
            }
            c.exports = g
}, {
            "./globalNavDataClickShim.js": 18,
            "ac-base": false
        }],
    18: [
        function (b, c, a) {
            var d = b("ac-base").Element;
            c.exports = (function () {
                var g = document.getElementById("globalheader");
                var h = d.selectAll("a", g);
                var f;
                h.forEach(function (j, i) {
                    if (i > 0) {
                        f = "prefix:t,prop3:" + j.innerText || j.textContent;
                        j.setAttribute("data-analytics-click", f.trim())
                    }
                })
            }())
        }, {
            "ac-base": false
        }],
    19: [
        function (f, g, d) {
            var i = f("ac-base").Element;
            var c = f("ac-promomanager");
            var a = f("./analytics/builder");
            var b = f("./ClassNameSwap");
            var h = (function () {
                return {
                    initialize: function () {
                        var m;
                        var o = document.getElementById("promos");
                        var n = (o ? o.getAttribute("data-promo-key") : null);
                        var k = (o ? o.getAttribute("data-promo-classes") : "").split(",");
                        var l, j;
                        if (n !== null && k[0] !== "") {
                            for (l = 0, j = k.length; l < j; l += 1) {
                                if (i.selectAll("." + k[l]).length > 1) {
                                    m = new c(n + "-" + k[l], k[l])
                                }
                            }
                        }
                        a(c.instances);
                        return this
                    }
                }
            }());
            g.exports = h.initialize()
        }, {
            "./ClassNameSwap": 16,
            "./analytics/builder": 17,
            "ac-base": false,
            "ac-promomanager": 1
        }]
}, {}, [19]);