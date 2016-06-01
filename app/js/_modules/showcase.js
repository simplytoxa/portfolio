;(function() {
  var showcaseModule = {},
      closeBtn = $('#close'),
      work = $('.works__link'),
      showcase = $('#showcase'),
      innerShowcase = $('#inner-showcase'),
      duration = 300,
      shop = {
        imgSrc: './img/shop.jpg',
        title: 'Shop',
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur voluptates obcaecati distinctio dignissimos, dicta dolorum molestiae illo numquam, nam, esse minus. Eius magni dolorem fugiat commodi totam, sint illo incidunt?',
        link: 'http://shop.apnweb.ru/',
        figcapture: 'Shop'
      },
      generator = {
        imgSrc: './img/generator.jpg',
        title: 'Generator',
        text: 'Это текст рыба!! Это текст рыба!! Это текст рыба!! Это текст рыба!! Это текст рыба!! Это текст рыба!! ',
        link: 'http://watermark.unostech.ru/',
        figcapture: 'Generator'
      },
      ipadApps = {
        imgSrc: './img/generator.jpg',
        title: 'Ipad Apps',
        text: 'Это текст рыба!! Это текст рыба!! Это текст рыба!! Это текст рыба!! Это текст рыба!! Это текст рыба!! ',
        link: 'http://apps.apnweb.ru/',
        figcapture: 'Ipad Apps'
      },
      ostrov = {
        imgSrc: './img/generator.jpg',
        title: 'Ostrov',
        text: 'Это текст рыба!! Это текст рыба!! Это текст рыба!! Это текст рыба!! Это текст рыба!! Это текст рыба!! ',
        link: 'http://watermark.unostech.ru/',
        figcapture: 'Ostrov'
      };

  publicMethod();
  init();
  attachEvents();

  function init() {
    // Some code..functions that are needed for module initialization 
  };

  function attachEvents() {
    closeBtn.on('click', closeShowcase);
    work.on('click', showShowcase);
  };

  function closeShowcase(e) {
    e.preventDefault();

    innerShowcase.slideUp(duration);
    showcase.fadeOut(duration);
  };

  function showShowcase(e) {
    e.preventDefault();

    var click = $(this),
        img = $('#img'),
        title = $('#title'),
        text = $('#text'),
        link = $('.link'),
        figcapture = $('#figcapture');
    
    if(click.attr('href') === '#shop') {
      addValues(shop);
    }
    else if(click.attr('href') === '#generator') {
      addValues(generator);
    }
    else if(click.attr('href') === '#ostrov') {
      addValues(ostrov);
    }
    else if(click.attr('href') === '#ipadApps') {
      addValues(ipadApps);
    }

    innerShowcase.fadeIn(duration);
    showcase.slideDown(duration);

    $('html, body').animate({scrollTop: showcase.offset().top}, duration)

    function addValues(obj) {
      img.attr('src', obj.imgSrc);
      title.text(obj.title);
      text.text(obj.text);
      link.each(function() {
        link.attr('href', obj.link)
      });
      figcapture.text(obj.figcapture)
    };
  };

  function publicMethod() {
    showcaseModule = {
      // name : public function
    }
  };

  window.showcaseModule = showcaseModule;
})();
