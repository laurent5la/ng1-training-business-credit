var app = angular.module('myApp', ['ui.bootstrap', 'ui.router']);
  app.config(function($stateProvider, $urlRouterProvider)
  {
     $stateProvider
          .state("tab1", {
              url: "/tab1",
              templateUrl: 'partials/phone-list.html'
          })

          .state('tab1.list', {
              url: '/list',
              templateUrl: 'partials/partial-phone-list.html',
              controller: function($scope) {
                  $scope.dogs = ['iPhone 5', 'iPhone 5s', 'iPhone 6s'];
              }
          })

          .state('tab1.paragraph', {
              url: '/paragraph',
              template: 'Inline text'
          })

          .state("tab2", {
              url: "/tab2",
              template: '<h1>Tab 2 Content</h1>'
          })
           .state("tab3", {
              url: "/tab3",
              template: '<h1>Tab 3 Content</h1>'
          })

  })
app.controller('myCtrl', function($scope, $http, $filter, $window, $state){

    $scope.fetch = function() {
    $scope.responseData = null;
    var sortingOrder = 'name';
    $scope.sortingOrder = sortingOrder;
    $scope.reverse = false;
    var data_array = [];
    var address_url = "http://api.local/address_api.php";
    data_array.push({"business_name": $scope.businessName, "address": $scope.address, "state": $scope.state});
    var data = angular.toJson(data_array);
    if(typeof($scope.businessName)!=='undefined' && typeof($scope.address)!=='undefined' && typeof($scope.state)!=='undefined'){
      if($scope.businessName.length > 3 && $scope.address.length > 3 && $scope.state.length > 1){
         $http({method: "POST", url:address_url, data, headers : {
                  'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
              }}).then(function(response) {
            $scope.responseData = response.data.response.results;
            if ($scope.sortingOrder !== '') {
              $scope.responseData = $filter('orderBy')($scope.responseData, $scope.sortingOrder, $scope.reverse);
            }
          }, function(response) {
            $scope.responseData = response.data || "Request failed";
        });
      }
    }
  };


  $scope.sort_by = function(newSortingOrder) {
    if ($scope.sortingOrder == newSortingOrder)
      $scope.reverse = !$scope.reverse;

    $scope.sortingOrder = newSortingOrder;
  };

   // $http.get("http://localhost:8888/address_api.php").then(function(response) {
   // // $http.get("http://localhost:8000/app/address.json").then(function(response) {
   //      //$scope.responseData = response.data.response.results;
   //      $scope.responseData = response.data;
   //  });
});

angular.module('myApp').filter('addressFilter', function() {
      return function(input, field, address1) {
        var pattern = new RegExp(address1);
        var output = [];
        if(input === undefined) {
            return output;
        }

        for (var i = 0; i < input.length; i++){
            if(pattern.test(input[i][field]))
              output.push(input[i]);
        }
      return output;
    };
  });


  // angular.module('myApp')

  //   .filter('addressFilter', function() {
  //       return function(array, search) {
  //           var matches = [];
  //           for(var i = 0; i < array.length; i++) {
  //               if (array[i].indexOf(search) === 0 &&
  //                   search.length < array[i].length) {
  //                   matches.push(array[i]);
  //               }
  //           }
  //           return matches;
  //       };
  //   });
