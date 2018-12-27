'use strict';

chatapp.factory('FirebaseChannelService',FirebaseChannelService);
function FirebaseChannelService($firebaseArray,$firebase,$window,$firebaseObject)
{
    var ref = firebase.database().ref('Groups');
    var sync = $firebaseArray(ref);
    var firebaseChannelObj=
        {
            getAllChannels:function () {
                return $firebaseObject(ref);
            },
            getSpecificGroup:function (channelID) {
                var ref = firebase.database().ref('Groups/'+channelID);
                return $firebaseObject(ref);
            },
            getDMSpecificChannel:function (channelID) {
                var ref = firebase.database().ref('DM/'+channelID);
                return $firebaseObject(ref);
            },
            getAllDMChannel:function()
            {
                var ref=firebase.database().ref('DM/');
                return $firebaseArray(ref);
            },
            getAllGroups:function()
            {
                var ref=firebase.database().ref('Groups/');
                return $firebaseArray(ref);
            },
            getCurrentUser:function (uid) {
                var ref=firebase.database().ref('users/'+uid);
                return $firebaseObject(ref);
            },
            getalldenusers:function()
            {
                var ref=firebase.database().ref('users/');
                return $firebaseArray(ref);
            },
            getallthreads:function()
            {
                var ref=firebase.database().ref('Threads/')
                return $firebaseArray(ref);
            },
            addMembersToChannel:function(groupID,member)
            {
                var updateKey={
                groupmembers:member
              };
            firebase.database().ref('Groups/'+groupID).update(updateKey);

            }
        };
    return firebaseChannelObj;

}