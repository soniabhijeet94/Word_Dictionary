#!/usr/bin/env node

//importing required libs
var axios    = require('axios');
var chalk    = require('chalk');
var readline = require('readline');
var middle   = require('./middle');
var config   = require('./config')

const args      = process.argv.slice(2);

//need below vars throughout the program
var hint = "";
var word_synms = [];

var showHelpMenu = () => {

  console.log(chalk.bold.blue('Available Commands:'));
  console.log(chalk.bold.yellow('\t1. word-definitions : dict defn <word>'));
  console.log(chalk.bold.yellow('\t2. word-synonyms    : dict syn <word>'));		
  console.log(chalk.bold.yellow('\t3. word-antonyms    : dict ant <word>'));
  console.log(chalk.bold.yellow('\t4. word-examples    : dict ex <word>'));
  console.log(chalk.bold.yellow('\t5. word-full-dict   : dict <word>'));
  console.log(chalk.bold.yellow('\t6. word-of-the-day  : dict'));
  console.log(chalk.bold.yellow('\t7. word-play game   : dict play'));
  console.log(chalk.bold.yellow('\t8. word-dict help   : dict help'));

};

var showDefinitions = (word, flag, callback) => {
	middle.definitionsAll(word, (res) => {
		if(res.length >= 1){
			let i = 1;
			let defns = [];

			if(flag) {
				for(let def of res) defns.push(def);
				if(flag) callback(defns);
			} else {
			  	console.log(chalk.yellow(`\nDefinitions of'${word}' : \n`));
				//setting some user-readable format now
				for(let def of res) {
					console.log(chalk.cyan(`${i++}. ${def.text}`));	
					defns.push(def);	  
				}
			}
		}
	});
}

var showSynonyms = (word, flag, callback) => {
	middle.syn_ant_All(word, (res) => {
		if(res.length >= 1){
			let i = 0;
			let synms = [];
			if(!flag)
		  		console.log(chalk.yellow(`\nSynonyms of '${word}' : \n`));
			//setting some user-readable format now
			for(let syn of res) {
				if(syn.relationshipType === "synonym") {
					for(let word of syn.words) {	
						++i;
						if(!flag)					
							console.log(chalk.cyan(`${i}. ${word}`));
						synms.push(word);
					}		  
				}	  
			}

			if(!i && !flag)
				console.log(chalk.cyan("Sorry, API doesn't have any synonym for the given word."));

			if(flag) callback(synms);
		}
	});
}

var showAntonyms = (word, flag, callback) => {
	//using same syn_ant_all() method, as endpoints are same
	middle.syn_ant_All(word, (res) => {
		if(res.length >= 1){
			let i = 0;
			let antms = [];
			if(!flag)	
		  		console.log(chalk.yellow(`\nAntonyms of '${word}' : \n`));
			//setting some user-readable format now
			for(let ant of res) {
				if(ant.relationshipType === "antonym") {
					for(let word of ant.words) {
						++i;
						if(!flag)
							console.log(chalk.cyan(`${i}. ${word}`));
						antms.push(word);
					}		  
				}
			}

			if(!i && !flag)
				console.log(chalk.cyan("Sorry, API doesn't have any antonym for the given word."));

			if(flag) {
				if(!i) callback(i);
			} else callback(antms);
		}
	});
}

var showExamples = (word) => {
	middle.examplesAll(word, (res) => {
		if(res.examples.length >= 1){
			let i = 0;
		  	console.log(chalk.yellow(`\nExamples of '${word}' : \n`));
			//setting some user-readable format now
			for(let example of res.examples) {
				console.log(chalk.cyan(`${++i}. ${example.text}`));
			}		  
		}
	});
}

var showFullDictionary = (word, callback) => {
  //calling all APIs: defn, syn, ant & ex

  showDefinitions(word, 0, ()=>{});
  showSynonyms(word, 0, ()=>{});
  showAntonyms(word, 0, ()=>{});
  showExamples(word);
  
};

var showWordOfTheDay = (callback) => {
	let url = '';

  	//{apihost}/words/randomWord?api_key={api_key} =? for Random Word
  	let route = `randomWord?api_key=${config.config.api_key}`;
  	url = config.config.api_host + config.config.words_api + route;
  	middle.fortyTwoWordsApi(url, (data) => {
   		callback(data);
  	});
}

var retryGame = () => {
  console.log(chalk.yellow('You have entered incorrect word.\n'));
  console.log('Choose the options from below menu:');
  console.log('\t1. Try Again');
  console.log('\t2. Hint');
  console.log('\t3. Quit');
};

