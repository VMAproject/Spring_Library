jQuery.atmosphere = function () {
    jQuery(window).bind("unload.atmosphere", function () {
        jQuery.atmosphere.unsubscribe()
    });
    jQuery(window).keypress(function (b) {
        if (b.keyCode == 27) {
            b.preventDefault()
        }
    });
    var a = function (c) {
        var b, e = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, d = {};
        while (b = e.exec(c)) {
            d[b[1]] = b[2]
        }
        return d
    };
    return {
        version: "1.0.8", requests: [], callbacks: [], onError: function (b) {
        }, onClose: function (b) {
        }, onOpen: function (b) {
        }, onMessage: function (b) {
        }, onReconnect: function (c, b) {
        }, onMessagePublished: function (b) {
        }, onTransportFailure: function (c, b) {
        }, onLocalMessage: function (b) {
        }, AtmosphereRequest: function (A) {
            var C = {
                timeout: 300000,
                method: "GET",
                headers: {},
                contentType: "",
                callback: null,
                url: "",
                data: "",
                suspend: true,
                maxRequest: -1,
                reconnect: true,
                maxStreamingLength: 10000000,
                lastIndex: 0,
                logLevel: "info",
                requestCount: 0,
                fallbackMethod: "GET",
                fallbackTransport: "streaming",
                transport: "long-polling",
                webSocketImpl: null,
                webSocketUrl: null,
                webSocketPathDelimiter: "@@",
                enableXDR: false,
                rewriteURL: false,
                attachHeadersAsQueryString: true,
                executeCallbackBeforeReconnect: false,
                readyState: 0,
                lastTimestamp: 0,
                withCredentials: false,
                trackMessageLength: false,
                messageDelimiter: "|",
                connectTimeout: -1,
                reconnectInterval: 0,
                dropAtmosphereHeaders: true,
                uuid: 0,
                shared: false,
                readResponsesHeaders: true,
                maxReconnectOnClose: 5,
                onError: function (al) {
                },
                onClose: function (al) {
                },
                onOpen: function (al) {
                },
                onMessage: function (al) {
                },
                onReconnect: function (am, al) {
                },
                onMessagePublished: function (al) {
                },
                onTransportFailure: function (am, al) {
                },
                onLocalMessage: function (al) {
                }
            };
            var K = {
                status: 200,
                responseBody: "",
                headers: [],
                state: "messageReceived",
                transport: "polling",
                error: null,
                request: null,
                partialMessage: "",
                id: 0
            };
            var N = null;
            var h = null;
            var m = null;
            var t = null;
            var v = null;
            var W = true;
            var f = 0;
            var ai = false;
            var O = null;
            var ac;
            var j = null;
            var y = jQuery.now();
            var z;
            ak(A);
            function ad() {
                W = true;
                ai = false;
                f = 0;
                N = null;
                h = null;
                m = null;
                t = null
            }

            function q() {
                Y();
                ad()
            }

            function ak(al) {
                q();
                C = jQuery.extend(C, al)
            }

            function i() {
                return C.webSocketImpl != null || window.WebSocket || window.MozWebSocket
            }

            function G() {
                return window.EventSource
            }

            function l() {
                if (C.shared) {
                    var al = 0;
                    if (navigator.appVersion.indexOf("MSIE") != -1) {
                        al = parseFloat(navigator.appVersion.split("MSIE")[1])
                    }
                    if (al != 8) {
                        j = V(C);
                        if (j != null) {
                            if (C.logLevel == "debug") {
                                jQuery.atmosphere.debug("Storage service available. All communication will be local")
                            }
                            if (j.open(C)) {
                                return
                            }
                        }
                        if (C.logLevel == "debug") {
                            jQuery.atmosphere.debug("No Storage service available.")
                        }
                    } else {
                        jQuery.atmosphere.info("Multi tab not supported on IE 8.")
                    }
                    j = null
                }
                if (C.transport != "websocket" && C.transport != "sse") {
                    B("opening", C.transport, C);
                    k()
                } else {
                    if (C.transport == "websocket") {
                        if (!i()) {
                            E("Websocket is not supported, using request.fallbackTransport (" + C.fallbackTransport + ")")
                        } else {
                            X(false)
                        }
                    } else {
                        if (C.transport == "sse") {
                            if (!G()) {
                                E("Server Side Events(SSE) is not supported, using request.fallbackTransport (" + C.fallbackTransport + ")")
                            } else {
                                x(false)
                            }
                        }
                    }
                }
            }

            function V(ap) {
                var at, am, ao, an = "atmosphere-" + ap.url, al = {
                    storage: function () {
                        if (!jQuery.atmosphere.supportStorage()) {
                            return
                        }
                        var aw = window.localStorage, au = function (ax) {
                            return jQuery.parseJSON(aw.getItem(an + "-" + ax))
                        }, av = function (ax, ay) {
                            aw.setItem(an + "-" + ax, jQuery.stringifyJSON(ay))
                        };
                        return {
                            init: function () {
                                av("children", au("children").concat([y]));
                                jQuery(window).on("storage.socket", function (ax) {
                                    ax = ax.originalEvent;
                                    if (ax.key === an && ax.newValue) {
                                        ar(ax.newValue)
                                    }
                                });
                                return au("opened")
                            }, signal: function (ax, ay) {
                                aw.setItem(an, jQuery.stringifyJSON({target: "p", type: ax, data: ay}))
                            }, close: function () {
                                var ax, ay = au("children");
                                jQuery(window).off("storage.socket");
                                if (ay) {
                                    ax = jQuery.inArray(ap.id, ay);
                                    if (ax > -1) {
                                        ay.splice(ax, 1);
                                        av("children", ay)
                                    }
                                }
                            }
                        }
                    }, windowref: function () {
                        var au = window.open("", an.replace(/\W/g, ""));
                        if (!au || au.closed || !au.callbacks) {
                            return
                        }
                        return {
                            init: function () {
                                au.callbacks.push(ar);
                                au.children.push(y);
                                return au.opened
                            }, signal: function (av, aw) {
                                if (!au.closed && au.fire) {
                                    au.fire(jQuery.stringifyJSON({target: "p", type: av, data: aw}))
                                }
                            }, close: function () {
                                function av(ay, ax) {
                                    var aw = jQuery.inArray(ax, ay);
                                    if (aw > -1) {
                                        ay.splice(aw, 1)
                                    }
                                }

                                if (!ao) {
                                    av(au.callbacks, ar);
                                    av(au.children, y)
                                }
                            }
                        }
                    }
                };

                function ar(au) {
                    var aw = jQuery.parseJSON(au), av = aw.data;
                    if (aw.target === "c") {
                        switch (aw.type) {
                            case"open":
                                B("opening", "local", C);
                                break;
                            case"close":
                                if (!ao) {
                                    ao = true;
                                    if (av.reason === "aborted") {
                                        aa()
                                    } else {
                                        if (av.heir === y) {
                                            l()
                                        } else {
                                            setTimeout(function () {
                                                l()
                                            }, 100)
                                        }
                                    }
                                }
                                break;
                            case"message":
                                u(av, "messageReceived", 200, ap.transport);
                                break;
                            case"localMessage":
                                R(av);
                                break
                        }
                    }
                }

                function aq() {
                    var au = new RegExp("(?:^|; )(" + encodeURIComponent(an) + ")=([^;]*)").exec(document.cookie);
                    if (au) {
                        return jQuery.parseJSON(decodeURIComponent(au[2]))
                    }
                }

                at = aq();
                if (!at || jQuery.now() - at.ts > 1000) {
                    return
                }
                am = al.storage() || al.windowref();
                if (!am) {
                    return
                }
                return {
                    open: function () {
                        var au;
                        z = setInterval(function () {
                            var av = at;
                            at = aq();
                            if (!at || av.ts === at.ts) {
                                ar(jQuery.stringifyJSON({
                                    target: "c",
                                    type: "close",
                                    data: {reason: "error", heir: av.heir}
                                }))
                            }
                        }, 1000);
                        au = am.init();
                        if (au) {
                            setTimeout(function () {
                                B("opening", "local", ap)
                            }, 50)
                        }
                        return au
                    }, send: function (au) {
                        am.signal("send", au)
                    }, localSend: function (au) {
                        am.signal("localSend", jQuery.stringifyJSON({id: y, event: au}))
                    }, close: function () {
                        if (!ai) {
                            clearInterval(z);
                            am.signal("close");
                            am.close()
                        }
                    }
                }
            }

            function S() {
                var am, al = "atmosphere-" + C.url, aq = {
                    storage: function () {
                        if (!jQuery.atmosphere.supportStorage()) {
                            return
                        }
                        var ar = window.localStorage;
                        return {
                            init: function () {
                                jQuery(window).on("storage.socket", function (at) {
                                    at = at.originalEvent;
                                    if (at.key === al && at.newValue) {
                                        an(at.newValue)
                                    }
                                })
                            }, signal: function (at, au) {
                                ar.setItem(al, jQuery.stringifyJSON({target: "c", type: at, data: au}))
                            }, get: function (at) {
                                return jQuery.parseJSON(ar.getItem(al + "-" + at))
                            }, set: function (at, au) {
                                ar.setItem(al + "-" + at, jQuery.stringifyJSON(au))
                            }, close: function () {
                                jQuery(window).off("storage.socket");
                                ar.removeItem(al);
                                ar.removeItem(al + "-opened");
                                ar.removeItem(al + "-children")
                            }
                        }
                    }, windowref: function () {
                        var ar = al.replace(/\W/g, ""), at = (jQuery('iframe[name="' + ar + '"]')[0] || jQuery('<iframe name="' + ar + '" />').hide().appendTo("body")[0]).contentWindow;
                        return {
                            init: function () {
                                at.callbacks = [an];
                                at.fire = function (au) {
                                    var av;
                                    for (av = 0; av < at.callbacks.length; av++) {
                                        at.callbacks[av](au)
                                    }
                                }
                            }, signal: function (au, av) {
                                if (!at.closed && at.fire) {
                                    at.fire(jQuery.stringifyJSON({target: "c", type: au, data: av}))
                                }
                            }, get: function (au) {
                                return !at.closed ? at[au] : null
                            }, set: function (au, av) {
                                if (!at.closed) {
                                    at[au] = av
                                }
                            }, close: function () {
                            }
                        }
                    }
                };

                function an(ar) {
                    var au = jQuery.parseJSON(ar), at = au.data;
                    if (au.target === "p") {
                        switch (au.type) {
                            case"send":
                                Z(at);
                                break;
                            case"localSend":
                                R(at);
                                break;
                            case"close":
                                aa();
                                break
                        }
                    }
                }

                O = function ap(ar) {
                    am.signal("message", ar)
                };
                function ao() {
                    document.cookie = encodeURIComponent(al) + "=" + encodeURIComponent(jQuery.stringifyJSON({
                            ts: jQuery.now() + 1,
                            heir: (am.get("children") || [])[0]
                        }))
                }

                am = aq.storage() || aq.windowref();
                am.init();
                if (C.logLevel == "debug") {
                    jQuery.atmosphere.debug("Installed StorageService " + am)
                }
                am.set("children", []);
                if (am.get("opened") != null && !am.get("opened")) {
                    am.set("opened", false)
                }
                ao();
                z = setInterval(ao, 1000);
                ac = am
            }

            function B(an, aq, am) {
                if (C.shared && aq != "local") {
                    S()
                }
                if (ac != null) {
                    ac.set("opened", true)
                }
                am.close = function () {
                    aa();
                    am.reconnect = false
                };
                K.request = am;
                var ao = K.state;
                K.state = an;
                K.status = 200;
                var al = K.transport;
                K.transport = aq;
                var ap = K.responseBody;
                s();
                K.responseBody = ap;
                K.state = ao;
                K.transport = al
            }

            function p(an) {
                an.transport = "jsonp";
                var am = C;
                if ((an != null) && (typeof(an) != "undefined")) {
                    am = an
                }
                var al = am.url;
                var ao = am.data;
                if (am.attachHeadersAsQueryString) {
                    al = L(am);
                    if (ao != "") {
                        al += "&X-Atmosphere-Post-Body=" + encodeURIComponent(ao)
                    }
                    ao = ""
                }
                v = jQuery.ajax({
                    url: al, type: am.method, dataType: "jsonp", error: function (ap, ar, aq) {
                        if (ap.status < 300) {
                            F(v, am)
                        } else {
                            u(ar, "error", ap.status, am.transport)
                        }
                    }, jsonp: "jsonpTransport", success: function (ap) {
                        if (am.reconnect && (am.maxRequest == -1 || am.requestCount++ < am.maxRequest)) {
                            U(v, am);
                            if (!am.executeCallbackBeforeReconnect) {
                                F(v, am)
                            }
                            var ar = ap.message;
                            if (ar != null && typeof ar != "string") {
                                try {
                                    ar = jQuery.stringifyJSON(ar)
                                } catch (aq) {
                                }
                            }
                            u(ar, "messageReceived", 200, am.transport);
                            if (am.executeCallbackBeforeReconnect) {
                                F(v, am)
                            }
                        } else {
                            jQuery.atmosphere.log(C.logLevel, ["JSONP reconnect maximum try reached " + C.requestCount]);
                            T()
                        }
                    }, data: am.data, beforeSend: function (ap) {
                        b(ap, am, false)
                    }
                })
            }

            function P(an) {
                var am = C;
                if ((an != null) && (typeof(an) != "undefined")) {
                    am = an
                }
                var al = am.url;
                var ao = am.data;
                if (am.attachHeadersAsQueryString) {
                    al = L(am);
                    if (ao != "") {
                        al += "&X-Atmosphere-Post-Body=" + encodeURIComponent(ao)
                    }
                    ao = ""
                }
                v = jQuery.ajax({
                    url: al, type: am.method, error: function (ap, ar, aq) {
                        if (ap.status < 300) {
                            F(v, am)
                        } else {
                            u(ar, "error", ap.status, am.transport)
                        }
                    }, success: function (aq, ar, ap) {
                        if (am.reconnect && (am.maxRequest == -1 || am.requestCount++ < am.maxRequest)) {
                            if (!am.executeCallbackBeforeReconnect) {
                                F(v, am)
                            }
                            u(aq, "messageReceived", 200, am.transport);
                            if (am.executeCallbackBeforeReconnect) {
                                F(v, am)
                            }
                        } else {
                            jQuery.atmosphere.log(C.logLevel, ["AJAX reconnect maximum try reached " + C.requestCount]);
                            T()
                        }
                    }, data: am.data, beforeSend: function (ap) {
                        b(ap, am, false)
                    }
                })
            }

            function d(al) {
                if (C.webSocketImpl != null) {
                    return C.webSocketImpl
                } else {
                    if (window.WebSocket) {
                        return new WebSocket(al)
                    } else {
                        return new MozWebSocket(al)
                    }
                }
            }

            function e() {
                var al = L(C);
                return decodeURI(jQuery('<a href="' + al + '"/>')[0].href.replace(/^http/, "ws"))
            }

            function aj() {
                var al = L(C);
                return al
            }

            function x(am) {
                K.transport = "sse";
                var al = aj(C.url);
                if (C.logLevel == "debug") {
                    jQuery.atmosphere.debug("Invoking executeSSE");
                    jQuery.atmosphere.debug("Using URL: " + al)
                }
                if (am) {
                    B("re-opening", "sse", C)
                }
                if (!C.reconnect) {
                    if (h != null) {
                        Y()
                    }
                    return
                }
                h = new EventSource(al, {withCredentials: C.withCredentials});
                if (C.connectTimeout > 0) {
                    C.id = setTimeout(function () {
                        if (!am) {
                            Y()
                        }
                    }, C.connectTimeout)
                }
                h.onopen = function (an) {
                    if (C.logLevel == "debug") {
                        jQuery.atmosphere.debug("SSE successfully opened")
                    }
                    if (!am) {
                        B("opening", "sse", C)
                    }
                    am = true;
                    if (C.method == "POST") {
                        K.state = "messageReceived";
                        h.send(C.data)
                    }
                };
                h.onmessage = function (ao) {
                    if (ao.origin != "http://" + window.location.host) {
                        jQuery.atmosphere.log(C.logLevel, ["Origin was not http://" + window.location.host]);
                        return
                    }
                    K.state = "messageReceived";
                    K.status = 200;
                    var ao = ao.data;
                    var an = o(ao, C, K);
                    if (jQuery.trim(ao).length == 0) {
                        an = true
                    }
                    if (!an) {
                        s();
                        K.responseBody = ""
                    }
                };
                h.onerror = function (an) {
                    clearTimeout(C.id);
                    K.state = "closed";
                    K.responseBody = "";
                    K.status = !am ? 501 : 200;
                    s();
                    Y();
                    if (ai) {
                        jQuery.atmosphere.log(C.logLevel, ["SSE closed normally"])
                    } else {
                        if (!am) {
                            E("SSE failed. Downgrading to fallback transport and resending")
                        } else {
                            if (C.reconnect && (K.transport == "sse")) {
                                if (f++ < C.maxReconnectOnClose) {
                                    C.id = setTimeout(function () {
                                        x(true)
                                    }, C.reconnectInterval);
                                    K.responseBody = ""
                                } else {
                                    jQuery.atmosphere.log(C.logLevel, ["SSE reconnect maximum try reached " + f]);
                                    T()
                                }
                            }
                        }
                    }
                }
            }

            function X(am) {
                K.transport = "websocket";
                var al = e(C.url);
                var an = false;
                if (C.logLevel == "debug") {
                    jQuery.atmosphere.debug("Invoking executeWebSocket");
                    jQuery.atmosphere.debug("Using URL: " + al)
                }
                if (am) {
                    B("re-opening", "websocket", C)
                }
                if (!C.reconnect) {
                    if (N != null) {
                        Y()
                    }
                    return
                }
                N = d(al);
                if (C.connectTimeout > 0) {
                    C.id = setTimeout(function () {
                        if (!am) {
                            var ao = {code: 1002, reason: "", wasClean: false};
                            N.onclose(ao);
                            try {
                                Y()
                            } catch (ap) {
                            }
                        }
                    }, C.connectTimeout)
                }
                N.onopen = function (ao) {
                    if (C.logLevel == "debug") {
                        jQuery.atmosphere.debug("Websocket successfully opened")
                    }
                    if (!am) {
                        B("opening", "websocket", C)
                    }
                    am = true;
                    if (C.method == "POST") {
                        K.state = "messageReceived";
                        N.send(C.data)
                    }
                };
                N.onmessage = function (ap) {
                    if (ap.data.indexOf("parent.callback") != -1) {
                        jQuery.atmosphere.log(C.logLevel, ["parent.callback no longer supported with 0.8 version and up. Please upgrade"])
                    }
                    K.state = "messageReceived";
                    K.status = 200;
                    var ap = ap.data;
                    var ao = o(ap, C, K);
                    if (!ao) {
                        s();
                        K.responseBody = ""
                    }
                };
                N.onerror = function (ao) {
                    clearTimeout(C.id)
                };
                N.onclose = function (ao) {
                    if (an) {
                        return
                    }
                    var ap = ao.reason;
                    if (ap === "") {
                        switch (ao.code) {
                            case 1000:
                                ap = "Normal closure; the connection successfully completed whatever purpose for which it was created.";
                                break;
                            case 1001:
                                ap = "The endpoint is going away, either because of a server failure or because the browser is navigating away from the page that opened the connection.";
                                break;
                            case 1002:
                                ap = "The endpoint is terminating the connection due to a protocol error.";
                                break;
                            case 1003:
                                ap = "The connection is being terminated because the endpoint received data of a type it cannot accept (for example, a text-only endpoint received binary data).";
                                break;
                            case 1004:
                                ap = "The endpoint is terminating the connection because a data frame was received that is too large.";
                                break;
                            case 1005:
                                ap = "Unknown: no status code was provided even though one was expected.";
                                break;
                            case 1006:
                                ap = "Connection was closed abnormally (that is, with no close frame being sent).";
                                break
                        }
                    }
                    jQuery.atmosphere.warn("Websocket closed, reason: " + ap);
                    jQuery.atmosphere.warn("Websocket closed, wasClean: " + ao.wasClean);
                    K.state = "closed";
                    K.responseBody = "";
                    K.status = !am ? 501 : 200;
                    s();
                    clearTimeout(C.id);
                    an = true;
                    if (ai) {
                        jQuery.atmosphere.log(C.logLevel, ["Websocket closed normally"])
                    } else {
                        if (!am) {
                            E("Websocket failed. Downgrading to Comet and resending")
                        } else {
                            if (C.reconnect && K.transport == "websocket") {
                                Y();
                                if (C.reconnect && f++ < C.maxReconnectOnClose) {
                                    C.id = setTimeout(function () {
                                        K.responseBody = "";
                                        X(true)
                                    }, C.connectTimeout)
                                } else {
                                    jQuery.atmosphere.log(C.logLevel, ["Websocket reconnect maximum try reached " + f]);
                                    jQuery.atmosphere.warn("Websocket error, reason: " + ao.reason);
                                    T()
                                }
                            }
                        }
                    }
                }
            }

            function T() {
                Y();
                K.state = "error";
                K.responseBody = "";
                K.status = 500;
                s()
            }

            function o(ap, ao, al) {
                if (ao.trackMessageLength) {
                    if (al.partialMessage.length != 0) {
                        ap = al.partialMessage + ap
                    }
                    var an = [];
                    var aq = 0;
                    var am = ap.indexOf(ao.messageDelimiter);
                    while (am != -1) {
                        aq = ap.substring(aq, am);
                        ap = ap.substring(am + ao.messageDelimiter.length, ap.length);
                        if (ap.length == 0 || ap.length < aq) {
                            break
                        }
                        am = ap.indexOf(ao.messageDelimiter);
                        an.push(ap.substring(0, aq))
                    }
                    if (an.length == 0 || (am != -1 && ap.length != 0 && aq != ap.length)) {
                        al.partialMessage = aq + ao.messageDelimiter + ap
                    } else {
                        al.partialMessage = ""
                    }
                    if (an.length != 0) {
                        al.responseBody = an.join(ao.messageDelimiter);
                        return false
                    } else {
                        return true
                    }
                } else {
                    al.responseBody = ap
                }
                return false
            }

            function E(al) {
                jQuery.atmosphere.log(C.logLevel, [al]);
                if (typeof(C.onTransportFailure) != "undefined") {
                    C.onTransportFailure(al, C)
                } else {
                    if (typeof(jQuery.atmosphere.onTransportFailure) != "undefined") {
                        jQuery.atmosphere.onTransportFailure(al, C)
                    }
                }
                C.transport = C.fallbackTransport;
                var am = C.reconnect && f++ < C.maxReconnectOnClose;
                if (am && C.transport != "none" || C.transport == null) {
                    C.method = C.fallbackMethod;
                    K.transport = C.fallbackTransport;
                    C.id = setTimeout(function () {
                        l()
                    }, C.reconnectInterval)
                } else {
                    if (!am) {
                        T()
                    }
                }
            }

            function L(an) {
                var am = C;
                if ((an != null) && (typeof(an) != "undefined")) {
                    am = an
                }
                var al = am.url;
                if (!am.attachHeadersAsQueryString) {
                    return al
                }
                if (al.indexOf("X-Atmosphere-Framework") != -1) {
                    return al
                }
                al += (al.indexOf("?") != -1) ? "&" : "?";
                al += "X-Atmosphere-tracking-id=" + am.uuid;
                al += "&X-Atmosphere-Framework=" + jQuery.atmosphere.version;
                al += "&X-Atmosphere-Transport=" + am.transport;
                if (am.trackMessageLength) {
                    al += "&X-Atmosphere-TrackMessageSize=true"
                }
                if (am.lastTimestamp != undefined) {
                    al += "&X-Cache-Date=" + am.lastTimestamp
                } else {
                    al += "&X-Cache-Date=" + 0
                }
                if (am.contentType != "") {
                    al += "&Content-Type=" + am.contentType
                }
                jQuery.each(am.headers, function (ao, aq) {
                    var ap = jQuery.isFunction(aq) ? aq.call(this, am, an, K) : aq;
                    if (ap != null) {
                        al += "&" + encodeURIComponent(ao) + "=" + encodeURIComponent(ap)
                    }
                });
                return al
            }

            function ae() {
                var al;
                if (jQuery.browser.msie) {
                    if (typeof XMLHttpRequest == "undefined") {
                        XMLHttpRequest = function () {
                            try {
                                return new ActiveXObject("Msxml2.XMLHTTP.6.0")
                            } catch (am) {
                            }
                            try {
                                return new ActiveXObject("Msxml2.XMLHTTP.3.0")
                            } catch (am) {
                            }
                            try {
                                return new ActiveXObject("Microsoft.XMLHTTP")
                            } catch (am) {
                            }
                            throw new Error("This browser does not support XMLHttpRequest.")
                        }
                    }
                }
                return new XMLHttpRequest()
            }

            function k(an) {
                var al = C;
                if ((an != null) || (typeof(an) != "undefined")) {
                    al = an
                }
                if ((al.transport == "jsonp") || ((al.enableXDR) && (jQuery.atmosphere.checkCORSSupport()))) {
                    p(al);
                    return
                }
                if (al.transport == "ajax") {
                    P(an);
                    return
                }
                if ((al.transport == "streaming") && (jQuery.browser.msie)) {
                    al.enableXDR && window.XDomainRequest ? D(al) : ah(al);
                    return
                }
                if ((al.enableXDR) && (window.XDomainRequest)) {
                    D(al);
                    return
                }
                if (al.reconnect && (al.maxRequest == -1 || al.requestCount++ < al.maxRequest)) {
                    var am = ae();
                    b(am, al, true);
                    if (al.suspend) {
                        m = am
                    }
                    if (al.transport != "polling") {
                        K.transport = al.transport
                    }
                    if (!jQuery.browser.msie) {
                        am.onerror = function () {
                            try {
                                K.status = XMLHttpRequest.status
                            } catch (ao) {
                                K.status = 500
                            }
                            if (!K.status) {
                                K.status = 500
                            }
                            Y();
                            K.state = "error";
                            s();
                            if (al.reconnect) {
                                F(am, al, true)
                            } else {
                                T()
                            }
                        }
                    }
                    am.onreadystatechange = function () {
                        if (ai) {
                            return
                        }
                        var aq = false;
                        var ap = false;
                        if (al.transport == "streaming" && (al.readyState > 2 && am.readyState == 4)) {
                            al.readyState = 0;
                            al.lastIndex = 0;
                            F(am, al, true);
                            return
                        }
                        al.readyState = am.readyState;
                        if (am.readyState == 4) {
                            if (jQuery.browser.msie) {
                                ap = true
                            } else {
                                if (al.transport == "streaming") {
                                    ap = true
                                } else {
                                    if (al.transport == "long-polling") {
                                        ap = true;
                                        clearTimeout(al.id)
                                    }
                                }
                            }
                        } else {
                            if (!jQuery.browser.msie && am.readyState == 3 && am.status == 200 && al.transport != "long-polling") {
                                ap = true
                            } else {
                                clearTimeout(al.id)
                            }
                        }
                        if (ap) {
                            var at = am.responseText;
                            if (am.status >= 500 || am.status == 0) {
                                T();
                                return
                            }
                            U(am, C);
                            if (al.transport == "streaming") {
                                var aw = at.substring(al.lastIndex, at.length);
                                K.isJunkEnded = true;
                                if (!K.junkFull && (aw.indexOf("<!-- Welcome to the Atmosphere Framework.") == -1 || aw.indexOf("<!-- EOD -->") == -1)) {
                                    return
                                }
                                K.junkFull = true;
                                if (al.lastIndex == 0 && aw.indexOf("<!-- Welcome to the Atmosphere Framework.") != -1 && aw.indexOf("<!-- EOD -->") != -1) {
                                    K.isJunkEnded = false
                                }
                                if (!K.isJunkEnded) {
                                    var av = "<!-- EOD -->";
                                    var au = av.length;
                                    var ao = aw.indexOf(av) + au;
                                    if (ao > au && ao != aw.length) {
                                        K.responseBody = aw.substring(ao);
                                        aq = o(K.responseBody, al, K)
                                    } else {
                                        aq = true
                                    }
                                } else {
                                    var ax = at.substring(al.lastIndex, at.length);
                                    aq = o(ax, al, K)
                                }
                                al.lastIndex = at.length;
                                if (jQuery.browser.opera) {
                                    jQuery.atmosphere.iterate(function () {
                                        if (am.responseText.length > al.lastIndex) {
                                            try {
                                                K.status = am.status;
                                                K.headers = a(am.getAllResponseHeaders());
                                                U(am, C)
                                            } catch (ay) {
                                                K.status = 404
                                            }
                                            K.state = "messageReceived";
                                            K.responseBody = am.responseText.substring(al.lastIndex);
                                            al.lastIndex = am.responseText.length;
                                            s();
                                            if ((al.transport == "streaming") && (am.responseText.length > al.maxStreamingLength)) {
                                                Y();
                                                b(ae(), al, true)
                                            }
                                        }
                                    }, 0)
                                }
                                if (aq) {
                                    return
                                }
                            } else {
                                aq = o(at, al, K);
                                al.lastIndex = at.length
                            }
                            try {
                                K.status = am.status;
                                K.headers = a(am.getAllResponseHeaders());
                                U(am, al)
                            } catch (ar) {
                                K.status = 404
                            }
                            if (al.suspend) {
                                K.state = K.status == 0 ? "closed" : "messageReceived"
                            } else {
                                K.state = "messagePublished"
                            }
                            if (!al.executeCallbackBeforeReconnect) {
                                F(am, al, false)
                            }
                            if (K.responseBody.indexOf("parent.callback") != -1) {
                                jQuery.atmosphere.log(al.logLevel, ["parent.callback no longer supported with 0.8 version and up. Please upgrade"])
                            }
                            s();
                            if (al.executeCallbackBeforeReconnect) {
                                F(am, al, false)
                            }
                            if ((al.transport == "streaming") && (at.length > al.maxStreamingLength)) {
                                Y();
                                b(ae(), al, true)
                            }
                        }
                    };
                    am.send(al.data);
                    if (al.suspend) {
                        al.id = setTimeout(function () {
                            if (W) {
                                Y();
                                ak(al);
                                setTimeout(function () {
                                    l()
                                }, al.reconnectInterval)
                            }
                        }, al.timeout)
                    }
                    W = true
                } else {
                    if (al.logLevel == "debug") {
                        jQuery.atmosphere.log(al.logLevel, ["Max re-connection reached."])
                    }
                    T()
                }
            }

            function b(an, ao, am) {
                var al = L(ao);
                al = jQuery.atmosphere.prepareURL(al);
                if (am) {
                    an.open(ao.method, al, true);
                    if (ao.connectTimeout > -1) {
                        ao.id = setTimeout(function () {
                            if (ao.requestCount == 0) {
                                Y();
                                u("Connect timeout", "closed", 200, ao.transport)
                            }
                        }, ao.connectTimeout)
                    }
                }
                if (C.withCredentials) {
                    if ("withCredentials" in an) {
                        an.withCredentials = true
                    }
                }
                if (!C.dropAtmosphereHeaders) {
                    an.setRequestHeader("X-Atmosphere-Framework", jQuery.atmosphere.version);
                    an.setRequestHeader("X-Atmosphere-Transport", ao.transport);
                    if (ao.lastTimestamp != undefined) {
                        an.setRequestHeader("X-Cache-Date", ao.lastTimestamp)
                    } else {
                        an.setRequestHeader("X-Cache-Date", 0)
                    }
                    if (ao.trackMessageLength) {
                        an.setRequestHeader("X-Atmosphere-TrackMessageSize", "true")
                    }
                    if (ao.contentType != "") {
                        an.setRequestHeader("Content-Type", ao.contentType)
                    }
                    an.setRequestHeader("X-Atmosphere-tracking-id", ao.uuid)
                }
                jQuery.each(ao.headers, function (ap, ar) {
                    var aq = jQuery.isFunction(ar) ? ar.call(this, an, ao, am, K) : ar;
                    if (aq != null) {
                        an.setRequestHeader(ap, aq)
                    }
                })
            }

            function F(al, am, ao) {
                var an = am.reconnect && f++ < am.maxReconnectOnClose;
                if (an && ao || (am.suspend && al.status == 200 && am.transport != "streaming" && W)) {
                    if (am.reconnect) {
                        B("re-opening", am.transport, am);
                        am.id = setTimeout(function () {
                            k()
                        }, am.reconnectInterval)
                    }
                } else {
                    if (!an) {
                        T()
                    }
                }
            }

            function D(al) {
                t = J(al);
                t.open()
            }

            function J(an) {
                var am = C;
                if ((an != null) && (typeof(an) != "undefined")) {
                    am = an
                }
                var at = am.transport;
                var ar = 0;
                var aq = function (av) {
                    var ay = av.responseText;
                    var az = false;
                    if (ay.indexOf("<!-- Welcome to the Atmosphere Framework.") != -1) {
                        az = true
                    }
                    if (az) {
                        var ax = "<!-- EOD -->";
                        var au = ax.length;
                        var aw = ay.indexOf(ax);
                        if (aw !== -1) {
                            ay = ay.substring(aw + au + ar);
                            ar += ay.length
                        }
                    }
                    u(ay, "messageReceived", 200, at)
                };
                var al = new window.XDomainRequest();
                var ap = am.rewriteURL || function (av) {
                        var au = /(?:^|;\s*)(JSESSIONID|PHPSESSID)=([^;]*)/.exec(document.cookie);
                        switch (au && au[1]) {
                            case"JSESSIONID":
                                return av.replace(/;jsessionid=[^\?]*|(\?)|$/, ";jsessionid=" + au[2] + "$1");
                            case"PHPSESSID":
                                return av.replace(/\?PHPSESSID=[^&]*&?|\?|$/, "?PHPSESSID=" + au[2] + "&").replace(/&$/, "")
                        }
                        return av
                    };
                al.onprogress = function () {
                    ao(al)
                };
                al.onerror = function () {
                    if (am.transport != "polling") {
                        u(al.responseText, "error", 500, at)
                    }
                    F(al, am, false)
                };
                al.onload = function () {
                    ao(al)
                };
                var ao = function (au) {
                    if (am.lastMessage == au.responseText) {
                        return
                    }
                    if (am.executeCallbackBeforeReconnect) {
                        aq(au)
                    }
                    am.lastTimestamp = jQuery.now();
                    if (am.transport == "long-polling" && (am.reconnect && (am.maxRequest == -1 || am.requestCount++ < am.maxRequest))) {
                        au.status = 200;
                        F(au, am, false)
                    }
                    if (!am.executeCallbackBeforeReconnect) {
                        aq(au)
                    }
                    am.lastMessage = au.responseText
                };
                return {
                    open: function () {
                        if (am.method == "POST") {
                            am.attachHeadersAsQueryString = true
                        }
                        var au = L(am);
                        if (am.method == "POST") {
                            au += "&X-Atmosphere-Post-Body=" + encodeURIComponent(am.data)
                        }
                        al.open(am.method, ap(au));
                        al.send();
                        if (am.connectTimeout > -1) {
                            am.id = setTimeout(function () {
                                if (am.requestCount == 0) {
                                    Y();
                                    u("Connect timeout", "closed", 200, am.transport)
                                }
                            }, am.connectTimeout)
                        }
                    }, close: function () {
                        al.abort();
                        af();
                        u(al.responseText, "closed", 200, at)
                    }
                }
            }

            function ah(al) {
                t = n(al);
                t.open()
            }

            function n(ao) {
                var an = C;
                if ((ao != null) && (typeof(ao) != "undefined")) {
                    an = ao
                }
                var am;
                var ap = new window.ActiveXObject("htmlfile");
                ap.open();
                ap.close();
                var al = an.url;
                if (an.transport != "polling") {
                    K.transport = an.transport
                }
                return {
                    open: function () {
                        var aq = ap.createElement("iframe");
                        al = L(an);
                        if (an.data != "") {
                            al += "&X-Atmosphere-Post-Body=" + encodeURIComponent(an.data)
                        }
                        al = jQuery.atmosphere.prepareURL(al);
                        aq.src = al;
                        ap.body.appendChild(aq);
                        var ar = aq.contentDocument || aq.contentWindow.document;
                        am = jQuery.atmosphere.iterate(function () {
                            try {
                                if (!ar.firstChild) {
                                    return
                                }
                                if (ar.readyState === "complete") {
                                    try {
                                        jQuery.noop(ar.fileSize)
                                    } catch (ay) {
                                        u("Connection Failure", "error", 500, an.transport);
                                        return false
                                    }
                                }
                                var av = ar.body ? ar.body.lastChild : ar;
                                var ax = function () {
                                    var aE = av.cloneNode(true);
                                    aE.appendChild(ar.createTextNode("."));
                                    var aC = aE.innerText;
                                    var aD = true;
                                    if (aC.indexOf("<!-- Welcome to the Atmosphere Framework.") == -1) {
                                        aD = false
                                    }
                                    if (aD) {
                                        var aB = "<!-- EOD -->";
                                        var az = aB.length;
                                        var aA = aC.indexOf(aB) + az;
                                        aC = aC.substring(aA)
                                    }
                                    return aC.substring(0, aC.length - 1)
                                };
                                if (!jQuery.nodeName(av, "pre")) {
                                    var au = ar.head || ar.getElementsByTagName("head")[0] || ar.documentElement || ar;
                                    var at = ar.createElement("script");
                                    at.text = "document.write('<plaintext>')";
                                    au.insertBefore(at, au.firstChild);
                                    au.removeChild(at);
                                    av = ar.body.lastChild
                                }
                                u(ax(), "opening", 200, an.transport);
                                am = jQuery.atmosphere.iterate(function () {
                                    var az = ax();
                                    if (az.length > an.lastIndex) {
                                        K.status = 200;
                                        av.innerText = "";
                                        u(az, "messageReceived", 200, an.transport);
                                        an.lastIndex = 0
                                    }
                                    if (ar.readyState === "complete") {
                                        u("", "closed", 200, an.transport);
                                        u("", "re-opening", 200, an.transport);
                                        ah(an);
                                        return false
                                    }
                                }, null);
                                return false
                            } catch (aw) {
                                T();
                                jQuery.atmosphere.error(aw)
                            }
                        })
                    }, close: function () {
                        if (am) {
                            am()
                        }
                        ap.execCommand("Stop");
                        u("", "closed", 200, an.transport)
                    }
                }
            }

            function Z(al) {
                if (j != null) {
                    g(al)
                } else {
                    if (m != null || h != null) {
                        c(al)
                    } else {
                        if (t != null) {
                            M(al)
                        } else {
                            if (v != null) {
                                I(al)
                            } else {
                                if (N != null) {
                                    w(al)
                                }
                            }
                        }
                    }
                }
            }

            function g(al) {
                j.send(al)
            }

            function r(am) {
                if (am.length == 0) {
                    return
                }
                try {
                    if (j) {
                        j.localSend(am)
                    } else {
                        ac.signal("localMessage", jQuery.stringifyJSON({id: y, event: am}))
                    }
                } catch (al) {
                    jQuery.atmosphere.error(al)
                }
            }

            function c(am) {
                var al = ab(am);
                k(al)
            }

            function M(am) {
                if (C.enableXDR && jQuery.atmosphere.checkCORSSupport()) {
                    var al = ab(am);
                    al.reconnect = false;
                    p(al)
                } else {
                    c(am)
                }
            }

            function I(al) {
                c(al)
            }

            function H(al) {
                var am = al;
                if (typeof(am) == "object") {
                    am = al.data
                }
                return am
            }

            function ab(am) {
                var an = H(am);
                var al = {
                    connected: false,
                    timeout: 60000,
                    method: "POST",
                    url: C.url,
                    contentType: C.contentType,
                    headers: {},
                    reconnect: true,
                    callback: null,
                    data: an,
                    suspend: false,
                    maxRequest: -1,
                    logLevel: "info",
                    requestCount: 0,
                    withCredentials: C.withCredentials,
                    transport: "polling",
                    attachHeadersAsQueryString: true,
                    enableXDR: C.enableXDR,
                    uuid: C.uuid,
                    maxReconnectOnClose: C.maxReconnectOnClose
                };
                if (typeof(am) == "object") {
                    al = jQuery.extend(al, am)
                }
                return al
            }

            function w(al) {
                var ao = H(al);
                var am;
                try {
                    if (C.webSocketUrl != null) {
                        am = C.webSocketPathDelimiter + C.webSocketUrl + C.webSocketPathDelimiter + ao
                    } else {
                        am = ao
                    }
                    N.send(am)
                } catch (an) {
                    N.onclose = function (ap) {
                    };
                    Y();
                    E("Websocket failed. Downgrading to Comet and resending " + am);
                    c(al)
                }
            }

            function R(am) {
                var al = jQuery.parseJSON(am);
                if (al.id != y) {
                    if (typeof(C.onLocalMessage) != "undefined") {
                        C.onLocalMessage(al.event)
                    } else {
                        if (typeof(jQuery.atmosphere.onLocalMessage) != "undefined") {
                            jQuery.atmosphere.onLocalMessage(al.event)
                        }
                    }
                }
            }

            function u(ao, al, am, an) {
                if (al == "messageReceived") {
                    if (o(ao, C, K)) {
                        return
                    }
                }
                K.transport = an;
                K.status = am;
                K.state = al;
                K.responseBody = ao;
                s()
            }

            function U(al, ao) {
                if (!ao.readResponsesHeaders) {
                    ao.lastTimestamp = jQuery.now();
                    ao.uuid = jQuery.atmosphere.guid();
                    return
                }
                try {
                    var an = al.getResponseHeader("X-Cache-Date");
                    if (an && an != null && an.length > 0) {
                        ao.lastTimestamp = an.split(" ").pop()
                    }
                    var am = al.getResponseHeader("X-Atmosphere-tracking-id");
                    if (am && am != null) {
                        ao.uuid = am.split(" ").pop()
                    }
                    if (ao.headers) {
                        jQuery.each(C.headers, function (ar) {
                            var aq = al.getResponseHeader(ar);
                            if (aq) {
                                K.headers[ar] = aq
                            }
                        })
                    }
                } catch (ap) {
                }
            }

            function Q(al) {
                ag(al, C);
                ag(al, jQuery.atmosphere)
            }

            function ag(al, am) {
                switch (al.state) {
                    case"messageReceived":
                        f = 0;
                        if (typeof(am.onMessage) != "undefined") {
                            am.onMessage(al)
                        }
                        break;
                    case"error":
                        if (typeof(am.onError) != "undefined") {
                            am.onError(al)
                        }
                        break;
                    case"opening":
                        if (typeof(am.onOpen) != "undefined") {
                            am.onOpen(al)
                        }
                        break;
                    case"messagePublished":
                        if (typeof(am.onMessagePublished) != "undefined") {
                            am.onMessagePublished(al)
                        }
                        break;
                    case"re-opening":
                        if (typeof(am.onReconnect) != "undefined") {
                            am.onReconnect(C, al)
                        }
                        break;
                    case"unsubscribe":
                    case"closed":
                        if (typeof(am.onClose) != "undefined") {
                            am.onClose(al)
                        }
                        break
                }
            }

            function s() {
                var ao = function (ar, at) {
                    at(K)
                };
                if (j == null && O != null) {
                    O(K.responseBody)
                }
                var ap = typeof((K.responseBody) == "string" && C.trackMessageLength) ? K.responseBody.split(C.messageDelimiter) : new Array(K.responseBody);
                for (var am = 0; am < ap.length; am++) {
                    if (ap.length > 1 && ap[am].length == 0) {
                        continue
                    }
                    K.responseBody = jQuery.trim(ap[am]);
                    if (K.responseBody.length == 0 && K.transport == "streaming" && K.state == "messageReceived") {
                        var al = navigator.userAgent.toLowerCase();
                        var an = al.indexOf("android") > -1;
                        if (an) {
                            continue
                        }
                    }
                    Q(K);
                    if (jQuery.atmosphere.callbacks.length > 0) {
                        if (C.logLevel == "debug") {
                            jQuery.atmosphere.debug("Invoking " + jQuery.atmosphere.callbacks.length + " global callbacks: " + K.state)
                        }
                        try {
                            jQuery.each(jQuery.atmosphere.callbacks, ao)
                        } catch (aq) {
                            jQuery.atmosphere.log(C.logLevel, ["Callback exception" + aq])
                        }
                    }
                    if (typeof(C.callback) == "function") {
                        if (C.logLevel == "debug") {
                            jQuery.atmosphere.debug("Invoking request callbacks")
                        }
                        try {
                            C.callback(K)
                        } catch (aq) {
                            jQuery.atmosphere.log(C.logLevel, ["Callback exception" + aq])
                        }
                    }
                }
            }

            function aa() {
                C.reconnect = false;
                K.request = C;
                W = false;
                ai = true;
                K.state = "unsubscribe";
                K.responseBody = "";
                K.status = 408;
                s();
                Y()
            }

            function Y() {
                if (t != null) {
                    t.close();
                    t = null
                }
                if (v != null) {
                    v.abort();
                    v = null
                }
                if (m != null) {
                    m.abort();
                    m = null
                }
                if (N != null) {
                    N.close();
                    N = null
                }
                if (h != null) {
                    h.close();
                    h = null
                }
                af()
            }

            function af() {
                if (ac != null) {
                    clearInterval(z);
                    document.cookie = encodeURIComponent("atmosphere-" + C.url) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    ac.signal("close", {reason: "", heir: !ai ? y : (ac.get("children") || [])[0]});
                    ac.close()
                }
                if (j != null) {
                    j.close()
                }
            }

            this.subscribe = function (al) {
                ak(al);
                l()
            };
            this.execute = function () {
                l()
            };
            this.invokeCallback = function () {
                s()
            };
            this.close = function () {
                aa()
            };
            this.getUrl = function () {
                return C.url
            };
            this.push = function (al) {
                Z(al)
            };
            this.pushLocal = function (al) {
                r(al)
            };
            this.response = K
        }, subscribe: function (b, e, d) {
            if (typeof(e) == "function") {
                jQuery.atmosphere.addCallback(e)
            }
            if (typeof(b) != "string") {
                d = b
            } else {
                d.url = b
            }
            var c = new jQuery.atmosphere.AtmosphereRequest(d);
            c.execute();
            jQuery.atmosphere.requests[jQuery.atmosphere.requests.length] = c;
            return c
        }, addCallback: function (b) {
            if (jQuery.inArray(b, jQuery.atmosphere.callbacks) == -1) {
                jQuery.atmosphere.callbacks.push(b)
            }
        }, removeCallback: function (c) {
            var b = jQuery.inArray(c, jQuery.atmosphere.callbacks);
            if (b != -1) {
                jQuery.atmosphere.callbacks.splice(b, 1)
            }
        }, unsubscribe: function () {
            if (jQuery.atmosphere.requests.length > 0) {
                for (var b = 0; b < jQuery.atmosphere.requests.length; b++) {
                    jQuery.atmosphere.requests[b].close();
                    clearTimeout(jQuery.atmosphere.requests[b].id)
                }
            }
            jQuery.atmosphere.requests = [];
            jQuery.atmosphere.callbacks = []
        }, unsubscribeUrl: function (c) {
            var b = -1;
            if (jQuery.atmosphere.requests.length > 0) {
                for (var e = 0; e < jQuery.atmosphere.requests.length; e++) {
                    var d = jQuery.atmosphere.requests[e];
                    if (d.getUrl() == c) {
                        d.close();
                        clearTimeout(d.id);
                        b = e;
                        break
                    }
                }
            }
            if (b >= 0) {
                jQuery.atmosphere.requests.splice(b, 1)
            }
        }, publish: function (c) {
            if (typeof(c.callback) == "function") {
                jQuery.atmosphere.addCallback(callback)
            }
            c.transport = "polling";
            var b = new jQuery.atmosphere.AtmosphereRequest(c);
            jQuery.atmosphere.requests[jQuery.atmosphere.requests.length] = b;
            return b
        }, checkCORSSupport: function () {
            if (jQuery.browser.msie && !window.XDomainRequest) {
                return true
            } else {
                if (jQuery.browser.opera && jQuery.browser.version < 12) {
                    return true
                }
            }
            var b = navigator.userAgent.toLowerCase();
            var c = b.indexOf("android") > -1;
            if (c) {
                return true
            }
            return false
        }, S4: function () {
            return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1)
        }, guid: function () {
            return (jQuery.atmosphere.S4() + jQuery.atmosphere.S4() + "-" + jQuery.atmosphere.S4() + "-" + jQuery.atmosphere.S4() + "-" + jQuery.atmosphere.S4() + "-" + jQuery.atmosphere.S4() + jQuery.atmosphere.S4() + jQuery.atmosphere.S4())
        }, prepareURL: function (c) {
            var d = jQuery.now();
            var b = c.replace(/([?&])_=[^&]*/, "$1_=" + d);
            return b + (b === c ? (/\?/.test(c) ? "&" : "?") + "_=" + d : "")
        }, param: function (b) {
            return jQuery.param(b, jQuery.ajaxSettings.traditional)
        }, supportStorage: function () {
            var c = window.localStorage;
            if (c) {
                try {
                    c.setItem("t", "t");
                    c.removeItem("t");
                    return window.StorageEvent && !jQuery.browser.msie && !(jQuery.browser.mozilla && jQuery.browser.version.split(".")[0] === "1")
                } catch (b) {
                }
            }
            return false
        }, iterate: function (d, c) {
            var e;
            c = c || 0;
            (function b() {
                e = setTimeout(function () {
                    if (d() === false) {
                        return
                    }
                    b()
                }, c)
            })();
            return function () {
                clearTimeout(e)
            }
        }, log: function (d, c) {
            if (window.console) {
                var b = window.console[d];
                if (typeof b == "function") {
                    b.apply(window.console, c)
                }
            }
        }, warn: function () {
            jQuery.atmosphere.log("warn", arguments)
        }, info: function () {
            jQuery.atmosphere.log("info", arguments)
        }, debug: function () {
            jQuery.atmosphere.log("debug", arguments)
        }, error: function () {
            jQuery.atmosphere.log("error", arguments)
        }
    }
}();
(function (d) {
    var g = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, c = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    };

    function a(f) {
        return '"' + f.replace(g, function (h) {
                var i = c[h];
                return typeof i === "string" ? i : "\\u" + ("0000" + h.charCodeAt(0).toString(16)).slice(-4)
            }) + '"'
    }

    function b(f) {
        return f < 10 ? "0" + f : f
    }

    function e(m, l) {
        var k, j, f, h, o = l[m], n = typeof o;
        if (o && typeof o === "object" && typeof o.toJSON === "function") {
            o = o.toJSON(m);
            n = typeof o
        }
        switch (n) {
            case"string":
                return a(o);
            case"number":
                return isFinite(o) ? String(o) : "null";
            case"boolean":
                return String(o);
            case"object":
                if (!o) {
                    return "null"
                }
                switch (Object.prototype.toString.call(o)) {
                    case"[object Date]":
                        return isFinite(o.valueOf()) ? '"' + o.getUTCFullYear() + "-" + b(o.getUTCMonth() + 1) + "-" + b(o.getUTCDate()) + "T" + b(o.getUTCHours()) + ":" + b(o.getUTCMinutes()) + ":" + b(o.getUTCSeconds()) + 'Z"' : "null";
                    case"[object Array]":
                        f = o.length;
                        h = [];
                        for (k = 0; k < f; k++) {
                            h.push(e(k, o) || "null")
                        }
                        return "[" + h.join(",") + "]";
                    default:
                        h = [];
                        for (k in o) {
                            if (Object.prototype.hasOwnProperty.call(o, k)) {
                                j = e(k, o);
                                if (j) {
                                    h.push(a(k) + ":" + j)
                                }
                            }
                        }
                        return "{" + h.join(",") + "}"
                }
        }
    }

    d.stringifyJSON = function (f) {
        if (window.JSON && window.JSON.stringify) {
            return window.JSON.stringify(f)
        }
        return e("", {"": f})
    }
}(jQuery));
PrimeFaces.widget.Socket = PrimeFaces.widget.BaseWidget.extend({
    init: function (b) {
        this.cfg = b;
        var a = this;
        this.cfg.request = {
            url: this.cfg.url,
            transport: "websocket",
            fallbackTransport: "long-polling",
            enableXDR: false,
            onMessage: function (c) {
                a.onMessage(c)
            }
        };
        if (this.cfg.autoConnect) {
            this.connect()
        }
    }, connect: function (a) {
        if (a) {
            this.cfg.request.url += a
        }
        this.connection = $.atmosphere.subscribe(this.cfg.request)
    }, push: function (a) {
        this.connection.push(JSON.stringify(a))
    }, disconnect: function () {
        this.connection.close()
    }, onMessage: function (a) {
        var b = $.parseJSON(a.responseBody);
        if (this.cfg.onMessage) {
            this.cfg.onMessage.call(this, b.data)
        }
        if (this.cfg.behaviors && this.cfg.behaviors.message) {
            this.cfg.behaviors.message.call(this)
        }
    }
});