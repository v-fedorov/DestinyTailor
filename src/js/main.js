(function() {
    var app = angular.module('destinyTailorApp', []);

    app.controller('SearchCtrl', function ($scope, $http) {
        $scope.searchCriteria = 'GeekyEggo';

        $scope.search = function() {
            // format, /api/{membershipType}/{displayName}
            var path = "/api/" + ($('#platform')[0].checked ? 2 : 1) + '/' + encodeURIComponent($scope.searchCriteria) + '/';
            $http.get(path).then(function(result) {
                console.log(result.data);
            }, function(err) {
                console.log(err);
            });
        };
    });
})();