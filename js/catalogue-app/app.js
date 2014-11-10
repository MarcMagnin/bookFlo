var app = angular.module('BookFlo', ['angularFileUpload']);

var prev;

app.directive('isotopethis', function () {
    return {
        link: function (scope, elm) {
            var $container = $('.tilesContainer');
            $container.isotope('appended', elm);
                
            //// TILE CLICK
            elm.click(function () {
                var $this = $(this);
                $container.isotope('reLayout');
                // filters
                $this.find("a").click(function () {
                    var selector = $(this).attr('data-filter');
                    $container.isotope({ filter: selector });
                    //setTimeout(function () {
                    //    var hiddenItems = $('.isotope-hidden');
                    //}, 300);
                });




                if (prev) {
                    //prev.find(".tileTextArea").slideToggle(0);
                    //$container.isotope('reLayout');
                    if (prev.is($this)) {
                        return;
                    } else {
                        prev.find(".tileTextArea").slideToggle(0);
                        prev.find(".tileLeftPartDetails").css(
                        {
                            "display": "none",
                        });
                        var image = prev.find("img");
                        if (image.attr('prevHeight')) {
                            image.animate({ "height": image.attr('prevHeight') + "px" }, 300, 'easeOutCubic');
                        }
                        // prev.find("img").animate({ "height": "100%" }, 300, 'easeOutCubic');
                        //prev.find("img").toggleClass("smallHeightImage");
                    }
                }

                $this.find(".tileLeftPartDetails").css(
                    {
                        "display": "ms-flexbox",
                        "display": "flex",


                    });
                var tileTextArea = $this.find(".tileTextArea");
                //$this.find("img").toggleClass("smallHeightImage");
                var image = $this.find("img");
                if (image.height() > 280) {
                    image.attr('prevHeight', image.height());
                    $this.find("img").animate({ "height": "280px" }, 300, 'easeOutCubic');
                }

                tileTextArea.css({
                    "max-height": $('#booksContainer').height() + "px",
                    "display": "inline-block",
                    //"display": "flex",
                });
                $container.isotope('reLayout');
                tileTextArea.hide(0);
                tileTextArea.show(300, function () {
                    $container.isotope('reLayout');
                });
                //    .after(function () {
                //        $container.isotope('reLayout');
                //        setTimeout(function () {
                //            $container.isotope('reLayout');
                //        },100);
                //    });

                prev = $this;
            });







        }
    }
});
