(function (d) {
    var c = "0.0.4";
    var b = function () {
        return {
            PS1: "wterm $",
            TERMINAL_CLASS: "ui-terminal ui-widget",
            PROMPT_CLASS: "ui-terminal-prompt",
            THEME_CLASS_PREFIX: "",
            DEFAULT_THEME: "ui-widget-content ui-corner-all",
            HIGHLIGHT_CLASS: "ui-terminal-highlight",
            KEYWORD_CLASS: "ui-terminal-keyword",
            CONTENT_CLASS: "ui-terminal-content",
            WIDTH: "90%",
            HEIGHT: "90%",
            WELCOME_MESSAGE: "Welcome to Wterm version-" + c,
            NOT_FOUND: "<div> CMD: Command Not Found </div>",
            AUTOCOMPLETE: true,
            HISTORY: true,
            HISTORY_ENTRIES: 100,
            AJAX_METHOD: "GET",
            AJAX_PARAM: "tokens",
            ERROR_PREFIX: "An Error Occured: "
        }
    };
    var a = {};
    d.fn.wterm = function (e) {
        var f = b();
        d.extend(true, f, e);
        return this.each(function () {
            var j = d(this);
            var m = [];
            var s = null;
            j.addClass(f.TERMINAL_CLASS).addClass(f.THEME_CLASS_PREFIX + f.DEFAULT_THEME);
            if (f.WIDTH && f.HEIGHT) {
                j.css({width: f.WIDTH, height: f.HEIGHT})
            }
            j.html("").append("<div>" + f.WELCOME_MESSAGE + "</div>");
            j.append('<div class="' + f.CONTENT_CLASS + '"></div>');
            j.append('<div><span class="' + f.PROMPT_CLASS + '">' + f.PS1 + '&nbsp;</span><form> <input type="text" ></form></div>');
            var o = j.find("div:last span:last");
            var l = j.find("div:last form");
            var q = j.find("div:last form input");
            var n = j.find("." + f.CONTENT_CLASS);
            var g = {
                DISPATCH: function (w) {
                    var v = {
                        source: e.id, process: e.id, update: e.id, formId: e.formId, onsuccess: function (B) {
                            var z = B.documentElement, A = z.getElementsByTagName("update");
                            for (var x = 0; x < A.length; x++) {
                                var C = A[x].attributes.getNamedItem("id").nodeValue, y = A[x].firstChild.data;
                                if (C == e.id) {
                                    t(f.PS1, w.join(" "), y)
                                } else {
                                    PrimeFaces.ajax.AjaxUtils.updateElement.call(this, C, y)
                                }
                            }
                            return true
                        }
                    };
                    v.params = [{name: e.id + "_args", value: w.join(",")}];
                    PrimeFaces.ajax.AjaxRequest(v)
                }
            };
            var h = null;
            var u = null;
            q.focus();
            j.click(function () {
                q.focus()
            });
            var k = function () {
                o.hide()
            };
            var r = function () {
                o.show();
                q.focus()
            };
            var t = function (x, w, v) {
                n.append("<div><span>" + x + " " + w + "</span><div>" + ((v) ? v : "") + "</div></div>")
            };
            var p = function () {
                n.html("")
            };
            a.clear = p;
            set_prompt = function (v) {
                if (v && v.length) {
                    j.find("." + f.PROMPT_CLASS).html(v + "&nbsp;")
                }
            };
            l.submit(function (A) {
                A.preventDefault();
                A.stopPropagation();
                var y = q.attr("value");
                if (f.HISTORY) {
                    if (m.length > f.HISTORY_ENTRIES) {
                        m.shift()
                    }
                    m.push(y)
                }
                q.attr("value", "");
                var z = y.split(/\s+/);
                var x = z[0];
                k();
                var v = function () {
                    return (u) ? u : f.PS1
                };
                var w = function (B, D) {
                    if (typeof B === "function") {
                        data = B(D);
                        if (data) {
                            t(v(), y, data)
                        }
                    } else {
                        if (typeof B === "string") {
                            var C = {};
                            C[f.AJAX_PARAM] = D.join(" ");
                            var E = function (G, F) {
                                t(v(), y, G)
                            };
                            d[f.AJAX_METHOD.toLowerCase()](a[B], C, E)
                        }
                    }
                };
                if (x == "") {
                    t(v(), "")
                } else {
                    if (g && x == "exit") {
                        f.AUTOCOMPLETE = (h) ? h : false;
                        if (g.EXIT_HOOK) {
                            w(g.EXIT_HOOK, z)
                        } else {
                            w(function () {
                                return "<b></b>"
                            }, z)
                        }
                        g = null;
                        u = null;
                        set_prompt(f.PS1)
                    } else {
                        if (g) {
                            w(g.DISPATCH, z)
                        } else {
                            if (a[x]) {
                                if (typeof a[x] === "object") {
                                    g = a[x];
                                    u = g.PS1 || x;
                                    set_prompt(u);
                                    h = f.AUTOCOMPLETE;
                                    f.AUTOCOMPLETE = false;
                                    if (g.START_HOOK) {
                                        w(g.START_HOOK, z)
                                    } else {
                                        w(function () {
                                            return "<b></b>"
                                        }, z)
                                    }
                                } else {
                                    w(a[x], z)
                                }
                            } else {
                                t(f.PS1, y, f.NOT_FOUND.replace("CMD", z[0]))
                            }
                        }
                    }
                }
                r()
            });
            q.keydown(function (y) {
                var w = y.keyCode;
                switch (w) {
                    case 9:
                        y.preventDefault();
                        if (f.AUTOCOMPLETE) {
                            var v = [];
                            var x = q.attr("value");
                            if (x.match(/^[^\s]{0,}$/)) {
                                for (i in a) {
                                    if (x == "") {
                                        v.push(i)
                                    } else {
                                        if (i.indexOf(x) == 0) {
                                            v.push(i)
                                        }
                                    }
                                }
                                if (v.length > 1) {
                                    t(f.PS1, x, v.join("<br>"))
                                } else {
                                    if (v.length == 1) {
                                        q.attr("value", v.pop() + " ")
                                    }
                                }
                            }
                        }
                        break;
                    case 38:
                        y.preventDefault();
                        if (f.HISTORY) {
                            s = (s === null) ? m.length - 1 : (s == 0) ? m.length - 1 : s - 1;
                            q.attr("value", m[s])
                        }
                        break;
                    case 40:
                        y.preventDefault();
                        if (f.HISTORY) {
                            if (s === null || s == (m.length - 1)) {
                                break
                            }
                            s++;
                            q.attr("value", m[s])
                        }
                        break;
                    default:
                        break
                }
            })
        })
    };
    d.register_command = function (h, f) {
        try {
            if (typeof f === "function" || typeof f === "string" || typeof f === "object") {
                a[h] = f
            } else {
                throw"Dispatch needs to be a method"
            }
        } catch (g) {
        }
    }
})(jQuery);
PrimeFaces.widget.Terminal = PrimeFaces.widget.BaseWidget.extend({
    init: function (a) {
        this._super(a);
        this.cfg.formId = this.jq.parents("form:first").attr("id");
        this.jq.wterm(this.cfg)
    }, focus: function () {
        $(this.jqId + " input").eq(0).focus()
    }
});