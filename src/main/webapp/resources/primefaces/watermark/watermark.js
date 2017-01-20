(function (f, j, d) {
    var m = "watermark", h = "watermarkClass", c = "watermarkFocus", i = "watermarkSubmit", e = "watermarkMaxLength", g = "watermarkPassword", q = "watermarkText", l = /\r/g, o = /^(button|checkbox|hidden|image|radio|range|reset|submit)$/i, b = "input:data(" + m + "),textarea:data(" + m + ")", k = ":watermarkable", p = ["Page_ClientValidate"], n = false, a = ("placeholder" in document.createElement("input"));
    f.watermark = f.watermark || {
            version: "3.1.4",
            runOnce: true,
            options: {className: "watermark", useNative: true, hideBeforeUnload: true},
            hide: function (r) {
                f(r).filter(b).each(function () {
                    f.watermark._hide(f(this))
                })
            },
            _hide: function (x, z) {
                var t = x[0], r = (t.value || "").replace(l, ""), v = x.data(q) || "", u = x.data(e) || 0, w = x.data(h);
                if ((v.length) && (r == v)) {
                    t.value = "";
                    if (x.data(g)) {
                        if ((x.attr("type") || "") === "text") {
                            var s = x.data(g) || [], y = x.parent() || [];
                            if ((s.length) && (y.length)) {
                                y[0].removeChild(x[0]);
                                y[0].appendChild(s[0]);
                                x = s
                            }
                        }
                    }
                    if (u) {
                        x.attr("maxLength", u);
                        x.removeData(e)
                    }
                    if (z) {
                        x.attr("autocomplete", "off");
                        j.setTimeout(function () {
                            x.select()
                        }, 1)
                    }
                }
                w && x.removeClass(w)
            },
            show: function (r) {
                f(r).filter(b).each(function () {
                    f.watermark._show(f(this))
                })
            },
            _show: function (x) {
                var t = x[0], s = (t.value || "").replace(l, ""), y = x.data(q) || "", w = x.attr("type") || "", v = x.data(h);
                if (((s.length == 0) || (s == y)) && (!x.data(c))) {
                    n = true;
                    if (x.data(g)) {
                        if (w === "password") {
                            var r = x.data(g) || [], z = x.parent() || [];
                            if ((r.length) && (z.length)) {
                                z[0].removeChild(x[0]);
                                z[0].appendChild(r[0]);
                                x = r;
                                x.attr("maxLength", y.length);
                                t = x[0]
                            }
                        }
                    }
                    if ((w === "text") || (w === "search")) {
                        var u = x.attr("maxLength") || 0;
                        if ((u > 0) && (y.length > u)) {
                            x.data(e, u);
                            x.attr("maxLength", y.length)
                        }
                    }
                    v && x.addClass(v);
                    t.value = y
                } else {
                    f.watermark._hide(x)
                }
            },
            hideAll: function () {
                if (n) {
                    f.watermark.hide(k);
                    n = false
                }
            },
            showAll: function () {
                f.watermark.show(k)
            }
        };
    f.fn.watermark = f.fn.watermark || function (u, r) {
            if (!this.length) {
                return this
            }
            var t = false, s = (typeof(u) === "string");
            if (s) {
                u = u.replace(l, "")
            }
            if (typeof(r) === "object") {
                t = (typeof(r.className) === "string");
                r = f.extend({}, f.watermark.options, r)
            } else {
                if (typeof(r) === "string") {
                    t = true;
                    r = f.extend({}, f.watermark.options, {className: r})
                } else {
                    r = f.watermark.options
                }
            }
            if (typeof(r.useNative) !== "function") {
                r.useNative = r.useNative ? function () {
                        return true
                    } : function () {
                        return false
                    }
            }
            return this.each(function () {
                var z = f(this);
                if (!z.is(k)) {
                    return
                }
                if (z.data(m)) {
                    if (s || t) {
                        f.watermark._hide(z);
                        if (s) {
                            z.data(q, u)
                        }
                        if (t) {
                            z.data(h, r.className)
                        }
                    }
                } else {
                    if ((a) && (r.useNative.call(this, z)) && ((z.attr("tagName") || "") !== "TEXTAREA")) {
                        if (s) {
                            z.attr("placeholder", u)
                        }
                        return
                    }
                    z.data(q, s ? u : "");
                    z.data(h, r.className);
                    z.data(m, 1);
                    if ((z.attr("type") || "") === "password") {
                        var v = z.wrap("<span>").parent(), y = f(v.html().replace(/type=["']?password["']?/i, 'type="text"'));
                        y.data(q, z.data(q));
                        y.data(h, z.data(h));
                        y.data(m, 1);
                        y.attr("maxLength", u.length);
                        y.focus(function () {
                            f.watermark._hide(y, true)
                        }).bind("dragenter", function () {
                            f.watermark._hide(y)
                        }).bind("dragend", function () {
                            j.setTimeout(function () {
                                y.blur()
                            }, 1)
                        });
                        z.blur(function () {
                            f.watermark._show(z)
                        }).bind("dragleave", function () {
                            f.watermark._show(z)
                        });
                        y.data(g, z);
                        z.data(g, y)
                    } else {
                        z.focus(function () {
                            z.data(c, 1);
                            f.watermark._hide(z, true)
                        }).blur(function () {
                            z.data(c, 0);
                            f.watermark._show(z)
                        }).bind("dragenter", function () {
                            f.watermark._hide(z)
                        }).bind("dragleave", function () {
                            f.watermark._show(z)
                        }).bind("dragend", function () {
                            j.setTimeout(function () {
                                f.watermark._show(z)
                            }, 1)
                        }).bind("drop", function (A) {
                            var C = z[0], B = A.originalEvent.dataTransfer.getData("Text");
                            if ((C.value || "").replace(l, "").replace(B, "") === z.data(q)) {
                                C.value = B
                            }
                            z.focus()
                        })
                    }
                    if (this.form) {
                        var x = this.form, w = f(x);
                        if (!w.data(i)) {
                            w.submit(f.watermark.hideAll);
                            if (x.submit) {
                                w.data(i, x.submit);
                                x.submit = (function (B, A) {
                                    return function () {
                                        var C = A.data(i);
                                        f.watermark.hideAll();
                                        if (C.apply) {
                                            C.apply(B, Array.prototype.slice.call(arguments))
                                        } else {
                                            C()
                                        }
                                    }
                                })(x, w)
                            } else {
                                w.data(i, 1);
                                x.submit = (function (A) {
                                    return function () {
                                        f.watermark.hideAll();
                                        delete A.submit;
                                        A.submit()
                                    }
                                })(x)
                            }
                        }
                    }
                }
                f.watermark._show(z)
            })
        };
    if (f.watermark.runOnce) {
        f.watermark.runOnce = false;
        f.extend(f.expr[":"], {
            data: f.expr.createPseudo ? f.expr.createPseudo(function (r) {
                    return function (s) {
                        return !!f.data(s, r)
                    }
                }) : function (t, s, r) {
                    return !!f.data(t, r[3])
                }, watermarkable: function (t) {
                var s, r = t.nodeName;
                if (r === "TEXTAREA") {
                    return true
                }
                if (r !== "INPUT") {
                    return false
                }
                s = t.getAttribute("type");
                return ((!s) || (!o.test(s)))
            }
        });
        (function (r) {
            f.fn.val = function () {
                var t = Array.prototype.slice.call(arguments);
                if (!this.length) {
                    return t.length ? this : d
                }
                if (!t.length) {
                    if (this.data(m)) {
                        var s = (this[0].value || "").replace(l, "");
                        return (s === (this.data(q) || "")) ? "" : s
                    } else {
                        return r.apply(this)
                    }
                } else {
                    r.apply(this, t);
                    f.watermark.show(this);
                    return this
                }
            }
        })(f.fn.val);
        if (p.length) {
            f(function () {
                var s, r, t;
                for (s = p.length - 1; s >= 0; s--) {
                    r = p[s];
                    t = j[r];
                    if (typeof(t) === "function") {
                        j[r] = (function (u) {
                            return function () {
                                f.watermark.hideAll();
                                return u.apply(null, Array.prototype.slice.call(arguments))
                            }
                        })(t)
                    }
                }
            })
        }
        f(j).bind("beforeunload", function () {
            if (f.watermark.options.hideBeforeUnload) {
                f.watermark.hideAll()
            }
        })
    }
})(jQuery, window);
$.watermark.options.className = "ui-watermark";
PrimeFaces.widget.Watermark = PrimeFaces.widget.BaseWidget.extend({
    init: function (a) {
        this.cfg = a;
        this.id = this.cfg.id;
        this.jqId = PrimeFaces.escapeClientId(this.id);
        this.jqTargetId = PrimeFaces.escapeClientId(this.cfg.target);
        this.target = $(this.jqTargetId);
        if (this.target.is(":not(:input)")) {
            this.target = this.target.find(":input")
        }
        this.target.watermark(this.cfg.value);
        $(this.jqId + "_s").remove()
    }
});