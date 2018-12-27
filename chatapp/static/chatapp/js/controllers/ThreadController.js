chatapp.controller('ThreadController',['$scope','$http','$location','$window','FirebaseChannelService',ThreadController]);

    function ThreadController($scope,$http,$location,$window,FirebaseChannelService)
    {
        reloadThreads();

        function reloadThreads()
        {
            $scope.customThread=[];

        $scope.replyCustomThread=[];


        $scope.allThreadCollections=FirebaseChannelService.getallthreads();

        $scope.groupandThreadCollections=[];

        $scope.allThreadCollections.$loaded().then(function(data)
        {

            angular.forEach($scope.allThreadCollections,function(threads){

                var uid=threads.$id;

            angular.forEach( $scope.groupCollection,function(group){

$scope.customThread=[];

        $scope.replyCustomThread=[];

                if(group.key===uid)
                {

                    angular.forEach((threads[""+$scope.currentUID]),function(message){

                        $scope.customThread.push(message)

                    });

                    $scope.groupandThreadCollections.push(
                        {
                            'groupname': group.groupname,
                            'groupkey':group.key,
                            'threads':$scope.customThread

                        }
                    )


                }

            })



        });

            console.log($scope.customThread);

        });

        }

        $scope.sendThreadMessage=function(groupindex,threadindex,key,replychatuid)
        {
            if ($('#ThreadMessage'+groupindex+''+threadindex).val().length == 0) return;
            var replyMessage={
                postedby: $scope.currentusercollection.username,
                posteduid:$scope.currentUID,
                message: $('#ThreadMessage'+groupindex+''+threadindex).val(),
                posteddate: Date.now(),
                chatUID:''
            };
            var chatUID=firebase.database().ref('Groups/'+key).child('chatMessages/'+replychatuid).child('replyMessages').push(replyMessage);
            var updateKey={
                chatUID:chatUID.key
              };
            firebase.database().ref('Groups/'+key).child('chatMessages/'+replychatuid).child('replyMessages').child(chatUID.key).update(updateKey);

             angular.forEach($scope.currentGroupMembers,function(data){

                if(data!=$window.localStorage.getItem("madUID")) {
                    FirebaseChatService.pushNotification(data, replyMessage, $scope.chatName,$scope.channelID)
                }

            });
            $('#ThreadMessage'+groupindex+''+threadindex).val('')
            reloadThreads();
        };





    }
