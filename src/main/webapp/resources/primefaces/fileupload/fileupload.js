(function (b) {
    var a = 0;
    b.ajaxTransport("iframe", function (c, g, f) {
        if (c.type === "POST" || c.type === "GET") {
            var e, d;
            return {
                send: function (i, h) {
                    e = b('<form style="display:none;"></form>');
                    d = b('<iframe src="javascript:false;" name="iframe-transport-' + (a += 1) + '"></iframe>').bind("load", function () {
                        var j;
                        d.unbind("load").bind("load", function () {
                            var k;
                            try {
                                k = d.contents();
                                if (!k.length || !k[0].firstChild) {
                                    throw new Error()
                                }
                            } catch (l) {
                                k = undefined
                            }
                            h(200, "success", {iframe: k});
                            b('<iframe src="javascript:false;"></iframe>').appendTo(e);
                            e.remove()
                        });
                        e.prop("target", d.prop("name")).prop("action", c.url).prop("method", c.type);
                        if (c.formData) {
                            b.each(c.formData, function (k, l) {
                                b('<input type="hidden"/>').prop("name", l.name).val(l.value).appendTo(e)
                            })
                        }
                        if (c.fileInput && c.fileInput.length && c.type === "POST") {
                            j = c.fileInput.clone();
                            c.fileInput.after(function (k) {
                                return j[k]
                            });
                            if (c.paramName) {
                                c.fileInput.each(function () {
                                    b(this).prop("name", c.paramName)
                                })
                            }
                            e.append(c.fileInput).prop("enctype", "multipart/form-data").prop("encoding", "multipart/form-data")
                        }
                        e.submit();
                        if (j && j.length) {
                            c.fileInput.each(function (l, k) {
                                var m = b(j[l]);
                                b(k).prop("name", m.prop("name"));
                                m.replaceWith(k)
                            })
                        }
                    });
                    e.append(d).appendTo("body")
                }, abort: function () {
                    if (d) {
                        d.unbind("load").prop("src", "javascript".concat(":false;"))
                    }
                    if (e) {
                        e.remove()
                    }
                }
            }
        }
    });
    b.ajaxSetup({
        converters: {
            "iframe text": function (c) {
                return c.text()
            }, "iframe json": function (c) {
                return b.parseJSON(c.text())
            }, "iframe html": function (c) {
                return c.find("body").html()
            }, "iframe script": function (c) {
                return b.globalEval(c.text())
            }
        }
    })
}(jQuery));
/*
 * jQuery Templates Plugin 1.0.0pre
 * http://github.com/jquery/jquery-tmpl
 * Requires jQuery 1.4.2
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
(function (i, f) {
    var t = i.fn.domManip, h = "_tmplitem", u = /^[^<]*(<[\w\W]+>)[^>]*$|\{\{\! /, p = {}, e = {}, y, x = {
        key: 0,
        data: {}
    }, w = 0, q = 0, g = [];

    function k(B, A, D, E) {
        var C = {
            data: E || (E === 0 || E === false) ? E : (A ? A.data : {}),
            _wrap: A ? A._wrap : null,
            tmpl: null,
            parent: A || null,
            nodes: [],
            calls: c,
            nest: b,
            wrap: n,
            html: r,
            update: z
        };
        if (B) {
            i.extend(C, B, {nodes: [], parent: A})
        }
        if (D) {
            C.tmpl = D;
            C._ctnt = C._ctnt || C.tmpl(i, C);
            C.key = ++w;
            (g.length ? e : p)[w] = C
        }
        return C
    }

    i.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (A, B) {
        i.fn[A] = function (C) {
            var F = [], I = i(C), E, G, D, J, H = this.length === 1 && this[0].parentNode;
            y = p || {};
            if (H && H.nodeType === 11 && H.childNodes.length === 1 && I.length === 1) {
                I[B](this[0]);
                F = this
            } else {
                for (G = 0, D = I.length; G < D; G++) {
                    q = G;
                    E = (G > 0 ? this.clone(true) : this).get();
                    i(I[G])[B](E);
                    F = F.concat(E)
                }
                q = 0;
                F = this.pushStack(F, A, I.selector)
            }
            J = y;
            y = null;
            i.tmpl.complete(J);
            return F
        }
    });
    i.fn.extend({
        tmpl: function (C, B, A) {
            return i.tmpl(this[0], C, B, A)
        }, tmplItem: function () {
            return i.tmplItem(this[0])
        }, template: function (A) {
            return i.template(A, this[0])
        }, domManip: function (E, H, G, I) {
            if (E[0] && i.isArray(E[0])) {
                var B = i.makeArray(arguments), A = E[0], F = A.length, C = 0, D;
                while (C < F && !(D = i.data(A[C++], "tmplItem"))) {
                }
                if (D && q) {
                    B[2] = function (J) {
                        i.tmpl.afterManip(this, J, G)
                    }
                }
                t.apply(this, B)
            } else {
                t.apply(this, arguments)
            }
            q = 0;
            if (!y) {
                i.tmpl.complete(p)
            }
            return this
        }
    });
    i.extend({
        tmpl: function (C, F, E, B) {
            var D, A = !B;
            if (A) {
                B = x;
                C = i.template[C] || i.template(null, C);
                e = {}
            } else {
                if (!C) {
                    C = B.tmpl;
                    p[B.key] = B;
                    B.nodes = [];
                    if (B.wrapped) {
                        s(B, B.wrapped)
                    }
                    return i(m(B, null, B.tmpl(i, B)))
                }
            }
            if (!C) {
                return []
            }
            if (typeof F === "function") {
                F = F.call(B || {})
            }
            if (E && E.wrapped) {
                s(E, E.wrapped)
            }
            D = i.isArray(F) ? i.map(F, function (G) {
                    return G ? k(E, B, C, G) : null
                }) : [k(E, B, C, F)];
            return A ? i(m(B, null, D)) : D
        }, tmplItem: function (B) {
            var A;
            if (B instanceof i) {
                B = B[0]
            }
            while (B && B.nodeType === 1 && !(A = i.data(B, "tmplItem")) && (B = B.parentNode)) {
            }
            return A || x
        }, template: function (B, A) {
            if (A) {
                if (typeof A === "string") {
                    A = l(A)
                } else {
                    if (A instanceof i) {
                        A = A[0] || {}
                    }
                }
                if (A.nodeType) {
                    A = i.data(A, "tmpl") || i.data(A, "tmpl", l(A.innerHTML))
                }
                return typeof B === "string" ? (i.template[B] = A) : A
            }
            return B ? (typeof B !== "string" ? i.template(null, B) : (i.template[B] || i.template(null, u.test(B) ? B : i(B)))) : null
        }, encode: function (A) {
            return ("" + A).split("<").join("&lt;").split(">").join("&gt;").split('"').join("&#34;").split("'").join("&#39;")
        }
    });
    i.extend(i.tmpl, {
        tag: {
            tmpl: {_default: {$2: "null"}, open: "if($notnull_1){__=__.concat($item.nest($1,$2));}"},
            wrap: {
                _default: {$2: "null"},
                open: "$item.calls(__,$1,$2);__=[];",
                close: "call=$item.calls();__=call._.concat($item.wrap(call,__));"
            },
            each: {
                _default: {$2: "$index, $value"},
                open: "if($notnull_1){$.each($1a,function($2){with(this){",
                close: "}});}"
            },
            "if": {open: "if(($notnull_1) && $1a){", close: "}"},
            "else": {_default: {$1: "true"}, open: "}else if(($notnull_1) && $1a){"},
            html: {open: "if($notnull_1){__.push($1a);}"},
            "=": {_default: {$1: "$data"}, open: "if($notnull_1){__.push($.encode($1a));}"},
            "!": {open: ""}
        }, complete: function (A) {
            p = {}
        }, afterManip: function v(C, A, D) {
            var B = A.nodeType === 11 ? i.makeArray(A.childNodes) : A.nodeType === 1 ? [A] : [];
            D.call(C, A);
            o(B);
            q++
        }
    });
    function m(A, E, C) {
        var D, B = C ? i.map(C, function (F) {
                return (typeof F === "string") ? (A.key ? F.replace(/(<\w+)(?=[\s>])(?![^>]*_tmplitem)([^>]*)/g, "$1 " + h + '="' + A.key + '" $2') : F) : m(F, A, F._ctnt)
            }) : A;
        if (E) {
            return B
        }
        B = B.join("");
        B.replace(/^\s*([^<\s][^<]*)?(<[\w\W]+>)([^>]*[^>\s])?\s*$/, function (G, H, F, I) {
            D = i(F).get();
            o(D);
            if (H) {
                D = a(H).concat(D)
            }
            if (I) {
                D = D.concat(a(I))
            }
        });
        return D ? D : a(B)
    }

    function a(B) {
        var A = document.createElement("div");
        A.innerHTML = B;
        return i.makeArray(A.childNodes)
    }

    function l(A) {
        return new Function("jQuery", "$item", "var $=jQuery,call,__=[],$data=$item.data;with($data){__.push('" + i.trim(A).replace(/([\\'])/g, "\\$1").replace(/[\r\t\n]/g, " ").replace(/\$\{([^\}]*)\}/g, "{{= $1}}").replace(/\{\{(\/?)(\w+|.)(?:\(((?:[^\}]|\}(?!\}))*?)?\))?(?:\s+(.*?)?)?(\(((?:[^\}]|\}(?!\}))*?)\))?\s*\}\}/g, function (I, C, G, D, E, J, F) {
                var L = i.tmpl.tag[G], B, H, K;
                if (!L) {
                    throw"Unknown template tag: " + G
                }
                B = L._default || [];
                if (J && !/\w$/.test(E)) {
                    E += J;
                    J = ""
                }
                if (E) {
                    E = j(E);
                    F = F ? ("," + j(F) + ")") : (J ? ")" : "");
                    H = J ? (E.indexOf(".") > -1 ? E + j(J) : ("(" + E + ").call($item" + F)) : E;
                    K = J ? H : "(typeof(" + E + ")==='function'?(" + E + ").call($item):(" + E + "))"
                } else {
                    K = H = B.$1 || "null"
                }
                D = j(D);
                return "');" + L[C ? "close" : "open"].split("$notnull_1").join(E ? "typeof(" + E + ")!=='undefined' && (" + E + ")!=null" : "true").split("$1a").join(K).split("$1").join(H).split("$2").join(D || B.$2 || "") + "__.push('"
            }) + "');}return __;")
    }

    function s(B, A) {
        B._wrap = m(B, true, i.isArray(A) ? A : [u.test(A) ? A : i(A).html()]).join("")
    }

    function j(A) {
        return A ? A.replace(/\\'/g, "'").replace(/\\\\/g, "\\") : null
    }

    function d(A) {
        var B = document.createElement("div");
        B.appendChild(A.cloneNode(true));
        return B.innerHTML
    }

    function o(G) {
        var I = "_" + q, B, A, E = {}, F, D, C;
        for (F = 0, D = G.length; F < D; F++) {
            if ((B = G[F]).nodeType !== 1) {
                continue
            }
            A = B.getElementsByTagName("*");
            for (C = A.length - 1; C >= 0; C--) {
                H(A[C])
            }
            H(B)
        }
        function H(O) {
            var L, N = O, M, J, K;
            if ((K = O.getAttribute(h))) {
                while (N.parentNode && (N = N.parentNode).nodeType === 1 && !(L = N.getAttribute(h))) {
                }
                if (L !== K) {
                    N = N.parentNode ? (N.nodeType === 11 ? 0 : (N.getAttribute(h) || 0)) : 0;
                    if (!(J = p[K])) {
                        J = e[K];
                        J = k(J, p[N] || e[N]);
                        J.key = ++w;
                        p[w] = J
                    }
                    if (q) {
                        P(K)
                    }
                }
                O.removeAttribute(h)
            } else {
                if (q && (J = i.data(O, "tmplItem"))) {
                    P(J.key);
                    p[J.key] = J;
                    N = i.data(O.parentNode, "tmplItem");
                    N = N ? N.key : 0
                }
            }
            if (J) {
                M = J;
                while (M && M.key != N) {
                    M.nodes.push(O);
                    M = M.parent
                }
                delete J._ctnt;
                delete J._wrap;
                i.data(O, "tmplItem", J)
            }
            function P(Q) {
                Q = Q + I;
                J = E[Q] = (E[Q] || k(J, p[J.parent.key + I] || J.parent))
            }
        }
    }

    function c(C, A, D, B) {
        if (!C) {
            return g.pop()
        }
        g.push({_: C, tmpl: A, item: this, data: D, options: B})
    }

    function b(A, C, B) {
        return i.tmpl(i.template(A), C, B, this)
    }

    function n(C, A) {
        var B = C.options || {};
        B.wrapped = A;
        return i.tmpl(i.template(C.tmpl), C.data, B, C.item)
    }

    function r(B, C) {
        var A = this._wrap;
        return i.map(i(i.isArray(A) ? A.join("") : A).filter(B || "*"), function (D) {
            return C ? D.innerText || D.textContent : D.outerHTML || d(D)
        })
    }

    function z() {
        var A = this.nodes;
        i.tmpl(null, null, null, this).insertBefore(A[0]);
        i(A).remove()
    }
})(jQuery);
(function (a) {
    a.widget("blueimp.fileupload", {
        options: {
            namespace: undefined,
            dropZone: a(document),
            fileInput: undefined,
            replaceFileInput: true,
            paramName: undefined,
            singleFileUploads: true,
            sequentialUploads: false,
            limitConcurrentUploads: undefined,
            forceIframeTransport: false,
            multipart: true,
            maxChunkSize: undefined,
            uploadedBytes: undefined,
            recalculateProgress: true,
            formData: function (b) {
                return b.serializeArray()
            },
            add: function (c, b) {
                b.submit()
            },
            processData: false,
            contentType: false,
            cache: false
        }, _refreshOptionsList: ["namespace", "dropZone", "fileInput"], _isXHRUpload: function (b) {
            var c = "undefined";
            return !b.forceIframeTransport && typeof XMLHttpRequestUpload !== c && typeof File !== c && (!b.multipart || typeof FormData !== c)
        }, _getFormData: function (b) {
            var c;
            if (typeof b.formData === "function") {
                return b.formData(b.form)
            } else {
                if (a.isArray(b.formData)) {
                    return b.formData
                } else {
                    if (b.formData) {
                        c = [];
                        a.each(b.formData, function (d, e) {
                            c.push({name: d, value: e})
                        });
                        return c
                    }
                }
            }
            return []
        }, _getTotal: function (c) {
            var b = 0;
            a.each(c, function (d, e) {
                b += e.size || 1
            });
            return b
        }, _onProgress: function (f, d) {
            if (f.lengthComputable) {
                var c = d.total || this._getTotal(d.files), b = parseInt(f.loaded / f.total * (d.chunkSize || c), 10) + (d.uploadedBytes || 0);
                this._loaded += b - (d.loaded || d.uploadedBytes || 0);
                d.lengthComputable = true;
                d.loaded = b;
                d.total = c;
                this._trigger("progress", f, d);
                this._trigger("progressall", f, {lengthComputable: true, loaded: this._loaded, total: this._total})
            }
        }, _initProgressListener: function (b) {
            var c = this, d = b.xhr ? b.xhr() : a.ajaxSettings.xhr();
            if (d.upload && d.upload.addEventListener) {
                d.upload.addEventListener("progress", function (f) {
                    c._onProgress(f, b)
                }, false);
                b.xhr = function () {
                    return d
                }
            }
        }, _initXHRData: function (b) {
            var d, c = b.files[0];
            if (!b.multipart || b.blob) {
                b.headers = a.extend(b.headers, {"X-File-Name": c.name, "X-File-Type": c.type, "X-File-Size": c.size});
                if (!b.blob) {
                    b.contentType = c.type;
                    b.data = c
                } else {
                    if (!b.multipart) {
                        b.contentType = "application/octet-stream";
                        b.data = b.blob
                    }
                }
            }
            if (b.multipart && typeof FormData !== "undefined") {
                if (b.formData instanceof FormData) {
                    d = b.formData
                } else {
                    d = new FormData();
                    a.each(this._getFormData(b), function (e, f) {
                        d.append(f.name, f.value)
                    })
                }
                if (b.blob) {
                    d.append(b.paramName, b.blob)
                } else {
                    a.each(b.files, function (e, f) {
                        if (f instanceof Blob) {
                            d.append(b.paramName, f)
                        }
                    })
                }
                b.data = d
            }
            b.blob = null
        }, _initIframeSettings: function (b) {
            b.dataType = "iframe " + (b.dataType || "");
            b.formData = this._getFormData(b)
        }, _initDataSettings: function (b) {
            if (this._isXHRUpload(b)) {
                if (!this._chunkedUpload(b, true)) {
                    if (!b.data) {
                        this._initXHRData(b)
                    }
                    this._initProgressListener(b)
                }
            } else {
                this._initIframeSettings(b)
            }
        }, _initFormSettings: function (b) {
            if (!b.form || !b.form.length) {
                b.form = a(b.fileInput.prop("form"))
            }
            if (!b.paramName) {
                b.paramName = b.fileInput.prop("name") || "files[]"
            }
            if (!b.url) {
                b.url = b.form.prop("action") || location.href
            }
            b.type = (b.type || b.form.prop("method") || "").toUpperCase();
            if (b.type !== "POST" && b.type !== "PUT") {
                b.type = "POST"
            }
        }, _getAJAXSettings: function (c) {
            var b = a.extend({}, this.options, c);
            this._initFormSettings(b);
            this._initDataSettings(b);
            return b
        }, _enhancePromise: function (b) {
            b.success = b.done;
            b.error = b.fail;
            b.complete = b.always;
            return b
        }, _getXHRPromise: function (e, d, c) {
            var b = a.Deferred(), f = b.promise();
            d = d || this.options.context || f;
            if (e === true) {
                b.resolveWith(d, c)
            } else {
                if (e === false) {
                    b.rejectWith(d, c)
                }
            }
            f.abort = b.promise;
            return this._enhancePromise(f)
        }, _chunkedUpload: function (m, i) {
            var h = this, f = m.files[0], g = f.size, b = m.uploadedBytes = m.uploadedBytes || 0, e = m.maxChunkSize || g, k = f.webkitSlice || f.mozSlice || f.slice, l, c, j, d;
            if (!(this._isXHRUpload(m) && k && (b || e < g)) || m.data) {
                return false
            }
            if (i) {
                return true
            }
            if (b >= g) {
                f.error = "uploadedBytes";
                return this._getXHRPromise(false)
            }
            c = Math.ceil((g - b) / e);
            l = function (n) {
                if (!n) {
                    return h._getXHRPromise(true)
                }
                return l(n -= 1).pipe(function () {
                    var p = a.extend({}, m);
                    p.blob = k.call(f, b + n * e, b + (n + 1) * e);
                    p.chunkSize = p.blob.size;
                    h._initXHRData(p);
                    h._initProgressListener(p);
                    j = (a.ajax(p) || h._getXHRPromise(false, p.context)).done(function () {
                        if (!p.loaded) {
                            h._onProgress(a.Event("progress", {
                                lengthComputable: true,
                                loaded: p.chunkSize,
                                total: p.chunkSize
                            }), p)
                        }
                        m.uploadedBytes = p.uploadedBytes += p.chunkSize
                    });
                    return j
                })
            };
            d = l(c);
            d.abort = function () {
                return j.abort()
            };
            return this._enhancePromise(d)
        }, _beforeSend: function (c, b) {
            if (this._active === 0) {
                this._trigger("start")
            }
            this._active += 1;
            this._loaded += b.uploadedBytes || 0;
            this._total += this._getTotal(b.files)
        }, _onDone: function (b, e, d, c) {
            if (!this._isXHRUpload(c)) {
                this._onProgress(a.Event("progress", {lengthComputable: true, loaded: 1, total: 1}), c)
            }
            c.result = b;
            c.textStatus = e;
            c.jqXHR = d;
            this._trigger("done", null, c)
        }, _onFail: function (c, e, d, b) {
            b.jqXHR = c;
            b.textStatus = e;
            b.errorThrown = d;
            this._trigger("fail", null, b);
            if (b.recalculateProgress) {
                this._loaded -= b.loaded || b.uploadedBytes || 0;
                this._total -= b.total || this._getTotal(b.files)
            }
        }, _onAlways: function (b, f, d, e, c) {
            this._active -= 1;
            c.result = b;
            c.textStatus = f;
            c.jqXHR = d;
            c.errorThrown = e;
            this._trigger("always", null, c);
            if (this._active === 0) {
                this._trigger("stop");
                this._loaded = this._total = 0
            }
            a(document).trigger("ajaxComplete")
        }, _onSend: function (i, g) {
            var f = this, d, j, c, b = f._getAJAXSettings(g), h = function (k, e) {
                f._sending += 1;
                d = d || ((k !== false && f._trigger("send", i, b) !== false && (f._chunkedUpload(b) || a.ajax(b))) || f._getXHRPromise(false, b.context, e)).done(function (l, n, m) {
                        f._onDone(l, n, m, b)
                    }).fail(function (l, n, m) {
                        f._onFail(l, n, m, b)
                    }).always(function (m, l, o) {
                        f._sending -= 1;
                        if (o && o.done) {
                            f._onAlways(m, l, o, undefined, b)
                        } else {
                            f._onAlways(undefined, l, m, o, b)
                        }
                        if (b.limitConcurrentUploads && b.limitConcurrentUploads > f._sending) {
                            var n = f._slots.shift();
                            while (n) {
                                if (!n.isRejected()) {
                                    n.resolve();
                                    break
                                }
                                n = f._slots.shift()
                            }
                        }
                    });
                return d
            };
            this._beforeSend(i, b);
            if (this.options.sequentialUploads || (this.options.limitConcurrentUploads && this.options.limitConcurrentUploads <= this._sending)) {
                if (this.options.limitConcurrentUploads > 1) {
                    j = a.Deferred();
                    this._slots.push(j);
                    c = j.pipe(h)
                } else {
                    c = (this._sequence = this._sequence.pipe(h, h))
                }
                c.abort = function () {
                    var e = [undefined, "abort", "abort"];
                    if (!d) {
                        if (j) {
                            j.rejectWith(e)
                        }
                        return h(false, e)
                    }
                    return d.abort()
                };
                return this._enhancePromise(c)
            }
            return h()
        }, _onAdd: function (g, f) {
            var d = this, b = true, c = a.extend({}, this.options, f);
            if (c.singleFileUploads && this._isXHRUpload(c)) {
                a.each(f.files, function (e, h) {
                    var i = a.extend({}, f, {files: [h]});
                    i.submit = function () {
                        return d._onSend(g, i)
                    };
                    return (b = d._trigger("add", g, i))
                });
                return b
            } else {
                if (f.files.length) {
                    f = a.extend({}, f);
                    f.submit = function () {
                        return d._onSend(g, f)
                    };
                    return this._trigger("add", g, f)
                }
            }
        }, _normalizeFile: function (b, c) {
            if (c.name === undefined && c.size === undefined) {
                c.name = c.fileName;
                c.size = c.fileSize
            }
        }, _replaceFileInput: function (b) {
            var c = b.clone(true);
            a("<form></form>").append(c)[0].reset();
            b.after(c).detach();
            this.options.fileInput = this.options.fileInput.map(function (d, e) {
                if (e === b[0]) {
                    return c[0]
                }
                return e
            })
        }, _onChange: function (d) {
            var b = d.data.fileupload, c = {
                files: a.each(a.makeArray(d.target.files), b._normalizeFile),
                fileInput: a(d.target),
                form: a(d.target.form)
            };
            if (!c.files.length) {
                c.files = [{name: d.target.value.replace(/^.*\\/, "")}]
            }
            if (c.form.length) {
                c.fileInput.data("blueimp.fileupload.form", c.form)
            } else {
                c.form = c.fileInput.data("blueimp.fileupload.form")
            }
            if (b.options.replaceFileInput) {
                b._replaceFileInput(c.fileInput)
            }
            if (b._trigger("change", d, c) === false || b._onAdd(d, c) === false) {
                return false
            }
        }, _onDrop: function (f) {
            var b = f.data.fileupload, d = f.dataTransfer = f.originalEvent.dataTransfer, c = {files: a.each(a.makeArray(d && d.files), b._normalizeFile)};
            if (b._trigger("drop", f, c) === false || b._onAdd(f, c) === false) {
                return false
            }
            f.preventDefault()
        }, _onDragOver: function (d) {
            var b = d.data.fileupload, c = d.dataTransfer = d.originalEvent.dataTransfer;
            if (b._trigger("dragover", d) === false) {
                return false
            }
            if (c) {
                c.dropEffect = c.effectAllowed = "copy"
            }
            d.preventDefault()
        }, _initEventHandlers: function () {
            var b = this.options.namespace || this.name;
            this.options.dropZone.bind("dragover." + b, {fileupload: this}, this._onDragOver).bind("drop." + b, {fileupload: this}, this._onDrop);
            this.options.fileInput.bind("change." + b, {fileupload: this}, this._onChange)
        }, _destroyEventHandlers: function () {
            var b = this.options.namespace || this.name;
            this.options.dropZone.unbind("dragover." + b, this._onDragOver).unbind("drop." + b, this._onDrop);
            this.options.fileInput.unbind("change." + b, this._onChange)
        }, _beforeSetOption: function (b, c) {
            this._destroyEventHandlers()
        }, _afterSetOption: function (c, d) {
            var b = this.options;
            if (!b.fileInput) {
                b.fileInput = a()
            }
            if (!b.dropZone) {
                b.dropZone = a()
            }
            this._initEventHandlers()
        }, _setOption: function (b, d) {
            var c = a.inArray(b, this._refreshOptionsList) !== -1;
            if (c) {
                this._beforeSetOption(b, d)
            }
            a.Widget.prototype._setOption.call(this, b, d);
            if (c) {
                this._afterSetOption(b, d)
            }
        }, _create: function () {
            var b = this.options;
            if (b.fileInput === undefined) {
                b.fileInput = this.element.is("input:file") ? this.element : this.element.find("input:file")
            } else {
                if (!b.fileInput) {
                    b.fileInput = a()
                }
            }
            if (!b.dropZone) {
                b.dropZone = a()
            }
            this._slots = [];
            this._sequence = this._getXHRPromise(true);
            this._sending = this._active = this._loaded = this._total = 0;
            this._initEventHandlers()
        }, destroy: function () {
            this._destroyEventHandlers();
            a.Widget.prototype.destroy.call(this)
        }, enable: function () {
            a.Widget.prototype.enable.call(this);
            this._initEventHandlers()
        }, disable: function () {
            this._destroyEventHandlers();
            a.Widget.prototype.disable.call(this)
        }, add: function (b) {
            if (!b || this.options.disabled) {
                return
            }
            b.files = a.each(a.makeArray(b.files), this._normalizeFile);
            this._onAdd(null, b)
        }, send: function (b) {
            if (b && !this.options.disabled) {
                b.files = a.each(a.makeArray(b.files), this._normalizeFile);
                if (b.files.length) {
                    return this._onSend(null, b)
                }
            }
            return this._getXHRPromise(false, b && b.context)
        }
    })
}(jQuery));
(function (a) {
    a.widget("blueimpUI.fileupload", a.blueimp.fileupload, {
        options: {
            autoUpload: false,
            maxNumberOfFiles: undefined,
            maxFileSize: undefined,
            minFileSize: 1,
            acceptFileTypes: /.+$/i,
            previewFileTypes: /^image\/(gif|jpeg|png)$/,
            previewMaxWidth: 80,
            previewMaxHeight: 80,
            previewAsCanvas: true,
            uploadTemplate: a("#template-upload"),
            downloadTemplate: a("#template-download"),
            dataType: "json",
            add: function (d, c) {
                var b = a(this).data("fileupload");
                b._adjustMaxNumberOfFiles(-c.files.length);
                c.isAdjusted = true;
                c.isValidated = b._validate(c.files);
                c.context = b._renderUpload(c.files).appendTo(a(this).find(".files")).fadeIn(function () {
                    a(this).show()
                }).data("data", c);
                if ((b.options.autoUpload || c.autoUpload) && c.isValidated) {
                    c.jqXHR = c.submit()
                }
            },
            send: function (d, c) {
                if (!c.isValidated) {
                    var b = a(this).data("fileupload");
                    if (!c.isAdjusted) {
                        b._adjustMaxNumberOfFiles(-c.files.length)
                    }
                    if (!b._validate(c.files)) {
                        return false
                    }
                }
                if (c.context && c.dataType && c.dataType.substr(0, 6) === "iframe") {
                    c.context.find(".ui-progressbar").progressbar("value", parseInt(100, 10))
                }
            },
            done: function (d, c) {
                var b = a(this).data("fileupload");
                if (b) {
                    if (c.context) {
                        c.context.each(function (e) {
                            var f = (a.isArray(c.result) && c.result[e]) || {error: "emptyResult"};
                            if (f.error) {
                                b._adjustMaxNumberOfFiles(1)
                            }
                            a(this).fadeOut(function () {
                                b._renderDownload([f]).css("display", "none").replaceAll(this).fadeIn(function () {
                                    a(this).show()
                                })
                            })
                        })
                    } else {
                        b._renderDownload(c.result).css("display", "none").appendTo(a(this).find(".files")).fadeIn(function () {
                            a(this).show()
                        })
                    }
                }
            },
            fail: function (d, c) {
                var b = a(this).data("fileupload");
                b._adjustMaxNumberOfFiles(c.files.length);
                if (c.context) {
                    c.context.each(function (e) {
                        a(this).fadeOut(function () {
                            if (c.errorThrown !== "abort") {
                                var f = c.files[e];
                                f.error = f.error || c.errorThrown || true;
                                b._renderDownload([f]).css("display", "none").replaceAll(this).fadeIn(function () {
                                    a(this).show()
                                })
                            } else {
                                c.context.remove()
                            }
                        })
                    })
                } else {
                    if (c.errorThrown !== "abort") {
                        b._adjustMaxNumberOfFiles(-c.files.length);
                        c.context = b._renderUpload(c.files).css("display", "none").appendTo(a(this).find(".files")).fadeIn(function () {
                            a(this).show()
                        }).data("data", c)
                    }
                }
            },
            progress: function (c, b) {
                if (b.context) {
                    b.context.find(".ui-progressbar").progressbar("value", parseInt(b.loaded / b.total * 100, 10))
                }
            },
            progressall: function (c, b) {
                a(this).find(".fileupload-progressbar").progressbar("value", parseInt(b.loaded / b.total * 100, 10))
            },
            start: function () {
                a(this).find(".fileupload-progressbar").progressbar("value", 0).fadeIn()
            },
            stop: function () {
                a(this).find(".fileupload-progressbar").fadeOut()
            },
            destroy: function (d, c) {
                var b = a(this).data("fileupload");
                if (c.url) {
                    a.ajax(c).success(function () {
                        b._adjustMaxNumberOfFiles(1);
                        a(this).fadeOut(function () {
                            a(this).remove()
                        })
                    })
                } else {
                    c.context.fadeOut(function () {
                        a(this).remove()
                    })
                }
            }
        }, _scaleImage: function (b, d) {
            d = d || {};
            var c = document.createElement("canvas"), e = Math.min((d.maxWidth || b.width) / b.width, (d.maxHeight || b.height) / b.height);
            if (e >= 1) {
                e = Math.max((d.minWidth || b.width) / b.width, (d.minHeight || b.height) / b.height)
            }
            b.width = parseInt(b.width * e, 10);
            b.height = parseInt(b.height * e, 10);
            if (!d.canvas || !c.getContext) {
                return b
            }
            c.width = b.width;
            c.height = b.height;
            c.getContext("2d").drawImage(b, 0, 0, b.width, b.height);
            return c
        }, _createObjectURL: function (b) {
            var d = "undefined", c = (typeof window.createObjectURL !== d && window) || (typeof URL !== d && URL) || (typeof webkitURL !== d && webkitURL);
            return c ? c.createObjectURL(b) : false
        }, _revokeObjectURL: function (b) {
            var d = "undefined", c = (typeof window.revokeObjectURL !== d && window) || (typeof URL !== d && URL) || (typeof webkitURL !== d && webkitURL);
            return c ? c.revokeObjectURL(b) : false
        }, _loadFile: function (c, d) {
            if (typeof FileReader !== "undefined" && FileReader.prototype.readAsDataURL) {
                var b = new FileReader();
                b.onload = function (f) {
                    d(f.target.result)
                };
                b.readAsDataURL(c);
                return true
            }
            return false
        }, _loadImage: function (e, g, d) {
            var f = this, c, b;
            if (!d || !d.fileTypes || d.fileTypes.test(e.type)) {
                c = this._createObjectURL(e);
                b = a("<img>").bind("load", function () {
                    a(this).unbind("load");
                    f._revokeObjectURL(c);
                    g(f._scaleImage(b[0], d))
                }).prop("src", c);
                if (!c) {
                    this._loadFile(e, function (h) {
                        b.prop("src", h)
                    })
                }
            }
        }, _enableDragToDesktop: function () {
            var e = a(this), c = e.prop("href"), b = decodeURIComponent(c.split("/").pop()).replace(/:/g, "-"), d = "application/octet-stream";
            e.bind("dragstart", function (g) {
                try {
                    g.originalEvent.dataTransfer.setData("DownloadURL", [d, b, c].join(":"))
                } catch (f) {
                }
            })
        }, _adjustMaxNumberOfFiles: function (b) {
            if (typeof this.options.maxNumberOfFiles === "number") {
                this.options.maxNumberOfFiles += b;
                if (this.options.maxNumberOfFiles < 1) {
                    this._disableFileInputButton()
                } else {
                    this._enableFileInputButton()
                }
            }
        }, _formatFileSize: function (b) {
            if (typeof b.size !== "number") {
                return ""
            }
            if (b.size >= 1000000000) {
                return (b.size / 1000000000).toFixed(2) + " GB"
            }
            if (b.size >= 1000000) {
                return (b.size / 1000000).toFixed(2) + " MB"
            }
            return (b.size / 1000).toFixed(2) + " KB"
        }, _hasError: function (b) {
            if (b.error) {
                return b.error
            }
            if (this.options.maxNumberOfFiles < 0) {
                return "maxNumberOfFiles"
            }
            if (!(this.options.acceptFileTypes.test(b.type) || this.options.acceptFileTypes.test(b.name))) {
                return "acceptFileTypes"
            }
            if (this.options.maxFileSize && b.size > this.options.maxFileSize) {
                return "maxFileSize"
            }
            if (typeof b.size === "number" && b.size < this.options.minFileSize) {
                return "minFileSize"
            }
            return null
        }, _validate: function (d) {
            var c = this, b;
            a.each(d, function (e, f) {
                f.error = c._hasError(f);
                b = !f.error
            });
            return b
        }, _uploadTemplateHelper: function (b) {
            b.sizef = this._formatFileSize(b);
            return b
        }, _renderUploadTemplate: function (c) {
            var b = this;
            return a.tmpl(this.options.uploadTemplate, a.map(c, function (d) {
                return b._uploadTemplateHelper(d)
            }))
        }, _renderUpload: function (e) {
            var d = this, c = this.options, b = this._renderUploadTemplate(e);
            if (!(b instanceof a)) {
                return a()
            }
            b.css("display", "none");
            b.find(".progress div").slice(1).remove().end().first().progressbar();
            b.find(".preview").each(function (f, g) {
                d._loadImage(e[f], function (h) {
                    a(h).hide().appendTo(g).fadeIn()
                }, {
                    maxWidth: c.previewMaxWidth,
                    maxHeight: c.previewMaxHeight,
                    fileTypes: c.previewFileTypes,
                    canvas: c.previewAsCanvas
                })
            });
            return b
        }, _downloadTemplateHelper: function (b) {
            b.sizef = this._formatFileSize(b);
            return b
        }, _renderDownloadTemplate: function (c) {
            var b = this;
            return a.tmpl(this.options.downloadTemplate, a.map(c, function (d) {
                return b._downloadTemplateHelper(d)
            }))
        }, _renderDownload: function (c) {
            var b = this._renderDownloadTemplate(c);
            if (!(b instanceof a)) {
                return a()
            }
            b.css("display", "none");
            b.find(".delete button").button({text: false, icons: {primary: "ui-icon-trash"}});
            b.find("a").each(this._enableDragToDesktop);
            return b
        }, _startHandler: function (d) {
            d.preventDefault();
            var b = a(this).closest(".template-upload"), c = b.data("data");
            if (c && c.submit && !c.jqXHR) {
                c.jqXHR = c.submit();
                a(this).fadeOut()
            }
        }, _cancelHandler: function (d) {
            d.preventDefault();
            var b = a(this).closest(".template-upload"), c = b.data("data") || {};
            if (!c.jqXHR) {
                c.errorThrown = "abort";
                d.data.fileupload._trigger("fail", d, c)
            } else {
                c.jqXHR.abort()
            }
        }, _deleteHandler: function (c) {
            c.preventDefault();
            var b = a(this);
            c.data.fileupload._trigger("destroy", c, {
                context: b.closest(".template-download"),
                url: b.attr("data-url"),
                type: b.attr("data-type"),
                dataType: c.data.fileupload.options.dataType
            })
        }, _initEventHandlers: function () {
            a.blueimp.fileupload.prototype._initEventHandlers.call(this);
            var b = {fileupload: this};
            a(this.options.namespace + " .files td.start button").die().live("click", b, this._startHandler).live("mouseover", function () {
                a(this).addClass("ui-state-hover")
            }).live("mouseout", function () {
                a(this).removeClass("ui-state-active ui-state-hover")
            }).live("mousedown", function () {
                a(this).addClass("ui-state-active")
            }).live("mouseup", function () {
                a(this).removeClass("ui-state-active")
            });
            a(this.options.namespace + " .files td.cancel button").die().live("click", b, this._cancelHandler).live("mouseover", function () {
                a(this).addClass("ui-state-hover")
            }).live("mouseout", function () {
                a(this).removeClass("ui-state-active ui-state-hover")
            }).live("mousedown", function () {
                a(this).addClass("ui-state-active")
            }).live("mouseup", function () {
                a(this).removeClass("ui-state-active")
            });
            a(this.options.namespace + " .files td.delete button").die().live("click", b, this._deleteHandler)
        }, _destroyEventHandlers: function () {
            a.blueimp.fileupload.prototype._destroyEventHandlers.call(this)
        }, _initFileUploadButtonBar: function () {
            var c = this.element.find(".fileupload-buttonbar"), d = this.element.find(".files"), b = this.options.namespace;
            c.addClass("ui-widget-header ui-corner-top")
        }, _destroyFileUploadButtonBar: function () {
            this.element.find(".fileupload-buttonbar").removeClass("ui-widget-header ui-corner-top");
            this.element.find(".fileinput-button").each(function () {
                var b = a(this).find("input:file").detach();
                a(this).button("destroy").append(b)
            });
            this.element.find(".fileupload-buttonbar button").unbind("click." + this.options.namespace).button("destroy")
        }, _enableFileInputButton: function () {
            this.element.find(".fileinput-button input:file:disabled").each(function () {
                var c = a(this), b = c.parent();
                c.detach().prop("disabled", false);
                b.button("enable").append(c)
            })
        }, _disableFileInputButton: function () {
            this.element.find(".fileinput-button input:file:enabled").each(function () {
                var c = a(this), b = c.parent();
                c.detach().prop("disabled", true);
                b.button("disable").append(c)
            })
        }, _initTemplates: function () {
            if (this.options.uploadTemplate instanceof a && !this.options.uploadTemplate.length) {
                this.options.uploadTemplate = a(this.options.uploadTemplate.selector)
            }
            if (this.options.downloadTemplate instanceof a && !this.options.downloadTemplate.length) {
                this.options.downloadTemplate = a(this.options.downloadTemplate.selector)
            }
        }, _create: function () {
            a.blueimp.fileupload.prototype._create.call(this);
            this._initTemplates();
            this.element.addClass("ui-widget");
            this._initFileUploadButtonBar();
            this.element.find(".fileupload-content").addClass("ui-widget-content ui-corner-bottom");
            this.element.find(".fileupload-progressbar").hide().progressbar()
        }, destroy: function () {
            a.blueimp.fileupload.prototype.destroy.call(this)
        }, enable: function () {
            a.blueimp.fileupload.prototype.enable.call(this);
            this.element.find(":ui-button").not(".fileinput-button").button("enable");
            this._enableFileInputButton()
        }, disable: function () {
            this.element.find(":ui-button").not(".fileinput-button").button("disable");
            this._disableFileInputButton();
            a.blueimp.fileupload.prototype.disable.call(this)
        }
    })
}(jQuery));
PrimeFaces.widget.FileUpload = PrimeFaces.widget.BaseWidget.extend({
    init: function (b) {
        this._super(b);
        this.form = this.jq.parents("form:first");
        this.buttonBar = this.jq.children(".fileupload-buttonbar");
        this.uploadContent = this.jq.children(".fileupload-content");
        var a = this;
        this.cfg.uploadTemplate = '<tr class="template-upload{{if error}} ui-state-error{{/if}}"><td class="preview"></td><td class="name">${name}</td><td class="size">${sizef}</td>{{if error}}<td class="error" colspan="2">{{if error === "maxFileSize"}}' + this.getMessage(this.cfg.invalidSizeMessage, this.INVALID_SIZE_MESSAGE) + '{{else error === "minFileSize"}}' + this.getMessage(this.cfg.invalidSizeMessage, this.INVALID_SIZE_MESSAGE) + '{{else error === "acceptFileTypes"}}' + this.getMessage(this.cfg.invalidFileMessage, this.INVALID_FILE_MESSAGE) + '{{else error === "maxNumberOfFiles"}}' + this.getMessage(this.cfg.fileLimitMessage, this.FILE_LIMIT_MESSAGE) + '{{else}}${error}{{/if}}</td>{{else}}<td class="progress"><div></div></td><td class="start"><button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only"><span class="ui-button-icon-left ui-icon ui-icon ui-icon-arrowreturnthick-1-n"></span><span class="ui-button-text">ui-button</span></button></td><td class="cancel"><button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only"><span class="ui-button-icon-left ui-icon ui-icon ui-icon-cancel"></span><span class="ui-button-text">ui-button</span></button></td>{{/if}}</tr>';
        this.cfg.downloadTemplate = "";
        this.cfg.fileInput = $(PrimeFaces.escapeClientId(this.id + "_input"));
        this.cfg.paramName = this.id;
        this.cfg.sequentialUploads = true;
        this.cfg.dataType = "xml";
        this.cfg.namespace = this.jqId;
        this.cfg.disabled = this.cfg.fileInput.is(":disabled");
        var c = this.form.children("input[name='javax.faces.encodedURL']");
        this.cfg.url = (c.length == 1) ? c.val() : this.form.attr("action");
        $.ajaxSetup({converters: {"iframe xml": this.parseIFrameResponse}});
        this.cfg.formData = function () {
            return a.createPostData()
        };
        this.cfg.dropZone = this.cfg.dnd && !this.cfg.disabled ? this.jq : null;
        if (this.form.data().fileupload) {
            this.destroy()
        }
        this.form.fileupload(this.cfg).bind("fileuploadstart", function (f, d) {
            if (a.cfg.onstart) {
                a.cfg.onstart.call(a)
            }
        }).bind("fileuploaddone", function (f, d) {
            PrimeFaces.ajax.AjaxResponse(d.result);
            if (a.cfg.oncomplete) {
                a.cfg.oncomplete.call(a)
            }
        });
        if (this.cfg.disabled) {
            this.disable()
        }
        this.jq.show();
        PrimeFaces.skinButton(this.buttonBar.children(".ui-button"));
        this.buttonBar.children(".start.ui-button").click(function (d) {
            a.uploadContent.find(".start button").click()
        });
        this.buttonBar.children(".cancel.ui-button").click(function (d) {
            a.uploadContent.find(".cancel button").click()
        })
    },
    parseIFrameResponse: function (b) {
        var a = b.contents(), c = null;
        if ($.browser.mozilla || $.browser.opera || ($.browser.msie && $.browser.version == "9.0")) {
            c = '<?xml version="1.0" encoding="UTF-8"?><partial-response><changes>';
            a.find("update").each(function (d, f) {
                var h = $(f), g = h.attr("id"), e = "<![CDATA[" + h.text() + "]]>";
                c += '<update id="' + g + '">' + e + "</update>"
            });
            c += "</changes></partial-response>"
        } else {
            c = $.trim(b.contents().text().replace(/(> -)|(>-)/g, ">"))
        }
        return $.parseXML(c)
    },
    createPostData: function () {
        var a = this.cfg.process ? this.id + " " + this.cfg.process : this.id, b = this.form.serializeArray();
        b.push({name: PrimeFaces.PARTIAL_REQUEST_PARAM, value: "true"});
        b.push({name: PrimeFaces.PARTIAL_PROCESS_PARAM, value: a});
        b.push({name: PrimeFaces.PARTIAL_SOURCE_PARAM, value: this.id});
        if (this.cfg.update) {
            b.push({name: PrimeFaces.PARTIAL_UPDATE_PARAM, value: this.cfg.update})
        }
        return b
    },
    getMessage: function (a, b) {
        return a || b
    },
    destroy: function () {
        this.form.fileupload("destroy")
    },
    disable: function () {
        this.jq.children(".fileupload-buttonbar").find(".ui-button").addClass("ui-state-disabled").unbind().bind("click", function (a) {
            a.preventDefault()
        });
        this.cfg.fileInput.css("cursor", "auto")
    },
    INVALID_SIZE_MESSAGE: "Invalid file size.",
    INVALID_FILE_MESSAGE: "Invalid file type.",
    FILE_LIMIT_MESSAGE: "Max number of files exceeded."
});