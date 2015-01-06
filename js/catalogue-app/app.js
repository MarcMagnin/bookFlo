var app = angular.module('BookFlo', ['angularFileUpload']);
var prev;

var $container = $('.tilesContainer');

app.directive('tags', function ($http, $rootScope) {
    return {
        restrict: 'E', 
        scope: { item: '=' },
        template:
            '<div class="tags">' +
                '<button class="btn btn-lg btn-info tag" ng-repeat="(idx, tag) in item.Tags" ng-click="remove(idx)">{{tag}}</button>' +
            '</div>' +
             '<input type="text" ' +
                'ng-model="new_value"  ' +
                'placeholder="tag..." ' +
                'typeahead="tags.Name for tags in getTags($viewValue) | filter:$viewValue" ' +
                'typeahead-loading="loading" ' +
                'class="form-control"></input>' +
                '<i ng-show="loading" class="glyphicon glyphicon-refresh"></i> ' +
            '<a class="btn" ng-click="add()">Add</a>',
        link: function ($scope, $element) {
            // FIXME: this is lazy and error-prone
            var input = angular.element($element.children()[1]);
            // This adds the new tag to the tags array
            $scope.add = function () {
                if (!$scope.item.Tags)
                    $scope.item.Tags = new Array();
                $scope.item.Tags.push($scope.new_value);
                $scope.new_value = "";
                $scope.update();
            };

            $scope.tags = [];
            $scope.loading = false;
            $scope.getTags = function (value) {
                $scope.loading = true;
                return $http.get($rootScope.apiRootUrl + '/indexes/Tags', {
                    params: {
                        query: "Name:" + value + "*",
                        pageSize: 10
                    }
                }).then(function (res) {
                    $scope.loading = false;
                    //var tags = [];
                    //angular.forEach(res.data.Results, function (item) {
                    //    tags.push(item.Name);
                    //});
                    return res.data.Results;
                });
            };


            // This is the ng-click handler to remove an item
            $scope.remove = function (idx) {
                $scope.item.Tags.splice(idx, 1);
                $scope.update();
            };

            $scope.update = function () {
                // put tags before to get id back  
                $http({
                    method: 'PUT',
                    headers: { 'Raven-Entity-Name': 'Item' },
                    url: $rootScope.apiRootUrl + '/docs/' + $scope.item['@metadata']['@id'],
                    data: angular.toJson($scope.item)
                }).
                    success(function (data, status, headers, config) {
                    }).
                    error(function (data, status, headers, config) {

                    });
            };

            // Capture all keypresses
            input.bind('keypress', function (event) {
                // But we only care when Enter was pressed
                if (event.keyCode == 13) {
                    // There's probably a better way to handle this...
                    $scope.$apply($scope.add);
                }
            });
        }
    };
});


app.directive('isotopethis', function () {
    return {
        link: function (scope, elm) {

            $container.isotope('insert', elm);

            setTimeout(function () {
                $container.isotope('reLayout');
            }, 200);


            // handle the mousewheel on tiles
            elm.bind('mousewheel', function (event, delta, deltaX, deltaY) {
                var openTile = elm.find(".inner-tile-open");
                if (openTile.length > 0 && openTile.height()>600) {
                    openTile.stop().animate({ scrollTop: '-=' + (500 * deltaX) + 'px' }, 400, 'easeOutQuint');
                    openTile.stop().animate({ scrollTop: '-=' + (500 * deltaY) + 'px' }, 400, 'easeOutQuint');
                    event.preventDefault();
                    event.stopPropagation();
                }
            });

            elm.find("a").click(function () {
                var selector = $(this).attr('data-filter');
                $container.isotope({ filter: selector });
                //setTimeout(function () {
                //    var hiddenItems = $('.isotope-hidden');
                //}, 300);
            });

            //// TILE CLICK
            elm.find(".tileHeroImage").click(function () {
                var $this = $(this).parent().parent();
                //$container.isotope('layout');
                // filters

                // close the menu if open
                $('.subMenu').slideUp(200);
            
               
                if (prev) {
                    //prev.find(".tileTextArea").slideToggle(0);
                    //$container.isotope('reLayout');
                    prev.toggleClass("tile");
                    prev.toggleClass("tile-open");

                    prev.find(".details").slideToggle(150);
                    var inner = prev.find(".inner-tile-open")
                    inner.toggleClass("inner-tile");
                    inner.toggleClass("inner-tile-open");

                    var vertText = prev.find(".vertical-text-open");
                    vertText.toggleClass("vertical-text");
                    vertText.toggleClass("vertical-text-open");

                    var image = prev.find("img");
                    image.addClass(image.attr('prevWidthClass'));
                    if (image.attr('prevHeight')) {
                        image.animate({ "height": image.attr('prevHeight') + "px" }, 300, 'easeOutCubic');
                    }
                    // prev.find("img").animate({ "height": "100%" }, 300, 'easeOutCubic');
                    //prev.find("img").toggleClass("smallHeightImage");
                    if (prev.is($this)) {
                        setTimeout(function () {
                            $container.isotope('reLayout');
                        }, 200);
                        prev = null;
                        return;
                    }

                }

                $this.toggleClass("tile");
                $this.toggleClass("tile-open");

                var image = $this.find("img");
                image.removeClass(function (index, css) {
                    var elem = $(this);
                    $(css.split(' ')).each(function () {
                        var c = this.trim();
                        if (this.indexOf("width") == 0) {
                            image.attr('prevWidthClass', c);
                            elem.removeClass(c);
                        }
                    });
                });
                var inner = $this.find(".inner-tile");
                inner.css({
                    "max-height": $('#booksContainer').height() - 50 + "px",
                });

                inner.toggleClass("inner-tile");
                inner.toggleClass("inner-tile-open");
                

               
                var vertText = $this.find(".vertical-text");
                vertText.toggleClass("vertical-text");
                vertText.toggleClass("vertical-text-open");

                
           
                $container.isotope('reLayout');
                var details = $this.find(".details");
                details.slideToggle(150);
                setTimeout(function () {
                    $container.isotope('reLayout');
                }, 200);
                //details.animate({ width: '500px' }, 200, 'easeOutQuint');
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
