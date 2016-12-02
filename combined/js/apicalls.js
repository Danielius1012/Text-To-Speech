var tokenURL = 'https://oxford-speech.cloudapp.net/token/issueToken';
var audioURL = "https://speech.platform.bing.com/synthesize";
var recogniseURL = "https://speech.platform.bing.com/recognize/query";

var scope = "https://speech.platform.bing.com"; 
var clientId = "daniel";
var clientSecret = "805c311f640f494c84f31b5acd863d20";
var token = "default";
var textToSpeak = 'Hallo';
var language = 'de-DE';
var nameLanguage = 'Microsoft Server Speech Text to Speech Voice (de-DE, Hedda)';
var sendString = "<speak version='1.0' xml:lang='"+language+"'><voice xml:lang='"+language+"' xml:gender='Female' name='"+nameLanguage+"'>"+textToSpeak+"</voice></speak>"
var context = new AudioContext();
var speechBuffer = null;
    
function requestAudio()
{
    changeLanguage();
    
    renewToken();
    
    textToSpeak = $("#my-text")[0].value;
    sendString = "<speak version='1.0' xml:lang='"+language+"'><voice xml:lang='"+language+"' xml:gender='Female' name='"+nameLanguage+"'>"+textToSpeak+"</voice></speak>";
    
    console.info($("#text-to-speak"));
    
    var xhttp = new XMLHttpRequest();
                
    // Hier länger warten!
                    
    xhttp.onreadystatechange = function() 
    {
        if (xhttp.readyState == 4 && xhttp.status == 200) 
        {
            context.decodeAudioData(xhttp.response, function(buffer) 
            {
                speechBuffer = buffer;
                console.info(speechBuffer);
                playAudio(speechBuffer);  
            });
                                                        
        }
    }; 
                    
    xhttp.open("POST", audioURL, true);
    xhttp.setRequestHeader("Content-type", 'application/ssml+xml');
    xhttp.setRequestHeader("Authorization", 'Bearer ' + token);
    xhttp.setRequestHeader("X-Microsoft-OutputFormat", 'riff-16khz-16bit-mono-pcm');
    xhttp.setRequestHeader("X-Search-AppId", '07D3234E49CE426DAA29772419F436CA');
    xhttp.setRequestHeader("X-Search-ClientID", '1ECFAE91408841A480F00935DC390960');
    xhttp.responseType = 'arraybuffer'
    
    xhttp.send(sendString);
}

function renewToken()
{
    $.ajax(
    {
        type: 'POST',
        url: tokenURL,
        data: 
        {
            'grant_type': 'client_credentials',
            'client_id': encodeURIComponent(clientId),
            'client_secret': encodeURIComponent(clientSecret),
            'scope': 'https://speech.platform.bing.com'
        }
    }).done(function(data) 
    { 
        token = data.access_token;
    });
}

function playAudio()
{
    var context = new AudioContext();

    var source = context.createBufferSource(); 
    source.buffer = speechBuffer;                    
    source.connect(context.destination);       
    source.start(0);                           
}

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
    
    xhttp.onreadystatechange = function() 
    {
        if (xhttp.readyState == 4 && xhttp.status == 200) 
        {
            token = xhttp.responseText.split('"')[3];
            recogniseSpeech(token,blob);                                                                
        }
    }; 
    
    var data = '';
    
    xhttp.open("POST", tokenURL, true);
    
    data += 'grant_type='+'client_credentials'+'&';
    data += 'client_id='+ encodeURIComponent(clientId) + '&';
    data += 'client_secret='+ encodeURIComponent(clientSecret)+ '&';
    data += 'scope='+'https://speech.platform.bing.com';

    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.setRequestHeader("Content-length", data.length);
    
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
            nameLanguage = "Microsoft Server Speech Text to Speech Voice (de-DE, Hedda)";
            break;
        case "English":
            language = "en-GB";
            nameLanguage = "Microsoft Server Speech Text to Speech Voice (en-GB, Susan, Apollo)";
            break;
        default:
            language = "en-GB";
            nameLanguage = "Microsoft Server Speech Text to Speech Voice (en-GB, Susan, Apollo)";
            break;
    }   
}