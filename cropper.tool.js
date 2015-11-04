(function($, window, document) {

  var CropperTool = {
    init: function(options, element) {
      var base = this;
      base.$elem = $(element);

      base.options = $.extend({}, $.fn.cropperTool.options, base.$elem.data(), options);
      base.userOptions = options;
      base.setUp();
    },

    setUp: function() {
      var base = this;

      if (!base.options.cropperImageElement) {
        console.log('Missing cropperImageElement - unable to do anything. Exiting.');
        return;
      }

      base.options.cropperImageElement = $(base.options.cropperImageElement);

      base.createForm();
      base.addHelpInformation();
      base.applyJrac();
    },

    applyJrac: function() {
      var base = this;

      base.options.cropperImageElement.jrac({
        crop_width: base.options.cropWidth,
        crop_height: base.options.cropHeight,

        crop_x: base.options.cropX,
        crop_y: base.options.cropY,

        crop_resize: base.options.allowCropResize,

        image_width: base.options.imageWidth,
        image_height: base.options.imageHeight,

        viewport_content_left: base.options.viewportContentLeft || base.options.cropX * -1,
        viewport_content_top: base.options.viewportContentTop || base.options.cropY * -1,

        viewport_image_surrounding: base.options.viewportSurroundsImageOnLoad,

        viewport_width: base.options.viewportWidth,
        viewport_height: base.options.viewportHeight,

        viewport_resize: base.options.allowViewportResize,
        viewport_onload: base.onJracInitViewport()
      });
    },


    addJracEventListeners: function($viewport){
      var onChangeEvents = [
        'jrac_crop_x','jrac_crop_y',
        'jrac_crop_width','jrac_crop_height',
        'jrac_image_width','jrac_image_height'
      ];

      $.each(onChangeEvents, function(index, eventName) {
        var elementName = eventName.replace('jrac_', '');
        var eventElements = $('.' + elementName);

        $viewport.observator.register(eventName, eventElements);

        eventElements.bind(eventName, function(event, viewport, changedValue){
          $(this).val(changedValue);

        }).change(eventName, function(event) {
          var newValue = $(this).val();

          $('.' + $(this).attr('class')).val(newValue);
          $viewport.observator.set_property(event.data, newValue);
        });
      });

      $viewport.$container.append($('<div>').
      text('Image original size: ' + $viewport.$image.originalWidth + ' x ' + $viewport.$image.originalHeight));
    },

    onJracInitViewport: function() {
      var base = this;

      return function() {
        var $viewport = this;
        base.options.jracViewport = $viewport;

        if ($.isFunction(base.options.viewportAfterLoadFunction)) {
          base.options.viewportAfterLoadFunction().call($viewport);
        }

        base.addJracEventListeners($viewport);
        base.setViewportBackgroundColor(base.options.defaultBackgroundColor);
        base.overlayCropGuideline();
      }
    },

    overlayCropGuideline: function() {
      var base = this;

      if (base.options.cropGuidelineCSSPath && base.options.cropGuidelineCSSPath.length) {
        $(".jrac_crop_drag_handler").css({
          'background-image': base.options.cropGuidelineCSSPath,
          'background-size': '' + base.options.cropWidth + 'px' + ' ' + base.options.cropHeight + 'px'
        });
      }
    },

    createForm: function() {
      var base = this;

      if (base.options.cropperFormContainer) {
        base.options.cropperFormContainer = $(base.options.cropperFormContainer);
      } else {
        base.options.cropperFormContainer = $('<div/>', { 'class': 'crop-form-container' });
        base.$elem.append(base.options.cropperFormContainer);
      }

      base.options.cropperForm = $('<form>', { action: base.options.cropperFormUrl, method: 'post', 'class': 'adjustments-form' });

      if (base.options.cropperFormMethod != 'post') {
        base.options.cropperForm.append($('<input>', { type: 'hidden', name: '_method' }).val(base.options.cropperFormMethod));
      }

      var coordinateRows = [
        base.rowForInput('Crop X', base.formInputsFor('crop_x', base.options.cropX)),
        base.rowForInput('Crop Y', base.formInputsFor('crop_y', base.options.cropY)),
        base.rowForInput('Crop Width', base.formInputsFor('crop_width', base.options.cropWidth)),
        base.rowForInput('Crop Height', base.formInputsFor('crop_height', base.options.cropHeight)),
        base.rowForInput('Resize Image Width To', base.formInputsFor('image_width', base.options.imageWidth)),
        base.rowForInput('Resize Image Height To', base.formInputsFor('image_height', base.options.imageHeight))
      ]

      $.each(coordinateRows, function(index, elem){ elem.toggle(base.options.showFormFields) });

      if (base.options.allowBackgroundColorChange) {
        coordinateRows.push(base.rowForInput(base.options.backgroundColorInputLabel, base.colorChangeInput()));
      }

      base.options.cropperForm.append($('<table>').append(coordinateRows));
      base.options.cropperForm.append($('<div class="submit-action">').append($('<input>', { type: 'submit' }).val(base.options.cropperFormSubmitLabel)));
      base.options.cropperFormContainer.append(base.options.cropperForm);
    },

    formInputsFor: function(name, value) {
      var base = this;
      var fullName = base.options.cropperFormParameterGrouping + '[' + name + ']';

      var visibleFormElement = $('<input>', { type: 'text', 'class': name }).val(value).prop('disabled', true);
      var hiddenFormElement = $('<input>', { type: 'hidden', 'class': name, name: fullName }).val(value);

      return [visibleFormElement, hiddenFormElement];
    },

    rowForInput: function(label, input) {
      return $('<tr>').append($('<th>').text(label)).append($('<td>').append(input));
    },

    colorChangeInput: function() {
      var base = this;

      var colorFormInput = base.formInputsFor('background_color', base.options.defaultBackgroundColor)[0];
      var fullName = base.options.cropperFormParameterGrouping + '[background_color]';

      colorFormInput.prop('disabled', false).prop('name', fullName);
      colorFormInput.keyup(base.updateBackgroundColorFunc()).blur(base.updateBackgroundColorFunc());

      return colorFormInput;
    },

    updateBackgroundColorFunc: function() {
      var base = this;

      return function() {
        base.setViewportBackgroundColor($(this).val());
      }
    },

    setViewportBackgroundColor: function(newBackgroundColor) {
      if (!newBackgroundColor || newBackgroundColor.length == 0) {
        newBackgroundColor = base.options.defaultBackgroundColor;
      }

      if (newBackgroundColor && newBackgroundColor.length && newBackgroundColor.indexOf('#') == -1) {
        newBackgroundColor = '#' + newBackgroundColor;
      }

      if (newBackgroundColor.length == 4 || newBackgroundColor.length == 7) {
        $('.jrac_viewport').css('background-color', newBackgroundColor);
      }
    },

    addHelpInformation: function() {
      var base = this;
      if (base.options.showHelpInformation) {
        var lis = $.map(base.options.helpInformation, function(info, index){
          return $('<li>').text(info);
        });

        $(base.options.helpInformationContainer).append($('<ol>').append(lis));
      }
    }
  }

  $.fn.cropperTool = function(options) {
    return this.each(function() {

      if ($(this).data('cropper-tool') === true) {
        return false;
      }

      $(this).data('cropper-tool', true);

      var cropperTool = Object.create(CropperTool);
      cropperTool.init(options, this);

      $.data(this, 'cropperTool', cropperTool);
    });
  }

  $.fn.cropperTool.options = {
    cropperImageElement: null,

    cropperFormUrl: '/',
    cropperFormMethod: 'post',
    cropperFormContainer: null,
    cropperFormParameterGrouping: 'image_adjustments',
    cropperFormSubmitLabel: 'Crop Image',

    showFormFields: false,

    allowBackgroundColorChange: false,
    defaultBackgroundColor: '#FFFFFF',
    backgroundColorInputLabel: 'Background Color',

    showHelpInformation: false,
    helpInformationContainer: null,
    helpInformation: [
      'The yellow box is the cropped area that will show',
      'The red box is a fake border around original image',
      'To move the image, you must first move the the cropper',
      'To scale, drag the bar below',
      'Try to center best as your eye allows'
    ],

    //jrac attributes
    allowCropResize: false,

    viewportSurroundsImageOnLoad: false,
    viewportWidth: null,
    viewportHeight: null,
    allowViewportResize: true,
    viewportContentLeft: null,
    viewportContentTop: null,
    viewportAfterLoadFunction: null,

    cropGuidelineCSSPath: false
  };

})(jQuery, window, document);
