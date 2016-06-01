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
    $(window).on('scroll', scrollCallback);
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

    if (scrollTop > 900) {
      toTopBtn.fadeIn(600);
    } else {
      toTopBtn.fadeOut(600);
    }
  };

  function scrollToTheTop(e) {
    e.preventDefault();

    var head = $('#head'),
        top = head.offset().top;

    $('html, body').animate({scrollTop: top}, 700);
  };

  function anchorScroll(e) {
    e.preventDefault();

    var id = $(this).attr('href'),
        top = $(id).offset().top;

    $('html, body').animate({scrollTop: top}, 700);
  };

  function scrollCallback() {
    var item = $('.works__item'),
        itemTop = item.offset().top,
        wScroll = $(window).scrollTop(),
        wHeight = $(window).height(),
        img = $('.intro__img-wrap'),
        imgTop = img.offset().top,
        bagBottomEdge = 237;

    /*
     * The appearence of works block
     */
    if (wScroll > itemTop - wHeight / 1.2) {

      item.each(function(i) {
        
        setTimeout(function() {
          item.eq(i).addClass('show');
        },200 * (i+1));

      });
    }

    /*
    * Parallax effect
    */
    if (wScroll > imgTop) {
      // Bag moving
      $('.bag').css({
        'transform': 'translate(0, ' + (wScroll - imgTop) + 'px)'
      });
      if (wScroll > imgTop + bagBottomEdge) {
        $('.bag').css({
          'transform': 'translate(0, ' + bagBottomEdge + 'px)'
        });
      }

      // Boots moving
      $('.boots').css({
        'transform': 'translate(' + -(wScroll - imgTop)/3 + 'px, 0)'
      });

      // Pencil moving
      $('.pencil').css({
        'transform': 'translate(' + (wScroll - imgTop)/11 + 'px, 0)'
      });

      // Phone moving
      $('.phone').css({
        'transform': 'translate(0, ' + -(wScroll - imgTop)/12 + 'px)'
      });

    }
  };

  function publicMethod() {
    mainModule = {
      
    }
  };

  window.mainModule = mainModule;
})();
