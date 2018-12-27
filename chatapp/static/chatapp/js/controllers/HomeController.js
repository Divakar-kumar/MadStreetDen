chatapp.controller('HomeController',['$scope','$http','$location','$window','$q','FirebaseChannelService','$firebaseObject',HomeController]);

    function HomeController($scope,$http,$location,$window,$q,FirebaseChannelService,$firebaseObject) {
        $scope.isHome=true;
        $scope.userCollection = []
        $scope.keyCollection = []
        $scope.groupCollection = []
        $scope.groupkeyCollection = []
        $scope.DMNameCollection =[]
        $scope.DMKeyCollection=[]
        $scope.hasData=false;
        $scope.currentOnlineUID=""
         $scope.denUserCollection=[];
        $scope.notseenCount=0;
        $('#preload').show();
        var data = {}
        var promises=[];
        $scope.showDetails=function(key) {
            $window.location.href = '#!/Channels/'+key;
        }

        $scope.invitePeople=function()
        {
            if($scope.selectedGroup!=undefined||$scope.selectedGroup!="")
            {

            }
            //alert($scope.selectedGroup)
        }
        $scope.showDMDetails=function(key)
        {
          $window.location.href="#!/DM/"+key;
        }


        var currentuser={'uid':$window.localStorage.getItem("madUID")}
        $scope.currentUID=$window.localStorage.getItem("madUID");

        $scope.notifications=$firebaseObject(firebase.database().ref('Notificatoins/'+$scope.currentUID));

        $scope.notifyDMChanges=$firebaseObject(firebase.database().ref('DM/'));
        $scope.notifyGroupChannelChanges=$firebaseObject(firebase.database().ref('Groups/'));

        $scope.notifyDMChanges.$watch(function(){
            loadallDMGroups();
        })
        $scope.notifyGroupChannelChanges.$watch(function(){
            loadallGroupChannels();
        })

        $scope.clearNotifications=function()
        {
            firebase.database().ref('Notificatoins/'+$scope.currentUID).remove()
        }
        var firstTime=true;
         $scope.notifications.$watch(function(){

             $scope.notifications.$loaded().then(function(){

                 var count=0;

                 $scope.customNotificaitons=[];

                 $scope.notificationCount=0;

                 angular.forEach($scope.notifications,function(notificationValue){

                     $scope.customNotificaitons.push(notificationValue)
                     count++;
                     $scope.notificationCount=count;
                 });

                 var loopindex=0;
                  angular.forEach($scope.customNotificaitons,function (value) {

                      $scope.hasData=true;
                      $scope.customNotificaitons[loopindex].posteddate=moment(value.posteddate).fromNow();
                      loopindex++;

                    });

                  if(!firstTime)
                  {
                      if(loopindex!=0) {
                          $scope.hasData=true;
                          var index=loopindex-1;
                          if($scope.customNotificaitons[index].postedgroup==="DM")
                          {
                              return $.notify(' ' + $scope.customNotificaitons[index].postedby + ' messaged you - ' + $scope.customNotificaitons[index].postedmessage + ' ' + $scope.customNotificaitons[index].posteddate, {
                                  position: 'right bottom',
                                  hideDuration: '50',
                                  showAnimation: 'fadeIn',
                                  hideAnimation: 'fadeOut',
                                  className: 'primary',
                              });

                          }
                          else {
                              return $.notify(' ' + $scope.customNotificaitons[index].postedby + ' posted ' + $scope.customNotificaitons[index].postedmessage + '@ ' + $scope.customNotificaitons[index].postedgroup + ' ' + $scope.customNotificaitons[index].posteddate, {
                                  position: 'right bottom',
                                  hideDuration: '50',
                                  showAnimation: 'fadeIn',
                                  hideAnimation: 'fadeOut',
                                  className: 'primary',
                              });
                          }
                      }
                      else
                      {
                          $scope.hasData=false;
                      }

                  }

                  if(firstTime)
                  {
                      firstTime=false
                  }

             });


         });
        promises.push($http({
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            url: '/chatapp/getallusers/',
            data: JSON.stringify(data)
        }).success(function (response) {
            $scope.userCollection = response.data;
            $scope.keyCollection=response.key;
            console.log('response after getallusers' + response)
        }).error(function () {
            console.log("failed")
        }));
        promises.push(FirebaseChannelService.getalldenusers().$loaded().then(function(data){

            var denuserIds=[];
            $scope.denUserCollection=[];
            angular.forEach(data,function(value){
                $scope.denUserCollection.push({
                    'uid':value.$id,
                    'name':value.username,
                    'email':value.email
                })
            });

        }))

        promises.push($http({
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            url: '/chatapp/getcurrentuser/',
            data: JSON.stringify(currentuser)
        }).success(function (response) {
            $scope.currentusercollection = response.data;
            console.log('response after currentuser' + response)
        }).error(function () {
            console.log("failed")
        }));

        function loadallGroupChannels()
        {
            FirebaseChannelService.getAllGroups().$loaded().then(function(data){
            $scope.groupCollection=[];
            angular.forEach(data,function(value){

                var groupID=value.$id;
                angular.forEach(value.groupmembers,function(members){

                    if(members===$window.localStorage.getItem("madUID"))
                        $scope.groupCollection.push({

                            'groupname':value.groupname,
                            'key':groupID
                        })

                });

            });

        })
        }

        function loadallDMGroups()
        {
            FirebaseChannelService.getAllDMChannel().$loaded().then(function(data){
            $scope.DMNameCollection=[];
            $scope.DMKeyCollection=[];
            var key="";
            angular.forEach(data,function(value){
                key=value.$id;
                var keys=key.split('@');
                var isDM=false;
                angular.forEach(keys,function(keyval){
                    if(keyval==$window.localStorage.getItem("madUID"))
                        isDM=true;
                })
                if(isDM) {
                    angular.forEach(keys, function (keyval) {
                        if (keyval != $window.localStorage.getItem("madUID")) {
                            FirebaseChannelService.getCurrentUser(keyval).$loaded().then(function (currentuser) {
                                $scope.DMNameCollection.push({
                                        'username': currentuser.username,
                                        'key': $window.localStorage.getItem("madUID") + "@" + currentuser.$id
                                    }
                                );
                                $scope.DMKeyCollection.push(key);
                            })
                        }

                    });
                }
            })
        })
        }
        $q.all(promises).then(function(data){
            loader();
        })

    }
