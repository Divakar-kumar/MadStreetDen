'use strict';

chatapp.factory('FirebaseChatService',FirebaseChatService);
function FirebaseChatService($firebaseArray,$firebase,$window,$firebaseObject) {

    var firebaseChatObj =
        {

            getSpecificChannel: function (channelID) {
                var ref = firebase.database().ref('Groups/'+channelID);
               // var roomInfo = $firebaseObject(ref);
               // console.log(roomInfo);
               // var msgSync=firebase.database().ref('Groups/'+channelID).child('chatMessages');
                return ($firebaseObject(ref));
            },
            pushMessage:function (message,channelID) {
             /*   var msgSync=firebase.database().ref('chatRooms/'+channelID).child('chatMessages');
                var msgSend = $firebaseArray(msgSync);
                msgSend.$push(message);*/
                return firebase.database().ref('Groups/'+channelID).child('chatMessages').push(message);
            },
             pushDMMessage:function (message,channelID) {
             /*   var msgSync=firebase.database().ref('chatRooms/'+channelID).child('chatMessages');
                var msgSend = $firebaseArray(msgSync);
                msgSend.$push(message);*/
                firebase.database().ref('DM/'+channelID).child('chatMessages').push(message);
            },
            pushNotification:function(member,message,groupname,groupUID)
            {
                var notification={
                    'postedgroup':groupname,
                    'postedby':message.postedby,
                    'posteddate':message.posteddate,
                    'postedmessage':message.message,
                    'postedgroupuid':groupUID
                }

                firebase.database().ref('Notificatoins/'+member).push(notification);
            }

        };
    return firebaseChatObj;
}