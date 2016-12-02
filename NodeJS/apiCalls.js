var request = require('request');
var uuid = require('node-uuid');
var events = require('events');
var querystring = require("querystring");
var BufferReader = require('buffer-reader');
var util         = require('util');

// Use your Bing Speech Primary Key here
var bing_key = "805c311f640f494c84f31b5acd863d20";  
var token_speech_url = "https://api.cognitive.microsoft.com/sts/v1.0/issueToken";
var speech_url = "https://speech.platform.bing.com/recognize";

// Use the LUIS credentials of your LUIS application here
var LUIS_id = "ce8b8ac6-6279-4349-9a53-92794e3836a4";
var LUIS_key = "a85bb49681c8440a897b837119438954";
var LUIS_url = "https://api.projectoxford.ai/luis/v2.0/apps/" + LUIS_id + "?subscription-key=" + LUIS_key + "&verbose=true";

function getAuthKey(callerFunc) {
    request({
        url: token_speech_url,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length" : "0",
            "Ocp-Apim-Subscription-Key": bing_key,              
        },
        method : 'POST',       
    }, 
    function(err, response, body) {      
        if(err){
            callerFunc("Token request error: "+err);
        }
        else {
            callerFunc(response.body);
        }
        
    });
              
}
 
function speechToText(data, token, callerFunc) {
    request.post({
        url: speech_url,
        qs: {
            'scenarios': 'ulm',
            'appid': 'D4D52672-91D7-4C74-8AD8-42B1D98141A5', // This magic value is required
            'locale': 'en-US',
            'device.os': 'wp7',
            'version': '3.0',
            'format': 'json',
            'requestid': '1d4b6030-9099-11e0-91e4-0800200c9a66', // can be anything
            'instanceid': '1d4b6030-9099-11e0-91e4-0800200c9a66' // can be anything
        },
        body: data,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'audio/wav; samplerate=16000',
            'Content-Length' : data.length
        }
    }, 
    function(err, response, body) {
        if(err) {
            callerFunc("Speech to text error: "+err);
        }
        else {
            callerFunc(response.body);
        }
    });
 
}

function getSpeechIntent(query, callerFunc) {
     request({
        url: LUIS_url+"&q="+encodeURIComponent(query),
        method : 'GET',
        json: true,
    }, 
    function(err, response, body) {
        if(err) {
            callerFunc("LUIS error: "+err);
        }   
        else {
            callerFunc(response.body);
        }           
    });
}

function performSpeechToIntentPipeline(data) {
    getAuthKey(function(tokenAnswer) {
        console.log("Token: " + tokenAnswer + "\n");
        var token = tokenAnswer;

        // perform text to speech with the token
        speechToText(data, token, function(speechAnswer) {
            spokenText = JSON.parse(speechAnswer)["results"][0]["name"];
            console.log("Spoken Text: " + spokenText + "\n");

            getSpeechIntent(spokenText, function(luisResult) {
                console.log(luisResult);
            })
        });
    });
}



exports.performSpeechToIntentPipeline = performSpeechToIntentPipeline;