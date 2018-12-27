chatapp.controller('ChatController',['$scope','$http','$location','$window','$routeParams','FirebaseChannelService','FirebaseChatService','$rootScope','$firebaseObject',ChatController]);

    function ChatController($scope,$http,$location,$window,$routeParams,FirebaseChannelService,FirebaseChatService,$rootScope,$firebaseObject) {
        $('#preload').show();
         var loadRoomInfo=FirebaseChatService.getSpecificChannel($routeParams.channelID);
         var isOwner=false;
         var chatFirstTime=true;
         $scope.channelID=$routeParams.channelID;
         $scope.currentOnlineUID=$scope.channelID;
         $scope.customMessage=[]
        $scope.currentGroupMembers=[]
        $scope.showDialog=function(index)
        {
            $('#replyMessage'+index).val('')
            $('#replyTo'+index).show();
        }
        $scope.closeDialog=function(index)
        {
            $('#replyTo'+index).hide();
        }
        loadRoomInfo.$loaded().then(function(data) {
          $scope.roomInfo=data;
            $scope.chatName=data.groupname;
            $scope.currentGroupMembers=data.groupmembers;
          console.log($scope.roomInfo)
            loader();
        });




       // $scope.chatMessages =FirebaseChatService.getSpecificChannel($routeParams.channelID);
        $scope.chatMessages=$firebaseObject(firebase.database().ref('Groups/'+$scope.channelID).child('chatMessages'));
        $scope.chatMessages.$watch(function() {

            $scope.chatMessages.$loaded().then(function () {

                firebase.database().ref('Threads/'+$scope.channelID).remove();
                 $scope.customMessage=[];
                 $scope.hasThreads=false;
            var customIndex=[];
            var isReplyOwner=false;
            $scope.customReplyMessage=[];
            var chatMessageCount=0;
            $scope.hasThreadIndex=0;
                angular.forEach($scope.chatMessages, function (value) {
                    isOwner = false;
                    if(value.posteduid == undefined) return;
                    if (value.posteduid === $scope.currentUID)
                        isOwner = true
                    $scope.threadMessages=[];
                    $scope.hasThreads=false;
                    $scope.customReplyMessage=[];
                    $scope.threadUIDs=[];
                    $scope.threadUIDs.push($scope.currentUID);
                    angular.forEach(value.replyMessages,function(reply)
                    {

                        var isTrue=true;
                        angular.forEach($scope.threadUIDs,function(threaduid){

                            if(threaduid==reply.posteduid)
                            {
                                isTrue=false;
                            }

                        });
                        if(isTrue) {
                            $scope.threadUIDs.push(reply.posteduid)
                        }
                        $scope.hasThreads=true;
                        $scope.hasThreadIndex=chatMessageCount;
                        isReplyOwner=false;
                         if (reply.posteduid === $scope.currentUID)
                            isReplyOwner = true
                       $scope.customReplyMessage.push({
                           'isOwner': isReplyOwner,
                        'message': reply.message,
                        'sendername': reply.postedby,
                        'senderUID':reply.posteduid,
                        'currentUID':$scope.currentUID,
                        'chatUID': reply.chatUID ? reply.chatUID:"",
                        'date': moment(reply.posteddate).fromNow()

                       })
                    });
                    var hasreplymessages=false;
                    if($scope.customReplyMessage.length!=0)
                        hasreplymessages=true;
                    $scope.customMessage.push({
                        'isOwner': isOwner,
                        'message': value.message,
                        'sendername': value.postedby,
                        'senderUID':value.posteduid,
                        'currentUID':$scope.currentUID,
                        'chatUID': value.chatUID ? value.chatUID:"",
                        'date': moment(value.posteddate).fromNow(),
                        'hasReplyMessages':hasreplymessages,
                        'replyMessages':$scope.customReplyMessage
                    });

                    if($scope.hasThreads)
                {

                    angular.forEach($scope.threadUIDs,function(threaduids){

                        firebase.database().ref('Threads/'+$scope.channelID).child(threaduids).push({'isOwner': isOwner,
                        'message': value.message,
                        'sendername': value.postedby,
                        'senderUID':value.posteduid,
                        'currentUID':$scope.currentUID,
                        'chatUID': value.chatUID ? value.chatUID:"",
                        'date': moment(value.posteddate).fromNow(),
                        'replyMessages':$scope.customReplyMessage})


                    });

                }
chatMessageCount++;
                });

                setTimeout(function(){
                    $('[id^="replyTo"]').hide()
                },500)
            });
        });

        $scope.sendMessage=function () {
            if ($scope.message.length == 0) return;
            var Message={
                postedby: $scope.currentusercollection.username,
                posteduid:$scope.currentUID,
                message: $scope.message,
                posteddate: Date.now(),
                chatUID:''
            };
            var chatUID=firebase.database().ref('Groups/'+$scope.channelID).child('chatMessages').push(Message);
            var updateKey={
                chatUID:chatUID.key
              };
            firebase.database().ref('Groups/'+$scope.channelID).child('chatMessages').child(chatUID.key).update(updateKey);

            angular.forEach($scope.currentGroupMembers,function(data){

                if(data!=$window.localStorage.getItem("madUID")) {
                    FirebaseChatService.pushNotification(data, Message, $scope.chatName,$scope.channelID);
                }
            });


            $scope.message = '';
              setTimeout(function(){
                    $('[id^="replyTo"]').hide()
                },500)
        };
         $scope.sendReplyMessage=function (replychatuid,index) {
            if ($('#replyMessage'+index).val().length == 0) return;
            var replyMessage={
                postedby: $scope.currentusercollection.username,
                posteduid:$scope.currentUID,
                message: $('#replyMessage'+index).val(),
                posteddate: Date.now(),
                chatUID:''
            };
            var chatUID=firebase.database().ref('Groups/'+$scope.channelID).child('chatMessages/'+replychatuid).child('replyMessages').push(replyMessage);
            var updateKey={
                chatUID:chatUID.key
              };
            firebase.database().ref('Groups/'+$scope.channelID).child('chatMessages/'+replychatuid).child('replyMessages').child(chatUID.key).update(updateKey);

             angular.forEach($scope.currentGroupMembers,function(data){

                if(data!=$window.localStorage.getItem("madUID")) {
                    FirebaseChatService.pushNotification(data, replyMessage, $scope.chatName,$scope.channelID)
                }

            });
            $('#replyMessage'+index).val('');
            $('#replyTo'+index).hide();
        };
    }
