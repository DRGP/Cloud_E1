const { request } = require('express');
var express = require('express');
var axios = require('axios');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tone analysis' });
});

router.get('/autor', (req, res) => {
  res.json(
      { alumno: 'DG',
        servicio: 'EKS en AWS' 
      }
      );
});

router.get('/healthcheck', (req, res) => {
  res.send({status: 'Working'})
})

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
    var responseString = '<h1>Tone analysis results:</h1>';
    for (const tone in response.data.result.document_tone.tones) {
      console.log(tone);
      responseString = responseString + `<h2>${response.data.result.document_tone.tones[tone].tone_name}: ${response.data.result.document_tone.tones[tone].score}.</h2>`;
    }
    res.send(responseString);
  })
  .catch(function (error) {
    console.log(error);
  });
});

module.exports = router;
