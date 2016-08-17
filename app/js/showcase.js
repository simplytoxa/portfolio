;(() => {
  let showcaseModule = {},
      closeBtn = document.querySelector('#close'),
      worksList = document.querySelector('.works__list'),
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
        text: "This is a working watermark generator created by me and my friends. It's in beta version now, and you can try it just now.",
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
      },
      drugofilter = {
        imgSrc: './img/drugofilter.jpg',
        title: 'Friends filter',
        text: 'Filter you friends from VK.',
        link: 'https://simplytoxa.github.io/drugofilter/',
        figcapture: 'Friends filter'
      };

  publicMethod();
  init();
  attachEvents();

  function init() {
    // Some code..functions that are needed for module initialization 
  }

  function attachEvents() {
    closeBtn.addEventListener('click', closeShowcase);
    worksList.addEventListener('click', showShowcase);
  }

  function closeShowcase(e) {
    e.preventDefault();

    innerShowcase.slideUp(duration);
    showcase.fadeOut(duration);
  }

  function showShowcase(e) {
    e.preventDefault();

    let click = e.target.parentNode,
        img = document.querySelector('#img'),
        title = document.querySelector('#title'),
        text = document.querySelector('#text'),
        link = document.querySelectorAll('.link'),
        figcapture = document.querySelector('#figcapture');

    if (click.className === 'thumb') {
      click = click.parentNode;
    }

    if(click.getAttribute('href') === '#shop') {
      addValues(shop);
    }
    else if(click.getAttribute('href') === '#generator') {
      addValues(generator);
    }
    else if(click.getAttribute('href') === '#iso') {
      addValues(iso);
    }
    else if(click.getAttribute('href') === '#ipadApps') {
      addValues(ipadApps);
    }
    else if(click.getAttribute('href') === '#drugofilter') {
      addValues(drugofilter);
    }

    innerShowcase.fadeIn(duration);
    showcase.slideDown(duration);

    $('html, body').animate({scrollTop: showcase.offset().top}, duration);

    function addValues(obj) {
      img.setAttribute('src', obj.imgSrc);
      title.innerHTML = obj.title;
      text.innerHTML = obj.text;

      for (let i of link) {
        i.setAttribute('href', obj.link);
      }

      figcapture.innerHTML = obj.figcapture;
    }
  }

  function publicMethod() {
    showcaseModule = {
      // name : public function
    }
  }

  window.showcaseModule = showcaseModule;
})();
