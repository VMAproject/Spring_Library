(function (f) {
    var j = "keypad";

    function l() {
        this.BS = "\x08";
        this.DEL = "\x7F";
        this.EN = "\x0D";
        this._curInst = null;
        this._disabledFields = [];
        this._keypadShowing = false;
        this.regional = [];
        this.regional[""] = {
            buttonText: "...",
            buttonStatus: "Open the keypad",
            closeText: "Close",
            closeStatus: "Close the keypad",
            clearText: "Clear",
            clearStatus: "Erase all the text",
            backText: "Back",
            backStatus: "Erase the previous character",
            enterText: "Enter",
            enterStatus: "Carriage return",
            shiftText: "Shift",
            shiftStatus: "Toggle upper/lower case characters",
            alphabeticLayout: this.qwertyAlphabetic,
            fullLayout: this.qwertyLayout,
            isAlphabetic: this.isAlphabetic,
            isNumeric: this.isNumeric,
            isRTL: false
        };
        this._defaults = {
            showOn: "focus",
            buttonImage: "",
            buttonImageOnly: false,
            showAnim: "show",
            showOptions: {},
            duration: "normal",
            appendText: "",
            keypadClass: "",
            prompt: "",
            layout: ["123" + this.CLOSE, "456" + this.CLEAR, "789" + this.BACK, this.SPACE + "0"],
            separator: "",
            target: null,
            keypadOnly: true,
            randomiseAlphabetic: false,
            randomiseNumeric: false,
            randomiseOther: false,
            randomiseAll: false,
            beforeShow: null,
            onKeypress: null,
            onClose: null
        };
        f.extend(this._defaults, this.regional[""]);
        this.mainDiv = f('<div id="' + this._mainDivId + '" style="display: none;"></div>')
    }

    var e = "\x00";
    var a = "\x01";
    var i = "\x02";
    var k = "\x03";
    var b = "\x04";
    var h = "\x05";
    var c = "\x06";
    var g = "\x07";
    f.extend(l.prototype, {
        CLOSE: e,
        CLEAR: a,
        BACK: i,
        SHIFT: k,
        SPACE_BAR: b,
        SPACE: h,
        HALF_SPACE: c,
        ENTER: g,
        qwertyAlphabetic: ["qwertyuiop", "asdfghjkl", "zxcvbnm"],
        qwertyLayout: ["!@#$%^&*()_=" + c + h + e, c + "`~[]{}<>\\|/" + h + "789", "qwertyuiop'\"" + c + "456", c + "asdfghjkl;:" + h + "123", h + "zxcvbnm,.?" + h + c + "-0+", k + h + b + g + c + i + a],
        markerClassName: "hasKeypad",
        _mainDivId: "keypad-div",
        _inlineClass: "keypad-inline",
        _appendClass: "keypad-append",
        _triggerClass: "keypad-trigger",
        _disableClass: "keypad-disabled",
        _inlineEntryClass: "keypad-keyentry",
        _coverClass: "keypad-cover",
        setDefaults: function (m) {
            d(this._defaults, m || {});
            return this
        },
        _attachKeypad: function (p, m) {
            var o = (p.nodeName.toLowerCase() != "input" && p.nodeName.toLowerCase() != "textarea");
            var n = {
                _inline: o,
                _mainDiv: (o ? f('<div class="' + this._inlineClass + '"></div>') : f.keypad.mainDiv),
                ucase: false
            };
            n.settings = f.extend({}, m || {});
            this._setInput(p, n);
            this._connectKeypad(p, n);
            if (o) {
                f(p).append(n._mainDiv).bind("click.keypad", function () {
                    n._input.focus()
                });
                this._updateKeypad(n)
            }
        },
        _setInput: function (n, m) {
            m._input = f(!m._inline ? n : this._get(m, "target") || '<input type="text" class="' + this._inlineEntryClass + '" disabled="disabled"/>');
            if (m._inline) {
                n = f(n);
                n.find("input").remove();
                if (!this._get(m, "target")) {
                    n.append(m._input)
                }
            }
        },
        _connectKeypad: function (r, q) {
            var s = f(r);
            if (s.hasClass(this.markerClassName)) {
                return
            }
            var p = this._get(q, "appendText");
            var m = this._get(q, "isRTL");
            if (p) {
                s[m ? "before" : "after"]('<span class="' + this._appendClass + '">' + p + "</span>")
            }
            if (!q._inline) {
                var u = this._get(q, "showOn");
                if (u == "focus" || u == "both") {
                    s.focus(this._showKeypad).keydown(this._doKeyDown)
                }
                if (u == "button" || u == "both") {
                    var t = this._get(q, "buttonText");
                    var o = this._get(q, "buttonStatus");
                    var v = this._get(q, "buttonImage");
                    var n = f(this._get(q, "buttonImageOnly") ? f('<img src="' + v + '" alt="' + o + '" title="' + o + '"/>') : f('<button type="button" title="' + o + '"></button>').html(v == "" ? t : f('<img src="' + v + '" alt="' + o + '" title="' + o + '"/>')));
                    s[m ? "before" : "after"](n);
                    n.addClass(this._triggerClass).click(function () {
                        if (f.keypad._keypadShowing && f.keypad._lastField == r) {
                            f.keypad._hideKeypad()
                        } else {
                            f.keypad._showKeypad(r)
                        }
                        return false
                    })
                }
            }
            q.saveReadonly = s.attr("readonly");
            s.addClass(this.markerClassName).bind("setData.keypad", function (x, w, y) {
                q.settings[w] = y
            }).bind("getData.keypad", function (x, w) {
                return this._get(q, w)
            });
            if (this._get(q, "keypadOnly")) {
                s.attr("readonly", "readonly")
            }
            f.data(r, j, q)
        },
        _destroyKeypad: function (o) {
            var m = f(o);
            if (!m.hasClass(this.markerClassName)) {
                return
            }
            var n = f.data(o, j);
            if (this._curInst == n) {
                this._hideKeypad()
            }
            m.siblings("." + this._appendClass).remove().end().siblings("." + this._triggerClass).remove().end().prev("." + this._inlineEntryClass).remove();
            m.empty().unbind("focus", this._showKeypad).removeClass(this.markerClassName).attr("readonly", n.saveReadonly);
            f.removeData(n._input[0], j);
            f.removeData(o, j)
        },
        _enableKeypad: function (o) {
            var n = f(o);
            if (!n.hasClass(this.markerClassName)) {
                return
            }
            var p = o.nodeName.toLowerCase();
            if (p == "input" || p == "textarea") {
                o.disabled = false;
                n.siblings("button." + this._triggerClass).each(function () {
                    this.disabled = false
                }).end().siblings("img." + this._triggerClass).css({opacity: "1.0", cursor: ""})
            } else {
                if (p == "div" || p == "span") {
                    n.children("." + this._disableClass).remove();
                    var m = f.data(o, j);
                    m._mainDiv.find("button").attr("disabled", "")
                }
            }
            this._disabledFields = f.map(this._disabledFields, function (q) {
                return (q == o ? null : q)
            })
        },
        _disableKeypad: function (p) {
            var o = f(p);
            if (!o.hasClass(this.markerClassName)) {
                return
            }
            var s = p.nodeName.toLowerCase();
            if (s == "input" || s == "textarea") {
                p.disabled = true;
                o.siblings("button." + this._triggerClass).each(function () {
                    this.disabled = true
                }).end().siblings("img." + this._triggerClass).css({opacity: "0.5", cursor: "default"})
            } else {
                if (s == "div" || s == "span") {
                    var n = o.children("." + this._inlineClass);
                    var r = n.offset();
                    var q = {left: 0, top: 0};
                    n.parents().each(function () {
                        if (f(this).css("position") == "relative") {
                            q = f(this).offset();
                            return false
                        }
                    });
                    o.prepend('<div class="' + this._disableClass + '" style="width: ' + n.outerWidth() + "px; height: " + n.outerHeight() + "px; left: " + (r.left - q.left) + "px; top: " + (r.top - q.top) + 'px;"></div>');
                    var m = f.data(p, j);
                    m._mainDiv.find("button").attr("disabled", "disabled")
                }
            }
            this._disabledFields = f.map(this._disabledFields, function (t) {
                return (t == p ? null : t)
            });
            this._disabledFields[this._disabledFields.length] = p
        },
        _isDisabledKeypad: function (m) {
            return (m && f.inArray(m, this._disabledFields) > -1)
        },
        _changeKeypad: function (q, m, p) {
            var n = m || {};
            if (typeof m == "string") {
                n = {};
                n[m] = p
            }
            var o = f.data(q, j);
            if (o) {
                if (this._curInst == o) {
                    this._hideKeypad()
                }
                d(o.settings, n);
                this._setInput(f(q), o);
                this._updateKeypad(o)
            }
        },
        _showKeypad: function (r) {
            r = r.target || r;
            if (f.keypad._isDisabledKeypad(r) || f.keypad._lastField == r) {
                return
            }
            var o = f.data(r, j);
            f.keypad._hideKeypad(null, "");
            f.keypad._lastField = r;
            f.keypad._pos = f.keypad._findPos(r);
            f.keypad._pos[1] += r.offsetHeight;
            var q = false;
            f(r).parents().each(function () {
                q |= f(this).css("position") == "fixed";
                return !q
            });
            if (q && f.browser.opera) {
                f.keypad._pos[0] -= document.documentElement.scrollLeft;
                f.keypad._pos[1] -= document.documentElement.scrollTop
            }
            var s = {left: f.keypad._pos[0], top: f.keypad._pos[1]};
            f.keypad._pos = null;
            o._mainDiv.css({
                position: "absolute",
                display: "block",
                top: "-1000px",
                width: (f.browser.opera ? "1000px" : "auto")
            });
            f.keypad._updateKeypad(o);
            s = f.keypad._checkOffset(o, s, q);
            o._mainDiv.css({
                position: (q ? "fixed" : "absolute"),
                display: "none",
                left: s.left + "px",
                top: s.top + "px"
            });
            var m = f.keypad._get(o, "showAnim");
            var p = f.keypad._get(o, "duration");
            p = (p == "normal" && f.ui && f.ui.version >= "1.8" ? "_default" : p);
            var n = function () {
                f.keypad._keypadShowing = true;
                var t = f.keypad._getBorders(o._mainDiv);
                o._mainDiv.find("iframe." + f.keypad._coverClass).css({
                    left: -t[0],
                    top: -t[1],
                    width: o._mainDiv.outerWidth(),
                    height: o._mainDiv.outerHeight()
                })
            };
            if (f.effects && f.effects[m]) {
                o._mainDiv.show(m, f.keypad._get(o, "showOptions"), p, n)
            } else {
                o._mainDiv[m || "show"]((m ? p : ""), n)
            }
            if (!m) {
                n()
            }
            if (o._input[0].type != "hidden") {
                o._input[0].focus()
            }
            f.keypad._curInst = o
        },
        _updateKeypad: function (m) {
            var n = this._getBorders(m._mainDiv);
            m._mainDiv.empty().append(this._generateHTML(m)).find("iframe." + this._coverClass).css({
                left: -n[0],
                top: -n[1],
                width: m._mainDiv.outerWidth(),
                height: m._mainDiv.outerHeight()
            });
            m._mainDiv.removeClass().addClass(this._get(m, "keypadClass") + (this._get(m, "isRTL") ? " keypad-rtl" : "") + (m._inline ? this._inlineClass : "") + " ui-widget ui-widget-content ui-corner-all ui-shadow");
            var o = this._get(m, "beforeShow");
            if (o) {
                o.apply((m._input ? m._input[0] : null), [m._mainDiv, m])
            }
        },
        _getBorders: function (m) {
            var n = function (p) {
                var o = (f.browser.msie ? 1 : 0);
                return {thin: 1 + o, medium: 3 + o, thick: 5 + o}[p] || p
            };
            return [parseFloat(n(m.css("border-left-width"))), parseFloat(n(m.css("border-top-width")))]
        },
        _checkOffset: function (p, o, n) {
            var r = p._input ? this._findPos(p._input[0]) : null;
            var u = window.innerWidth || document.documentElement.clientWidth;
            var q = window.innerHeight || document.documentElement.clientHeight;
            var t = document.documentElement.scrollLeft || document.body.scrollLeft;
            var s = document.documentElement.scrollTop || document.body.scrollTop;
            if ((f.browser.msie && parseInt(f.browser.version, 10) < 7) || f.browser.opera) {
                var m = 0;
                p._mainDiv.find(":not(div,iframe)").each(function () {
                    m = Math.max(m, this.offsetLeft + f(this).outerWidth() + parseInt(f(this).css("margin-right"), 10))
                });
                p._mainDiv.css("width", m)
            }
            if (this._get(p, "isRTL") || (o.left + p._mainDiv.outerWidth() - t) > u) {
                o.left = Math.max((n ? 0 : t), r[0] + (p._input ? p._input.outerWidth() : 0) - (n ? t : 0) - p._mainDiv.outerWidth() - (n && f.browser.opera ? document.documentElement.scrollLeft : 0))
            } else {
                o.left -= (n ? t : 0)
            }
            if ((o.top + p._mainDiv.outerHeight() - s) > q) {
                o.top = Math.max((n ? 0 : s), r[1] - (n ? s : 0) - p._mainDiv.outerHeight() - (n && f.browser.opera ? document.documentElement.scrollTop : 0))
            } else {
                o.top -= (n ? s : 0)
            }
            return o
        },
        _findPos: function (n) {
            while (n && (n.type == "hidden" || n.nodeType != 1)) {
                n = n.nextSibling
            }
            var m = f(n).offset();
            return [m.left, m.top]
        },
        _hideKeypad: function (q, p) {
            var o = this._curInst;
            if (!o || (q && o != f.data(q, j))) {
                return
            }
            if (this._keypadShowing) {
                p = (p != null ? p : this._get(o, "duration"));
                p = (p == "normal" && f.ui && f.ui.version >= "1.8" ? "_default" : p);
                var n = this._get(o, "showAnim");
                if (f.effects && f.effects[n]) {
                    o._mainDiv.hide(n, this._get(o, "showOptions"), p)
                } else {
                    o._mainDiv[(n == "slideDown" ? "slideUp" : (n == "fadeIn" ? "fadeOut" : "hide"))](n ? p : "")
                }
            }
            var m = this._get(o, "onClose");
            if (m) {
                m.apply((o._input ? o._input[0] : null), [o._input.val(), o])
            }
            if (this._keypadShowing) {
                this._keypadShowing = false;
                this._lastField = null
            }
            if (o._inline) {
                o._input.val("")
            }
            this._curInst = null
        },
        _doKeyDown: function (m) {
            if (m.keyCode == 9) {
                f.keypad.mainDiv.stop(true, true);
                f.keypad._hideKeypad(null, "")
            }
        },
        _checkExternalClick: function (m) {
            if (!f.keypad._curInst) {
                return
            }
            var n = f(m.target);
            if (!n.parents().andSelf().is("#" + f.keypad._mainDivId) && !n.hasClass(f.keypad.markerClassName) && !n.parents().andSelf().hasClass(f.keypad._triggerClass) && f.keypad._keypadShowing) {
                f.keypad._hideKeypad(null, "")
            }
        },
        _shiftKeypad: function (m) {
            m.ucase = !m.ucase;
            this._updateKeypad(m);
            m._input.focus()
        },
        _clearValue: function (m) {
            this._setValue(m, "", 0);
            this._notifyKeypress(m, f.keypad.DEL)
        },
        _backValue: function (o) {
            var p = o._input[0];
            var n = o._input.val();
            var m = [n.length, n.length];
            if (p.setSelectionRange) {
                m = (o._input.attr("readonly") || o._input.attr("disabled") ? m : [p.selectionStart, p.selectionEnd])
            } else {
                if (p.createTextRange) {
                    m = (o._input.attr("readonly") || o._input.attr("disabled") ? m : this._getIERange(p))
                }
            }
            this._setValue(o, (n.length == 0 ? "" : n.substr(0, m[0] - 1) + n.substr(m[1])), m[0] - 1);
            this._notifyKeypress(o, f.keypad.BS)
        },
        _selectValue: function (n, m) {
            this.insertValue(n._input[0], m);
            this._setValue(n, n._input.val());
            this._notifyKeypress(n, m)
        },
        insertValue: function (n, o) {
            n = (n.jquery ? n : f(n));
            var q = n[0];
            var p = n.val();
            var m = [p.length, p.length];
            if (q.setSelectionRange) {
                m = (n.attr("readonly") || n.attr("disabled") ? m : [q.selectionStart, q.selectionEnd])
            } else {
                if (q.createTextRange) {
                    m = (n.attr("readonly") || n.attr("disabled") ? m : this._getIERange(q))
                }
            }
            n.val(p.substr(0, m[0]) + o + p.substr(m[1]));
            pos = m[0] + o.length;
            if (n.css("display") != "none") {
                n.focus()
            }
            if (q.setSelectionRange) {
                if (n.css("display") != "none") {
                    q.setSelectionRange(pos, pos)
                }
            } else {
                if (q.createTextRange) {
                    var m = q.createTextRange();
                    m.move("character", pos);
                    m.select()
                }
            }
        },
        _getIERange: function (p) {
            p.focus();
            var r = document.selection.createRange().duplicate();
            var m = this._getIETextRange(p);
            m.setEndPoint("EndToStart", r);
            var n = function (s) {
                var u = s.text;
                var t = u;
                var v = false;
                while (true) {
                    if (s.compareEndPoints("StartToEnd", s) == 0) {
                        break
                    } else {
                        s.moveEnd("character", -1);
                        if (s.text == u) {
                            t += "\r\n"
                        } else {
                            break
                        }
                    }
                }
                return t
            };
            var o = n(m);
            var q = n(r);
            return [o.length, o.length + q.length]
        },
        _getIETextRange: function (o) {
            var n = (o.nodeName.toLowerCase() == "input");
            var m = (n ? o.createTextRange() : document.body.createTextRange());
            if (!n) {
                m.moveToElementText(o)
            }
            return m
        },
        _setValue: function (o, n) {
            var m = o._input.attr("maxlength");
            if (m > -1) {
                n = n.substr(0, m)
            }
            o._input.val(n);
            if (!this._get(o, "onKeypress")) {
                o._input.trigger("change")
            }
        },
        _notifyKeypress: function (o, m) {
            var n = this._get(o, "onKeypress");
            if (n) {
                n.apply((o._input ? o._input[0] : null), [m, o._input.val(), o])
            }
        },
        _get: function (n, m) {
            return n.settings[m] !== undefined ? n.settings[m] : this._defaults[m]
        },
        _generateHTML: function (r) {
            var m = this._get(r, "isRTL");
            var n = this._get(r, "prompt");
            var q = this._get(r, "separator");
            var s = (!n ? "" : '<div class="keypad-prompt">' + n + "</div>");
            var t = this._randomiseLayout(r);
            for (var p = 0; p < t.length; p++) {
                s += '<div class="keypad-row">';
                var w = t[p].split(q);
                for (var o = 0; o < w.length; o++) {
                    if (r.ucase) {
                        w[o] = w[o].toUpperCase()
                    }
                    s += (w[o] == this.SPACE ? '<div class="keypad-space"></div>' : (w[o] == this.HALF_SPACE ? '<div class="keypad-half-space"></div>' : '<button type="button" class="keypad-key ui-state-default' + (w[o] == this.CLEAR ? " keypad-clear" : (w[o] == this.BACK ? " keypad-back" : (w[o] == this.CLOSE ? " keypad-close" : (w[o] == this.SHIFT ? " keypad-shift" : (w[o] == this.ENTER ? " keypad-enter" : (w[o] == this.SPACE_BAR ? " keypad-spacebar" : "")))))) + '" title="' + (w[o] == this.CLEAR ? this._get(r, "clearStatus") : (w[o] == this.BACK ? this._get(r, "backStatus") : (w[o] == this.ENTER ? this._get(r, "enterStatus") : (w[o] == this.CLOSE ? this._get(r, "closeStatus") : (w[o] == this.SHIFT ? this._get(r, "shiftStatus") : ""))))) + '">' + (w[o] == this.CLEAR ? this._get(r, "clearText") : (w[o] == this.BACK ? this._get(r, "backText") : (w[o] == this.CLOSE ? this._get(r, "closeText") : (w[o] == this.SHIFT ? this._get(r, "shiftText") : (w[o] == this.ENTER ? this._get(r, "enterText") : (w[o] == this.SPACE_BAR ? "&nbsp;" : (w[o] == " " ? "&nbsp;" : w[o]))))))) + "</button>"))
                }
                s += "</div>"
            }
            s += '<div style="clear: both;"></div>' + (!r._inline && f.browser.msie && parseInt(f.browser.version, 10) < 7 ? '<iframe src="javascript:false;" class="' + f.keypad._coverClass + '"></iframe>' : "");
            s = f(s);
            var u = r, v = s.find("button");
            PrimeFaces.skinButton(v);
            v.filter(".keypad-clear").click(function () {
                f.keypad._clearValue(u)
            }).end().filter(".keypad-back").click(function () {
                f.keypad._backValue(u)
            }).end().filter(".keypad-close").click(function () {
                f.keypad._curInst = (u._inline ? u : f.keypad._curInst);
                f.keypad._hideKeypad()
            }).end().filter(".keypad-shift").click(function () {
                f.keypad._shiftKeypad(u)
            }).end().filter(".keypad-enter").click(function () {
                f.keypad._selectValue(u, f.keypad.EN)
            }).end().not(".keypad-clear").not(".keypad-back").not(".keypad-close").not(".keypad-shift").not(".keypad-enter").click(function () {
                f.keypad._selectValue(u, f(this).text())
            });
            return s
        },
        _randomiseLayout: function (q) {
            var m = this._get(q, "randomiseNumeric");
            var y = this._get(q, "randomiseAlphabetic");
            var B = this._get(q, "randomiseOther");
            var p = this._get(q, "randomiseAll");
            var D = this._get(q, "layout");
            if (!m && !y && !B && !p) {
                return D
            }
            var C = this._get(q, "isNumeric");
            var u = this._get(q, "isAlphabetic");
            var r = this._get(q, "separator");
            var t = [];
            var s = [];
            var E = [];
            var G = [];
            for (var A = 0; A < D.length; A++) {
                G[A] = "";
                var v = D[A].split(r);
                for (var z = 0; z < v.length; z++) {
                    if (this._isControl(v[z])) {
                        continue
                    }
                    if (p) {
                        E.push(v[z])
                    } else {
                        if (C(v[z])) {
                            t.push(v[z])
                        } else {
                            if (u(v[z])) {
                                s.push(v[z])
                            } else {
                                E.push(v[z])
                            }
                        }
                    }
                }
            }
            if (m) {
                this._shuffle(t)
            }
            if (y) {
                this._shuffle(s)
            }
            if (B || p) {
                this._shuffle(E)
            }
            var x = 0;
            var F = 0;
            var w = 0;
            for (var A = 0; A < D.length; A++) {
                var v = D[A].split(r);
                for (var z = 0; z < v.length; z++) {
                    G[A] += (this._isControl(v[z]) ? v[z] : (p ? E[w++] : (C(v[z]) ? t[x++] : (u(v[z]) ? s[F++] : E[w++])))) + r
                }
            }
            return G
        },
        _isControl: function (m) {
            return m < " "
        },
        isAlphabetic: function (m) {
            return (m >= "A" && m <= "Z") || (m >= "a" && m <= "z")
        },
        isNumeric: function (m) {
            return (m >= "0" && m <= "9")
        },
        _shuffle: function (m) {
            for (var o = m.length - 1; o > 0; o--) {
                var n = Math.floor(Math.random() * m.length);
                var p = m[o];
                m[o] = m[n];
                m[n] = p
            }
        }
    });
    function d(o, n) {
        f.extend(o, n);
        for (var m in n) {
            if (n[m] == null || n[m] == undefined) {
                o[m] = n[m]
            }
        }
        return o
    }

    f.fn.keypad = function (n) {
        var m = Array.prototype.slice.call(arguments, 1);
        if (n == "isDisabled") {
            return f.keypad["_" + n + "Keypad"].apply(f.keypad, [this[0]].concat(m))
        }
        return this.each(function () {
            typeof n == "string" ? f.keypad["_" + n + "Keypad"].apply(f.keypad, [this].concat(m)) : f.keypad._attachKeypad(this, n)
        })
    };
    f.keypad = new l();
    f(function () {
        f(document.body).append(f.keypad.mainDiv).mousedown(f.keypad._checkExternalClick)
    })
})(jQuery);
PrimeFaces.widget.Keyboard = PrimeFaces.widget.BaseWidget.extend({
    init: function (a) {
        this._super(a);
        if (this.cfg.layoutTemplate) {
            this.cfg.layout = PrimeFaces.widget.KeyboardUtils.createLayoutFromTemplate(this.cfg.layoutTemplate)
        } else {
            this.cfg.layout = PrimeFaces.widget.KeyboardUtils.getPresetLayout(this.cfg.layoutName)
        }
        this.jq.keypad(this.cfg);
        if (this.cfg.behaviors) {
            PrimeFaces.attachBehaviors(this.jq, this.cfg.behaviors)
        }
        PrimeFaces.skinInput(this.jq);
        var b = "resize." + this.id;
        $(window).unbind(b).bind(b, function () {
            $.keypad._hideKeypad()
        })
    }
});
PrimeFaces.widget.KeyboardUtils = {
    layouts: {
        qwertyBasic: [$.keypad.qwertyAlphabetic[0] + $.keypad.CLOSE, $.keypad.HALF_SPACE + $.keypad.qwertyAlphabetic[1] + $.keypad.HALF_SPACE + $.keypad.CLEAR, $.keypad.SPACE + $.keypad.qwertyAlphabetic[2] + $.keypad.SHIFT + $.keypad.BACK],
        qwerty: $.keypad.qwertyLayout,
        alphabetic: ["abcdefghij" + $.keypad.CLOSE, "klmnopqrst" + $.keypad.CLEAR, "uvwxyz" + $.keypad.SPACE + $.keypad.SPACE + $.keypad.SHIFT + $.keypad.BACK]
    },
    controls: {
        close: $.keypad.CLOSE,
        clear: $.keypad.CLEAR,
        back: $.keypad.BACK,
        shift: $.keypad.SHIFT,
        spacebar: $.keypad.SPACE_BAR,
        space: $.keypad.SPACE,
        halfspace: $.keypad.HALF_SPACE
    },
    getPresetLayout: function (a) {
        return this.layouts[a]
    },
    getPresetControl: function (a) {
        return this.controls[a]
    },
    isDefinedControl: function (a) {
        return this.controls[a] != undefined
    },
    createLayoutFromTemplate: function (e) {
        var a = e.split(","), e = new Array(a.length);
        for (var c = 0; c < a.length; c++) {
            e[c] = "";
            var d = a[c].split("-");
            for (var b = 0; b < d.length; b++) {
                if (this.isDefinedControl(d[b])) {
                    e[c] = e[c] + this.getPresetControl(d[b])
                } else {
                    e[c] = e[c] + d[b]
                }
            }
        }
        return e
    }
};