//see Help
const fs = require('fs');
var osascript = require('node-osascript');

console.log();
console.log();
console.log();

fs.readFile('src/input.csv', 'utf8', (err, data) => {
  if (err) console.log(err);
  processData(data);
});

function processData (data) {
	var tab = data.split('\n');
	var finalTab = [];

	for (var i = 0; i < tab.length; i++) {
		if(tab[i].split(';')[0] != '')
			finalTab.push(tab[i].split(';'));

	}

	prepareScript(finalTab);
}

function prepareScript (data) {
	var order = 'tell application "Keynote"\n'
		order += 'activate\n'

	order += 'set thisDocument to ¬\n'
	order += 'make new document with properties ¬\n'
	order += '{document theme:theme "Noir", width:1920, height:1080}\n'

	order += 'tell thisDocument\n'
		order += genSlide(data);
		order += 'end tell\n'

	order += 'end tell';

	//console.log(order)

	osascript.execute(order, function(err, result, raw){
	  if (err) return console.error(err)
	  console.log(result, raw.toString())
	});
}

//{"Titre et sous-titre", "Photo - Horizontale", "Titre - Centré", "Photo - Verticale", "Titre - Haut", "Titre et puces", "Titre, puces et photo", "Puces", "3 photos", "Citation", "Photo", "Vierge"}

function genSlide (data) {
	var output = "";

	for (var i = 0; i < data.length; i++) {
		if (data[i][2] == 'TR'){
			output += 'set thisSlide to make new slide with properties ¬\n'
			output += '{base slide:master slide "Titre et sous-titre"}\n'

			output += 'tell thisSlide\n'
				output += 'set the object text of the default title item to "' + data[i][0] + '"\n'
			output += 'end tell\n'

		}else if (data[i][2] == 'BP'){
			output += 'set thisSlide to make new slide with properties ¬\n'
			output += '{base slide:master slide "Titre et puces"}\n'

			output += 'tell thisSlide\n'
				output += 'set the object text of the default title item to "' + data[i][0] + '"\n'
				output += 'set the object text of the default body item to ¬\n'

				output += '"' + data[i+1][1] + '"'
				for (var j = 2; j < data[i+1].length; j++) {
					if(data[i+1][j] != '' && data[i+1][j] != '\r')
						output += ' & return & "' + data[i+1][j] + '"'
				}
				output += '\n'
			output += 'end tell\n'

		}
	}

	return output
}











