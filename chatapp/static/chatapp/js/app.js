 var chatapp=angular.module('chatapp',['ngRoute','firebase'])
     .config(function($routeProvider, $locationProvider)
    { $locationProvider.hashPrefix('!');
          $routeProvider.when('/login',{
              templateUrl:'/static/chatapp/html/chat.html',
              controller:'HomeController'
          });
          $routeProvider.when('/home',{
              templateUrl:'/static/chatapp/html/home.html',
              controller:'HomeController'
          });
           $routeProvider.when('/Channels/:channelID', {
            templateUrl: '/static/chatapp/html/chat.html',
            controller: 'ChatController'
        });
           $routeProvider.when('/allthread', {
            templateUrl: '/static/chatapp/html/allthreads.html',
            controller: 'ThreadController'
        });
           $routeProvider.when('/DM/:channelID', {
            templateUrl: '/static/chatapp/html/directmessage.html',
            controller: 'DirectMessageController'
        });
           $routeProvider.when('/create',{
              templateUrl:'/static/chatapp/html/creategroup.html',
              controller:'CreateGroupController'
          });
           $routeProvider.when('/add',{
              templateUrl:'/static/chatapp/html/addmembers.html',
              controller:'AddMembersController'
          });
            $routeProvider.when('/search',{
              templateUrl:'/static/chatapp/html/searchmembers.html',
              controller:'SearchMembersController'
          });
          $routeProvider.when('/chat',{
              templateUrl:'/static/chatapp/html/chat.html',
              controller:'HomeController'
          });
        $routeProvider.otherwise({redirectTo: '/'});
    }).run(['$http',run]);
function run($http) {
 $http.defaults.xsrfCookieName = 'csrftoken';
            $http.defaults.xsrfHeaderName = 'X-CSRFToken';
}