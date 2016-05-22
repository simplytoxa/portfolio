;(function(){
  var mainModule = {};

  publicMethod();
  init();
  attachEvents();

  function init() {
     $('.intro__text1').typed({
        strings: ["I'm Anton Povzun."],
        typeSpeed: 50,
        showCursor: false,
        callback: introText2
     });
     
  }

  function attachEvents() {

  }

  function introText2() {
    $('.intro__text2').typed({
        strings: ['A robot from the future', 'A front-end developer '],
        typeSpeed: 50,
        backDelay: 700,
        showCursor: false,
        callback: introText3
     });
  

  function introText3() {
    $('.intro__text3').typed({
        strings: ["I like to make cool stuff."],
        showCursor: false,
        typeSpeed: 50
     });
  }
  function publicMethod() {
    mainModule = {
      
    }
  }

  window.mainModule = mainModule;
})();
