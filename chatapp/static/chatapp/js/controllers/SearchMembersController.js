chatapp.controller('SearchMembersController',['$scope','$http','$location','$window','FirebaseChannelService',SearchMembersController]);

    function SearchMembersController($scope,$http,$location,$window,FirebaseChannelService)
    {

        $scope.filterinviteusers=[];
        $scope.selectedUser=[];
        $scope.invitechange=function(invitename)
        {
            var output=[];
            $scope.selectedUser=[];
                var outputkey=[];
                angular.forEach($scope.denUserCollection,function(user,index){
                    if(user.name.toLowerCase().indexOf(invitename.toLowerCase())>=0){
                        output.push(user);
                    }
		    	});
                $scope.filterinviteusers=output;
        }

        $scope.selectUser=function(userdata)
        {
            $scope.sendinvites=userdata.name;
            $scope.filterinviteusers=[];
            $scope.selectedUser=userdata;
        }

        $scope.chatConnect=function()
        {
            if($scope.selectedUser.uid!=undefined) {
                $window.location.href = "#!/DM/" + $scope.currentUID + '@' + $scope.selectedUser.uid;
            }
            else
            {
                $.notify('Please select a user to chat with !', {
                    position: 'right bottom',
                    hideDuration: '10',
                    showAnimation: 'fadeIn',
                    hideAnimation: 'fadeOut',
                    className: 'danger'
                });
            }
        }

    }
