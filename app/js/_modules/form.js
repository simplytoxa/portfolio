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
