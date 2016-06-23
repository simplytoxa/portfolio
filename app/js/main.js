;(function() {
  var mainModule = {},
      toTopBtn = $('#back-to-top'),
      logo = $('.logo-img');

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
  
    logo.css({
      'transform': 'rotate(360deg)',
      'transition': 'all 0.5s ease-in-out'
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
        aboutBlockTop = $('.about__container').offset().top,
        form = $('#form'),
        formTop = form.offset().top,
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
    * Parallax effects
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

    /*
    * About section floating columns
    */
    if (wScroll > aboutBlockTop - wHeight) {
      var col1 = $('.about__column-1'),
          col2 = $('.about__column-2'),
          offset = Math.min(0, wScroll - aboutBlockTop + wHeight - 500);


      col1.css({
        'transform': 'translate(' + offset + 'px, ' + Math.abs(offset*0.4) + 'px)'
      });

      col2.css({
        'transform': 'translate(' + Math.abs(offset) + 'px, '+ Math.abs(offset*0.4) + 'px)'
      });
    }


    /*
    * Effects for form
    */
    if (wScroll > formTop - wHeight - 150) {

        form.addClass('animate-top');

      setTimeout(function() {
        form.addClass('animate-back');
      }, 500);

      setTimeout(function() {
        form.addClass('animate-rotation');
      }, 1000);

      setTimeout(function() {
        form.addClass('animate-rotation-back');
      }, 1500);
      
    }
  };

  function publicMethod() {
    mainModule = {
      
    }
  };

  window.mainModule = mainModule;
})();
