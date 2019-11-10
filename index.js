#!/usr/bin/env node

const args = process.argv;

let helpCommands = () => {
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


var initDictionary = () => {

	if(args[2].toLowerCase() === "help")
		helpCommands();

}

initDictionary();

console.log('Type "dict help" for help.');