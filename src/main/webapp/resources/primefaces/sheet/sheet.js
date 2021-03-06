PrimeFaces.widget.Sheet = PrimeFaces.widget.BaseWidget.extend({
    init: function (b) {
        this._super(b);
        this.header = this.jq.children(".ui-sheet-header");
        this.body = this.jq.children(".ui-sheet-body");
        this.editor = $(this.jqId + " .ui-sheet-editor-bar").find(".ui-sheet-editor");
        this.columnHeaders = this.header.find("thead th");
        this.cellInfoDisplay = $(this.jqId + " .ui-sheet-editor-bar .ui-sheet-cell-info");
        var a = this;
        this.body.scroll(function () {
            a.header.scrollLeft(a.body.scrollLeft())
        });
        this.bindDynamicEvents();
        this.bindStaticEvents();
        this.setupSorting();
        this.setupResizableColumns()
    }, setupResizableColumns: function () {
        this.header.find("th div.ui-sh-c").prepend('<div class="ui-column-resizer"></div>');
        this.jq.append('<div class="ui-column-resizer-helper ui-state-highlight"></div>');
        var e = $(this.jqId + " .ui-column-resizer-helper"), b = $(this.jqId + " thead th div.ui-column-resizer"), d = this.header.find("tbody"), c = $(this.jqId + " thead"), a = this;
        b.draggable({
            axis: "x", start: function (f, g) {
                e.height(a.body.height() + d.height());
                e.show();
                a.viewMode(a.cells.filter(".ui-sheet-editing"))
            }, drag: function (f, g) {
                e.offset({left: g.helper.offset().left + g.helper.width() / 2, top: c.offset().top + c.height()})
            }, stop: function (f, m) {
                var i = m.helper.parent(), g = i.parent(), h = m.originalPosition.left, k = m.position.left, l = (k - h), j = i.width() + l;
                m.helper.css("left", "");
                e.hide();
                i.width(j);
                a.header.find("tbody tr td:nth-child(" + (g.index() + 1) + ")").width(j).children("div").width(j);
                a.body.find("tr td:nth-child(" + (g.index() + 1) + ")").width(j).children("div").width(j);
                var n = {
                    source: a.id,
                    process: a.id,
                    params: [{name: a.id + "_colResize", value: true}, {
                        name: a.id + "_columnId",
                        value: g.attr("id")
                    }, {name: a.id + "_width", value: j},]
                };
                PrimeFaces.ajax.AjaxRequest(n)
            }, containment: this.jq
        })
    }, setupSorting: function () {
        var a = this;
        this.header.find(".ui-sortable-column").mouseover(function () {
            $(this).addClass("ui-state-hover")
        }).mouseout(function () {
            $(this).removeClass("ui-state-hover")
        }).click(function (d) {
            var b = $(this);
            b.siblings().removeClass("ui-state-active").find(".ui-sortable-column-icon").removeClass("ui-icon-triangle-1-n ui-icon-triangle-1-s");
            b.addClass("ui-state-active");
            var c = b.attr("id"), f = b.find(".ui-sortable-column-icon");
            if (f.hasClass("ui-icon-triangle-1-n")) {
                f.removeClass("ui-icon-triangle-1-n").addClass("ui-icon-triangle-1-s");
                a.sort(c, "DESCENDING")
            } else {
                if (f.hasClass("ui-icon-triangle-1-s")) {
                    f.removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-n");
                    a.sort(c, "ASCENDING")
                } else {
                    f.addClass("ui-icon-triangle-1-n");
                    a.sort(c, "ASCENDING")
                }
            }
        })
    }, sort: function (d, b) {
        var c = {source: this.id, update: this.id, process: this.id, formId: this.jq.parents("form:first").attr("id")};
        var a = this;
        c.onsuccess = function (j) {
            var g = $(j.documentElement), h = g.find("update");
            for (var e = 0; e < h.length; e++) {
                var l = h.eq(e), k = l.attr("id"), f = l.text();
                if (k == a.id) {
                    a.body.children("table").children("tbody").html(f);
                    a.bindDynamicEvents()
                } else {
                    PrimeFaces.ajax.AjaxUtils.updateElement.call(this, k, f)
                }
            }
            PrimeFaces.ajax.AjaxUtils.handleResponse.call(this, g);
            return true
        };
        c.params = [{name: this.id + "_sorting", value: true}, {
            name: this.id + "_sortKey",
            value: d
        }, {name: this.id + "_sortDir", value: b}];
        PrimeFaces.ajax.AjaxRequest(c)
    }, updateCellInfoDisplay: function (a) {
        var c = a.parent().siblings().eq(0).children(".ui-sheet-index-cell").html(), b = this.header.find("th").eq(a.parent().index()).children(".ui-sh-c").text();
        this.cellInfoDisplay.html(c + b)
    }, selectCell: function (a) {
        a.addClass("ui-state-highlight");
        this.editor.val(a.find("input").val());
        this.updateCellInfoDisplay(a);
        this.origin = a;
        this.cursor = a
    }, unselectCell: function (a) {
        a.removeClass("ui-state-highlight")
    }, unselectCells: function (a) {
        a.removeClass("ui-state-highlight")
    }, isSelected: function (a) {
        return a.hasClass("ui-state-highlight")
    }, checkCellViewPort: function (c) {
        var b = this, d = b.body.children("table:first"), a = b.body.height() < d.height(), f = b.body.width() < d.width();
        var e = c.offset().top + c.outerHeight(true) - b.body.offset().top;
        if (e > b.body.height()) {
            b.body.scrollTop(b.body.scrollTop() + (e - b.body.height()) + (f ? 16 : 0))
        } else {
            if ((e -= c.outerHeight(true) * 2 - c.height()) < 0) {
                b.body.scrollTop(b.body.scrollTop() + e)
            }
        }
        e = c.offset().left + c.outerWidth(true) - b.body.offset().left;
        if (e > b.body.width()) {
            b.body.scrollLeft(b.body.scrollLeft() + (e - b.body.width()) + (a ? 16 : 0))
        } else {
            if ((e -= c.outerWidth(true) * 2 - c.width()) < 0) {
                b.body.scrollLeft(b.body.scrollLeft() + e)
            }
        }
    }, bindDynamicEvents: function () {
        var a = this;
        this.cells = this.body.find("div.ui-sh-c:not(.ui-sheet-index-cell)"), this.rows = this.body.find("tr");
        this.cells.click(function (f) {
            var b = $(this), g = (f.metaKey || f.ctrlKey), c = f.shiftKey, d = a.isSelected(b);
            if (g) {
                if (d) {
                    a.unselectCell(b)
                } else {
                    a.selectCell(b)
                }
            } else {
                if (c) {
                    a.selectCells(a.origin, b)
                } else {
                    a.cells.filter(".ui-state-highlight").removeClass("ui-state-highlight");
                    a.selectCell(b)
                }
            }
            a.checkCellViewPort(b.parent())
        }).dblclick(function (c) {
            var b = $(this);
            a.editMode(b)
        });
        this.cells.find("input").blur(function (c) {
            var b = $(this).parents(".ui-sh-c:first");
            a.viewMode(b)
        }).keyup(function (g) {
            var f = $.ui.keyCode, d = g.which, c = $(this), b = $(this).parents(".ui-sh-c:first");
            if (d == f.ENTER || d == f.NUMPAD_ENTER) {
                a.viewMode(b)
            } else {
                a.editor.val(c.val())
            }
            g.preventDefault()
        })
    }, editMode: function (a) {
        a.addClass("ui-sheet-editing");
        a.children(".ui-sh-c-d").hide();
        a.children(".ui-sh-c-e").show().children("input:first").focus()
    }, viewMode: function (a) {
        if (a.length > 0) {
            var c = a.find("input"), e = a.children(".ui-sh-c-e"), d = a.children(".ui-sh-c-d"), b = c.val();
            d.html(b).show();
            e.hide();
            a.removeClass("ui-sheet-editing")
        }
    }, bindStaticEvents: function () {
        var a = this;
        this.editor.keydown(function (g) {
            var f = $.ui.keyCode, c = g.which, d = $(this), b = a.body.find("div.ui-sh-c.ui-state-highlight");
            if (c == f.ENTER || c == f.NUMPAD_ENTER) {
                b.children(".ui-sh-c-d").html(d.val());
                b.find("input:first").val(d.val());
                d.val("")
            }
        }).focus(function (b) {
            a.origin.addClass("ui-state-highlight")
        });
        $(document).bind("keydown.sheet", function (f) {
            var g = $(f.target);
            if (!g.is("html") && !g.is(document.body)) {
                return
            }
            var h = a.body.find("div.ui-sh-c.ui-state-highlight");
            if (h.length > 0) {
                var l = $.ui.keyCode, j = f.which, i = a.origin, b = f.shiftKey;
                a.cursor = a.cursor || i;
                switch (f.which) {
                    case l.RIGHT:
                        var k = a.cursor.parent().next().children("div.ui-sh-c");
                        if (k.length > 0) {
                            a.cursor = k;
                            if (b) {
                                a.selectCells(i, a.cursor)
                            } else {
                                a.cursor.click()
                            }
                        }
                        f.preventDefault();
                        break;
                    case l.LEFT:
                        var k = a.cursor.parent().prev().children("div.ui-sh-c:not(.ui-sheet-index-cell)");
                        if (k.length > 0) {
                            a.cursor = k;
                            if (b) {
                                a.selectCells(i, a.cursor)
                            } else {
                                a.cursor.click()
                            }
                        }
                        f.preventDefault();
                        break;
                    case l.ENTER:
                    case l.NUMPAD_ENTER:
                    case l.DOWN:
                        var d = a.cursor.parents("tr:first").next().children().eq(a.cursor.parent().index()).children("div.ui-sh-c");
                        if (d && d.length) {
                            a.cursor = d;
                            if (b) {
                                a.selectCells(i, a.cursor)
                            } else {
                                a.cursor.click()
                            }
                        }
                        f.preventDefault();
                        break;
                    case l.UP:
                        var c = a.cursor.parents("tr:first").prev().children().eq(a.cursor.parent().index()).children("div.ui-sh-c");
                        if (c && c.length) {
                            a.cursor = c;
                            if (b) {
                                a.selectCells(i, a.cursor)
                            } else {
                                a.cursor.click()
                            }
                        }
                        f.preventDefault();
                        break;
                    case l.BACKSPACE:
                        h.children(".ui-sh-c-d").html("&nbsp;");
                        h.find("input").val("");
                        h.removeClass("ui-state-highlight");
                        f.preventDefault();
                        break
                }
            }
        })
    }, selectCells: function (c, g) {
        this.cells.filter(".ui-state-highlight").removeClass("ui-state-highlight");
        var d = c.parents("tr:first").index(), f = c.parent().index(), e = g.parents("tr:first").index(), b = g.parent().index(), a = null;
        if (e > d) {
            a = this.rows.slice(d, e + 1)
        } else {
            a = this.rows.slice(e, d + 1)
        }
        a.each(function (h, j) {
            var k = $(j);
            if (b > f) {
                k.children().slice(f, b + 1).children("div.ui-sh-c").addClass("ui-state-highlight")
            } else {
                k.children().slice(b, f + 1).children("div.ui-sh-c").addClass("ui-state-highlight")
            }
        })
    }
});