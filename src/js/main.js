(function() {
    var app = angular.module('destinyTailorApp', []);

    app.factory('userService', function() {
        var account = null;
        
        return {
            getAccount: function() {
                return account;
            },
            setAccount: function(val) {
                account = val;
            }
        };
    });
    
    app.controller('searchController', ['$scope', '$http', 'userService', function ($scope, $http, userService) {
        var $platform = $('#platform');
        $scope.error = '';
        
        $scope.search = function() {
            var path = "/api/" + ($platform[0].checked ? 2 : 1) + '/' + encodeURIComponent($scope.name) + '/';
            $scope.isLoading = true;
            
            $http.get(path).then(function(result) {
                $scope.isLoading = false;
                userService.setAccount(result.data);
                
                if (result.data === null) {
                    $scope.error = 'Unable to find character.';
                };
            }, function(err) {
                console.log(err);
                $scope.error = err.statusText;
            });
        };
    }]);
})(); 
