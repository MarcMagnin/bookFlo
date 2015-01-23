app.controller("tileDetailController", ['$scope', '$rootScope', '$http', '$timeout', '$upload', function ($scope, $rootScope, $http, $timeout, $upload) {

    var deleteImage = function (url) {
        // delete prev image if overridden
        if (url) {
            $http({
                method: 'DELETE',
                url: url
            }).
          success(function (data, status, headers, config) {
          }).
          error(function (data, status, headers, config) {
          });
        }
    }
    $scope.clearDescription= function (item) {
        item.Description = null;
        $scope.saveItem(item);
    }
    $scope.clearTitle = function (item) {
        item.Title= null;
        $scope.saveItem(item);
    }

    $scope.deleteDetail = function ($index, item) {
        if (item.Details[$index].type && item.Details[$index].type == "image") {
            // remove the image
            deleteImage(item.Details[$index].value);
        }
        
        item.Details.splice($index, 1);
        $scope.saveItem(item);
        
    }



    $scope.onAddImage = function ($files, item, fieldName, itemDetail) {
        // delete prev image if overridden
        deleteImage(itemDetail[fieldName]);


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
                var imageName = $scope.selectedFiles[i].name;
                var imageType = $scope.selectedFiles[i].type;
                var imageRelativeUrl = 'static/' + item.Id + '/details/' + imageName;
                var uploadUrl = $rootScope.apiRootUrl + "/" + imageRelativeUrl;
                
                $scope.startUpload(i, item, itemDetail, imageType, uploadUrl,imageRelativeUrl, fieldName);
            }
        }
    }

    $scope.startUpload = function (index, item, itemDetail, imageType, uploadUrl, imageRelativeUrl, fieldName) {
        $scope.progress[index] = 0;
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
                $scope.upload[index] =
                    $upload.http({
                        url: uploadUrl,
                        method: "PUT",
                        headers: { 'Content-Type': imageType },
                        data: e.target.result
                    }).progress(function (evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function (data) {

                        //$scope.uploadResult.push(data);
                        // Save the item
                        itemDetail[fieldName] = imageRelativeUrl;
                        $scope.$parent.saveItem(item);

                    }).error(function (data) {
                        //error
                    });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        
    };


}]);