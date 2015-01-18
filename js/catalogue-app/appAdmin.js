﻿var app = angular.module('BookFlo', ['angularFileUpload']);
var prev;
var $container = $('.tilesContainer');

app.directive('tags', function ($http, $rootScope) {
    return {
        restrict: 'E',
        scope: { item: '=' },
        template:

             '<input type="text" ' +
                'ng-model="new_value"  ' +
                'placeholder="Tags..." ' +
                'typeahead="tags.Name for tags in getTags($viewValue) | filter:$viewValue" ' +
                'typeahead-loading="loading" ' +
                'class="form-control"></input>' +
                '<i ng-show="loading" class="glyphicon glyphicon-refresh"></i> '+
            '<div class="tags">' +
                '<button class="btn btn-lg btn-info tag" ng-repeat="(idx, tag) in item.Tags" ng-click="remove(idx)">{{tag}}</button>' +
            '</div>' ,
            //'<a class="btn" ng-click="add()">Add</a>',
        link: function ($scope, $element) {
            // FIXME: this is lazy and error-prone
            var input = angular.element($element.children()[0]);
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

            var img = elm.find(".tileHeroImage");
          
            // insert before to set up the Index scope during isotope getSortData()
            $container.isotope('insert', elm);
            img.load(function () {
                $container.isotope({ sortBy: 'weight' });
             //   $container.isotope('prepend', elm);
                //$container.isotope({ sortBy: 'weight' });
                // give the time for angular to evaluate the {{item.Index}} for the sortBy
                //  $container.isotope('insert', elm);
                $container.isotope('reLayout');
                $container.isotope({ sortBy: 'original-order' });
            });

            // handle the mousewheel on tiles
            elm.bind('mousewheel', function (event, delta, deltaX, deltaY) {
                var openTile = elm.find(".inner-tile-open");
                if (openTile.hasVerticalScrollBar()) {
                    //openTile.stop().animate({ scrollTop: '-=' + (500 * deltaX) + 'px' }, 400, 'easeOutQuint');

                    openTile.stop().animate({ scrollTop: '-=' + (200 * event.deltaY) + 'px' }, 50, 'easeOutQuint');
                    //openTile.scrollTop(openTile.scrollTop()-(event.deltaY*20));
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
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

                if (prev) {
                    //prev.find(".tileTextArea").slideToggle(0);
                    $container.isotope('reLayout');

                    prev.find(".hidden-object").hide();
                    var inner = prev.find(".inner-tile-open")

                    inner.toggleClass("inner-tile");
                    inner.toggleClass("inner-tile-open");
                    var image = prev.find("img");
                    image.addClass(image.attr('prevWidthClass'));
                    image.toggleClass("full-width");
                    if (image.attr('prevHeight')) {
                        image.animate({ "height": image.attr('prevHeight') + "px" }, 300, 'easeOutCubic');
                    }
                    // prev.find("img").animate({ "height": "100%" }, 300, 'easeOutCubic');
                    //prev.find("img").toggleClass("smallHeightImage");
                    if (prev.is($this)) {
                        $container.isotope('reLayout');
                        prev = null;
                        return;
                    }

                }



                //$this.find("img").toggleClass("smallHeightImage");

                //if (image.height() > 380) {
                //    image.attr('prevHeight', image.height());
                //    $this.find("img").animate({ "height": "380px" }, 300, 'easeOutCubic');
                //}
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
                image.toggleClass("full-width");
                

                //var image = $this.find("img"); ("div:regex(class, .*sd.*)")
                //image.attr('prevWidth', image.width());
                // image.animate({ "width": "auto" }, 300, 'easeOutCubic');
                var inner = $this.find(".inner-tile");
                inner.toggleClass("inner-tile");
                inner.toggleClass("inner-tile-open");
                inner.css({
                    "max-height": $('#booksContainer').height() - 210 + "px",
                });
                
                var details = $this.find(".hidden-object");
                details.show();
                $container.isotope('reLayout');
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
