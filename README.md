# Cropper Tool UI

Built upon [jrac](https://github.com/trepmag/jrac) especially for use by the [Adjustable Image gem](https://github.com/rkrathwohl/adjustable_image).

More of a plugin for the form view.

## Dependencies:

* jrac 1.0.2

From jrac:

* jquery 1.4.4
* jquery-ui 1.8.7 (draggable, resizable, slider)


## Usage

Import the files to the page you'd like.

The css file has styles for the viewport and the crop guideline image is a crossed transparent png (though
 possibly not with the dimensions that you're interested in).

To apply the cropper ui, call:
```javascript
$('.whatever-the-container-identifier-is').cropperTool({
  cropperImageElement: 'identifier-of-image-elem',
  cropWidth: 100,
  cropHeight: 100
});
```

Required properties:

`cropperImageElement`
  - the image element that should be cropped
`cropWidth`
  - the width the element should be cropped to.  This sets the width of the draggable crop area
  - if you set allowCropResize to true, cropWidth will be the initial width of that crop area
`cropHeight`
  - the height the element should be cropped to.  This sets the height of the draggable crop area
  - if you set allowCropResize to true, cropHeight will be the initial height of that crop area

***
You'll need to add the appropriate jrac properties but the additional properties you can add are:

`cropperFormUrl`
  - the url to send the cropper params to
  - default: '/'
`cropperFormMethod`
  - for more restful routes where this is an update, this can be changed to 'put' and the form will change appropriately
  - default: 'post'
`cropperFormContainer`
  - for when you want to show the form and have a place to show it
  - if no form container is specified, the form will be appended to the cropper container
  - default: null
`cropperFormParameterGrouping`
  - when you want an extra layer on parameters, name='image_adjustments[crop_x]' rather than name='crop_x' on the form inputs
  - default: 'image_adjustments'
`cropperFormSubmitLabel`
  - label for the submit button
  - default: 'Crop Image'
`showFormFields`
  - if you're interested in seeing how the pixels dance as you adjust the image
  - currently form fields are disabled - they will be enabled for entry later
  - default: false

`allowBackgroundColorChange`
  - shows the enabled background color box
  - changing the input will change the background color of the viewport
  - default: false
`defaultBackgroundColor`
  - desired background color, will change the background color of the viewport
  - default: '#FFFFFF'
`backgroundColorInputLabel`
  - label for background color input field
  - default: 'Background Color'

`showHelpInformation`
  - for those of us who have no clue what's going on - shows an ordered list
  - default: 'false'
`helpInformationContainer`
  - where to show the help information if you so desire
  - default: null
`helpInformation`
  - things to show to those of us who have no clue what's going on
  - if you change the css of the viewport, you may want to either not show the help info or change the wording
  - is an array of strings
  - default:
```
[ 'The yellow box is the cropped area that will show',
  'The red box is a fake border around original image',
  'To move the image, you must first move the the cropper',
  'To scale, drag the bar below',
  'Try to center best as your eye allows']
```

`cropGuidelineCSSPath`
  - if you want to use a center-er (see the above for the crop guideline png thoughs), use this to set the drag viewport background image
  - the background image will be sized to the cropWidth and cropHeight that are passed in
  - default: false

The following are jrac properties that the plugin directly overrides but can be overriden by you:

* `allowCropResize` - default: false
* `viewportSurroundsImageOnLoad` - default: false
* `viewportWidth` - default: null
* `viewportHeight` - default: null
* `allowViewportResize` - default: true
* `viewportContentLeft` - default: null
* `viewportContentTop` - default: null
* `viewportAfterLoadFunction` - default: null

## Contributing

1. Fork it ( https://github.com/[my-github-username]/cropper-tool-ui/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
