chatapp.controller('AddMembersController',['$scope','$http','$location','$window','FirebaseChannelService',AddMembersController]);

    function AddMembersController($scope,$http,$location,$window,FirebaseChannelService)
    {

        $scope.filterinviteusers=[];
        $scope.selectedUser=[];
        $scope.addmemberCollection=$scope.denUserCollection;
        $scope.defaultmembers=[];
        $scope.newmemberList=[];
        $scope.selectedaddmembers=[];
        $scope.selectedgroupId="";
         $scope.updateGroup=function(groupID) {
            $scope.defaultmembers=[];
            $scope.selectedgroupId=groupID;
            FirebaseChannelService.getSpecificGroup(groupID).$loaded().then(function (data) {

                angular.forEach(data.groupmembers,function(member){
                    $scope.defaultmembers.push(member);
                })

            });
        }

        function isValid(user)
        {
            var isValid=true;
            $.each($scope.defaultmembers, function(i){
                if($scope.defaultmembers[i]=== user.uid) {
                    isValid= false;
                }

                });
            return isValid;
        }
$scope.fillmemberTextbox=function(userdata,index){
			    $scope.selectedaddmembers.push(userdata)
                $scope.filteradduser=[];
			    $scope.addmembers="";
		    };

        $scope.addmemberchanges=function(invitename)
        {
            var output=[];
                var outputkey=[];
                angular.forEach($scope.denUserCollection,function(user,index){
                    if(user.name.toLowerCase().indexOf(invitename.toLowerCase())>=0 && isValid(user)){
                        output.push(user);
                    }
		    	});
                $scope.filteradduser=output;
        }

        $scope.removememeber=function(key)
            {
                $.each($scope.selectedaddmembers, function(i){
                if($scope.selectedaddmembers[i]!=undefined&&$scope.selectedaddmembers[i].uid === key) {
                    $scope.selectedaddmembers.splice(i,1);
                }
                });

            }

        $scope.selectUser=function(userdata)
        {
            $scope.sendinvites=userdata.name;
            $scope.filteradduser=[];
            $scope.selectedUser=userdata;
        }

        $scope.addmemberstogroup=function()
        {
            $scope.newmemberList=[];
            console.log($scope.selectedaddmembers)
            if($scope.selectedgroupId!=undefined&&$scope.selectedgroupId!=""&&$scope.selectedaddmembers.length!=0) {
                angular.forEach($scope.selectedaddmembers, function (value) {
                    if ($scope.newmemberList.indexOf(value.uid) == -1)
                        $scope.newmemberList.push(value.uid)
                });
                angular.forEach($scope.defaultmembers, function (member) {
                    $scope.newmemberList.push(member);
                });


                FirebaseChannelService.addMembersToChannel($scope.selectedgroupId, $scope.newmemberList);
                $scope.filteradduser = [];
                $scope.addmembers = "";
                $.notify('You have successfully added member !', {
                    position: 'right bottom',
                    hideDuration: '10',
                    showAnimation: 'fadeIn',
                    hideAnimation: 'fadeOut',
                    className: 'success'
                });
                $window.location.href = "#!/Channels/" + $scope.selectedgroupId
            }
            else
            {
                 $.notify('Please check the inputs !', {
                    position: 'right bottom',
                    hideDuration: '10',
                    showAnimation: 'fadeIn',
                    hideAnimation: 'fadeOut',
                    className: 'danger'
                });
            }
        }

        $scope.chatConnect=function()
        {

        }

    }
