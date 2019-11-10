#!/usr/bin/env node

var axios = require('axios');

const args = process.argv.slice(2);
const api_host = 'https://fourtytwowords.herokuapp.com';
const word_api = api_host + '/word/';
const words_api = api_host + '/words/';
const api_key = 'b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164';

var fortyTwoWordsApi = (url, callback) => {
	//setup the calling to DB to fetch required results
	console.log("url: " + url);
	// send a GET request
	axios.get(url)
		.then(response => {
			console.log(response.data);
		}
	);
};

var helpCommands = () => {
  console.log('Available Commands:');
  console.log('\t1.dict defn <word>');
  console.log('\t2.dict syn <word>');
  console.log('\t3.dict ant <word>');
  console.log('\t4.dict ex <word>');
  console.log('\t5.dict <word>');
  console.log('\t6.dict');
  console.log('\t7.dict play');
  console.log('\t8.dict help');
};

var definitionsAll = (word, callback) => {
  let url = '';

  //{apihost}/word/{word}/definitions?api_key={api_key} =? for Word Definition
  let route = `${word}/definitions?api_key=${api_key}`;
  url = word_api + route;
  fortyTwoWordsApi(url, (data) => {
    callback(data);
  });
};

var showDefinition = (word) => {
	definitionsAll(word, (data) => {
		if(data.length >= 1){
		  console.log(`The definitions for the word ${word} are : `);
		  console.log(data)
		}
	});
}

var initDictionary = () => {

	// console.log(process.argv);

	//For no args, call wordOfTheDay api
	if(args.length === 2 && args[0] === "defn"){

		let word = args[1];
	    showDefinition(word);
 	}

	// if(args[2].toLowerCase() === "help")
	// 	helpCommands();

}

initDictionary();

console.log('Type "dict help" for help.');