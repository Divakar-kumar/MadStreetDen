chatapp.controller('CreateGroupController',['$scope','$http','$location','$window',CreateGroupController]);

    function CreateGroupController($scope,$http,$location,$window) {

        $scope.groupName = "";
        $scope.membersList = [];
        $scope.nameCollection=[];
        $scope.filteruser=[];
        $scope.selectedusers=[];
        $scope.selecteduid=[]
        $scope.selecteduserids=[];
        $scope.filteruser=[];
        $scope.filterkey=null;
        $scope.currentOnlineUID="";
        var i=0;
        var currentuserdata=$scope.currentusercollection;
         if ($window.localStorage.getItem("madUID") != null && $window.localStorage.getItem("madUID").length != 0) {
             angular.forEach($scope.userCollection,function (user) {
                     if(!(user.email===currentuserdata.email)) {
                         $scope.nameCollection.push(user.username)
                         $scope.selecteduid.push($scope.keyCollection[i])
                     }
                     i++;
             })
              $scope.namechange=function(string){
                var output=[];
                var outputkey=[];
                angular.forEach($scope.denUserCollection,function(user,index){
                    if(user.name.toLowerCase().indexOf(string.toLowerCase())>=0){
                        output.push(user);
                    }
		    	});
	    		$scope.filteruser=output;
    		};
    		$scope.fillTextbox=function(userdata,index){
			    $scope.selectedusers.push(userdata)
                $scope.filteruser=[];
			    $scope.filterkey=null;
			    $scope.invites="";
		    };
    		$scope.remove=function(key)
            {
                $.each($scope.selectedusers, function(i){
                if($scope.selectedusers[i]!=undefined&&$scope.selectedusers[i].uid === key) {
                    $scope.selectedusers.splice(i,1);
                }
                });

            }
             $scope.createGroup = function () {
    		    if($scope.groupName=="")
    		        return $.notify('Please check the inputs !', {
                    position: 'right bottom',
                    hideDuration: '10',
                    showAnimation: 'fadeIn',
                    hideAnimation: 'fadeOut',
                    className: 'danger'
                });
                 $scope.membersList.push($window.localStorage.getItem("madUID"))
                 angular.forEach($scope.selectedusers,function(value){
                    if($scope.membersList.indexOf(value.uid)==-1)
                        $scope.membersList.push(value.uid)
                 });
                 var groupData = {
                     'name': $scope.groupName,
                     'owner':$window.localStorage.getItem("madUID"),
                     'members': $scope.membersList,
                 };

                 $http({
                     method: "POST",
                     headers: {
                         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                     },
                     url: '/chatapp/creategroup/',
                     data: JSON.stringify(groupData)
                 }).success(function (response) {
                      $.notify('You have successfully created ' + $scope.groupName + ' !', {
                         position: 'right bottom',
                         hideDuration: '10',
                         showAnimation: 'fadeIn',
                         hideAnimation: 'fadeOut',
                         className: 'success'
                     });
                     $window.location.href="#!/"
                 }).error(function () {
                     return $.notify('error', {
                         position: 'right bottom',
                         hideDuration: '10',
                         showAnimation: 'fadeIn',
                         hideAnimation: 'fadeOut',
                         className: 'primary'
                     });
                 });
             }

         }
         else
             {

                return $.notify('Not logged in', {
                         position: 'right bottom',
                         hideDuration: '10',
                         showAnimation: 'fadeIn',
                         hideAnimation: 'fadeOut',
                          className: 'danger',
                     });
            }
    }
