PrimeFaces.widget.Stack = PrimeFaces.widget.BaseWidget.extend({
    init: function (b) {
        this._super(b);
        var a = this;
        $(this.jqId + ".ui-stack>img").toggle(function () {
            var d = 0;
            var c = 0;
            var e = $(this);
            e.next().children().each(function () {
                $(this).animate({top: "-" + d + "px", left: c + "px"}, a.cfg.openSpeed);
                d = d + 55;
                c = (c + 0.75) * 2
            });
            e.next().animate({
                top: "-50px",
                left: "10px"
            }, a.cfg.openSpeed).addClass("openStack").find("li a>img").animate({
                width: "50px",
                marginLeft: "9px"
            }, a.cfg.openSpeed);
            e.animate({paddingTop: "0"})
        }, function () {
            var c = $(this);
            c.next().removeClass("openStack").children("li").animate({top: "55px", left: "-10px"}, a.cfg.closeSpeed);
            c.next().find("li a>img").animate({width: "79px", marginLeft: "0"}, a.cfg.closeSpeed);
            c.animate({paddingTop: "35"})
        });
        if (this.cfg.expanded) {
            this.jq.children("img").click()
        }
    }
});