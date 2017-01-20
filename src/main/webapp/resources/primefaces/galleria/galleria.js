PrimeFaces.widget.Galleria = PrimeFaces.widget.BaseWidget.extend({
    init: function (b) {
        this._super(b);
        this.cfg.panelWidth = this.cfg.panelWidth || 600;
        this.cfg.panelHeight = this.cfg.panelHeight || 400;
        this.cfg.frameWidth = this.cfg.frameWidth || 60;
        this.cfg.frameHeight = this.cfg.frameHeight || 40;
        this.cfg.activeIndex = 0;
        this.cfg.showFilmstrip = (this.cfg.showFilmstrip === false) ? false : true;
        this.cfg.autoPlay = (this.cfg.autoPlay === false) ? false : true;
        this.cfg.transitionInterval = this.cfg.transitionInterval || 4000;
        this.cfg.effect = this.cfg.effect || "fade";
        this.cfg.effectSpeed = this.cfg.effectSpeed || 250;
        this.cfg.effectOptions = {};
        this.panelWrapper = this.jq.children("ul.ui-galleria-panel-wrapper");
        this.panels = this.panelWrapper.children("li.ui-galleria-panel");
        var d = this;
        if (this.jq.is(":not(:visible)")) {
            var a = this.jq.parents(".ui-hidden-container:first"), c = a.data("widget");
            if (c) {
                c.addOnshowHandler(function () {
                    return d.render()
                })
            }
        } else {
            this.render()
        }
    }, render: function () {
        if (this.jq.is(":visible")) {
            this.panelWrapper.width(this.cfg.panelWidth).height(this.cfg.panelHeight);
            this.panels.width(this.cfg.panelWidth).height(this.cfg.panelHeight);
            this.jq.width(this.cfg.panelWidth);
            if (this.cfg.showFilmstrip) {
                this.renderStrip();
                this.bindEvents()
            }
            if (this.cfg.custom) {
                this.panels.children("img").remove()
            }
            var a = this.panels.eq(this.cfg.activeIndex);
            a.removeClass("ui-helper-hidden");
            if (this.cfg.showCaption) {
                this.showCaption(a)
            }
            this.jq.css("visibility", "visible");
            if (this.cfg.autoPlay) {
                this.startSlideshow()
            }
            return true
        } else {
            return false
        }
    }, renderStrip: function () {
        var a = 'style="width:' + this.cfg.frameWidth + "px;height:" + this.cfg.frameHeight + 'px;"';
        this.stripWrapper = $('<div class="ui-galleria-filmstrip-wrapper"></div>').width(this.panelWrapper.width() - 50).height(this.cfg.frameHeight).appendTo(this.jq);
        this.strip = $('<ul class="ui-galleria-filmstrip"></div>').appendTo(this.stripWrapper);
        for (var c = 0; c < this.panels.length; c++) {
            var e = this.panels.eq(c).children("img"), b = (c == this.cfg.activeIndex) ? "ui-galleria-frame ui-galleria-frame-active" : "ui-galleria-frame", d = '<li class="' + b + '" ' + a + '><div class="ui-galleria-frame-content" ' + a + '><img src="' + e.attr("src") + '" class="ui-galleria-frame-image" ' + a + "/></div></li>";
            this.strip.append(d)
        }
        this.frames = this.strip.children("li.ui-galleria-frame");
        this.jq.append('<div class="ui-galleria-nav-prev ui-icon ui-icon-circle-triangle-w" style="bottom:' + (this.cfg.frameHeight / 2) + 'px"></div><div class="ui-galleria-nav-next ui-icon ui-icon-circle-triangle-e" style="bottom:' + (this.cfg.frameHeight / 2) + 'px"></div>');
        if (this.cfg.showCaption) {
            this.caption = $('<div class="ui-galleria-caption"></div>').css({
                bottom: this.stripWrapper.outerHeight(true),
                width: this.panelWrapper.width()
            }).appendTo(this.jq)
        }
    }, bindEvents: function () {
        var a = this;
        this.jq.children("div.ui-galleria-nav-prev").on("click.galleria", function () {
            if (a.slideshowActive) {
                a.stopSlideshow()
            }
            if (!a.isAnimating()) {
                a.prev()
            }
        });
        this.jq.children("div.ui-galleria-nav-next").on("click.galleria", function () {
            if (a.slideshowActive) {
                a.stopSlideshow()
            }
            if (!a.isAnimating()) {
                a.next()
            }
        });
        this.strip.children("li.ui-galleria-frame").on("click.galleria", function () {
            if (a.slideshowActive) {
                a.stopSlideshow()
            }
            a.select($(this).index(), false)
        })
    }, startSlideshow: function () {
        var a = this;
        this.interval = setInterval(function () {
            a.next()
        }, this.cfg.transitionInterval);
        this.slideshowActive = true
    }, stopSlideshow: function () {
        clearInterval(this.interval);
        this.slideshowActive = false
    }, isSlideshowActive: function () {
        return this.slideshowActive
    }, select: function (g, j) {
        if (g !== this.cfg.activeIndex) {
            if (this.cfg.showCaption) {
                this.hideCaption()
            }
            var a = this.panels.eq(this.cfg.activeIndex), c = this.frames.eq(this.cfg.activeIndex), b = this.panels.eq(g), e = this.frames.eq(g);
            a.hide(this.cfg.effect, this.cfg.effectOptions, this.cfg.effectSpeed);
            b.show(this.cfg.effect, this.cfg.effectOptions, this.cfg.effectSpeed);
            c.removeClass("ui-galleria-frame-active").css("opacity", "");
            e.animate({opacity: 1}, this.cfg.effectSpeed, null, function () {
                $(this).addClass("ui-galleria-frame-active")
            });
            if (this.cfg.showCaption) {
                this.showCaption(b)
            }
            if (j === undefined || j === true) {
                var h = e.position().left, k = this.cfg.frameWidth + parseInt(e.css("margin-right")), i = this.strip.position().left, d = h + i, f = d + this.cfg.frameWidth;
                if (f > this.stripWrapper.width()) {
                    this.strip.animate({left: "-=" + k}, this.cfg.effectSpeed, "easeInOutCirc")
                } else {
                    if (d < 0) {
                        this.strip.animate({left: "+=" + k}, this.cfg.effectSpeed, "easeInOutCirc")
                    }
                }
            }
            this.cfg.activeIndex = g
        }
    }, hideCaption: function () {
        this.caption.slideUp(this.cfg.effectSpeed)
    }, showCaption: function (a) {
        var b = a.children("img");
        this.caption.html("<h4>" + b.attr("title") + "</h4><p>" + b.attr("alt") + "</p>").slideDown(this.cfg.effectSpeed)
    }, prev: function () {
        if (this.cfg.activeIndex != 0) {
            this.select(this.cfg.activeIndex - 1)
        }
    }, next: function () {
        if (this.cfg.activeIndex !== (this.panels.length - 1)) {
            this.select(this.cfg.activeIndex + 1)
        } else {
            this.select(0, false);
            this.strip.animate({left: 0}, this.cfg.effectSpeed, "easeInOutCirc")
        }
    }, isAnimating: function () {
        return this.strip.is(":animated")
    }
});