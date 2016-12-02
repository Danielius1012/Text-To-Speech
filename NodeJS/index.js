var fs = require("fs");
var apiCalls = require("./apiCalls");

// Read the wav file and execute pipeline
fs.readFile('./examples/weatherTest.wav', function read(err, data) {
    if (err) {
        throw err;
    }
    apiCalls.performSpeechToIntentPipeline(data);
});



