(function (ao, t) {
    var I = {
        defaultView: "month",
        aspectRatio: 1.35,
        header: {left: "title", center: "", right: "today prev,next"},
        weekends: true,
        allDayDefault: true,
        ignoreTimezone: true,
        lazyFetching: true,
        startParam: "start",
        endParam: "end",
        titleFormat: {month: "MMMM yyyy", week: "MMM d[ yyyy]{ '&#8212;'[ MMM] d yyyy}", day: "dddd, MMM d, yyyy"},
        columnFormat: {month: "ddd", week: "ddd M/d", day: "dddd M/d"},
        timeFormat: {"": "h(:mm)t"},
        isRTL: false,
        firstDay: 0,
        monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        buttonText: {
            prev: "&nbsp;&#9668;&nbsp;",
            next: "&nbsp;&#9658;&nbsp;",
            prevYear: "&nbsp;&lt;&lt;&nbsp;",
            nextYear: "&nbsp;&gt;&gt;&nbsp;",
            today: "today",
            month: "month",
            week: "week",
            day: "day"
        },
        theme: false,
        buttonIcons: {prev: "circle-triangle-w", next: "circle-triangle-e"},
        unselectAuto: true,
        dropAccept: "*"
    };
    var O = {
        header: {left: "next,prev today", center: "", right: "title"},
        buttonText: {
            prev: "&nbsp;&#9658;&nbsp;",
            next: "&nbsp;&#9668;&nbsp;",
            prevYear: "&nbsp;&gt;&gt;&nbsp;",
            nextYear: "&nbsp;&lt;&lt;&nbsp;"
        },
        buttonIcons: {prev: "circle-triangle-e", next: "circle-triangle-w"}
    };
    var av = ao.fullCalendar = {version: "1.5.2"};
    var aa = av.views = {};
    ao.fn.fullCalendar = function (aH) {
        if (typeof aH == "string") {
            var aG = Array.prototype.slice.call(arguments, 1);
            var aI;
            this.each(function () {
                var aK = ao.data(this, "fullCalendar");
                if (aK && ao.isFunction(aK[aH])) {
                    var aJ = aK[aH].apply(aK, aG);
                    if (aI === t) {
                        aI = aJ
                    }
                    if (aH == "destroy") {
                        ao.removeData(this, "fullCalendar")
                    }
                }
            });
            if (aI !== t) {
                return aI
            }
            return this
        }
        var aF = aH.eventSources || [];
        delete aH.eventSources;
        if (aH.events) {
            aF.push(aH.events);
            delete aH.events
        }
        aH = ao.extend(true, {}, I, (aH.isRTL || aH.isRTL === t && I.isRTL) ? O : {}, aH);
        this.each(function (aL, aJ) {
            var aK = ao(aJ);
            var aM = new q(aK, aH, aF);
            aK.data("fullCalendar", aM);
            aM.render()
        });
        return this
    };
    function af(aF) {
        ao.extend(true, I, aF)
    }

    function q(aX, a4, a7) {
        var bm = this;
        bm.options = a4;
        bm.render = bd;
        bm.destroy = bo;
        bm.refetchEvents = aR;
        bm.reportEvents = aV;
        bm.reportEventChange = bq;
        bm.rerenderEvents = aJ;
        bm.changeView = aO;
        bm.select = bn;
        bm.unselect = aQ;
        bm.prev = a9;
        bm.next = aI;
        bm.prevYear = bp;
        bm.nextYear = aG;
        bm.today = aY;
        bm.gotoDate = bc;
        bm.incrementDate = a1;
        bm.formatDate = function (bx, bw) {
            return x(bx, bw, a4)
        };
        bm.formatDates = function (by, bx, bw) {
            return h(by, bx, bw, a4)
        };
        bm.getDate = a2;
        bm.getView = a8;
        bm.option = bj;
        bm.trigger = bb;
        p.call(bm, a4, a7);
        var aF = bm.isFetchNeeded;
        var bt = bm.fetchEvents;
        var bk = aX[0];
        var aK;
        var be;
        var aT;
        var bv;
        var aS;
        var bu = {};
        var ba;
        var aM;
        var aP;
        var bf = 0;
        var bl = 0;
        var br = new Date();
        var a6 = [];
        var aL;
        v(br, a4.year, a4.month, a4.date);
        function bd(bw) {
            if (!aT) {
                a5()
            } else {
                bg();
                bs();
                aH();
                a3(bw)
            }
        }

        function a5() {
            bv = a4.theme ? "ui" : "fc";
            aX.addClass("fc");
            if (a4.isRTL) {
                aX.addClass("fc-rtl")
            }
            if (a4.theme) {
                aX.addClass("ui-widget")
            }
            aT = ao("<div class='fc-content' style='position:relative'/>").prependTo(aX);
            aK = new P(bm, a4);
            be = aK.render();
            if (be) {
                aX.prepend(be)
            }
            aO(a4.defaultView);
            ao(window).resize(aU);
            if (!aW()) {
                aN()
            }
        }

        function aN() {
            setTimeout(function () {
                if (!aS.start && aW()) {
                    a3()
                }
            }, 0)
        }

        function bo() {
            ao(window).unbind("resize", aU);
            aK.destroy();
            aT.remove();
            aX.removeClass("fc fc-rtl ui-widget")
        }

        function bh() {
            return bk.offsetWidth !== 0
        }

        function aW() {
            return ao("body")[0].offsetWidth !== 0
        }

        function aO(by) {
            if (!aS || by != aS.name) {
                bl++;
                aQ();
                var bx = aS;
                var bw;
                if (bx) {
                    (bx.beforeHide || am)();
                    F(aT, aT.height());
                    bx.element.hide()
                } else {
                    F(aT, 1)
                }
                aT.css("overflow", "hidden");
                aS = bu[by];
                if (aS) {
                    aS.element.show()
                } else {
                    aS = bu[by] = new aa[by](bw = aP = ao("<div class='fc-view fc-view-" + by + "' style='position:absolute'/>").appendTo(aT), bm)
                }
                if (bx) {
                    aK.deactivateButton(bx.name)
                }
                aK.activateButton(by);
                a3();
                aT.css("overflow", "");
                if (bx) {
                    F(aT, 1)
                }
                if (!bw) {
                    (aS.afterShow || am)()
                }
                bl--
            }
        }

        function a3(by) {
            if (bh()) {
                bl++;
                aQ();
                if (aM === t) {
                    bg()
                }
                var bx = false;
                if (!aS.start || by || br < aS.start || br >= aS.end) {
                    aS.render(br, by || 0);
                    bi(true);
                    bx = true
                } else {
                    if (aS.sizeDirty) {
                        aS.clearEvents();
                        bi();
                        bx = true
                    } else {
                        if (aS.eventsDirty) {
                            aS.clearEvents();
                            bx = true
                        }
                    }
                }
                aS.sizeDirty = false;
                aS.eventsDirty = false;
                a0(bx);
                ba = aX.outerWidth();
                aK.updateTitle(aS.title);
                var bw = new Date();
                if (bw >= aS.start && bw < aS.end) {
                    aK.disableButton("today")
                } else {
                    aK.enableButton("today")
                }
                bl--;
                aS.trigger("viewDisplay", bk)
            }
        }

        function aZ() {
            bs();
            if (bh()) {
                bg();
                bi();
                aQ();
                aS.clearEvents();
                aS.renderEvents(a6);
                aS.sizeDirty = false
            }
        }

        function bs() {
            ao.each(bu, function (bw, bx) {
                bx.sizeDirty = true
            })
        }

        function bg() {
            if (a4.contentHeight) {
                aM = a4.contentHeight
            } else {
                if (a4.height) {
                    aM = a4.height - (be ? be.height() : 0) - B(aT)
                } else {
                    aM = Math.round(aT.width() / Math.max(a4.aspectRatio, 0.5))
                }
            }
        }

        function bi(bw) {
            bl++;
            aS.setHeight(aM, bw);
            if (aP) {
                aP.css("position", "relative");
                aP = null
            }
            aS.setWidth(aT.width(), bw);
            bl--
        }

        function aU() {
            if (!bl) {
                if (aS.start) {
                    var bw = ++bf;
                    setTimeout(function () {
                        if (bw == bf && !bl && bh()) {
                            if (ba != (ba = aX.outerWidth())) {
                                bl++;
                                aZ();
                                aS.trigger("windowResize", bk);
                                bl--
                            }
                        }
                    }, 200)
                } else {
                    aN()
                }
            }
        }

        function a0(bw) {
            if (!a4.lazyFetching || aF(aS.visStart, aS.visEnd)) {
                aR()
            } else {
                if (bw) {
                    aJ()
                }
            }
        }

        function aR() {
            bt(aS.visStart, aS.visEnd)
        }

        function aV(bw) {
            a6 = bw;
            aJ()
        }

        function bq(bw) {
            aJ(bw)
        }

        function aJ(bw) {
            aH();
            if (bh()) {
                aS.clearEvents();
                aS.renderEvents(a6, bw);
                aS.eventsDirty = false
            }
        }

        function aH() {
            ao.each(bu, function (bw, bx) {
                bx.eventsDirty = true
            })
        }

        function bn(by, bw, bx) {
            aS.select(by, bw, bx === t ? true : bx)
        }

        function aQ() {
            if (aS) {
                aS.unselect()
            }
        }

        function a9() {
            a3(-1)
        }

        function aI() {
            a3(1)
        }

        function bp() {
            ae(br, -1);
            a3()
        }

        function aG() {
            ae(br, 1);
            a3()
        }

        function aY() {
            br = new Date();
            a3()
        }

        function bc(bx, by, bw) {
            if (bx instanceof Date) {
                br = J(bx)
            } else {
                v(br, bx, by, bw)
            }
            a3()
        }

        function a1(bx, bw, by) {
            if (bx !== t) {
                ae(br, bx)
            }
            if (bw !== t) {
                m(br, bw)
            }
            if (by !== t) {
                ax(br, by)
            }
            a3()
        }

        function a2() {
            return J(br)
        }

        function a8() {
            return aS
        }

        function bj(bw, bx) {
            if (bx === t) {
                return a4[bw]
            }
            if (bw == "height" || bw == "contentHeight" || bw == "aspectRatio") {
                a4[bw] = bx;
                aZ()
            }
        }

        function bb(bw, bx) {
            if (a4[bw]) {
                return a4[bw].apply(bx || bk, Array.prototype.slice.call(arguments, 2))
            }
        }

        if (a4.droppable) {
            ao(document).bind("dragstart", function (by, bz) {
                var bw = by.target;
                var bA = ao(bw);
                if (!bA.parents(".fc").length) {
                    var bx = a4.dropAccept;
                    if (ao.isFunction(bx) ? bx.call(bw, bA) : bA.is(bx)) {
                        aL = bw;
                        aS.dragStart(aL, by, bz)
                    }
                }
            }).bind("dragstop", function (bw, bx) {
                if (aL) {
                    aS.dragStop(aL, bw, bx);
                    aL = null
                }
            })
        }
    }

    function P(aI, aR) {
        var aQ = this;
        aQ.render = aG;
        aQ.destroy = aM;
        aQ.updateTitle = aK;
        aQ.activateButton = aF;
        aQ.deactivateButton = aO;
        aQ.disableButton = aH;
        aQ.enableButton = aL;
        var aJ = ao([]);
        var aN;

        function aG() {
            aN = aR.theme ? "ui" : "fc";
            var aS = aR.header;
            if (aS) {
                aJ = ao("<table class='fc-header' style='width:100%'/>").append(ao("<tr/>").append(aP("left")).append(aP("center")).append(aP("right")));
                return aJ
            }
        }

        function aM() {
            aJ.remove()
        }

        function aP(aS) {
            var aU = ao("<td class='fc-header-" + aS + "'/>");
            var aT = aR.header[aS];
            if (aT) {
                ao.each(aT.split(" "), function (aW) {
                    if (aW > 0) {
                        aU.append("<span class='fc-header-space'/>")
                    }
                    var aV;
                    ao.each(this.split(","), function (aZ, aY) {
                        if (aY == "title") {
                            aU.append("<span class='fc-header-title'><h2>&nbsp;</h2></span>");
                            if (aV) {
                                aV.addClass(aN + "-corner-right")
                            }
                            aV = null
                        } else {
                            var aX;
                            if (aI[aY]) {
                                aX = aI[aY]
                            } else {
                                if (aa[aY]) {
                                    aX = function () {
                                        a0.removeClass(aN + "-state-hover");
                                        aI.changeView(aY)
                                    }
                                }
                            }
                            if (aX) {
                                var a1 = aR.theme ? A(aR.buttonIcons, aY) : null;
                                var a2 = A(aR.buttonText, aY);
                                var a0 = ao("<span class='fc-button fc-button-" + aY + " " + aN + "-state-default'><span class='fc-button-inner'><span class='fc-button-content'>" + (a1 ? "<span class='fc-icon-wrap'><span class='ui-icon ui-icon-" + a1 + "'/></span>" : a2) + "</span><span class='fc-button-effect'><span></span></span></span></span>");
                                if (a0) {
                                    a0.click(function () {
                                        if (!a0.hasClass(aN + "-state-disabled")) {
                                            aX()
                                        }
                                    }).mousedown(function () {
                                        a0.not("." + aN + "-state-active").not("." + aN + "-state-disabled").addClass(aN + "-state-down")
                                    }).mouseup(function () {
                                        a0.removeClass(aN + "-state-down")
                                    }).hover(function () {
                                        a0.not("." + aN + "-state-active").not("." + aN + "-state-disabled").addClass(aN + "-state-hover")
                                    }, function () {
                                        a0.removeClass(aN + "-state-hover").removeClass(aN + "-state-down")
                                    }).appendTo(aU);
                                    if (!aV) {
                                        a0.addClass(aN + "-corner-left")
                                    }
                                    aV = a0
                                }
                            }
                        }
                    });
                    if (aV) {
                        aV.addClass(aN + "-corner-right")
                    }
                })
            }
            return aU
        }

        function aK(aS) {
            aJ.find("h2").html(aS)
        }

        function aF(aS) {
            aJ.find("span.fc-button-" + aS).addClass(aN + "-state-active")
        }

        function aO(aS) {
            aJ.find("span.fc-button-" + aS).removeClass(aN + "-state-active")
        }

        function aH(aS) {
            aJ.find("span.fc-button-" + aS).addClass(aN + "-state-disabled")
        }

        function aL(aS) {
            aJ.find("span.fc-button-" + aS).removeClass(aN + "-state-disabled")
        }
    }

    av.sourceNormalizers = [];
    av.sourceFetchers = [];
    var k = {dataType: "json", cache: false};
    var S = 1;

    function p(aL, aT) {
        var aV = this;
        aV.isFetchNeeded = aN;
        aV.fetchEvents = aU;
        aV.addEventSource = aI;
        aV.removeEventSource = aJ;
        aV.updateEvent = aY;
        aV.renderEvent = aR;
        aV.removeEvents = ba;
        aV.clientEvents = a4;
        aV.normalizeEvent = aQ;
        var aX = aV.trigger;
        var aF = aV.getView;
        var a0 = aV.reportEvents;
        var a2 = {events: []};
        var aG = [a2];
        var a7, a3;
        var aH = 0;
        var a8 = 0;
        var a6 = 0;
        var aW = [];
        for (var a5 = 0; a5 < aT.length; a5++) {
            aZ(aT[a5])
        }
        function aN(bc, bb) {
            return !a7 || bc < a7 || bb > a3
        }

        function aU(bf, bc) {
            a7 = bf;
            a3 = bc;
            aW = [];
            var be = ++aH;
            var bb = aG.length;
            a8 = bb;
            for (var bd = 0; bd < bb; bd++) {
                aM(aG[bd], be)
            }
        }

        function aM(bc, bb) {
            a1(bc, function (be) {
                if (bb == aH) {
                    if (be) {
                        for (var bd = 0; bd < be.length; bd++) {
                            be[bd].source = bc;
                            aQ(be[bd])
                        }
                        aW = aW.concat(be)
                    }
                    a8--;
                    if (!a8) {
                        a0(aW)
                    }
                }
            })
        }

        function a1(bb, bl) {
            var bg;
            var bk = av.sourceFetchers;
            var bi;
            for (bg = 0; bg < bk.length; bg++) {
                bi = bk[bg](bb, a7, a3, bl);
                if (bi === true) {
                    return
                } else {
                    if (typeof bi == "object") {
                        a1(bi, bl);
                        return
                    }
                }
            }
            var bn = bb.events;
            if (bn) {
                if (ao.isFunction(bn)) {
                    aP();
                    bn(J(a7), J(a3), function (bo) {
                        bl(bo);
                        a9()
                    })
                } else {
                    if (ao.isArray(bn)) {
                        bl(bn)
                    } else {
                        bl()
                    }
                }
            } else {
                var bc = bb.url;
                if (bc) {
                    var bm = bb.success;
                    var bj = bb.error;
                    var bd = bb.complete;
                    var bf = ao.extend({}, bb.data || {});
                    var bh = aD(bb.startParam, aL.startParam);
                    var be = aD(bb.endParam, aL.endParam);
                    if (bh) {
                        bf[bh] = Math.round(+a7 / 1000)
                    }
                    if (be) {
                        bf[be] = Math.round(+a3 / 1000)
                    }
                    aP();
                    ao.ajax(ao.extend({}, k, bb, {
                        data: bf, success: function (bp) {
                            bp = bp || [];
                            var bo = E(bm, this, arguments);
                            if (ao.isArray(bo)) {
                                bp = bo
                            }
                            bl(bp)
                        }, error: function () {
                            E(bj, this, arguments);
                            bl()
                        }, complete: function () {
                            E(bd, this, arguments);
                            a9()
                        }
                    }))
                } else {
                    bl()
                }
            }
        }

        function aI(bb) {
            bb = aZ(bb);
            if (bb) {
                a8++;
                aM(bb, aH)
            }
        }

        function aZ(bb) {
            if (ao.isFunction(bb) || ao.isArray(bb)) {
                bb = {events: bb}
            } else {
                if (typeof bb == "string") {
                    bb = {url: bb}
                }
            }
            if (typeof bb == "object") {
                aS(bb);
                aG.push(bb);
                return bb
            }
        }

        function aJ(bb) {
            aG = ao.grep(aG, function (bc) {
                return !aO(bc, bb)
            });
            aW = ao.grep(aW, function (bc) {
                return !aO(bc.source, bb)
            });
            a0(aW)
        }

        function aY(bg) {
            var be, bc = aW.length, bh, bb = aF().defaultEventEnd, bf = bg.start - bg._start, bd = bg.end ? (bg.end - (bg._end || bb(bg))) : 0;
            for (be = 0; be < bc; be++) {
                bh = aW[be];
                if (bh._id == bg._id && bh != bg) {
                    bh.start = new Date(+bh.start + bf);
                    if (bg.end) {
                        if (bh.end) {
                            bh.end = new Date(+bh.end + bd)
                        } else {
                            bh.end = new Date(+bb(bh) + bd)
                        }
                    } else {
                        bh.end = null
                    }
                    bh.title = bg.title;
                    bh.url = bg.url;
                    bh.allDay = bg.allDay;
                    bh.className = bg.className;
                    bh.editable = bg.editable;
                    bh.color = bg.color;
                    bh.backgroudColor = bg.backgroudColor;
                    bh.borderColor = bg.borderColor;
                    bh.textColor = bg.textColor;
                    aQ(bh)
                }
            }
            aQ(bg);
            a0(aW)
        }

        function aR(bc, bb) {
            aQ(bc);
            if (!bc.source) {
                if (bb) {
                    a2.events.push(bc);
                    bc.source = a2
                }
                aW.push(bc)
            }
            a0(aW)
        }

        function ba(bc) {
            if (!bc) {
                aW = [];
                for (var bb = 0; bb < aG.length; bb++) {
                    if (ao.isArray(aG[bb].events)) {
                        aG[bb].events = []
                    }
                }
            } else {
                if (!ao.isFunction(bc)) {
                    var bd = bc + "";
                    bc = function (be) {
                        return be._id == bd
                    }
                }
                aW = ao.grep(aW, bc, true);
                for (var bb = 0; bb < aG.length; bb++) {
                    if (ao.isArray(aG[bb].events)) {
                        aG[bb].events = ao.grep(aG[bb].events, bc, true)
                    }
                }
            }
            a0(aW)
        }

        function a4(bb) {
            if (ao.isFunction(bb)) {
                return ao.grep(aW, bb)
            } else {
                if (bb) {
                    bb += "";
                    return ao.grep(aW, function (bc) {
                        return bc._id == bb
                    })
                }
            }
            return aW
        }

        function aP() {
            if (!a6++) {
                aX("loading", null, true)
            }
        }

        function a9() {
            if (!--a6) {
                aX("loading", null, false)
            }
        }

        function aQ(bc) {
            var bd = bc.source || {};
            var bb = aD(bd.ignoreTimezone, aL.ignoreTimezone);
            bc._id = bc._id || (bc.id === t ? "_fc" + S++ : bc.id + "");
            if (bc.date) {
                if (!bc.start) {
                    bc.start = bc.date
                }
                delete bc.date
            }
            bc._start = J(bc.start = W(bc.start, bb));
            bc.end = W(bc.end, bb);
            if (bc.end && bc.end <= bc.start) {
                bc.end = null
            }
            bc._end = bc.end ? J(bc.end) : null;
            if (bc.allDay === t) {
                bc.allDay = aD(bd.allDayDefault, aL.allDayDefault)
            }
            if (bc.className) {
                if (typeof bc.className == "string") {
                    bc.className = bc.className.split(/\s+/)
                }
            } else {
                bc.className = []
            }
        }

        function aS(bd) {
            if (bd.className) {
                if (typeof bd.className == "string") {
                    bd.className = bd.className.split(/\s+/)
                }
            } else {
                bd.className = []
            }
            var bc = av.sourceNormalizers;
            for (var bb = 0; bb < bc.length; bb++) {
                bc[bb](bd)
            }
        }

        function aO(bc, bb) {
            return bc && bb && aK(bc) == aK(bb)
        }

        function aK(bb) {
            return ((typeof bb == "object") ? (bb.events || bb.url) : "") || bb
        }
    }

    av.addDays = ax;
    av.cloneDate = J;
    av.parseDate = W;
    av.parseISO8601 = l;
    av.parseTime = aB;
    av.formatDate = x;
    av.formatDates = h;
    var M = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"], aq = 86400000, ag = 3600000, R = 60000;

    function ae(aG, aH, aF) {
        aG.setFullYear(aG.getFullYear() + aH);
        if (!aF) {
            b(aG)
        }
        return aG
    }

    function m(aI, aJ, aH) {
        if (+aI) {
            var aF = aI.getMonth() + aJ, aG = J(aI);
            aG.setDate(1);
            aG.setMonth(aF);
            aI.setMonth(aF);
            if (!aH) {
                b(aI)
            }
            while (aI.getMonth() != aG.getMonth()) {
                aI.setDate(aI.getDate() + (aI < aG ? 1 : -1))
            }
        }
        return aI
    }

    function ax(aI, aJ, aH) {
        if (+aI) {
            var aF = aI.getDate() + aJ, aG = J(aI);
            aG.setHours(9);
            aG.setDate(aF);
            aI.setDate(aF);
            if (!aH) {
                b(aI)
            }
            az(aI, aG)
        }
        return aI
    }

    function az(aG, aF) {
        if (+aG) {
            while (aG.getDate() != aF.getDate()) {
                aG.setTime(+aG + (aG < aF ? 1 : -1) * ag)
            }
        }
    }

    function g(aF, aG) {
        aF.setMinutes(aF.getMinutes() + aG);
        return aF
    }

    function b(aF) {
        aF.setHours(0);
        aF.setMinutes(0);
        aF.setSeconds(0);
        aF.setMilliseconds(0);
        return aF
    }

    function J(aF, aG) {
        if (aG) {
            return b(new Date(+aF))
        }
        return new Date(+aF)
    }

    function d() {
        var aF = 0, aG;
        do {
            aG = new Date(1970, aF++, 1)
        } while (aG.getHours());
        return aG
    }

    function aC(aF, aG, aH) {
        aG = aG || 1;
        while (!aF.getDay() || (aH && aF.getDay() == 1 || !aH && aF.getDay() == 6)) {
            ax(aF, aG)
        }
        return aF
    }

    function au(aG, aF) {
        return Math.round((J(aG, true) - J(aF, true)) / aq)
    }

    function v(aG, aI, aF, aH) {
        if (aI !== t && aI != aG.getFullYear()) {
            aG.setDate(1);
            aG.setMonth(0);
            aG.setFullYear(aI)
        }
        if (aF !== t && aF != aG.getMonth()) {
            aG.setDate(1);
            aG.setMonth(aF)
        }
        if (aH !== t) {
            aG.setDate(aH)
        }
    }

    function W(aG, aF) {
        if (typeof aG == "object") {
            return aG
        }
        if (typeof aG == "number") {
            return new Date(aG * 1000)
        }
        if (typeof aG == "string") {
            if (aG.match(/^\d+(\.\d+)?$/)) {
                return new Date(parseFloat(aG) * 1000)
            }
            if (aF === t) {
                aF = true
            }
            return l(aG, aF) || (aG ? new Date(aG) : null)
        }
        return null
    }

    function l(aJ, aG) {
        var aF = aJ.match(/^([0-9]{4})(-([0-9]{2})(-([0-9]{2})([T ]([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?(Z|(([-+])([0-9]{2})(:?([0-9]{2}))?))?)?)?)?$/);
        if (!aF) {
            return null
        }
        var aI = new Date(aF[1], 0, 1);
        if (aG || !aF[13]) {
            var aH = new Date(aF[1], 0, 1, 9, 0);
            if (aF[3]) {
                aI.setMonth(aF[3] - 1);
                aH.setMonth(aF[3] - 1)
            }
            if (aF[5]) {
                aI.setDate(aF[5]);
                aH.setDate(aF[5])
            }
            az(aI, aH);
            if (aF[7]) {
                aI.setHours(aF[7])
            }
            if (aF[8]) {
                aI.setMinutes(aF[8])
            }
            if (aF[10]) {
                aI.setSeconds(aF[10])
            }
            if (aF[12]) {
                aI.setMilliseconds(Number("0." + aF[12]) * 1000)
            }
            az(aI, aH)
        } else {
            aI.setUTCFullYear(aF[1], aF[3] ? aF[3] - 1 : 0, aF[5] || 1);
            aI.setUTCHours(aF[7] || 0, aF[8] || 0, aF[10] || 0, aF[12] ? Number("0." + aF[12]) * 1000 : 0);
            if (aF[14]) {
                var aK = Number(aF[16]) * 60 + (aF[18] ? Number(aF[18]) : 0);
                aK *= aF[15] == "-" ? 1 : -1;
                aI = new Date(+aI + (aK * 60 * 1000))
            }
        }
        return aI
    }

    function aB(aH) {
        if (typeof aH == "number") {
            return aH * 60
        }
        if (typeof aH == "object") {
            return aH.getHours() * 60 + aH.getMinutes()
        }
        var aF = aH.match(/(\d+)(?::(\d+))?\s*(\w+)?/);
        if (aF) {
            var aG = parseInt(aF[1], 10);
            if (aF[3]) {
                aG %= 12;
                if (aF[3].toLowerCase().charAt(0) == "p") {
                    aG += 12
                }
            }
            return aG * 60 + (aF[2] ? parseInt(aF[2], 10) : 0)
        }
    }

    function x(aG, aH, aF) {
        return h(aG, null, aH, aF)
    }

    function h(aR, aQ, aP, aS) {
        aS = aS || I;
        var aG = aR, aI = aQ, aJ, aK = aP.length, aM, aH, aO, aL = "";
        for (aJ = 0; aJ < aK; aJ++) {
            aM = aP.charAt(aJ);
            if (aM == "'") {
                for (aH = aJ + 1; aH < aK; aH++) {
                    if (aP.charAt(aH) == "'") {
                        if (aG) {
                            if (aH == aJ + 1) {
                                aL += "'"
                            } else {
                                aL += aP.substring(aJ + 1, aH)
                            }
                            aJ = aH
                        }
                        break
                    }
                }
            } else {
                if (aM == "(") {
                    for (aH = aJ + 1; aH < aK; aH++) {
                        if (aP.charAt(aH) == ")") {
                            var aF = x(aG, aP.substring(aJ + 1, aH), aS);
                            if (parseInt(aF.replace(/\D/, ""), 10)) {
                                aL += aF
                            }
                            aJ = aH;
                            break
                        }
                    }
                } else {
                    if (aM == "[") {
                        for (aH = aJ + 1; aH < aK; aH++) {
                            if (aP.charAt(aH) == "]") {
                                var aN = aP.substring(aJ + 1, aH);
                                var aF = x(aG, aN, aS);
                                if (aF != x(aI, aN, aS)) {
                                    aL += aF
                                }
                                aJ = aH;
                                break
                            }
                        }
                    } else {
                        if (aM == "{") {
                            aG = aQ;
                            aI = aR
                        } else {
                            if (aM == "}") {
                                aG = aR;
                                aI = aQ
                            } else {
                                for (aH = aK; aH > aJ; aH--) {
                                    if (aO = at[aP.substring(aJ, aH)]) {
                                        if (aG) {
                                            aL += aO(aG, aS)
                                        }
                                        aJ = aH - 1;
                                        break
                                    }
                                }
                                if (aH == aJ) {
                                    if (aG) {
                                        aL += aM
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return aL
    }

    var at = {
        s: function (aF) {
            return aF.getSeconds()
        }, ss: function (aF) {
            return X(aF.getSeconds())
        }, m: function (aF) {
            return aF.getMinutes()
        }, mm: function (aF) {
            return X(aF.getMinutes())
        }, h: function (aF) {
            return aF.getHours() % 12 || 12
        }, hh: function (aF) {
            return X(aF.getHours() % 12 || 12)
        }, H: function (aF) {
            return aF.getHours()
        }, HH: function (aF) {
            return X(aF.getHours())
        }, d: function (aF) {
            return aF.getDate()
        }, dd: function (aF) {
            return X(aF.getDate())
        }, ddd: function (aG, aF) {
            return aF.dayNamesShort[aG.getDay()]
        }, dddd: function (aG, aF) {
            return aF.dayNames[aG.getDay()]
        }, M: function (aF) {
            return aF.getMonth() + 1
        }, MM: function (aF) {
            return X(aF.getMonth() + 1)
        }, MMM: function (aG, aF) {
            return aF.monthNamesShort[aG.getMonth()]
        }, MMMM: function (aG, aF) {
            return aF.monthNames[aG.getMonth()]
        }, yy: function (aF) {
            return (aF.getFullYear() + "").substring(2)
        }, yyyy: function (aF) {
            return aF.getFullYear()
        }, t: function (aF) {
            return aF.getHours() < 12 ? "a" : "p"
        }, tt: function (aF) {
            return aF.getHours() < 12 ? "am" : "pm"
        }, T: function (aF) {
            return aF.getHours() < 12 ? "A" : "P"
        }, TT: function (aF) {
            return aF.getHours() < 12 ? "AM" : "PM"
        }, u: function (aF) {
            return x(aF, "yyyy-MM-dd'T'HH:mm:ss'Z'")
        }, S: function (aG) {
            var aF = aG.getDate();
            if (aF > 10 && aF < 20) {
                return "th"
            }
            return ["st", "nd", "rd"][aF % 10 - 1] || "th"
        }
    };
    av.applyAll = E;
    function aj(aF) {
        if (aF.end) {
            return o(aF.end, aF.allDay)
        } else {
            return ax(J(aF.start), 1)
        }
    }

    function o(aF, aG) {
        aF = J(aF);
        return aG || aF.getHours() || aF.getMinutes() ? ax(aF, 1) : b(aF)
    }

    function r(aG, aF) {
        return (aF.msLength - aG.msLength) * 100 + (aG.event.start - aF.event.start)
    }

    function K(aG, aF) {
        return aG.end > aF.start && aG.start < aF.end
    }

    function Y(aR, aL, aH, aK) {
        var aI = [], aM, aO = aR.length, aG, aP, aN, aQ, aS, aF, aJ;
        for (aM = 0; aM < aO; aM++) {
            aG = aR[aM];
            aP = aG.start;
            aN = aL[aM];
            if (aN > aH && aP < aK) {
                if (aP < aH) {
                    aQ = J(aH);
                    aF = false
                } else {
                    aQ = aP;
                    aF = true
                }
                if (aN > aK) {
                    aS = J(aK);
                    aJ = false
                } else {
                    aS = aN;
                    aJ = true
                }
                aI.push({event: aG, start: aQ, end: aS, isStart: aF, isEnd: aJ, msLength: aS - aQ})
            }
        }
        return aI.sort(r)
    }

    function ad(aH) {
        var aL = [], aK, aF = aH.length, aG, aJ, aM, aI;
        for (aK = 0; aK < aF; aK++) {
            aG = aH[aK];
            aJ = 0;
            while (true) {
                aM = false;
                if (aL[aJ]) {
                    for (aI = 0; aI < aL[aJ].length; aI++) {
                        if (K(aL[aJ][aI], aG)) {
                            aM = true;
                            break
                        }
                    }
                }
                if (aM) {
                    aJ++
                } else {
                    break
                }
            }
            if (aL[aJ]) {
                aL[aJ].push(aG)
            } else {
                aL[aJ] = [aG]
            }
        }
        return aL
    }

    function s(aG, aF, aH) {
        aG.unbind("mouseover").mouseover(function (aL) {
            var aK = aL.target, aM, aJ, aI;
            while (aK != this) {
                aM = aK;
                aK = aK.parentNode
            }
            if ((aJ = aM._fci) !== t) {
                aM._fci = t;
                aI = aF[aJ];
                aH(aI.event, aI.element, aI);
                ao(aL.target).trigger(aL)
            }
            aL.stopPropagation()
        })
    }

    function ap(aH, aI, aF) {
        for (var aG = 0, aJ; aG < aH.length; aG++) {
            aJ = ao(aH[aG]);
            aJ.width(Math.max(0, aI - f(aJ, aF)))
        }
    }

    function V(aI, aF, aG) {
        for (var aH = 0, aJ; aH < aI.length; aH++) {
            aJ = ao(aI[aH]);
            aJ.height(Math.max(0, aF - B(aJ, aG)))
        }
    }

    function f(aG, aF) {
        return ac(aG) + n(aG) + (aF ? ab(aG) : 0)
    }

    function ac(aF) {
        return (parseFloat(ao.curCSS(aF[0], "paddingLeft", true)) || 0) + (parseFloat(ao.curCSS(aF[0], "paddingRight", true)) || 0)
    }

    function ab(aF) {
        return (parseFloat(ao.curCSS(aF[0], "marginLeft", true)) || 0) + (parseFloat(ao.curCSS(aF[0], "marginRight", true)) || 0)
    }

    function n(aF) {
        return (parseFloat(ao.curCSS(aF[0], "borderLeftWidth", true)) || 0) + (parseFloat(ao.curCSS(aF[0], "borderRightWidth", true)) || 0)
    }

    function B(aG, aF) {
        return u(aG) + al(aG) + (aF ? i(aG) : 0)
    }

    function u(aF) {
        return (parseFloat(ao.curCSS(aF[0], "paddingTop", true)) || 0) + (parseFloat(ao.curCSS(aF[0], "paddingBottom", true)) || 0)
    }

    function i(aF) {
        return (parseFloat(ao.curCSS(aF[0], "marginTop", true)) || 0) + (parseFloat(ao.curCSS(aF[0], "marginBottom", true)) || 0)
    }

    function al(aF) {
        return (parseFloat(ao.curCSS(aF[0], "borderTopWidth", true)) || 0) + (parseFloat(ao.curCSS(aF[0], "borderBottomWidth", true)) || 0)
    }

    function F(aG, aF) {
        aF = (typeof aF == "number" ? aF + "px" : aF);
        aG.each(function (aI, aH) {
            aH.style.cssText += ";min-height:" + aF + ";_height:" + aF
        })
    }

    function am() {
    }

    function T(aG, aF) {
        return aG - aF
    }

    function an(aF) {
        return Math.max.apply(Math, aF)
    }

    function X(aF) {
        return (aF < 10 ? "0" : "") + aF
    }

    function A(aJ, aF) {
        if (aJ[aF] !== t) {
            return aJ[aF]
        }
        var aI = aF.split(/(?=[A-Z])/), aH = aI.length - 1, aG;
        for (; aH >= 0; aH--) {
            aG = aJ[aI[aH].toLowerCase()];
            if (aG !== t) {
                return aG
            }
        }
        return aJ[""]
    }

    function aA(aF) {
        return aF.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#039;").replace(/"/g, "&quot;").replace(/\n/g, "<br />")
    }

    function D(aF) {
        return aF.id + "/" + aF.className + "/" + aF.style.cssText.replace(/(^|;)\s*(top|left|width|height)\s*:[^;]*/ig, "")
    }

    function aE(aF) {
        aF.attr("unselectable", "on").css("MozUserSelect", "none").bind("selectstart.ui", function () {
            return false
        })
    }

    function c(aF) {
        aF.children().removeClass("fc-first fc-last").filter(":first-child").addClass("fc-first").end().filter(":last-child").addClass("fc-last")
    }

    function H(aF, aG) {
        aF.each(function (aH, aI) {
            aI.className = aI.className.replace(/^fc-\w*/, "fc-" + M[aG.getDay()])
        })
    }

    function N(aG, aH) {
        var aF = aG.source || {};
        var aM = aG.color;
        var aK = aF.color;
        var aJ = aH("eventColor");
        var aN = aG.backgroundColor || aM || aF.backgroundColor || aK || aH("eventBackgroundColor") || aJ;
        var aI = aG.borderColor || aM || aF.borderColor || aK || aH("eventBorderColor") || aJ;
        var aO = aG.textColor || aF.textColor || aH("eventTextColor");
        var aL = [];
        if (aN) {
            aL.push("background-color:" + aN)
        }
        if (aI) {
            aL.push("border-color:" + aI)
        }
        if (aO) {
            aL.push("color:" + aO)
        }
        return aL.join(";")
    }

    function E(aI, aJ, aG) {
        if (ao.isFunction(aI)) {
            aI = [aI]
        }
        if (aI) {
            var aH;
            var aF;
            for (aH = 0; aH < aI.length; aH++) {
                aF = aI[aH].apply(aJ, aG) || aF
            }
            return aF
        }
    }

    function aD() {
        for (var aF = 0; aF < arguments.length; aF++) {
            if (arguments[aF] !== t) {
                return arguments[aF]
            }
        }
    }

    aa.month = Z;
    function Z(aI, aL) {
        var aH = this;
        aH.render = aJ;
        w.call(aH, aI, aL, "month");
        var aG = aH.opt;
        var aF = aH.renderBasic;
        var aK = aL.formatDate;

        function aJ(aP, aT) {
            if (aT) {
                m(aP, aT);
                aP.setDate(1)
            }
            var aN = J(aP, true);
            aN.setDate(1);
            var aQ = m(J(aN), 1);
            var aU = J(aN);
            var aR = J(aQ);
            var aM = aG("firstDay");
            var aO = aG("weekends") ? 0 : 1;
            if (aO) {
                aC(aU);
                aC(aR, -1, true)
            }
            ax(aU, -((aU.getDay() - Math.max(aM, aO) + 7) % 7));
            ax(aR, (7 - aR.getDay() + Math.max(aM, aO)) % 7);
            var aS = Math.round((aR - aU) / (aq * 7));
            if (aG("weekMode") == "fixed") {
                ax(aR, (6 - aS) * 7);
                aS = 6
            }
            aH.title = aK(aN, aG("titleFormat"));
            aH.start = aN;
            aH.end = aQ;
            aH.visStart = aU;
            aH.visEnd = aR;
            aF(6, aS, aO ? 5 : 7, true)
        }
    }

    aa.basicWeek = aw;
    function aw(aJ, aL) {
        var aI = this;
        aI.render = aK;
        w.call(aI, aJ, aL, "basicWeek");
        var aH = aI.opt;
        var aG = aI.renderBasic;
        var aF = aL.formatDates;

        function aK(aQ, aS) {
            if (aS) {
                ax(aQ, aS * 7)
            }
            var aR = ax(J(aQ), -((aQ.getDay() - aH("firstDay") + 7) % 7));
            var aO = ax(J(aR), 7);
            var aN = J(aR);
            var aM = J(aO);
            var aP = aH("weekends");
            if (!aP) {
                aC(aN);
                aC(aM, -1, true)
            }
            aI.title = aF(aN, ax(J(aM), -1), aH("titleFormat"));
            aI.start = aR;
            aI.end = aO;
            aI.visStart = aN;
            aI.visEnd = aM;
            aG(1, 1, aP ? 7 : 5, false)
        }
    }

    aa.basicDay = G;
    function G(aI, aL) {
        var aH = this;
        aH.render = aJ;
        w.call(aH, aI, aL, "basicDay");
        var aG = aH.opt;
        var aF = aH.renderBasic;
        var aK = aL.formatDate;

        function aJ(aM, aN) {
            if (aN) {
                ax(aM, aN);
                if (!aG("weekends")) {
                    aC(aM, aN < 0 ? -1 : 1)
                }
            }
            aH.title = aK(aM, aG("titleFormat"));
            aH.start = aH.visStart = J(aM, true);
            aH.end = aH.visEnd = ax(J(aH.start), 1);
            aF(1, 1, 1, false)
        }
    }

    af({weekMode: "fixed"});
    function w(aV, bl, aO) {
        var bk = this;
        bk.renderBasic = bd;
        bk.setHeight = bi;
        bk.setWidth = bs;
        bk.renderDayOverlay = a8;
        bk.defaultSelectionEnd = a7;
        bk.renderSelection = bm;
        bk.clearSelection = aF;
        bk.reportDayClick = aT;
        bk.dragStart = aH;
        bk.dragStop = aP;
        bk.defaultEventEnd = bz;
        bk.getHoverListener = function () {
            return aI
        };
        bk.colContentLeft = bh;
        bk.colContentRight = be;
        bk.dayOfWeekCol = a3;
        bk.dateCell = bf;
        bk.cellDate = by;
        bk.cellIsAllDay = function () {
            return true
        };
        bk.allDayRow = aS;
        bk.allDayBounds = bp;
        bk.getRowCnt = function () {
            return a1
        };
        bk.getColCnt = function () {
            return aK
        };
        bk.getColWidth = function () {
            return a4
        };
        bk.getDaySegmentContainer = function () {
            return aR
        };
        ay.call(bk, aV, bl, aO);
        a.call(bk);
        ai.call(bk);
        ah.call(bk);
        var aY = bk.opt;
        var ba = bk.trigger;
        var a6 = bk.clearEvents;
        var bv = bk.renderOverlay;
        var aN = bk.clearOverlays;
        var bg = bk.daySelectionMousedown;
        var bj = bl.formatDate;
        var aU;
        var aQ;
        var a2;
        var aM;
        var aW;
        var a5;
        var bc;
        var aR;
        var bw;
        var bB;
        var a4;
        var a1, aK;
        var bo;
        var aI;
        var bq;
        var bn, bA, bx;
        var a0;
        var aX;
        var bC;
        var aL;
        aE(aV.addClass("fc-grid"));
        function bd(bE, bF, bH, bD) {
            a1 = bF;
            aK = bH;
            bt();
            var bG = !a2;
            if (bG) {
                a9(bE, bD)
            } else {
                a6()
            }
            aG(bG)
        }

        function bt() {
            bn = aY("isRTL");
            if (bn) {
                bA = -1;
                bx = aK - 1
            } else {
                bA = 1;
                bx = 0
            }
            a0 = aY("firstDay");
            aX = aY("weekends") ? 0 : 1;
            bC = aY("theme") ? "ui" : "fc";
            aL = aY("columnFormat")
        }

        function a9(bJ, bG) {
            var bI;
            var bH = bC + "-widget-header";
            var bE = bC + "-widget-content";
            var bF, bD;
            var bK;
            bI = "<table class='fc-border-separate' style='width:100%' cellspacing='0'><thead><tr>";
            for (bF = 0; bF < aK; bF++) {
                bI += "<th class='fc- " + bH + "'/>"
            }
            bI += "</tr></thead><tbody>";
            for (bF = 0; bF < bJ; bF++) {
                bI += "<tr class='fc-week" + bF + "'>";
                for (bD = 0; bD < aK; bD++) {
                    bI += "<td class='fc- " + bE + " fc-day" + (bF * aK + bD) + "'><div>" + (bG ? "<div class='fc-day-number'/>" : "") + "<div class='fc-day-content'><div style='position:relative'>&nbsp;</div></div></div></td>"
                }
                bI += "</tr>"
            }
            bI += "</tbody></table>";
            bK = ao(bI).appendTo(aV);
            aU = bK.find("thead");
            aQ = aU.find("th");
            a2 = bK.find("tbody");
            aM = a2.find("tr");
            aW = a2.find("td");
            a5 = aW.filter(":first-child");
            bc = aM.eq(0).find("div.fc-day-content div");
            c(aU.add(aU.find("tr")));
            c(aM);
            aM.eq(0).addClass("fc-first");
            aJ(aW);
            aR = ao("<div style='position:absolute;z-index:8;top:0;left:0'/>").appendTo(aV)
        }

        function aG(bJ) {
            var bG = bJ || a1 == 1;
            var bH = bk.start.getMonth();
            var bE = b(new Date());
            var bD;
            var bF;
            var bI;
            if (bG) {
                aQ.each(function (bK, bL) {
                    bD = ao(bL);
                    bF = bb(bK);
                    bD.html(bj(bF, aL));
                    H(bD, bF)
                })
            }
            aW.each(function (bK, bL) {
                bD = ao(bL);
                bF = bb(bK);
                if (bF.getMonth() == bH) {
                    bD.removeClass("fc-other-month")
                } else {
                    bD.addClass("fc-other-month")
                }
                if (+bF == +bE) {
                    bD.addClass(bC + "-state-highlight fc-today")
                } else {
                    bD.removeClass(bC + "-state-highlight fc-today")
                }
                bD.find("div.fc-day-number").text(bF.getDate());
                if (bG) {
                    H(bD, bF)
                }
            });
            aM.each(function (bK, bL) {
                bI = ao(bL);
                if (bK < a1) {
                    bI.show();
                    if (bK == a1 - 1) {
                        bI.addClass("fc-last")
                    } else {
                        bI.removeClass("fc-last")
                    }
                } else {
                    bI.hide()
                }
            })
        }

        function bi(bE) {
            bB = bE;
            var bH = bB - aU.height();
            var bG;
            var bF;
            var bD;
            if (aY("weekMode") == "variable") {
                bG = bF = Math.floor(bH / (a1 == 1 ? 2 : 6))
            } else {
                bG = Math.floor(bH / a1);
                bF = bH - bG * (a1 - 1)
            }
            a5.each(function (bI, bJ) {
                if (bI < a1) {
                    bD = ao(bJ);
                    F(bD.find("> div"), (bI == a1 - 1 ? bF : bG) - B(bD))
                }
            })
        }

        function bs(bD) {
            bw = bD;
            bq.clear();
            a4 = Math.floor(bw / aK);
            ap(aQ.slice(0, -1), a4)
        }

        function aJ(bD) {
            bD.click(bu).mousedown(bg)
        }

        function bu(bF) {
            if (!aY("selectable")) {
                var bE = parseInt(this.className.match(/fc\-day(\d+)/)[1]);
                var bD = bb(bE);
                ba("dayClick", this, bD, true, bF)
            }
        }

        function a8(bI, bM, bG) {
            if (bG) {
                bo.build()
            }
            var bD = J(bk.visStart);
            var bJ = ax(J(bD), aK);
            for (var bF = 0; bF < a1; bF++) {
                var bH = new Date(Math.max(bD, bI));
                var bL = new Date(Math.min(bJ, bM));
                if (bH < bL) {
                    var bE, bK;
                    if (bn) {
                        bE = au(bL, bD) * bA + bx + 1;
                        bK = au(bH, bD) * bA + bx + 1
                    } else {
                        bE = au(bH, bD);
                        bK = au(bL, bD)
                    }
                    aJ(br(bF, bE, bF, bK - 1))
                }
                ax(bD, 7);
                ax(bJ, 7)
            }
        }

        function br(bG, bH, bE, bF) {
            var bD = bo.rect(bG, bH, bE, bF, aV);
            return bv(bD, aV)
        }

        function a7(bD, bE) {
            return J(bD)
        }

        function bm(bD, bF, bE) {
            a8(bD, ax(J(bF), 1), true)
        }

        function aF() {
            aN()
        }

        function aT(bF, bH, bG) {
            var bD = bf(bF);
            var bE = aW[bD.row * aK + bD.col];
            ba("dayClick", bE, bF, bH, bG)
        }

        function aH(bF, bD, bE) {
            aI.start(function (bG) {
                aN();
                if (bG) {
                    br(bG.row, bG.col, bG.row, bG.col)
                }
            }, bD)
        }

        function aP(bH, bE, bF) {
            var bD = aI.stop();
            aN();
            if (bD) {
                var bG = by(bD);
                ba("drop", bH, bG, true, bE, bF)
            }
        }

        function bz(bD) {
            return J(bD.start)
        }

        bo = new L(function (bD, bG) {
            var bF, bH, bE;
            aQ.each(function (bJ, bI) {
                bF = ao(bI);
                bH = bF.offset().left;
                if (bJ) {
                    bE[1] = bH
                }
                bE = [bH];
                bG[bJ] = bE
            });
            bE[1] = bH + bF.outerWidth();
            aM.each(function (bJ, bI) {
                if (bJ < a1) {
                    bF = ao(bI);
                    bH = bF.offset().top;
                    if (bJ) {
                        bE[1] = bH
                    }
                    bE = [bH];
                    bD[bJ] = bE
                }
            });
            bE[1] = bH + bF.outerHeight()
        });
        aI = new ak(bo);
        bq = new j(function (bD) {
            return bc.eq(bD)
        });
        function bh(bD) {
            return bq.left(bD)
        }

        function be(bD) {
            return bq.right(bD)
        }

        function bf(bD) {
            return {row: Math.floor(au(bD, bk.visStart) / 7), col: a3(bD.getDay())}
        }

        function by(bD) {
            return aZ(bD.row, bD.col)
        }

        function aZ(bE, bD) {
            return ax(J(bk.visStart), bE * 7 + bD * bA + bx)
        }

        function bb(bD) {
            return aZ(Math.floor(bD / aK), bD % aK)
        }

        function a3(bD) {
            return ((bD - Math.max(a0, aX) + aK) % aK) * bA + bx
        }

        function aS(bD) {
            return aM.eq(bD)
        }

        function bp(bD) {
            return {left: 0, right: bw}
        }
    }

    function ah() {
        var aQ = this;
        aQ.renderEvents = aL;
        aQ.compileDaySegs = aP;
        aQ.clearEvents = aO;
        aQ.bindDaySeg = aK;
        U.call(aQ);
        var aH = aQ.opt;
        var aS = aQ.trigger;
        var aW = aQ.isEventDraggable;
        var aY = aQ.isEventResizable;
        var aX = aQ.reportEvents;
        var a1 = aQ.reportEventClear;
        var aG = aQ.eventElementHandlers;
        var aZ = aQ.showEvents;
        var aF = aQ.hideEvents;
        var aU = aQ.eventDrop;
        var a2 = aQ.getDaySegmentContainer;
        var a0 = aQ.getHoverListener;
        var aN = aQ.renderDayOverlay;
        var aT = aQ.clearOverlays;
        var aJ = aQ.getRowCnt;
        var aV = aQ.getColCnt;
        var aR = aQ.renderDaySegs;
        var aM = aQ.resizableDayEvent;

        function aL(a4, a3) {
            aX(a4);
            aR(aP(a4), a3)
        }

        function aO() {
            a1();
            a2().empty()
        }

        function aP(be) {
            var bb = aJ(), bd = aV(), a5 = J(aQ.visStart), a3 = ax(J(a5), bd), bc = ao.map(be, aj), ba, bf, a9, a4, a7, a8, a6 = [];
            for (ba = 0; ba < bb; ba++) {
                bf = ad(Y(be, bc, a5, a3));
                for (a9 = 0; a9 < bf.length; a9++) {
                    a4 = bf[a9];
                    for (a7 = 0; a7 < a4.length; a7++) {
                        a8 = a4[a7];
                        a8.row = ba;
                        a8.level = a9;
                        a6.push(a8)
                    }
                }
                ax(a5, 7);
                ax(a3, 7)
            }
            return a6
        }

        function aK(a5, a4, a3) {
            if (aW(a5)) {
                aI(a5, a4)
            }
            if (a3.isEnd && aY(a5)) {
                aM(a5, a4, a3)
            }
            aG(a5, a4)
        }

        function aI(a6, a5) {
            var a4 = a0();
            var a3;
            a5.draggable({
                zIndex: 9,
                delay: 50,
                opacity: aH("dragOpacity"),
                revertDuration: aH("dragRevertDuration"),
                start: function (a7, a8) {
                    aS("eventDragStart", a5, a6, a7, a8);
                    aF(a6, a5);
                    a4.start(function (ba, a9, bb, bc) {
                        a5.draggable("option", "revert", !ba || !bb && !bc);
                        aT();
                        if (ba) {
                            a3 = bb * 7 + bc * (aH("isRTL") ? -1 : 1);
                            aN(ax(J(a6.start), a3), ax(aj(a6), a3))
                        } else {
                            a3 = 0
                        }
                    }, a7, "drag")
                },
                stop: function (a7, a8) {
                    a4.stop();
                    aT();
                    aS("eventDragStop", a5, a6, a7, a8);
                    if (a3) {
                        aU(this, a6, a3, 0, a6.allDay, a7, a8)
                    } else {
                        a5.css("filter", "");
                        aZ(a6, a5)
                    }
                }
            })
        }
    }

    aa.agendaWeek = e;
    function e(aJ, aL) {
        var aI = this;
        aI.render = aK;
        C.call(aI, aJ, aL, "agendaWeek");
        var aH = aI.opt;
        var aG = aI.renderAgenda;
        var aF = aL.formatDates;

        function aK(aQ, aS) {
            if (aS) {
                ax(aQ, aS * 7)
            }
            var aR = ax(J(aQ), -((aQ.getDay() - aH("firstDay") + 7) % 7));
            var aO = ax(J(aR), 7);
            var aN = J(aR);
            var aM = J(aO);
            var aP = aH("weekends");
            if (!aP) {
                aC(aN);
                aC(aM, -1, true)
            }
            aI.title = aF(aN, ax(J(aM), -1), aH("titleFormat"));
            aI.start = aR;
            aI.end = aO;
            aI.visStart = aN;
            aI.visEnd = aM;
            aG(aP ? 7 : 5)
        }
    }

    aa.agendaDay = ar;
    function ar(aI, aL) {
        var aH = this;
        aH.render = aJ;
        C.call(aH, aI, aL, "agendaDay");
        var aG = aH.opt;
        var aF = aH.renderAgenda;
        var aK = aL.formatDate;

        function aJ(aN, aP) {
            if (aP) {
                ax(aN, aP);
                if (!aG("weekends")) {
                    aC(aN, aP < 0 ? -1 : 1)
                }
            }
            var aO = J(aN, true);
            var aM = ax(J(aO), 1);
            aH.title = aK(aN, aG("titleFormat"));
            aH.start = aH.visStart = aO;
            aH.end = aH.visEnd = aM;
            aF(1)
        }
    }

    af({
        allDaySlot: true,
        allDayText: "all-day",
        firstHour: 6,
        slotMinutes: 30,
        defaultEventMinutes: 120,
        axisFormat: "h(:mm)tt",
        timeFormat: {agenda: "h:mm{ - h:mm}"},
        dragOpacity: {agenda: 0.5},
        minTime: 0,
        maxTime: 24
    });
    function C(b2, aX, ba) {
        var a6 = this;
        a6.renderAgenda = aR;
        a6.setWidth = bl;
        a6.setHeight = bh;
        a6.beforeHide = bf;
        a6.afterShow = bT;
        a6.defaultEventEnd = bN;
        a6.timePosition = b5;
        a6.dayOfWeekCol = aS;
        a6.dateCell = bY;
        a6.cellDate = aJ;
        a6.cellIsAllDay = bX;
        a6.allDayRow = bA;
        a6.allDayBounds = bp;
        a6.getHoverListener = function () {
            return b1
        };
        a6.colContentLeft = b6;
        a6.colContentRight = aO;
        a6.getDaySegmentContainer = function () {
            return a2
        };
        a6.getSlotSegmentContainer = function () {
            return aM
        };
        a6.getMinMinute = function () {
            return bd
        };
        a6.getMaxMinute = function () {
            return aH
        };
        a6.getBodyContent = function () {
            return bz
        };
        a6.getRowCnt = function () {
            return 1
        };
        a6.getColCnt = function () {
            return bC
        };
        a6.getColWidth = function () {
            return aP
        };
        a6.getSlotHeight = function () {
            return bD
        };
        a6.defaultSelectionEnd = bk;
        a6.renderDayOverlay = aK;
        a6.renderSelection = bW;
        a6.clearSelection = bQ;
        a6.reportDayClick = a5;
        a6.dragStart = aQ;
        a6.dragStop = b3;
        ay.call(a6, b2, aX, ba);
        a.call(a6);
        ai.call(a6);
        Q.call(a6);
        var by = a6.opt;
        var bB = a6.trigger;
        var bx = a6.clearEvents;
        var bo = a6.renderOverlay;
        var aI = a6.clearOverlays;
        var bq = a6.reportSelection;
        var bU = a6.unselect;
        var bu = a6.daySelectionMousedown;
        var aY = a6.slotSegHtml;
        var a3 = aX.formatDate;
        var bL;
        var bZ;
        var bP;
        var bO;
        var a9;
        var aL;
        var bM;
        var bJ;
        var b4;
        var a2;
        var b0;
        var bS;
        var bm;
        var bz;
        var aM;
        var aT;
        var bI;
        var be;
        var a4;
        var aN;
        var br;
        var bG;
        var bi;
        var aP;
        var bv;
        var bD;
        var aF;
        var bC;
        var bH;
        var bE;
        var b1;
        var bs;
        var bb = {};
        var bn;
        var bg;
        var bw;
        var aG, a0, aZ;
        var bd, aH;
        var aV;
        aE(b2.addClass("fc-agenda"));
        function aR(b7) {
            bC = b7;
            bF();
            if (!bL) {
                a8()
            } else {
                bx()
            }
            aW()
        }

        function bF() {
            bn = by("theme") ? "ui" : "fc";
            bw = by("weekends") ? 0 : 1;
            bg = by("firstDay");
            if (aG = by("isRTL")) {
                a0 = -1;
                aZ = bC - 1
            } else {
                a0 = 1;
                aZ = 0
            }
            bd = aB(by("minTime"));
            aH = aB(by("maxTime"));
            aV = by("columnFormat")
        }

        function a8() {
            var cc = bn + "-widget-header";
            var b7 = bn + "-widget-content";
            var cb;
            var ca;
            var ce;
            var cd;
            var b9;
            var b8 = by("slotMinutes") % 15 == 0;
            cb = "<table style='width:100%' class='fc-agenda-days fc-border-separate' cellspacing='0'><thead><tr><th class='fc-agenda-axis " + cc + "'>&nbsp;</th>";
            for (ca = 0; ca < bC; ca++) {
                cb += "<th class='fc- fc-col" + ca + " " + cc + "'/>"
            }
            cb += "<th class='fc-agenda-gutter " + cc + "'>&nbsp;</th></tr></thead><tbody><tr><th class='fc-agenda-axis " + cc + "'>&nbsp;</th>";
            for (ca = 0; ca < bC; ca++) {
                cb += "<td class='fc- fc-col" + ca + " " + b7 + "'><div><div class='fc-day-content'><div style='position:relative'>&nbsp;</div></div></div></td>"
            }
            cb += "<td class='fc-agenda-gutter " + b7 + "'>&nbsp;</td></tr></tbody></table>";
            bL = ao(cb).appendTo(b2);
            bZ = bL.find("thead");
            bP = bZ.find("th").slice(1, -1);
            bO = bL.find("tbody");
            a9 = bO.find("td").slice(0, -1);
            aL = a9.find("div.fc-day-content div");
            bM = a9.eq(0);
            bJ = bM.find("> div");
            c(bZ.add(bZ.find("tr")));
            c(bO.add(bO.find("tr")));
            be = bZ.find("th:first");
            a4 = bL.find(".fc-agenda-gutter");
            b4 = ao("<div style='position:absolute;z-index:2;left:0;width:100%'/>").appendTo(b2);
            if (by("allDaySlot")) {
                a2 = ao("<div style='position:absolute;z-index:8;top:0;left:0'/>").appendTo(b4);
                cb = "<table style='width:100%' class='fc-agenda-allday' cellspacing='0'><tr><th class='" + cc + " fc-agenda-axis'>" + by("allDayText") + "</th><td><div class='fc-day-content'><div style='position:relative'/></div></td><th class='" + cc + " fc-agenda-gutter'>&nbsp;</th></tr></table>";
                b0 = ao(cb).appendTo(b4);
                bS = b0.find("tr");
                bj(bS.find("td"));
                be = be.add(b0.find("th:first"));
                a4 = a4.add(b0.find("th.fc-agenda-gutter"));
                b4.append("<div class='fc-agenda-divider " + cc + "'><div class='fc-agenda-divider-inner'/></div>")
            } else {
                a2 = ao([])
            }
            bm = ao("<div style='position:absolute;width:100%;overflow-x:hidden;overflow-y:auto'/>").appendTo(b4);
            bz = ao("<div style='position:relative;width:100%;overflow:hidden'/>").appendTo(bm);
            aM = ao("<div style='position:absolute;z-index:8;top:0;left:0'/>").appendTo(bz);
            cb = "<table class='fc-agenda-slots' style='width:100%' cellspacing='0'><tbody>";
            ce = d();
            cd = g(J(ce), aH);
            g(ce, bd);
            bH = 0;
            for (ca = 0; ce < cd; ca++) {
                b9 = ce.getMinutes();
                cb += "<tr class='fc-slot" + ca + " " + (!b9 ? "" : "fc-minor") + "'><th class='fc-agenda-axis " + cc + "'>" + ((!b8 || !b9) ? a3(ce, by("axisFormat")) : "&nbsp;") + "</th><td class='" + b7 + "'><div style='position:relative'>&nbsp;</div></td></tr>";
                g(ce, by("slotMinutes"));
                bH++
            }
            cb += "</tbody></table>";
            aT = ao(cb).appendTo(bz);
            bI = aT.find("div:first");
            bR(aT.find("td"));
            be = be.add(aT.find("th:first"))
        }

        function aW() {
            var ca;
            var b7;
            var cb;
            var b9;
            var b8 = b(new Date());
            for (ca = 0; ca < bC; ca++) {
                b9 = bt(ca);
                b7 = bP.eq(ca);
                b7.html(a3(b9, aV));
                cb = a9.eq(ca);
                if (+b9 == +b8) {
                    cb.addClass(bn + "-state-highlight fc-today")
                } else {
                    cb.removeClass(bn + "-state-highlight fc-today")
                }
                H(b7.add(cb), b9)
            }
        }

        function bh(b7, b8) {
            if (b7 === t) {
                b7 = bG
            }
            bG = b7;
            bb = {};
            var ca = bO.position().top;
            var b9 = bm.position().top;
            var cb = Math.min(b7 - ca, aT.height() + b9 + 1);
            bJ.height(cb - B(bM));
            b4.css("top", ca);
            bm.height(cb - b9 - 1);
            bD = bI.height() + 1;
            if (b8) {
                bc()
            }
        }

        function bl(b8) {
            br = b8;
            bs.clear();
            bi = 0;
            ap(be.width("").each(function (b9, ca) {
                bi = Math.max(bi, ao(ca).outerWidth())
            }), bi);
            var b7 = bm[0].clientWidth;
            bv = bm.width() - b7;
            if (bv) {
                ap(a4, bv);
                a4.show().prev().removeClass("fc-last")
            } else {
                a4.hide().prev().addClass("fc-last")
            }
            aP = Math.floor((b7 - bi) / bC);
            ap(bP.slice(0, -1), aP)
        }

        function bc() {
            var ca = d();
            var b8 = J(ca);
            b8.setHours(by("firstHour"));
            var b9 = b5(ca, b8) + 1;

            function b7() {
                bm.scrollTop(b9)
            }

            b7();
            setTimeout(b7, 0)
        }

        function bf() {
            aF = bm.scrollTop()
        }

        function bT() {
            bm.scrollTop(aF)
        }

        function bj(b7) {
            b7.click(bK).mousedown(bu)
        }

        function bR(b7) {
            b7.click(bK).mousedown(aU)
        }

        function bK(cb) {
            if (!by("selectable")) {
                var b9 = Math.min(bC - 1, Math.floor((cb.pageX - bL.offset().left - bi) / aP));
                var b8 = bt(b9);
                var cc = this.parentNode.className.match(/fc-slot(\d+)/);
                if (cc) {
                    var ca = parseInt(cc[1]) * by("slotMinutes");
                    var b7 = Math.floor(ca / 60);
                    b8.setHours(b7);
                    b8.setMinutes(ca % 60 + bd);
                    bB("dayClick", a9[b9], b8, false, cb)
                } else {
                    bB("dayClick", a9[b9], b8, true, cb)
                }
            }
        }

        function aK(b7, cc, b9) {
            if (b9) {
                bE.build()
            }
            var b8 = J(a6.visStart);
            var cb, ca;
            if (aG) {
                cb = au(cc, b8) * a0 + aZ + 1;
                ca = au(b7, b8) * a0 + aZ + 1
            } else {
                cb = au(b7, b8);
                ca = au(cc, b8)
            }
            cb = Math.max(0, cb);
            ca = Math.min(bC, ca);
            if (cb < ca) {
                bj(a1(0, cb, 0, ca - 1))
            }
        }

        function a1(ca, cb, b8, b9) {
            var b7 = bE.rect(ca, cb, b8, b9, b4);
            return bo(b7, b4)
        }

        function a7(cc, ch) {
            var cd = J(a6.visStart);
            var b8 = ax(J(cd), 1);
            for (var ca = 0; ca < bC; ca++) {
                var cb = new Date(Math.max(cd, cc));
                var cg = new Date(Math.min(b8, ch));
                if (cb < cg) {
                    var b9 = ca * a0 + aZ;
                    var cf = bE.rect(0, b9, 0, b9, bz);
                    var ce = b5(cd, cb);
                    var b7 = b5(cd, cg);
                    cf.top = ce;
                    cf.height = b7 - ce;
                    bR(bo(cf, bz))
                }
                ax(cd, 1);
                ax(b8, 1)
            }
        }

        bE = new L(function (cf, cd) {
            var cb, b8, b7;
            bP.each(function (ci, ch) {
                cb = ao(ch);
                b8 = cb.offset().left;
                if (ci) {
                    b7[1] = b8
                }
                b7 = [b8];
                cd[ci] = b7
            });
            b7[1] = b8 + cb.outerWidth();
            if (by("allDaySlot")) {
                cb = bS;
                b8 = cb.offset().top;
                cf[0] = [b8, b8 + cb.outerHeight()]
            }
            var ce = bz.offset().top;
            var cg = bm.offset().top;
            var ca = cg + bm.outerHeight();

            function cc(ch) {
                return Math.max(cg, Math.min(ca, ch))
            }

            for (var b9 = 0; b9 < bH; b9++) {
                cf.push([cc(ce + bD * b9), cc(ce + bD * (b9 + 1))])
            }
        });
        b1 = new ak(bE);
        bs = new j(function (b7) {
            return aL.eq(b7)
        });
        function b6(b7) {
            return bs.left(b7)
        }

        function aO(b7) {
            return bs.right(b7)
        }

        function bY(b7) {
            return {row: Math.floor(au(b7, a6.visStart) / 7), col: aS(b7.getDay())}
        }

        function aJ(b7) {
            var b9 = bt(b7.col);
            var b8 = b7.row;
            if (by("allDaySlot")) {
                b8--
            }
            if (b8 >= 0) {
                g(b9, bd + b8 * by("slotMinutes"))
            }
            return b9
        }

        function bt(b7) {
            return ax(J(a6.visStart), b7 * a0 + aZ)
        }

        function bX(b7) {
            return by("allDaySlot") && !b7.row
        }

        function aS(b7) {
            return ((b7 - Math.max(bg, bw) + bC) % bC) * a0 + aZ
        }

        function b5(b8, cc) {
            b8 = J(b8, true);
            if (cc < g(J(b8), bd)) {
                return 0
            }
            if (cc >= g(J(b8), aH)) {
                return aT.height()
            }
            var b7 = by("slotMinutes"), cb = cc.getHours() * 60 + cc.getMinutes() - bd, ca = Math.floor(cb / b7), b9 = bb[ca];
            if (b9 === t) {
                b9 = bb[ca] = aT.find("tr:eq(" + ca + ") td div")[0].offsetTop
            }
            return Math.max(0, Math.round(b9 - 1 + bD * ((cb % b7) / b7)))
        }

        function bp() {
            return {left: bi, right: br - bv}
        }

        function bA(b7) {
            return bS
        }

        function bN(b7) {
            var b8 = J(b7.start);
            if (b7.allDay) {
                return b8
            }
            return g(b8, by("defaultEventMinutes"))
        }

        function bk(b7, b8) {
            if (b8) {
                return J(b7)
            }
            return g(J(b7), by("slotMinutes"))
        }

        function bW(b7, b9, b8) {
            if (b8) {
                if (by("allDaySlot")) {
                    aK(b7, ax(J(b9), 1), true)
                }
            } else {
                bV(b7, b9)
            }
        }

        function bV(b7, cd) {
            var cb = by("selectHelper");
            bE.build();
            if (cb) {
                var b9 = au(b7, a6.visStart) * a0 + aZ;
                if (b9 >= 0 && b9 < bC) {
                    var ca = bE.rect(0, b9, 0, b9, bz);
                    var cc = b5(b7, b7);
                    var b8 = b5(b7, cd);
                    if (b8 > cc) {
                        ca.top = cc;
                        ca.height = b8 - cc;
                        ca.left += 2;
                        ca.width -= 5;
                        if (ao.isFunction(cb)) {
                            var ce = cb(b7, cd);
                            if (ce) {
                                ca.position = "absolute";
                                ca.zIndex = 8;
                                aN = ao(ce).css(ca).appendTo(bz)
                            }
                        } else {
                            ca.isStart = true;
                            ca.isEnd = true;
                            aN = ao(aY({
                                title: "",
                                start: b7,
                                end: cd,
                                className: ["fc-select-helper"],
                                editable: false
                            }, ca));
                            aN.css("opacity", by("dragOpacity"))
                        }
                        if (aN) {
                            bR(aN);
                            bz.append(aN);
                            ap(aN, ca.width, true);
                            V(aN, ca.height, true)
                        }
                    }
                }
            } else {
                a7(b7, cd)
            }
        }

        function bQ() {
            aI();
            if (aN) {
                aN.remove();
                aN = null
            }
        }

        function aU(b7) {
            if (b7.which == 1 && by("selectable")) {
                bU(b7);
                var b8;
                b1.start(function (ca, b9) {
                    bQ();
                    if (ca && ca.col == b9.col && !bX(ca)) {
                        var cc = aJ(b9);
                        var cb = aJ(ca);
                        b8 = [cc, g(J(cc), by("slotMinutes")), cb, g(J(cb), by("slotMinutes"))].sort(T);
                        bV(b8[0], b8[3])
                    } else {
                        b8 = null
                    }
                }, b7);
                ao(document).one("mouseup", function (b9) {
                    b1.stop();
                    if (b8) {
                        if (+b8[0] == +b8[1]) {
                            a5(b8[0], false, b9)
                        }
                        bq(b8[0], b8[3], false, b9)
                    }
                })
            }
        }

        function a5(b7, b9, b8) {
            bB("dayClick", a9[aS(b7.getDay())], b7, b9, b8)
        }

        function aQ(b9, b7, b8) {
            b1.start(function (ca) {
                aI();
                if (ca) {
                    if (bX(ca)) {
                        a1(ca.row, ca.col, ca.row, ca.col)
                    } else {
                        var cc = aJ(ca);
                        var cb = g(J(cc), by("defaultEventMinutes"));
                        a7(cc, cb)
                    }
                }
            }, b7)
        }

        function b3(ca, b8, b9) {
            var b7 = b1.stop();
            aI();
            if (b7) {
                bB("drop", ca, aJ(b7), bX(b7), b8, b9)
            }
        }
    }

    function Q() {
        var bf = this;
        bf.renderEvents = aL;
        bf.compileDaySegs = aG;
        bf.clearEvents = a1;
        bf.slotSegHtml = a2;
        bf.bindDaySeg = aZ;
        U.call(bf);
        var aU = bf.opt;
        var a3 = bf.trigger;
        var aJ = bf.isEventDraggable;
        var bk = bf.isEventResizable;
        var bl = bf.eventEnd;
        var aP = bf.reportEvents;
        var bo = bf.reportEventClear;
        var a6 = bf.eventElementHandlers;
        var bb = bf.setHeight;
        var aK = bf.getDaySegmentContainer;
        var bn = bf.getSlotSegmentContainer;
        var aI = bf.getHoverListener;
        var aH = bf.getMaxMinute;
        var a8 = bf.getMinMinute;
        var aO = bf.timePosition;
        var ba = bf.colContentLeft;
        var a9 = bf.colContentRight;
        var bd = bf.renderDaySegs;
        var a7 = bf.resizableDayEvent;
        var bc = bf.getColCnt;
        var aV = bf.getColWidth;
        var aF = bf.getSlotHeight;
        var a0 = bf.getBodyContent;
        var aS = bf.reportEventElement;
        var aM = bf.showEvents;
        var aT = bf.hideEvents;
        var bi = bf.eventDrop;
        var aX = bf.eventResize;
        var a4 = bf.renderDayOverlay;
        var aN = bf.clearOverlays;
        var bg = bf.calendar;
        var be = bg.formatDate;
        var aW = bg.formatDates;

        function aL(bt, br) {
            aP(bt);
            var bs, bq = bt.length, bu = [], bp = [];
            for (bs = 0; bs < bq; bs++) {
                if (bt[bs].allDay) {
                    bu.push(bt[bs])
                } else {
                    bp.push(bt[bs])
                }
            }
            if (aU("allDaySlot")) {
                bd(aG(bu), br);
                bb()
            }
            aQ(aY(bp), br)
        }

        function a1() {
            bo();
            aK().empty();
            bn().empty()
        }

        function aG(bt) {
            var bv = ad(Y(bt, ao.map(bt, aj), bf.visStart, bf.visEnd)), bs, bu = bv.length, bw, br, bq, bp = [];
            for (bs = 0; bs < bu; bs++) {
                bw = bv[bs];
                for (br = 0; br < bw.length; br++) {
                    bq = bw[br];
                    bq.row = 0;
                    bq.level = bs;
                    bp.push(bq)
                }
            }
            return bp
        }

        function aY(bB) {
            var bA = bc(), by = a8(), bs = aH(), bz = g(J(bf.visStart), by), bw = ao.map(bB, bm), bx, br, bv, bp, bt, bu, bq = [];
            for (bx = 0; bx < bA; bx++) {
                br = ad(Y(bB, bw, bz, g(J(bz), bs - by)));
                z(br);
                for (bv = 0; bv < br.length; bv++) {
                    bp = br[bv];
                    for (bt = 0; bt < bp.length; bt++) {
                        bu = bp[bt];
                        bu.col = bx;
                        bu.level = bv;
                        bq.push(bu)
                    }
                }
                ax(bz, 1, true)
            }
            return bq
        }

        function bm(bp) {
            if (bp.end) {
                return J(bp.end)
            } else {
                return g(J(bp.start), aU("defaultEventMinutes"))
            }
        }

        function aQ(bF, bG) {
            var bL, bO = bF.length, bN, bJ, bP, bB, by, bx, br, bz, bw, bI, bp, bs, bA = "", bQ, bM, bu, bq = {}, bT = {}, bS, bR, bv, bD, bK = bn(), bt, bE, bC, bH = bc();
            if (bt = aU("isRTL")) {
                bE = -1;
                bC = bH - 1
            } else {
                bE = 1;
                bC = 0
            }
            for (bL = 0; bL < bO; bL++) {
                bN = bF[bL];
                bJ = bN.event;
                bB = aO(bN.start, bN.start);
                by = aO(bN.start, bN.end);
                bx = bN.col;
                br = bN.level;
                bz = bN.forward || 0;
                bw = ba(bx * bE + bC);
                bI = a9(bx * bE + bC) - bw;
                bI = Math.min(bI - 6, bI * 0.95);
                if (br) {
                    bp = bI / (br + bz + 1)
                } else {
                    if (bz) {
                        bp = ((bI / (bz + 1)) - (12 / 2)) * 2
                    } else {
                        bp = bI
                    }
                }
                bs = bw + (bI / (br + bz + 1) * br) * bE + (bt ? bI - bp : 0);
                bN.top = bB;
                bN.left = bs;
                bN.outerWidth = bp;
                bN.outerHeight = by - bB;
                bA += a2(bJ, bN)
            }
            bK[0].innerHTML = bA;
            bQ = bK.children();
            for (bL = 0; bL < bO; bL++) {
                bN = bF[bL];
                bJ = bN.event;
                bM = ao(bQ[bL]);
                bu = a3("eventRender", bJ, bJ, bM);
                if (bu === false) {
                    bM.remove()
                } else {
                    if (bu && bu !== true) {
                        bM.remove();
                        bM = ao(bu).css({position: "absolute", top: bN.top, left: bN.left}).appendTo(bK)
                    }
                    bN.element = bM;
                    if (bJ._id === bG) {
                        bh(bJ, bM, bN)
                    } else {
                        bM[0]._fci = bL
                    }
                    aS(bJ, bM)
                }
            }
            s(bK, bF, bh);
            for (bL = 0; bL < bO; bL++) {
                bN = bF[bL];
                if (bM = bN.element) {
                    bR = bq[bS = bN.key = D(bM[0])];
                    bN.vsides = bR === t ? (bq[bS] = B(bM, true)) : bR;
                    bR = bT[bS];
                    bN.hsides = bR === t ? (bT[bS] = f(bM, true)) : bR;
                    bv = bM.find("div.fc-event-content");
                    if (bv.length) {
                        bN.contentTop = bv[0].offsetTop
                    }
                }
            }
            for (bL = 0; bL < bO; bL++) {
                bN = bF[bL];
                if (bM = bN.element) {
                    bM[0].style.width = Math.max(0, bN.outerWidth - bN.hsides) + "px";
                    bD = Math.max(0, bN.outerHeight - bN.vsides);
                    bM[0].style.height = bD + "px";
                    bJ = bN.event;
                    if (bN.contentTop !== t && bD - bN.contentTop < 10) {
                        bM.find("div.fc-event-time").text(be(bJ.start, aU("timeFormat")) + " - " + bJ.title);
                        bM.find("div.fc-event-title").remove()
                    }
                    a3("eventAfterRender", bJ, bJ, bM)
                }
            }
        }

        function a2(bu, bp) {
            var bt = "<";
            var br = bu.url;
            var bq = N(bu, aU);
            var bv = (bq ? " style='" + bq + "'" : "");
            var bs = ["fc-event", "fc-event-skin", "fc-event-vert"];
            if (aJ(bu)) {
                bs.push("fc-event-draggable")
            }
            if (bp.isStart) {
                bs.push("fc-corner-top")
            }
            if (bp.isEnd) {
                bs.push("fc-corner-bottom")
            }
            bs = bs.concat(bu.className);
            if (bu.source) {
                bs = bs.concat(bu.source.className || [])
            }
            if (br) {
                bt += "a href='" + aA(bu.url) + "'"
            } else {
                bt += "div"
            }
            bt += " class='" + bs.join(" ") + "' style='position:absolute;z-index:8;top:" + bp.top + "px;left:" + bp.left + "px;" + bq + "'><div class='fc-event-inner fc-event-skin'" + bv + "><div class='fc-event-head fc-event-skin'" + bv + "><div class='fc-event-time'>" + aA(aW(bu.start, bu.end, aU("timeFormat"))) + "</div></div><div class='fc-event-content'><div class='fc-event-title'>" + aA(bu.title) + "</div></div><div class='fc-event-bg'></div></div>";
            if (bp.isEnd && bk(bu)) {
                bt += "<div class='ui-resizable-handle ui-resizable-s'>=</div>"
            }
            bt += "</" + (br ? "a" : "div") + ">";
            return bt
        }

        function aZ(br, bq, bp) {
            if (aJ(br)) {
                aR(br, bq, bp.isStart)
            }
            if (bp.isEnd && bk(br)) {
                a7(br, bq, bp)
            }
            a6(br, bq)
        }

        function bh(br, bq, bp) {
            var bs = bq.find("div.fc-event-time");
            if (aJ(br)) {
                a5(br, bq, bs)
            }
            if (bp.isEnd && bk(br)) {
                bj(br, bq, bs)
            }
            a6(br, bq)
        }

        function aR(bq, by, bp) {
            var bz;
            var bx;
            var bB = true;
            var bt;
            var br = aU("isRTL") ? -1 : 1;
            var bs = aI();
            var bu = aV();
            var bA = aF();
            var bw = a8();
            by.draggable({
                zIndex: 9,
                opacity: aU("dragOpacity", "month"),
                revertDuration: aU("dragRevertDuration"),
                start: function (bC, bD) {
                    a3("eventDragStart", by, bq, bC, bD);
                    aT(bq, by);
                    bz = by.width();
                    bs.start(function (bF, bE, bG, bH) {
                        aN();
                        if (bF) {
                            bx = false;
                            bt = bH * br;
                            if (!bF.row) {
                                a4(ax(J(bq.start), bt), ax(aj(bq), bt));
                                bv()
                            } else {
                                if (bp) {
                                    if (bB) {
                                        by.width(bu - 10);
                                        V(by, bA * Math.round((bq.end ? ((bq.end - bq.start) / R) : aU("defaultEventMinutes")) / aU("slotMinutes")));
                                        by.draggable("option", "grid", [bu, 1]);
                                        bB = false
                                    }
                                } else {
                                    bx = true
                                }
                            }
                            bx = bx || (bB && !bt)
                        } else {
                            bv();
                            bx = true
                        }
                        by.draggable("option", "revert", bx)
                    }, bC, "drag")
                },
                stop: function (bD, bE) {
                    bs.stop();
                    aN();
                    a3("eventDragStop", by, bq, bD, bE);
                    if (bx) {
                        bv();
                        by.css("filter", "");
                        aM(bq, by)
                    } else {
                        var bC = 0;
                        if (!bB) {
                            bC = Math.round((by.offset().top - a0().offset().top) / bA) * aU("slotMinutes") + bw - (bq.start.getHours() * 60 + bq.start.getMinutes())
                        }
                        bi(this, bq, bt, bC, bB, bD, bE)
                    }
                }
            });
            function bv() {
                if (!bB) {
                    by.width(bz).height("").draggable("option", "grid", null);
                    bB = true
                }
            }
        }

        function a5(bp, bz, bA) {
            var bt;
            var bD = false;
            var bu;
            var by;
            var bw;
            var bq = aU("isRTL") ? -1 : 1;
            var bs = aI();
            var bB = bc();
            var bv = aV();
            var bC = aF();
            bz.draggable({
                zIndex: 9,
                scroll: false,
                grid: [bv, bC],
                axis: bB == 1 ? "y" : false,
                opacity: aU("dragOpacity"),
                revertDuration: aU("dragRevertDuration"),
                start: function (bE, bF) {
                    a3("eventDragStart", bz, bp, bE, bF);
                    aT(bp, bz);
                    bt = bz.position();
                    by = bw = 0;
                    bs.start(function (bH, bG, bI, bJ) {
                        bz.draggable("option", "revert", !bH);
                        aN();
                        if (bH) {
                            bu = bJ * bq;
                            if (aU("allDaySlot") && !bH.row) {
                                if (!bD) {
                                    bD = true;
                                    bA.hide();
                                    bz.draggable("option", "grid", null)
                                }
                                a4(ax(J(bp.start), bu), ax(aj(bp), bu))
                            } else {
                                bx()
                            }
                        }
                    }, bE, "drag")
                },
                drag: function (bE, bF) {
                    by = Math.round((bF.position.top - bt.top) / bC) * aU("slotMinutes");
                    if (by != bw) {
                        if (!bD) {
                            br(by)
                        }
                        bw = by
                    }
                },
                stop: function (bF, bG) {
                    var bE = bs.stop();
                    aN();
                    a3("eventDragStop", bz, bp, bF, bG);
                    if (bE && (bu || by || bD)) {
                        bi(this, bp, bu, bD ? 0 : by, bD, bF, bG)
                    } else {
                        bx();
                        bz.css("filter", "");
                        bz.css(bt);
                        br(0);
                        aM(bp, bz)
                    }
                }
            });
            function br(bF) {
                var bE = g(J(bp.start), bF);
                var bG;
                if (bp.end) {
                    bG = g(J(bp.end), bF)
                }
                bA.text(aW(bE, bG, aU("timeFormat")))
            }

            function bx() {
                if (bD) {
                    bA.css("display", "");
                    bz.draggable("option", "grid", [bv, bC]);
                    bD = false
                }
            }
        }

        function bj(br, bq, bt) {
            var bu, bp;
            var bs = aF();
            bq.resizable({
                handles: {s: "div.ui-resizable-s"}, grid: bs, start: function (bv, bw) {
                    bu = bp = 0;
                    aT(br, bq);
                    bq.css("z-index", 9);
                    a3("eventResizeStart", this, br, bv, bw)
                }, resize: function (bv, bw) {
                    bu = Math.round((Math.max(bs, bq.height()) - bw.originalSize.height) / bs);
                    if (bu != bp) {
                        bt.text(aW(br.start, (!bu && !br.end) ? null : g(bl(br), aU("slotMinutes") * bu), aU("timeFormat")));
                        bp = bu
                    }
                }, stop: function (bv, bw) {
                    a3("eventResizeStop", this, br, bv, bw);
                    if (bu) {
                        aX(this, br, 0, aU("slotMinutes") * bu, bv, bw)
                    } else {
                        bq.css("z-index", 8);
                        aM(br, bq)
                    }
                }
            })
        }
    }

    function z(aJ) {
        var aH, aG, aF, aL, aK, aI;
        for (aH = aJ.length - 1; aH > 0; aH--) {
            aL = aJ[aH];
            for (aG = 0; aG < aL.length; aG++) {
                aK = aL[aG];
                for (aF = 0; aF < aJ[aH - 1].length; aF++) {
                    aI = aJ[aH - 1][aF];
                    if (K(aK, aI)) {
                        aI.forward = Math.max(aI.forward || 0, (aK.forward || 0) + 1)
                    }
                }
            }
        }
    }

    function ay(aJ, aQ, aV) {
        var aP = this;
        aP.element = aJ;
        aP.calendar = aQ;
        aP.name = aV;
        aP.opt = aH;
        aP.trigger = aR;
        aP.isEventDraggable = aU;
        aP.isEventResizable = aY;
        aP.reportEvents = aW;
        aP.eventEnd = aZ;
        aP.reportEventElement = aX;
        aP.reportEventClear = a5;
        aP.eventElementHandlers = aG;
        aP.showEvents = a2;
        aP.hideEvents = aF;
        aP.eventDrop = aT;
        aP.eventResize = aI;
        var a6 = aP.defaultEventEnd;
        var aO = aQ.normalizeEvent;
        var aN = aQ.reportEventChange;
        var a0 = {};
        var a4 = [];
        var aM = {};
        var aK = aQ.options;

        function aH(a9, a7) {
            var a8 = aK[a9];
            if (typeof a8 == "object") {
                return A(a8, a7 || aV)
            }
            return a8
        }

        function aR(a7, a8) {
            return aQ.trigger.apply(aQ, [a7, a8 || aP].concat(Array.prototype.slice.call(arguments, 2), [aP]))
        }

        function aU(a7) {
            return a1(a7) && !aH("disableDragging")
        }

        function aY(a7) {
            return a1(a7) && !aH("disableResizing")
        }

        function a1(a7) {
            return aD(a7.editable, (a7.source || {}).editable, aH("editable"))
        }

        function aW(a9) {
            a0 = {};
            var a8, a7 = a9.length, ba;
            for (a8 = 0; a8 < a7; a8++) {
                ba = a9[a8];
                if (a0[ba._id]) {
                    a0[ba._id].push(ba)
                } else {
                    a0[ba._id] = [ba]
                }
            }
        }

        function aZ(a7) {
            return a7.end ? J(a7.end) : a6(a7)
        }

        function aX(a8, a7) {
            a4.push(a7);
            if (aM[a8._id]) {
                aM[a8._id].push(a7)
            } else {
                aM[a8._id] = [a7]
            }
        }

        function a5() {
            a4 = [];
            aM = {}
        }

        function aG(a8, a7) {
            a7.click(function (a9) {
                if (!a7.hasClass("ui-draggable-dragging") && !a7.hasClass("ui-resizable-resizing")) {
                    return aR("eventClick", this, a8, a9)
                }
            }).hover(function (a9) {
                aR("eventMouseover", this, a8, a9)
            }, function (a9) {
                aR("eventMouseout", this, a8, a9)
            })
        }

        function a2(a8, a7) {
            aS(a8, a7, "show")
        }

        function aF(a8, a7) {
            aS(a8, a7, "hide")
        }

        function aS(ba, a9, bc) {
            var bb = aM[ba._id], a8, a7 = bb.length;
            for (a8 = 0; a8 < a7; a8++) {
                if (!a9 || bb[a8][0] != a9[0]) {
                    bb[a8][bc]()
                }
            }
        }

        function aT(ba, a8, a9, bb, be, bd, bc) {
            var bf = a8.allDay;
            var a7 = a8._id;
            a3(a0[a7], a9, bb, be);
            aR("eventDrop", ba, a8, a9, bb, be, function () {
                a3(a0[a7], -a9, -bb, bf);
                aN(a7)
            }, bd, bc);
            aN(a7)
        }

        function aI(bd, bb, a8, a7, ba, bc) {
            var a9 = bb._id;
            aL(a0[a9], a8, a7);
            aR("eventResize", bd, bb, a8, a7, function () {
                aL(a0[a9], -a8, -a7);
                aN(a9)
            }, ba, bc);
            aN(a9)
        }

        function a3(bb, a9, a8, bc) {
            a8 = a8 || 0;
            for (var bd, a7 = bb.length, ba = 0; ba < a7; ba++) {
                bd = bb[ba];
                if (bc !== t) {
                    bd.allDay = bc
                }
                g(ax(bd.start, a9, true), a8);
                if (bd.end) {
                    bd.end = g(ax(bd.end, a9, true), a8)
                }
                aO(bd, aK)
            }
        }

        function aL(bb, a9, a8) {
            a8 = a8 || 0;
            for (var bc, a7 = bb.length, ba = 0; ba < a7; ba++) {
                bc = bb[ba];
                bc.end = g(ax(aZ(bc), a9, true), a8);
                aO(bc, aK)
            }
        }
    }

    function U() {
        var a8 = this;
        a8.renderDaySegs = a7;
        a8.resizableDayEvent = a1;
        var aQ = a8.opt;
        var aX = a8.trigger;
        var aH = a8.isEventDraggable;
        var bd = a8.isEventResizable;
        var be = a8.eventEnd;
        var aO = a8.reportEventElement;
        var aK = a8.showEvents;
        var aP = a8.hideEvents;
        var aT = a8.eventResize;
        var bh = a8.getRowCnt;
        var a6 = a8.getColCnt;
        var aR = a8.getColWidth;
        var aM = a8.allDayRow;
        var bb = a8.allDayBounds;
        var a4 = a8.colContentLeft;
        var a2 = a8.colContentRight;
        var aV = a8.dayOfWeekCol;
        var a3 = a8.dateCell;
        var aG = a8.compileDaySegs;
        var aI = a8.getDaySegmentContainer;
        var aW = a8.bindDaySeg;
        var aS = a8.calendar.formatDates;
        var aY = a8.renderDayOverlay;
        var aL = a8.clearOverlays;
        var aF = a8.clearSelection;

        function a7(bk, bj) {
            var bi = aI();
            var bq;
            var bp = bh();
            var bv = a6();
            var bo = 0;
            var bu;
            var bt;
            var br;
            var bn;
            var bw = bk.length;
            var bm;
            var bs;
            var bl;
            bi[0].innerHTML = aZ(bk);
            a0(bk, bi.children());
            ba(bk);
            a5(bk, bi, bj);
            bg(bk);
            aJ(bk);
            a9(bk);
            bq = aU();
            for (bu = 0; bu < bp; bu++) {
                bt = 0;
                br = [];
                for (bn = 0; bn < bv; bn++) {
                    br[bn] = 0
                }
                while (bo < bw && (bm = bk[bo]).row == bu) {
                    bs = an(br.slice(bm.startCol, bm.endCol));
                    bm.top = bs;
                    bs += bm.outerHeight;
                    for (bl = bm.startCol; bl < bm.endCol; bl++) {
                        br[bl] = bs
                    }
                    bo++
                }
                bq[bu].height(an(br))
            }
            bf(bk, aN(bq))
        }

        function bc(bl, bk, bp) {
            var bo = ao("<div/>");
            var bi;
            var bj = aI();
            var bn;
            var bq = bl.length;
            var bm;
            bo[0].innerHTML = aZ(bl);
            bi = bo.children();
            bj.append(bi);
            a0(bl, bi);
            bg(bl);
            aJ(bl);
            a9(bl);
            bf(bl, aN(aU()));
            bi = [];
            for (bn = 0; bn < bq; bn++) {
                bm = bl[bn].element;
                if (bm) {
                    if (bl[bn].row === bk) {
                        bm.css("top", bp)
                    }
                    bi.push(bm[0])
                }
            }
            return ao(bi)
        }

        function aZ(bn) {
            var bu = aQ("isRTL");
            var bs;
            var by = bn.length;
            var br;
            var bl;
            var bm;
            var bp;
            var bi = bb();
            var bq = bi.left;
            var bk = bi.right;
            var bw;
            var bj;
            var bo;
            var bx;
            var bv;
            var bt = "";
            for (bs = 0; bs < by; bs++) {
                br = bn[bs];
                bl = br.event;
                bp = ["fc-event", "fc-event-skin", "fc-event-hori"];
                if (aH(bl)) {
                    bp.push("fc-event-draggable")
                }
                if (bu) {
                    if (br.isStart) {
                        bp.push("fc-corner-right")
                    }
                    if (br.isEnd) {
                        bp.push("fc-corner-left")
                    }
                    bw = aV(br.end.getDay() - 1);
                    bj = aV(br.start.getDay());
                    bo = br.isEnd ? a4(bw) : bq;
                    bx = br.isStart ? a2(bj) : bk
                } else {
                    if (br.isStart) {
                        bp.push("fc-corner-left")
                    }
                    if (br.isEnd) {
                        bp.push("fc-corner-right")
                    }
                    bw = aV(br.start.getDay());
                    bj = aV(br.end.getDay() - 1);
                    bo = br.isStart ? a4(bw) : bq;
                    bx = br.isEnd ? a2(bj) : bk
                }
                bp = bp.concat(bl.className);
                if (bl.source) {
                    bp = bp.concat(bl.source.className || [])
                }
                bm = bl.url;
                bv = N(bl, aQ);
                if (bm) {
                    bt += "<a href='" + aA(bm) + "'"
                } else {
                    bt += "<div"
                }
                bt += " class='" + bp.join(" ") + "' style='position:absolute;z-index:8;left:" + bo + "px;" + bv + "'><div class='fc-event-inner fc-event-skin'" + (bv ? " style='" + bv + "'" : "") + ">";
                if (!bl.allDay && br.isStart) {
                    bt += "<span class='fc-event-time'>" + aA(aS(bl.start, bl.end, aQ("timeFormat"))) + "</span>"
                }
                bt += "<span class='fc-event-title'>" + aA(bl.title) + "</span></div>";
                if (br.isEnd && bd(bl)) {
                    bt += "<div class='ui-resizable-handle ui-resizable-" + (bu ? "w" : "e") + "'>&nbsp;&nbsp;&nbsp;</div>"
                }
                bt += "</" + (bm ? "a" : "div") + ">";
                br.left = bo;
                br.outerWidth = bx - bo;
                br.startCol = bw;
                br.endCol = bj + 1
            }
            return bt
        }

        function a0(bj, bo) {
            var bm;
            var bp = bj.length;
            var bi;
            var bn;
            var bl;
            var bk;
            for (bm = 0; bm < bp; bm++) {
                bi = bj[bm];
                bn = bi.event;
                bl = ao(bo[bm]);
                bk = aX("eventRender", bn, bn, bl);
                if (bk === false) {
                    bl.remove()
                } else {
                    if (bk && bk !== true) {
                        bk = ao(bk).css({position: "absolute", left: bi.left});
                        bl.replaceWith(bk);
                        bl = bk
                    }
                    bi.element = bl
                }
            }
        }

        function ba(bj) {
            var bl;
            var bm = bj.length;
            var bi;
            var bk;
            for (bl = 0; bl < bm; bl++) {
                bi = bj[bl];
                bk = bi.element;
                if (bk) {
                    aO(bi.event, bk)
                }
            }
        }

        function a5(bj, bo, bk) {
            var bm;
            var bp = bj.length;
            var bi;
            var bl;
            var bn;
            for (bm = 0; bm < bp; bm++) {
                bi = bj[bm];
                bl = bi.element;
                if (bl) {
                    bn = bi.event;
                    if (bn._id === bk) {
                        aW(bn, bl, bi)
                    } else {
                        bl[0]._fci = bm
                    }
                }
            }
            s(bo, bj, aW)
        }

        function bg(bj) {
            var bn;
            var bo = bj.length;
            var bi;
            var bm;
            var bl, bp;
            var bk = {};
            for (bn = 0; bn < bo; bn++) {
                bi = bj[bn];
                bm = bi.element;
                if (bm) {
                    bl = bi.key = D(bm[0]);
                    bp = bk[bl];
                    if (bp === t) {
                        bp = bk[bl] = f(bm, true)
                    }
                    bi.hsides = bp
                }
            }
        }

        function aJ(bj) {
            var bl;
            var bm = bj.length;
            var bi;
            var bk;
            for (bl = 0; bl < bm; bl++) {
                bi = bj[bl];
                bk = bi.element;
                if (bk) {
                    bk[0].style.width = Math.max(0, bi.outerWidth - bi.hsides) + "px"
                }
            }
        }

        function a9(bj) {
            var bm;
            var bo = bj.length;
            var bi;
            var bl;
            var bk, bp;
            var bn = {};
            for (bm = 0; bm < bo; bm++) {
                bi = bj[bm];
                bl = bi.element;
                if (bl) {
                    bk = bi.key;
                    bp = bn[bk];
                    if (bp === t) {
                        bp = bn[bk] = i(bl)
                    }
                    bi.outerHeight = bl[0].offsetHeight + bp
                }
            }
        }

        function aU() {
            var bi;
            var bk = bh();
            var bj = [];
            for (bi = 0; bi < bk; bi++) {
                bj[bi] = aM(bi).find("td:first div.fc-day-content > div")
            }
            return bj
        }

        function aN(bj) {
            var bi;
            var bl = bj.length;
            var bk = [];
            for (bi = 0; bi < bl; bi++) {
                bk[bi] = bj[bi][0].offsetTop
            }
            return bk
        }

        function bf(bj, bo) {
            var bl;
            var bn = bj.length;
            var bi;
            var bk;
            var bm;
            for (bl = 0; bl < bn; bl++) {
                bi = bj[bl];
                bk = bi.element;
                if (bk) {
                    bk[0].style.top = bo[bi.row] + (bi.top || 0) + "px";
                    bm = bi.event;
                    aX("eventAfterRender", bm, bm, bk)
                }
            }
        }

        function a1(bk, bj, bi) {
            var bn = aQ("isRTL");
            var bm = bn ? "w" : "e";
            var bl = bj.find("div.ui-resizable-" + bm);
            var bo = false;
            aE(bj);
            bj.mousedown(function (bp) {
                bp.preventDefault()
            }).click(function (bp) {
                if (bo) {
                    bp.preventDefault();
                    bp.stopImmediatePropagation()
                }
            });
            bl.mousedown(function (by) {
                if (by.which != 1) {
                    return
                }
                bo = true;
                var bt = a8.getHoverListener();
                var bx = bh();
                var bz = a6();
                var br = bn ? -1 : 1;
                var bq = bn ? bz - 1 : 0;
                var bs = bj.css("top");
                var bu;
                var bp;
                var bw = ao.extend({}, bk);
                var bA = a3(bk.start);
                aF();
                ao("body").css("cursor", bm + "-resize").one("mouseup", bv);
                aX("eventResizeStart", this, bk, by);
                bt.start(function (bC, bB) {
                    if (bC) {
                        var bF = Math.max(bA.row, bC.row);
                        var bG = bC.col;
                        if (bx == 1) {
                            bF = 0
                        }
                        if (bF == bA.row) {
                            if (bn) {
                                bG = Math.min(bA.col, bG)
                            } else {
                                bG = Math.max(bA.col, bG)
                            }
                        }
                        bu = (bF * 7 + bG * br + bq) - (bB.row * 7 + bB.col * br + bq);
                        var bE = ax(be(bk), bu, true);
                        if (bu) {
                            bw.end = bE;
                            var bD = bp;
                            bp = bc(aG([bw]), bi.row, bs);
                            bp.find("*").css("cursor", bm + "-resize");
                            if (bD) {
                                bD.remove()
                            }
                            aP(bk)
                        } else {
                            if (bp) {
                                aK(bk);
                                bp.remove();
                                bp = null
                            }
                        }
                        aL();
                        aY(bk.start, ax(J(bE), 1))
                    }
                }, by);
                function bv(bB) {
                    aX("eventResizeStop", this, bk, bB);
                    ao("body").css("cursor", "");
                    bt.stop();
                    aL();
                    if (bu) {
                        aT(this, bk, bu, 0, bB)
                    }
                    setTimeout(function () {
                        bo = false
                    }, 0)
                }
            })
        }
    }

    function ai() {
        var aP = this;
        aP.select = aN;
        aP.unselect = aJ;
        aP.reportSelection = aF;
        aP.daySelectionMousedown = aM;
        var aH = aP.opt;
        var aI = aP.trigger;
        var aK = aP.defaultSelectionEnd;
        var aG = aP.renderSelection;
        var aO = aP.clearSelection;
        var aL = false;
        if (aH("selectable") && aH("unselectAuto")) {
            ao(document).mousedown(function (aQ) {
                var aR = aH("unselectCancel");
                if (aR) {
                    if (ao(aQ.target).parents(aR).length) {
                        return
                    }
                }
                aJ(aQ)
            })
        }
        function aN(aQ, aS, aR) {
            aJ();
            if (!aS) {
                aS = aK(aQ, aR)
            }
            aG(aQ, aS, aR);
            aF(aQ, aS, aR)
        }

        function aJ(aQ) {
            if (aL) {
                aL = false;
                aO();
                aI("unselect", null, aQ)
            }
        }

        function aF(aQ, aT, aS, aR) {
            aL = true;
            aI("select", null, aQ, aT, aS, aR)
        }

        function aM(aT) {
            var aW = aP.cellDate;
            var aR = aP.cellIsAllDay;
            var aQ = aP.getHoverListener();
            var aU = aP.reportDayClick;
            if (aT.which == 1 && aH("selectable")) {
                aJ(aT);
                var aS = this;
                var aV;
                aQ.start(function (aY, aX) {
                    aO();
                    if (aY && aR(aY)) {
                        aV = [aW(aX), aW(aY)].sort(T);
                        aG(aV[0], aV[1], true)
                    } else {
                        aV = null
                    }
                }, aT);
                ao(document).one("mouseup", function (aX) {
                    aQ.stop();
                    if (aV) {
                        if (+aV[0] == +aV[1]) {
                            aU(aV[0], true, aX)
                        }
                        aF(aV[0], aV[1], true, aX)
                    }
                })
            }
        }
    }

    function a() {
        var aI = this;
        aI.renderOverlay = aG;
        aI.clearOverlays = aF;
        var aH = [];
        var aJ = [];

        function aG(aL, aK) {
            var aM = aJ.shift();
            if (!aM) {
                aM = ao("<div class='fc-cell-overlay' style='position:absolute;z-index:3'/>")
            }
            if (aM[0].parentNode != aK[0]) {
                aM.appendTo(aK)
            }
            aH.push(aM.css(aL).show());
            return aM
        }

        function aF() {
            var aK;
            while (aK = aH.shift()) {
                aJ.push(aK.hide().unbind())
            }
        }
    }

    function L(aF) {
        var aG = this;
        var aH;
        var aI;
        aG.build = function () {
            aH = [];
            aI = [];
            aF(aH, aI)
        };
        aG.cell = function (aJ, aP) {
            var aO = aH.length;
            var aK = aI.length;
            var aL, aM = -1, aN = -1;
            for (aL = 0; aL < aO; aL++) {
                if (aP >= aH[aL][0] && aP < aH[aL][1]) {
                    aM = aL;
                    break
                }
            }
            for (aL = 0; aL < aK; aL++) {
                if (aJ >= aI[aL][0] && aJ < aI[aL][1]) {
                    aN = aL;
                    break
                }
            }
            return (aM >= 0 && aN >= 0) ? {row: aM, col: aN} : null
        };
        aG.rect = function (aM, aO, aK, aL, aN) {
            var aJ = aN.offset();
            return {
                top: aH[aM][0] - aJ.top,
                left: aI[aO][0] - aJ.left,
                width: aI[aL][1] - aI[aO][0],
                height: aH[aK][1] - aH[aM][0]
            }
        }
    }

    function ak(aK) {
        var aI = this;
        var aJ;
        var aL;
        var aG;
        var aF;
        aI.start = function (aM, aN, aO) {
            aL = aM;
            aG = aF = null;
            aK.build();
            aH(aN);
            aJ = aO || "mousemove";
            ao(document).bind(aJ, aH)
        };
        function aH(aM) {
            y(aM);
            var aN = aK.cell(aM.pageX, aM.pageY);
            if (!aN != !aF || aN && (aN.row != aF.row || aN.col != aF.col)) {
                if (aN) {
                    if (!aG) {
                        aG = aN
                    }
                    aL(aN, aG, aN.row - aG.row, aN.col - aG.col)
                } else {
                    aL(aN, aG)
                }
                aF = aN
            }
        }

        aI.stop = function () {
            ao(document).unbind(aJ, aH);
            return aF
        }
    }

    function y(aF) {
        if (aF.pageX === t) {
            aF.pageX = aF.originalEvent.pageX;
            aF.pageY = aF.originalEvent.pageY
        }
    }

    function j(aG) {
        var aF = this, aH = {}, aK = {}, aJ = {};

        function aI(aL) {
            return aH[aL] = aH[aL] || aG(aL)
        }

        aF.left = function (aL) {
            return aK[aL] = aK[aL] === t ? aI(aL).position().left : aK[aL]
        };
        aF.right = function (aL) {
            return aJ[aL] = aJ[aL] === t ? aF.left(aL) + aI(aL).width() : aJ[aL]
        };
        aF.clear = function () {
            aH = {};
            aK = {};
            aJ = {}
        }
    }
})(jQuery);
PrimeFaces.widget.Schedule = PrimeFaces.widget.BaseWidget.extend({
    init: function (c) {
        this._super(c);
        this.jqc = $(this.jqId + "_container");
        this.cfg.formId = this.jq.parents("form:first").attr("id");
        this.cfg.theme = true;
        var b = this;
        this.setupEventSource();
        this.configureLocale();
        this.setupEventHandlers();
        if (this.jq.is(":not(:visible)")) {
            var a = this.jq.parents(".ui-hidden-container:first"), d = a.data("widget");
            if (d) {
                d.addOnshowHandler(function () {
                    return b.render()
                })
            }
        } else {
            this.render()
        }
    }, render: function () {
        if (this.jq.is(":visible")) {
            this.jqc.fullCalendar(this.cfg);
            return true
        } else {
            return false
        }
    }, configureLocale: function () {
        var a = PrimeFaces.locales[this.cfg.locale];
        if (a) {
            this.cfg.firstDay = a.firstDay;
            this.cfg.monthNames = a.monthNames;
            this.cfg.monthNamesShort = a.monthNamesShort;
            this.cfg.dayNames = a.dayNames;
            this.cfg.dayNamesShort = a.dayNamesShort;
            this.cfg.buttonText = {today: a.currentText, month: a.month, week: a.week, day: a.day};
            this.cfg.allDayText = a.allDayText
        }
    }, setupEventHandlers: function () {
        var a = this;
        this.cfg.dayClick = function (b, f, d, c) {
            if (a.cfg.behaviors) {
                var g = a.cfg.behaviors.dateSelect;
                if (g) {
                    var e = {
                        params: [{
                            name: a.id + "_selectedDate",
                            value: b.getTime() - new Date().getTimezoneOffset() * 60000 - a.cfg.offset
                        }]
                    };
                    g.call(a, b, e)
                }
            }
        };
        this.cfg.eventClick = function (f, c, b) {
            if (a.cfg.behaviors) {
                var e = a.cfg.behaviors.eventSelect;
                if (e) {
                    var d = {params: [{name: a.id + "_selectedEventId", value: f.id}]};
                    e.call(a, f, d)
                }
            }
        };
        this.cfg.eventDrop = function (h, d, f, k, e, g, i, j) {
            if (a.cfg.behaviors) {
                var c = a.cfg.behaviors.eventMove;
                if (c) {
                    var b = {
                        params: [{name: a.id + "_movedEventId", value: h.id}, {
                            name: a.id + "_dayDelta",
                            value: d
                        }, {name: a.id + "_minuteDelta", value: f}]
                    };
                    c.call(a, h, b)
                }
            }
        };
        this.cfg.eventResize = function (h, c, f, d, g, i, j) {
            if (a.cfg.behaviors) {
                var e = a.cfg.behaviors.eventResize;
                if (e) {
                    var b = {
                        params: [{name: a.id + "_resizedEventId", value: h.id}, {
                            name: a.id + "_dayDelta",
                            value: c
                        }, {name: a.id + "_minuteDelta", value: f}]
                    };
                    e.call(a, h, b)
                }
            }
        }
    }, setupEventSource: function () {
        var a = this, b = new Date().getTimezoneOffset() * 60000 + this.cfg.offset;
        this.cfg.events = function (f, c, e) {
            var d = {
                source: a.id, process: a.id, update: a.id, formId: a.cfg.formId, onsuccess: function (o) {
                    var q = $(o.documentElement), n = q.find("update");
                    for (var m = 0; m < n.length; m++) {
                        var k = n.eq(m), g = k.attr("id"), l = k.text();
                        if (g == a.id) {
                            var p = $.parseJSON(l).events;
                            for (var h = 0; h < p.length; h++) {
                                p[h].start = new Date(p[h].start + b);
                                p[h].end = new Date(p[h].end + b)
                            }
                            e(p)
                        } else {
                            PrimeFaces.ajax.AjaxUtils.updateElement.call(this, g, l)
                        }
                    }
                    PrimeFaces.ajax.AjaxUtils.handleResponse.call(this, q);
                    return true
                }
            };
            d.params = [{name: a.id + "_start", value: f.getTime() + b}, {name: a.id + "_end", value: c.getTime() + b}];
            PrimeFaces.ajax.AjaxRequest(d)
        }
    }, update: function () {
        this.jqc.fullCalendar("refetchEvents")
    }
});