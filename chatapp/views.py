from django.shortcuts import render
from pyrebase import pyrebase
from django.http import JsonResponse
from django.http import HttpResponse
import json
# Create your views here.

config = {
    "apiKey": "AIzaSyCu9-rUQHY9ERelSl0dm9BXR082Otzm4Mw",
    "authDomain": "madstreetden-442b5.firebaseapp.com",
    "databaseURL": "https://madstreetden-442b5.firebaseio.com",
    "projectId": "madstreetden-442b5",
    "storageBucket": "madstreetden-442b5.appspot.com",
    "messagingSenderId": "400841163153"
  }

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()


def signup(request):

    if request.method == "POST":
        data = json.loads(request.body)
        user = auth.create_user_with_email_and_password(data.get('email'), data.get('password'))
        uid = user['localId']
        userdata = {"username": data.get('username'), "email": data.get('email')}
        database = firebase.database()
        database.child("users").child(uid).set(userdata)
        return HttpResponse(''+uid)
    else:
        return JsonResponse({'error': 'no data'})


def login(request):

        if request.method == "POST":
            data = json.loads(request.body)
            user = auth.sign_in_with_email_and_password(data.get('email'), data.get('password'))
            uid = user['localId']
            return HttpResponse(''+uid)
        else:
            return HttpResponse('error')


def creategroup(request):

        if request.method == "POST":
            data = json.loads(request.body)
            groupData = {'groupname': data.get('name'), 'groupowner': data.get('owner'), 'groupmembers': data.get('members')}
            database = firebase.database()
            database.child("Groups").push(groupData)
            return JsonResponse({'data': 'successfully created!'})
        else:
            return JsonResponse({'error': 'no data'})


def getcurrentuser(request):

    if request.method == "POST":
        data = json.loads(request.body)
        try:
            uid = data.get("uid")
            database = firebase.database()
            currentuserdata = database.child("users").child(uid).get().val()
            print(currentuserdata)
            return JsonResponse({'data': currentuserdata})
        except:
            return JsonResponse({'data': 'no data found'})
    else:
        return JsonResponse({'error': 'no data'})


def getallusers(request):

        try:
            database = firebase.database()
            alluserdata = database.child("users").shallow().get().val()
            usercollection = []
            keycollection = []
            data = []
            for user in alluserdata:
                usercollection.append(user)
            for key in usercollection:
                keycollection.append(key)
                data.append(firebase.database().child("users").child(key).get().val())
            print(usercollection)
            return JsonResponse({'data': data, 'key': keycollection})
        except:
            return JsonResponse({'data': 'no data found'})


def getallgroups(request):
    try:
        database = firebase.database()
        allgroupsdata = database.child("Groups").shallow().get().val()
        groupcollection = []
        groupkeycollection = []
        data = []
        for user in allgroupsdata:
            groupcollection.append(user)
        for key in groupcollection:
            groupkeycollection.append(key)
            data.append(firebase.database().child("Groups").child(key).get().val())
        return JsonResponse({'data': data, 'key': groupkeycollection})
    except:
        return JsonResponse({'data': 'no data found'})

