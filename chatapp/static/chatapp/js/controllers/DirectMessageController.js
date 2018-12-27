chatapp.controller('DirectMessageController',['$scope','$http','$location','$window','$routeParams','FirebaseChannelService','FirebaseChatService','$rootScope','$firebaseObject',DirectMessageController]);

    function DirectMessageController($scope,$http,$location,$window,$routeParams,FirebaseChannelService,FirebaseChatService,$rootScope,$firebaseObject) {
        $('#preload').show();
         var loadRoomInfo=FirebaseChannelService.getDMSpecificChannel($routeParams.channelID);
         var isOwner=false;
         var uids=[];
         $scope.DMchannelID=$routeParams.channelID;
         $scope.currentOnlineUID=$scope.DMchannelID;
         uids=$scope.DMchannelID.split('@');
         $scope.currentGroupMembers=[];
         if(uids[0]===uids[1]) {
                $.notify('Cannot chat with yourself!', {
                    position: 'right bottom',
                    hideDuration: '10',
                    showAnimation: 'fadeIn',
                    hideAnimation: 'fadeOut',
                    className: 'danger',
                });
                $window.location.href = "#!/search/";
            }
if(uids.length>0) {
    $scope.currentGroupMembers.push(uids[0]);
    $scope.currentGroupMembers.push(uids[1]);
}
         $scope.DMcustomMessage=[]
        $scope.chatName=""
        loadRoomInfo.$loaded().then(function(data) {
            if(data.chatMessages==undefined) {
                if(uids.length>0) {
                    var reverseID = FirebaseChannelService.getDMSpecificChannel(uids[1] + '@' + uids[0]);
                    reverseID.$loaded().then(function (reversedata) {
                        if (reversedata.chatMessages == undefined) {
                            loadChatMessages();
                        } else {
                            $scope.DMchannelID = uids[1] + '@' + uids[0];
                            loadChatMessages();
                        }

                    });
                }
            }
            else
            {
                loadChatMessages();
            }

          });
       // $scope.chatMessages =FirebaseChatService.getSpecificChannel($routeParams.channelID);
        function loadChatMessages()
        {
            $scope.DMchatMessages=$firebaseObject(firebase.database().ref('DM/'+$scope.DMchannelID).child('chatMessages'));
        $scope.DMchatMessages.$watch(function() {
            $scope.DMcustomMessage=[];
            $scope.DMchatMessages.$loaded().then(function () {
                loader();
                angular.forEach($scope.DMchatMessages, function (value) {
                    isOwner = false;
                    if(value.posteduid == undefined) return;
                    if (value.posteduid === $scope.currentUID)
                        isOwner = true
                    $scope.DMcustomMessage.push({
                        'isOwner': isOwner,
                        'message': value.message,
                        'sendername': value.postedby,
                        'senderUID':value.posteduid,
                        'currentUID':$scope.currentUID,
                        'date': moment(value.posteddate).fromNow()
                    });
                });

            });
        });

        }
        $scope.sendDMMessage=function () {
            if ($scope.DMmessage.length == 0) return;
            var Message={
                postedby: $scope.currentusercollection.username,
                posteduid:$scope.currentUID,
                message: $scope.DMmessage,
                posteddate: Date.now(),
            };
            FirebaseChatService.pushDMMessage(Message,$scope.DMchannelID);
            $scope.DMmessage = '';
            angular.forEach($scope.currentGroupMembers,function(data){

                if(data!=$window.localStorage.getItem("madUID")) {
                    FirebaseChatService.pushNotification(data, Message, 'DM',$scope.DMchannelID)
                }

            });
        };
    }
