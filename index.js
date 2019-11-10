#!/usr/bin/env node

var axios = require('axios');
var chalk = require('chalk');

const args = process.argv.slice(2);
const api_host = 'https://fourtytwowords.herokuapp.com';
const word_api = api_host + '/word/';
const words_api = api_host + '/words/';
const api_key = 'b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164';

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


var fortyTwoWordsApi = (url, callback) => {
	//setup the calling to DB to fetch required results
	// console.log("url: " + url);
	// send a GET request
	axios.get(url)
	.then(response => {
		// console.log(response.data);
		let res = response.data;
		console.log(res);
		callback(res);
	}).catch(err => {
		//got error
		console.log(chalk.red("Got error: " + err + ". Please try again."));
	});
};


var definitionsAll = (word, callback) => {
  let url = '';

  //{apihost}/word/{word}/definitions?api_key={api_key} =? for Word Definitions
  let route = `${word}/definitions?api_key=${api_key}`;
  url = word_api + route;
  fortyTwoWordsApi(url, (data) => {
    callback(data);
  });
};

var synonymsAll = (word, callback) => {
  let url = '';

  //{apihost}/word/{word}/relatedWords?api_key={api_key} => Word Synonyms
  let route = `${word}/relatedWords?api_key=${api_key}`;
  url = word_api + route;
  fortyTwoWordsApi(url, (data) => {
    callback(data);
  });
};

var showDefinitions = (word) => {
	definitionsAll(word, (res) => {
		if(res.length >= 1){
			let i = 1;
		  	console.log(chalk.yellow(`\nThe definitions for the word ${word} are : \n`));
			//setting some user-readable format now
			for(let defn of res) {
				console.log(chalk.cyan(`${i++}. ${defn.text}`));		  
			}
		}
	});
}

var showSynonyms = (word) => {
	synonymsAll(word, (res) => {
		if(res.length >= 1){
			let i = 1;
		  	console.log(chalk.yellow(`\nThe synonyms for the word ${word} are : \n`));
			//setting some user-readable format now
			for(let syn of res) {
				for(let word of syn.words) {
					console.log(chalk.cyan(`${i++}. ${word}`));
				}		  
			}
		}
	});
}

var initDictionary = () => {

	// console.log(process.argv);

	//For no args, call wordOfTheDay api
	if(args.length === 2){
		let word = args[1];
		switch(args[0]) {
			case "defn" : showDefinitions(word); 
						  break;
			case "syn" : showSynonyms(word); 
						  break;
		}
 	}

	// if(args[2].toLowerCase() === "help")
	// 	helpCommands();

}

initDictionary();

// console.log('Type "dict help" for help.');