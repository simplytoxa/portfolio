(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// The MIT License (MIT)

// Typed.js | Copyright (c) 2014 Matt Boldt | www.mattboldt.com

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.




! function($) {

    "use strict";

    var Typed = function(el, options) {

        // chosen element to manipulate text
        this.el = $(el);

        // options
        this.options = $.extend({}, $.fn.typed.defaults, options);

        // attribute to type into
        this.isInput = this.el.is('input');
        this.attr = this.options.attr;

        // show cursor
        this.showCursor = this.isInput ? false : this.options.showCursor;

        // text content of element
        this.elContent = this.attr ? this.el.attr(this.attr) : this.el.text()

        // html or plain text
        this.contentType = this.options.contentType;

        // typing speed
        this.typeSpeed = this.options.typeSpeed;

        // add a delay before typing starts
        this.startDelay = this.options.startDelay;

        // backspacing speed
        this.backSpeed = this.options.backSpeed;

        // amount of time to wait before backspacing
        this.backDelay = this.options.backDelay;

        // input strings of text
        this.strings = this.options.strings;

        // character number position of current string
        this.strPos = 0;

        // current array position
        this.arrayPos = 0;

        // number to stop backspacing on.
        // default 0, can change depending on how many chars
        // you want to remove at the time
        this.stopNum = 0;

        // Looping logic
        this.loop = this.options.loop;
        this.loopCount = this.options.loopCount;
        this.curLoop = 0;

        // for stopping
        this.stop = false;

        // custom cursor
        this.cursorChar = this.options.cursorChar;

        // shuffle the strings
        this.shuffle = this.options.shuffle;
        // the order of strings
        this.sequence = [];

        // All systems go!
        this.build();
    };

    Typed.prototype = {

        constructor: Typed

        ,
        init: function() {
            // begin the loop w/ first current string (global self.string)
            // current string will be passed as an argument each time after this
            var self = this;
            self.timeout = setTimeout(function() {
                for (var i=0;i<self.strings.length;++i) self.sequence[i]=i;

                // shuffle the array if true
                if(self.shuffle) self.sequence = self.shuffleArray(self.sequence);

                // Start typing
                self.typewrite(self.strings[self.sequence[self.arrayPos]], self.strPos);
            }, self.startDelay);
        }

        ,
        build: function() {
            // Insert cursor
            if (this.showCursor === true) {
                this.cursor = $("<span class=\"typed-cursor\">" + this.cursorChar + "</span>");
                this.el.after(this.cursor);
            }
            this.init();
        }

        // pass current string state to each function, types 1 char per call
        ,
        typewrite: function(curString, curStrPos) {
            // exit when stopped
            if (this.stop === true) {
                return;
            }

            // varying values for setTimeout during typing
            // can't be global since number changes each time loop is executed
            var humanize = Math.round(Math.random() * (100 - 30)) + this.typeSpeed;
            var self = this;

            // ------------- optional ------------- //
            // backpaces a certain string faster
            // ------------------------------------ //
            // if (self.arrayPos == 1){
            //  self.backDelay = 50;
            // }
            // else{ self.backDelay = 500; }

            // contain typing function in a timeout humanize'd delay
            self.timeout = setTimeout(function() {
                // check for an escape character before a pause value
                // format: \^\d+ .. eg: ^1000 .. should be able to print the ^ too using ^^
                // single ^ are removed from string
                var charPause = 0;
                var substr = curString.substr(curStrPos);
                if (substr.charAt(0) === '^') {
                    var skip = 1; // skip atleast 1
                    if (/^\^\d+/.test(substr)) {
                        substr = /\d+/.exec(substr)[0];
                        skip += substr.length;
                        charPause = parseInt(substr);
                    }

                    // strip out the escape character and pause value so they're not printed
                    curString = curString.substring(0, curStrPos) + curString.substring(curStrPos + skip);
                }

                if (self.contentType === 'html') {
                    // skip over html tags while typing
                    var curChar = curString.substr(curStrPos).charAt(0)
                    if (curChar === '<' || curChar === '&') {
                        var tag = '';
                        var endTag = '';
                        if (curChar === '<') {
                            endTag = '>'
                        } else {
                            endTag = ';'
                        }
                        while (curString.substr(curStrPos).charAt(0) !== endTag) {
                            tag += curString.substr(curStrPos).charAt(0);
                            curStrPos++;
                        }
                        curStrPos++;
                        tag += endTag;
                    }
                }

                // timeout for any pause after a character
                self.timeout = setTimeout(function() {
                    if (curStrPos === curString.length) {
                        // fires callback function
                        self.options.onStringTyped(self.arrayPos);

                        // is this the final string
                        if (self.arrayPos === self.strings.length - 1) {
                            // animation that occurs on the last typed string
                            self.options.callback();

                            self.curLoop++;

                            // quit if we wont loop back
                            if (self.loop === false || self.curLoop === self.loopCount)
                                return;
                        }

                        self.timeout = setTimeout(function() {
                            self.backspace(curString, curStrPos);
                        }, self.backDelay);
                    } else {

                        /* call before functions if applicable */
                        if (curStrPos === 0)
                            self.options.preStringTyped(self.arrayPos);

                        // start typing each new char into existing string
                        // curString: arg, self.el.html: original text inside element
                        var nextString = curString.substr(0, curStrPos + 1);
                        if (self.attr) {
                            self.el.attr(self.attr, nextString);
                        } else {
                            if (self.isInput) {
                                self.el.val(nextString);
                            } else if (self.contentType === 'html') {
                                self.el.html(nextString);
                            } else {
                                self.el.text(nextString);
                            }
                        }

                        // add characters one by one
                        curStrPos++;
                        // loop the function
                        self.typewrite(curString, curStrPos);
                    }
                    // end of character pause
                }, charPause);

                // humanized value for typing
            }, humanize);

        }

        ,
        backspace: function(curString, curStrPos) {
            // exit when stopped
            if (this.stop === true) {
                return;
            }

            // varying values for setTimeout during typing
            // can't be global since number changes each time loop is executed
            var humanize = Math.round(Math.random() * (100 - 30)) + this.backSpeed;
            var self = this;

            self.timeout = setTimeout(function() {

                // ----- this part is optional ----- //
                // check string array position
                // on the first string, only delete one word
                // the stopNum actually represents the amount of chars to
                // keep in the current string. In my case it's 14.
                // if (self.arrayPos == 1){
                //  self.stopNum = 14;
                // }
                //every other time, delete the whole typed string
                // else{
                //  self.stopNum = 0;
                // }

                if (self.contentType === 'html') {
                    // skip over html tags while backspacing
                    if (curString.substr(curStrPos).charAt(0) === '>') {
                        var tag = '';
                        while (curString.substr(curStrPos).charAt(0) !== '<') {
                            tag -= curString.substr(curStrPos).charAt(0);
                            curStrPos--;
                        }
                        curStrPos--;
                        tag += '<';
                    }
                }

                // ----- continue important stuff ----- //
                // replace text with base text + typed characters
                var nextString = curString.substr(0, curStrPos);
                if (self.attr) {
                    self.el.attr(self.attr, nextString);
                } else {
                    if (self.isInput) {
                        self.el.val(nextString);
                    } else if (self.contentType === 'html') {
                        self.el.html(nextString);
                    } else {
                        self.el.text(nextString);
                    }
                }

                // if the number (id of character in current string) is
                // less than the stop number, keep going
                if (curStrPos > self.stopNum) {
                    // subtract characters one by one
                    curStrPos--;
                    // loop the function
                    self.backspace(curString, curStrPos);
                }
                // if the stop number has been reached, increase
                // array position to next string
                else if (curStrPos <= self.stopNum) {
                    self.arrayPos++;

                    if (self.arrayPos === self.strings.length) {
                        self.arrayPos = 0;

                        // Shuffle sequence again
                        if(self.shuffle) self.sequence = self.shuffleArray(self.sequence);

                        self.init();
                    } else
                        self.typewrite(self.strings[self.sequence[self.arrayPos]], curStrPos);
                }

                // humanized value for typing
            }, humanize);

        }
        /**
         * Shuffles the numbers in the given array.
         * @param {Array} array
         * @returns {Array}
         */
        ,shuffleArray: function(array) {
            var tmp, current, top = array.length;
            if(top) while(--top) {
                current = Math.floor(Math.random() * (top + 1));
                tmp = array[current];
                array[current] = array[top];
                array[top] = tmp;
            }
            return array;
        }

        // Start & Stop currently not working

        // , stop: function() {
        //     var self = this;

        //     self.stop = true;
        //     clearInterval(self.timeout);
        // }

        // , start: function() {
        //     var self = this;
        //     if(self.stop === false)
        //        return;

        //     this.stop = false;
        //     this.init();
        // }

        // Reset and rebuild the element
        ,
        reset: function() {
            var self = this;
            clearInterval(self.timeout);
            var id = this.el.attr('id');
            this.el.after('<span id="' + id + '"/>')
            this.el.remove();
            if (typeof this.cursor !== 'undefined') {
                this.cursor.remove();
            }
            // Send the callback
            self.options.resetCallback();
        }

    };

    $.fn.typed = function(option) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('typed'),
                options = typeof option == 'object' && option;
            if (!data) $this.data('typed', (data = new Typed(this, options)));
            if (typeof option == 'string') data[option]();
        });
    };

    $.fn.typed.defaults = {
        strings: ["These are the default values...", "You know what you should do?", "Use your own!", "Have a great day!"],
        // typing speed
        typeSpeed: 0,
        // time before typing starts
        startDelay: 0,
        // backspacing speed
        backSpeed: 0,
        // shuffle the strings
        shuffle: false,
        // time before backspacing
        backDelay: 500,
        // loop
        loop: false,
        // false = infinite
        loopCount: false,
        // show cursor
        showCursor: true,
        // character for cursor
        cursorChar: "|",
        // attribute to type (null == text)
        attr: null,
        // either html or text
        contentType: 'html',
        // call when done callback function
        callback: function() {},
        // starting callback function before each string
        preStringTyped: function() {},
        //callback for every typed string
        onStringTyped: function() {},
        // callback for reset
        resetCallback: function() {}
    };


}(window.jQuery);

},{}],2:[function(require,module,exports){
;(function() {
  var formModule = {},
      form = $('.form'),
      fields = form.find('input, textarea');

  publicMethod();
  init();
  attachEvents();

  function init() {
    
  };

  function attachEvents() {
    form.on('submit', submitForm)
    fields.on('keydown', hideTooltip);
    form.on('reset', resetForm);
  };

  function submitForm(e) {
    e.preventDefault();

    var data = form.serialize(),
        url = '//php/form.php',
        valid = true;

    $.each(fields, function(index, domElement) {
      var elem = $(domElement),
          that = $(this),
          value = elem.val(),
          trimedValue = $.trim(value),
          fieldParent = that.parent(),
          tooltipTxt = that.attr('data-tooltip');

      if (trimedValue === '') {
        fieldParent.append(
          '<div class="tooltip-wrap">\
            <div class="tooltip">' + tooltipTxt + '</div>\
          </div>');

        that.addClass('empty-field');

        valid = false;
      }
    });

    if (!valid) return false;
    $.ajax({
      url: url,
      type: 'POST',
      data: data
    })
    .done(function() {
      console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
    
  };

  /**
   * Hide tips on key down event
   * @param  {object} e Event object
   */
  function hideTooltip(e) {
    var that = $(this),
        tooltip = that.siblings('.tooltip-wrap'),
        content = that.val();
    
    if (e.which > 47 && e.which < 91) {
      that.removeClass('empty-field');
      tooltip.remove();
    }
  };


  function resetForm() {
    var tooltips = form.find('.tooltip-wrap');

    fields.removeClass('empty-field');
    tooltips.remove();
  };

  function publicMethod() {
    formModule = {
      
    }
  };

  window.formModule = formModule;
})();

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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
        imgSrc: './img/generator.jpg',
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

},{}],5:[function(require,module,exports){
var type = require('../bower/typed.js/js/typed.js');
var main = require('./_modules/main.js');
var showcase = require('./_modules/showcase.js');
var form = require('./_modules/form.js');

},{"../bower/typed.js/js/typed.js":1,"./_modules/form.js":2,"./_modules/main.js":3,"./_modules/showcase.js":4}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ljZWNhdDA2MjAxNC9wb3J0Zm9saW8vbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2ljZWNhdDA2MjAxNC9wb3J0Zm9saW8vYXBwL2Jvd2VyL3R5cGVkLmpzL2pzL3R5cGVkLmpzIiwiL2hvbWUvaWNlY2F0MDYyMDE0L3BvcnRmb2xpby9hcHAvanMvX21vZHVsZXMvZm9ybS5qcyIsIi9ob21lL2ljZWNhdDA2MjAxNC9wb3J0Zm9saW8vYXBwL2pzL19tb2R1bGVzL21haW4uanMiLCIvaG9tZS9pY2VjYXQwNjIwMTQvcG9ydGZvbGlvL2FwcC9qcy9fbW9kdWxlcy9zaG93Y2FzZS5qcyIsIi9ob21lL2ljZWNhdDA2MjAxNC9wb3J0Zm9saW8vYXBwL2pzL2Zha2VfODRhZTZhNDAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBUaGUgTUlUIExpY2Vuc2UgKE1JVClcblxuLy8gVHlwZWQuanMgfCBDb3B5cmlnaHQgKGMpIDIwMTQgTWF0dCBCb2xkdCB8IHd3dy5tYXR0Ym9sZHQuY29tXG5cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuXG5cblxuISBmdW5jdGlvbigkKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBUeXBlZCA9IGZ1bmN0aW9uKGVsLCBvcHRpb25zKSB7XG5cbiAgICAgICAgLy8gY2hvc2VuIGVsZW1lbnQgdG8gbWFuaXB1bGF0ZSB0ZXh0XG4gICAgICAgIHRoaXMuZWwgPSAkKGVsKTtcblxuICAgICAgICAvLyBvcHRpb25zXG4gICAgICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCAkLmZuLnR5cGVkLmRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgICAgICAvLyBhdHRyaWJ1dGUgdG8gdHlwZSBpbnRvXG4gICAgICAgIHRoaXMuaXNJbnB1dCA9IHRoaXMuZWwuaXMoJ2lucHV0Jyk7XG4gICAgICAgIHRoaXMuYXR0ciA9IHRoaXMub3B0aW9ucy5hdHRyO1xuXG4gICAgICAgIC8vIHNob3cgY3Vyc29yXG4gICAgICAgIHRoaXMuc2hvd0N1cnNvciA9IHRoaXMuaXNJbnB1dCA/IGZhbHNlIDogdGhpcy5vcHRpb25zLnNob3dDdXJzb3I7XG5cbiAgICAgICAgLy8gdGV4dCBjb250ZW50IG9mIGVsZW1lbnRcbiAgICAgICAgdGhpcy5lbENvbnRlbnQgPSB0aGlzLmF0dHIgPyB0aGlzLmVsLmF0dHIodGhpcy5hdHRyKSA6IHRoaXMuZWwudGV4dCgpXG5cbiAgICAgICAgLy8gaHRtbCBvciBwbGFpbiB0ZXh0XG4gICAgICAgIHRoaXMuY29udGVudFR5cGUgPSB0aGlzLm9wdGlvbnMuY29udGVudFR5cGU7XG5cbiAgICAgICAgLy8gdHlwaW5nIHNwZWVkXG4gICAgICAgIHRoaXMudHlwZVNwZWVkID0gdGhpcy5vcHRpb25zLnR5cGVTcGVlZDtcblxuICAgICAgICAvLyBhZGQgYSBkZWxheSBiZWZvcmUgdHlwaW5nIHN0YXJ0c1xuICAgICAgICB0aGlzLnN0YXJ0RGVsYXkgPSB0aGlzLm9wdGlvbnMuc3RhcnREZWxheTtcblxuICAgICAgICAvLyBiYWNrc3BhY2luZyBzcGVlZFxuICAgICAgICB0aGlzLmJhY2tTcGVlZCA9IHRoaXMub3B0aW9ucy5iYWNrU3BlZWQ7XG5cbiAgICAgICAgLy8gYW1vdW50IG9mIHRpbWUgdG8gd2FpdCBiZWZvcmUgYmFja3NwYWNpbmdcbiAgICAgICAgdGhpcy5iYWNrRGVsYXkgPSB0aGlzLm9wdGlvbnMuYmFja0RlbGF5O1xuXG4gICAgICAgIC8vIGlucHV0IHN0cmluZ3Mgb2YgdGV4dFxuICAgICAgICB0aGlzLnN0cmluZ3MgPSB0aGlzLm9wdGlvbnMuc3RyaW5ncztcblxuICAgICAgICAvLyBjaGFyYWN0ZXIgbnVtYmVyIHBvc2l0aW9uIG9mIGN1cnJlbnQgc3RyaW5nXG4gICAgICAgIHRoaXMuc3RyUG9zID0gMDtcblxuICAgICAgICAvLyBjdXJyZW50IGFycmF5IHBvc2l0aW9uXG4gICAgICAgIHRoaXMuYXJyYXlQb3MgPSAwO1xuXG4gICAgICAgIC8vIG51bWJlciB0byBzdG9wIGJhY2tzcGFjaW5nIG9uLlxuICAgICAgICAvLyBkZWZhdWx0IDAsIGNhbiBjaGFuZ2UgZGVwZW5kaW5nIG9uIGhvdyBtYW55IGNoYXJzXG4gICAgICAgIC8vIHlvdSB3YW50IHRvIHJlbW92ZSBhdCB0aGUgdGltZVxuICAgICAgICB0aGlzLnN0b3BOdW0gPSAwO1xuXG4gICAgICAgIC8vIExvb3BpbmcgbG9naWNcbiAgICAgICAgdGhpcy5sb29wID0gdGhpcy5vcHRpb25zLmxvb3A7XG4gICAgICAgIHRoaXMubG9vcENvdW50ID0gdGhpcy5vcHRpb25zLmxvb3BDb3VudDtcbiAgICAgICAgdGhpcy5jdXJMb29wID0gMDtcblxuICAgICAgICAvLyBmb3Igc3RvcHBpbmdcbiAgICAgICAgdGhpcy5zdG9wID0gZmFsc2U7XG5cbiAgICAgICAgLy8gY3VzdG9tIGN1cnNvclxuICAgICAgICB0aGlzLmN1cnNvckNoYXIgPSB0aGlzLm9wdGlvbnMuY3Vyc29yQ2hhcjtcblxuICAgICAgICAvLyBzaHVmZmxlIHRoZSBzdHJpbmdzXG4gICAgICAgIHRoaXMuc2h1ZmZsZSA9IHRoaXMub3B0aW9ucy5zaHVmZmxlO1xuICAgICAgICAvLyB0aGUgb3JkZXIgb2Ygc3RyaW5nc1xuICAgICAgICB0aGlzLnNlcXVlbmNlID0gW107XG5cbiAgICAgICAgLy8gQWxsIHN5c3RlbXMgZ28hXG4gICAgICAgIHRoaXMuYnVpbGQoKTtcbiAgICB9O1xuXG4gICAgVHlwZWQucHJvdG90eXBlID0ge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yOiBUeXBlZFxuXG4gICAgICAgICxcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBiZWdpbiB0aGUgbG9vcCB3LyBmaXJzdCBjdXJyZW50IHN0cmluZyAoZ2xvYmFsIHNlbGYuc3RyaW5nKVxuICAgICAgICAgICAgLy8gY3VycmVudCBzdHJpbmcgd2lsbCBiZSBwYXNzZWQgYXMgYW4gYXJndW1lbnQgZWFjaCB0aW1lIGFmdGVyIHRoaXNcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHNlbGYudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wO2k8c2VsZi5zdHJpbmdzLmxlbmd0aDsrK2kpIHNlbGYuc2VxdWVuY2VbaV09aTtcblxuICAgICAgICAgICAgICAgIC8vIHNodWZmbGUgdGhlIGFycmF5IGlmIHRydWVcbiAgICAgICAgICAgICAgICBpZihzZWxmLnNodWZmbGUpIHNlbGYuc2VxdWVuY2UgPSBzZWxmLnNodWZmbGVBcnJheShzZWxmLnNlcXVlbmNlKTtcblxuICAgICAgICAgICAgICAgIC8vIFN0YXJ0IHR5cGluZ1xuICAgICAgICAgICAgICAgIHNlbGYudHlwZXdyaXRlKHNlbGYuc3RyaW5nc1tzZWxmLnNlcXVlbmNlW3NlbGYuYXJyYXlQb3NdXSwgc2VsZi5zdHJQb3MpO1xuICAgICAgICAgICAgfSwgc2VsZi5zdGFydERlbGF5KTtcbiAgICAgICAgfVxuXG4gICAgICAgICxcbiAgICAgICAgYnVpbGQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gSW5zZXJ0IGN1cnNvclxuICAgICAgICAgICAgaWYgKHRoaXMuc2hvd0N1cnNvciA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3Vyc29yID0gJChcIjxzcGFuIGNsYXNzPVxcXCJ0eXBlZC1jdXJzb3JcXFwiPlwiICsgdGhpcy5jdXJzb3JDaGFyICsgXCI8L3NwYW4+XCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuZWwuYWZ0ZXIodGhpcy5jdXJzb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBwYXNzIGN1cnJlbnQgc3RyaW5nIHN0YXRlIHRvIGVhY2ggZnVuY3Rpb24sIHR5cGVzIDEgY2hhciBwZXIgY2FsbFxuICAgICAgICAsXG4gICAgICAgIHR5cGV3cml0ZTogZnVuY3Rpb24oY3VyU3RyaW5nLCBjdXJTdHJQb3MpIHtcbiAgICAgICAgICAgIC8vIGV4aXQgd2hlbiBzdG9wcGVkXG4gICAgICAgICAgICBpZiAodGhpcy5zdG9wID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB2YXJ5aW5nIHZhbHVlcyBmb3Igc2V0VGltZW91dCBkdXJpbmcgdHlwaW5nXG4gICAgICAgICAgICAvLyBjYW4ndCBiZSBnbG9iYWwgc2luY2UgbnVtYmVyIGNoYW5nZXMgZWFjaCB0aW1lIGxvb3AgaXMgZXhlY3V0ZWRcbiAgICAgICAgICAgIHZhciBodW1hbml6ZSA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqICgxMDAgLSAzMCkpICsgdGhpcy50eXBlU3BlZWQ7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0gb3B0aW9uYWwgLS0tLS0tLS0tLS0tLSAvL1xuICAgICAgICAgICAgLy8gYmFja3BhY2VzIGEgY2VydGFpbiBzdHJpbmcgZmFzdGVyXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cbiAgICAgICAgICAgIC8vIGlmIChzZWxmLmFycmF5UG9zID09IDEpe1xuICAgICAgICAgICAgLy8gIHNlbGYuYmFja0RlbGF5ID0gNTA7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAvLyBlbHNleyBzZWxmLmJhY2tEZWxheSA9IDUwMDsgfVxuXG4gICAgICAgICAgICAvLyBjb250YWluIHR5cGluZyBmdW5jdGlvbiBpbiBhIHRpbWVvdXQgaHVtYW5pemUnZCBkZWxheVxuICAgICAgICAgICAgc2VsZi50aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3IgYW4gZXNjYXBlIGNoYXJhY3RlciBiZWZvcmUgYSBwYXVzZSB2YWx1ZVxuICAgICAgICAgICAgICAgIC8vIGZvcm1hdDogXFxeXFxkKyAuLiBlZzogXjEwMDAgLi4gc2hvdWxkIGJlIGFibGUgdG8gcHJpbnQgdGhlIF4gdG9vIHVzaW5nIF5eXG4gICAgICAgICAgICAgICAgLy8gc2luZ2xlIF4gYXJlIHJlbW92ZWQgZnJvbSBzdHJpbmdcbiAgICAgICAgICAgICAgICB2YXIgY2hhclBhdXNlID0gMDtcbiAgICAgICAgICAgICAgICB2YXIgc3Vic3RyID0gY3VyU3RyaW5nLnN1YnN0cihjdXJTdHJQb3MpO1xuICAgICAgICAgICAgICAgIGlmIChzdWJzdHIuY2hhckF0KDApID09PSAnXicpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNraXAgPSAxOyAvLyBza2lwIGF0bGVhc3QgMVxuICAgICAgICAgICAgICAgICAgICBpZiAoL15cXF5cXGQrLy50ZXN0KHN1YnN0cikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnN0ciA9IC9cXGQrLy5leGVjKHN1YnN0cilbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBza2lwICs9IHN1YnN0ci5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFyUGF1c2UgPSBwYXJzZUludChzdWJzdHIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gc3RyaXAgb3V0IHRoZSBlc2NhcGUgY2hhcmFjdGVyIGFuZCBwYXVzZSB2YWx1ZSBzbyB0aGV5J3JlIG5vdCBwcmludGVkXG4gICAgICAgICAgICAgICAgICAgIGN1clN0cmluZyA9IGN1clN0cmluZy5zdWJzdHJpbmcoMCwgY3VyU3RyUG9zKSArIGN1clN0cmluZy5zdWJzdHJpbmcoY3VyU3RyUG9zICsgc2tpcCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuY29udGVudFR5cGUgPT09ICdodG1sJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBza2lwIG92ZXIgaHRtbCB0YWdzIHdoaWxlIHR5cGluZ1xuICAgICAgICAgICAgICAgICAgICB2YXIgY3VyQ2hhciA9IGN1clN0cmluZy5zdWJzdHIoY3VyU3RyUG9zKS5jaGFyQXQoMClcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckNoYXIgPT09ICc8JyB8fCBjdXJDaGFyID09PSAnJicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0YWcgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbmRUYWcgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJDaGFyID09PSAnPCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRUYWcgPSAnPidcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVGFnID0gJzsnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoY3VyU3RyaW5nLnN1YnN0cihjdXJTdHJQb3MpLmNoYXJBdCgwKSAhPT0gZW5kVGFnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnICs9IGN1clN0cmluZy5zdWJzdHIoY3VyU3RyUG9zKS5jaGFyQXQoMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyU3RyUG9zKys7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJTdHJQb3MrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZyArPSBlbmRUYWc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyB0aW1lb3V0IGZvciBhbnkgcGF1c2UgYWZ0ZXIgYSBjaGFyYWN0ZXJcbiAgICAgICAgICAgICAgICBzZWxmLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyU3RyUG9zID09PSBjdXJTdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmaXJlcyBjYWxsYmFjayBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5vcHRpb25zLm9uU3RyaW5nVHlwZWQoc2VsZi5hcnJheVBvcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlzIHRoaXMgdGhlIGZpbmFsIHN0cmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuYXJyYXlQb3MgPT09IHNlbGYuc3RyaW5ncy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW5pbWF0aW9uIHRoYXQgb2NjdXJzIG9uIHRoZSBsYXN0IHR5cGVkIHN0cmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYub3B0aW9ucy5jYWxsYmFjaygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jdXJMb29wKys7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBxdWl0IGlmIHdlIHdvbnQgbG9vcCBiYWNrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYubG9vcCA9PT0gZmFsc2UgfHwgc2VsZi5jdXJMb29wID09PSBzZWxmLmxvb3BDb3VudClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYmFja3NwYWNlKGN1clN0cmluZywgY3VyU3RyUG9zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHNlbGYuYmFja0RlbGF5KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogY2FsbCBiZWZvcmUgZnVuY3Rpb25zIGlmIGFwcGxpY2FibGUgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJTdHJQb3MgPT09IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5vcHRpb25zLnByZVN0cmluZ1R5cGVkKHNlbGYuYXJyYXlQb3MpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzdGFydCB0eXBpbmcgZWFjaCBuZXcgY2hhciBpbnRvIGV4aXN0aW5nIHN0cmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY3VyU3RyaW5nOiBhcmcsIHNlbGYuZWwuaHRtbDogb3JpZ2luYWwgdGV4dCBpbnNpZGUgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5leHRTdHJpbmcgPSBjdXJTdHJpbmcuc3Vic3RyKDAsIGN1clN0clBvcyArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuYXR0cikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuYXR0cihzZWxmLmF0dHIsIG5leHRTdHJpbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5pc0lucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwudmFsKG5leHRTdHJpbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZi5jb250ZW50VHlwZSA9PT0gJ2h0bWwnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZWwuaHRtbChuZXh0U3RyaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLnRleHQobmV4dFN0cmluZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGQgY2hhcmFjdGVycyBvbmUgYnkgb25lXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJTdHJQb3MrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxvb3AgdGhlIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnR5cGV3cml0ZShjdXJTdHJpbmcsIGN1clN0clBvcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gZW5kIG9mIGNoYXJhY3RlciBwYXVzZVxuICAgICAgICAgICAgICAgIH0sIGNoYXJQYXVzZSk7XG5cbiAgICAgICAgICAgICAgICAvLyBodW1hbml6ZWQgdmFsdWUgZm9yIHR5cGluZ1xuICAgICAgICAgICAgfSwgaHVtYW5pemUpO1xuXG4gICAgICAgIH1cblxuICAgICAgICAsXG4gICAgICAgIGJhY2tzcGFjZTogZnVuY3Rpb24oY3VyU3RyaW5nLCBjdXJTdHJQb3MpIHtcbiAgICAgICAgICAgIC8vIGV4aXQgd2hlbiBzdG9wcGVkXG4gICAgICAgICAgICBpZiAodGhpcy5zdG9wID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB2YXJ5aW5nIHZhbHVlcyBmb3Igc2V0VGltZW91dCBkdXJpbmcgdHlwaW5nXG4gICAgICAgICAgICAvLyBjYW4ndCBiZSBnbG9iYWwgc2luY2UgbnVtYmVyIGNoYW5nZXMgZWFjaCB0aW1lIGxvb3AgaXMgZXhlY3V0ZWRcbiAgICAgICAgICAgIHZhciBodW1hbml6ZSA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqICgxMDAgLSAzMCkpICsgdGhpcy5iYWNrU3BlZWQ7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHNlbGYudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAvLyAtLS0tLSB0aGlzIHBhcnQgaXMgb3B0aW9uYWwgLS0tLS0gLy9cbiAgICAgICAgICAgICAgICAvLyBjaGVjayBzdHJpbmcgYXJyYXkgcG9zaXRpb25cbiAgICAgICAgICAgICAgICAvLyBvbiB0aGUgZmlyc3Qgc3RyaW5nLCBvbmx5IGRlbGV0ZSBvbmUgd29yZFxuICAgICAgICAgICAgICAgIC8vIHRoZSBzdG9wTnVtIGFjdHVhbGx5IHJlcHJlc2VudHMgdGhlIGFtb3VudCBvZiBjaGFycyB0b1xuICAgICAgICAgICAgICAgIC8vIGtlZXAgaW4gdGhlIGN1cnJlbnQgc3RyaW5nLiBJbiBteSBjYXNlIGl0J3MgMTQuXG4gICAgICAgICAgICAgICAgLy8gaWYgKHNlbGYuYXJyYXlQb3MgPT0gMSl7XG4gICAgICAgICAgICAgICAgLy8gIHNlbGYuc3RvcE51bSA9IDE0O1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAvL2V2ZXJ5IG90aGVyIHRpbWUsIGRlbGV0ZSB0aGUgd2hvbGUgdHlwZWQgc3RyaW5nXG4gICAgICAgICAgICAgICAgLy8gZWxzZXtcbiAgICAgICAgICAgICAgICAvLyAgc2VsZi5zdG9wTnVtID0gMDtcbiAgICAgICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5jb250ZW50VHlwZSA9PT0gJ2h0bWwnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNraXAgb3ZlciBodG1sIHRhZ3Mgd2hpbGUgYmFja3NwYWNpbmdcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1clN0cmluZy5zdWJzdHIoY3VyU3RyUG9zKS5jaGFyQXQoMCkgPT09ICc+Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRhZyA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGN1clN0cmluZy5zdWJzdHIoY3VyU3RyUG9zKS5jaGFyQXQoMCkgIT09ICc8Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhZyAtPSBjdXJTdHJpbmcuc3Vic3RyKGN1clN0clBvcykuY2hhckF0KDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1clN0clBvcy0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyU3RyUG9zLS07XG4gICAgICAgICAgICAgICAgICAgICAgICB0YWcgKz0gJzwnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gLS0tLS0gY29udGludWUgaW1wb3J0YW50IHN0dWZmIC0tLS0tIC8vXG4gICAgICAgICAgICAgICAgLy8gcmVwbGFjZSB0ZXh0IHdpdGggYmFzZSB0ZXh0ICsgdHlwZWQgY2hhcmFjdGVyc1xuICAgICAgICAgICAgICAgIHZhciBuZXh0U3RyaW5nID0gY3VyU3RyaW5nLnN1YnN0cigwLCBjdXJTdHJQb3MpO1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmF0dHIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC5hdHRyKHNlbGYuYXR0ciwgbmV4dFN0cmluZyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuaXNJbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbC52YWwobmV4dFN0cmluZyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZi5jb250ZW50VHlwZSA9PT0gJ2h0bWwnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLmh0bWwobmV4dFN0cmluZyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVsLnRleHQobmV4dFN0cmluZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgbnVtYmVyIChpZCBvZiBjaGFyYWN0ZXIgaW4gY3VycmVudCBzdHJpbmcpIGlzXG4gICAgICAgICAgICAgICAgLy8gbGVzcyB0aGFuIHRoZSBzdG9wIG51bWJlciwga2VlcCBnb2luZ1xuICAgICAgICAgICAgICAgIGlmIChjdXJTdHJQb3MgPiBzZWxmLnN0b3BOdW0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gc3VidHJhY3QgY2hhcmFjdGVycyBvbmUgYnkgb25lXG4gICAgICAgICAgICAgICAgICAgIGN1clN0clBvcy0tO1xuICAgICAgICAgICAgICAgICAgICAvLyBsb29wIHRoZSBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICBzZWxmLmJhY2tzcGFjZShjdXJTdHJpbmcsIGN1clN0clBvcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBzdG9wIG51bWJlciBoYXMgYmVlbiByZWFjaGVkLCBpbmNyZWFzZVxuICAgICAgICAgICAgICAgIC8vIGFycmF5IHBvc2l0aW9uIHRvIG5leHQgc3RyaW5nXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY3VyU3RyUG9zIDw9IHNlbGYuc3RvcE51bSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFycmF5UG9zKys7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuYXJyYXlQb3MgPT09IHNlbGYuc3RyaW5ncy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYXJyYXlQb3MgPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTaHVmZmxlIHNlcXVlbmNlIGFnYWluXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzZWxmLnNodWZmbGUpIHNlbGYuc2VxdWVuY2UgPSBzZWxmLnNodWZmbGVBcnJheShzZWxmLnNlcXVlbmNlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbml0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi50eXBld3JpdGUoc2VsZi5zdHJpbmdzW3NlbGYuc2VxdWVuY2Vbc2VsZi5hcnJheVBvc11dLCBjdXJTdHJQb3MpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGh1bWFuaXplZCB2YWx1ZSBmb3IgdHlwaW5nXG4gICAgICAgICAgICB9LCBodW1hbml6ZSk7XG5cbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogU2h1ZmZsZXMgdGhlIG51bWJlcnMgaW4gdGhlIGdpdmVuIGFycmF5LlxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheVxuICAgICAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICAsc2h1ZmZsZUFycmF5OiBmdW5jdGlvbihhcnJheSkge1xuICAgICAgICAgICAgdmFyIHRtcCwgY3VycmVudCwgdG9wID0gYXJyYXkubGVuZ3RoO1xuICAgICAgICAgICAgaWYodG9wKSB3aGlsZSgtLXRvcCkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAodG9wICsgMSkpO1xuICAgICAgICAgICAgICAgIHRtcCA9IGFycmF5W2N1cnJlbnRdO1xuICAgICAgICAgICAgICAgIGFycmF5W2N1cnJlbnRdID0gYXJyYXlbdG9wXTtcbiAgICAgICAgICAgICAgICBhcnJheVt0b3BdID0gdG1wO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3RhcnQgJiBTdG9wIGN1cnJlbnRseSBub3Qgd29ya2luZ1xuXG4gICAgICAgIC8vICwgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgLy8gICAgIHNlbGYuc3RvcCA9IHRydWU7XG4gICAgICAgIC8vICAgICBjbGVhckludGVydmFsKHNlbGYudGltZW91dCk7XG4gICAgICAgIC8vIH1cblxuICAgICAgICAvLyAsIHN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgLy8gICAgIGlmKHNlbGYuc3RvcCA9PT0gZmFsc2UpXG4gICAgICAgIC8vICAgICAgICByZXR1cm47XG5cbiAgICAgICAgLy8gICAgIHRoaXMuc3RvcCA9IGZhbHNlO1xuICAgICAgICAvLyAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIC8vIH1cblxuICAgICAgICAvLyBSZXNldCBhbmQgcmVidWlsZCB0aGUgZWxlbWVudFxuICAgICAgICAsXG4gICAgICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoc2VsZi50aW1lb3V0KTtcbiAgICAgICAgICAgIHZhciBpZCA9IHRoaXMuZWwuYXR0cignaWQnKTtcbiAgICAgICAgICAgIHRoaXMuZWwuYWZ0ZXIoJzxzcGFuIGlkPVwiJyArIGlkICsgJ1wiLz4nKVxuICAgICAgICAgICAgdGhpcy5lbC5yZW1vdmUoKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5jdXJzb3IgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJzb3IucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTZW5kIHRoZSBjYWxsYmFja1xuICAgICAgICAgICAgc2VsZi5vcHRpb25zLnJlc2V0Q2FsbGJhY2soKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgICQuZm4udHlwZWQgPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgZGF0YSA9ICR0aGlzLmRhdGEoJ3R5cGVkJyksXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uO1xuICAgICAgICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCd0eXBlZCcsIChkYXRhID0gbmV3IFR5cGVkKHRoaXMsIG9wdGlvbnMpKSk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkLmZuLnR5cGVkLmRlZmF1bHRzID0ge1xuICAgICAgICBzdHJpbmdzOiBbXCJUaGVzZSBhcmUgdGhlIGRlZmF1bHQgdmFsdWVzLi4uXCIsIFwiWW91IGtub3cgd2hhdCB5b3Ugc2hvdWxkIGRvP1wiLCBcIlVzZSB5b3VyIG93biFcIiwgXCJIYXZlIGEgZ3JlYXQgZGF5IVwiXSxcbiAgICAgICAgLy8gdHlwaW5nIHNwZWVkXG4gICAgICAgIHR5cGVTcGVlZDogMCxcbiAgICAgICAgLy8gdGltZSBiZWZvcmUgdHlwaW5nIHN0YXJ0c1xuICAgICAgICBzdGFydERlbGF5OiAwLFxuICAgICAgICAvLyBiYWNrc3BhY2luZyBzcGVlZFxuICAgICAgICBiYWNrU3BlZWQ6IDAsXG4gICAgICAgIC8vIHNodWZmbGUgdGhlIHN0cmluZ3NcbiAgICAgICAgc2h1ZmZsZTogZmFsc2UsXG4gICAgICAgIC8vIHRpbWUgYmVmb3JlIGJhY2tzcGFjaW5nXG4gICAgICAgIGJhY2tEZWxheTogNTAwLFxuICAgICAgICAvLyBsb29wXG4gICAgICAgIGxvb3A6IGZhbHNlLFxuICAgICAgICAvLyBmYWxzZSA9IGluZmluaXRlXG4gICAgICAgIGxvb3BDb3VudDogZmFsc2UsXG4gICAgICAgIC8vIHNob3cgY3Vyc29yXG4gICAgICAgIHNob3dDdXJzb3I6IHRydWUsXG4gICAgICAgIC8vIGNoYXJhY3RlciBmb3IgY3Vyc29yXG4gICAgICAgIGN1cnNvckNoYXI6IFwifFwiLFxuICAgICAgICAvLyBhdHRyaWJ1dGUgdG8gdHlwZSAobnVsbCA9PSB0ZXh0KVxuICAgICAgICBhdHRyOiBudWxsLFxuICAgICAgICAvLyBlaXRoZXIgaHRtbCBvciB0ZXh0XG4gICAgICAgIGNvbnRlbnRUeXBlOiAnaHRtbCcsXG4gICAgICAgIC8vIGNhbGwgd2hlbiBkb25lIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbigpIHt9LFxuICAgICAgICAvLyBzdGFydGluZyBjYWxsYmFjayBmdW5jdGlvbiBiZWZvcmUgZWFjaCBzdHJpbmdcbiAgICAgICAgcHJlU3RyaW5nVHlwZWQ6IGZ1bmN0aW9uKCkge30sXG4gICAgICAgIC8vY2FsbGJhY2sgZm9yIGV2ZXJ5IHR5cGVkIHN0cmluZ1xuICAgICAgICBvblN0cmluZ1R5cGVkOiBmdW5jdGlvbigpIHt9LFxuICAgICAgICAvLyBjYWxsYmFjayBmb3IgcmVzZXRcbiAgICAgICAgcmVzZXRDYWxsYmFjazogZnVuY3Rpb24oKSB7fVxuICAgIH07XG5cblxufSh3aW5kb3cualF1ZXJ5KTtcbiIsIjsoZnVuY3Rpb24oKSB7XHJcbiAgdmFyIGZvcm1Nb2R1bGUgPSB7fSxcclxuICAgICAgZm9ybSA9ICQoJy5mb3JtJyksXHJcbiAgICAgIGZpZWxkcyA9IGZvcm0uZmluZCgnaW5wdXQsIHRleHRhcmVhJyk7XHJcblxyXG4gIHB1YmxpY01ldGhvZCgpO1xyXG4gIGluaXQoKTtcclxuICBhdHRhY2hFdmVudHMoKTtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIFxyXG4gIH07XHJcblxyXG4gIGZ1bmN0aW9uIGF0dGFjaEV2ZW50cygpIHtcclxuICAgIGZvcm0ub24oJ3N1Ym1pdCcsIHN1Ym1pdEZvcm0pXHJcbiAgICBmaWVsZHMub24oJ2tleWRvd24nLCBoaWRlVG9vbHRpcCk7XHJcbiAgICBmb3JtLm9uKCdyZXNldCcsIHJlc2V0Rm9ybSk7XHJcbiAgfTtcclxuXHJcbiAgZnVuY3Rpb24gc3VibWl0Rm9ybShlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgdmFyIGRhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpLFxyXG4gICAgICAgIHVybCA9ICcvL3BocC9mb3JtLnBocCcsXHJcbiAgICAgICAgdmFsaWQgPSB0cnVlO1xyXG5cclxuICAgICQuZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGluZGV4LCBkb21FbGVtZW50KSB7XHJcbiAgICAgIHZhciBlbGVtID0gJChkb21FbGVtZW50KSxcclxuICAgICAgICAgIHRoYXQgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgdmFsdWUgPSBlbGVtLnZhbCgpLFxyXG4gICAgICAgICAgdHJpbWVkVmFsdWUgPSAkLnRyaW0odmFsdWUpLFxyXG4gICAgICAgICAgZmllbGRQYXJlbnQgPSB0aGF0LnBhcmVudCgpLFxyXG4gICAgICAgICAgdG9vbHRpcFR4dCA9IHRoYXQuYXR0cignZGF0YS10b29sdGlwJyk7XHJcblxyXG4gICAgICBpZiAodHJpbWVkVmFsdWUgPT09ICcnKSB7XHJcbiAgICAgICAgZmllbGRQYXJlbnQuYXBwZW5kKFxyXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJ0b29sdGlwLXdyYXBcIj5cXFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidG9vbHRpcFwiPicgKyB0b29sdGlwVHh0ICsgJzwvZGl2PlxcXHJcbiAgICAgICAgICA8L2Rpdj4nKTtcclxuXHJcbiAgICAgICAgdGhhdC5hZGRDbGFzcygnZW1wdHktZmllbGQnKTtcclxuXHJcbiAgICAgICAgdmFsaWQgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCF2YWxpZCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgdXJsOiB1cmwsXHJcbiAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgZGF0YTogZGF0YVxyXG4gICAgfSlcclxuICAgIC5kb25lKGZ1bmN0aW9uKCkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3NcIik7XHJcbiAgICB9KVxyXG4gICAgLmZhaWwoZnVuY3Rpb24oKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3JcIik7XHJcbiAgICB9KVxyXG4gICAgLmFsd2F5cyhmdW5jdGlvbigpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJjb21wbGV0ZVwiKTtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogSGlkZSB0aXBzIG9uIGtleSBkb3duIGV2ZW50XHJcbiAgICogQHBhcmFtICB7b2JqZWN0fSBlIEV2ZW50IG9iamVjdFxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGhpZGVUb29sdGlwKGUpIHtcclxuICAgIHZhciB0aGF0ID0gJCh0aGlzKSxcclxuICAgICAgICB0b29sdGlwID0gdGhhdC5zaWJsaW5ncygnLnRvb2x0aXAtd3JhcCcpLFxyXG4gICAgICAgIGNvbnRlbnQgPSB0aGF0LnZhbCgpO1xyXG4gICAgXHJcbiAgICBpZiAoZS53aGljaCA+IDQ3ICYmIGUud2hpY2ggPCA5MSkge1xyXG4gICAgICB0aGF0LnJlbW92ZUNsYXNzKCdlbXB0eS1maWVsZCcpO1xyXG4gICAgICB0b29sdGlwLnJlbW92ZSgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG5cclxuICBmdW5jdGlvbiByZXNldEZvcm0oKSB7XHJcbiAgICB2YXIgdG9vbHRpcHMgPSBmb3JtLmZpbmQoJy50b29sdGlwLXdyYXAnKTtcclxuXHJcbiAgICBmaWVsZHMucmVtb3ZlQ2xhc3MoJ2VtcHR5LWZpZWxkJyk7XHJcbiAgICB0b29sdGlwcy5yZW1vdmUoKTtcclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBwdWJsaWNNZXRob2QoKSB7XHJcbiAgICBmb3JtTW9kdWxlID0ge1xyXG4gICAgICBcclxuICAgIH1cclxuICB9O1xyXG5cclxuICB3aW5kb3cuZm9ybU1vZHVsZSA9IGZvcm1Nb2R1bGU7XHJcbn0pKCk7XHJcbiIsIjsoZnVuY3Rpb24oKSB7XG4gIHZhciBtYWluTW9kdWxlID0ge30sXG4gICAgICB0b1RvcEJ0biA9ICQoJyNiYWNrLXRvLXRvcCcpLFxuICAgICAgbG9nbyA9ICQoJy5sb2dvLWltZycpO1xuXG4gIHB1YmxpY01ldGhvZCgpO1xuICBpbml0KCk7XG4gIGF0dGFjaEV2ZW50cygpO1xuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgJCgnLmludHJvX190ZXh0MScpLnR5cGVkKHtcbiAgICAgIHN0cmluZ3M6IFtcIkknbSBBbnRvbiBQb3Z6dW4uXCJdLFxuICAgICAgdHlwZVNwZWVkOiA1MCxcbiAgICAgIHNob3dDdXJzb3I6IGZhbHNlLFxuICAgICAgY2FsbGJhY2s6IGludHJvVGV4dDJcbiAgICB9KTtcbiAgXG4gICAgbG9nby5jc3Moe1xuICAgICAgJ3RyYW5zZm9ybSc6ICdyb3RhdGUoMzYwZGVnKScsXG4gICAgICAndHJhbnNpdGlvbic6ICdhbGwgMC41cyBlYXNlLWluLW91dCdcbiAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBhdHRhY2hFdmVudHMoKSB7XG4gICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBzaG93VG9Ub3BCdG4pO1xuICAgIHRvVG9wQnRuLm9uKCdjbGljaycsIHNjcm9sbFRvVGhlVG9wKTtcbiAgICAkKCduYXYubWVudScpLm9uKCdjbGljaycsICdhJywgYW5jaG9yU2Nyb2xsKTtcbiAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIHNjcm9sbENhbGxiYWNrKTtcbiAgfTtcblxuICBmdW5jdGlvbiBpbnRyb1RleHQyKCkge1xuICAgICQoJy5pbnRyb19fdGV4dDInKS50eXBlZCh7XG4gICAgICBzdHJpbmdzOiBbJ0Egcm9ib3QgZnJvbSB0aGUgZnV0dXJlJywgJ0EgZnJvbnQtZW5kIGRldmVsb3BlciAnXSxcbiAgICAgIHR5cGVTcGVlZDogNTAsXG4gICAgICBiYWNrRGVsYXk6IDcwMCxcbiAgICAgIHNob3dDdXJzb3I6IGZhbHNlLFxuICAgICAgY2FsbGJhY2s6IGludHJvVGV4dDNcbiAgICAgfSk7XG4gIH07XG4gIFxuXG4gIGZ1bmN0aW9uIGludHJvVGV4dDMoKSB7XG4gICAgJCgnLmludHJvX190ZXh0MycpLnR5cGVkKHtcbiAgICAgIHN0cmluZ3M6IFtcIkkgbGlrZSB0byBtYWtlIGNvb2wgc3R1ZmYuXCJdLFxuICAgICAgc2hvd0N1cnNvcjogZmFsc2UsXG4gICAgICB0eXBlU3BlZWQ6IDUwXG4gICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHNob3dUb1RvcEJ0bigpIHtcbiAgICB2YXIgc2Nyb2xsVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgaWYgKHNjcm9sbFRvcCA+IDkwMCkge1xuICAgICAgdG9Ub3BCdG4uZmFkZUluKDYwMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRvVG9wQnRuLmZhZGVPdXQoNjAwKTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gc2Nyb2xsVG9UaGVUb3AoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIHZhciBoZWFkID0gJCgnI2hlYWQnKSxcbiAgICAgICAgdG9wID0gaGVhZC5vZmZzZXQoKS50b3A7XG5cbiAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiB0b3B9LCA3MDApO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGFuY2hvclNjcm9sbChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdmFyIGlkID0gJCh0aGlzKS5hdHRyKCdocmVmJyksXG4gICAgICAgIHRvcCA9ICQoaWQpLm9mZnNldCgpLnRvcDtcblxuICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtzY3JvbGxUb3A6IHRvcH0sIDcwMCk7XG4gIH07XG5cbiAgZnVuY3Rpb24gc2Nyb2xsQ2FsbGJhY2soKSB7XG4gICAgdmFyIGl0ZW0gPSAkKCcud29ya3NfX2l0ZW0nKSxcbiAgICAgICAgaXRlbVRvcCA9IGl0ZW0ub2Zmc2V0KCkudG9wLFxuICAgICAgICB3U2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpLFxuICAgICAgICB3SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpLFxuICAgICAgICBpbWcgPSAkKCcuaW50cm9fX2ltZy13cmFwJyksXG4gICAgICAgIGltZ1RvcCA9IGltZy5vZmZzZXQoKS50b3AsXG4gICAgICAgIGFib3V0QmxvY2tUb3AgPSAkKCcuYWJvdXRfX2NvbnRhaW5lcicpLm9mZnNldCgpLnRvcCxcbiAgICAgICAgZm9ybSA9ICQoJyNmb3JtJyksXG4gICAgICAgIGZvcm1Ub3AgPSBmb3JtLm9mZnNldCgpLnRvcCxcbiAgICAgICAgYmFnQm90dG9tRWRnZSA9IDIzNztcblxuICAgIC8qXG4gICAgICogVGhlIGFwcGVhcmVuY2Ugb2Ygd29ya3MgYmxvY2tcbiAgICAgKi9cbiAgICBpZiAod1Njcm9sbCA+IGl0ZW1Ub3AgLSB3SGVpZ2h0IC8gMS4yKSB7XG5cbiAgICAgIGl0ZW0uZWFjaChmdW5jdGlvbihpKSB7XG4gICAgICAgIFxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGl0ZW0uZXEoaSkuYWRkQ2xhc3MoJ3Nob3cnKTtcbiAgICAgICAgfSwyMDAgKiAoaSsxKSk7XG5cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qXG4gICAgKiBQYXJhbGxheCBlZmZlY3RzXG4gICAgKi9cbiAgICBpZiAod1Njcm9sbCA+IGltZ1RvcCkge1xuICAgICAgLy8gQmFnIG1vdmluZ1xuICAgICAgJCgnLmJhZycpLmNzcyh7XG4gICAgICAgICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlKDAsICcgKyAod1Njcm9sbCAtIGltZ1RvcCkgKyAncHgpJ1xuICAgICAgfSk7XG4gICAgICBpZiAod1Njcm9sbCA+IGltZ1RvcCArIGJhZ0JvdHRvbUVkZ2UpIHtcbiAgICAgICAgJCgnLmJhZycpLmNzcyh7XG4gICAgICAgICAgJ3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUoMCwgJyArIGJhZ0JvdHRvbUVkZ2UgKyAncHgpJ1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gQm9vdHMgbW92aW5nXG4gICAgICAkKCcuYm9vdHMnKS5jc3Moe1xuICAgICAgICAndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZSgnICsgLSh3U2Nyb2xsIC0gaW1nVG9wKS8zICsgJ3B4LCAwKSdcbiAgICAgIH0pO1xuXG4gICAgICAvLyBQZW5jaWwgbW92aW5nXG4gICAgICAkKCcucGVuY2lsJykuY3NzKHtcbiAgICAgICAgJ3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUoJyArICh3U2Nyb2xsIC0gaW1nVG9wKS8xMSArICdweCwgMCknXG4gICAgICB9KTtcblxuICAgICAgLy8gUGhvbmUgbW92aW5nXG4gICAgICAkKCcucGhvbmUnKS5jc3Moe1xuICAgICAgICAndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZSgwLCAnICsgLSh3U2Nyb2xsIC0gaW1nVG9wKS8xMiArICdweCknXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKlxuICAgICogQWJvdXQgc2VjdGlvbiBmbG9hdGluZyBjb2x1bW5zXG4gICAgKi9cbiAgICBpZiAod1Njcm9sbCA+IGFib3V0QmxvY2tUb3AgLSB3SGVpZ2h0KSB7XG4gICAgICB2YXIgY29sMSA9ICQoJy5hYm91dF9fY29sdW1uLTEnKSxcbiAgICAgICAgICBjb2wyID0gJCgnLmFib3V0X19jb2x1bW4tMicpLFxuICAgICAgICAgIG9mZnNldCA9IE1hdGgubWluKDAsIHdTY3JvbGwgLSBhYm91dEJsb2NrVG9wICsgd0hlaWdodCAtIDUwMCk7XG5cblxuICAgICAgY29sMS5jc3Moe1xuICAgICAgICAndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZSgnICsgb2Zmc2V0ICsgJ3B4LCAnICsgTWF0aC5hYnMob2Zmc2V0KjAuNCkgKyAncHgpJ1xuICAgICAgfSk7XG5cbiAgICAgIGNvbDIuY3NzKHtcbiAgICAgICAgJ3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUoJyArIE1hdGguYWJzKG9mZnNldCkgKyAncHgsICcrIE1hdGguYWJzKG9mZnNldCowLjQpICsgJ3B4KSdcbiAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgLypcbiAgICAqIEVmZmVjdHMgZm9yIGZvcm1cbiAgICAqL1xuICAgIGlmICh3U2Nyb2xsID4gZm9ybVRvcCAtIHdIZWlnaHQgLSAxNTApIHtcblxuICAgICAgICBmb3JtLmFkZENsYXNzKCdhbmltYXRlLXRvcCcpO1xuXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBmb3JtLmFkZENsYXNzKCdhbmltYXRlLWJhY2snKTtcbiAgICAgIH0sIDUwMCk7XG5cbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGZvcm0uYWRkQ2xhc3MoJ2FuaW1hdGUtcm90YXRpb24nKTtcbiAgICAgIH0sIDEwMDApO1xuXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBmb3JtLmFkZENsYXNzKCdhbmltYXRlLXJvdGF0aW9uLWJhY2snKTtcbiAgICAgIH0sIDE1MDApO1xuICAgICAgXG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIHB1YmxpY01ldGhvZCgpIHtcbiAgICBtYWluTW9kdWxlID0ge1xuICAgICAgXG4gICAgfVxuICB9O1xuXG4gIHdpbmRvdy5tYWluTW9kdWxlID0gbWFpbk1vZHVsZTtcbn0pKCk7XG4iLCI7KGZ1bmN0aW9uKCkge1xyXG4gIHZhciBzaG93Y2FzZU1vZHVsZSA9IHt9LFxyXG4gICAgICBjbG9zZUJ0biA9ICQoJyNjbG9zZScpLFxyXG4gICAgICB3b3JrID0gJCgnLndvcmtzX19saW5rJyksXHJcbiAgICAgIHNob3djYXNlID0gJCgnI3Nob3djYXNlJyksXHJcbiAgICAgIGlubmVyU2hvd2Nhc2UgPSAkKCcjaW5uZXItc2hvd2Nhc2UnKSxcclxuICAgICAgZHVyYXRpb24gPSAzMDAsXHJcbiAgICAgIHNob3AgPSB7XHJcbiAgICAgICAgaW1nU3JjOiAnLi9pbWcvc2hvcC5qcGcnLFxyXG4gICAgICAgIHRpdGxlOiAnU2hvcCcsXHJcbiAgICAgICAgdGV4dDogJ1RoaXMgaXMgYW4gZXhhbXBsZSBvZiBpbnRlcm5ldCBzaG9wLiBUaGVyZSBpcyBhIHBvc3NpYmlsaXR5IHRvIGNoYW5nZSB2aWV3IG9mIGRpc3BsYXllZCBnb29kcy4gQ3JlYXRlZCB3aXRoIHRoZSBoZWxwIG9mIEphZGUsIFNDU1MsIEpxdWVyeScsXHJcbiAgICAgICAgbGluazogJ2h0dHA6Ly9zaG9wLmFwbndlYi5ydS8nLFxyXG4gICAgICAgIGZpZ2NhcHR1cmU6ICdTaG9wJ1xyXG4gICAgICB9LFxyXG4gICAgICBnZW5lcmF0b3IgPSB7XHJcbiAgICAgICAgaW1nU3JjOiAnLi9pbWcvZ2VuZXJhdG9yLmpwZycsXHJcbiAgICAgICAgdGl0bGU6ICdHZW5lcmF0b3InLFxyXG4gICAgICAgIHRleHQ6IFwiVGhpcyBpcyBhIHdvcmtpbmcgd2F0ZXJtYXJrIGdlbmVyYXRvciBjcmVhdGVkIGJ5IG1lIGFuZCBteSBmcmVpbmRzLiBJdCdzIGluIGJldGEgdmVyc2lvbiBub3csIGFuZCB5b3UgY2FuIHRyeSBpdCBqdXN0IG5vdy5cIixcclxuICAgICAgICBsaW5rOiAnaHR0cDovL3dhdGVybWFyay51bm9zdGVjaC5ydS8nLFxyXG4gICAgICAgIGZpZ2NhcHR1cmU6ICdHZW5lcmF0b3InXHJcbiAgICAgIH0sXHJcbiAgICAgIGlwYWRBcHBzID0ge1xyXG4gICAgICAgIGltZ1NyYzogJy4vaW1nL2dlbmVyYXRvci5qcGcnLFxyXG4gICAgICAgIHRpdGxlOiAnSXBhZCBBcHBzJyxcclxuICAgICAgICB0ZXh0OiAnVGhpcyBpcyBhbiBleGFtcGxlIHBhZ2UgZm9yIHNob3AgdGhhdCBzZWxscyBhcHBsaWNhdGlvbnMgZm9yIElQYWRzLicsXHJcbiAgICAgICAgbGluazogJ2h0dHA6Ly9hcHBzLmFwbndlYi5ydS8nLFxyXG4gICAgICAgIGZpZ2NhcHR1cmU6ICdJcGFkIEFwcHMnXHJcbiAgICAgIH0sXHJcbiAgICAgIGlzbyA9IHtcclxuICAgICAgICBpbWdTcmM6ICcuL2ltZy9pc28tbXNzLmpwZycsXHJcbiAgICAgICAgdGl0bGU6ICdJbnRlcm5hdGlvbmFsIENlcnRpZmljYXRpb24gU3lzdGVtJyxcclxuICAgICAgICB0ZXh0OiAnVGhpcyBpcyBhIGZ1dHVyZSB3b3JraW5nIHBhZ2UgZm9yIGNlcnRpZmljYXRlcyBzZWxsaW5nIHNob3AuJyxcclxuICAgICAgICBsaW5rOiAnaHR0cDovL3NpbXBseXRveGEuZ2l0aHViLmlvLycsXHJcbiAgICAgICAgZmlnY2FwdHVyZTogJ0ludGVybmF0aW9uYWwgQ2VydGlmaWNhdGlvbiBTeXN0ZW0nXHJcbiAgICAgIH07XHJcblxyXG4gIHB1YmxpY01ldGhvZCgpO1xyXG4gIGluaXQoKTtcclxuICBhdHRhY2hFdmVudHMoKTtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIC8vIFNvbWUgY29kZS4uZnVuY3Rpb25zIHRoYXQgYXJlIG5lZWRlZCBmb3IgbW9kdWxlIGluaXRpYWxpemF0aW9uIFxyXG4gIH07XHJcblxyXG4gIGZ1bmN0aW9uIGF0dGFjaEV2ZW50cygpIHtcclxuICAgIGNsb3NlQnRuLm9uKCdjbGljaycsIGNsb3NlU2hvd2Nhc2UpO1xyXG4gICAgd29yay5vbignY2xpY2snLCBzaG93U2hvd2Nhc2UpO1xyXG4gIH07XHJcblxyXG4gIGZ1bmN0aW9uIGNsb3NlU2hvd2Nhc2UoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGlubmVyU2hvd2Nhc2Uuc2xpZGVVcChkdXJhdGlvbik7XHJcbiAgICBzaG93Y2FzZS5mYWRlT3V0KGR1cmF0aW9uKTtcclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBzaG93U2hvd2Nhc2UoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIHZhciBjbGljayA9ICQodGhpcyksXHJcbiAgICAgICAgaW1nID0gJCgnI2ltZycpLFxyXG4gICAgICAgIHRpdGxlID0gJCgnI3RpdGxlJyksXHJcbiAgICAgICAgdGV4dCA9ICQoJyN0ZXh0JyksXHJcbiAgICAgICAgbGluayA9ICQoJy5saW5rJyksXHJcbiAgICAgICAgZmlnY2FwdHVyZSA9ICQoJyNmaWdjYXB0dXJlJyk7XHJcbiAgICBcclxuICAgIGlmKGNsaWNrLmF0dHIoJ2hyZWYnKSA9PT0gJyNzaG9wJykge1xyXG4gICAgICBhZGRWYWx1ZXMoc2hvcCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmKGNsaWNrLmF0dHIoJ2hyZWYnKSA9PT0gJyNnZW5lcmF0b3InKSB7XHJcbiAgICAgIGFkZFZhbHVlcyhnZW5lcmF0b3IpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZihjbGljay5hdHRyKCdocmVmJykgPT09ICcjaXNvJykge1xyXG4gICAgICBhZGRWYWx1ZXMoaXNvKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYoY2xpY2suYXR0cignaHJlZicpID09PSAnI2lwYWRBcHBzJykge1xyXG4gICAgICBhZGRWYWx1ZXMoaXBhZEFwcHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGlubmVyU2hvd2Nhc2UuZmFkZUluKGR1cmF0aW9uKTtcclxuICAgIHNob3djYXNlLnNsaWRlRG93bihkdXJhdGlvbik7XHJcblxyXG4gICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe3Njcm9sbFRvcDogc2hvd2Nhc2Uub2Zmc2V0KCkudG9wfSwgZHVyYXRpb24pXHJcblxyXG4gICAgZnVuY3Rpb24gYWRkVmFsdWVzKG9iaikge1xyXG4gICAgICBpbWcuYXR0cignc3JjJywgb2JqLmltZ1NyYyk7XHJcbiAgICAgIHRpdGxlLnRleHQob2JqLnRpdGxlKTtcclxuICAgICAgdGV4dC50ZXh0KG9iai50ZXh0KTtcclxuICAgICAgbGluay5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxpbmsuYXR0cignaHJlZicsIG9iai5saW5rKVxyXG4gICAgICB9KTtcclxuICAgICAgZmlnY2FwdHVyZS50ZXh0KG9iai5maWdjYXB0dXJlKVxyXG4gICAgfTtcclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBwdWJsaWNNZXRob2QoKSB7XHJcbiAgICBzaG93Y2FzZU1vZHVsZSA9IHtcclxuICAgICAgLy8gbmFtZSA6IHB1YmxpYyBmdW5jdGlvblxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHdpbmRvdy5zaG93Y2FzZU1vZHVsZSA9IHNob3djYXNlTW9kdWxlO1xyXG59KSgpO1xyXG4iLCJ2YXIgdHlwZSA9IHJlcXVpcmUoJy4uL2Jvd2VyL3R5cGVkLmpzL2pzL3R5cGVkLmpzJyk7XHJcbnZhciBtYWluID0gcmVxdWlyZSgnLi9fbW9kdWxlcy9tYWluLmpzJyk7XHJcbnZhciBzaG93Y2FzZSA9IHJlcXVpcmUoJy4vX21vZHVsZXMvc2hvd2Nhc2UuanMnKTtcclxudmFyIGZvcm0gPSByZXF1aXJlKCcuL19tb2R1bGVzL2Zvcm0uanMnKTtcclxuIl19
