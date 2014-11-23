
var Item = function () {
    this.Title= "";
    this.Images = [];
};
var Attachment = function () {
    this.Nom = "";
    this.Id = "";
    this.Description = "";
    this.Tags = [];
};
var Tag = function () {
    this.Name = "";
};


var Image = function () {
    this.Url = "";
    this.Id = "";
    this.Description = "";
    this.Tags = [];
};

var Update = function () {
    this.Type = "";
    this.Name = "";
    // this.Value = "";
};


app.controller("mainController", ['$scope', '$rootScope', '$http', '$timeout', '$upload', function ($scope,$rootScope, $http, $timeout, $upload) {
   
    $scope.searchWord = "";
    //$rootScope.apiRootUrl = "http://82.226.165.21:8081/databases/BookFlo";
    $rootScope.apiRootUrl = "http://localhost:8085/databases/BookFlo";
    $scope.items = [];
    $scope.tags = [];

    //$http({ method: 'GET', url: $rootScope.apiRootUrl + 'indexes/dynamic/Illustrateur?include=Illustrations.,Id&pageSize=30&noCache=101515793' }).
    $scope.init = function () {
        $http({ method: 'GET', url: $rootScope.apiRootUrl + '/indexes/Items?pageSize=30&sort=-LastModified&noCache=1015157938' }).
            success(function (data, status, headers, config) {
                angular.forEach(data.Results, function (item, index) {
                    item.editing = false;
                    if (item.Images) {
                    //    item.Images = new Array(item.ImagesIllustrations);
                    }
                    item.Id = item['@metadata']['@id'];
                    $scope.items.push(item);
                    
                });
                

            }).
            error(function (data, status, headers, config) {
                console.log(data);
            });

        // Load tags
        $http({ method: 'GET', url: $rootScope.apiRootUrl + '/indexes/Tags?pageSize=30&sort=Name&noCache=1015157938' }).
            success(function (data, status, headers, config) {
                angular.forEach(data.Results, function (item, index) {
                    $scope.tags.push(item);
                });


            }).
            error(function (data, status, headers, config) {
                console.log(data);
            });

    };

    $scope.filter = function (tag) {
        if (tag == '*' || '') {
            $container.isotope({ filter: '*', filterContains: null });
        } else {
            $container.isotope({ filterContains: tag });
        }
        return false;
    }

    $scope.search = function () {
        $http({ method: 'GET', url: $rootScope.apiRootUrl + '/indexes/dynamic/Illustrateur?&query=Nom:' + $scope.searchWord + '* OR  Prenom:' + $scope.searchWord + '* OR  Tags:' + $scope.searchWord + '* OR  Illustrations,Tags:' + $scope.searchWord + '*&pageSize=30&noCache=101515793' }).
        success(function (data, status, headers, config) {
            $scope.illustrateurs.splice(0);
            angular.forEach(data.Results, function (illustrateur, index) {
                $scope.illustrateurs.push(illustrateur);
                
            });
        }).
        error(function (data, status, headers, config) {

        });
    };

    $scope.loadingSearchSuggestions = false;
    $scope.getSearchSuggestions = function (value) {
        $scope.loadingSearchSuggestions = true;
        return $http.get('http://localhost:8081/databases/Illustrateurs/indexes/SearchSuggestions', {
            params: {
                query: "Name:" + value + "*",
                pageSize: 10
            }
        }).then(function (res) {
            $scope.loadingSearchSuggestions = false;
            //var tags = [];
            //angular.forEach(res.data.Results, function (item) {
            //    tags.push(item.Name);
            //});
            return res.data.Results;
        });
    };

    $scope.updateIllustrateur = function (illustrateur) {
        $http({
            method: 'PUT',
            headers: { 'Raven-Entity-Name': 'Illustrateur' },
            url: 'http://localhost:8081/databases/Illustrateurs/docs/' + illustrateur.Id,
            data: angular.toJson(illustrateur)
        }).
        success(function (data, status, headers, config) {
        }).
        error(function (data, status, headers, config) {

        });
    };

    //http://localhost:8080/indexes/dynamic?query=Category:Ravens

    $scope.addHeader = function ($index, item) {
        if (!item.Details)
            item.Details = new Array();
        item.Details.push({
            value: "Title",
            type: "title"
        })
        $http({
            method: 'PUT',
            headers: { 'Raven-Entity-Name': 'Item' },
            url: $rootScope.apiRootUrl + '/docs/' + item.Id,
            data: angular.toJson(item)
        }).
        success(function (data, status, headers, config) {

        }).
        error(function (data, status, headers, config) {

        });
    }



    $scope.addImage = function ($index, item) {
        if (!item.Details)
            item.Details = new Array();
        item.Details.push({
            value: "",
            type: "image"
        })
        $http({
            method: 'PUT',
            headers: { 'Raven-Entity-Name': 'Item' },
            url: $rootScope.apiRootUrl + '/docs/' + item.Id,
            data: angular.toJson(item)
        }).
            success(function (data, status, headers, config) {

            }).
            error(function (data, status, headers, config) {

            });
    }

        $scope.addText = function ($index, item) {
            if(!item.Details) 
                item.Details = new Array();
            item.Details.push({
                value : "test text",
                type : "text"
            })
        $http({
            method: 'PUT',
            headers: { 'Raven-Entity-Name': 'Item' },
            url: $rootScope.apiRootUrl + '/docs/'+item.Id,
            data: angular.toJson(item)
        }).
            success(function (data, status, headers, config) {

            }).
            error(function (data, status, headers, config) {

            });
        }

    $scope.saveItem = function (item) {
        $http({
            method: 'PUT',
            headers: { 'Raven-Entity-Name': 'Item' },
            url: $rootScope.apiRootUrl + '/docs/' + item.Id,
            data: angular.toJson(item)
        }).
        success(function (data, status, headers, config) {

        }).
        error(function (data, status, headers, config) {

        });
    }

 

    $scope.deleteItem = function ($index, item) {
        
        $http({
            method: 'DELETE',
            url: $rootScope.apiRootUrl +'/'+ item.Images[0].Url
        }).
          success(function (data, status, headers, config) {
          }).
          error(function (data, status, headers, config) {

          });

        $http({
            method: 'DELETE',
           headers: { 'Raven-Entity-Name': 'Item' },
            url: $rootScope.apiRootUrl + '/docs/' + item.Id,
        }).
          success(function (data, status, headers, config) {
              $scope.items.splice($index, 1);
          }).
          error(function (data, status, headers, config) {

          });

    }

    // ajout d'un nouvel d'illustrateur
    $scope.addItem = function (callback) {
        var item = new Item;
        item.Title = "";
        item.Width = "1";
        item.Height = "1";
        item.Modified = new Date().toISOString();
        $http({
            method: 'PUT',
            headers: { 'Raven-Entity-Name': 'Item' },
            url: $rootScope.apiRootUrl + '/docs/Item%2F',
            data: angular.toJson(item)
        }).
            success(function (data, status, headers, config) {
                item.Id = data.Key;
                $scope.items.unshift(item);
                callback(item);
            }).
            error(function (data, status, headers, config) {
                console.log(data);
            });
    };

    // ajout d'image sans illustrateur
    $scope.onAddImage = function ($files) {

        $scope.uploadRightAway = true;
        $scope.selectedFiles = [];
        $scope.progress = [];
        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }
        $scope.upload = [];
        $scope.uploadResult = [];
        $scope.selectedFiles = $files;
        $scope.dataUrls = [];
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if (window.FileReader && $file.type.indexOf('image') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($files[i]);

                function setPreview(fileReader, index) {
                    fileReader.onload = function (e) {
                        $timeout(function () {
                            $scope.dataUrls[index] = e.target.result;
                        });
                    };
                }

                setPreview(fileReader, i);
            }
            $scope.progress[i] = -1;
            if ($scope.uploadRightAway) {
                $scope.startUpload(i);
            }
        }
    };


    // ajout d'image sans illustrateur
    $scope.onFileSelect = function ($files) {

        $scope.uploadRightAway = true;
        $scope.selectedFiles = [];
        $scope.progress = [];
        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }
        $scope.upload = [];
        $scope.uploadResult = [];
        $scope.selectedFiles = $files;
        $scope.dataUrls = [];
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if (window.FileReader && $file.type.indexOf('image') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($files[i]);

                function setPreview(fileReader, index) {
                    fileReader.onload = function (e) {
                        $timeout(function () {
                            $scope.dataUrls[index] = e.target.result;
                        });
                    };
                }

                setPreview(fileReader, i);
            }
            $scope.progress[i] = -1;
            if ($scope.uploadRightAway) {
                $scope.startUpload(i);
            }
        }
    };

    $scope.startUpload = function (index) {
        $scope.progress[index] = 0;
        $scope.addItem(function (item, $index) {
            $scope.url = $rootScope.apiRootUrl + '/static/' + item.Id + '/' + $scope.selectedFiles[index].name;


            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                $scope.upload[index] =
                    $upload.http({
                        url: $scope.url,
                        method: "PUT",
                        headers: { 'Content-Type': $scope.selectedFiles[index].type },
                        data: e.target.result
                    }).progress(function (evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function (data) {


                        //$scope.uploadResult.push(data);
                        // Put somewhere else 
                        $scope.addImageToItem($scope.selectedFiles[index].name, item, $index);



                    }).error(function (data) {
                        //error
                    });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        });
    };

    $scope.addImageToItem = function ($fileName, item, $index) {
        var image= new Image();
        image.Url = 'static/' + item.Id + '/' + $fileName;
        image.Tags = [
        ];

        var update = new Update();
        update.Type = 'Add';
        update.Name = 'Images';
        //       delete illustration.Illustrateur;
        update.Value = image;
        var update2 = new Update();
        update2.Type = 'Set';
        update2.Name = 'Modified';
        //       delete illustration.Illustrateur;
        update2.Value = new Date().toISOString();



        if (!item.Images) {
            item.Images= new Array();
        }

        $http({
            method: 'PATCH',
            headers: { 'Raven-Entity-Name': 'Item' },
            url: $rootScope.apiRootUrl + '/docs/' + item.Id,
            data: angular.toJson(new Array(update, update2))
        }).
            success(function (data, status, headers, config) {
                item.Images.push(image);

                //$scope.update($scope.illustrateurs);
            }).
            error(function (data, status, headers, config) {

            });

        //}).
        //error(function (data, status, headers, config) {

        //});
    };


}]);
