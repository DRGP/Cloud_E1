const { request } = require('express');
var express = require('express');
var axios = require('axios');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tone analysis' });
});

/* POST to Tone Analysis service */
router.post('/toneAnalysis', function(req, res) {
  var data = JSON.stringify({"text":req.body.text});

  var config = {
    method: 'post',
    url: 'https://servicio1.us-south.cf.appdomain.cloud/toneAnalyzer',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };

  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
    var responseString = 'Tone analysis results:\n';
    for (const tone in response.data.result.document_tone.tones) {
      responseString = responseString + `${tone.tone_name}: ${tone.score}.\n`;
    }
    res.send(responseString);
  })
  .catch(function (error) {
    console.log(error);
  });
});

module.exports = router;
