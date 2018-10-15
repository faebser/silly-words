const BEGINNING = "-B-";
const END = "-E-";

const buzzing = (words) => {
	const keys = Object.keys(words);
	return getWord(words, BEGINNING, randomInt(1, 20), [], keys)
			.reverse()
			.reduce((acc, el) => {
				if(el === "-E-") return acc;
				if(el == "," || el == ".") return acc + el;
				return acc + " " + el;
			});
}

const getWord = (words, word, count, targetList, keys) => {
	'use strict';
	
	const nextWords = words[word];

	const _word = ((nextWords) => {
		// return random word if nextwords is none
		// or small random chance, no random chance, ben said its better
		if(!nextWords || nextWords.length === 0) {
			// optimize this
			return keys[randomInt(0, keys.length)];
		}
		return nextWords[randomInt(0, nextWords.length)];
	})(nextWords);

	if (count <= 0) { // we reached zero before END
		// change this so that it forces to find the next END
		console.log("reached end with count", count);

		// we find an END
		console.log('word', word);
		if(nextWords.includes(END)) { 
			// we just push it to targetlist and return
			targetList.push(END);
			return targetList;
		}
		// there is no end
		// we just push the current word
		// and continue with another recursion
		targetList.push(_word);
		targetList = getWord(words, _word, count-1, targetList, keys);
	}

	if (_word === END) { // we reached end
		console.log("reached END prematurely", count);
		return targetList;
	}

	targetList = getWord(words, _word, count-1, targetList, keys);
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

    				let endcount = 0;

    				for (var key in words) {
					   if (words.hasOwnProperty(key)) {
					      //console.log(key, words[key]);
					      if(words[key].includes(END)) {
    						endcount++;
    					}
					   }
					}

    				console.log("found", endcount, "in", Object.keys(words).length);

    				const bound_buzz = buzzing.bind(null, words);
    				const exchange = (_bound_buzz, _buzzwords) => {
    					stats("next");
    					_buzzwords.textContent = bound_buzz();
    				};
    				buzzwords.textContent = bound_buzz();
    				// do all the init here
    				//next.addEventListener('click', exchange.bind(null, bound_buzz, buzzwords));
    				//next.classList.remove('disabled');

    				// info

    				info.addEventListener('click', () => {
    					app.classList.toggle("open");
    					info.classList.toggle("closed");
    				});

    				document.addEventListener('keyup', (e) => {
    					// L = 76, N == 78
    					if(e.keyCode !== 76 && e.keyCode !== 78) {
    						return;
    					}
    					// L aka like
    					if(e.keyCode === 76) { 
    						return;
    					}
    					// N aka next
    					exchange(bound_buzz, buzzwords);
    					return;
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

const benchmark = () => {
	'use strict';
	fetch("data.json")
    	.then((response) => {
    		response.text()
    			.then((text) => {
    				const words = JSON.parse(text);

    				console.log("start benchmark");

    				// run old and new
					const keys = Object.keys(words);
					let t1 = performance.now()
					for (var i = 100000 - 1; i >= 0; i--) {
						getWord(words, BEGINNING, randomInt(5, 15), [])
							.reverse()
							.reduce((acc, el) => {
								if(el === "-E-") return acc;
								if(el == "," || el == ".") return acc + el;
								return acc + " " + el;
							});
					}
					let time1 = performance.now() - t1;

					let t2 = performance.now();
					for (var i = 100000 - 1; i >= 0; i--) {
						getWord2(words, BEGINNING, randomInt(5, 15), [], keys)
							.reverse()
							.reduce((acc, el) => {
								if(el === "-E-") return acc;
								if(el == "," || el == ".") return acc + el;
								return acc + " " + el;
							});
					}
					let time2 = performance.now() - t2;

					console.log("t1", time1, "ops/s", 100000/time1);
					console.log("t2", time2, "ops/s", 100000/time2);
					console.log("differnece", time1 - time2);
    			});
    		});
	
}

document.addEventListener("DOMContentLoaded", app);