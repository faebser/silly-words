const BEGINNING = "-B-";
const END = "-E-";

const buzzing = (words) => {
	return getWord(words, BEGINNING, randomInt(5, 15), [])
			.reverse()
			.reduce((acc, el) => {
				if(el === "-E-") return acc;
				if(el == "," || el == ".") return acc + el;
				return acc + " " + el;
			});
}

const getWord = (words, word, count, targetList) => {
	
	const nextWords = words[word];

	const _word = ((nextWords) => {
		// return random word if nextwords is none
		// or small random chance, no random chance, ben said its better
		if(!nextWords || nextWords.length === 0) {
			// optimize this
			const keys = Object.keys(words);
			return keys[randomInt(0, keys.length)];
		}
		return nextWords[randomInt(0, nextWords.length)];
	})(nextWords);

	if (count === 0) { // we reached zero before END
		targetList.push(_word);
		return targetList;
	}

	if (_word === END) { // we reached end
		return targetList;
	}

	targetList = getWord(words, _word, count-1, targetList);
	targetList.push(_word);
	return targetList;
}

const randomInt = (min, max) => {
	min = Math.ceil(min);
  	max = Math.floor(max);
  	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const app = () => {

	//const current = new DatArchive(window.location.origin);
	//let downloadPromise = current.download('/', { "timeout": 50000 });

	// elements
	const buzzwords = document.getElementById('buzzword');
	const like = document.getElementById('like');
	const next = document.getElementById('next');
	const info = document.getElementById('info');
	const app = document.getElementById('app');
	const gen_el = document.getElementById('generation');
	const overlay = document.getElementById('overlay');
	const b_word = document.getElementById('b-word-goes-here');
	const name = document.getElementById('name');
	const name_button = document.getElementById('send');
	let generation = 0;

	/*fetch("generation.json")
		.then((response) => {
			response.text()
				.then((text) => {
					const _data = JSON.parse(text);
					if (_data.generation > 0) {
						generation = _data.generation;
						gen_el.textContent = "This archive is " + generation + " modifications of the corpus away from the original."
					}
				});
		});*/

	const stats = (action) => {
		fetch("/stats",
			{
				method: "POST",
				headers: {'Content-Type':'application/x-www-form-urlencoded'},
				body: "action=" + encodeURIComponent(action)
			})
	}
    
    fetch("data.json")
    	.then((response) => {
    		response.text()
    			.then((text) => {
    				const words = JSON.parse(text);
    				const bound_buzz = buzzing.bind(null, words);
    				const exchange = (_bound_buzz, _buzzwords) => {
    					stats("next");
    					_buzzwords.textContent = bound_buzz();
    				};
    				buzzwords.textContent = bound_buzz();
    				// do all the init here
    				next.addEventListener('click', exchange.bind(null, bound_buzz, buzzwords));
    				next.classList.remove('disabled');

    				// info

    				info.addEventListener('click', () => {
    					app.classList.toggle("open");
    					info.classList.toggle("closed");
    				});

    				name_button.addEventListener('click', () => {
    					let name_v = "linz";
    					name_button.textContent = "Sending..."
    					fetch("/like",
							{
								method: "POST",
								headers: {'Content-Type':'application/x-www-form-urlencoded'},
								body: "name=" + encodeURIComponent(name_v) + "&phrase=" + encodeURIComponent(buzzwords.textContent)
							})
    						.then(() => {
    							name_button.textContent = "Sent :-)"
    							window.setTimeout(() => {
    								buzzwords.textContent = bound_buzz();
    								overlay.style.display = "none";
    								name_button.textContent = "Send"
    								name.value = "";
    							}, 500);
    						});
    				});

    				// test for DatArchive

    					like.classList.remove('disabled');

    					like.addEventListener('click', () => {

    						// show overlay
    						b_word.textContent = buzzwords.textContent;
    						overlay.style.display = "flex";
    						// ask nicley about name

							stats("like");

	    					/*for (let i = 0; i < result.length -1; i++) {
	    						if(words[result[i]]) {
	    							if(i == result.length - 1) {
	    								words[result[i]].push(END);
	    								continue;
	    							}
	    							words[result[i]].push(result[i+1]);
	    						}
	    					}*/
    					});
    			});
	    });
};

document.addEventListener("DOMContentLoaded", app);