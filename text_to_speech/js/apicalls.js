// Die URL zum anfordern des Tokens
var tokenURL = 'https://oxford-speech.cloudapp.net/token/issueToken';
// Die URL zum Anfordern der Sprachausgabe
var audioURL = "https://speech.platform.bing.com/synthesize";
// Unsere ID. Kann ein beliebiger Wert sein (ein Wort in lowercase)
var clientId = "daniel";
// Der Secondary Key aus dem Oxford Portal: https://www.projectoxford.ai/Subscription
var clientSecret = "YOUR CODE HERE";
// Der Token. Dieser wird nach dem ersten Call gefüllt und zum anfordern der Sprache verwendet.
var token = "default";
// Der zu sprechende Text. Hier nur ein Dummy Wert. 
var textToSpeak = 'Hallo, viel Spaß mit Projekt Oxford!';
// Die Sprache der Ausgabe
var language = 'de-DE';
// Der Sprecher der Ausgabe. Werte hierfür bekommt man von der Speech Doku Seite: 
// https://www.microsoft.com/cognitive-services/en-us/speech-api/documentation/api-reference-rest/bingvoiceoutput#4-supported-locales-and-voice-fonts
var nameLanguage = 'Microsoft Server Speech Text to Speech Voice (de-DE, Hedda)';
// Der zu sendende Text an den Endpoint
var sendString = "<speak version='1.0' xml:lang='"+language+"'><voice xml:lang='"+language+"' xml:gender='Female' name='"+nameLanguage+"'>"+textToSpeak+"</voice></speak>"
// Der AudioContext, den wir vom Endpoint erhalten
var context = new AudioContext();   
// Die dekodierte wav Datei. Kann zur Ausgabe genutzt werden.
var speechBuffer = null;  
    
// Endpoint Call an den Text to Speech Serive. Wenn erfolgreich, wird playAudio aufgerufen.
function sendAudioRequest()
{
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

// Holt sich den Token vom Endpoint und ruft initialisiert den Audio Request.
function requestAudio(lang)
{
    // Change Language
    changeLanguage();
    
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
        sendAudioRequest();
    });
}

// Spielt die zurückgegebene Sprache ab.
function playAudio()
{
    var context = new AudioContext();

    var source = context.createBufferSource(); 
    source.buffer = speechBuffer;                    
    source.connect(context.destination);       
    source.start(0);                           
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