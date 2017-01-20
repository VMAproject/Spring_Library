PrimeFaces.widget.Mindmap = PrimeFaces.widget.BaseWidget.extend({
    init: function (b) {
        this._super(b);
        var d = this;
        if (this.jq.is(":visible")) {
            this.render()
        } else {
            var a = this.jq.parents(".ui-hidden-container:first"), c = a.data("widget");
            if (c) {
                c.addOnshowHandler(function () {
                    return d.render()
                })
            }
        }
    }, render: function () {
        this.cfg.width = this.jq.width();
        this.cfg.height = this.jq.height();
        this.cfg.centerX = this.cfg.width / 2;
        this.cfg.centerY = this.cfg.height / 2;
        this.raphael = new Raphael(this.id, this.cfg.width, this.cfg.height);
        this.nodes = [];
        if (this.cfg.model) {
            this.root = this.createNode(this.cfg.centerX, this.cfg.centerY, this.cfg.model);
            if (this.cfg.model.children) {
                this.createSubNodes(this.root)
            }
        }
        this.tooltip = $('<div class="ui-tooltip ui-mindmap-tooltip ui-widget ui-widget-content ui-corner-all"></div>').appendTo(document.body)
    }, createNode: function (a, h, d) {
        var e = this.raphael.ellipse(a, h, 40, 25).attr("opacity", 0).data("model", d).data("connections", []).data("widget", this);
        var c = d.label, b = e.getBBox().width, g = null;
        var f = this.raphael.text(a, h, c).attr("opacity", 0);
        if (b <= f.getBBox().width) {
            g = c;
            c = c.substring(0, 12);
            f.attr("text", c + "...")
        }
        f.data("node", e);
        e.data("text", f);
        if (d.fill) {
            e.attr({fill: "#" + d.fill})
        }
        if (g) {
            e.data("title", g);
            e.mouseover(this.mouseoverNode);
            e.mouseout(this.mouseoutNode);
            f.mouseover(this.mouseoverText);
            f.mouseout(this.mouseoutText)
        }
        e.animate({opacity: 1}, this.cfg.effectSpeed);
        f.animate({opacity: 1}, this.cfg.effectSpeed);
        e.drag(this.nodeDrag, this.nodeDragStart, this.nodeDragEnd);
        f.drag(this.textDrag, this.textDragStart, this.textDragEnd);
        if (d.selectable) {
            e.click(this.clickNode);
            f.click(this.clickNodeText);
            e.attr({cursor: "pointer"});
            f.attr({cursor: "pointer"})
        }
        this.nodes.push(e);
        return e
    }, mouseoverNode: function () {
        var a = this.data("widget");
        a.showTooltip(this)
    }, mouseoutNode: function () {
        var a = this.data("widget");
        a.hideTooltip(this)
    }, mouseoverText: function () {
        var b = this.data("node"), a = b.data("widget");
        a.showTooltip(b)
    }, mouseoutText: function () {
        var b = this.data("node"), a = b.data("widget");
        a.hideTooltip(b)
    }, showTooltip: function (b) {
        var d = b.data("title");
        if (d) {
            var a = b.data("widget"), c = a.jq.offset();
            a.tooltip.text(d).css({
                left: c.left + b.attr("cx") + 20,
                top: c.top + b.attr("cy") + 10,
                "z-index": ++PrimeFaces.zindex
            }).show()
        }
    }, hideTooltip: function (b) {
        var c = b.data("title");
        if (c) {
            var a = b.data("widget");
            a.tooltip.hide()
        }
    }, centerNode: function (b) {
        var a = this, c = b.data("text");
        c.animate({x: this.cfg.centerX, y: this.cfg.centerY}, this.cfg.effectSpeed, "<>");
        b.animate({cx: this.cfg.centerX, cy: this.cfg.centerY}, this.cfg.effectSpeed, "<>", function () {
            a.createSubNodes(b)
        });
        b.unclick(this.clickNode);
        c.unclick(this.clickNodeText);
        b.attr({cursor: "default"});
        c.attr({cursor: "default"})
    }, createSubNodes: function (h) {
        var f = h.data("model");
        if (f.children) {
            var r = f.children.length, n = 150, b = parseInt((n * 2) / 25), o = (360 / Math.min(r, b)), c = 0;
            for (var l = 0; l < r; l++) {
                var k = f.children[l];
                c++;
                var j = ((o * (l + 1)) / 180) * Math.PI, q = h.attr("cx") + n * Math.cos(j), p = h.attr("cy") + n * Math.sin(j);
                var a = this.createNode(q, p, k);
                var e = this.raphael.connection(h, a, "#000", null, this.cfg.effectSpeed);
                h.data("connections").push(e);
                a.data("connections").push(e);
                if (c === b) {
                    n = n + 125;
                    b = parseInt((n * 2) / 25);
                    o = (360 / Math.min(b, (r - (l + 1))));
                    c = 0
                }
            }
        }
        var g = f.parent;
        if (g) {
            g.selectable = true;
            var m = this.createNode(60, 40, g);
            var d = this.raphael.connection(h, m, "#000", null, this.cfg.effectSpeed);
            h.data("connections").push(d);
            m.data("connections").push(d)
        }
    }, hasBehavior: function (a) {
        if (this.cfg.behaviors) {
            return this.cfg.behaviors[a] != undefined
        }
        return false
    }, handleNodeClick: function (c) {
        if (c.dragged) {
            c.dragged = false;
            return
        }
        var a = this, b = c.data("clicktimeout");
        if (b) {
            clearTimeout(b);
            c.removeData("clicktimeout");
            a.handleDblclickNode(c)
        } else {
            var d = setTimeout(function () {
                a.expandNode(c)
            }, 300);
            c.data("clicktimeout", d)
        }
    }, clickNode: function () {
        var a = this.data("widget");
        a.handleNodeClick(this)
    }, clickNodeText: function () {
        var b = this.data("node"), a = b.data("widget");
        a.handleNodeClick(b)
    }, handleDblclickNode: function (d) {
        if (this.hasBehavior("dblselect")) {
            var b = this.cfg.behaviors.dblselect, a = d.data("model").key;
            var c = {params: [{name: this.id + "_nodeKey", value: a}]};
            b.call(this, d, c)
        }
    }, expandNode: function (d) {
        var a = this, b = d.data("model").key;
        var e = this.cfg.behaviors.select, c = {
            params: [{name: this.id + "_nodeKey", value: b}],
            update: this.id,
            onsuccess: function (q) {
                var r = $(q.documentElement), p = r.find("update");
                for (var m = 0; m < p.length; m++) {
                    var l = p.eq(m), f = l.attr("id"), o = l.text();
                    if (f == a.id) {
                        var g = $.parseJSON(o);
                        d.data("model", g);
                        d.data("connections", []);
                        for (var k = 0; k < a.nodes.length; k++) {
                            var h = a.nodes[k], n = h.data("model").key;
                            if (n != b) {
                                a.removeNode(h)
                            }
                        }
                        a.nodes = [];
                        a.nodes.push(d);
                        a.centerNode(d)
                    } else {
                        PrimeFaces.ajax.AjaxUtils.updateElement.call(this, f, o)
                    }
                }
                PrimeFaces.ajax.AjaxUtils.handleResponse.call(this, r);
                return true
            }
        };
        e.call(a, this, c)
    }, removeNode: function (c) {
        c.data("text").remove();
        var b = c.data("connections");
        for (var a = 0; a < b.length; a++) {
            b[a].line.remove()
        }
        c.removeData();
        c.animate({opacity: 0}, this.cfg.effectSpeed, null, function () {
            this.remove()
        })
    }, nodeDragStart: function () {
        this.ox = this.attr("cx");
        this.oy = this.attr("cy")
    }, nodeDrag: function (c, b) {
        this.attr({cx: this.ox + c, cy: this.oy + b});
        this.data("text").attr({x: this.attr("cx"), y: this.attr("cy")});
        var a = this.data("widget");
        a.updateConnections(this);
        this.dragged = true
    }, nodeDragEnd: function () {
    }, textDragStart: function () {
        this.ox = this.attr("x");
        this.oy = this.attr("y")
    }, textDrag: function (c, b) {
        var d = this.data("node");
        this.attr({x: this.ox + c, y: this.oy + b});
        d.attr({cx: this.attr("x"), cy: this.attr("y")});
        var a = d.data("widget");
        a.updateConnections(d);
        d.dragged = true
    }, textDragEnd: function () {
    }, updateConnections: function (c) {
        var b = c.data("connections");
        for (var a = 0; a < b.length; a++) {
            this.raphael.connection(b[a])
        }
        this.raphael.safari()
    }
});
Raphael.fn.connection = function (z, x, h, g, b) {
    if (z.line && z.from && z.to) {
        h = z;
        z = h.from;
        x = h.to
    }
    var n = z.getBBox(), m = x.getBBox(), r = [{x: n.x + n.width / 2, y: n.y - 1}, {
        x: n.x + n.width / 2,
        y: n.y + n.height + 1
    }, {x: n.x - 1, y: n.y + n.height / 2}, {x: n.x + n.width + 1, y: n.y + n.height / 2}, {
        x: m.x + m.width / 2,
        y: m.y - 1
    }, {x: m.x + m.width / 2, y: m.y + m.height + 1}, {x: m.x - 1, y: m.y + m.height / 2}, {
        x: m.x + m.width + 1,
        y: m.y + m.height / 2
    }], B = {}, q = [];
    for (var w = 0; w < 4; w++) {
        for (var u = 4; u < 8; u++) {
            var l = Math.abs(r[w].x - r[u].x), k = Math.abs(r[w].y - r[u].y);
            if ((w == u - 4) || (((w != 3 && u != 6) || r[w].x < r[u].x) && ((w != 2 && u != 7) || r[w].x > r[u].x) && ((w != 0 && u != 5) || r[w].y > r[u].y) && ((w != 1 && u != 4) || r[w].y < r[u].y))) {
                q.push(l + k);
                B[q[q.length - 1]] = [w, u]
            }
        }
    }
    if (q.length == 0) {
        var C = [0, 4]
    } else {
        C = B[Math.min.apply(Math, q)]
    }
    var A = r[C[0]].x, f = r[C[0]].y, t = r[C[1]].x, a = r[C[1]].y;
    l = Math.max(Math.abs(A - t) / 2, 10);
    k = Math.max(Math.abs(f - a) / 2, 10);
    var y = [A, A, A - l, A + l][C[0]].toFixed(3), e = [f - k, f + k, f, f][C[0]].toFixed(3), v = [0, 0, 0, 0, t, t, t - l, t + l][C[1]].toFixed(3), c = [0, 0, 0, 0, f + k, f - k, a, a][C[1]].toFixed(3);
    var o = ["M", A.toFixed(3), f.toFixed(3), "C", y, e, v, c, t.toFixed(3), a.toFixed(3)].join(",");
    if (h && h.line) {
        h.bg && h.bg.attr({path: o});
        h.line.attr({path: o})
    } else {
        var s = typeof h == "string" ? h : "#000", o = this.path(o).attr({
            stroke: s,
            fill: "none"
        }).attr("opacity", 0).animate({opacity: 1}, b);
        o.toBack();
        return {
            bg: g && g.split && this.path(o).attr({
                stroke: g.split("|")[0],
                fill: "none",
                "stroke-width": g.split("|")[1] || 3
            }), line: o, from: z, to: x
        }
    }
};