(function (b) {
    var c, d, a;
    b.extend({
        roundaboutShapes: {
            def: "lazySusan", lazySusan: function (g, e, f) {
                return {
                    x: Math.sin(g + e),
                    y: (Math.sin(g + 3 * Math.PI / 2 + e) / 8) * f,
                    z: (Math.cos(g + e) + 1) / 2,
                    scale: (Math.sin(g + Math.PI / 2 + e) / 2) + 0.5
                }
            }
        }
    });
    c = {
        bearing: 0,
        tilt: 0,
        minZ: 100,
        maxZ: 280,
        minOpacity: 0.4,
        maxOpacity: 1,
        minScale: 0.4,
        maxScale: 1,
        duration: 600,
        btnNext: null,
        btnNextCallback: function () {
        },
        btnPrev: null,
        btnPrevCallback: function () {
        },
        btnToggleAutoplay: null,
        btnStartAutoplay: null,
        btnStopAutoplay: null,
        easing: "swing",
        clickToFocus: true,
        clickToFocusCallback: function () {
        },
        focusBearing: 0,
        shape: "lazySusan",
        debug: false,
        childSelector: "li",
        startingChild: null,
        reflect: false,
        floatComparisonThreshold: 0.001,
        autoplay: false,
        autoplayDuration: 1000,
        autoplayPauseOnHover: false,
        autoplayCallback: function () {
        },
        autoplayInitialDelay: 0,
        enableDrag: false,
        dropDuration: 600,
        dropEasing: "swing",
        dropAnimateTo: "nearest",
        dropCallback: function () {
        },
        dragAxis: "x",
        dragFactor: 4,
        triggerFocusEvents: true,
        triggerBlurEvents: true,
        responsive: false
    };
    d = {
        autoplayInterval: null,
        autoplayIsRunning: false,
        autoplayStartTimeout: null,
        animating: false,
        childInFocus: -1,
        touchMoveStartPosition: null,
        stopAnimation: false,
        lastAnimationStep: false
    };
    a = {
        init: function (f, i, h) {
            var g, e = (new Date()).getTime();
            f = (typeof f === "object") ? f : {};
            i = (b.isFunction(i)) ? i : function () {
                };
            i = (b.isFunction(f)) ? f : i;
            g = b.extend({}, c, f, d);
            return this.each(function () {
                var k = b(this), j = k.children(g.childSelector).length, n = 360 / j, m = (g.startingChild && g.startingChild > (j - 1)) ? (j - 1) : g.startingChild, l = (g.startingChild === null) ? g.bearing : 360 - (m * n), o = (k.css("position") !== "static") ? k.css("position") : "relative";
                k.css({padding: 0, position: o}).data("roundabout", b.extend({}, g, {
                    startingChild: m,
                    bearing: l,
                    oppositeOfFocusBearing: a.normalize.apply(null, [g.focusBearing - 180]),
                    dragBearing: l,
                    period: n
                }));
                if (h) {
                    k.unbind(".roundabout").children(g.childSelector).unbind(".roundabout")
                } else {
                    if (g.responsive) {
                        b(window).bind("resize", function () {
                            a.stopAutoplay.apply(k);
                            a.relayoutChildren.apply(k)
                        })
                    }
                }
                if (g.clickToFocus) {
                    k.children(g.childSelector).each(function (p) {
                        b(this).bind("click.roundabout", function () {
                            var q = a.getPlacement.apply(k, [p]);
                            if (!a.isInFocus.apply(k, [q])) {
                                a.stopAnimation.apply(b(this));
                                if (!k.data("roundabout").animating) {
                                    a.animateBearingToFocus.apply(k, [q, k.data("roundabout").clickToFocusCallback])
                                }
                                return false
                            }
                        })
                    })
                }
                if (g.btnNext) {
                    b(g.btnNext).bind("click.roundabout", function () {
                        if (!k.data("roundabout").animating) {
                            a.animateToNextChild.apply(k, [k.data("roundabout").btnNextCallback])
                        }
                        return false
                    })
                }
                if (g.btnPrev) {
                    b(g.btnPrev).bind("click.roundabout", function () {
                        a.animateToPreviousChild.apply(k, [k.data("roundabout").btnPrevCallback]);
                        return false
                    })
                }
                if (g.btnToggleAutoplay) {
                    b(g.btnToggleAutoplay).bind("click.roundabout", function () {
                        a.toggleAutoplay.apply(k);
                        return false
                    })
                }
                if (g.btnStartAutoplay) {
                    b(g.btnStartAutoplay).bind("click.roundabout", function () {
                        a.startAutoplay.apply(k);
                        return false
                    })
                }
                if (g.btnStopAutoplay) {
                    b(g.btnStopAutoplay).bind("click.roundabout", function () {
                        a.stopAutoplay.apply(k);
                        return false
                    })
                }
                if (g.autoplayPauseOnHover) {
                    k.bind("mouseenter.roundabout.autoplay", function () {
                        a.stopAutoplay.apply(k, [true])
                    }).bind("mouseleave.roundabout.autoplay", function () {
                        a.startAutoplay.apply(k)
                    })
                }
                if (g.enableDrag) {
                    if (!b.isFunction(k.drag)) {
                        if (g.debug) {
                            alert("You do not have the drag plugin loaded.")
                        }
                    } else {
                        if (!b.isFunction(k.drop)) {
                            if (g.debug) {
                                alert("You do not have the drop plugin loaded.")
                            }
                        } else {
                            k.drag(function (r, p) {
                                var q = k.data("roundabout"), s = (q.dragAxis.toLowerCase() === "x") ? "deltaX" : "deltaY";
                                a.stopAnimation.apply(k);
                                a.setBearing.apply(k, [q.dragBearing + p[s] / q.dragFactor])
                            }).drop(function (q) {
                                var p = k.data("roundabout"), r = a.getAnimateToMethod(p.dropAnimateTo);
                                a.allowAnimation.apply(k);
                                a[r].apply(k, [p.dropDuration, p.dropEasing, p.dropCallback]);
                                p.dragBearing = p.period * a.getNearestChild.apply(k)
                            })
                        }
                    }
                    k.each(function () {
                        var p = b(this).get(0), r = b(this).data("roundabout"), q = (r.dragAxis.toLowerCase() === "x") ? "pageX" : "pageY", s = a.getAnimateToMethod(r.dropAnimateTo);
                        if (p.addEventListener) {
                            p.addEventListener("touchstart", function (t) {
                                r.touchMoveStartPosition = t.touches[0][q]
                            }, false);
                            p.addEventListener("touchmove", function (t) {
                                var u = (t.touches[0][q] - r.touchMoveStartPosition) / r.dragFactor;
                                t.preventDefault();
                                a.stopAnimation.apply(b(this));
                                a.setBearing.apply(b(this), [r.dragBearing + u])
                            }, false);
                            p.addEventListener("touchend", function (t) {
                                t.preventDefault();
                                a.allowAnimation.apply(b(this));
                                s = a.getAnimateToMethod(r.dropAnimateTo);
                                a[s].apply(b(this), [r.dropDuration, r.dropEasing, r.dropCallback]);
                                r.dragBearing = r.period * a.getNearestChild.apply(b(this))
                            }, false)
                        }
                    })
                }
                a.initChildren.apply(k, [i, h])
            })
        }, initChildren: function (h, f) {
            var e = b(this), g = e.data("roundabout");
            h = h || function () {
                };
            e.children(g.childSelector).each(function (m) {
                var k, j, l, n = a.getPlacement.apply(e, [m]);
                if (f && b(this).data("roundabout")) {
                    k = b(this).data("roundabout").startWidth;
                    j = b(this).data("roundabout").startHeight;
                    l = b(this).data("roundabout").startFontSize
                }
                b(this).addClass("ui-ring-item").css("position", "absolute");
                b(this).data("roundabout", {
                    startWidth: k || b(this).width(),
                    startHeight: j || b(this).height(),
                    startFontSize: l || parseInt(b(this).css("font-size"), 10),
                    degrees: n,
                    backDegrees: a.normalize.apply(null, [n - 180]),
                    childNumber: m,
                    currentScale: 1,
                    parent: e
                })
            });
            a.updateChildren.apply(e);
            if (g.autoplay) {
                g.autoplayStartTimeout = setTimeout(function () {
                    a.startAutoplay.apply(e)
                }, g.autoplayInitialDelay)
            }
            e.trigger("ready");
            h.apply(e);
            return e
        }, updateChildren: function () {
            return this.each(function () {
                var e = b(this), f = e.data("roundabout"), h = -1, g = {
                    bearing: f.bearing,
                    tilt: f.tilt,
                    stage: {width: Math.floor(b(this).width() * 0.9), height: Math.floor(b(this).height() * 0.9)},
                    animating: f.animating,
                    inFocus: f.childInFocus,
                    focusBearingRadian: a.degToRad.apply(null, [f.focusBearing]),
                    shape: b.roundaboutShapes[f.shape] || b.roundaboutShapes[b.roundaboutShapes.def]
                };
                g.midStage = {width: g.stage.width / 2, height: g.stage.height / 2};
                g.nudge = {
                    width: g.midStage.width + (g.stage.width * 0.05),
                    height: g.midStage.height + (g.stage.height * 0.05)
                };
                g.zValues = {min: f.minZ, max: f.maxZ, diff: f.maxZ - f.minZ};
                g.opacity = {min: f.minOpacity, max: f.maxOpacity, diff: f.maxOpacity - f.minOpacity};
                g.scale = {min: f.minScale, max: f.maxScale, diff: f.maxScale - f.minScale};
                e.children(f.childSelector).each(function (j) {
                    if (a.updateChild.apply(e, [b(this), g, j, function () {
                            b(this).trigger("ready")
                        }]) && (!g.animating || f.lastAnimationStep)) {
                        h = j;
                        b(this).addClass("ui-ring-item-focus")
                    } else {
                        b(this).removeClass("ui-ring-item-focus")
                    }
                });
                if (h !== g.inFocus) {
                    if (f.triggerBlurEvents) {
                        e.children(f.childSelector).eq(g.inFocus).trigger("blur")
                    }
                    f.childInFocus = h;
                    if (f.triggerFocusEvents && h !== -1) {
                        e.children(f.childSelector).eq(h).trigger("focus")
                    }
                }
                e.trigger("childrenUpdated")
            })
        }, updateChild: function (h, g, e, m) {
            var l, n = this, f = b(h), j = f.data("roundabout"), i = [], k = a.degToRad.apply(null, [(360 - j.degrees) + g.bearing]);
            m = m || function () {
                };
            k = a.normalizeRad.apply(null, [k]);
            l = g.shape(k, g.focusBearingRadian, g.tilt);
            l.scale = (l.scale > 1) ? 1 : l.scale;
            l.adjustedScale = (g.scale.min + (g.scale.diff * l.scale)).toFixed(4);
            l.width = (l.adjustedScale * j.startWidth).toFixed(4);
            l.height = (l.adjustedScale * j.startHeight).toFixed(4);
            f.css({
                left: ((l.x * g.midStage.width + g.nudge.width) - l.width / 2).toFixed(0) + "px",
                top: ((l.y * g.midStage.height + g.nudge.height) - l.height / 2).toFixed(0) + "px",
                width: l.width + "px",
                height: l.height + "px",
                opacity: (g.opacity.min + (g.opacity.diff * l.scale)).toFixed(2),
                zIndex: Math.round(g.zValues.min + (g.zValues.diff * l.z)),
                fontSize: (l.adjustedScale * j.startFontSize).toFixed(1) + "px"
            });
            j.currentScale = l.adjustedScale;
            if (n.data("roundabout").debug) {
                i.push('<div style="font-weight: normal; font-size: 10px; padding: 2px; width: ' + f.css("width") + '; background-color: #ffc;">');
                i.push('<strong style="font-size: 12px; white-space: nowrap;">Child ' + e + "</strong><br />");
                i.push("<strong>left:</strong> " + f.css("left") + "<br />");
                i.push("<strong>top:</strong> " + f.css("top") + "<br />");
                i.push("<strong>width:</strong> " + f.css("width") + "<br />");
                i.push("<strong>opacity:</strong> " + f.css("opacity") + "<br />");
                i.push("<strong>height:</strong> " + f.css("height") + "<br />");
                i.push("<strong>z-index:</strong> " + f.css("z-index") + "<br />");
                i.push("<strong>font-size:</strong> " + f.css("font-size") + "<br />");
                i.push("<strong>scale:</strong> " + f.data("roundabout").currentScale);
                i.push("</div>");
                f.html(i.join(""))
            }
            f.trigger("reposition");
            m.apply(n);
            return a.isInFocus.apply(n, [j.degrees])
        }, setBearing: function (e, f) {
            f = f || function () {
                };
            e = a.normalize.apply(null, [e]);
            this.each(function () {
                var l, g, j, i = b(this), k = i.data("roundabout"), h = k.bearing;
                k.bearing = e;
                i.trigger("bearingSet");
                a.updateChildren.apply(i);
                l = Math.abs(h - e);
                if (!k.animating || l > 180) {
                    return
                }
                l = Math.abs(h - e);
                i.children(k.childSelector).each(function (n) {
                    var m;
                    if (a.isChildBackDegreesBetween.apply(b(this), [e, h])) {
                        m = (h > e) ? "Clockwise" : "Counterclockwise";
                        b(this).trigger("move" + m + "ThroughBack")
                    }
                })
            });
            f.apply(this);
            return this
        }, adjustBearing: function (f, e) {
            e = e || function () {
                };
            if (f === 0) {
                return this
            }
            this.each(function () {
                a.setBearing.apply(b(this), [b(this).data("roundabout").bearing + f])
            });
            e.apply(this);
            return this
        }, setTilt: function (e, f) {
            f = f || function () {
                };
            this.each(function () {
                b(this).data("roundabout").tilt = e;
                a.updateChildren.apply(b(this))
            });
            f.apply(this);
            return this
        }, adjustTilt: function (f, e) {
            e = e || function () {
                };
            this.each(function () {
                a.setTilt.apply(b(this), [b(this).data("roundabout").tilt + f])
            });
            e.apply(this);
            return this
        }, animateToBearing: function (f, g, j, h, i) {
            var e = (new Date()).getTime();
            i = i || function () {
                };
            if (b.isFunction(h)) {
                i = h;
                h = null
            } else {
                if (b.isFunction(j)) {
                    i = j;
                    j = null
                } else {
                    if (b.isFunction(g)) {
                        i = g;
                        g = null
                    }
                }
            }
            this.each(function () {
                var q, p, k, l = b(this), o = l.data("roundabout"), m = (!g) ? o.duration : g, n = (j) ? j : o.easing || "swing";
                if (!h) {
                    h = {timerStart: e, start: o.bearing, totalTime: m}
                }
                q = e - h.timerStart;
                if (o.stopAnimation) {
                    a.allowAnimation.apply(l);
                    o.animating = false;
                    return
                }
                if (q < m) {
                    if (!o.animating) {
                        l.trigger("animationStart")
                    }
                    o.animating = true;
                    if (typeof b.easing.def === "string") {
                        p = b.easing[n] || b.easing[b.easing.def];
                        k = p(null, q, h.start, f - h.start, h.totalTime)
                    } else {
                        k = b.easing[n]((q / h.totalTime), q, h.start, f - h.start, h.totalTime)
                    }
                    if (a.compareVersions.apply(null, [b().jquery, "1.7.2"]) >= 0 && (b.easing.easeOutBack)) {
                        k = h.start + ((f - h.start) * k)
                    }
                    k = a.normalize.apply(null, [k]);
                    o.dragBearing = k;
                    a.setBearing.apply(l, [k, function () {
                        setTimeout(function () {
                            a.animateToBearing.apply(l, [f, m, n, h, i])
                        }, 0)
                    }])
                } else {
                    o.lastAnimationStep = true;
                    f = a.normalize.apply(null, [f]);
                    a.setBearing.apply(l, [f, function () {
                        l.trigger("animationEnd")
                    }]);
                    o.animating = false;
                    o.lastAnimationStep = false;
                    o.dragBearing = f;
                    i.apply(l)
                }
            });
            return this
        }, animateToNearbyChild: function (e, g) {
            var f = e[0], i = e[1], h = e[2] || function () {
                };
            if (b.isFunction(i)) {
                h = i;
                i = null
            } else {
                if (b.isFunction(f)) {
                    h = f;
                    f = null
                }
            }
            return this.each(function () {
                var n, l, k = b(this), p = k.data("roundabout"), m = (!p.reflect) ? p.bearing % 360 : p.bearing, o = k.children(p.childSelector).length;
                if (!p.animating) {
                    if ((p.reflect && g === "previous") || (!p.reflect && g === "next")) {
                        m = (Math.abs(m) < p.floatComparisonThreshold) ? 360 : m;
                        for (n = 0; n < o; n += 1) {
                            l = {lower: (p.period * n), upper: (p.period * (n + 1))};
                            l.upper = (n === o - 1) ? 360 : l.upper;
                            if (m <= Math.ceil(l.upper) && m >= Math.floor(l.lower)) {
                                if (o === 2 && m === 360) {
                                    a.animateToDelta.apply(k, [-180, f, i, h])
                                } else {
                                    a.animateBearingToFocus.apply(k, [l.lower, f, i, h])
                                }
                                break
                            }
                        }
                    } else {
                        m = (Math.abs(m) < p.floatComparisonThreshold || 360 - Math.abs(m) < p.floatComparisonThreshold) ? 0 : m;
                        for (n = o - 1; n >= 0; n -= 1) {
                            l = {lower: p.period * n, upper: p.period * (n + 1)};
                            l.upper = (n === o - 1) ? 360 : l.upper;
                            if (m >= Math.floor(l.lower) && m < Math.ceil(l.upper)) {
                                if (o === 2 && m === 360) {
                                    a.animateToDelta.apply(k, [180, f, i, h])
                                } else {
                                    a.animateBearingToFocus.apply(k, [l.upper, f, i, h])
                                }
                                break
                            }
                        }
                    }
                }
            })
        }, animateToNearestChild: function (e, g, f) {
            f = f || function () {
                };
            if (b.isFunction(g)) {
                f = g;
                g = null
            } else {
                if (b.isFunction(e)) {
                    f = e;
                    e = null
                }
            }
            return this.each(function () {
                var h = a.getNearestChild.apply(b(this));
                a.animateToChild.apply(b(this), [h, e, g, f])
            })
        }, animateToChild: function (e, f, h, g) {
            g = g || function () {
                };
            if (b.isFunction(h)) {
                g = h;
                h = null
            } else {
                if (b.isFunction(f)) {
                    g = f;
                    f = null
                }
            }
            return this.each(function () {
                var k, i = b(this), j = i.data("roundabout");
                if (j.childInFocus !== e && !j.animating) {
                    k = i.children(j.childSelector).eq(e);
                    a.animateBearingToFocus.apply(i, [k.data("roundabout").degrees, f, h, g])
                }
            })
        }, animateToNextChild: function (e, g, f) {
            return a.animateToNearbyChild.apply(this, [arguments, "next"])
        }, animateToPreviousChild: function (e, g, f) {
            return a.animateToNearbyChild.apply(this, [arguments, "previous"])
        }, animateToDelta: function (f, e, h, g) {
            g = g || function () {
                };
            if (b.isFunction(h)) {
                g = h;
                h = null
            } else {
                if (b.isFunction(e)) {
                    g = e;
                    e = null
                }
            }
            return this.each(function () {
                var i = b(this).data("roundabout").bearing + f;
                a.animateToBearing.apply(b(this), [i, e, h, g])
            })
        }, animateBearingToFocus: function (f, e, h, g) {
            g = g || function () {
                };
            if (b.isFunction(h)) {
                g = h;
                h = null
            } else {
                if (b.isFunction(e)) {
                    g = e;
                    e = null
                }
            }
            return this.each(function () {
                var i = b(this).data("roundabout").bearing - f;
                i = (Math.abs(360 - i) < Math.abs(i)) ? 360 - i : -i;
                i = (i > 180) ? -(360 - i) : i;
                if (i !== 0) {
                    a.animateToDelta.apply(b(this), [i, e, h, g])
                }
            })
        }, stopAnimation: function () {
            return this.each(function () {
                b(this).data("roundabout").stopAnimation = true
            })
        }, allowAnimation: function () {
            return this.each(function () {
                b(this).data("roundabout").stopAnimation = false
            })
        }, startAutoplay: function (e) {
            return this.each(function () {
                var f = b(this), g = f.data("roundabout");
                e = e || g.autoplayCallback || function () {
                    };
                clearInterval(g.autoplayInterval);
                g.autoplayInterval = setInterval(function () {
                    a.animateToNextChild.apply(f, [e])
                }, g.autoplayDuration);
                g.autoplayIsRunning = true;
                f.trigger("autoplayStart")
            })
        }, stopAutoplay: function (e) {
            return this.each(function () {
                clearInterval(b(this).data("roundabout").autoplayInterval);
                b(this).data("roundabout").autoplayInterval = null;
                b(this).data("roundabout").autoplayIsRunning = false;
                if (!e) {
                    b(this).unbind(".autoplay")
                }
                b(this).trigger("autoplayStop")
            })
        }, toggleAutoplay: function (e) {
            return this.each(function () {
                var f = b(this), g = f.data("roundabout");
                e = e || g.autoplayCallback || function () {
                    };
                if (!a.isAutoplaying.apply(b(this))) {
                    a.startAutoplay.apply(b(this), [e])
                } else {
                    a.stopAutoplay.apply(b(this), [e])
                }
            })
        }, isAutoplaying: function () {
            return (this.data("roundabout").autoplayIsRunning)
        }, changeAutoplayDuration: function (e) {
            return this.each(function () {
                var f = b(this), g = f.data("roundabout");
                g.autoplayDuration = e;
                if (a.isAutoplaying.apply(f)) {
                    a.stopAutoplay.apply(f);
                    setTimeout(function () {
                        a.startAutoplay.apply(f)
                    }, 10)
                }
            })
        }, normalize: function (f) {
            var e = f % 360;
            return (e < 0) ? 360 + e : e
        }, normalizeRad: function (e) {
            while (e < 0) {
                e += (Math.PI * 2)
            }
            while (e > (Math.PI * 2)) {
                e -= (Math.PI * 2)
            }
            return e
        }, isChildBackDegreesBetween: function (f, e) {
            var g = b(this).data("roundabout").backDegrees;
            if (f > e) {
                return (g >= e && g < f)
            } else {
                return (g < e && g >= f)
            }
        }, getAnimateToMethod: function (e) {
            e = e.toLowerCase();
            if (e === "next") {
                return "animateToNextChild"
            } else {
                if (e === "previous") {
                    return "animateToPreviousChild"
                }
            }
            return "animateToNearestChild"
        }, relayoutChildren: function () {
            return this.each(function () {
                var e = b(this), f = b.extend({}, e.data("roundabout"));
                f.startingChild = e.data("roundabout").childInFocus;
                a.init.apply(e, [f, null, true])
            })
        }, getNearestChild: function () {
            var e = b(this), g = e.data("roundabout"), f = e.children(g.childSelector).length;
            if (!g.reflect) {
                return ((f) - (Math.round(g.bearing / g.period) % f)) % f
            } else {
                return (Math.round(g.bearing / g.period) % f)
            }
        }, degToRad: function (e) {
            return a.normalize.apply(null, [e]) * Math.PI / 180
        }, getPlacement: function (f) {
            var e = this.data("roundabout");
            return (!e.reflect) ? 360 - (e.period * f) : e.period * f
        }, isInFocus: function (i) {
            var h, e = this, g = e.data("roundabout"), f = a.normalize.apply(null, [g.bearing]);
            i = a.normalize.apply(null, [i]);
            h = Math.abs(f - i);
            return (h <= g.floatComparisonThreshold || h >= 360 - g.floatComparisonThreshold)
        }, getChildInFocus: function () {
            var e = b(this).data("roundabout");
            return (e.childInFocus > -1) ? e.childInFocus : false
        }, compareVersions: function (e, k) {
            var g, j = e.split(/\./i), h = k.split(/\./i), f = (j.length > h.length) ? j.length : h.length;
            for (g = 0; g <= f; g++) {
                if (j[g] && !h[g] && parseInt(j[g], 10) !== 0) {
                    return 1
                } else {
                    if (h[g] && !j[g] && parseInt(h[g], 10) !== 0) {
                        return -1
                    } else {
                        if (j[g] === h[g]) {
                            continue
                        }
                    }
                }
                if (j[g] && h[g]) {
                    if (parseInt(j[g], 10) > parseInt(h[g], 10)) {
                        return 1
                    } else {
                        return -1
                    }
                }
            }
            return 0
        }
    };
    b.fn.roundabout = function (e) {
        if (a[e]) {
            return a[e].apply(this, Array.prototype.slice.call(arguments, 1))
        } else {
            if (typeof e === "object" || b.isFunction(e) || !e) {
                return a.init.apply(this, arguments)
            } else {
                b.error("Method " + e + " does not exist for jQuery.roundabout.")
            }
        }
    }
})(jQuery);
PrimeFaces.widget.Ring = PrimeFaces.widget.BaseWidget.extend({
    init: function (a) {
        this._super(a);
        this.jq.roundabout(this.cfg)
    }
});