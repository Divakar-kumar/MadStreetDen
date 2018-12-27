chatapp.controller('LoginController',['$scope','$http','$location','$window',LoginController]);

    function LoginController($scope,$http,$location,$window)
    {
        $scope.isSignup=true;
        $scope.isLogin=false;
        $scope.signup=function()
        {
            var signupData={
                'username':$scope.username,
                'email':$scope.emailtxt,
                'password':$scope.passwordtxt
            };

            $http.defaults.xsrfCookieName = 'csrftoken';
            $http.defaults.xsrfHeaderName = 'X-CSRFToken';
            $http({
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                url: 'chatapp/signup/',
                data: JSON.stringify(signupData)
                }).success(function (response) {
                    $window.localStorage.setItem("madUID",response);
                    $window.location.href="/home/"
                console.log(response.result);

                }).error(function () {
                     return $.notify('Please check the email/password', {
                         position: 'right bottom',
                         hideDuration: '10',
                         showAnimation: 'fadeIn',
                         hideAnimation: 'fadeOut',
                          className: 'danger',
                     });
                console.log("failed")
                });

        };

        $scope.login=function()
        {
            var loginData={
                'email':$scope.email,
                'password':$scope.password
            };

            $http.defaults.xsrfCookieName = 'csrftoken';
            $http.defaults.xsrfHeaderName = 'X-CSRFToken';
            $http({
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                url: '/chatapp/login/',
                data: JSON.stringify(loginData)
                }).success(function (response) {
                    console.log('response after login'+response)
                    $window.localStorage.setItem("madUID",response);
                    $window.location.href="/home/"
                }).error(function () {
                console.log("failed")
                 return $.notify('Check username/password & retry', {
                         position: 'right bottom',
                         hideDuration: '10',
                         showAnimation: 'fadeIn',
                         hideAnimation: 'fadeOut',
                          className: 'danger',
                     });
                });

        }


        $scope.gotoSignup=function()
        {
            $scope.isSignup=true;
        $scope.isLogin=false;

        };

        $scope.gotoLogin=function()
        {
            $scope.isLogin=true;
            $scope.isSignup=false;
        };


    }
