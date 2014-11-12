(function (d) { var b = ["DOMMouseScroll", "mousewheel"]; if (d.event.fixHooks) { for (var a = b.length; a;) { d.event.fixHooks[b[--a]] = d.event.mouseHooks } } d.event.special.mousewheel = { setup: function () { if (this.addEventListener) { for (var e = b.length; e;) { this.addEventListener(b[--e], c, false) } } else { this.onmousewheel = c } }, teardown: function () { if (this.removeEventListener) { for (var e = b.length; e;) { this.removeEventListener(b[--e], c, false) } } else { this.onmousewheel = null } } }; d.fn.extend({ mousewheel: function (e) { return e ? this.bind("mousewheel", e) : this.trigger("mousewheel") }, unmousewheel: function (e) { return this.unbind("mousewheel", e) } }); function c(j) { var h = j || window.event, g = [].slice.call(arguments, 1), k = 0, i = true, f = 0, e = 0; j = d.event.fix(h); j.type = "mousewheel"; if (h.wheelDelta) { k = h.wheelDelta / 120 } if (h.detail) { k = -h.detail / 3 } e = k; if (h.axis !== undefined && h.axis === h.HORIZONTAL_AXIS) { e = 0; f = -1 * k } if (h.wheelDeltaY !== undefined) { e = h.wheelDeltaY / 120 } if (h.wheelDeltaX !== undefined) { f = -1 * h.wheelDeltaX / 120 } g.unshift(j, k, f, e); return (d.event.dispatch || d.event.handle).apply(this, g) } })(jQuery);



if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
    $(document).ready(function () {
        $('body, html').bind('mousewheel', function (event, delta, deltaX, deltaY) {
            //$('html, body').stop().animate({scrollLeft: '-='+(400*delta)+'px' });
            $('#booksContainer').scrollLeft -= (delta * 40);
            /*if(delta < 0){
                $('body, html').scrollLeft($('body, html').scrollLeft()+50);
              }else{
                $('body, html').scrollLeft($('body, html').scrollLeft()-50);
            }*/
            event.preventDefault();
        });
    });
}
else {

    $window = $(window);
    $(function () {
        $('body, html').bind('mousewheel', function (event, delta, deltaX, deltaY) {

            var isHorizontalMode = $window.width() > 500;
            if (isHorizontalMode)
                $('#booksContainer').stop().animate({ scrollLeft: '-=' + (500 * delta) + 'px' }, 400, 'easeOutQuint');
            else
                $('#booksContainer').stop().animate({ scrollTop: '-=' + (500 * delta) + 'px' }, 400, 'easeOutQuint');
            event.preventDefault();
        });
    });
};

var xStart, yStart = 0;

//document.addEventListener('touchstart', function (e) {
//    xStart = e.touches[0].screenX;
//    yStart = e.touches[0].screenY;
//});

//document.addEventListener('touchmove', function (e) {
//    var xMovement = Math.abs(e.touches[0].screenX - xStart);
//    var yMovement = Math.abs(e.touches[0].screenY - yStart);
//    if ((yMovement * 3) > xMovement) {
//        e.preventDefault();

//    }
//});




$(document).ready(function () {

    var $window = $(window);


    var $container = $('.tilesContainer');

    // change layout mode
    //$container.isotope({ layoutMode: "masonryHorizontal" });
    $container.isotope({
        layoutMode: 'masonryHorizontal',
        itemSelector: '.tile',
        masonryHorizontal: { rowHeight: 20 },
    });

    //////
    ///// MENU
    /////

    var previousMenuItemClicked;
    $('.floatingmenu').click(function () {
        //$(this).next().next().slideDown(100);
        var menuItem = $(this).find("div");

        if (previousMenuItemClicked) {
            if (previousMenuItemClicked.is(menuItem)) {
                return;
            } else {
                previousMenuItemClicked.slideToggle(100);
            }
        }
        menuItem.slideToggle(100);
        previousMenuItemClicked = menuItem;
    });

    var previous;
    $('.menuItem').click('click', function () {
        var $this = $(this);
        var test = $this.attr('id-menu');
        var menu = $(test);
        if (previous && previous.is(menu)) {
            menu.slideUp(200);
            previous = null;
            return;
        }
        if (previous && !previous.is(menu)) {
            previous.slideUp(200);
        }
        menu.slideDown(200);
        previous = menu;
    });

    var previousValue;
    function setWindowHeight() {
        return;
        var windowHeight = window.innerHeight;
        document.body.style.height = windowHeight + "px";

        var isHorizontalMode = $window.width() > 700;
        if (previousValue && previousValue != isHorizontalMode && $window.width() < 900) {
            images = $container.find('img');
            images.each(function () {
                if ($(this).height() > 250) {
                    $(this).css('height', '214px');
                } else {
                    $(this).css('height', '100px');
                }

            });

        } else if (previousValue && previousValue == isHorizontalMode && $window.width() > 900) {
            var images = $container.find('img');
            images.each(function () {
                if ($(this).height() > 200) {
                    $(this).css('height', '314px');
                } else {
                    $(this).css('height', '150px');
                }

            });
        }

        previousValue = isHorizontalMode;
        // change container size if horiz/vert change
        var containerStyle = isHorizontalMode ? {
            height: $window.height() * 0.75,
            'overflow-y': "hidden !important",
            'overflow-x': "scroll !important",

        } : {
            width: 'auto',
            background: 'blue',
            'overflow-y': "scroll !important",
            'overflow-x': "hidden !important",
            'padding-right': '0'

        };

        $container.css(containerStyle);

        if (!isHorizontalMode) {
            $container.isotope({
                layoutMode: 'masonry',
            });
        } else {
            $container.isotope({
                layoutMode: 'masonryHorizontal',
            });
        }
        $container.isotope('reLayout');
    }

    

    //  setWindowHeight();



    // window.addEventListener("resize", setWindowHeight, false);

});