var showHint = (ans, callback) => {

	//logic for either to display defn, syn or ant based on random 'rand' param
	let rand = Math.floor(Math.random() * Math.floor(3));
	let mode;
	let answer = ans;
	// console.log(rand);

	//we need synonyms to verify user response as well..
	// console.log("word: " + answer);

	showSynonyms(answer, 1, (res) => {
		// console.log(res);
		word_synms = [...res];
		// console.log(word_synms);	
	});

	switch(rand) {
		case 0 : 
			showDefinitions(answer, 1, (res) => {
				// console.log(res);
				let len = res.length;
				rnd_index = Math.floor(Math.random() * Math.floor(len));
				hint = res[rnd_index].text;
				console.log(chalk.bold.cyan(`Definition: ${res[rnd_index].text}`));					
			});
			break;

		case 1 :
			showSynonyms(answer, 1, (res) => {
				// console.log(res);
				len = res.length;
				rnd_index = Math.floor(Math.random() * Math.floor(len));
				hint = res[rnd_index];
				console.log(chalk.bold.cyan(`Synonym: ${res[rnd_index]}`));					
			});
			break;
		case 2 :
			showAntonyms(answer, 1, (res) => {
				// console.log(res);

				if(!res) {
					showSynonyms(answer, 1, (res) => {
						// console.log(res);
						len = res.length;
						rnd_index = Math.floor(Math.random() * Math.floor(len));
						hint = res[rnd_index];
						console.log(chalk.bold.cyan(`Synonym: ${res[rnd_index]}`));					
					});
				} else {
					len = res.length;
					rnd_index = Math.floor(Math.random() * Math.floor(len));
					hint = res[rnd_index];
					console.log(chalk.bold.cyan(`Antonym: ${res[rnd_index]}`));	
				}
			});
			break;
		default: console.log("invalid");
	}

	callback(hint);
}

var wordPlayGame = (callback) => {
	let url = '';

  	//Get random word from api first: {apihost}/words/randomWord?api_key={api_key} =? for Random Word
  	let route = `randomWord?api_key=${config.config.api_key}`;
  	url = config.config.api_host + config.config.words_api + route;
  	console.log();
  	console.log(chalk.bold.blue("********* Welcome to Word-Play! *********\n"))

  	middle.fortyTwoWordsApi(url, (data) => {

  		console.log('Press "Ctrl + C" to exit the program.');
    	console.log('Find the word with the following: ');

		// console.log(data.word);
		let answer = data.word;
		showHint(answer, (data)=>{
			hint = data;
		});
		
		//First question is shown.. (def, syn or ant). Now the logic will be based on user's response.
		//Need to have interactive cmd now... Using readline to simulate the same..

		const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        console.log('Type your answer and then press the ENTER key...');

        rl.on('line', (user_response) => {
          let right = false;

          if(parseInt(user_response) === 3) {
          	console.log(chalk.bold.blue('Correct Word is : ' + answer));
			console.log(chalk.bold.yellow('Thank you for playing. Exiting now!'));
			rl.close();
          } else {
	          if(hint.toLowerCase() === user_response.toLowerCase()) {
	          	console.log(chalk.bold.yellow(`You typed the same word. Play the game genuinely.`));
	          	rl.close();
		        right = false;
	          } else if(`${user_response}` === answer){
	            console.log(chalk.bold.yellow('Congratulations! You are correct.'));
	            rl.close();
	          } else {

		          for(let syn of word_synms) {
		          	if(syn.toLowerCase() === user_response.toLowerCase()) {
		          		console.log(chalk.bold.yellow(`Congratulations! You have entered correct synonym for the word '${answer}'.`));
		          		rl.close();
		          		right = true;
		          	}
		          }

		          if(!right) {
		            if(parseInt(user_response) !== 1 && parseInt(user_response) !== 2)
		            	retryGame(); 	//Printing retry menu

		            switch(parseInt(`${user_response}`)){
						case 1:
							console.log('Guess the word again : ');
							console.log('Enter your answer :');
							break;
						case 2:
							showHint(answer, (data) => {
								hint = data;
							})
							console.log(chalk.yellow('\nHint: '));
							console.log('\nGuess the word again using the hint provided...');
							console.log('Enter your answer : ');
							break;
						default:  
					}  
		          }           	
	        	}          	
          	}
  		});
	});
  }


//######################################## STARTING POINT ########################################

var initDictionary = () => {

	// console.log(process.argv);
	
	if(args.length == 0){
	    showWordOfTheDay((data) => {
	      console.log(chalk.bold.yellow(`Word of the Day : ${data.word}`));
	      showFullDictionary(data.word);
	    });
    } 	else if(args.length === 1) {
			//for help & game scenarios
			let word = args[0];
			switch(word){
				case 'play': wordPlayGame(() => {});
							 break;
				case 'help': showHelpMenu();
							 break;
				default    : console.log(chalk.bold.yellow(`\nFull Dictionary of '${word}' : \n`));
							 showFullDictionary(word);
			}
	} 	else if(args.length === 2){
			let word = args[1];
			switch(args[0]) {
				case "defn"    : showDefinitions(word); 
							  	 break;
				case "syn" 	   : showSynonyms(word, 0, ()=>{}); 
							  	 break;
				case "ant" 	   : showAntonyms(word, 0, ()=>{}); 
							  	 break;
				case "ex" 	   : showExamples(word); 
						  		 break;
				default        : showHelpMenu();
			}
 	} 	else
 		showHelpMenu();
}

initDictionary();
