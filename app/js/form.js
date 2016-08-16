;(() => {
  let formModule = {},
      form = $('.form'),
      fields = form.find('input, textarea');

  publicMethod();
  init();
  attachEvents();

  function init() {
    
  }

  function attachEvents() {
    form.on('submit', submitForm);
    fields.on('keydown', hideTooltip);
    form.on('reset', resetForm);
  }

  function submitForm(e) {
    e.preventDefault();
    
    let data = form.serialize(),
        url = 'php/form.php',
        valid = true,
        success = $('.success');

    $.each(fields, function(index, domElement) {
      let elem = $(domElement),
          that = $(this),
          value = elem.val(),
          trimedValue = $.trim(value),
          fieldParent = that.parent(),
          tooltipTxt = that.attr('data-tooltip');

      if (trimedValue === '') {
        fieldParent.append(
          '<div class="tooltip-wrap"><div class="tooltip">' + tooltipTxt + '</div></div>');

        that.addClass('empty-field');

        valid = false;
      }
    });

    if (!valid) {
      return false
    }
    
    $.ajax({
      url: url,
      type: 'POST',
      data: data
    })
    .done(function() {
      form.trigger('reset');
      success.fadeIn('slow');
      setTimeout(function() {
        success.fadeOut('slow');
      }, 3000);
    });

}
  /**
   * Hide tips on key down event
   * @param  {object} e Event object
   */
  function hideTooltip(e) {
    let that = $(this),
        tooltip = that.siblings('.tooltip-wrap');

    if (e.which > 47 && e.which < 91) {
      that.removeClass('empty-field');
      tooltip.remove();
    }
  }

  function resetForm() {
    let tooltips = form.find('.tooltip-wrap');

    fields.removeClass('empty-field');
    tooltips.remove();
  }

  function publicMethod() {
    formModule = {
      
    }
  }

  window.formModule = formModule;
})();
