;(function() {
  var myModule = {},
      closeBtn = $('#close');

  publicMethod();
  init();
  attachEvents();

  function init() {
    // Some code..functions that are needed for module initialization 
  };

  function attachEvents() {
    closeBtn.on('click', closeShowcase);
  };

  function closeShowcase(e) {
    e.preventDefault();
    console.log('sss');

    var showcase = $('#showcase'),
        innerShowcase = $('#inner-showcase');

    innerShowcase.slideUp(1000);
    showcase.fadeOut(1000, 'linear');
  };

  function publicMethod() {
    myModule = {
      // name : public function
    }
  };

  window.myModule = myModule;
})();
