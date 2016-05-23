;(function() {
  var mainModule = {},
      toTopBtn = $('#back-to-top');

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
  
  };

  function attachEvents() {
    $(window).on('scroll', showToTopBtn);
    toTopBtn.on('click', scrollToTheTop);
    $('nav.menu').on('click', 'a', anchorScroll);
  };

  function introText2() {
    $('.intro__text2').typed({
      strings: ['A robot from the future', 'A front-end developer '],
      typeSpeed: 50,
      backDelay: 700,
      showCursor: false,
      callback: introText3
     });
  };
  

  function introText3() {
    $('.intro__text3').typed({
      strings: ["I like to make cool stuff."],
      showCursor: false,
      typeSpeed: 50
     });
  };

  function showToTopBtn() {
    var scrollTop = $(window).scrollTop();

    if (scrollTop > 1000) {
      toTopBtn.fadeIn(600);
    } else {
      toTopBtn.fadeOut(600);
    }
  };

  function scrollToTheTop(e) {
    e.preventDefault();

    var head = $('#head'),
        top = head.offset().top;

    $('html, body').animate({scrollTop: top}, 1000);
  };

  function anchorScroll(e) {
    e.preventDefault();

    var id = $(this).attr('href'),
        top = $(id).offset().top;

    $('html, body').animate({scrollTop: top}, 1000);
  };

  function publicMethod() {
    mainModule = {
      
    }
  };

  window.mainModule = mainModule;
})();
