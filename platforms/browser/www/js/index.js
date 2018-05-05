/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

	function sendBasicReq(){

		var xhttp = new XMLHttpRequest();
		xhttp.open("GET", "http://api.nbp.pl/api/cenyzlota", false);
		xhttp.send();
		alert("Status: " + xhttp.status + "wartosc: " + xhttp.response);
	}

	
	window.user = {};

var googleWebKey  = '686795737390-u2o1airh1e14jcm58cejmhihnfsn1991.apps.googleusercontent.com';

var loginUser = function (googleUser) {
    var element = document.getElementById('name');

    console.log(googleUser);

    element.innerText = "Signed in as: " + googleUser.email;

    window.user = googleUser;
};

var deviceReady = function () {

    console.debug('device is ready');

    var attachSigninMobile = function (element) {
        element.addEventListener('click', function () {
            console.log('button was clicked on mobile!');

            if (window.plugins && window.plugins.googleplus) {
                window.plugins.googleplus.login(
                    {
//                  'scopes': '... ', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
                        'webClientId': googleWebKey, // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
                        'offline': false // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
                    },
                    function (googleUser) {
                        console.log('googleUser is', googleUser);
                        loginUser(googleUser);
                    },
                    function (msg) {
                        alert('error: ' + msg);
                    }
                );
            } else {
                alert("Cordova login plugin not loaded!");
            }
        });
    };

    var attachSigninWeb = function (element) {

        //Adding extra scripts, not needed on mobile.
        var googleScript = document.createElement('script');
        googleScript.type = 'text/javascript';
        googleScript.src = 'https://apis.google.com/js/api:client.js';

        document.head.appendChild(googleScript)

        googleScript.onload = function () {
            gapi.load('auth2', function () {
                var auth2 = gapi.auth2.init({
                    client_id: googleWebKey,
                    cookiepolicy: 'single_host_origin',
                    // Request scopes in addition to 'profile' and 'email'
                    //scope: 'additional_scope'
                });

                auth2.attachClickHandler(element, {},
                    function (googleUser) {
                        // Mapujemy użytkownika z jednego systemu na takiego samego jak w drugim, żeby nie mieć różnic dalej
                        var user = {
                            displayName: googleUser.getBasicProfile().getName(),
                            accessToken: googleUser.getAuthResponse(true).access_token,
                            email: googleUser.getBasicProfile().getEmail(),
                            familyName: googleUser.getBasicProfile().getFamilyName(),
                            givenName: googleUser.getBasicProfile().getGivenName(),
                            userId: googleUser.getBasicProfile().getId(),
                            imageUrl: googleUser.getBasicProfile().getImageUrl(),
                            expires: googleUser.getAuthResponse(true).expires_at,
                            expires_in: googleUser.getAuthResponse(true).expires_in,
                            idToken: googleUser.getAuthResponse(true).id_token
                        };
                        loginUser(user);
                    }, function (error) {
                        alert(JSON.stringify(error, undefined, 2));
                    });
            });
        };
    };

    if (device.platform.toLowerCase() === 'android' || device.platform.toLowerCase() === 'ios') {
        attachSigninMobile(document.getElementById('customBtn'));
    } else {
        attachSigninWeb(document.getElementById('customBtn'));
    }
};

document.addEventListener('deviceready', deviceReady, false);
