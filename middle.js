var config    = require('./config');
var axios     = require('axios');
var chalk     = require('chalk');
var host_path = config.config.api_host + config.config.word_api;

module.exports.fortyTwoWordsApi = (url, callback) => {
  //setup the calling to DB to fetch required results
  // console.log("url: " + url);
  // send a GET request
  axios.get(url)
  .then(response => {    // console.log(response.data);
    let res = response.data;
    // console.log(res);
    callback(res);
  }).catch(err => {
    //got error
    console.log(chalk.red("Got error: " + err + ". Please try again."));
  });
};

module.exports.definitionsAll = (word, callback) => {
  let url = '';

  //{apihost}/word/{word}/definitions?api_key={api_key} =? for Word Definitions
  let route = `${word}/definitions?api_key=${config.config.api_key}`;
  url = host_path + route;
  this.fortyTwoWordsApi(url, (data) => {
    callback(data);
  });
};

module.exports.syn_ant_All = (word, callback) => {
  let url = '';

  //{apihost}/word/{word}/relatedWords?api_key={api_key} => Word Synonyms
  let route = `${word}/relatedWords?api_key=${config.config.api_key}`;
  url = host_path + route;
  this.fortyTwoWordsApi(url, (data) => {
    callback(data);
  });
};

module.exports.examplesAll = (word, callback) => {
  let url = '';

  //{apihost}/word/{word}/examples?api_key={api_key} =? for Word Examples
  let route = `${word}/examples?api_key=${config.config.api_key}`;
  url = host_path + route;
  this.fortyTwoWordsApi(url, (data) => {
    callback(data);
  });
};