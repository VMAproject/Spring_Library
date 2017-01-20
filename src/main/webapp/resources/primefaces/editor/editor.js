(function (C) {
    C.cleditor = {
        defaultOptions: {
            width: 500,
            height: 250,
            controls: "bold italic underline strikethrough subscript superscript | font size style | color highlight removeformat | bullets numbering | outdent indent | alignleft center alignright justify | undo redo | rule image link unlink | cut copy paste pastetext | print source",
            colors: "FFF FCC FC9 FF9 FFC 9F9 9FF CFF CCF FCF CCC F66 F96 FF6 FF3 6F9 3FF 6FF 99F F9F BBB F00 F90 FC6 FF0 3F3 6CC 3CF 66C C6C 999 C00 F60 FC3 FC0 3C0 0CC 36F 63F C3C 666 900 C60 C93 990 090 399 33F 60C 939 333 600 930 963 660 060 366 009 339 636 000 300 630 633 330 030 033 006 309 303",
            fonts: "Arial,Arial Black,Comic Sans MS,Courier New,Narrow,Garamond,Georgia,Impact,Sans Serif,Serif,Tahoma,Trebuchet MS,Verdana",
            sizes: "1,2,3,4,5,6,7",
            styles: [["Paragraph", "<p>"], ["Header 1", "<h1>"], ["Header 2", "<h2>"], ["Header 3", "<h3>"], ["Header 4", "<h4>"], ["Header 5", "<h5>"], ["Header 6", "<h6>"]],
            useCSS: false,
            docType: '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">',
            docCSSFile: "",
            bodyStyle: "margin:4px; font:10pt Arial,Verdana; cursor:text"
        },
        buttons: {init: "bold,,|italic,,|underline,,|strikethrough,,|subscript,,|superscript,,|font,,fontname,|size,Font Size,fontsize,|style,,formatblock,|color,Font Color,forecolor,|highlight,Text Highlight Color,hilitecolor,color|removeformat,Remove Formatting,|bullets,,insertunorderedlist|numbering,,insertorderedlist|outdent,,|indent,,|alignleft,Align Text Left,justifyleft|center,,justifycenter|alignright,Align Text Right,justifyright|justify,,justifyfull|undo,,|redo,,|rule,Insert Horizontal Rule,inserthorizontalrule|image,Insert Image,insertimage,url|link,Insert Hyperlink,createlink,url|unlink,Remove Hyperlink,|cut,,|copy,,|paste,,|pastetext,Paste as Text,inserthtml,|print,,|source,Show Source"},
        imagesPath: function () {
            return t()
        }
    };
    C.fn.cleditor = function (ag) {
        var af = C([]);
        this.each(function (ah, ai) {
            if (ai.tagName == "TEXTAREA") {
                var aj = C.data(ai, d);
                if (!aj) {
                    aj = new cleditor(ai, ag)
                }
                af = af.add(aj)
            }
        });
        return af
    };
    var n = "backgroundColor", Z = "button", Y = "buttonName", A = "change", d = "cleditor", Q = "click", z = "disabled", D = "<div>", w = "transparent", M = "unselectable", b = "ui-editor ui-widget-content", u = "ui-editor-toolbar", aa = "ui-editor-group", L = "ui-editor-button", ab = "ui-editor-disabled", J = "ui-editor-divider", G = "ui-editor-popup", ad = "ui-editor-list", U = "ui-editor-color", c = "ui-editor-prompt", W = "ui-editor-message", H = C.browser.msie, q = /msie\s6/i.test(navigator.userAgent), l = /(?!.*5).*(iphone|ipad|ipod)/i.test(navigator.userAgent), g = {}, B, v = C.cleditor.buttons;
    C.each(v.init.split("|"), function (af, ai) {
        var ag = ai.split(","), ah = ag[0];
        v[ah] = {
            stripIndex: af,
            name: ah,
            title: ag[1] === "" ? ah.charAt(0).toUpperCase() + ah.substr(1) : ag[1],
            command: ag[2] === "" ? ah : ag[2],
            popupName: ag[3] === "" ? ah : ag[3]
        }
    });
    delete v.init;
    cleditor = function (ak, ah) {
        var aj = this;
        aj.options = ah = C.extend({}, C.cleditor.defaultOptions, ah);
        var af = aj.$area = C(ak).hide().data(d, aj).blur(function () {
            N(aj, true)
        });
        var al = aj.$main = C(D).addClass(b).width(ah.width).height(ah.height);
        var ag = aj.$toolbar = C(D).addClass(u).appendTo(al);
        var ai = C(D).addClass(aa).appendTo(ag);
        C.each(ah.controls.split(" "), function (an, am) {
            if (am === "") {
                return true
            }
            if (am == "|") {
                var ap = C(D).addClass(J).appendTo(ai);
                ai = C(D).addClass(aa).appendTo(ag)
            } else {
                var aq = v[am];
                var ao = C(D).data(Y, aq.name).addClass(L).attr("title", aq.title).bind(Q, C.proxy(e, aj)).appendTo(ai).hover(X, f);
                var ar = {};
                if (aq.css) {
                    ar = aq.css
                } else {
                    if (aq.image) {
                        ar.backgroundImage = E(aq.image)
                    }
                }
                if (aq.stripIndex) {
                    ar.backgroundPosition = aq.stripIndex * -24
                }
                ao.css(ar);
                if (H) {
                    ao.attr(M, "on")
                }
                if (aq.popupName) {
                    p(aq.popupName, ah, aq.popupClass, aq.popupContent, aq.popupHover)
                }
            }
        });
        al.insertBefore(af).append(af);
        if (!B) {
            C(document).click(function (an) {
                var am = C(an.target);
                if (!am.add(am.parents()).is("." + c)) {
                    ae()
                }
            });
            B = true
        }
        if (/auto|%/.test("" + ah.width + ah.height)) {
            C(window).resize(function () {
                ac(aj)
            })
        }
        ac(aj)
    };
    var x = cleditor.prototype, F = [["clear", I], ["disable", i], ["execCommand", a], ["focus", R], ["hidePopups", ae], ["sourceMode", h, true], ["refresh", ac], ["select", S], ["selectedHTML", m, true], ["selectedText", O, true], ["showMessage", y], ["updateFrame", N], ["updateTextArea", K]];
    C.each(F, function (af, ag) {
        x[ag[0]] = function () {
            var ak = this, aj = [ak];
            for (var ai = 0; ai < arguments.length; ai++) {
                aj.push(arguments[ai])
            }
            var ah = ag[1].apply(ak, aj);
            if (ag[2]) {
                return ah
            }
            return ak
        }
    });
    x.change = function (af) {
        var ag = C(this);
        return af ? ag.bind(A, af) : ag.trigger(A)
    };
    function e(ak) {
        var aj = this, am = ak.target, an = C.data(am, Y), ai = v[an], al = ai.popupName, ag = g[al];
        if (aj.disabled || C(am).attr(z) == z) {
            return
        }
        var ah = {
            editor: aj,
            button: am,
            buttonName: an,
            popup: ag,
            popupName: al,
            command: ai.command,
            useCSS: aj.options.useCSS
        };
        if (ai.buttonClick && ai.buttonClick(ak, ah) === false) {
            return false
        }
        if (an == "source") {
            if (h(aj)) {
                delete aj.range;
                aj.$area.hide();
                aj.$frame.show();
                am.title = ai.title
            } else {
                aj.$frame.hide();
                aj.$area.show();
                am.title = "Show Rich Text"
            }
            setTimeout(function () {
                o(aj)
            }, 100)
        } else {
            if (!h(aj)) {
                if (al) {
                    var af = C(ag);
                    if (al == "url") {
                        if (an == "link" && O(aj) === "") {
                            y(aj, "A selection is required when inserting a link.", am);
                            return false
                        }
                        af.children(":button").unbind(Q).bind(Q, function () {
                            var ap = af.find(":text"), ao = C.trim(ap.val());
                            if (ao !== "") {
                                a(aj, ah.command, ao, null, ah.button)
                            }
                            ap.val("http://");
                            ae();
                            R(aj)
                        })
                    } else {
                        if (al == "pastetext") {
                            af.children(":button").unbind(Q).bind(Q, function () {
                                var ap = af.find("textarea"), ao = ap.val().replace(/\n/g, "<br />");
                                if (ao !== "") {
                                    a(aj, ah.command, ao, null, ah.button)
                                }
                                ap.val("");
                                ae();
                                R(aj)
                            })
                        }
                    }
                    if (am !== C.data(ag, Z)) {
                        k(aj, ag, am);
                        return false
                    }
                    return
                } else {
                    if (an == "print") {
                        aj.$frame[0].contentWindow.print()
                    } else {
                        if (!a(aj, ah.command, ah.value, ah.useCSS, am)) {
                            return false
                        }
                    }
                }
            }
        }
        R(aj)
    }

    function X(ag) {
        var af = C(ag.target).closest("div");
        af.css(n, af.data(Y) ? "#FFF" : "#FFC")
    }

    function f(af) {
        C(af.target).closest("div").css(n, "transparent")
    }

    function T(al) {
        var aj = this, af = al.data.popup, am = al.target;
        if (af === g.msg || C(af).hasClass(c)) {
            return
        }
        var ao = C.data(af, Z), ap = C.data(ao, Y), ai = v[ap], ag = ai.command, an, ak = aj.options.useCSS;
        if (ap == "font") {
            an = am.style.fontFamily.replace(/"/g, "")
        } else {
            if (ap == "size") {
                if (am.tagName == "DIV") {
                    am = am.children[0]
                }
                an = am.innerHTML
            } else {
                if (ap == "style") {
                    an = "<" + am.tagName + ">"
                } else {
                    if (ap == "color") {
                        an = P(am.style.backgroundColor)
                    } else {
                        if (ap == "highlight") {
                            an = P(am.style.backgroundColor);
                            if (H) {
                                ag = "backcolor"
                            } else {
                                ak = true
                            }
                        }
                    }
                }
            }
        }
        var ah = {
            editor: aj,
            button: ao,
            buttonName: ap,
            popup: af,
            popupName: ai.popupName,
            command: ag,
            value: an,
            useCSS: ak
        };
        if (ai.popupClick && ai.popupClick(al, ah) === false) {
            return
        }
        if (ah.command && !a(aj, ah.command, ah.value, ah.useCSS, ao)) {
            return false
        }
        ae();
        R(aj)
    }

    function r(ai) {
        var ag = 1, af = 0;
        for (var ah = 0; ah < ai.length; ++ah) {
            ag = (ag + ai.charCodeAt(ah)) % 65521;
            af = (af + ag) % 65521
        }
        return (af << 16) | ag
    }

    function I(af) {
        af.$area.val("");
        N(af)
    }

    function p(aj, ah, ai, ag, ak) {
        if (g[aj]) {
            return g[aj]
        }
        var al = C(D).hide().addClass(G).appendTo("body");
        if (ag) {
            al.html(ag)
        } else {
            if (aj == "color") {
                var af = ah.colors.split(" ");
                if (af.length < 10) {
                    al.width("auto")
                }
                C.each(af, function (am, an) {
                    C(D).appendTo(al).css(n, "#" + an)
                });
                ai = U
            } else {
                if (aj == "font") {
                    C.each(ah.fonts.split(","), function (am, an) {
                        C(D).appendTo(al).css("fontFamily", an).html(an)
                    })
                } else {
                    if (aj == "size") {
                        C.each(ah.sizes.split(","), function (am, an) {
                            C(D).appendTo(al).html("<font size=" + an + ">" + an + "</font>")
                        })
                    } else {
                        if (aj == "style") {
                            C.each(ah.styles, function (am, an) {
                                C(D).appendTo(al).html(an[1] + an[0] + an[1].replace("<", "</"))
                            })
                        } else {
                            if (aj == "url") {
                                al.html('Enter URL:<br /><input type=text value="http://" size=35><br /><input type=button value="Submit">');
                                ai = c
                            } else {
                                if (aj == "pastetext") {
                                    al.html("Paste your content here and click submit.<br /><textarea cols=40 rows=3></textarea><br /><input type=button value=Submit>");
                                    ai = c
                                }
                            }
                        }
                    }
                }
            }
        }
        if (!ai && !ag) {
            ai = ad
        }
        al.addClass(ai);
        if (H) {
            al.attr(M, "on").find("div,font,p,h1,h2,h3,h4,h5,h6").attr(M, "on")
        }
        if (al.hasClass(ad) || ak === true) {
            al.children().hover(X, f)
        }
        g[aj] = al[0];
        return al[0]
    }

    function i(ag, af) {
        if (af) {
            ag.$area.attr(z, z);
            ag.disabled = true
        } else {
            ag.$area.removeAttr(z);
            delete ag.disabled
        }
        try {
            if (H) {
                ag.doc.body.contentEditable = !af
            } else {
                ag.doc.designMode = !af ? "on" : "off"
            }
        } catch (ah) {
        }
        o(ag)
    }

    function a(ag, am, aj, al, af) {
        V(ag);
        if (!H) {
            if (al === undefined || al === null) {
                al = ag.options.useCSS
            }
            ag.doc.execCommand("styleWithCSS", 0, al.toString())
        }
        var ak = true, ai;
        if (H && am.toLowerCase() == "inserthtml") {
            j(ag).pasteHTML(aj)
        } else {
            try {
                ak = ag.doc.execCommand(am, 0, aj || null)
            } catch (ah) {
                ai = ah.description;
                ak = false
            }
            if (!ak) {
                if ("cutcopypaste".indexOf(am) > -1) {
                    y(ag, "For security reasons, your browser does not support the " + am + " command. Try using the keyboard shortcut or context menu instead.", af)
                } else {
                    y(ag, (ai ? ai : "Error executing the " + am + " command."), af)
                }
            }
        }
        o(ag);
        return ak
    }

    function R(af) {
        setTimeout(function () {
            if (h(af)) {
                af.$area.focus()
            } else {
                af.$frame[0].contentWindow.focus()
            }
            o(af)
        }, 0)
    }

    function j(af) {
        if (H) {
            return s(af).createRange()
        }
        return s(af).getRangeAt(0)
    }

    function s(af) {
        if (H) {
            return af.doc.selection
        }
        return af.$frame[0].contentWindow.getSelection()
    }

    function P(ag) {
        var af = /rgba?\((\d+), (\d+), (\d+)/.exec(ag), ah = ag.split("");
        if (af) {
            ag = (af[1] << 16 | af[2] << 8 | af[3]).toString(16);
            while (ag.length < 6) {
                ag = "0" + ag
            }
        }
        return "#" + (ag.length == 6 ? ag : ah[1] + ah[1] + ah[2] + ah[2] + ah[3] + ah[3])
    }

    function ae() {
        C.each(g, function (af, ag) {
            C(ag).hide().unbind(Q).removeData(Z)
        })
    }

    function t() {
        var af = "jquery.cleditor.css", ag = C("link[href$='" + af + "']").attr("href");
        return ag.substr(0, ag.length - af.length) + "images/"
    }

    function E(af) {
        return "url(" + t() + af + ")"
    }

    function ac(ak) {
        var ag = ak.$main, ap = ak.options;
        if (ak.$frame) {
            ak.$frame.remove()
        }
        var af = ak.$frame = C('<iframe frameborder="0" src="javascript:true;">').hide().appendTo(ag);
        var aj = af[0].contentWindow, an = ak.doc = aj.document, ai = C(an);
        an.open();
        an.write(ap.docType + "<html>" + ((ap.docCSSFile === "") ? "" : '<head><link rel="stylesheet" type="text/css" href="' + ap.docCSSFile + '" /></head>') + '<body style="' + ap.bodyStyle + '"></body></html>');
        an.close();
        if (H) {
            ai.click(function () {
                R(ak)
            })
        }
        N(ak);
        if (H) {
            ai.bind("beforedeactivate beforeactivate selectionchange keypress", function (aq) {
                if (aq.type == "beforedeactivate") {
                    ak.inactive = true
                } else {
                    if (aq.type == "beforeactivate") {
                        if (!ak.inactive && ak.range && ak.range.length > 1) {
                            ak.range.shift()
                        }
                        delete ak.inactive
                    } else {
                        if (!ak.inactive) {
                            if (!ak.range) {
                                ak.range = []
                            }
                            ak.range.unshift(j(ak));
                            while (ak.range.length > 2) {
                                ak.range.pop()
                            }
                        }
                    }
                }
            });
            af.focus(function () {
                V(ak)
            })
        }
        (C.browser.mozilla ? ai : C(aj)).blur(function () {
            K(ak, true)
        });
        ai.click(ae).bind("keyup mouseup", function () {
            o(ak)
        });
        if (l) {
            ak.$area.show()
        } else {
            af.show()
        }
        var ah = ak.$toolbar, am = ah.children("div:last"), ao = ag.width();
        var al = am.offset().top + am.outerHeight() - ah.offset().top + 1;
        ah.height(al);
        al = (/%/.test("" + ap.height) ? ag.height() : parseInt(ap.height)) - al;
        af.width(ao).height(al);
        ak.$area.width(ao).height(q ? al - 2 : al);
        i(ak, ak.disabled);
        o(ak)
    }

    function o(af) {
        if (!l && C.browser.webkit && !af.focused) {
            af.$frame[0].contentWindow.focus();
            window.focus();
            af.focused = true
        }
        var ag = af.doc;
        if (H) {
            ag = j(af)
        }
        var ah = h(af);
        C.each(af.$toolbar.find("." + L), function (ai, an) {
            var aj = C(an), al = C.cleditor.buttons[C.data(an, Y)], ap = al.command, ak = true;
            if (af.disabled) {
                ak = false
            } else {
                if (al.getEnabled) {
                    var ao = {
                        editor: af,
                        button: an,
                        buttonName: al.name,
                        popup: g[al.popupName],
                        popupName: al.popupName,
                        command: al.command,
                        useCSS: af.options.useCSS
                    };
                    ak = al.getEnabled(ao);
                    if (ak === undefined) {
                        ak = true
                    }
                } else {
                    if (((ah || l) && al.name != "source") || (H && (ap == "undo" || ap == "redo"))) {
                        ak = false
                    } else {
                        if (ap && ap != "print") {
                            if (H && ap == "hilitecolor") {
                                ap = "backcolor"
                            }
                            if (!H || ap != "inserthtml") {
                                try {
                                    ak = ag.queryCommandEnabled(ap)
                                } catch (am) {
                                    ak = false
                                }
                            }
                        }
                    }
                }
            }
            if (ak) {
                aj.removeClass(ab);
                aj.removeAttr(z)
            } else {
                aj.addClass(ab);
                aj.attr(z, z)
            }
        })
    }

    function V(af) {
        if (H && af.range) {
            af.range[0].select()
        }
    }

    function S(af) {
        setTimeout(function () {
            if (h(af)) {
                af.$area.select()
            } else {
                a(af, "selectall")
            }
        }, 0)
    }

    function m(ai) {
        V(ai);
        var af = j(ai);
        if (H) {
            return af.htmlText
        }
        var ah = C("<layer>")[0];
        ah.appendChild(af.cloneContents());
        var ag = ah.innerHTML;
        ah = null;
        return ag
    }

    function O(af) {
        V(af);
        if (H) {
            return j(af).text
        }
        return s(af).toString()
    }

    function y(ah, ai, ag) {
        var af = p("msg", ah.options, W);
        af.innerHTML = ai;
        k(ah, af, ag)
    }

    function k(am, ah, al) {
        var ak, aj, an, af = C(ah);
        if (al) {
            var ag = C(al);
            ak = ag.offset();
            aj = --ak.left;
            an = ak.top + ag.height()
        } else {
            var ai = am.$toolbar;
            ak = ai.offset();
            aj = Math.floor((ai.width() - af.width()) / 2) + ak.left;
            an = ak.top + ai.height() - 2
        }
        ae();
        af.css({left: aj, top: an}).show();
        if (al) {
            C.data(ah, Z, al);
            af.bind(Q, {popup: ah}, C.proxy(T, am))
        }
        setTimeout(function () {
            af.find(":text,textarea").eq(0).focus().select()
        }, 100)
    }

    function h(af) {
        return af.$area.is(":visible")
    }

    function N(aj, af) {
        var ak = aj.$area.val(), ag = aj.options, am = ag.updateFrame, al = C(aj.doc.body);
        if (am) {
            var ai = r(ak);
            if (af && aj.areaChecksum == ai) {
                return
            }
            aj.areaChecksum = ai
        }
        var ah = am ? am(ak) : ak;
        ah = ah.replace(/<(?=\/?script)/ig, "&lt;");
        if (ag.updateTextArea) {
            aj.frameChecksum = r(ah)
        }
        if (ah != al.html()) {
            al.html(ah);
            C(aj).triggerHandler(A)
        }
    }

    function K(ak, af) {
        var ai = C(ak.doc.body).html(), ah = ak.options, am = ah.updateTextArea, ag = ak.$area;
        if (am) {
            var aj = r(ai);
            if (af && ak.frameChecksum == aj) {
                return
            }
            ak.frameChecksum = aj
        }
        var al = am ? am(ai) : ai;
        if (ah.updateFrame) {
            ak.areaChecksum = r(al)
        }
        if (al != ag.val()) {
            ag.val(al);
            C(ak).triggerHandler(A)
        }
    }
})(jQuery);
(function (a) {
    var b = a.cleditor.defaultOptions.updateTextArea;
    a.cleditor.defaultOptions.updateTextArea = function (c) {
        if (b) {
            c = b(c)
        }
        return a.cleditor.convertHTMLtoXHTML(c)
    };
    a.cleditor.convertHTMLtoXHTML = function (K) {
        function G(g) {
            var c = {};
            g = g.split(",");
            for (var d = 0; d < g.length; d++) {
                c[g[d]] = true
            }
            return c
        }

        function l(j, c, i, g) {
            c = c.toLowerCase();
            if (k[c]) {
                for (; J.last() && h[J.last()];) {
                    F("", J.last())
                }
            }
            f[c] && J.last() == c && F("", c);
            (g = e[c] || !!g) || J.push(c);
            var d = [];
            i.replace(E, function (u, r, v, t, s) {
                d.push({name: r, escaped: (v ? v : t ? t : s ? s : D[r] ? r : "").replace(/(^|[^\\])"/g, '$1\\"')})
            });
            H += "<" + c;
            for (j = 0; j < d.length; j++) {
                H += " " + d[j].name + '="' + d[j].escaped + '"'
            }
            H += (g ? "/" : "") + ">"
        }

        function F(i, c) {
            if (c) {
                c = c.toLowerCase();
                for (g = J.length - 1; g >= 0; g--) {
                    if (J[g] == c) {
                        break
                    }
                }
            } else {
                var g = 0
            }
            if (g >= 0) {
                for (var d = J.length - 1; d >= g; d--) {
                    H += "</" + J[d] + ">"
                }
                J.length = g
            }
        }

        function q(d, c) {
            H = H.replace(d, c)
        }

        var o = /^<(\w+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/, n = /^<\/(\w+)[^>]*>/, E = /(\w+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g, e = G("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed"), k = G("address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul"), h = G("a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var"), f = G("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr"), D = G("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected"), p = G("script,style"), J = [];
        J.last = function () {
            return this[this.length - 1]
        };
        for (var I, m = K, H = ""; K;) {
            if (!J.last() || !p[J.last()]) {
                if (K.indexOf("<!--") == 0) {
                    I = K.indexOf("-->");
                    if (I >= 0) {
                        H += K.substring(0, I + 3);
                        K = K.substring(I + 3)
                    }
                } else {
                    if (K.indexOf("</") == 0) {
                        if (I = K.match(n)) {
                            K = K.substring(I[0].length);
                            I[0].replace(n, F)
                        }
                    } else {
                        if (K.indexOf("<") == 0) {
                            if (I = K.match(o)) {
                                K = K.substring(I[0].length);
                                I[0].replace(o, l)
                            }
                        } else {
                            I = K.indexOf("<");
                            H += I < 0 ? K : K.substring(0, I);
                            K = I < 0 ? "" : K.substring(I)
                        }
                    }
                }
            } else {
                K = K.replace(RegExp("(.*)</" + J.last() + "[^>]*>"), function (d, c) {
                    c = c.replace(/<!--(.*?)--\>/g, "$1").replace(/<!\[CDATA\[(.*?)]]\>/g, "$1");
                    H += c;
                    return ""
                });
                F("", J.last())
            }
            if (K == m) {
                throw"Parse Error: " + K
            }
            m = K
        }
        F();
        q(/<b>(.*?)<\/b>/g, "<strong>$1</strong>");
        q(/<i>(.*?)<\/i>/g, "<em>$1</em>");
        return H
    }
})(jQuery);
PrimeFaces.widget.Editor = PrimeFaces.widget.BaseWidget.extend({
    init: function (c) {
        this._super(c);
        this.jqInput = $(this.jqId + "_input");
        var b = this;
        if (this.jq.is(":visible")) {
            this.render()
        } else {
            var a = this.jq.parents(".ui-hidden-container:first"), d = a.data("widget");
            if (d) {
                d.addOnshowHandler(function () {
                    return b.render()
                })
            }
        }
    }, render: function () {
        if (this.jq.is(":visible")) {
            this.editor = this.jqInput.cleditor(this.cfg)[0];
            if (this.cfg.disabled) {
                this.disable()
            }
            if (this.cfg.invalid) {
                this.invalidate()
            }
            if (this.cfg.change) {
                this.editor.change(this.cfg.change)
            }
            if (this.cfg.maxlength) {
                this.bindMaxlength()
            }
            this.jq.css("visibility", "");
            return true
        } else {
            return false
        }
    }, bindMaxlength: function () {
        var b = this, a = this.editor.$frame[0].contentWindow.document;
        $(a).bind("keydown.editor", function (c) {
            b.editor.updateTextArea();
            var d = b.editor.$area.val();
            if (d.length >= b.cfg.maxlength && c.which != 8 && c.which != 46 && c.which != 37 && c.which != 38 && c.which != 39 && c.which != 16 && c.which != 20 && c.which != 91 && c.which != 18) {
                b.editor.$area.val(d.substr(0, b.cfg.maxlength));
                return false
            } else {
                b.editor.updateTextArea();
                return true
            }
        })
    }, saveHTML: function () {
        this.editor.updateTextArea()
    }, clear: function () {
        this.editor.clear()
    }, enable: function () {
        this.editor.disable(false)
    }, disable: function () {
        this.editor.disable(true)
    }, invalidate: function () {
        this.jq.children("div.ui-editor").addClass("ui-state-error")
    }, focus: function () {
        this.editor.focus()
    }, selectAll: function () {
        this.editor.select()
    }, getSelectedHTML: function () {
        return this.editor.selectedHTML()
    }, getSelectedText: function () {
        return this.editor.selectedText()
    }
});