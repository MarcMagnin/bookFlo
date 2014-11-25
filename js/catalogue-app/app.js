var app = angular.module('BookFlo', ['angularFileUpload']);
var prev;

var $container = $('.tilesContainer');

app.directive('tags', function ($http, $rootScope) {
    return {
        restrict: 'E',
        scope: { item: '='},
        template:
            '<div class="tags">' +
                '<a ng-repeat="(idx, tag) in item.Tags" class="tag" ng-click="remove(idx)">{{tag}}</a>' +
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
            

            elm.find("a").click(function () {
                var selector = $(this).attr('data-filter');
                $container.isotope({ filter: selector });
                //setTimeout(function () {
                //    var hiddenItems = $('.isotope-hidden');
                //}, 300);
            });

            //// TILE CLICK
            elm.click(function () {
                var $this = $(this);
                //$container.isotope('layout');
                // filters
              
                if (prev) {
                    //prev.find(".tileTextArea").slideToggle(0);
                    //$container.isotope('reLayout');
                    
                        prev.find(".details").slideToggle(200);
                        var image = prev.find("img");
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
               

                var details = $this.find(".details");
                            
                //$this.find("img").toggleClass("smallHeightImage");
                var image = $this.find("img");
                if (image.height() > 380) {
                    image.attr('prevHeight', image.height());
                    $this.find("img").animate({ "height": "380px" }, 300, 'easeOutCubic');
                }
                $this.css({
                    "max-height": $('#booksContainer').height() + "px",
                });
                $container.isotope('reLayout');
                details.slideToggle(200).after(function () {
                    $container.isotope('reLayout');
                });
                details.animate({ width: '500px' }, 200, 'easeOutQuint');
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
