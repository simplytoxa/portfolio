(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function() {
	var exampleModule = {};

	publicMethod();
	init();
	attachEvents();

	function init() {
		// Some code..functions that are needed for module initialization 
	};

	function attachEvents() {
		$('.header').on('click', exampleFunc);
	};

	function exampleFunc(e) {
		e.preventDefault();

		alert("I'm AliveAliv");
	};

	function publicMethod() {
		exampleModule = {
			// name : public function
		}
	};

	window.moduleName = exampleModule;
})();

},{}],2:[function(require,module,exports){
var exampleModule = require('./_modules/exampleModule.js');
},{"./_modules/exampleModule.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxPcGVuc2VydmVyXFxkb21haW5zXFxhcHBzXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJEOi9PcGVuc2VydmVyL2RvbWFpbnMvYXBwcy9hcHAvanMvX21vZHVsZXMvZXhhbXBsZU1vZHVsZS5qcyIsIkQ6L09wZW5zZXJ2ZXIvZG9tYWlucy9hcHBzL2FwcC9qcy9mYWtlXzE4MzRmNGJiLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCI7KGZ1bmN0aW9uKCkge1xyXG5cdHZhciBleGFtcGxlTW9kdWxlID0ge307XHJcblxyXG5cdHB1YmxpY01ldGhvZCgpO1xyXG5cdGluaXQoKTtcclxuXHRhdHRhY2hFdmVudHMoKTtcclxuXHJcblx0ZnVuY3Rpb24gaW5pdCgpIHtcclxuXHRcdC8vIFNvbWUgY29kZS4uZnVuY3Rpb25zIHRoYXQgYXJlIG5lZWRlZCBmb3IgbW9kdWxlIGluaXRpYWxpemF0aW9uIFxyXG5cdH07XHJcblxyXG5cdGZ1bmN0aW9uIGF0dGFjaEV2ZW50cygpIHtcclxuXHRcdCQoJy5oZWFkZXInKS5vbignY2xpY2snLCBleGFtcGxlRnVuYyk7XHJcblx0fTtcclxuXHJcblx0ZnVuY3Rpb24gZXhhbXBsZUZ1bmMoZSkge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdGFsZXJ0KFwiSSdtIEFsaXZlQWxpdlwiKTtcclxuXHR9O1xyXG5cclxuXHRmdW5jdGlvbiBwdWJsaWNNZXRob2QoKSB7XHJcblx0XHRleGFtcGxlTW9kdWxlID0ge1xyXG5cdFx0XHQvLyBuYW1lIDogcHVibGljIGZ1bmN0aW9uXHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0d2luZG93Lm1vZHVsZU5hbWUgPSBleGFtcGxlTW9kdWxlO1xyXG59KSgpO1xyXG4iLCJ2YXIgZXhhbXBsZU1vZHVsZSA9IHJlcXVpcmUoJy4vX21vZHVsZXMvZXhhbXBsZU1vZHVsZS5qcycpOyJdfQ==
