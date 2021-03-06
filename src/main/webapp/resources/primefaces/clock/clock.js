PrimeFaces.widget.SimpleDateFormat = Class.extend({
    init: function (a) {
        this.cfg = a;
        this.cfg.regex = /('[^']*')|(G+|y+|M+|w+|W+|D+|d+|F+|E+|a+|H+|k+|K+|h+|m+|s+|S+|Z+)|([a-zA-Z]+)|([^a-zA-Z']+)/;
        this.cfg.TEXT2 = 0;
        this.cfg.TEXT3 = 1;
        this.cfg.NUMBER = 2;
        this.cfg.YEAR = 3;
        this.cfg.MONTH = 4;
        this.cfg.TIMEZONE = 6;
        this.cfg.types = {
            G: this.cfg.TEXT2,
            y: this.cfg.YEAR,
            M: this.cfg.MONTH,
            w: this.cfg.NUMBER,
            W: this.cfg.NUMBER,
            D: this.cfg.NUMBER,
            d: this.cfg.NUMBER,
            F: this.cfg.NUMBER,
            E: this.cfg.TEXT3,
            a: this.cfg.TEXT2,
            H: this.cfg.NUMBER,
            k: this.cfg.NUMBER,
            K: this.cfg.NUMBER,
            h: this.cfg.NUMBER,
            m: this.cfg.NUMBER,
            s: this.cfg.NUMBER,
            S: this.cfg.NUMBER,
            Z: this.cfg.TIMEZONE
        };
        this.cfg.ONE_DAY = 24 * 60 * 60 * 1000;
        this.cfg.ONE_WEEK = 7 * this.cfg.ONE_DAY;
        this.cfg.DEFAULT_MINIMAL_DAYS_IN_FIRST_WEEK = 1;
        if (this.cfg.locale && PrimeFaces.locales[this.cfg.locale]) {
            this.cfg.monthNames = PrimeFaces.locales[this.cfg.locale].monthNames;
            this.cfg.dayNames = PrimeFaces.locales[this.cfg.locale].dayNames
        } else {
            this.cfg.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            this.cfg.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        }
    }, newDateAtMidnight: function (b, c, a) {
        var e = new Date(b, c, a, 0, 0, 0);
        e.setMilliseconds(0);
        return e
    }, getDifference: function (b, a) {
        return b.getTime() - a.getTime()
    }, isBefore: function (b, a) {
        return b.getTime() < a.getTime()
    }, getUTCTime: function (a) {
        if (a != undefined) {
            return Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds(), a.getMilliseconds())
        }
    }, getTimeSince: function (b, a) {
        return this.getUTCTime(b) - this.getUTCTime(a)
    }, getPreviousSunday: function (a) {
        var c = new Date(a.getFullYear(), a.getMonth(), a.getDate(), 12, 0, 0);
        var b = new Date(c.getTime() - a.getDay() * this.cfg.ONE_DAY);
        return this.newDateAtMidnight(b.getFullYear(), b.getMonth(), b.getDate())
    }, getWeekInYear: function (d, g) {
        var e = this.getPreviousSunday(d);
        var b = this.newDateAtMidnight(d.getFullYear(), 0, 1);
        var f = this.isBefore(e, b) ? 0 : 1 + Math.floor(this.getTimeSince(e, b) / this.cfg.ONE_WEEK);
        var a = 7 - b.getDay();
        var c = f;
        if (a < g) {
            c--
        }
        return c
    }, getWeekInMonth: function (b, g) {
        var c = this.getPreviousSunday(b);
        var f = this.newDateAtMidnight(b.getFullYear(), b.getMonth(), 1);
        var e = this.isBefore(c, f) ? 0 : 1 + Math.floor((this.getTimeSince(c, f)) / this.cfg.ONE_WEEK);
        var a = 7 - f.getDay();
        var d = e;
        if (a >= g) {
            d++
        }
        return d
    }, getDayInYear: function (b) {
        var a = this.newDateAtMidnight(b.getFullYear(), 0, 1);
        return 1 + Math.floor(this.getTimeSince(b, a) / this.cfg.ONE_DAY)
    }, getMinimalDaysInFirstWeek: function (a) {
        return this.cfg.minimalDaysInFirstWeek ? this.cfg.DEFAULT_MINIMAL_DAYS_IN_FIRST_WEEK : this.cfg.minimalDaysInFirstWeek
    }, format: function (t) {
        var a = "";
        var k;
        var e = function (w, v) {
            while (w.length < v) {
                w = "0" + w
            }
            return w
        };
        var c = function (x, w, v) {
            return (w >= 4) ? x : x.substr(0, Math.max(v, w))
        };
        var i = function (x, w) {
            var v = "" + x;
            return e(v, w)
        };
        var h = this.cfg.pattern;
        while ((k = this.cfg.regex.exec(h))) {
            var o = k[0];
            var j = k[1];
            var l = k[2];
            var g = k[3];
            var f = k[4];
            if (j) {
                if (j == "''") {
                    a += "'"
                } else {
                    a += j.substring(1, j.length - 1)
                }
            } else {
                if (g) {
                } else {
                    if (f) {
                        a += f
                    } else {
                        if (l) {
                            var b = l.charAt(0);
                            var u = l.length;
                            var m = "";
                            switch (b) {
                                case"G":
                                    m = "AD";
                                    break;
                                case"y":
                                    m = t.getFullYear();
                                    break;
                                case"M":
                                    m = t.getMonth();
                                    break;
                                case"w":
                                    m = this.getWeekInYear(t, this.getMinimalDaysInFirstWeek());
                                    break;
                                case"W":
                                    m = this.getWeekInMonth(t, this.getMinimalDaysInFirstWeek());
                                    break;
                                case"D":
                                    m = this.getDayInYear(t);
                                    break;
                                case"d":
                                    m = t.getDate();
                                    break;
                                case"F":
                                    m = 1 + Math.floor((t.getDate() - 1) / 7);
                                    break;
                                case"E":
                                    m = this.cfg.dayNames[t.getDay()];
                                    break;
                                case"a":
                                    m = (t.getHours() >= 12) ? "PM" : "AM";
                                    break;
                                case"H":
                                    m = t.getHours();
                                    break;
                                case"k":
                                    m = t.getHours() || 24;
                                    break;
                                case"K":
                                    m = t.getHours() % 12;
                                    break;
                                case"h":
                                    m = (t.getHours() % 12) || 12;
                                    break;
                                case"m":
                                    m = t.getMinutes();
                                    break;
                                case"s":
                                    m = t.getSeconds();
                                    break;
                                case"S":
                                    m = t.getMilliseconds();
                                    break;
                                case"Z":
                                    m = t.getTimezoneOffset();
                                    break
                            }
                            switch (this.cfg.types[b]) {
                                case this.cfg.TEXT2:
                                    a += c(m, u, 2);
                                    break;
                                case this.cfg.TEXT3:
                                    a += c(m, u, 3);
                                    break;
                                case this.cfg.NUMBER:
                                    a += i(m, u);
                                    break;
                                case this.cfg.YEAR:
                                    if (u <= 3) {
                                        var d = "" + m;
                                        a += d.substr(2, 2)
                                    } else {
                                        a += i(m, u)
                                    }
                                    break;
                                case this.cfg.MONTH:
                                    if (u >= 3) {
                                        a += c(this.cfg.monthNames[m], u, u)
                                    } else {
                                        a += i(m + 1, u)
                                    }
                                    break;
                                case this.cfg.TIMEZONE:
                                    var s = (m > 0);
                                    var p = s ? "-" : "+";
                                    var r = Math.abs(m);
                                    var q = "" + Math.floor(r / 60);
                                    q = e(q, 2);
                                    var n = "" + (r % 60);
                                    n = e(n, 2);
                                    a += p + q + n;
                                    break
                            }
                        }
                    }
                }
            }
            h = h.substr(k.index + k[0].length)
        }
        return a
    }
});
PrimeFaces.widget.Clock = PrimeFaces.widget.BaseWidget.extend({
    init: function (a) {
        this._super(a);
        this.cfg.pattern = this.cfg.pattern || "MM/dd/yyyy HH:mm:ss";
        this.cfg.dateFormat = new PrimeFaces.widget.SimpleDateFormat({
            pattern: this.cfg.pattern,
            locale: this.cfg.locale
        });
        this.current = this.isClient() ? new Date() : new Date(this.cfg.value);
        this.start();
        var b = this;
        if (!this.isClient() && this.cfg.autoSync) {
            setInterval(function () {
                b.sync()
            }, this.cfg.syncInterval)
        }
    }, isClient: function () {
        return this.cfg.mode === "client"
    }, start: function () {
        var a = this;
        this.interval = setInterval(function () {
            a.updateOutput()
        }, 1000)
    }, stop: function () {
        clearTimeout(this.interval)
    }, updateOutput: function () {
        this.current.setSeconds(this.current.getSeconds() + 1);
        this.jq.text(this.cfg.dateFormat.format(this.current))
    }, sync: function () {
        this.stop();
        var b = this, a = {
            source: this.id,
            process: this.id,
            async: true,
            global: false,
            params: [{name: this.id + "_sync", value: true}],
            oncomplete: function (e, c, d) {
                b.current = new Date(d.datetime);
                b.start()
            }
        };
        PrimeFaces.ajax.AjaxRequest(a)
    }
});