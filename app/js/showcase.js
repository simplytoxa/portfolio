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
        text: 'This is an example of internet shop. There is a possibility to change view of displayed goods. Created with the help of Jade, SCSS, Jquery',
        link: 'http://shop.apnweb.ru/',
        figcapture: 'Shop'
      },
      generator = {
        imgSrc: './img/generator.jpg',
        title: 'Generator',
        text: "This is a working watermark generator created by me and my freinds. It's in beta version now, and you can try it just now.",
        link: 'http://watermark.unostech.ru/',
        figcapture: 'Generator'
      },
      ipadApps = {
        imgSrc: './img/ipadApps.jpg',
        title: 'Ipad Apps',
        text: 'This is an example page for shop that sells applications for IPads.',
        link: 'http://apps.apnweb.ru/',
        figcapture: 'Ipad Apps'
      },
      iso = {
        imgSrc: './img/iso-mss.jpg',
        title: 'International Certification System',
        text: 'This is a future working page for certificates selling shop.',
        link: 'http://simplytoxa.github.io/',
        figcapture: 'International Certification System'
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
    else if(click.attr('href') === '#iso') {
      addValues(iso);
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
