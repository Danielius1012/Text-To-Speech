var tokenURL = 'https://oxford-speech.cloudapp.net/token/issueToken';
var recogniseURL = "https://speech.platform.bing.com/recognize/query";

var clientId = "daniel";
var clientSecret = "805c311f640f494c84f31b5acd863d20";

var language = 'de-DE';

function recogniseSpeech(token, blob)
{
    changeLanguage();
    
    var xhttp = new XMLHttpRequest();
   
    xhttp.onreadystatechange = function() 
    {
        if (xhttp.readyState == 4 && xhttp.status == 200) 
        {
            console.info(xhttp.response);   
            var obj = JSON.parse(xhttp.response);
            document.getElementById("my-text").value = obj.header.name;
        }
    };
    
    var data = recogniseURL + '?';
          
    data += "version=" + '3.0' + '&';
    data += "requestid=" + '1d4b6030-9099-11e0-91e4-0800200c9a66' + '&';
    data += "appID=" + 'D4D52672-91D7-4C74-8AD8-42B1D98141A5' + '&';
    data += "format=" + 'json' + '&';
    data += "locale=" + language + '&';
    data += "device.os=" + 'wp7' + '&';
    data += "scenarios=" + 'ulm' + '&';
    data += "instanceid=" + '1d4b6030-9099-11e0-91e4-0800200c9a66';
        
    xhttp.open("POST", data, true);
    
    xhttp.setRequestHeader("Authorization", "Bearer " + token);
    xhttp.setRequestHeader("Content-length", blob.length);
    xhttp.setRequestHeader("Content-Type", 'audio/wav; samplerate=8000');  
    
    xhttp.send(blob);
}

function ToogleSpeechToText(blob)
{
    var tokenURL = 'https://oxford-speech.cloudapp.net/token/issueToken';
    var xhttp = new XMLHttpRequest();
    var token = '';
    
    xhttp.onreadystatechange = function() 
    {
        if (xhttp.readyState == 4 && xhttp.status == 200) 
        {
            token = xhttp.responseText.split('"')[3];
            recogniseSpeech(token,blob);                                                                
        }
    }; 
    
    var data = '';
    
    xhttp.open('POST', tokenURL, true);
    
    data += 'grant_type='+'client_credentials'+'&';
    data += 'client_id='+ encodeURIComponent(clientId) + '&';
    data += 'client_secret='+ encodeURIComponent(clientSecret)+ '&';
    data += 'scope='+'https://speech.platform.bing.com';

    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.setRequestHeader('Content-length', data.length);
    
    xhttp.send(data);
}

function changeLanguage() 
{
    var e = document.getElementById("languageSelect");
    var lang = e.options[e.selectedIndex].value;
    
    switch (lang) 
    {
        case "Deutsch":
            language = "de-DE";
            break;
        case "English":
            language = "en-GB";
            break;
        default:
            language = "en-US";
            break;
    }
}