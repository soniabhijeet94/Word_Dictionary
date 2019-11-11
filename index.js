#!/usr/bin/env node

var axios = require('axios');
var chalk = require('chalk');

const args = process.argv.slice(2);
const api_host = 'https://fourtytwowords.herokuapp.com';
const word_api = api_host + '/word/';
const words_api = api_host + '/words/';
const api_key = 'b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164';

var showHelpMenu = () => {
  console.log('Available Commands:');
  console.log('\t1. word-definitions : dict defn <word>');
  console.log('\t2. word-synonyms    : dict syn <word>');
  console.log('\t3. word-antonyms    : dict ant <word>');
  console.log('\t4. word-examples    : dict ex <word>');
  console.log('\t5. word-full-dict   : dict <word>');
  console.log('\t6. word-of-the-day  : dict');
  console.log('\t7. word-play game   : dict play');
  console.log('\t8. word-dict help   : dict help');
};


var fortyTwoWordsApi = (url, callback) => {
	//setup the calling to DB to fetch required results
	// console.log("url: " + url);
	// send a GET request
	axios.get(url)
	.then(response => {
		// console.log(response.data);
		let res = response.data;
		// console.log(res.examples);
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

var syn_ant_All = (word, callback) => {
  let url = '';

  //{apihost}/word/{word}/relatedWords?api_key={api_key} => Word Synonyms
  let route = `${word}/relatedWords?api_key=${api_key}`;
  url = word_api + route;
  fortyTwoWordsApi(url, (data) => {
    callback(data);
  });
};

var examplesAll = (word, callback) => {
  let url = '';

  //{apihost}/word/{word}/examples?api_key={api_key} =? for Word Examples
  let route = `${word}/examples?api_key=${api_key}`;
  url = word_api + route;
  fortyTwoWordsApi(url, (data) => {
    callback(data);
  });
};

var showDefinitions = (word) => {
	definitionsAll(word, (res) => {
		if(res.length >= 1){
			let i = 1;
		  	console.log(chalk.yellow(`\nThe definitions for the word '${word}' are : \n`));
			//setting some user-readable format now
			for(let defn of res) {
				console.log(chalk.cyan(`${i++}. ${defn.text}`));		  
			}
		}
	});
}

var showSynonyms = (word) => {
	syn_ant_All(word, (res) => {
		if(res.length >= 1){
			let i = 0;
		  	console.log(chalk.yellow(`\nThe synonyms for the word '${word}' are : \n`));
			//setting some user-readable format now
			for(let syn of res) {
				if(syn.relationshipType === "synonym") {
					for(let word of syn.words) {
						console.log(chalk.cyan(`${++i}. ${word}`));
					}		  
				}	  
			}

			if(!i)
				console.log(chalk.cyan("Sorry, API doesn't have any synonym for the given word."));
		}
	});
}

var showAntonyms = (word) => {
	//using same syn_ant_all() method, as endpoints are same
	syn_ant_All(word, (res) => {
		if(res.length >= 1){
			let i = 0;
		  	console.log(chalk.yellow(`\nThe antonyms for the word '${word}' are : \n`));
			//setting some user-readable format now
			for(let ant of res) {
				if(ant.relationshipType === "antonym") {
					for(let word of ant.words) {
						console.log(chalk.cyan(`${++i}. ${word}`));
					}		  
				}
			}

			if(!i)
				console.log(chalk.cyan("Sorry, API doesn't have any antonym for the given word."));
		}
	});
}

var showExamples = (word) => {
	examplesAll(word, (res) => {
		if(res.examples.length >= 1){
			let i = 0;
		  	console.log(chalk.yellow(`\nThe examples for the word '${word}' are : \n`));
			//setting some user-readable format now
			for(let example of res.examples) {
				console.log(chalk.cyan(`${++i}. ${example.text}`));
			}		  
		}
	});
}

var showFullDictionary = (word, callback) => {
  //calling all APIs: defn, syn, ant & ex

  showDefinitions(word);
  showSynonyms(word);
  showAntonyms(word);
  showExamples(word);
  
};

var initDictionary = () => {

	// console.log(process.argv);
	
	if(args.length == 0){
	    showWordOfTheDay((data) => {
	      console.log('\x1b[93m Word of the Day - Dictionary: \x1b[0m');
	      dictionary(data.word);
	    });
    } 	else if(args.length === 1) {
			//for help & game scenarios
			let word = args[0];
			switch(word){
				case 'play': wordPlayGame();
							 break;
				case 'help': showHelpMenu();
							 break;
				default    : console.log(chalk.blue(`\nThe full-dictionary for the word '${word}' is : \n`));
							 showFullDictionary(word);
			}
	} 	else if(args.length === 2){
			let word = args[1];
			switch(args[0]) {
				case "defn"    : showDefinitions(word); 
							  	 break;
				case "syn" 	   : showSynonyms(word); 
							  	 break;
				case "ant" 	   : showAntonyms(word); 
							  	 break;
				case "ex" 	   : showExamples(word); 
						  		 break;
				default        : showHelpMenu();
			}
 	} 	else
 		showHelpMenu();
}

initDictionary();

// console.log('Type "dict help" for help.');