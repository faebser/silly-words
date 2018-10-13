(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("js/bundle.js", function(exports, require, module) {
"use strict";

var BEGINNING = "-B-";
var END = "-E-";

var buzzing = function buzzing(words) {
	return getWord(words, BEGINNING, randomInt(5, 15), []).reverse().reduce(function (acc, el) {
		if (el === "-E-") return acc;
		if (el == "," || el == ".") return acc + el;
		return acc + " " + el;
	});
};

var getWord = function getWord(words, word, count, targetList) {

	var nextWords = words[word];

	var _word = function (nextWords) {
		// return random word if nextwords is none
		// or small random chance
		if (!nextWords || nextWords.length === 0 || randomInt(0, 10) < 1) {
			var keys = Object.keys(words);
			return keys[randomInt(0, keys.length)];
		}
		return nextWords[randomInt(0, nextWords.length)];
	}(nextWords);

	if (count === 0) {
		// we reached zero before END
		targetList.push(_word);
		return targetList;
	}

	if (_word === END) {
		// we reached end
		return targetList;
	}

	targetList = getWord(words, _word, count - 1, targetList);
	targetList.push(_word);
	return targetList;
};

var randomInt = function randomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

var app = function app() {

	//const current = new DatArchive(window.location.origin);
	//let downloadPromise = current.download('/', { "timeout": 50000 });

	// elements
	var buzzwords = document.getElementById('buzzword');
	var like = document.getElementById('like');
	var next = document.getElementById('next');
	var info = document.getElementById('info');
	var app = document.getElementById('app');
	var gen_el = document.getElementById('generation');
	var overlay = document.getElementById('overlay');
	var b_word = document.getElementById('b-word-goes-here');
	var name = document.getElementById('name');
	var name_button = document.getElementById('send');
	var generation = 0;

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

	var stats = function stats(action) {
		fetch("/stats", {
			method: "POST",
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: "action=" + encodeURIComponent(action)
		});
	};

	fetch("data.json").then(function (response) {
		response.text().then(function (text) {
			var words = JSON.parse(text);
			var bound_buzz = buzzing.bind(null, words);
			var exchange = function exchange(_bound_buzz, _buzzwords) {
				stats("next");
				_buzzwords.textContent = bound_buzz();
			};
			buzzwords.textContent = bound_buzz();
			// do all the init here
			next.addEventListener('click', exchange.bind(null, bound_buzz, buzzwords));
			next.classList.remove('disabled');

			// info

			info.addEventListener('click', function () {
				app.classList.toggle("open");
				info.classList.toggle("closed");
			});

			name_button.addEventListener('click', function () {
				var name_v = name.value;
				name_button.textContent = "Sending...";
				fetch("/like", {
					method: "POST",
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					body: "name=" + encodeURIComponent(name_v) + "&phrase=" + encodeURIComponent(buzzwords.textContent)
				}).then(function () {
					name_button.textContent = "Sent :-)";
					window.setTimeout(function () {
						buzzwords.textContent = bound_buzz();
						overlay.style.display = "none";
						name_button.textContent = "Send";
						name.value = "";
					}, 500);
				});
			});

			// test for DatArchive

			like.classList.remove('disabled');

			like.addEventListener('click', function () {

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

});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

require('js/bundle.js');
//# sourceMappingURL=app.js.map