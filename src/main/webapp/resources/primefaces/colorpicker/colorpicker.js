(function (b) {
    var a = function () {
        var S = {}, c, N = 65, t, P = '<div class="ui-colorpicker-container"><div class="ui-colorpicker_color"><div><div></div></div></div><div class="ui-colorpicker_hue"><div></div></div><div class="ui-colorpicker_new_color"></div><div class="ui-colorpicker_hex"><input type="text" maxlength="6" size="6" /></div><div class="ui-colorpicker_rgb_r ui-colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="ui-colorpicker_rgb_g ui-colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="ui-colorpicker_rgb_b ui-colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="ui-colorpicker_hsb_h ui-colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="ui-colorpicker_hsb_s ui-colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="ui-colorpicker_hsb_b ui-colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div></div>', B = {
            eventName: "click",
            onShow: function () {
            },
            onBeforeShow: function () {
            },
            onHide: function () {
            },
            onChange: function () {
            },
            onSubmit: function () {
            },
            color: "ff0000",
            livePreview: true,
            flat: false
        }, J = function (T, V) {
            var U = j(T);
            b(V).data("colorpicker").fields.eq(1).val(U.r).end().eq(2).val(U.g).end().eq(3).val(U.b).end()
        }, u = function (T, U) {
            b(U).data("colorpicker").fields.eq(4).val(T.h).end().eq(5).val(T.s).end().eq(6).val(T.b).end()
        }, g = function (T, U) {
            b(U).data("colorpicker").fields.eq(0).val(R(T)).end()
        }, l = function (T, U) {
            b(U).data("colorpicker").selector.css("backgroundColor", "#" + R({h: T.h, s: 100, b: 100}));
            b(U).data("colorpicker").selectorIndic.css({
                left: parseInt(150 * T.s / 100, 10),
                top: parseInt(150 * (100 - T.b) / 100, 10)
            })
        }, G = function (T, U) {
            b(U).data("colorpicker").hue.css("top", parseInt(150 - 150 * T.h / 360, 10))
        }, h = function (T, U) {
            b(U).data("colorpicker").currentColor.css("backgroundColor", "#" + R(T))
        }, E = function (T, U) {
            b(U).data("colorpicker").newColor.css("backgroundColor", "#" + R(T))
        }, n = function (T) {
            var V = T.charCode || T.keyCode || -1;
            if ((V > N && V <= 90) || V == 32) {
                return false
            }
            var U = b(this).parent().parent();
            if (U.data("colorpicker").livePreview === true) {
                e.apply(this)
            }
        }, e = function (U) {
            var V = b(this).parent().parent(), T;
            if (this.parentNode.className.indexOf("_hex") > 0) {
                V.data("colorpicker").color = T = m(y(this.value))
            } else {
                if (this.parentNode.className.indexOf("_hsb") > 0) {
                    V.data("colorpicker").color = T = f({
                        h: parseInt(V.data("colorpicker").fields.eq(4).val(), 10),
                        s: parseInt(V.data("colorpicker").fields.eq(5).val(), 10),
                        b: parseInt(V.data("colorpicker").fields.eq(6).val(), 10)
                    })
                } else {
                    V.data("colorpicker").color = T = i(M({
                        r: parseInt(V.data("colorpicker").fields.eq(1).val(), 10),
                        g: parseInt(V.data("colorpicker").fields.eq(2).val(), 10),
                        b: parseInt(V.data("colorpicker").fields.eq(3).val(), 10)
                    }))
                }
            }
            if (U) {
                J(T, V.get(0));
                g(T, V.get(0));
                u(T, V.get(0))
            }
            l(T, V.get(0));
            G(T, V.get(0));
            E(T, V.get(0));
            V.data("colorpicker").onChange.apply(V, [T, R(T), j(T)])
        }, o = function (T) {
            var U = b(this).parent().parent();
            U.data("colorpicker").fields.parent().removeClass("colorpicker_focus")
        }, K = function () {
            N = this.parentNode.className.indexOf("_hex") > 0 ? 70 : 65;
            b(this).parent().parent().data("colorpicker").fields.parent().removeClass("colorpicker_focus");
            b(this).parent().addClass("colorpicker_focus")
        }, I = function (T) {
            var V = b(this).parent().find("input").focus();
            var U = {
                el: b(this).parent().addClass("colorpicker_slider"),
                max: this.parentNode.className.indexOf("_hsb_h") > 0 ? 360 : (this.parentNode.className.indexOf("_hsb") > 0 ? 100 : 255),
                y: T.pageY,
                field: V,
                val: parseInt(V.val(), 10),
                preview: b(this).parent().parent().data("colorpicker").livePreview
            };
            b(document).bind("mouseup", U, s);
            b(document).bind("mousemove", U, L)
        }, L = function (T) {
            T.data.field.val(Math.max(0, Math.min(T.data.max, parseInt(T.data.val + T.pageY - T.data.y, 10))));
            if (T.data.preview) {
                e.apply(T.data.field.get(0), [true])
            }
            return false
        }, s = function (T) {
            e.apply(T.data.field.get(0), [true]);
            T.data.el.removeClass("ui-colorpicker_slider").find("input").focus();
            b(document).unbind("mouseup", s);
            b(document).unbind("mousemove", L);
            return false
        }, w = function (T) {
            var U = {cal: b(this).parent(), y: b(this).offset().top};
            U.preview = U.cal.data("colorpicker").livePreview;
            b(document).bind("mouseup", U, r);
            b(document).bind("mousemove", U, k);
            T.data = U;
            k(T)
        }, k = function (T) {
            e.apply(T.data.cal.data("colorpicker").fields.eq(4).val(parseInt(360 * (150 - Math.max(0, Math.min(150, (T.pageY - T.data.y)))) / 150, 10)).get(0), [T.data.preview]);
            return false
        }, r = function (T) {
            J(T.data.cal.data("colorpicker").color, T.data.cal.get(0));
            g(T.data.cal.data("colorpicker").color, T.data.cal.get(0));
            b(document).unbind("mouseup", r);
            b(document).unbind("mousemove", k);
            return false
        }, x = function (T) {
            var U = {cal: b(this).parent(), pos: b(this).offset()};
            U.preview = U.cal.data("colorpicker").livePreview;
            b(document).bind("mouseup", U, A);
            b(document).bind("mousemove", U, q);
            T.data = U;
            q(T)
        }, q = function (T) {
            e.apply(T.data.cal.data("colorpicker").fields.eq(6).val(parseInt(100 * (150 - Math.max(0, Math.min(150, (T.pageY - T.data.pos.top)))) / 150, 10)).end().eq(5).val(parseInt(100 * (Math.max(0, Math.min(150, (T.pageX - T.data.pos.left)))) / 150, 10)).get(0), [T.data.preview]);
            return false
        }, A = function (T) {
            J(T.data.cal.data("colorpicker").color, T.data.cal.get(0));
            g(T.data.cal.data("colorpicker").color, T.data.cal.get(0));
            b(document).unbind("mouseup", A);
            b(document).unbind("mousemove", q);
            return false
        }, v = function (T) {
            b(this).addClass("ui-colorpicker_focus")
        }, Q = function (T) {
            b(this).removeClass("ui-colorpicker_focus")
        }, p = function (U) {
            var V = b(this).parent();
            var T = V.data("colorpicker").color;
            V.data("colorpicker").origColor = T;
            h(T, V.get(0));
            V.data("colorpicker").onSubmit(T, R(T), j(T), V.data("colorpicker").el)
        }, D = function (T) {
            var X = b("#" + b(this).data("colorpickerId"));
            X.data("colorpicker").onBeforeShow.apply(this, [X.get(0)]);
            var Y = b(this).offset();
            var W = z();
            var V = Y.top + this.offsetHeight;
            var U = Y.left;
            if (V + 176 > W.t + W.h) {
                V -= this.offsetHeight + 176
            }
            if (U + 356 > W.l + W.w) {
                U -= 356
            }
            X.css({left: U + "px", top: V + "px"});
            if (X.data("colorpicker").onShow.apply(this, [X.get(0)]) != false) {
                X.show()
            }
            b(document).bind("mousedown", {cal: X}, O);
            return false
        }, O = function (T) {
            if (!H(T.data.cal.get(0), T.target, T.data.cal.get(0))) {
                if (T.data.cal.data("colorpicker").onHide.apply(this, [T.data.cal.get(0)]) != false) {
                    T.data.cal.hide()
                }
                b(document).unbind("mousedown", O)
            }
        }, H = function (V, U, T) {
            if (V == U) {
                return true
            }
            if (V.contains) {
                return V.contains(U)
            }
            if (V.compareDocumentPosition) {
                return !!(V.compareDocumentPosition(U) & 16)
            }
            var W = U.parentNode;
            while (W && W != T) {
                if (W == V) {
                    return true
                }
                W = W.parentNode
            }
            return false
        }, z = function () {
            var T = document.compatMode == "CSS1Compat";
            return {
                l: window.pageXOffset || (T ? document.documentElement.scrollLeft : document.body.scrollLeft),
                t: window.pageYOffset || (T ? document.documentElement.scrollTop : document.body.scrollTop),
                w: window.innerWidth || (T ? document.documentElement.clientWidth : document.body.clientWidth),
                h: window.innerHeight || (T ? document.documentElement.clientHeight : document.body.clientHeight)
            }
        }, f = function (T) {
            return {
                h: Math.min(360, Math.max(0, T.h)),
                s: Math.min(100, Math.max(0, T.s)),
                b: Math.min(100, Math.max(0, T.b))
            }
        }, M = function (T) {
            return {
                r: Math.min(255, Math.max(0, T.r)),
                g: Math.min(255, Math.max(0, T.g)),
                b: Math.min(255, Math.max(0, T.b))
            }
        }, y = function (V) {
            var T = 6 - V.length;
            if (T > 0) {
                var W = [];
                for (var U = 0; U < T; U++) {
                    W.push("0")
                }
                W.push(V);
                V = W.join("")
            }
            return V
        }, d = function (T) {
            var T = parseInt(((T.indexOf("#") > -1) ? T.substring(1) : T), 16);
            return {r: T >> 16, g: (T & 65280) >> 8, b: (T & 255)}
        }, m = function (T) {
            return i(d(T))
        }, i = function (V) {
            var U = {h: 0, s: 0, b: 0};
            var W = Math.min(V.r, V.g, V.b);
            var T = Math.max(V.r, V.g, V.b);
            var X = T - W;
            U.b = T;
            if (T != 0) {
            }
            U.s = T != 0 ? 255 * X / T : 0;
            if (U.s != 0) {
                if (V.r == T) {
                    U.h = (V.g - V.b) / X
                } else {
                    if (V.g == T) {
                        U.h = 2 + (V.b - V.r) / X
                    } else {
                        U.h = 4 + (V.r - V.g) / X
                    }
                }
            } else {
                U.h = -1
            }
            U.h *= 60;
            if (U.h < 0) {
                U.h += 360
            }
            U.s *= 100 / 255;
            U.b *= 100 / 255;
            return U
        }, j = function (T) {
            var V = {};
            var Z = Math.round(T.h);
            var Y = Math.round(T.s * 255 / 100);
            var U = Math.round(T.b * 255 / 100);
            if (Y == 0) {
                V.r = V.g = V.b = U
            } else {
                var aa = U;
                var X = (255 - Y) * U / 255;
                var W = (aa - X) * (Z % 60) / 60;
                if (Z == 360) {
                    Z = 0
                }
                if (Z < 60) {
                    V.r = aa;
                    V.b = X;
                    V.g = X + W
                } else {
                    if (Z < 120) {
                        V.g = aa;
                        V.b = X;
                        V.r = aa - W
                    } else {
                        if (Z < 180) {
                            V.g = aa;
                            V.r = X;
                            V.b = X + W
                        } else {
                            if (Z < 240) {
                                V.b = aa;
                                V.r = X;
                                V.g = aa - W
                            } else {
                                if (Z < 300) {
                                    V.b = aa;
                                    V.g = X;
                                    V.r = X + W
                                } else {
                                    if (Z < 360) {
                                        V.r = aa;
                                        V.g = X;
                                        V.b = aa - W
                                    } else {
                                        V.r = 0;
                                        V.g = 0;
                                        V.b = 0
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return {r: Math.round(V.r), g: Math.round(V.g), b: Math.round(V.b)}
        }, C = function (T) {
            var U = [T.r.toString(16), T.g.toString(16), T.b.toString(16)];
            b.each(U, function (V, W) {
                if (W.length == 1) {
                    U[V] = "0" + W
                }
            });
            return U.join("")
        }, R = function (T) {
            return C(j(T))
        }, F = function () {
            var U = b(this).parent();
            var T = U.data("colorpicker").origColor;
            U.data("colorpicker").color = T;
            J(T, U.get(0));
            g(T, U.get(0));
            u(T, U.get(0));
            l(T, U.get(0));
            G(T, U.get(0));
            E(T, U.get(0))
        };
        return {
            init: function (T) {
                T = b.extend({}, B, T || {});
                if (typeof T.color == "string") {
                    T.color = m(T.color)
                } else {
                    if (T.color.r != undefined && T.color.g != undefined && T.color.b != undefined) {
                        T.color = i(T.color)
                    } else {
                        if (T.color.h != undefined && T.color.s != undefined && T.color.b != undefined) {
                            T.color = f(T.color)
                        } else {
                            return this
                        }
                    }
                }
                return this.each(function () {
                    if (!b(this).data("colorpickerId")) {
                        var U = b.extend({}, T);
                        U.origColor = T.color;
                        var W = "collorpicker_" + parseInt(Math.random() * 1000);
                        b(this).data("colorpickerId", W);
                        var V = b(P).attr("id", W);
                        if (U.flat) {
                            V.appendTo(this).show()
                        } else {
                            V.appendTo(document.body)
                        }
                        U.fields = V.find("input").bind("keyup", n).bind("change", e).bind("blur", o).bind("focus", K);
                        V.find("span").bind("mousedown", I).end().find(">div.ui-colorpicker_current_color").bind("click", F);
                        U.selector = V.find("div.ui-colorpicker_color").bind("mousedown", x);
                        U.selectorIndic = U.selector.find("div div");
                        U.el = this;
                        U.hue = V.find("div.ui-colorpicker_hue div");
                        V.find("div.ui-colorpicker_hue").bind("mousedown", w);
                        U.newColor = V.find("div.ui-colorpicker_new_color");
                        U.currentColor = V.find("div.ui-colorpicker_current_color");
                        V.data("colorpicker", U);
                        V.find("div.ui-colorpicker_submit").bind("mouseenter", v).bind("mouseleave", Q).bind("click", p);
                        J(U.color, V.get(0));
                        u(U.color, V.get(0));
                        g(U.color, V.get(0));
                        G(U.color, V.get(0));
                        l(U.color, V.get(0));
                        h(U.color, V.get(0));
                        E(U.color, V.get(0));
                        if (U.flat) {
                            V.css({position: "relative", display: "block"})
                        } else {
                            b(this).bind(U.eventName, D)
                        }
                    }
                })
            }, showPicker: function () {
                return this.each(function () {
                    if (b(this).data("colorpickerId")) {
                        D.apply(this)
                    }
                })
            }, hidePicker: function () {
                return this.each(function () {
                    if (b(this).data("colorpickerId")) {
                        b("#" + b(this).data("colorpickerId")).hide()
                    }
                })
            }, setColor: function (T) {
                if (typeof T == "string") {
                    T = m(T)
                } else {
                    if (T.r != undefined && T.g != undefined && T.b != undefined) {
                        T = i(T)
                    } else {
                        if (T.h != undefined && T.s != undefined && T.b != undefined) {
                            T = f(T)
                        } else {
                            return this
                        }
                    }
                }
                return this.each(function () {
                    if (b(this).data("colorpickerId")) {
                        var U = b("#" + b(this).data("colorpickerId"));
                        U.data("colorpicker").color = T;
                        U.data("colorpicker").origColor = T;
                        J(T, U.get(0));
                        u(T, U.get(0));
                        g(T, U.get(0));
                        G(T, U.get(0));
                        l(T, U.get(0));
                        h(T, U.get(0));
                        E(T, U.get(0))
                    }
                })
            }
        }
    }();
    b.fn.extend({
        ColorPicker: a.init,
        ColorPickerHide: a.hidePicker,
        ColorPickerShow: a.showPicker,
        ColorPickerSetColor: a.setColor
    })
})(jQuery);
(function (a) {
    var b = window.EYE = function () {
        var c = {init: []};
        return {
            init: function () {
                a.each(c.init, function (e, d) {
                    d.call()
                })
            }, extend: function (e) {
                for (var d in e) {
                    if (e[d] != undefined) {
                        this[d] = e[d]
                    }
                }
            }, register: function (e, d) {
                if (!c[d]) {
                    c[d] = []
                }
                c[d].push(e)
            }
        }
    }();
    a(b.init)
})(jQuery);
(function (a) {
    EYE.extend({
        getPosition: function (f, b) {
            var j = 0;
            var h = 0;
            var k = f.style;
            var l = false;
            if (b && jQuery.curCSS(f, "display") == "none") {
                var g = k.visibility;
                var i = k.position;
                l = true;
                k.visibility = "hidden";
                k.display = "block";
                k.position = "absolute"
            }
            var c = f;
            if (c.getBoundingClientRect) {
                var d = c.getBoundingClientRect();
                j = d.left + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft) - 2;
                h = d.top + Math.max(document.documentElement.scrollTop, document.body.scrollTop) - 2
            } else {
                j = c.offsetLeft;
                h = c.offsetTop;
                c = c.offsetParent;
                if (f != c) {
                    while (c) {
                        j += c.offsetLeft;
                        h += c.offsetTop;
                        c = c.offsetParent
                    }
                }
                if (jQuery.browser.safari && jQuery.curCSS(f, "position") == "absolute") {
                    j -= document.body.offsetLeft;
                    h -= document.body.offsetTop
                }
                c = f.parentNode;
                while (c && c.tagName.toUpperCase() != "BODY" && c.tagName.toUpperCase() != "HTML") {
                    if (jQuery.curCSS(c, "display") != "inline") {
                        j -= c.scrollLeft;
                        h -= c.scrollTop
                    }
                    c = c.parentNode
                }
            }
            if (l == true) {
                k.display = "none";
                k.position = i;
                k.visibility = g
            }
            return {x: j, y: h}
        }, getSize: function (i) {
            var b = parseInt(jQuery.curCSS(i, "width"), 10);
            var f = parseInt(jQuery.curCSS(i, "height"), 10);
            var g = 0;
            var k = 0;
            if (jQuery.curCSS(i, "display") != "none") {
                g = i.offsetWidth;
                k = i.offsetHeight
            } else {
                var j = i.style;
                var c = j.visibility;
                var d = j.position;
                j.visibility = "hidden";
                j.display = "block";
                j.position = "absolute";
                g = i.offsetWidth;
                k = i.offsetHeight;
                j.display = "none";
                j.position = d;
                j.visibility = c
            }
            return {w: b, h: f, wb: g, hb: k}
        }, getClient: function (d) {
            var c, b;
            if (d) {
                b = d.clientWidth;
                c = d.clientHeight
            } else {
                var f = document.documentElement;
                b = window.innerWidth || self.innerWidth || (f && f.clientWidth) || document.body.clientWidth;
                c = window.innerHeight || self.innerHeight || (f && f.clientHeight) || document.body.clientHeight
            }
            return {w: b, h: c}
        }, getScroll: function (j) {
            var f = 0, c = 0, b = 0, g = 0, d = 0, i = 0;
            if (j && j.nodeName.toLowerCase() != "body") {
                f = j.scrollTop;
                c = j.scrollLeft;
                b = j.scrollWidth;
                g = j.scrollHeight
            } else {
                if (document.documentElement) {
                    f = document.documentElement.scrollTop;
                    c = document.documentElement.scrollLeft;
                    b = document.documentElement.scrollWidth;
                    g = document.documentElement.scrollHeight
                } else {
                    if (document.body) {
                        f = document.body.scrollTop;
                        c = document.body.scrollLeft;
                        b = document.body.scrollWidth;
                        g = document.body.scrollHeight
                    }
                }
                if (typeof pageYOffset != "undefined") {
                    f = pageYOffset;
                    c = pageXOffset
                }
                d = self.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0;
                i = self.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0
            }
            return {t: f, l: c, w: b, h: g, iw: d, ih: i}
        }, getMargins: function (i, f) {
            var g = jQuery.curCSS(i, "marginTop") || "";
            var h = jQuery.curCSS(i, "marginRight") || "";
            var c = jQuery.curCSS(i, "marginBottom") || "";
            var d = jQuery.curCSS(i, "marginLeft") || "";
            if (f) {
                return {t: parseInt(g, 10) || 0, r: parseInt(h, 10) || 0, b: parseInt(c, 10) || 0, l: parseInt(d, 10)}
            } else {
                return {t: g, r: h, b: c, l: d}
            }
        }, getPadding: function (i, f) {
            var g = jQuery.curCSS(i, "paddingTop") || "";
            var h = jQuery.curCSS(i, "paddingRight") || "";
            var c = jQuery.curCSS(i, "paddingBottom") || "";
            var d = jQuery.curCSS(i, "paddingLeft") || "";
            if (f) {
                return {t: parseInt(g, 10) || 0, r: parseInt(h, 10) || 0, b: parseInt(c, 10) || 0, l: parseInt(d, 10)}
            } else {
                return {t: g, r: h, b: c, l: d}
            }
        }, getBorder: function (i, f) {
            var g = jQuery.curCSS(i, "borderTopWidth") || "";
            var h = jQuery.curCSS(i, "borderRightWidth") || "";
            var c = jQuery.curCSS(i, "borderBottomWidth") || "";
            var d = jQuery.curCSS(i, "borderLeftWidth") || "";
            if (f) {
                return {
                    t: parseInt(g, 10) || 0,
                    r: parseInt(h, 10) || 0,
                    b: parseInt(c, 10) || 0,
                    l: parseInt(d, 10) || 0
                }
            } else {
                return {t: g, r: h, b: c, l: d}
            }
        }, traverseDOM: function (b, c) {
            c(b);
            b = b.firstChild;
            while (b) {
                EYE.traverseDOM(b, c);
                b = b.nextSibling
            }
        }, getInnerWidth: function (d, b) {
            var c = d.offsetWidth;
            return b ? Math.max(d.scrollWidth, c) - c + d.clientWidth : d.clientWidth
        }, getInnerHeight: function (d, b) {
            var c = d.offsetHeight;
            return b ? Math.max(d.scrollHeight, c) - c + d.clientHeight : d.clientHeight
        }, getExtraWidth: function (b) {
            if (a.boxModel) {
                return (parseInt(a.curCSS(b, "paddingLeft")) || 0) + (parseInt(a.curCSS(b, "paddingRight")) || 0) + (parseInt(a.curCSS(b, "borderLeftWidth")) || 0) + (parseInt(a.curCSS(b, "borderRightWidth")) || 0)
            }
            return 0
        }, getExtraHeight: function (b) {
            if (a.boxModel) {
                return (parseInt(a.curCSS(b, "paddingTop")) || 0) + (parseInt(a.curCSS(b, "paddingBottom")) || 0) + (parseInt(a.curCSS(b, "borderTopWidth")) || 0) + (parseInt(a.curCSS(b, "borderBottomWidth")) || 0)
            }
            return 0
        }, isChildOf: function (d, c, b) {
            if (d == c) {
                return true
            }
            if (!c || !c.nodeType || c.nodeType != 1) {
                return false
            }
            if (d.contains && !a.browser.safari) {
                return d.contains(c)
            }
            if (d.compareDocumentPosition) {
                return !!(d.compareDocumentPosition(c) & 16)
            }
            var e = c.parentNode;
            while (e && e != b) {
                if (e == d) {
                    return true
                }
                e = e.parentNode
            }
            return false
        }, centerEl: function (e, d) {
            var b = EYE.getScroll();
            var c = EYE.getSize(e);
            if (!d || d == "vertically") {
                a(e).css({top: b.t + ((Math.min(b.h, b.ih) - c.hb) / 2) + "px"})
            }
            if (!d || d == "horizontally") {
                a(e).css({left: b.l + ((Math.min(b.w, b.iw) - c.wb) / 2) + "px"})
            }
        }
    });
    if (!a.easing.easeout) {
        a.easing.easeout = function (d, f, b, e, c) {
            return -e * ((f = f / c - 1) * f * f * f - 1) + b
        }
    }
})(jQuery);
PrimeFaces.widget.ColorPicker = PrimeFaces.widget.BaseWidget.extend({
    init: function (a) {
        this._super(a);
        this.input = $(this.jqId + "_input");
        this.cfg.popup = this.cfg.mode == "popup";
        this.jqEl = this.cfg.popup ? $(this.jqId + "_button") : $(this.jqId + "_inline");
        this.cfg.flat = !this.cfg.popup;
        this.cfg.livePreview = false;
        this.cfg.nestedInDialog = this.jqEl.parents(".ui-dialog:first").length == 1;
        this.bindCallbacks();
        if (this.cfg.popup) {
            this.clearOrphanOverlay()
        }
        this.jqEl.ColorPicker(this.cfg);
        if (this.cfg.popup) {
            PrimeFaces.skinButton(this.jqEl);
            this.overlay = $(PrimeFaces.escapeClientId(this.jqEl.data("colorpickerId")));
            this.livePreview = $(this.jqId + "_livePreview")
        }
    }, bindCallbacks: function () {
        var a = this;
        this.cfg.onChange = function (b, d, c) {
            a.input.val(d);
            if (a.cfg.popup) {
                a.livePreview.css("backgroundColor", "#" + d)
            }
        };
        this.cfg.onShow = function () {
            if (a.cfg.popup) {
                a.overlay.css("z-index", ++PrimeFaces.zindex)
            }
            var c = $(window), b = a.cfg.nestedInDialog ? "-" + c.scrollLeft() + " -" + c.scrollTop() : null;
            if (a.cfg.nestedInDialog) {
                a.overlay.css("position", "fixed")
            }
            a.overlay.css({left: "", top: ""}).position({my: "left top", at: "left bottom", of: a.jqEl, offset: b})
        };
        this.cfg.onHide = function (b) {
            a.overlay.css("z-index", ++PrimeFaces.zindex);
            $(b).fadeOut("fast");
            return false
        }
    }, clearOrphanOverlay: function () {
        var a = this;
        $(document.body).children(".ui-colorpicker-container").each(function (e, d) {
            var c = $(d), b = c.data("colorpicker");
            if (b.id == a.id) {
                c.remove();
                return false
            }
        })
    }
});