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
