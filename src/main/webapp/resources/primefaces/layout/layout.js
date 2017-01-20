(function ($) {
    var min = Math.min, max = Math.max, round = Math.floor, isStr = function (v) {
        return $.type(v) === "string"
    }, runPluginCallbacks = function (Instance, a_fn) {
        if ($.isArray(a_fn)) {
            for (var i = 0, c = a_fn.length; i < c; i++) {
                var fn = a_fn[i];
                try {
                    if (isStr(fn)) {
                        fn = eval(fn)
                    }
                    if ($.isFunction(fn)) {
                        g(fn)(Instance)
                    }
                } catch (ex) {
                }
            }
        }
        function g(f) {
            return f
        }
    };
    $.layout = {
        version: "1.3.rc30.79",
        revision: 0.033007,
        browser: {},
        effects: {
            slide: {
                all: {duration: "fast"},
                north: {direction: "up"},
                south: {direction: "down"},
                east: {direction: "right"},
                west: {direction: "left"}
            },
            drop: {
                all: {duration: "slow"},
                north: {direction: "up"},
                south: {direction: "down"},
                east: {direction: "right"},
                west: {direction: "left"}
            },
            scale: {all: {duration: "fast"}},
            blind: {},
            clip: {},
            explode: {},
            fade: {},
            fold: {},
            puff: {},
            size: {all: {easing: "swing"}}
        },
        config: {
            optionRootKeys: "effects,panes,north,south,west,east,center".split(","),
            allPanes: "north,south,west,east,center".split(","),
            borderPanes: "north,south,west,east".split(","),
            oppositeEdge: {north: "south", south: "north", east: "west", west: "east"},
            offscreenCSS: {left: "-99999px", right: "auto"},
            offscreenReset: "offscreenReset",
            hidden: {visibility: "hidden"},
            visible: {visibility: "visible"},
            resizers: {
                cssReq: {
                    position: "absolute",
                    padding: 0,
                    margin: 0,
                    fontSize: "1px",
                    textAlign: "left",
                    overflow: "hidden"
                }, cssDemo: {background: "#DDD", border: "none"}
            },
            togglers: {
                cssReq: {
                    position: "absolute",
                    display: "block",
                    padding: 0,
                    margin: 0,
                    overflow: "hidden",
                    textAlign: "center",
                    fontSize: "1px",
                    cursor: "pointer",
                    zIndex: 1
                }, cssDemo: {background: "#AAA"}
            },
            content: {
                cssReq: {position: "relative"},
                cssDemo: {overflow: "auto", padding: "10px"},
                cssDemoPane: {overflow: "hidden", padding: 0}
            },
            panes: {
                cssReq: {position: "absolute", margin: 0},
                cssDemo: {padding: "10px", background: "#FFF", border: "1px solid #BBB", overflow: "auto"}
            },
            north: {
                side: "top",
                sizeType: "Height",
                dir: "horz",
                cssReq: {top: 0, bottom: "auto", left: 0, right: 0, width: "auto"}
            },
            south: {
                side: "bottom",
                sizeType: "Height",
                dir: "horz",
                cssReq: {top: "auto", bottom: 0, left: 0, right: 0, width: "auto"}
            },
            east: {
                side: "right",
                sizeType: "Width",
                dir: "vert",
                cssReq: {left: "auto", right: 0, top: "auto", bottom: "auto", height: "auto"}
            },
            west: {
                side: "left",
                sizeType: "Width",
                dir: "vert",
                cssReq: {left: 0, right: "auto", top: "auto", bottom: "auto", height: "auto"}
            },
            center: {
                dir: "center",
                cssReq: {left: "auto", right: "auto", top: "auto", bottom: "auto", height: "auto", width: "auto"}
            }
        },
        callbacks: {},
        getParentPaneElem: function (el) {
            var $el = $(el), layout = $el.data("layout") || $el.data("parentLayout");
            if (layout) {
                var $cont = layout.container;
                if ($cont.data("layoutPane")) {
                    return $cont
                }
                var $pane = $cont.closest("." + $.layout.defaults.panes.paneClass);
                if ($pane.data("layoutPane")) {
                    return $pane
                }
            }
            return null
        },
        getParentPaneInstance: function (el) {
            var $pane = $.layout.getParentPaneElem(el);
            return $pane ? $pane.data("layoutPane") : null
        },
        getParentLayoutInstance: function (el) {
            var $pane = $.layout.getParentPaneElem(el);
            return $pane ? $pane.data("parentLayout") : null
        },
        getEventObject: function (evt) {
            return typeof evt === "object" && evt.stopPropagation ? evt : null
        },
        parsePaneName: function (evt_or_pane) {
            var evt = $.layout.getEventObject(evt_or_pane), pane = evt_or_pane;
            if (evt) {
                evt.stopPropagation();
                pane = $(this).data("layoutEdge")
            }
            if (pane && !/^(west|east|north|south|center)$/.test(pane)) {
                $.layout.msg('LAYOUT ERROR - Invalid pane-name: "' + pane + '"');
                pane = "error"
            }
            return pane
        },
        plugins: {
            draggable: !!$.fn.draggable,
            effects: {
                core: !!$.effects,
                slide: $.effects && ($.effects.slide || ($.effects.effect && $.effects.effect.slide))
            }
        },
        onCreate: [],
        onLoad: [],
        onReady: [],
        onDestroy: [],
        onUnload: [],
        afterOpen: [],
        afterClose: [],
        scrollbarWidth: function () {
            return window.scrollbarWidth || $.layout.getScrollbarSize("width")
        },
        scrollbarHeight: function () {
            return window.scrollbarHeight || $.layout.getScrollbarSize("height")
        },
        getScrollbarSize: function (dim) {
            var $c = $('<div style="position: absolute; top: -10000px; left: -10000px; width: 100px; height: 100px; overflow: scroll;"></div>').appendTo("body");
            var d = {width: $c.css("width") - $c[0].clientWidth, height: $c.height() - $c[0].clientHeight};
            $c.remove();
            window.scrollbarWidth = d.width;
            window.scrollbarHeight = d.height;
            return dim.match(/^(width|height)$/) ? d[dim] : d
        },
        showInvisibly: function ($E, force) {
            if ($E && $E.length && (force || $E.css("display") === "none")) {
                var s = $E[0].style, CSS = {display: s.display || "", visibility: s.visibility || ""};
                $E.css({display: "block", visibility: "hidden"});
                return CSS
            }
            return {}
        },
        getElementDimensions: function ($E, inset) {
            var d = {css: {}, inset: {}}, x = d.css, i = {bottom: 0}, N = $.layout.cssNum, off = $E.offset(), b, p, ei;
            d.offsetLeft = off.left;
            d.offsetTop = off.top;
            if (!inset) {
                inset = {}
            }
            $.each("Left,Right,Top,Bottom".split(","), function (idx, e) {
                b = x["border" + e] = $.layout.borderWidth($E, e);
                p = x["padding" + e] = $.layout.cssNum($E, "padding" + e);
                ei = e.toLowerCase();
                d.inset[ei] = inset[ei] >= 0 ? inset[ei] : p;
                i[ei] = d.inset[ei] + b
            });
            x.width = $E.width();
            x.height = $E.height();
            x.top = N($E, "top", true);
            x.bottom = N($E, "bottom", true);
            x.left = N($E, "left", true);
            x.right = N($E, "right", true);
            d.outerWidth = $E.outerWidth();
            d.outerHeight = $E.outerHeight();
            d.innerWidth = max(0, d.outerWidth - i.left - i.right);
            d.innerHeight = max(0, d.outerHeight - i.top - i.bottom);
            d.layoutWidth = $E.innerWidth();
            d.layoutHeight = $E.innerHeight();
            return d
        },
        getElementStyles: function ($E, list) {
            var CSS = {}, style = $E[0].style, props = list.split(","), sides = "Top,Bottom,Left,Right".split(","), attrs = "Color,Style,Width".split(","), p, s, a, i, j, k;
            for (i = 0; i < props.length; i++) {
                p = props[i];
                if (p.match(/(border|padding|margin)$/)) {
                    for (j = 0; j < 4; j++) {
                        s = sides[j];
                        if (p === "border") {
                            for (k = 0; k < 3; k++) {
                                a = attrs[k];
                                CSS[p + s + a] = style[p + s + a]
                            }
                        } else {
                            CSS[p + s] = style[p + s]
                        }
                    }
                } else {
                    CSS[p] = style[p]
                }
            }
            return CSS
        },
        cssWidth: function ($E, outerWidth) {
            if (outerWidth <= 0) {
                return 0
            }
            var bs = !$.layout.browser.boxModel ? "border-box" : $.support.boxSizing ? $E.css("boxSizing") : "content-box", b = $.layout.borderWidth, n = $.layout.cssNum, W = outerWidth;
            if (bs !== "border-box") {
                W -= (b($E, "Left") + b($E, "Right"))
            }
            if (bs === "content-box") {
                W -= (n($E, "paddingLeft") + n($E, "paddingRight"))
            }
            return max(0, W)
        },
        cssHeight: function ($E, outerHeight) {
            if (outerHeight <= 0) {
                return 0
            }
            var bs = !$.layout.browser.boxModel ? "border-box" : $.support.boxSizing ? $E.css("boxSizing") : "content-box", b = $.layout.borderWidth, n = $.layout.cssNum, H = outerHeight;
            if (bs !== "border-box") {
                H -= (b($E, "Top") + b($E, "Bottom"))
            }
            if (bs === "content-box") {
                H -= (n($E, "paddingTop") + n($E, "paddingBottom"))
            }
            return max(0, H)
        },
        cssNum: function ($E, prop, allowAuto) {
            if (!$E.jquery) {
                $E = $($E)
            }
            var CSS = $.layout.showInvisibly($E), p = $.css($E[0], prop, true), v = allowAuto && p == "auto" ? p : Math.round(parseFloat(p) || 0);
            $E.css(CSS);
            return v
        },
        borderWidth: function (el, side) {
            if (el.jquery) {
                el = el[0]
            }
            var b = "border" + side.substr(0, 1).toUpperCase() + side.substr(1);
            return $.css(el, b + "Style", true) === "none" ? 0 : Math.round(parseFloat($.css(el, b + "Width", true)) || 0)
        },
        isMouseOverElem: function (evt, el) {
            var $E = $(el || this), d = $E.offset(), T = d.top, L = d.left, R = L + $E.outerWidth(), B = T + $E.outerHeight(), x = evt.pageX, y = evt.pageY;
            return ($.layout.browser.msie && x < 0 && y < 0) || ((x >= L && x <= R) && (y >= T && y <= B))
        },
        msg: function (info, popup, debugTitle, debugOpts) {
            if ($.isPlainObject(info) && window.debugData) {
                if (typeof popup === "string") {
                    debugOpts = debugTitle;
                    debugTitle = popup
                } else {
                    if (typeof debugTitle === "object") {
                        debugOpts = debugTitle;
                        debugTitle = null
                    }
                }
                var t = debugTitle || "log( <object> )", o = $.extend({
                    sort: false,
                    returnHTML: false,
                    display: false
                }, debugOpts);
                if (popup === true || o.display) {
                    debugData(info, t, o)
                } else {
                    if (window.console) {
                        console.log(debugData(info, t, o))
                    }
                }
            } else {
                if (popup) {
                    alert(info)
                } else {
                    if (window.console) {
                        console.log(info)
                    } else {
                        var id = "#layoutLogger", $l = $(id);
                        if (!$l.length) {
                            $l = createLog()
                        }
                        $l.children("ul").append('<li style="padding: 4px 10px; margin: 0; border-top: 1px solid #CCC;">' + info.replace(/\</g, "&lt;").replace(/\>/g, "&gt;") + "</li>")
                    }
                }
            }
            function createLog() {
                var pos = $.support.fixedPosition ? "fixed" : "absolute", $e = $('<div id="layoutLogger" style="position: ' + pos + '; top: 5px; z-index: 999999; max-width: 25%; overflow: hidden; border: 1px solid #000; border-radius: 5px; background: #FBFBFB; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"><div style="font-size: 13px; font-weight: bold; padding: 5px 10px; background: #F6F6F6; border-radius: 5px 5px 0 0; cursor: move;"><span style="float: right; padding-left: 7px; cursor: pointer;" title="Remove Console" onclick="$(this).closest(\'#layoutLogger\').remove()">X</span>Layout console.log</div><ul style="font-size: 13px; font-weight: none; list-style: none; margin: 0; padding: 0 0 2px;"></ul></div>').appendTo("body");
                $e.css("left", $(window).width() - $e.outerWidth() - 5);
                if ($.ui.draggable) {
                    $e.draggable({handle: ":first-child"})
                }
                return $e
            }
        }
    };
    var u = navigator.userAgent.toLowerCase(), m = /(chrome)[ \/]([\w.]+)/.exec(u) || /(webkit)[ \/]([\w.]+)/.exec(u) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(u) || /(msie) ([\w.]+)/.exec(u) || u.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(u) || [], b = m[1] || "", v = m[2] || 0, ie = b === "msie";
    $.layout.browser = {
        version: v,
        safari: b === "webkit",
        webkit: b === "chrome",
        msie: ie,
        isIE6: ie && v == 6,
        boxModel: !ie || $.support.boxModel !== false
    };
    if (b) {
        $.layout.browser[b] = true
    }
    if (ie) {
        $(function () {
            $.layout.browser.boxModel = $.support.boxModel
        })
    }
    $.layout.defaults = {
        name: "",
        containerClass: "ui-layout-container",
        inset: null,
        scrollToBookmarkOnLoad: true,
        resizeWithWindow: true,
        resizeWithWindowDelay: 200,
        resizeWithWindowMaxDelay: 0,
        maskPanesEarly: false,
        onresizeall_start: null,
        onresizeall_end: null,
        onload_start: null,
        onload_end: null,
        onunload_start: null,
        onunload_end: null,
        initPanes: true,
        showErrorMessages: true,
        showDebugMessages: false,
        zIndex: null,
        zIndexes: {
            pane_normal: 0,
            content_mask: 1,
            resizer_normal: 2,
            pane_sliding: 100,
            pane_animate: 1000,
            resizer_drag: 10000
        },
        errors: {
            pane: "pane",
            selector: "selector",
            addButtonError: "Error Adding Button\nInvalid ",
            containerMissing: "UI Layout Initialization Error\nThe specified layout-container does not exist.",
            centerPaneMissing: "UI Layout Initialization Error\nThe center-pane element does not exist.\nThe center-pane is a required element.",
            noContainerHeight: "UI Layout Initialization Warning\nThe layout-container \"CONTAINER\" has no height.\nTherefore the layout is 0-height and hence 'invisible'!",
            callbackError: "UI Layout Callback Error\nThe EVENT callback is not a valid function."
        },
        panes: {
            applyDemoStyles: false,
            closable: true,
            resizable: true,
            slidable: true,
            initClosed: false,
            initHidden: false,
            contentSelector: ".ui-layout-content",
            contentIgnoreSelector: ".ui-layout-ignore",
            findNestedContent: false,
            paneClass: "ui-layout-pane",
            resizerClass: "ui-layout-resizer",
            togglerClass: "ui-layout-toggler",
            buttonClass: "ui-layout-button",
            minSize: 0,
            maxSize: 0,
            spacing_open: 6,
            spacing_closed: 6,
            togglerLength_open: 50,
            togglerLength_closed: 50,
            togglerAlign_open: "center",
            togglerAlign_closed: "center",
            togglerContent_open: "",
            togglerContent_closed: "",
            resizerDblClickToggle: true,
            autoResize: true,
            autoReopen: true,
            resizerDragOpacity: 1,
            maskContents: false,
            maskObjects: false,
            maskZindex: null,
            resizingGrid: false,
            livePaneResizing: false,
            liveContentResizing: false,
            liveResizingTolerance: 1,
            sliderCursor: "pointer",
            slideTrigger_open: "click",
            slideTrigger_close: "mouseleave",
            slideDelay_open: 300,
            slideDelay_close: 300,
            hideTogglerOnSlide: false,
            preventQuickSlideClose: $.layout.browser.webkit,
            preventPrematureSlideClose: false,
            tips: {
                Open: "Open",
                Close: "Close",
                Resize: "Resize",
                Slide: "Slide Open",
                Pin: "Pin",
                Unpin: "Un-Pin",
                noRoomToOpen: "Not enough room to show this panel.",
                minSizeWarning: "Panel has reached its minimum size",
                maxSizeWarning: "Panel has reached its maximum size"
            },
            showOverflowOnHover: false,
            enableCursorHotkey: true,
            customHotkeyModifier: "SHIFT",
            fxName: "slide",
            fxSpeed: null,
            fxSettings: {},
            fxOpacityFix: true,
            animatePaneSizing: false,
            children: null,
            containerSelector: "",
            initChildren: true,
            destroyChildren: true,
            resizeChildren: true,
            triggerEventsOnLoad: false,
            triggerEventsDuringLiveResize: true,
            onshow_start: null,
            onshow_end: null,
            onhide_start: null,
            onhide_end: null,
            onopen_start: null,
            onopen_end: null,
            onclose_start: null,
            onclose_end: null,
            onresize_start: null,
            onresize_end: null,
            onsizecontent_start: null,
            onsizecontent_end: null,
            onswap_start: null,
            onswap_end: null,
            ondrag_start: null,
            ondrag_end: null
        },
        north: {paneSelector: ".ui-layout-north", size: "auto", resizerCursor: "n-resize", customHotkey: ""},
        south: {paneSelector: ".ui-layout-south", size: "auto", resizerCursor: "s-resize", customHotkey: ""},
        east: {paneSelector: ".ui-layout-east", size: 200, resizerCursor: "e-resize", customHotkey: ""},
        west: {paneSelector: ".ui-layout-west", size: 200, resizerCursor: "w-resize", customHotkey: ""},
        center: {paneSelector: ".ui-layout-center", minWidth: 0, minHeight: 0}
    };
    $.layout.optionsMap = {
        layout: ("name,instanceKey,stateManagement,effects,inset,zIndexes,errors,zIndex,scrollToBookmarkOnLoad,showErrorMessages,maskPanesEarly,outset,resizeWithWindow,resizeWithWindowDelay,resizeWithWindowMaxDelay,onresizeall,onresizeall_start,onresizeall_end,onload,onload_start,onload_end,onunload,onunload_start,onunload_end").split(","),
        center: ("paneClass,contentSelector,contentIgnoreSelector,findNestedContent,applyDemoStyles,triggerEventsOnLoad,showOverflowOnHover,maskContents,maskObjects,liveContentResizing,containerSelector,children,initChildren,resizeChildren,destroyChildren,onresize,onresize_start,onresize_end,onsizecontent,onsizecontent_start,onsizecontent_end").split(","),
        noDefault: ("paneSelector,resizerCursor,customHotkey").split(",")
    };
    $.layout.transformData = function (hash, addKeys) {
        var json = addKeys ? {panes: {}, center: {}} : {}, branch, optKey, keys, key, val, i, c;
        if (typeof hash !== "object") {
            return json
        }
        for (optKey in hash) {
            branch = json;
            val = hash[optKey];
            keys = optKey.split("__");
            c = keys.length - 1;
            for (i = 0; i <= c; i++) {
                key = keys[i];
                if (i === c) {
                    if ($.isPlainObject(val)) {
                        branch[key] = $.layout.transformData(val)
                    } else {
                        branch[key] = val
                    }
                } else {
                    if (!branch[key]) {
                        branch[key] = {}
                    }
                    branch = branch[key]
                }
            }
        }
        return json
    };
    $.layout.backwardCompatibility = {
        map: {
            applyDefaultStyles: "applyDemoStyles",
            childOptions: "children",
            initChildLayout: "initChildren",
            destroyChildLayout: "destroyChildren",
            resizeChildLayout: "resizeChildren",
            resizeNestedLayout: "resizeChildren",
            resizeWhileDragging: "livePaneResizing",
            resizeContentWhileDragging: "liveContentResizing",
            triggerEventsWhileDragging: "triggerEventsDuringLiveResize",
            maskIframesOnResize: "maskContents",
            useStateCookie: "stateManagement.enabled",
            "cookie.autoLoad": "stateManagement.autoLoad",
            "cookie.autoSave": "stateManagement.autoSave",
            "cookie.keys": "stateManagement.stateKeys",
            "cookie.name": "stateManagement.cookie.name",
            "cookie.domain": "stateManagement.cookie.domain",
            "cookie.path": "stateManagement.cookie.path",
            "cookie.expires": "stateManagement.cookie.expires",
            "cookie.secure": "stateManagement.cookie.secure",
            noRoomToOpenTip: "tips.noRoomToOpen",
            togglerTip_open: "tips.Close",
            togglerTip_closed: "tips.Open",
            resizerTip: "tips.Resize",
            sliderTip: "tips.Slide"
        }, renameOptions: function (opts) {
            var map = $.layout.backwardCompatibility.map, oldData, newData, value;
            for (var itemPath in map) {
                oldData = getBranch(itemPath);
                value = oldData.branch[oldData.key];
                if (value !== undefined) {
                    newData = getBranch(map[itemPath], true);
                    newData.branch[newData.key] = value;
                    delete oldData.branch[oldData.key]
                }
            }
            function getBranch(path, create) {
                var a = path.split("."), c = a.length - 1, D = {branch: opts, key: a[c]}, i = 0, k, undef;
                for (; i < c; i++) {
                    k = a[i];
                    if (D.branch[k] == undefined) {
                        if (create) {
                            D.branch = D.branch[k] = {}
                        } else {
                            D.branch = {}
                        }
                    } else {
                        D.branch = D.branch[k]
                    }
                }
                return D
            }
        }, renameAllOptions: function (opts) {
            var ren = $.layout.backwardCompatibility.renameOptions;
            ren(opts);
            if (opts.defaults) {
                if (typeof opts.panes !== "object") {
                    opts.panes = {}
                }
                $.extend(true, opts.panes, opts.defaults);
                delete opts.defaults
            }
            if (opts.panes) {
                ren(opts.panes)
            }
            $.each($.layout.config.allPanes, function (i, pane) {
                if (opts[pane]) {
                    ren(opts[pane])
                }
            });
            return opts
        }
    };
    $.fn.layout = function (opts) {
        var browser = $.layout.browser, _c = $.layout.config, cssW = $.layout.cssWidth, cssH = $.layout.cssHeight, elDims = $.layout.getElementDimensions, styles = $.layout.getElementStyles, evtObj = $.layout.getEventObject, evtPane = $.layout.parsePaneName, options = $.extend(true, {}, $.layout.defaults), effects = options.effects = $.extend(true, {}, $.layout.effects), state = {
            id: "layout" + $.now(),
            initialized: false,
            paneResizing: false,
            panesSliding: {},
            container: {innerWidth: 0, innerHeight: 0, outerWidth: 0, outerHeight: 0, layoutWidth: 0, layoutHeight: 0},
            north: {childIdx: 0},
            south: {childIdx: 0},
            east: {childIdx: 0},
            west: {childIdx: 0},
            center: {childIdx: 0}
        }, children = {north: null, south: null, east: null, west: null, center: null}, timer = {
            data: {},
            set: function (s, fn, ms) {
                timer.clear(s);
                timer.data[s] = setTimeout(fn, ms)
            },
            clear: function (s) {
                var t = timer.data;
                if (t[s]) {
                    clearTimeout(t[s]);
                    delete t[s]
                }
            }
        }, _log = function (msg, popup, debug) {
            var o = options;
            if ((o.showErrorMessages && !debug) || (debug && o.showDebugMessages)) {
                $.layout.msg(o.name + " / " + msg, (popup !== false))
            }
            return false
        }, _runCallbacks = function (evtName, pane, skipBoundEvents) {
            var hasPane = pane && isStr(pane), s = hasPane ? state[pane] : state, o = hasPane ? options[pane] : options, lName = options.name, lng = evtName + (evtName.match(/_/) ? "" : "_end"), shrt = lng.match(/_end$/) ? lng.substr(0, lng.length - 4) : "", fn = o[lng] || o[shrt], retVal = "NC", args = [], $P;
            if (!hasPane && $.type(pane) === "boolean") {
                skipBoundEvents = pane;
                pane = ""
            }
            if (fn) {
                try {
                    if (isStr(fn)) {
                        if (fn.match(/,/)) {
                            args = fn.split(","), fn = eval(args[0])
                        } else {
                            fn = eval(fn)
                        }
                    }
                    if ($.isFunction(fn)) {
                        if (args.length) {
                            retVal = g(fn)(args[1])
                        } else {
                            if (hasPane) {
                                retVal = g(fn)(pane, $Ps[pane], s, o, lName)
                            } else {
                                retVal = g(fn)(Instance, s, o, lName)
                            }
                        }
                    }
                } catch (ex) {
                    _log(options.errors.callbackError.replace(/EVENT/, $.trim((pane || "") + " " + lng)), false);
                    if ($.type(ex) === "string" && string.length) {
                        _log("Exception:  " + ex, false)
                    }
                }
            }
            if (!skipBoundEvents && retVal !== false) {
                if (hasPane) {
                    $P = $Ps[pane];
                    o = options[pane];
                    s = state[pane];
                    $P.triggerHandler("layoutpane" + lng, [pane, $P, s, o, lName]);
                    if (shrt) {
                        $P.triggerHandler("layoutpane" + shrt, [pane, $P, s, o, lName])
                    }
                } else {
                    $N.triggerHandler("layout" + lng, [Instance, s, o, lName]);
                    if (shrt) {
                        $N.triggerHandler("layout" + shrt, [Instance, s, o, lName])
                    }
                }
            }
            if (hasPane && evtName === "onresize_end") {
                resizeChildren(pane + "", true)
            }
            return retVal;
            function g(f) {
                return f
            }
        }, _fixIframe = function (pane) {
            if (browser.mozilla) {
                return
            }
            var $P = $Ps[pane];
            if (state[pane].tagName === "IFRAME") {
                $P.css(_c.hidden).css(_c.visible)
            } else {
                $P.find("IFRAME").css(_c.hidden).css(_c.visible)
            }
        }, cssSize = function (pane, outerSize) {
            var fn = _c[pane].dir == "horz" ? cssH : cssW;
            return fn($Ps[pane], outerSize)
        }, cssMinDims = function (pane) {
            var $P = $Ps[pane], dir = _c[pane].dir, d = {
                minWidth: 1001 - cssW($P, 1000),
                minHeight: 1001 - cssH($P, 1000)
            };
            if (dir === "horz") {
                d.minSize = d.minHeight
            }
            if (dir === "vert") {
                d.minSize = d.minWidth
            }
            return d
        }, setOuterWidth = function (el, outerWidth, autoHide) {
            var $E = el, w;
            if (isStr(el)) {
                $E = $Ps[el]
            } else {
                if (!el.jquery) {
                    $E = $(el)
                }
            }
            w = cssW($E, outerWidth);
            $E.css({width: w});
            if (w > 0) {
                if (autoHide && $E.data("autoHidden") && $E.innerHeight() > 0) {
                    $E.show().data("autoHidden", false);
                    if (!browser.mozilla) {
                        $E.css(_c.hidden).css(_c.visible)
                    }
                }
            } else {
                if (autoHide && !$E.data("autoHidden")) {
                    $E.hide().data("autoHidden", true)
                }
            }
        }, setOuterHeight = function (el, outerHeight, autoHide) {
            var $E = el, h;
            if (isStr(el)) {
                $E = $Ps[el]
            } else {
                if (!el.jquery) {
                    $E = $(el)
                }
            }
            h = cssH($E, outerHeight);
            $E.css({height: h, visibility: "visible"});
            if (h > 0 && $E.innerWidth() > 0) {
                if (autoHide && $E.data("autoHidden")) {
                    $E.show().data("autoHidden", false);
                    if (!browser.mozilla) {
                        $E.css(_c.hidden).css(_c.visible)
                    }
                }
            } else {
                if (autoHide && !$E.data("autoHidden")) {
                    $E.hide().data("autoHidden", true)
                }
            }
        }, _parseSize = function (pane, size, dir) {
            if (!dir) {
                dir = _c[pane].dir
            }
            if (isStr(size) && size.match(/%/)) {
                size = (size === "100%") ? -1 : parseInt(size, 10) / 100
            }
            if (size === 0) {
                return 0
            } else {
                if (size >= 1) {
                    return parseInt(size, 10)
                }
            }
            var o = options, avail = 0;
            if (dir == "horz") {
                avail = sC.innerHeight - ($Ps.north ? o.north.spacing_open : 0) - ($Ps.south ? o.south.spacing_open : 0)
            } else {
                if (dir == "vert") {
                    avail = sC.innerWidth - ($Ps.west ? o.west.spacing_open : 0) - ($Ps.east ? o.east.spacing_open : 0)
                }
            }
            if (size === -1) {
                return avail
            } else {
                if (size > 0) {
                    return round(avail * size)
                } else {
                    if (pane == "center") {
                        return 0
                    } else {
                        var dim = (dir === "horz" ? "height" : "width"), $P = $Ps[pane], $C = dim === "height" ? $Cs[pane] : false, vis = $.layout.showInvisibly($P), szP = $P.css(dim), szC = $C ? $C.css(dim) : 0;
                        $P.css(dim, "auto");
                        if ($C) {
                            $C.css(dim, "auto")
                        }
                        size = (dim === "height") ? $P.outerHeight() : $P.outerWidth();
                        $P.css(dim, szP).css(vis);
                        if ($C) {
                            $C.css(dim, szC)
                        }
                        return size
                    }
                }
            }
        }, getPaneSize = function (pane, inclSpace) {
            var $P = $Ps[pane], o = options[pane], s = state[pane], oSp = (inclSpace ? o.spacing_open : 0), cSp = (inclSpace ? o.spacing_closed : 0);
            if (!$P || s.isHidden) {
                return 0
            } else {
                if (s.isClosed || (s.isSliding && inclSpace)) {
                    return cSp
                } else {
                    if (_c[pane].dir === "horz") {
                        return $P.outerHeight() + oSp
                    } else {
                        return $P.outerWidth() + oSp
                    }
                }
            }
        }, setSizeLimits = function (pane, slide) {
            if (!isInitialized()) {
                return
            }
            var o = options[pane], s = state[pane], c = _c[pane], dir = c.dir, type = c.sizeType.toLowerCase(), isSliding = (slide != undefined ? slide : s.isSliding), $P = $Ps[pane], paneSpacing = o.spacing_open, altPane = _c.oppositeEdge[pane], altS = state[altPane], $altP = $Ps[altPane], altPaneSize = (!$altP || altS.isVisible === false || altS.isSliding ? 0 : (dir == "horz" ? $altP.outerHeight() : $altP.outerWidth())), altPaneSpacing = ((!$altP || altS.isHidden ? 0 : options[altPane][altS.isClosed !== false ? "spacing_closed" : "spacing_open"]) || 0), containerSize = (dir == "horz" ? sC.innerHeight : sC.innerWidth), minCenterDims = cssMinDims("center"), minCenterSize = dir == "horz" ? max(options.center.minHeight, minCenterDims.minHeight) : max(options.center.minWidth, minCenterDims.minWidth), limitSize = (containerSize - paneSpacing - (isSliding ? 0 : (_parseSize("center", minCenterSize, dir) + altPaneSize + altPaneSpacing))), minSize = s.minSize = max(_parseSize(pane, o.minSize), cssMinDims(pane).minSize), maxSize = s.maxSize = min((o.maxSize ? _parseSize(pane, o.maxSize) : 100000), limitSize), r = s.resizerPosition = {}, top = sC.inset.top, left = sC.inset.left, W = sC.innerWidth, H = sC.innerHeight, rW = o.spacing_open;
            switch (pane) {
                case"north":
                    r.min = top + minSize;
                    r.max = top + maxSize;
                    break;
                case"west":
                    r.min = left + minSize;
                    r.max = left + maxSize;
                    break;
                case"south":
                    r.min = top + H - maxSize - rW;
                    r.max = top + H - minSize - rW;
                    break;
                case"east":
                    r.min = left + W - maxSize - rW;
                    r.max = left + W - minSize - rW;
                    break
            }
        }, calcNewCenterPaneDims = function () {
            var d = {
                top: getPaneSize("north", true),
                bottom: getPaneSize("south", true),
                left: getPaneSize("west", true),
                right: getPaneSize("east", true),
                width: 0,
                height: 0
            };
            d.width = sC.innerWidth - d.left - d.right;
            d.height = sC.innerHeight - d.bottom - d.top;
            d.top += sC.inset.top;
            d.bottom += sC.inset.bottom;
            d.left += sC.inset.left;
            d.right += sC.inset.right;
            return d
        }, getHoverClasses = function (el, allStates) {
            var $El = $(el), type = $El.data("layoutRole"), pane = $El.data("layoutEdge"), o = options[pane], root = o[type + "Class"], _pane = "-" + pane, _open = "-open", _closed = "-closed", _slide = "-sliding", _hover = "-hover ", _state = $El.hasClass(root + _closed) ? _closed : _open, _alt = _state === _closed ? _open : _closed, classes = (root + _hover) + (root + _pane + _hover) + (root + _state + _hover) + (root + _pane + _state + _hover);
            if (allStates) {
                classes += (root + _alt + _hover) + (root + _pane + _alt + _hover)
            }
            if (type == "resizer" && $El.hasClass(root + _slide)) {
                classes += (root + _slide + _hover) + (root + _pane + _slide + _hover)
            }
            return $.trim(classes)
        }, addHover = function (evt, el) {
            var $E = $(el || this);
            if (evt && $E.data("layoutRole") === "toggler") {
                evt.stopPropagation()
            }
            $E.addClass(getHoverClasses($E))
        }, removeHover = function (evt, el) {
            var $E = $(el || this);
            $E.removeClass(getHoverClasses($E, true))
        }, onResizerEnter = function (evt) {
            var pane = $(this).data("layoutEdge"), s = state[pane];
            if (s.isClosed || s.isResizing || state.paneResizing) {
                return
            }
            if ($.fn.disableSelection) {
                $("body").disableSelection()
            }
            if (options.maskPanesEarly) {
                showMasks(pane, {resizing: true})
            }
        }, onResizerLeave = function (evt, el) {
            var e = el || this, pane = $(e).data("layoutEdge"), name = pane + "ResizerLeave";
            timer.clear(pane + "_openSlider");
            timer.clear(name);
            if (!el) {
                timer.set(name, function () {
                    onResizerLeave(evt, e)
                }, 200)
            } else {
                if (!state.paneResizing) {
                    if ($.fn.enableSelection) {
                        $("body").enableSelection()
                    }
                    if (options.maskPanesEarly) {
                        hideMasks()
                    }
                }
            }
        }, _create = function () {
            initOptions();
            var o = options, s = state;
            s.creatingLayout = true;
            runPluginCallbacks(Instance, $.layout.onCreate);
            if (false === _runCallbacks("onload_start")) {
                return "cancel"
            }
            _initContainer();
            initHotkeys();
            $(window).bind("unload." + sID, unload);
            runPluginCallbacks(Instance, $.layout.onLoad);
            if (o.initPanes) {
                _initLayoutElements()
            }
            delete s.creatingLayout;
            return state.initialized
        }, isInitialized = function () {
            if (state.initialized || state.creatingLayout) {
                return true
            } else {
                return _initLayoutElements()
            }
        }, _initLayoutElements = function (retry) {
            var o = options;
            if (!$N.is(":visible")) {
                if (!retry && browser.webkit && $N[0].tagName === "BODY") {
                    setTimeout(function () {
                        _initLayoutElements(true)
                    }, 50)
                }
                return false
            }
            if (!getPane("center").length) {
                return _log(o.errors.centerPaneMissing)
            }
            state.creatingLayout = true;
            $.extend(sC, elDims($N, o.inset));
            initPanes();
            if (o.scrollToBookmarkOnLoad) {
                var l = self.location;
                if (l.hash) {
                    l.replace(l.hash)
                }
            }
            if (Instance.hasParentLayout) {
                o.resizeWithWindow = false
            } else {
                if (o.resizeWithWindow) {
                    $(window).bind("resize." + sID, windowResize)
                }
            }
            delete state.creatingLayout;
            state.initialized = true;
            runPluginCallbacks(Instance, $.layout.onReady);
            _runCallbacks("onload_end");
            return true
        }, createChildren = function (evt_or_pane, opts) {
            var pane = evtPane.call(this, evt_or_pane), $P = $Ps[pane];
            if (!$P) {
                return
            }
            var $C = $Cs[pane], s = state[pane], o = options[pane], sm = options.stateManagement || {}, cos = opts ? (o.children = opts) : o.children;
            if ($.isPlainObject(cos)) {
                cos = [cos]
            } else {
                if (!cos || !$.isArray(cos)) {
                    return
                }
            }
            $.each(cos, function (idx, co) {
                if (!$.isPlainObject(co)) {
                    return
                }
                var $containers = co.containerSelector ? $P.find(co.containerSelector) : ($C || $P);
                $containers.each(function () {
                    var $cont = $(this), child = $cont.data("layout");
                    if (!child) {
                        setInstanceKey({container: $cont, options: co}, s);
                        if (sm.includeChildren && state.stateData[pane]) {
                            var paneChildren = state.stateData[pane].children || {}, childState = paneChildren[co.instanceKey], co_sm = co.stateManagement || (co.stateManagement = {autoLoad: true});
                            if (co_sm.autoLoad === true && childState) {
                                co_sm.autoSave = false;
                                co_sm.includeChildren = true;
                                co_sm.autoLoad = $.extend(true, {}, childState)
                            }
                        }
                        child = $cont.layout(co);
                        if (child) {
                            refreshChildren(pane, child)
                        }
                    }
                })
            })
        }, setInstanceKey = function (child, parentPaneState) {
            var $c = child.container, o = child.options, sm = o.stateManagement, key = o.instanceKey || $c.data("layoutInstanceKey");
            if (!key) {
                key = (sm && sm.cookie ? sm.cookie.name : "") || o.name
            }
            if (!key) {
                key = "layout" + (++parentPaneState.childIdx)
            } else {
                key = key.replace(/[^\w-]/gi, "_").replace(/_{2,}/g, "_")
            }
            o.instanceKey = key;
            $c.data("layoutInstanceKey", key);
            return key
        }, refreshChildren = function (pane, newChild) {
            var $P = $Ps[pane], pC = children[pane], s = state[pane], o;
            if ($.isPlainObject(pC)) {
                $.each(pC, function (key, child) {
                    if (child.destroyed) {
                        delete pC[key]
                    }
                });
                if ($.isEmptyObject(pC)) {
                    pC = children[pane] = null
                }
            }
            if (!newChild && !pC) {
                newChild = $P.data("layout")
            }
            if (newChild) {
                newChild.hasParentLayout = true;
                o = newChild.options;
                setInstanceKey(newChild, s);
                if (!pC) {
                    pC = children[pane] = {}
                }
                pC[o.instanceKey] = newChild.container.data("layout")
            }
            Instance[pane].children = children[pane];
            if (!newChild) {
                createChildren(pane)
            }
        }, windowResize = function () {
            var o = options, delay = Number(o.resizeWithWindowDelay);
            if (delay < 10) {
                delay = 100
            }
            timer.clear("winResize");
            timer.set("winResize", function () {
                timer.clear("winResize");
                timer.clear("winResizeRepeater");
                var dims = elDims($N, o.inset);
                if (dims.innerWidth !== sC.innerWidth || dims.innerHeight !== sC.innerHeight) {
                    resizeAll()
                }
            }, delay);
            if (!timer.data.winResizeRepeater) {
                setWindowResizeRepeater()
            }
        }, setWindowResizeRepeater = function () {
            var delay = Number(options.resizeWithWindowMaxDelay);
            if (delay > 0) {
                timer.set("winResizeRepeater", function () {
                    setWindowResizeRepeater();
                    resizeAll()
                }, delay)
            }
        }, unload = function () {
            var o = options;
            _runCallbacks("onunload_start");
            runPluginCallbacks(Instance, $.layout.onUnload);
            _runCallbacks("onunload_end")
        }, _initContainer = function () {
            var N = $N[0], $H = $("html"), tag = sC.tagName = N.tagName, id = sC.id = N.id, cls = sC.className = N.className, o = options, name = o.name, props = "position,margin,padding,border", css = "layoutCSS", CSS = {}, hid = "hidden", parent = $N.data("parentLayout"), pane = $N.data("layoutEdge"), isChild = parent && pane, num = $.layout.cssNum, $parent, n;
            sC.selector = $N.selector.split(".slice")[0];
            sC.ref = (o.name ? o.name + " layout / " : "") + tag + (id ? "#" + id : cls ? ".[" + cls + "]" : "");
            sC.isBody = (tag === "BODY");
            if (!isChild && !sC.isBody) {
                $parent = $N.closest("." + $.layout.defaults.panes.paneClass);
                parent = $parent.data("parentLayout");
                pane = $parent.data("layoutEdge");
                isChild = parent && pane
            }
            $N.data({layout: Instance, layoutContainer: sID}).addClass(o.containerClass);
            var layoutMethods = {destroy: "", initPanes: "", resizeAll: "resizeAll", resize: "resizeAll"};
            for (name in layoutMethods) {
                $N.bind("layout" + name.toLowerCase() + "." + sID, Instance[layoutMethods[name] || name])
            }
            if (isChild) {
                Instance.hasParentLayout = true;
                parent.refreshChildren(pane, Instance)
            }
            if (!$N.data(css)) {
                if (sC.isBody) {
                    $N.data(css, $.extend(styles($N, props), {
                        height: $N.css("height"),
                        overflow: $N.css("overflow"),
                        overflowX: $N.css("overflowX"),
                        overflowY: $N.css("overflowY")
                    }));
                    $H.data(css, $.extend(styles($H, "padding"), {
                        height: "auto",
                        overflow: $H.css("overflow"),
                        overflowX: $H.css("overflowX"),
                        overflowY: $H.css("overflowY")
                    }))
                } else {
                    $N.data(css, styles($N, props + ",top,bottom,left,right,width,height,overflow,overflowX,overflowY"))
                }
            }
            try {
                CSS = {overflow: hid, overflowX: hid, overflowY: hid};
                $N.css(CSS);
                if (o.inset && !$.isPlainObject(o.inset)) {
                    n = parseInt(o.inset, 10) || 0;
                    o.inset = {top: n, bottom: n, left: n, right: n}
                }
                if (sC.isBody) {
                    if (!o.outset) {
                        o.outset = {
                            top: num($H, "paddingTop"),
                            bottom: num($H, "paddingBottom"),
                            left: num($H, "paddingLeft"),
                            right: num($H, "paddingRight")
                        }
                    } else {
                        if (!$.isPlainObject(o.outset)) {
                            n = parseInt(o.outset, 10) || 0;
                            o.outset = {top: n, bottom: n, left: n, right: n}
                        }
                    }
                    $H.css(CSS).css({height: "100%", border: "none", padding: 0, margin: 0});
                    if (browser.isIE6) {
                        $N.css({
                            width: "100%",
                            height: "100%",
                            border: "none",
                            padding: 0,
                            margin: 0,
                            position: "relative"
                        });
                        if (!o.inset) {
                            o.inset = elDims($N).inset
                        }
                    } else {
                        $N.css({width: "auto", height: "auto", margin: 0, position: "absolute"});
                        $N.css(o.outset)
                    }
                    $.extend(sC, elDims($N, o.inset))
                } else {
                    var p = $N.css("position");
                    if (!p || !p.match(/(fixed|absolute|relative)/)) {
                        $N.css("position", "relative")
                    }
                    if ($N.is(":visible")) {
                        $.extend(sC, elDims($N, o.inset));
                        if (sC.innerHeight < 1) {
                            _log(o.errors.noContainerHeight.replace(/CONTAINER/, sC.ref))
                        }
                    }
                }
                if (num($N, "minWidth")) {
                    $N.parent().css("overflowX", "auto")
                }
                if (num($N, "minHeight")) {
                    $N.parent().css("overflowY", "auto")
                }
            } catch (ex) {
            }
        }, initHotkeys = function (panes) {
            panes = panes ? panes.split(",") : _c.borderPanes;
            $.each(panes, function (i, pane) {
                var o = options[pane];
                if (o.enableCursorHotkey || o.customHotkey) {
                    $(document).bind("keydown." + sID, keyDown);
                    return false
                }
            })
        }, initOptions = function () {
            var data, d, pane, key, val, i, c, o;
            opts = $.layout.transformData(opts, true);
            opts = $.layout.backwardCompatibility.renameAllOptions(opts);
            if (!$.isEmptyObject(opts.panes)) {
                data = $.layout.optionsMap.noDefault;
                for (i = 0, c = data.length; i < c; i++) {
                    key = data[i];
                    delete opts.panes[key]
                }
                data = $.layout.optionsMap.layout;
                for (i = 0, c = data.length; i < c; i++) {
                    key = data[i];
                    delete opts.panes[key]
                }
            }
            data = $.layout.optionsMap.layout;
            var rootKeys = $.layout.config.optionRootKeys;
            for (key in opts) {
                val = opts[key];
                if ($.inArray(key, rootKeys) < 0 && $.inArray(key, data) < 0) {
                    if (!opts.panes[key]) {
                        opts.panes[key] = $.isPlainObject(val) ? $.extend(true, {}, val) : val
                    }
                    delete opts[key]
                }
            }
            $.extend(true, options, opts);
            $.each(_c.allPanes, function (i, pane) {
                _c[pane] = $.extend(true, {}, _c.panes, _c[pane]);
                d = options.panes;
                o = options[pane];
                if (pane === "center") {
                    data = $.layout.optionsMap.center;
                    for (i = 0, c = data.length; i < c; i++) {
                        key = data[i];
                        if (!opts.center[key] && (opts.panes[key] || !o[key])) {
                            o[key] = d[key]
                        }
                    }
                } else {
                    o = options[pane] = $.extend(true, {}, d, o);
                    createFxOptions(pane);
                    if (!o.resizerClass) {
                        o.resizerClass = "ui-layout-resizer"
                    }
                    if (!o.togglerClass) {
                        o.togglerClass = "ui-layout-toggler"
                    }
                }
                if (!o.paneClass) {
                    o.paneClass = "ui-layout-pane"
                }
            });
            var zo = opts.zIndex, z = options.zIndexes;
            if (zo > 0) {
                z.pane_normal = zo;
                z.content_mask = max(zo + 1, z.content_mask);
                z.resizer_normal = max(zo + 2, z.resizer_normal)
            }
            delete options.panes;
            function createFxOptions(pane) {
                var o = options[pane], d = options.panes;
                if (!o.fxSettings) {
                    o.fxSettings = {}
                }
                if (!d.fxSettings) {
                    d.fxSettings = {}
                }
                $.each(["_open", "_close", "_size"], function (i, n) {
                    var sName = "fxName" + n, sSpeed = "fxSpeed" + n, sSettings = "fxSettings" + n, fxName = o[sName] = o[sName] || d[sName] || o.fxName || d.fxName || "none", fxExists = $.effects && ($.effects[fxName] || ($.effects.effect && $.effects.effect[fxName]));
                    if (fxName === "none" || !options.effects[fxName] || !fxExists) {
                        fxName = o[sName] = "none"
                    }
                    var fx = options.effects[fxName] || {}, fx_all = fx.all || null, fx_pane = fx[pane] || null;
                    o[sSpeed] = o[sSpeed] || d[sSpeed] || o.fxSpeed || d.fxSpeed || null;
                    o[sSettings] = $.extend(true, {}, fx_all, fx_pane, d.fxSettings, o.fxSettings, d[sSettings], o[sSettings])
                });
                delete o.fxName;
                delete o.fxSpeed;
                delete o.fxSettings
            }
        }, getPane = function (pane) {
            var sel = options[pane].paneSelector;
            if (sel.substr(0, 1) === "#") {
                return $N.find(sel).eq(0)
            } else {
                var $P = $N.children(sel).eq(0);
                return $P.length ? $P : $N.children("form:first").children(sel).eq(0)
            }
        }, initPanes = function (evt) {
            evtPane(evt);
            $.each(_c.allPanes, function (idx, pane) {
                addPane(pane, true)
            });
            initHandles();
            $.each(_c.borderPanes, function (i, pane) {
                if ($Ps[pane] && state[pane].isVisible) {
                    setSizeLimits(pane);
                    makePaneFit(pane)
                }
            });
            sizeMidPanes("center");
            $.each(_c.allPanes, function (idx, pane) {
                afterInitPane(pane)
            })
        }, addPane = function (pane, force) {
            if (!force && !isInitialized()) {
                return
            }
            var o = options[pane], s = state[pane], c = _c[pane], dir = c.dir, fx = s.fx, spacing = o.spacing_open || 0, isCenter = (pane === "center"), CSS = {}, $P = $Ps[pane], size, minSize, maxSize, child;
            if ($P) {
                removePane(pane, false, true, false)
            } else {
                $Cs[pane] = false
            }
            $P = $Ps[pane] = getPane(pane);
            if (!$P.length) {
                $Ps[pane] = false;
                return
            }
            if (!$P.data("layoutCSS")) {
                var props = "position,top,left,bottom,right,width,height,overflow,zIndex,display,backgroundColor,padding,margin,border";
                $P.data("layoutCSS", styles($P, props))
            }
            Instance[pane] = {
                name: pane,
                pane: $Ps[pane],
                content: $Cs[pane],
                options: options[pane],
                state: state[pane],
                children: children[pane]
            };
            $P.data({
                parentLayout: Instance,
                layoutPane: Instance[pane],
                layoutEdge: pane,
                layoutRole: "pane"
            }).css(c.cssReq).css("zIndex", options.zIndexes.pane_normal).css(o.applyDemoStyles ? c.cssDemo : {}).addClass(o.paneClass + " " + o.paneClass + "-" + pane).bind("mouseenter." + sID, addHover).bind("mouseleave." + sID, removeHover);
            var paneMethods = {
                hide: "",
                show: "",
                toggle: "",
                close: "",
                open: "",
                slideOpen: "",
                slideClose: "",
                slideToggle: "",
                size: "sizePane",
                sizePane: "sizePane",
                sizeContent: "",
                sizeHandles: "",
                enableClosable: "",
                disableClosable: "",
                enableSlideable: "",
                disableSlideable: "",
                enableResizable: "",
                disableResizable: "",
                swapPanes: "swapPanes",
                swap: "swapPanes",
                move: "swapPanes",
                removePane: "removePane",
                remove: "removePane",
                createChildren: "",
                resizeChildren: "",
                resizeAll: "resizeAll",
                resizeLayout: "resizeAll"
            }, name;
            for (name in paneMethods) {
                $P.bind("layoutpane" + name.toLowerCase() + "." + sID, Instance[paneMethods[name] || name])
            }
            initContent(pane, false);
            if (!isCenter) {
                size = s.size = _parseSize(pane, o.size);
                minSize = _parseSize(pane, o.minSize) || 1;
                maxSize = _parseSize(pane, o.maxSize) || 100000;
                if (size > 0) {
                    size = max(min(size, maxSize), minSize)
                }
                s.autoResize = o.autoResize;
                s.isClosed = false;
                s.isSliding = false;
                s.isResizing = false;
                s.isHidden = false;
                if (!s.pins) {
                    s.pins = []
                }
            }
            s.tagName = $P[0].tagName;
            s.edge = pane;
            s.noRoom = false;
            s.isVisible = true;
            setPanePosition(pane);
            if (dir === "horz") {
                CSS.height = cssH($P, size)
            } else {
                if (dir === "vert") {
                    CSS.width = cssW($P, size)
                }
            }
            $P.css(CSS);
            if (dir != "horz") {
                sizeMidPanes(pane, true)
            }
            if (state.initialized) {
                initHandles(pane);
                initHotkeys(pane)
            }
            if (o.initClosed && o.closable && !o.initHidden) {
                close(pane, true, true)
            } else {
                if (o.initHidden || o.initClosed) {
                    hide(pane)
                } else {
                    if (!s.noRoom) {
                        $P.css("display", "block")
                    }
                }
            }
            $P.css("visibility", "visible");
            if (o.showOverflowOnHover) {
                $P.hover(allowOverflow, resetOverflow)
            }
            if (state.initialized) {
                afterInitPane(pane)
            }
        }, afterInitPane = function (pane) {
            var $P = $Ps[pane], s = state[pane], o = options[pane];
            if (!$P) {
                return
            }
            if ($P.data("layout")) {
                refreshChildren(pane, $P.data("layout"))
            }
            if (s.isVisible) {
                if (state.initialized) {
                    resizeAll()
                } else {
                    sizeContent(pane)
                }
                if (o.triggerEventsOnLoad) {
                    _runCallbacks("onresize_end", pane)
                } else {
                    resizeChildren(pane, true)
                }
            }
            if (o.initChildren && o.children) {
                createChildren(pane)
            }
        }, setPanePosition = function (panes) {
            panes = panes ? panes.split(",") : _c.borderPanes;
            $.each(panes, function (i, pane) {
                var $P = $Ps[pane], $R = $Rs[pane], o = options[pane], s = state[pane], side = _c[pane].side, CSS = {};
                if (!$P) {
                    return
                }
                switch (pane) {
                    case"north":
                        CSS.top = sC.inset.top;
                        CSS.left = sC.inset.left;
                        CSS.right = sC.inset.right;
                        break;
                    case"south":
                        CSS.bottom = sC.inset.bottom;
                        CSS.left = sC.inset.left;
                        CSS.right = sC.inset.right;
                        break;
                    case"west":
                        CSS.left = sC.inset.left;
                        break;
                    case"east":
                        CSS.right = sC.inset.right;
                        break;
                    case"center":
                }
                $P.css(CSS);
                if ($R && s.isClosed) {
                    $R.css(side, sC.inset[side])
                } else {
                    if ($R && !s.isHidden) {
                        $R.css(side, sC.inset[side] + getPaneSize(pane))
                    }
                }
            })
        }, initHandles = function (panes) {
            panes = panes ? panes.split(",") : _c.borderPanes;
            $.each(panes, function (i, pane) {
                var $P = $Ps[pane];
                $Rs[pane] = false;
                $Ts[pane] = false;
                if (!$P) {
                    return
                }
                var o = options[pane], s = state[pane], c = _c[pane], paneId = o.paneSelector.substr(0, 1) === "#" ? o.paneSelector.substr(1) : "", rClass = o.resizerClass, tClass = o.togglerClass, spacing = (s.isVisible ? o.spacing_open : o.spacing_closed), _pane = "-" + pane, _state = (s.isVisible ? "-open" : "-closed"), I = Instance[pane], $R = I.resizer = $Rs[pane] = $("<div></div>"), $T = I.toggler = (o.closable ? $Ts[pane] = $("<div></div>") : false);
                if (!s.isVisible && o.slidable) {
                    $R.attr("title", o.tips.Slide).css("cursor", o.sliderCursor)
                }
                $R.attr("id", paneId ? paneId + "-resizer" : "").data({
                    parentLayout: Instance,
                    layoutPane: Instance[pane],
                    layoutEdge: pane,
                    layoutRole: "resizer"
                }).css(_c.resizers.cssReq).css("zIndex", options.zIndexes.resizer_normal).css(o.applyDemoStyles ? _c.resizers.cssDemo : {}).addClass(rClass + " " + rClass + _pane).hover(addHover, removeHover).hover(onResizerEnter, onResizerLeave).appendTo($N);
                if (o.resizerDblClickToggle) {
                    $R.bind("dblclick." + sID, toggle)
                }
                if ($T) {
                    $T.attr("id", paneId ? paneId + "-toggler" : "").data({
                        parentLayout: Instance,
                        layoutPane: Instance[pane],
                        layoutEdge: pane,
                        layoutRole: "toggler"
                    }).css(_c.togglers.cssReq).css(o.applyDemoStyles ? _c.togglers.cssDemo : {}).addClass(tClass + " " + tClass + _pane).hover(addHover, removeHover).bind("mouseenter", onResizerEnter).appendTo($R);
                    if (o.togglerContent_open) {
                        $("<span>" + o.togglerContent_open + "</span>").data({
                            layoutEdge: pane,
                            layoutRole: "togglerContent"
                        }).data("layoutRole", "togglerContent").data("layoutEdge", pane).addClass("content content-open").css("display", "none").appendTo($T)
                    }
                    if (o.togglerContent_closed) {
                        $("<span>" + o.togglerContent_closed + "</span>").data({
                            layoutEdge: pane,
                            layoutRole: "togglerContent"
                        }).addClass("content content-closed").css("display", "none").appendTo($T)
                    }
                    enableClosable(pane)
                }
                initResizable(pane);
                if (s.isVisible) {
                    setAsOpen(pane)
                } else {
                    setAsClosed(pane);
                    bindStartSlidingEvents(pane, true)
                }
            });
            sizeHandles()
        }, initContent = function (pane, resize) {
            if (!isInitialized()) {
                return
            }
            var o = options[pane], sel = o.contentSelector, I = Instance[pane], $P = $Ps[pane], $C;
            if (sel) {
                $C = I.content = $Cs[pane] = (o.findNestedContent) ? $P.find(sel).eq(0) : $P.children(sel).eq(0)
            }
            if ($C && $C.length) {
                $C.data("layoutRole", "content");
                if (!$C.data("layoutCSS")) {
                    $C.data("layoutCSS", styles($C, "height"))
                }
                $C.css(_c.content.cssReq);
                if (o.applyDemoStyles) {
                    $C.css(_c.content.cssDemo);
                    $P.css(_c.content.cssDemoPane)
                }
                if ($P.css("overflowX").match(/(scroll|auto)/)) {
                    $P.css("overflow", "hidden")
                }
                state[pane].content = {};
                if (resize !== false) {
                    sizeContent(pane)
                }
            } else {
                I.content = $Cs[pane] = false
            }
        }, initResizable = function (panes) {
            var draggingAvailable = $.layout.plugins.draggable, side;
            panes = panes ? panes.split(",") : _c.borderPanes;
            $.each(panes, function (idx, pane) {
                var o = options[pane];
                if (!draggingAvailable || !$Ps[pane] || !o.resizable) {
                    o.resizable = false;
                    return true
                }
                var s = state[pane], z = options.zIndexes, c = _c[pane], side = c.dir == "horz" ? "top" : "left", $P = $Ps[pane], $R = $Rs[pane], base = o.resizerClass, lastPos = 0, r, live, resizerClass = base + "-drag", resizerPaneClass = base + "-" + pane + "-drag", helperClass = base + "-dragging", helperPaneClass = base + "-" + pane + "-dragging", helperLimitClass = base + "-dragging-limit", helperPaneLimitClass = base + "-" + pane + "-dragging-limit", helperClassesSet = false;
                if (!s.isClosed) {
                    $R.attr("title", o.tips.Resize).css("cursor", o.resizerCursor)
                }
                $R.draggable({
                    containment: $N[0],
                    axis: (c.dir == "horz" ? "y" : "x"),
                    delay: 0,
                    distance: 1,
                    grid: o.resizingGrid,
                    helper: "clone",
                    opacity: o.resizerDragOpacity,
                    addClasses: false,
                    zIndex: z.resizer_drag,
                    start: function (e, ui) {
                        o = options[pane];
                        s = state[pane];
                        live = o.livePaneResizing;
                        if (false === _runCallbacks("ondrag_start", pane)) {
                            return false
                        }
                        s.isResizing = true;
                        state.paneResizing = pane;
                        timer.clear(pane + "_closeSlider");
                        setSizeLimits(pane);
                        r = s.resizerPosition;
                        lastPos = ui.position[side];
                        $R.addClass(resizerClass + " " + resizerPaneClass);
                        helperClassesSet = false;
                        $("body").disableSelection();
                        showMasks(pane, {resizing: true})
                    },
                    drag: function (e, ui) {
                        if (!helperClassesSet) {
                            ui.helper.addClass(helperClass + " " + helperPaneClass).css({
                                right: "auto",
                                bottom: "auto"
                            }).children().css("visibility", "hidden");
                            helperClassesSet = true;
                            if (s.isSliding) {
                                $Ps[pane].css("zIndex", z.pane_sliding)
                            }
                        }
                        var limit = 0;
                        if (ui.position[side] < r.min) {
                            ui.position[side] = r.min;
                            limit = -1
                        } else {
                            if (ui.position[side] > r.max) {
                                ui.position[side] = r.max;
                                limit = 1
                            }
                        }
                        if (limit) {
                            ui.helper.addClass(helperLimitClass + " " + helperPaneLimitClass);
                            window.defaultStatus = (limit > 0 && pane.match(/(north|west)/)) || (limit < 0 && pane.match(/(south|east)/)) ? o.tips.maxSizeWarning : o.tips.minSizeWarning
                        } else {
                            ui.helper.removeClass(helperLimitClass + " " + helperPaneLimitClass);
                            window.defaultStatus = ""
                        }
                        if (live && Math.abs(ui.position[side] - lastPos) >= o.liveResizingTolerance) {
                            lastPos = ui.position[side];
                            resizePanes(e, ui, pane)
                        }
                    },
                    stop: function (e, ui) {
                        $("body").enableSelection();
                        window.defaultStatus = "";
                        $R.removeClass(resizerClass + " " + resizerPaneClass);
                        s.isResizing = false;
                        state.paneResizing = false;
                        resizePanes(e, ui, pane, true)
                    }
                })
            });
            var resizePanes = function (evt, ui, pane, resizingDone) {
                var dragPos = ui.position, c = _c[pane], o = options[pane], s = state[pane], resizerPos;
                switch (pane) {
                    case"north":
                        resizerPos = dragPos.top;
                        break;
                    case"west":
                        resizerPos = dragPos.left;
                        break;
                    case"south":
                        resizerPos = sC.layoutHeight - dragPos.top - o.spacing_open;
                        break;
                    case"east":
                        resizerPos = sC.layoutWidth - dragPos.left - o.spacing_open;
                        break
                }
                var newSize = resizerPos - sC.inset[c.side];
                if (!resizingDone) {
                    if (Math.abs(newSize - s.size) < o.liveResizingTolerance) {
                        return
                    }
                    manualSizePane(pane, newSize, false, true);
                    sizeMasks()
                } else {
                    if (false !== _runCallbacks("ondrag_end", pane)) {
                        manualSizePane(pane, newSize, false, true)
                    }
                    hideMasks(true);
                    if (s.isSliding) {
                        showMasks(pane, {resizing: true})
                    }
                }
            }
        }, sizeMask = function () {
            var $M = $(this), pane = $M.data("layoutMask"), s = state[pane];
            if (s.tagName == "IFRAME" && s.isVisible) {
                $M.css({top: s.offsetTop, left: s.offsetLeft, width: s.outerWidth, height: s.outerHeight})
            }
        }, sizeMasks = function () {
            $Ms.each(sizeMask)
        }, showMasks = function (pane, args) {
            var c = _c[pane], panes = ["center"], z = options.zIndexes, a = $.extend({
                objectsOnly: false,
                animation: false,
                resizing: true,
                sliding: state[pane].isSliding
            }, args), o, s;
            if (a.resizing) {
                panes.push(pane)
            }
            if (a.sliding) {
                panes.push(_c.oppositeEdge[pane])
            }
            if (c.dir === "horz") {
                panes.push("west");
                panes.push("east")
            }
            $.each(panes, function (i, p) {
                s = state[p];
                o = options[p];
                if (s.isVisible && (o.maskObjects || (!a.objectsOnly && o.maskContents))) {
                    getMasks(p).each(function () {
                        sizeMask.call(this);
                        this.style.zIndex = s.isSliding ? z.pane_sliding + 1 : z.pane_normal + 1;
                        this.style.display = "block"
                    })
                }
            })
        }, hideMasks = function (force) {
            if (force || !state.paneResizing) {
                $Ms.hide()
            } else {
                if (!force && !$.isEmptyObject(state.panesSliding)) {
                    var i = $Ms.length - 1, p, $M;
                    for (; i >= 0; i--) {
                        $M = $Ms.eq(i);
                        p = $M.data("layoutMask");
                        if (!options[p].maskObjects) {
                            $M.hide()
                        }
                    }
                }
            }
        }, getMasks = function (pane) {
            var $Masks = $([]), $M, i = 0, c = $Ms.length;
            for (; i < c; i++) {
                $M = $Ms.eq(i);
                if ($M.data("layoutMask") === pane) {
                    $Masks = $Masks.add($M)
                }
            }
            if ($Masks.length) {
                return $Masks
            } else {
                return createMasks(pane)
            }
        }, createMasks = function (pane) {
            var $P = $Ps[pane], s = state[pane], o = options[pane], z = options.zIndexes, $Masks = $([]), isIframe, el, $M, css, i;
            if (!o.maskContents && !o.maskObjects) {
                return $Masks
            }
            for (i = 0; i < (o.maskObjects ? 2 : 1); i++) {
                isIframe = o.maskObjects && i == 0;
                el = document.createElement(isIframe ? "iframe" : "div");
                $M = $(el).data("layoutMask", pane);
                el.className = "ui-layout-mask ui-layout-mask-" + pane;
                css = el.style;
                css.display = "block";
                css.position = "absolute";
                css.background = "#FFF";
                if (isIframe) {
                    el.frameborder = 0;
                    el.src = "about:blank";
                    css.opacity = 0;
                    css.filter = "Alpha(Opacity='0')";
                    css.border = 0
                }
                if (s.tagName == "IFRAME") {
                    css.zIndex = z.pane_normal + 1;
                    $N.append(el)
                } else {
                    $M.addClass("ui-layout-mask-inside-pane");
                    css.zIndex = o.maskZindex || z.content_mask;
                    css.top = 0;
                    css.left = 0;
                    css.width = "100%";
                    css.height = "100%";
                    $P.append(el)
                }
                $Masks = $Masks.add(el);
                $Ms = $Ms.add(el)
            }
            return $Masks
        }, destroy = function (evt_or_destroyChildren, destroyChildren) {
            $(window).unbind("." + sID);
            $(document).unbind("." + sID);
            if (typeof evt_or_destroyChildren === "object") {
                evtPane(evt_or_destroyChildren)
            } else {
                destroyChildren = evt_or_destroyChildren
            }
            $N.clearQueue().removeData("layout").removeData("layoutContainer").removeClass(options.containerClass).unbind("." + sID);
            $Ms.remove();
            $.each(_c.allPanes, function (i, pane) {
                removePane(pane, false, true, destroyChildren)
            });
            var css = "layoutCSS";
            if ($N.data(css) && !$N.data("layoutRole")) {
                $N.css($N.data(css)).removeData(css)
            }
            if (sC.tagName === "BODY" && ($N = $("html")).data(css)) {
                $N.css($N.data(css)).removeData(css)
            }
            runPluginCallbacks(Instance, $.layout.onDestroy);
            unload();
            for (var n in Instance) {
                if (!n.match(/^(container|options)$/)) {
                    delete Instance[n]
                }
            }
            Instance.destroyed = true;
            return Instance
        }, removePane = function (evt_or_pane, remove, skipResize, destroyChild) {
            if (!isInitialized()) {
                return
            }
            var pane = evtPane.call(this, evt_or_pane), $P = $Ps[pane], $C = $Cs[pane], $R = $Rs[pane], $T = $Ts[pane];
            if ($P && $.isEmptyObject($P.data())) {
                $P = false
            }
            if ($C && $.isEmptyObject($C.data())) {
                $C = false
            }
            if ($R && $.isEmptyObject($R.data())) {
                $R = false
            }
            if ($T && $.isEmptyObject($T.data())) {
                $T = false
            }
            if ($P) {
                $P.stop(true, true)
            }
            var o = options[pane], s = state[pane], d = "layout", css = "layoutCSS", pC = children[pane], hasChildren = $.isPlainObject(pC) && !$.isEmptyObject(pC), destroy = destroyChild !== undefined ? destroyChild : o.destroyChildren;
            if (hasChildren && destroy) {
                $.each(pC, function (key, child) {
                    if (!child.destroyed) {
                        child.destroy(true)
                    }
                    if (child.destroyed) {
                        delete pC[key]
                    }
                });
                if ($.isEmptyObject(pC)) {
                    pC = children[pane] = null;
                    hasChildren = false
                }
            }
            if ($P && remove && !hasChildren) {
                $P.remove()
            } else {
                if ($P && $P[0]) {
                    var root = o.paneClass, pRoot = root + "-" + pane, _open = "-open", _sliding = "-sliding", _closed = "-closed", classes = [root, root + _open, root + _closed, root + _sliding, pRoot, pRoot + _open, pRoot + _closed, pRoot + _sliding];
                    $.merge(classes, getHoverClasses($P, true));
                    $P.removeClass(classes.join(" ")).removeData("parentLayout").removeData("layoutPane").removeData("layoutRole").removeData("layoutEdge").removeData("autoHidden").unbind("." + sID);
                    if (hasChildren && $C) {
                        $C.width($C.width());
                        $.each(pC, function (key, child) {
                            child.resizeAll()
                        })
                    } else {
                        if ($C) {
                            $C.css($C.data(css)).removeData(css).removeData("layoutRole")
                        }
                    }
                    if (!$P.data(d)) {
                        $P.css($P.data(css)).removeData(css)
                    }
                }
            }
            if ($T) {
                $T.remove()
            }
            if ($R) {
                $R.remove()
            }
            Instance[pane] = $Ps[pane] = $Cs[pane] = $Rs[pane] = $Ts[pane] = false;
            s = {removed: true};
            if (!skipResize) {
                resizeAll()
            }
        }, _hidePane = function (pane) {
            var $P = $Ps[pane], o = options[pane], s = $P[0].style;
            if (o.useOffscreenClose) {
                if (!$P.data(_c.offscreenReset)) {
                    $P.data(_c.offscreenReset, {left: s.left, right: s.right})
                }
                $P.css(_c.offscreenCSS)
            } else {
                $P.hide().removeData(_c.offscreenReset)
            }
        }, _showPane = function (pane) {
            var $P = $Ps[pane], o = options[pane], off = _c.offscreenCSS, old = $P.data(_c.offscreenReset), s = $P[0].style;
            $P.show().removeData(_c.offscreenReset);
            if (o.useOffscreenClose && old) {
                if (s.left == off.left) {
                    s.left = old.left
                }
                if (s.right == off.right) {
                    s.right = old.right
                }
            }
        }, hide = function (evt_or_pane, noAnimation) {
            if (!isInitialized()) {
                return
            }
            var pane = evtPane.call(this, evt_or_pane), o = options[pane], s = state[pane], $P = $Ps[pane], $R = $Rs[pane];
            if (!$P || s.isHidden) {
                return
            }
            if (state.initialized && false === _runCallbacks("onhide_start", pane)) {
                return
            }
            s.isSliding = false;
            delete state.panesSliding[pane];
            if ($R) {
                $R.hide()
            }
            if (!state.initialized || s.isClosed) {
                s.isClosed = true;
                s.isHidden = true;
                s.isVisible = false;
                if (!state.initialized) {
                    _hidePane(pane)
                }
                sizeMidPanes(_c[pane].dir === "horz" ? "" : "center");
                if (state.initialized || o.triggerEventsOnLoad) {
                    _runCallbacks("onhide_end", pane)
                }
            } else {
                s.isHiding = true;
                close(pane, false, noAnimation)
            }
        }, show = function (evt_or_pane, openPane, noAnimation, noAlert) {
            if (!isInitialized()) {
                return
            }
            var pane = evtPane.call(this, evt_or_pane), o = options[pane], s = state[pane], $P = $Ps[pane], $R = $Rs[pane];
            if (!$P || !s.isHidden) {
                return
            }
            if (false === _runCallbacks("onshow_start", pane)) {
                return
            }
            s.isShowing = true;
            s.isSliding = false;
            delete state.panesSliding[pane];
            if (openPane === false) {
                close(pane, true)
            } else {
                open(pane, false, noAnimation, noAlert)
            }
        }, toggle = function (evt_or_pane, slide) {
            if (!isInitialized()) {
                return
            }
            var evt = evtObj(evt_or_pane), pane = evtPane.call(this, evt_or_pane), s = state[pane];
            if (evt) {
                evt.stopImmediatePropagation()
            }
            if (s.isHidden) {
                show(pane)
            } else {
                if (s.isClosed) {
                    open(pane, !!slide)
                } else {
                    close(pane)
                }
            }
        }, _closePane = function (pane, setHandles) {
            var $P = $Ps[pane], s = state[pane];
            _hidePane(pane);
            s.isClosed = true;
            s.isVisible = false;
            if (setHandles) {
                setAsClosed(pane)
            }
        }, close = function (evt_or_pane, force, noAnimation, skipCallback) {
            var pane = evtPane.call(this, evt_or_pane);
            if (!state.initialized && $Ps[pane]) {
                _closePane(pane, true);
                return
            }
            if (!isInitialized()) {
                return
            }
            var $P = $Ps[pane], $R = $Rs[pane], $T = $Ts[pane], o = options[pane], s = state[pane], c = _c[pane], doFX, isShowing, isHiding, wasSliding;
            $N.queue(function (queueNext) {
                if (!$P || (!o.closable && !s.isShowing && !s.isHiding) || (!force && s.isClosed && !s.isShowing)) {
                    return queueNext()
                }
                var abort = !s.isShowing && false === _runCallbacks("onclose_start", pane);
                isShowing = s.isShowing;
                isHiding = s.isHiding;
                wasSliding = s.isSliding;
                delete s.isShowing;
                delete s.isHiding;
                if (abort) {
                    return queueNext()
                }
                doFX = !noAnimation && !s.isClosed && (o.fxName_close != "none");
                s.isMoving = true;
                s.isClosed = true;
                s.isVisible = false;
                if (isHiding) {
                    s.isHidden = true
                } else {
                    if (isShowing) {
                        s.isHidden = false
                    }
                }
                if (s.isSliding) {
                    bindStopSlidingEvents(pane, false)
                } else {
                    sizeMidPanes(_c[pane].dir === "horz" ? "" : "center", false)
                }
                setAsClosed(pane);
                if (doFX) {
                    lockPaneForFX(pane, true);
                    $P.hide(o.fxName_close, o.fxSettings_close, o.fxSpeed_close, function () {
                        lockPaneForFX(pane, false);
                        if (s.isClosed) {
                            close_2()
                        }
                        queueNext()
                    })
                } else {
                    _hidePane(pane);
                    close_2();
                    queueNext()
                }
            });
            function close_2() {
                s.isMoving = false;
                bindStartSlidingEvents(pane, true);
                var altPane = _c.oppositeEdge[pane];
                if (state[altPane].noRoom) {
                    setSizeLimits(altPane);
                    makePaneFit(altPane)
                }
                if (!skipCallback && (state.initialized || o.triggerEventsOnLoad)) {
                    if (!isShowing) {
                        _runCallbacks("onclose_end", pane)
                    }
                    if (isShowing) {
                        _runCallbacks("onshow_end", pane)
                    }
                    if (isHiding) {
                        _runCallbacks("onhide_end", pane)
                    }
                }
            }
        }, setAsClosed = function (pane) {
            if (!$Rs[pane]) {
                return
            }
            var $P = $Ps[pane], $R = $Rs[pane], $T = $Ts[pane], o = options[pane], s = state[pane], side = _c[pane].side, rClass = o.resizerClass, tClass = o.togglerClass, _pane = "-" + pane, _open = "-open", _sliding = "-sliding", _closed = "-closed";
            $R.css(side, sC.inset[side]).removeClass(rClass + _open + " " + rClass + _pane + _open).removeClass(rClass + _sliding + " " + rClass + _pane + _sliding).addClass(rClass + _closed + " " + rClass + _pane + _closed);
            if (o.resizable && $.layout.plugins.draggable) {
                $R.draggable("disable").removeClass("ui-state-disabled").css("cursor", "default").attr("title", "")
            }
            if ($T) {
                $T.removeClass(tClass + _open + " " + tClass + _pane + _open).addClass(tClass + _closed + " " + tClass + _pane + _closed).attr("title", o.tips.Open);
                $T.children(".content-open").hide();
                $T.children(".content-closed").css("display", "block")
            }
            syncPinBtns(pane, false);
            if (state.initialized) {
                sizeHandles()
            }
        }, open = function (evt_or_pane, slide, noAnimation, noAlert) {
            if (!isInitialized()) {
                return
            }
            var pane = evtPane.call(this, evt_or_pane), $P = $Ps[pane], $R = $Rs[pane], $T = $Ts[pane], o = options[pane], s = state[pane], c = _c[pane], doFX, isShowing;
            $N.queue(function (queueNext) {
                if (!$P || (!o.resizable && !o.closable && !s.isShowing) || (s.isVisible && !s.isSliding)) {
                    return queueNext()
                }
                if (s.isHidden && !s.isShowing) {
                    queueNext();
                    show(pane, true);
                    return
                }
                if (s.autoResize && s.size != o.size) {
                    sizePane(pane, o.size, true, true, true)
                } else {
                    setSizeLimits(pane, slide)
                }
                var cbReturn = _runCallbacks("onopen_start", pane);
                if (cbReturn === "abort") {
                    return queueNext()
                }
                if (cbReturn !== "NC") {
                    setSizeLimits(pane, slide)
                }
                if (s.minSize > s.maxSize) {
                    syncPinBtns(pane, false);
                    if (!noAlert && o.tips.noRoomToOpen) {
                        alert(o.tips.noRoomToOpen)
                    }
                    return queueNext()
                }
                if (slide) {
                    bindStopSlidingEvents(pane, true)
                } else {
                    if (s.isSliding) {
                        bindStopSlidingEvents(pane, false)
                    } else {
                        if (o.slidable) {
                            bindStartSlidingEvents(pane, false)
                        }
                    }
                }
                s.noRoom = false;
                makePaneFit(pane);
                isShowing = s.isShowing;
                delete s.isShowing;
                doFX = !noAnimation && s.isClosed && (o.fxName_open != "none");
                s.isMoving = true;
                s.isVisible = true;
                s.isClosed = false;
                if (isShowing) {
                    s.isHidden = false
                }
                if (doFX) {
                    lockPaneForFX(pane, true);
                    $P.show(o.fxName_open, o.fxSettings_open, o.fxSpeed_open, function () {
                        lockPaneForFX(pane, false);
                        if (s.isVisible) {
                            open_2()
                        }
                        queueNext()
                    })
                } else {
                    _showPane(pane);
                    open_2();
                    queueNext()
                }
            });
            function open_2() {
                s.isMoving = false;
                _fixIframe(pane);
                if (!s.isSliding) {
                    sizeMidPanes(_c[pane].dir == "vert" ? "center" : "", false)
                }
                setAsOpen(pane)
            }
        }, setAsOpen = function (pane, skipCallback) {
            var $P = $Ps[pane], $R = $Rs[pane], $T = $Ts[pane], o = options[pane], s = state[pane], side = _c[pane].side, rClass = o.resizerClass, tClass = o.togglerClass, _pane = "-" + pane, _open = "-open", _closed = "-closed", _sliding = "-sliding";
            $R.css(side, sC.inset[side] + getPaneSize(pane)).removeClass(rClass + _closed + " " + rClass + _pane + _closed).addClass(rClass + _open + " " + rClass + _pane + _open);
            if (s.isSliding) {
                $R.addClass(rClass + _sliding + " " + rClass + _pane + _sliding)
            } else {
                $R.removeClass(rClass + _sliding + " " + rClass + _pane + _sliding)
            }
            removeHover(0, $R);
            if (o.resizable && $.layout.plugins.draggable) {
                $R.draggable("enable").css("cursor", o.resizerCursor).attr("title", o.tips.Resize)
            } else {
                if (!s.isSliding) {
                    $R.css("cursor", "default")
                }
            }
            if ($T) {
                $T.removeClass(tClass + _closed + " " + tClass + _pane + _closed).addClass(tClass + _open + " " + tClass + _pane + _open).attr("title", o.tips.Close);
                removeHover(0, $T);
                $T.children(".content-closed").hide();
                $T.children(".content-open").css("display", "block")
            }
            syncPinBtns(pane, !s.isSliding);
            $.extend(s, elDims($P));
            if (state.initialized) {
                sizeHandles();
                sizeContent(pane, true)
            }
            if (!skipCallback && (state.initialized || o.triggerEventsOnLoad) && $P.is(":visible")) {
                _runCallbacks("onopen_end", pane);
                if (s.isShowing) {
                    _runCallbacks("onshow_end", pane)
                }
                if (state.initialized) {
                    _runCallbacks("onresize_end", pane)
                }
            }
        }, slideOpen = function (evt_or_pane) {
            if (!isInitialized()) {
                return
            }
            var evt = evtObj(evt_or_pane), pane = evtPane.call(this, evt_or_pane), s = state[pane], delay = options[pane].slideDelay_open;
            if (evt) {
                evt.stopImmediatePropagation()
            }
            if (s.isClosed && evt && evt.type === "mouseenter" && delay > 0) {
                timer.set(pane + "_openSlider", open_NOW, delay)
            } else {
                open_NOW()
            }
            function open_NOW() {
                if (!s.isClosed) {
                    bindStopSlidingEvents(pane, true)
                } else {
                    if (!s.isMoving) {
                        open(pane, true)
                    }
                }
            }
        }, slideClose = function (evt_or_pane) {
            if (!isInitialized()) {
                return
            }
            var evt = evtObj(evt_or_pane), pane = evtPane.call(this, evt_or_pane), o = options[pane], s = state[pane], delay = s.isMoving ? 1000 : 300;
            if (s.isClosed || s.isResizing) {
                return
            } else {
                if (o.slideTrigger_close === "click") {
                    close_NOW()
                } else {
                    if (o.preventQuickSlideClose && s.isMoving) {
                        return
                    } else {
                        if (o.preventPrematureSlideClose && evt && $.layout.isMouseOverElem(evt, $Ps[pane])) {
                            return
                        } else {
                            if (evt) {
                                timer.set(pane + "_closeSlider", close_NOW, max(o.slideDelay_close, delay))
                            } else {
                                close_NOW()
                            }
                        }
                    }
                }
            }
            function close_NOW() {
                if (s.isClosed) {
                    bindStopSlidingEvents(pane, false)
                } else {
                    if (!s.isMoving) {
                        close(pane)
                    }
                }
            }
        }, slideToggle = function (evt_or_pane) {
            var pane = evtPane.call(this, evt_or_pane);
            toggle(pane, true)
        }, lockPaneForFX = function (pane, doLock) {
            var $P = $Ps[pane], s = state[pane], o = options[pane], z = options.zIndexes;
            if (doLock) {
                showMasks(pane, {animation: true, objectsOnly: true});
                $P.css({zIndex: z.pane_animate});
                if (pane == "south") {
                    $P.css({top: sC.inset.top + sC.innerHeight - $P.outerHeight()})
                } else {
                    if (pane == "east") {
                        $P.css({left: sC.inset.left + sC.innerWidth - $P.outerWidth()})
                    }
                }
            } else {
                hideMasks();
                $P.css({zIndex: (s.isSliding ? z.pane_sliding : z.pane_normal)});
                if (pane == "south") {
                    $P.css({top: "auto"})
                } else {
                    if (pane == "east" && !$P.css("left").match(/\-99999/)) {
                        $P.css({left: "auto"})
                    }
                }
                if (browser.msie && o.fxOpacityFix && o.fxName_open != "slide" && $P.css("filter") && $P.css("opacity") == 1) {
                    $P[0].style.removeAttribute("filter")
                }
            }
        }, bindStartSlidingEvents = function (pane, enable) {
            var o = options[pane], $P = $Ps[pane], $R = $Rs[pane], evtName = o.slideTrigger_open.toLowerCase();
            if (!$R || (enable && !o.slidable)) {
                return
            }
            if (evtName.match(/mouseover/)) {
                evtName = o.slideTrigger_open = "mouseenter"
            } else {
                if (!evtName.match(/(click|dblclick|mouseenter)/)) {
                    evtName = o.slideTrigger_open = "click"
                }
            }
            if (o.resizerDblClickToggle && evtName.match(/click/)) {
                $R[enable ? "unbind" : "bind"]("dblclick." + sID, toggle)
            }
            $R[enable ? "bind" : "unbind"](evtName + "." + sID, slideOpen).css("cursor", enable ? o.sliderCursor : "default").attr("title", enable ? o.tips.Slide : "")
        }, bindStopSlidingEvents = function (pane, enable) {
            var o = options[pane], s = state[pane], c = _c[pane], z = options.zIndexes, evtName = o.slideTrigger_close.toLowerCase(), action = (enable ? "bind" : "unbind"), $P = $Ps[pane], $R = $Rs[pane];
            timer.clear(pane + "_closeSlider");
            if (enable) {
                s.isSliding = true;
                state.panesSliding[pane] = true;
                bindStartSlidingEvents(pane, false)
            } else {
                s.isSliding = false;
                delete state.panesSliding[pane]
            }
            $P.css("zIndex", enable ? z.pane_sliding : z.pane_normal);
            $R.css("zIndex", enable ? z.pane_sliding + 2 : z.resizer_normal);
            if (!evtName.match(/(click|mouseleave)/)) {
                evtName = o.slideTrigger_close = "mouseleave"
            }
            $R[action](evtName, slideClose);
            if (evtName === "mouseleave") {
                $P[action]("mouseleave." + sID, slideClose);
                $R[action]("mouseenter." + sID, cancelMouseOut);
                $P[action]("mouseenter." + sID, cancelMouseOut)
            }
            if (!enable) {
                timer.clear(pane + "_closeSlider")
            } else {
                if (evtName === "click" && !o.resizable) {
                    $R.css("cursor", enable ? o.sliderCursor : "default");
                    $R.attr("title", enable ? o.tips.Close : "")
                }
            }
            function cancelMouseOut(evt) {
                timer.clear(pane + "_closeSlider");
                evt.stopPropagation()
            }
        }, makePaneFit = function (pane, isOpening, skipCallback, force) {
            var o = options[pane], s = state[pane], c = _c[pane], $P = $Ps[pane], $R = $Rs[pane], isSidePane = c.dir === "vert", hasRoom = false;
            if (pane === "center" || (isSidePane && s.noVerticalRoom)) {
                hasRoom = (s.maxHeight >= 0);
                if (hasRoom && s.noRoom) {
                    _showPane(pane);
                    if ($R) {
                        $R.show()
                    }
                    s.isVisible = true;
                    s.noRoom = false;
                    if (isSidePane) {
                        s.noVerticalRoom = false
                    }
                    _fixIframe(pane)
                } else {
                    if (!hasRoom && !s.noRoom) {
                        _hidePane(pane);
                        if ($R) {
                            $R.hide()
                        }
                        s.isVisible = false;
                        s.noRoom = true
                    }
                }
            }
            if (pane === "center") {
            } else {
                if (s.minSize <= s.maxSize) {
                    hasRoom = true;
                    if (s.size > s.maxSize) {
                        sizePane(pane, s.maxSize, skipCallback, true, force)
                    } else {
                        if (s.size < s.minSize) {
                            sizePane(pane, s.minSize, skipCallback, true, force)
                        } else {
                            if ($R && s.isVisible && $P.is(":visible")) {
                                var pos = s.size + sC.inset[c.side];
                                if ($.layout.cssNum($R, c.side) != pos) {
                                    $R.css(c.side, pos)
                                }
                            }
                        }
                    }
                    if (s.noRoom) {
                        if (s.wasOpen && o.closable) {
                            if (o.autoReopen) {
                                open(pane, false, true, true)
                            } else {
                                s.noRoom = false
                            }
                        } else {
                            show(pane, s.wasOpen, true, true)
                        }
                    }
                } else {
                    if (!s.noRoom) {
                        s.noRoom = true;
                        s.wasOpen = !s.isClosed && !s.isSliding;
                        if (s.isClosed) {
                        } else {
                            if (o.closable) {
                                close(pane, true, true)
                            } else {
                                hide(pane, true)
                            }
                        }
                    }
                }
            }
        }, manualSizePane = function (evt_or_pane, size, skipCallback, noAnimation, force) {
            if (!isInitialized()) {
                return
            }
            var pane = evtPane.call(this, evt_or_pane), o = options[pane], s = state[pane], forceResize = force || (o.livePaneResizing && !s.isResizing);
            s.autoResize = false;
            sizePane(pane, size, skipCallback, noAnimation, forceResize)
        }, sizePane = function (evt_or_pane, size, skipCallback, noAnimation, force) {
            if (!isInitialized()) {
                return
            }
            var pane = evtPane.call(this, evt_or_pane), o = options[pane], s = state[pane], $P = $Ps[pane], $R = $Rs[pane], side = _c[pane].side, dimName = _c[pane].sizeType.toLowerCase(), skipResizeWhileDragging = s.isResizing && !o.triggerEventsDuringLiveResize, doFX = noAnimation !== true && o.animatePaneSizing, oldSize, newSize;
            $N.queue(function (queueNext) {
                setSizeLimits(pane);
                oldSize = s.size;
                size = _parseSize(pane, size);
                size = max(size, _parseSize(pane, o.minSize));
                size = min(size, s.maxSize);
                if (size < s.minSize) {
                    queueNext();
                    makePaneFit(pane, false, skipCallback);
                    return
                }
                if (!force && size === oldSize) {
                    return queueNext()
                }
                s.newSize = size;
                if (!skipCallback && state.initialized && s.isVisible) {
                    _runCallbacks("onresize_start", pane)
                }
                newSize = cssSize(pane, size);
                if (doFX && $P.is(":visible")) {
                    var fx = $.layout.effects.size[pane] || $.layout.effects.size.all, easing = o.fxSettings_size.easing || fx.easing, z = options.zIndexes, props = {};
                    props[dimName] = newSize + "px";
                    s.isMoving = true;
                    $P.css({zIndex: z.pane_animate}).show().animate(props, o.fxSpeed_size, easing, function () {
                        $P.css({zIndex: (s.isSliding ? z.pane_sliding : z.pane_normal)});
                        s.isMoving = false;
                        delete s.newSize;
                        sizePane_2();
                        queueNext()
                    })
                } else {
                    $P.css(dimName, newSize);
                    delete s.newSize;
                    if ($P.is(":visible")) {
                        sizePane_2()
                    } else {
                        s.size = size;
                        $.extend(s, elDims($P))
                    }
                    queueNext()
                }
            });
            function sizePane_2() {
                var actual = dimName === "width" ? $P.outerWidth() : $P.outerHeight(), tries = [{
                    pane: pane,
                    count: 1,
                    target: size,
                    actual: actual,
                    correct: (size === actual),
                    attempt: size,
                    cssSize: newSize
                }], lastTry = tries[0], thisTry = {}, msg = "Inaccurate size after resizing the " + pane + "-pane.";
                while (!lastTry.correct) {
                    thisTry = {pane: pane, count: lastTry.count + 1, target: size};
                    if (lastTry.actual > size) {
                        thisTry.attempt = max(0, lastTry.attempt - (lastTry.actual - size))
                    } else {
                        thisTry.attempt = max(0, lastTry.attempt + (size - lastTry.actual))
                    }
                    thisTry.cssSize = cssSize(pane, thisTry.attempt);
                    $P.css(dimName, thisTry.cssSize);
                    thisTry.actual = dimName == "width" ? $P.outerWidth() : $P.outerHeight();
                    thisTry.correct = (size === thisTry.actual);
                    if (tries.length === 1) {
                        _log(msg, false, true);
                        _log(lastTry, false, true)
                    }
                    _log(thisTry, false, true);
                    if (tries.length > 3) {
                        break
                    }
                    tries.push(thisTry);
                    lastTry = tries[tries.length - 1]
                }
                s.size = size;
                $.extend(s, elDims($P));
                if (s.isVisible && $P.is(":visible")) {
                    if ($R) {
                        $R.css(side, size + sC.inset[side])
                    }
                    sizeContent(pane)
                }
                if (!skipCallback && !skipResizeWhileDragging && state.initialized && s.isVisible) {
                    _runCallbacks("onresize_end", pane)
                }
                if (!skipCallback) {
                    if (!s.isSliding) {
                        sizeMidPanes(_c[pane].dir == "horz" ? "" : "center", skipResizeWhileDragging, force)
                    }
                    sizeHandles()
                }
                var altPane = _c.oppositeEdge[pane];
                if (size < oldSize && state[altPane].noRoom) {
                    setSizeLimits(altPane);
                    makePaneFit(altPane, false, skipCallback)
                }
                if (tries.length > 1) {
                    _log(msg + "\nSee the Error Console for details.", true, true)
                }
            }
        }, sizeMidPanes = function (panes, skipCallback, force) {
            panes = (panes ? panes : "east,west,center").split(",");
            $.each(panes, function (i, pane) {
                if (!$Ps[pane]) {
                    return
                }
                var o = options[pane], s = state[pane], $P = $Ps[pane], $R = $Rs[pane], isCenter = (pane == "center"), hasRoom = true, CSS = {}, visCSS = $.layout.showInvisibly($P), newCenter = calcNewCenterPaneDims();
                $.extend(s, elDims($P));
                if (pane === "center") {
                    if (!force && s.isVisible && newCenter.width === s.outerWidth && newCenter.height === s.outerHeight) {
                        $P.css(visCSS);
                        return true
                    }
                    $.extend(s, cssMinDims(pane), {maxWidth: newCenter.width, maxHeight: newCenter.height});
                    CSS = newCenter;
                    s.newWidth = CSS.width;
                    s.newHeight = CSS.height;
                    CSS.width = cssW($P, CSS.width);
                    CSS.height = cssH($P, CSS.height);
                    hasRoom = CSS.width >= 0 && CSS.height >= 0;
                    if (!state.initialized && o.minWidth > newCenter.width) {
                        var reqPx = o.minWidth - s.outerWidth, minE = options.east.minSize || 0, minW = options.west.minSize || 0, sizeE = state.east.size, sizeW = state.west.size, newE = sizeE, newW = sizeW;
                        if (reqPx > 0 && state.east.isVisible && sizeE > minE) {
                            newE = max(sizeE - minE, sizeE - reqPx);
                            reqPx -= sizeE - newE
                        }
                        if (reqPx > 0 && state.west.isVisible && sizeW > minW) {
                            newW = max(sizeW - minW, sizeW - reqPx);
                            reqPx -= sizeW - newW
                        }
                        if (reqPx === 0) {
                            if (sizeE && sizeE != minE) {
                                sizePane("east", newE, true, true, force)
                            }
                            if (sizeW && sizeW != minW) {
                                sizePane("west", newW, true, true, force)
                            }
                            sizeMidPanes("center", skipCallback, force);
                            $P.css(visCSS);
                            return
                        }
                    }
                } else {
                    if (s.isVisible && !s.noVerticalRoom) {
                        $.extend(s, elDims($P), cssMinDims(pane))
                    }
                    if (!force && !s.noVerticalRoom && newCenter.height === s.outerHeight) {
                        $P.css(visCSS);
                        return true
                    }
                    CSS.top = newCenter.top;
                    CSS.bottom = newCenter.bottom;
                    s.newSize = newCenter.height;
                    CSS.height = cssH($P, newCenter.height);
                    s.maxHeight = CSS.height;
                    hasRoom = (s.maxHeight >= 0);
                    if (!hasRoom) {
                        s.noVerticalRoom = true
                    }
                }
                if (hasRoom) {
                    if (!skipCallback && state.initialized) {
                        _runCallbacks("onresize_start", pane)
                    }
                    $P.css(CSS);
                    if (pane !== "center") {
                        sizeHandles(pane)
                    }
                    if (s.noRoom && !s.isClosed && !s.isHidden) {
                        makePaneFit(pane)
                    }
                    if (s.isVisible) {
                        $.extend(s, elDims($P));
                        if (state.initialized) {
                            sizeContent(pane)
                        }
                    }
                } else {
                    if (!s.noRoom && s.isVisible) {
                        makePaneFit(pane)
                    }
                }
                $P.css(visCSS);
                delete s.newSize;
                delete s.newWidth;
                delete s.newHeight;
                if (!s.isVisible) {
                    return true
                }
                if (pane === "center") {
                    var fix = browser.isIE6 || !browser.boxModel;
                    if ($Ps.north && (fix || state.north.tagName == "IFRAME")) {
                        $Ps.north.css("width", cssW($Ps.north, sC.innerWidth))
                    }
                    if ($Ps.south && (fix || state.south.tagName == "IFRAME")) {
                        $Ps.south.css("width", cssW($Ps.south, sC.innerWidth))
                    }
                }
                if (!skipCallback && state.initialized) {
                    _runCallbacks("onresize_end", pane)
                }
            })
        }, resizeAll = function (evt_or_refresh) {
            var oldW = sC.innerWidth, oldH = sC.innerHeight;
            evtPane(evt_or_refresh);
            if (!$N.is(":visible")) {
                return
            }
            if (!state.initialized) {
                _initLayoutElements();
                return
            }
            if (evt_or_refresh === true && $.isPlainObject(options.outset)) {
                $N.css(options.outset)
            }
            $.extend(sC, elDims($N, options.inset));
            if (!sC.outerHeight) {
                return
            }
            if (evt_or_refresh === true) {
                setPanePosition()
            }
            if (false === _runCallbacks("onresizeall_start")) {
                return false
            }
            var shrunkH = (sC.innerHeight < oldH), shrunkW = (sC.innerWidth < oldW), $P, o, s;
            $.each(["south", "north", "east", "west"], function (i, pane) {
                if (!$Ps[pane]) {
                    return
                }
                o = options[pane];
                s = state[pane];
                if (s.autoResize && s.size != o.size) {
                    sizePane(pane, o.size, true, true, true)
                } else {
                    setSizeLimits(pane);
                    makePaneFit(pane, false, true, true)
                }
            });
            sizeMidPanes("", true, true);
            sizeHandles();
            $.each(_c.allPanes, function (i, pane) {
                $P = $Ps[pane];
                if (!$P) {
                    return
                }
                if (state[pane].isVisible) {
                    _runCallbacks("onresize_end", pane)
                }
            });
            _runCallbacks("onresizeall_end")
        }, resizeChildren = function (evt_or_pane, skipRefresh) {
            var pane = evtPane.call(this, evt_or_pane);
            if (!options[pane].resizeChildren) {
                return
            }
            if (!skipRefresh) {
                refreshChildren(pane)
            }
            var pC = children[pane];
            if ($.isPlainObject(pC)) {
                $.each(pC, function (key, child) {
                    if (!child.destroyed) {
                        child.resizeAll()
                    }
                })
            }
        }, sizeContent = function (evt_or_panes, remeasure) {
            if (!isInitialized()) {
                return
            }
            var panes = evtPane.call(this, evt_or_panes);
            panes = panes ? panes.split(",") : _c.allPanes;
            $.each(panes, function (idx, pane) {
                var $P = $Ps[pane], $C = $Cs[pane], o = options[pane], s = state[pane], m = s.content;
                if (!$P || !$C || !$P.is(":visible")) {
                    return true
                }
                if (!$C.length) {
                    initContent(pane, false);
                    if (!$C) {
                        return
                    }
                }
                if (false === _runCallbacks("onsizecontent_start", pane)) {
                    return
                }
                if ((!s.isMoving && !s.isResizing) || o.liveContentResizing || remeasure || m.top == undefined) {
                    _measure();
                    if (m.hiddenFooters > 0 && $P.css("overflow") === "hidden") {
                        $P.css("overflow", "visible");
                        _measure();
                        $P.css("overflow", "hidden")
                    }
                }
                var newH = s.innerHeight - (m.spaceAbove - s.css.paddingTop) - (m.spaceBelow - s.css.paddingBottom);
                if (!$C.is(":visible") || m.height != newH) {
                    setOuterHeight($C, newH, true);
                    m.height = newH
                }
                if (state.initialized) {
                    _runCallbacks("onsizecontent_end", pane)
                }
                function _below($E) {
                    return max(s.css.paddingBottom, (parseInt($E.css("marginBottom"), 10) || 0))
                }

                function _measure() {
                    var ignore = options[pane].contentIgnoreSelector, $Fs = $C.nextAll().not(".ui-layout-mask").not(ignore || ":lt(0)"), $Fs_vis = $Fs.filter(":visible"), $F = $Fs_vis.filter(":last");
                    m = {
                        top: $C[0].offsetTop,
                        height: $C.outerHeight(),
                        numFooters: $Fs.length,
                        hiddenFooters: $Fs.length - $Fs_vis.length,
                        spaceBelow: 0
                    };
                    m.spaceAbove = m.top;
                    m.bottom = m.top + m.height;
                    if ($F.length) {
                        m.spaceBelow = ($F[0].offsetTop + $F.outerHeight()) - m.bottom + _below($F)
                    } else {
                        m.spaceBelow = _below($C)
                    }
                }
            })
        }, sizeHandles = function (evt_or_panes) {
            var panes = evtPane.call(this, evt_or_panes);
            panes = panes ? panes.split(",") : _c.borderPanes;
            $.each(panes, function (i, pane) {
                var o = options[pane], s = state[pane], $P = $Ps[pane], $R = $Rs[pane], $T = $Ts[pane], $TC;
                if (!$P || !$R) {
                    return
                }
                var dir = _c[pane].dir, _state = (s.isClosed ? "_closed" : "_open"), spacing = o["spacing" + _state], togAlign = o["togglerAlign" + _state], togLen = o["togglerLength" + _state], paneLen, left, offset, CSS = {};
                if (spacing === 0) {
                    $R.hide();
                    return
                } else {
                    if (!s.noRoom && !s.isHidden) {
                        $R.show()
                    }
                }
                if (dir === "horz") {
                    paneLen = sC.innerWidth;
                    s.resizerLength = paneLen;
                    left = $.layout.cssNum($P, "left");
                    $R.css({
                        width: cssW($R, paneLen),
                        height: cssH($R, spacing),
                        left: left > -9999 ? left : sC.inset.left
                    })
                } else {
                    paneLen = $P.outerHeight();
                    s.resizerLength = paneLen;
                    $R.css({
                        height: cssH($R, paneLen),
                        width: cssW($R, spacing),
                        top: sC.inset.top + getPaneSize("north", true)
                    })
                }
                removeHover(o, $R);
                if ($T) {
                    if (togLen === 0 || (s.isSliding && o.hideTogglerOnSlide)) {
                        $T.hide();
                        return
                    } else {
                        $T.show()
                    }
                    if (!(togLen > 0) || togLen === "100%" || togLen > paneLen) {
                        togLen = paneLen;
                        offset = 0
                    } else {
                        if (isStr(togAlign)) {
                            switch (togAlign) {
                                case"top":
                                case"left":
                                    offset = 0;
                                    break;
                                case"bottom":
                                case"right":
                                    offset = paneLen - togLen;
                                    break;
                                case"middle":
                                case"center":
                                default:
                                    offset = round((paneLen - togLen) / 2)
                            }
                        } else {
                            var x = parseInt(togAlign, 10);
                            if (togAlign >= 0) {
                                offset = x
                            } else {
                                offset = paneLen - togLen + x
                            }
                        }
                    }
                    if (dir === "horz") {
                        var width = cssW($T, togLen);
                        $T.css({width: width, height: cssH($T, spacing), left: offset, top: 0});
                        $T.children(".content").each(function () {
                            $TC = $(this);
                            $TC.css("marginLeft", round((width - $TC.outerWidth()) / 2))
                        })
                    } else {
                        var height = cssH($T, togLen);
                        $T.css({height: height, width: cssW($T, spacing), top: offset, left: 0});
                        $T.children(".content").each(function () {
                            $TC = $(this);
                            $TC.css("marginTop", round((height - $TC.outerHeight()) / 2))
                        })
                    }
                    removeHover(0, $T)
                }
                if (!state.initialized && (o.initHidden || s.isHidden)) {
                    $R.hide();
                    if ($T) {
                        $T.hide()
                    }
                }
            })
        }, enableClosable = function (evt_or_pane) {
            if (!isInitialized()) {
                return
            }
            var pane = evtPane.call(this, evt_or_pane), $T = $Ts[pane], o = options[pane];
            if (!$T) {
                return
            }
            o.closable = true;
            $T.bind("click." + sID, function (evt) {
                evt.stopPropagation();
                toggle(pane)
            }).css("visibility", "visible").css("cursor", "pointer").attr("title", state[pane].isClosed ? o.tips.Open : o.tips.Close).show()
        }, disableClosable = function (evt_or_pane, hide) {
            if (!isInitialized()) {
                return
            }
            var pane = evtPane.call(this, evt_or_pane), $T = $Ts[pane];
            if (!$T) {
                return
            }
            options[pane].closable = false;
            if (state[pane].isClosed) {
                open(pane, false, true)
            }
            $T.unbind("." + sID).css("visibility", hide ? "hidden" : "visible").css("cursor", "default").attr("title", "")
        }, enableSlidable = function (evt_or_pane) {
            if (!isInitialized()) {
                return
            }
            var pane = evtPane.call(this, evt_or_pane), $R = $Rs[pane];
            if (!$R || !$R.data("draggable")) {
                return
            }
            options[pane].slidable = true;
            if (state[pane].isClosed) {
                bindStartSlidingEvents(pane, true)
            }
        }, disableSlidable = function (evt_or_pane) {
            if (!isInitialized()) {
                return
            }
            var pane = evtPane.call(this, evt_or_pane), $R = $Rs[pane];
            if (!$R) {
                return
            }
            options[pane].slidable = false;
            if (state[pane].isSliding) {
                close(pane, false, true)
            } else {
                bindStartSlidingEvents(pane, false);
                $R.css("cursor", "default").attr("title", "");
                removeHover(null, $R[0])
            }
        }, enableResizable = function (evt_or_pane) {
            if (!isInitialized()) {
                return
            }
            var pane = evtPane.call(this, evt_or_pane), $R = $Rs[pane], o = options[pane];
            if (!$R || !$R.data("draggable")) {
                return
            }
            o.resizable = true;
            $R.draggable("enable");
            if (!state[pane].isClosed) {
                $R.css("cursor", o.resizerCursor).attr("title", o.tips.Resize)
            }
        }, disableResizable = function (evt_or_pane) {
            if (!isInitialized()) {
                return
            }
            var pane = evtPane.call(this, evt_or_pane), $R = $Rs[pane];
            if (!$R || !$R.data("draggable")) {
                return
            }
            options[pane].resizable = false;
            $R.draggable("disable").css("cursor", "default").attr("title", "");
            removeHover(null, $R[0])
        }, swapPanes = function (evt_or_pane1, pane2) {
            if (!isInitialized()) {
                return
            }
            var pane1 = evtPane.call(this, evt_or_pane1);
            state[pane1].edge = pane2;
            state[pane2].edge = pane1;
            if (false === _runCallbacks("onswap_start", pane1) || false === _runCallbacks("onswap_start", pane2)) {
                state[pane1].edge = pane1;
                state[pane2].edge = pane2;
                return
            }
            var oPane1 = copy(pane1), oPane2 = copy(pane2), sizes = {};
            sizes[pane1] = oPane1 ? oPane1.state.size : 0;
            sizes[pane2] = oPane2 ? oPane2.state.size : 0;
            $Ps[pane1] = false;
            $Ps[pane2] = false;
            state[pane1] = {};
            state[pane2] = {};
            if ($Ts[pane1]) {
                $Ts[pane1].remove()
            }
            if ($Ts[pane2]) {
                $Ts[pane2].remove()
            }
            if ($Rs[pane1]) {
                $Rs[pane1].remove()
            }
            if ($Rs[pane2]) {
                $Rs[pane2].remove()
            }
            $Rs[pane1] = $Rs[pane2] = $Ts[pane1] = $Ts[pane2] = false;
            move(oPane1, pane2);
            move(oPane2, pane1);
            oPane1 = oPane2 = sizes = null;
            if ($Ps[pane1]) {
                $Ps[pane1].css(_c.visible)
            }
            if ($Ps[pane2]) {
                $Ps[pane2].css(_c.visible)
            }
            resizeAll();
            _runCallbacks("onswap_end", pane1);
            _runCallbacks("onswap_end", pane2);
            return;
            function copy(n) {
                var $P = $Ps[n], $C = $Cs[n];
                return !$P ? false : {
                        pane: n,
                        P: $P ? $P[0] : false,
                        C: $C ? $C[0] : false,
                        state: $.extend(true, {}, state[n]),
                        options: $.extend(true, {}, options[n])
                    }
            }

            function move(oPane, pane) {
                if (!oPane) {
                    return
                }
                var P = oPane.P, C = oPane.C, oldPane = oPane.pane, c = _c[pane], s = $.extend(true, {}, state[pane]), o = options[pane], fx = {resizerCursor: o.resizerCursor}, re, size, pos;
                $.each("fxName,fxSpeed,fxSettings".split(","), function (i, k) {
                    fx[k + "_open"] = o[k + "_open"];
                    fx[k + "_close"] = o[k + "_close"];
                    fx[k + "_size"] = o[k + "_size"]
                });
                $Ps[pane] = $(P).data({layoutPane: Instance[pane], layoutEdge: pane}).css(_c.hidden).css(c.cssReq);
                $Cs[pane] = C ? $(C) : false;
                options[pane] = $.extend(true, {}, oPane.options, fx);
                state[pane] = $.extend(true, {}, oPane.state);
                re = new RegExp(o.paneClass + "-" + oldPane, "g");
                P.className = P.className.replace(re, o.paneClass + "-" + pane);
                initHandles(pane);
                if (c.dir != _c[oldPane].dir) {
                    size = sizes[pane] || 0;
                    setSizeLimits(pane);
                    size = max(size, state[pane].minSize);
                    manualSizePane(pane, size, true, true)
                } else {
                    $Rs[pane].css(c.side, sC.inset[c.side] + (state[pane].isVisible ? getPaneSize(pane) : 0))
                }
                if (oPane.state.isVisible && !s.isVisible) {
                    setAsOpen(pane, true)
                } else {
                    setAsClosed(pane);
                    bindStartSlidingEvents(pane, true)
                }
                oPane = null
            }
        }, syncPinBtns = function (pane, doPin) {
            if ($.layout.plugins.buttons) {
                $.each(state[pane].pins, function (i, selector) {
                    $.layout.buttons.setPinState(Instance, $(selector), pane, doPin)
                })
            }
        };

        function keyDown(evt) {
            if (!evt) {
                return true
            }
            var code = evt.keyCode;
            if (code < 33) {
                return true
            }
            var PANE = {
                38: "north",
                40: "south",
                37: "west",
                39: "east"
            }, ALT = evt.altKey, SHIFT = evt.shiftKey, CTRL = evt.ctrlKey, CURSOR = (CTRL && code >= 37 && code <= 40), o, k, m, pane;
            if (CURSOR && options[PANE[code]].enableCursorHotkey) {
                pane = PANE[code]
            } else {
                if (CTRL || SHIFT) {
                    $.each(_c.borderPanes, function (i, p) {
                        o = options[p];
                        k = o.customHotkey;
                        m = o.customHotkeyModifier;
                        if ((SHIFT && m == "SHIFT") || (CTRL && m == "CTRL") || (CTRL && SHIFT)) {
                            if (k && code === (isNaN(k) || k <= 9 ? k.toUpperCase().charCodeAt(0) : k)) {
                                pane = p;
                                return false
                            }
                        }
                    })
                }
            }
            if (!pane || !$Ps[pane] || !options[pane].closable || state[pane].isHidden) {
                return true
            }
            toggle(pane);
            evt.stopPropagation();
            evt.returnValue = false;
            return false
        }

        function allowOverflow(el) {
            if (!isInitialized()) {
                return
            }
            if (this && this.tagName) {
                el = this
            }
            var $P;
            if (isStr(el)) {
                $P = $Ps[el]
            } else {
                if ($(el).data("layoutRole")) {
                    $P = $(el)
                } else {
                    $(el).parents().each(function () {
                        if ($(this).data("layoutRole")) {
                            $P = $(this);
                            return false
                        }
                    })
                }
            }
            if (!$P || !$P.length) {
                return
            }
            var pane = $P.data("layoutEdge"), s = state[pane];
            if (s.cssSaved) {
                resetOverflow(pane)
            }
            if (s.isSliding || s.isResizing || s.isClosed) {
                s.cssSaved = false;
                return
            }
            var newCSS = {zIndex: (options.zIndexes.resizer_normal + 1)}, curCSS = {}, of = $P.css("overflow"), ofX = $P.css("overflowX"), ofY = $P.css("overflowY");
            if (of != "visible") {
                curCSS.overflow = of;
                newCSS.overflow = "visible"
            }
            if (ofX && !ofX.match(/(visible|auto)/)) {
                curCSS.overflowX = ofX;
                newCSS.overflowX = "visible"
            }
            if (ofY && !ofY.match(/(visible|auto)/)) {
                curCSS.overflowY = ofX;
                newCSS.overflowY = "visible"
            }
            s.cssSaved = curCSS;
            $P.css(newCSS);
            $.each(_c.allPanes, function (i, p) {
                if (p != pane) {
                    resetOverflow(p)
                }
            })
        }

        function resetOverflow(el) {
            if (!isInitialized()) {
                return
            }
            if (this && this.tagName) {
                el = this
            }
            var $P;
            if (isStr(el)) {
                $P = $Ps[el]
            } else {
                if ($(el).data("layoutRole")) {
                    $P = $(el)
                } else {
                    $(el).parents().each(function () {
                        if ($(this).data("layoutRole")) {
                            $P = $(this);
                            return false
                        }
                    })
                }
            }
            if (!$P || !$P.length) {
                return
            }
            var pane = $P.data("layoutEdge"), s = state[pane], CSS = s.cssSaved || {};
            if (!s.isSliding && !s.isResizing) {
                $P.css("zIndex", options.zIndexes.pane_normal)
            }
            $P.css(CSS);
            s.cssSaved = false
        }

        var $N = $(this).eq(0);
        if (!$N.length) {
            return _log(options.errors.containerMissing)
        }
        if ($N.data("layoutContainer") && $N.data("layout")) {
            return $N.data("layout")
        }
        var $Ps = {}, $Cs = {}, $Rs = {}, $Ts = {}, $Ms = $([]), sC = state.container, sID = state.id;
        var Instance = {
            options: options,
            state: state,
            container: $N,
            panes: $Ps,
            contents: $Cs,
            resizers: $Rs,
            togglers: $Ts,
            hide: hide,
            show: show,
            toggle: toggle,
            open: open,
            close: close,
            slideOpen: slideOpen,
            slideClose: slideClose,
            slideToggle: slideToggle,
            setSizeLimits: setSizeLimits,
            _sizePane: sizePane,
            sizePane: manualSizePane,
            sizeContent: sizeContent,
            swapPanes: swapPanes,
            showMasks: showMasks,
            hideMasks: hideMasks,
            initContent: initContent,
            addPane: addPane,
            removePane: removePane,
            createChildren: createChildren,
            refreshChildren: refreshChildren,
            enableClosable: enableClosable,
            disableClosable: disableClosable,
            enableSlidable: enableSlidable,
            disableSlidable: disableSlidable,
            enableResizable: enableResizable,
            disableResizable: disableResizable,
            allowOverflow: allowOverflow,
            resetOverflow: resetOverflow,
            destroy: destroy,
            initPanes: isInitialized,
            resizeAll: resizeAll,
            runCallbacks: _runCallbacks,
            hasParentLayout: false,
            children: children,
            north: false,
            south: false,
            west: false,
            east: false,
            center: false
        };
        if (_create() === "cancel") {
            return null
        } else {
            return Instance
        }
    }
})(jQuery);
(function (a) {
    if (!a.ui) {
        a.ui = {}
    }
    a.ui.cookie = {
        acceptsCookies: !!navigator.cookieEnabled, read: function (b) {
            var h = document.cookie, e = h ? h.split(";") : [], f;
            for (var d = 0, g = e.length; d < g; d++) {
                f = a.trim(e[d]).split("=");
                if (f[0] == b) {
                    return decodeURIComponent(f[1])
                }
            }
            return null
        }, write: function (b, d, h) {
            var f = "", e = "", g = false, c = h || {}, i = c.expires || null, j = a.type(i);
            if (j === "date") {
                e = i
            } else {
                if (j === "string" && i > 0) {
                    i = parseInt(i, 10);
                    j = "number"
                }
            }
            if (j === "number") {
                e = new Date();
                if (i > 0) {
                    e.setDate(e.getDate() + i)
                } else {
                    e.setFullYear(1970);
                    g = true
                }
            }
            if (e) {
                f += ";expires=" + e.toUTCString()
            }
            if (c.path) {
                f += ";path=" + c.path
            }
            if (c.domain) {
                f += ";domain=" + c.domain
            }
            if (c.secure) {
                f += ";secure"
            }
            document.cookie = b + "=" + (g ? "" : encodeURIComponent(d)) + f
        }, clear: function (b) {
            a.ui.cookie.write(b, "", {expires: -1})
        }
    };
    if (!a.cookie) {
        a.cookie = function (c, b, e) {
            var d = a.ui.cookie;
            if (b === null) {
                d.clear(c)
            } else {
                if (b === undefined) {
                    return d.read(c)
                } else {
                    d.write(c, b, e)
                }
            }
        }
    }
    a.layout.plugins.stateManagement = true;
    a.layout.config.optionRootKeys.push("stateManagement");
    a.layout.defaults.stateManagement = {
        enabled: false,
        autoSave: true,
        autoLoad: true,
        animateLoad: true,
        includeChildren: true,
        stateKeys: "north.size,south.size,east.size,west.size,north.isClosed,south.isClosed,east.isClosed,west.isClosed,north.isHidden,south.isHidden,east.isHidden,west.isHidden",
        cookie: {name: "", domain: "", path: "", expires: "", secure: false}
    };
    a.layout.optionsMap.layout.push("stateManagement");
    a.layout.state = {
        saveCookie: function (f, d, c) {
            var g = f.options, h = g.stateManagement, b = a.extend(true, {}, h.cookie, c || null), e = f.state.stateData = f.readState(d || h.stateKeys);
            a.ui.cookie.write(b.name || g.name || "Layout", a.layout.state.encodeJSON(e), b);
            return a.extend(true, {}, e)
        }, deleteCookie: function (b) {
            var c = b.options;
            a.ui.cookie.clear(c.stateManagement.cookie.name || c.name || "Layout")
        }, readCookie: function (b) {
            var d = b.options;
            var e = a.ui.cookie.read(d.stateManagement.cookie.name || d.name || "Layout");
            return e ? a.layout.state.decodeJSON(e) : {}
        }, loadCookie: function (b) {
            var d = a.layout.state.readCookie(b);
            if (d) {
                b.state.stateData = a.extend(true, {}, d);
                b.loadState(d)
            }
            return d
        }, loadState: function (k, i, b) {
            if (!a.isPlainObject(i) || a.isEmptyObject(i)) {
                return
            }
            i = k.state.stateData = a.layout.transformData(i);
            var f = k.options.stateManagement;
            b = a.extend({animateLoad: false, includeChildren: f.includeChildren}, b);
            if (!k.state.initialized) {
                var e = a.extend(true, {}, i);
                a.each(a.layout.config.allPanes, function (c, h) {
                    if (e[h]) {
                        delete e[h].children
                    }
                });
                a.extend(true, k.options, e)
            } else {
                var g = !b.animateLoad, e, n, l, d, j;
                a.each(a.layout.config.borderPanes, function (c, h) {
                    e = i[h];
                    if (!a.isPlainObject(e)) {
                        return
                    }
                    s = e.size;
                    n = e.initClosed;
                    l = e.initHidden;
                    ar = e.autoResize;
                    d = k.state[h];
                    j = d.isVisible;
                    if (ar) {
                        d.autoResize = ar
                    }
                    if (!j) {
                        k._sizePane(h, s, false, false, false)
                    }
                    if (l === true) {
                        k.hide(h, g)
                    } else {
                        if (n === true) {
                            k.close(h, false, g)
                        } else {
                            if (n === false) {
                                k.open(h, false, g)
                            } else {
                                if (l === false) {
                                    k.show(h, false, g)
                                }
                            }
                        }
                    }
                    if (j) {
                        k._sizePane(h, s, false, false, g)
                    }
                });
                if (b.includeChildren) {
                    var m, p;
                    a.each(k.children, function (h, c) {
                        m = i[h] ? i[h].children : 0;
                        if (m && c) {
                            a.each(c, function (q, o) {
                                p = m[q];
                                if (o && p) {
                                    o.loadState(p)
                                }
                            })
                        }
                    })
                }
            }
        }, readState: function (d, k) {
            if (a.type(k) === "string") {
                k = {keys: k}
            }
            if (!k) {
                k = {}
            }
            var v = d.options.stateManagement, o = k.includeChildren, b = o !== undefined ? o : v.includeChildren, l = k.stateKeys || v.stateKeys, w = {
                isClosed: "initClosed",
                isHidden: "initHidden"
            }, e = d.state, j = a.layout.config.allPanes, x = {}, q, m, y, z, r, t, f, h, g, c;
            if (a.isArray(l)) {
                l = l.join(",")
            }
            l = l.replace(/__/g, ".").split(",");
            for (var u = 0, p = l.length; u < p; u++) {
                q = l[u].split(".");
                m = q[0];
                y = q[1];
                if (a.inArray(m, j) < 0) {
                    continue
                }
                z = e[m][y];
                if (z == undefined) {
                    continue
                }
                if (y == "isClosed" && e[m]["isSliding"]) {
                    z = true
                }
                (x[m] || (x[m] = {}))[w[y] ? w[y] : y] = z
            }
            if (b) {
                a.each(j, function (i, n) {
                    t = d.children[n];
                    r = e.stateData[n];
                    if (a.isPlainObject(t) && !a.isEmptyObject(t)) {
                        c = x[n] || (x[n] = {});
                        if (!c.children) {
                            c.children = {}
                        }
                        a.each(t, function (A, B) {
                            if (B.state.initialized) {
                                c.children[A] = a.layout.state.readState(B)
                            } else {
                                if (r && r.children && r.children[A]) {
                                    c.children[A] = a.extend(true, {}, r.children[A])
                                }
                            }
                        })
                    }
                })
            }
            return x
        }, encodeJSON: function (c) {
            return b(c);
            function b(l) {
                var m = [], j = 0, f, e, g, d = a.isArray(l);
                for (f in l) {
                    e = l[f];
                    g = typeof e;
                    if (g == "string") {
                        e = '"' + e + '"'
                    } else {
                        if (g == "object") {
                            e = b(e)
                        }
                    }
                    m[j++] = (!d ? '"' + f + '":' : "") + e
                }
                return (d ? "[" : "{") + m.join(",") + (d ? "]" : "}")
            }
        }, decodeJSON: function (c) {
            try {
                return a.parseJSON ? a.parseJSON(c) : window["eval"]("(" + c + ")") || {}
            } catch (b) {
                return {}
            }
        }, _create: function (c) {
            var b = a.layout.state, h = c.options, i = h.stateManagement;
            a.extend(c, {
                readCookie: function () {
                    return b.readCookie(c)
                }, deleteCookie: function () {
                    b.deleteCookie(c)
                }, saveCookie: function (e, d) {
                    return b.saveCookie(c, e, d)
                }, loadCookie: function () {
                    return b.loadCookie(c)
                }, loadState: function (d, e) {
                    b.loadState(c, d, e)
                }, readState: function (d) {
                    return b.readState(c, d)
                }, encodeJSON: b.encodeJSON, decodeJSON: b.decodeJSON
            });
            c.state.stateData = {};
            if (!i.autoLoad) {
                return
            }
            if (a.isPlainObject(i.autoLoad)) {
                if (!a.isEmptyObject(i.autoLoad)) {
                    c.loadState(i.autoLoad)
                }
            } else {
                if (i.enabled) {
                    if (a.isFunction(i.autoLoad)) {
                        var g = {};
                        try {
                            g = i.autoLoad(c, c.state, c.options, c.options.name || "")
                        } catch (f) {
                        }
                        if (g && a.isPlainObject(g) && !a.isEmptyObject(g)) {
                            c.loadState(g)
                        }
                    } else {
                        c.loadCookie()
                    }
                }
            }
        }, _unload: function (b) {
            var d = b.options.stateManagement;
            if (d.enabled && d.autoSave) {
                if (a.isFunction(d.autoSave)) {
                    try {
                        d.autoSave(b, b.state, b.options, b.options.name || "")
                    } catch (c) {
                    }
                } else {
                    b.saveCookie()
                }
            }
        }
    };
    a.layout.onCreate.push(a.layout.state._create);
    a.layout.onUnload.push(a.layout.state._unload);
    a.layout.plugins.buttons = true;
    a.layout.defaults.autoBindCustomButtons = false;
    a.layout.optionsMap.layout.push("autoBindCustomButtons");
    a.layout.buttons = {
        init: function (d) {
            var e = "ui-layout-button-", c = d.options.name || "", b;
            a.each("toggle,open,close,pin,toggle-slide,open-slide".split(","), function (f, g) {
                a.each(a.layout.config.borderPanes, function (h, i) {
                    a("." + e + g + "-" + i).each(function () {
                        b = a(this).data("layoutName") || a(this).attr("layoutName");
                        if (b == undefined || b === c) {
                            d.bindButton(this, g, i)
                        }
                    })
                })
            })
        }, get: function (g, b, i, f) {
            var c = a(b), h = g.options, e = h.errors.addButtonError;
            if (!c.length) {
                a.layout.msg(e + " " + h.errors.selector + ": " + b, true)
            } else {
                if (a.inArray(i, a.layout.config.borderPanes) < 0) {
                    a.layout.msg(e + " " + h.errors.pane + ": " + i, true);
                    c = a("")
                } else {
                    var d = h[i].buttonClass + "-" + f;
                    c.addClass(d + " " + d + "-" + i).data("layoutName", h.name)
                }
            }
            return c
        }, bind: function (e, b, d, f) {
            var c = a.layout.buttons;
            switch (d.toLowerCase()) {
                case"toggle":
                    c.addToggle(e, b, f);
                    break;
                case"open":
                    c.addOpen(e, b, f);
                    break;
                case"close":
                    c.addClose(e, b, f);
                    break;
                case"pin":
                    c.addPin(e, b, f);
                    break;
                case"toggle-slide":
                    c.addToggle(e, b, f, true);
                    break;
                case"open-slide":
                    c.addOpen(e, b, f, true);
                    break
            }
            return e
        }, addToggle: function (d, c, e, b) {
            a.layout.buttons.get(d, c, e, "toggle").click(function (f) {
                d.toggle(e, !!b);
                f.stopPropagation()
            });
            return d
        }, addOpen: function (d, c, e, b) {
            a.layout.buttons.get(d, c, e, "open").attr("title", d.options[e].tips.Open).click(function (f) {
                d.open(e, !!b);
                f.stopPropagation()
            });
            return d
        }, addClose: function (c, b, d) {
            a.layout.buttons.get(c, b, d, "close").attr("title", c.options[d].tips.Close).click(function (e) {
                c.close(d);
                e.stopPropagation()
            });
            return c
        }, addPin: function (f, b, g) {
            var d = a.layout.buttons, c = d.get(f, b, g, "pin");
            if (c.length) {
                var e = f.state[g];
                c.click(function (h) {
                    d.setPinState(f, a(this), g, (e.isSliding || e.isClosed));
                    if (e.isSliding || e.isClosed) {
                        f.open(g)
                    } else {
                        f.close(g)
                    }
                    h.stopPropagation()
                });
                d.setPinState(f, c, g, (!e.isClosed && !e.isSliding));
                e.pins.push(b)
            }
            return f
        }, setPinState: function (f, h, d, e) {
            var k = h.attr("pin");
            if (k && e === (k == "down")) {
                return
            }
            var c = f.options[d], b = c.buttonClass + "-pin", g = b + "-" + d, j = b + "-up " + g + "-up", i = b + "-down " + g + "-down";
            h.attr("pin", e ? "down" : "up").attr("title", e ? c.tips.Unpin : c.tips.Pin).removeClass(e ? j : i).addClass(e ? i : j)
        }, syncPinBtns: function (c, d, b) {
            a.each(c.state[d].pins, function (f, e) {
                a.layout.buttons.setPinState(c, a(e), d, b)
            })
        }, _load: function (d) {
            var b = a.layout.buttons;
            a.extend(d, {
                bindButton: function (g, f, h) {
                    return b.bind(d, g, f, h)
                }, addToggleBtn: function (g, h, f) {
                    return b.addToggle(d, g, h, f)
                }, addOpenBtn: function (g, h, f) {
                    return b.addOpen(d, g, h, f)
                }, addCloseBtn: function (f, g) {
                    return b.addClose(d, f, g)
                }, addPinBtn: function (f, g) {
                    return b.addPin(d, f, g)
                }
            });
            for (var c = 0; c < 4; c++) {
                var e = a.layout.config.borderPanes[c];
                d.state[e].pins = []
            }
            if (d.options.autoBindCustomButtons) {
                b.init(d)
            }
        }, _unload: function (b) {
        }
    };
    a.layout.onLoad.push(a.layout.buttons._load);
    a.layout.plugins.browserZoom = true;
    a.layout.defaults.browserZoomCheckInterval = 1000;
    a.layout.optionsMap.layout.push("browserZoomCheckInterval");
    a.layout.browserZoom = {
        _init: function (b) {
            if (a.layout.browserZoom.ratio() !== false) {
                a.layout.browserZoom._setTimer(b)
            }
        }, _setTimer: function (d) {
            if (d.destroyed) {
                return
            }
            var e = d.options, c = d.state, b = d.hasParentLayout ? 5000 : Math.max(e.browserZoomCheckInterval, 100);
            setTimeout(function () {
                if (d.destroyed || !e.resizeWithWindow) {
                    return
                }
                var f = a.layout.browserZoom.ratio();
                if (f !== c.browserZoom) {
                    c.browserZoom = f;
                    d.resizeAll()
                }
                a.layout.browserZoom._setTimer(d)
            }, b)
        }, ratio: function () {
            var k = window, m = screen, h = document, f = h.documentElement || h.body, i = a.layout.browser, l = i.version, c, e, j;
            if ((i.msie && l > 8) || !i.msie) {
                return false
            }
            if (m.deviceXDPI && m.systemXDPI) {
                return g(m.deviceXDPI, m.systemXDPI)
            }
            if (i.webkit && (c = h.body.getBoundingClientRect)) {
                return g((c.left - c.right), h.body.offsetWidth)
            }
            if (i.webkit && (e = k.outerWidth)) {
                return g(e, k.innerWidth)
            }
            if ((e = m.width) && (j = f.clientWidth)) {
                return g(e, j)
            }
            return false;
            function g(b, d) {
                return (parseInt(b, 10) / parseInt(d, 10) * 100).toFixed()
            }
        }
    };
    a.layout.onReady.push(a.layout.browserZoom._init)
})(jQuery);
PrimeFaces.widget.Layout = PrimeFaces.widget.BaseWidget.extend({
    init: function (c) {
        this._super(c);
        this.cfg = c;
        this.id = this.cfg.id;
        this.jqId = PrimeFaces.escapeClientId(this.id);
        if (this.cfg.full) {
            this.jq = $("body")
        } else {
            if (this.cfg.parent) {
                this.jq = $(PrimeFaces.escapeClientId(this.cfg.parent))
            } else {
                this.jq = $(this.jqId)
            }
        }
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
            var a = this;
            this.cfg.defaults = {
                onshow: function (b, e, d, c) {
                    a.onshow(b, e, d)
                },
                onhide: function (b, e, d, c) {
                    a.onhide(b, e, d)
                },
                onopen: function (b, e, d, c) {
                    a.onopen(b, e, d)
                },
                onclose: function (b, e, d, c) {
                    a.onclose(b, e, d)
                },
                onresize: function (b, e, d, c) {
                    a.onresize(b, e, d)
                },
                contentSelector: ".ui-layout-unit-content",
                slidable: false,
                togglerLength_open: 0,
                togglerLength_closed: 23,
                togglerAlign_closed: "top",
                togglerContent_closed: '<a href="javascript:void(0)" class="ui-layout-unit-expand-icon ui-state-default ui-corner-all"><span class="ui-icon ui-icon-arrow-4-diag"></span></a>'
            };
            this.layout = this.jq.layout(this.cfg);
            if (!this.cfg.full) {
                this.jq.css("overflow", "visible")
            }
            this.bindEvents();
            return true
        } else {
            return false
        }
    }, bindEvents: function () {
        var a = this, c = this.jq.children(".ui-layout-unit"), b = this.jq.children(".ui-layout-resizer");
        c.children(".ui-layout-unit-header").children("a.ui-layout-unit-header-icon").mouseover(function () {
            $(this).addClass("ui-state-hover")
        }).mouseout(function () {
            $(this).removeClass("ui-state-hover")
        }).click(function () {
            var d = $(this), e = d.parents(".ui-layout-unit:first"), f = e.data("layoutEdge");
            if (d.children("span").hasClass("ui-icon-close")) {
                a.hide(f)
            } else {
                a.toggle(f)
            }
        });
        b.find("a.ui-layout-unit-expand-icon").mouseover(function () {
            $(this).addClass("ui-state-hover")
        }).mouseout(function () {
            $(this).removeClass("ui-state-hover")
        })
    }, toggle: function (a) {
        this.layout.toggle(a)
    }, show: function (a) {
        this.layout.show(a)
    }, hide: function (a) {
        this.layout.hide(a)
    }, onhide: function (a, e, d) {
        if (this.cfg.onClose) {
            this.cfg.onClose.call(this, d)
        }
        if (this.hasBehavior("close")) {
            var c = this.cfg.behaviors.close;
            var b = {params: [{name: this.id + "_unit", value: a}]};
            c.call(this, a, b)
        }
    }, onshow: function (a, c, b) {
    }, onopen: function (a, c, b) {
        c.siblings(".ui-layout-resizer-" + a).removeClass("ui-widget-content ui-corner-all");
        if (this.cfg.onToggle) {
            this.cfg.onToggle.call(this, b)
        }
        if (this.hasBehavior("toggle")) {
            this.fireToggleEvent(a, false)
        }
    }, onclose: function (a, c, b) {
        c.siblings(".ui-layout-resizer-" + a).addClass("ui-widget-content ui-corner-all");
        if (!b.isHidden) {
            if (this.cfg.onToggle) {
                this.cfg.onToggle.call(this, b)
            }
            if (this.hasBehavior("toggle")) {
                this.fireToggleEvent(a, true)
            }
        }
    }, onresize: function (b, e, d) {
        if (this.cfg.onResize) {
            this.cfg.onResize.call(this, d)
        }
        if (!d.isClosed && !d.isHidden) {
            if (this.hasBehavior("resize")) {
                var a = this.cfg.behaviors.resize;
                var c = {
                    params: [{name: this.id + "_unit", value: b}, {
                        name: this.id + "_width",
                        value: d.innerWidth
                    }, {name: this.id + "_height", value: d.innerHeight}]
                };
                a.call(this, b, c)
            }
        }
    }, fireToggleEvent: function (b, d) {
        var a = this.cfg.behaviors.toggle;
        var c = {params: [{name: this.id + "_unit", value: b}, {name: this.id + "_collapsed", value: d}]};
        a.call(this, b, c)
    }, hasBehavior: function (a) {
        if (this.cfg.behaviors) {
            return this.cfg.behaviors[a] != undefined
        }
        return false
    }
});