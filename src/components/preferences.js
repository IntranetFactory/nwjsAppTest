



function openPreferences(win) {
  var document = win.window.document;
  var console = win.window.console;

  var prefImport = document.getElementById('prefImport');
  var content = prefImport.import;
  var dialogTemplate = content.getElementById('dialog');
  var clone = document.importNode(dialogTemplate.content, true);
  // console.log(dialogTemplate.content);
  var body = document.body;
  body.appendChild(clone);

  var dialog = body.getElementsByClassName('dialog')[0];
  if (dialog) {
    var background = dialog.querySelector('.background');
    var saveButton = dialog.querySelector('#save');
    var cancelButton = dialog.querySelector('#cancel');
    console.log('if works');
    console.log(background);
    console.log(saveButton);
    console.log(cancelButton);

    background.addEventListener('click', function(event) {
      var target = event.target;
      if (target.classList.contains('background')) {
        body.removeChild(dialog);
      }
    });

    saveButton.addEventListener('click', function(event) {
      body.removeChild(dialog);
    });

    cancelButton.addEventListener('click', function(event) {
      body.removeChild(dialog);
    });
  }
}


module.exports = {
  openPreferences: function (win) {
    openPreferences(win);
  }
};
