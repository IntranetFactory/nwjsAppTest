
var settings = require('./settings');


function openPreferences(win) {
  var document = win.window.document;
  var console = win.window.console;

  var prefImport = document.getElementById('prefImport');
  var content = prefImport.import;
  var dialogTemplate = content.getElementById('dialog');
  var clone = document.importNode(dialogTemplate.content, true);
  var body = document.body;
  body.appendChild(clone);

  var dialog = body.querySelector('.dialog');
  if (dialog) {
    var background = dialog.querySelector('.background');
    var saveButton = dialog.querySelector('#save');
    var cancelButton = dialog.querySelector('#cancel');
    var serverUrlInput = dialog.querySelector('#serverUrl');

    serverUrlInput.value = settings.serverUrl;

    background.addEventListener('click', function(event) {
      var target = event.target;
      if (target.classList.contains('background')) {
        body.removeChild(dialog);
      }
    });

    saveButton.addEventListener('click', function(event) {
      body.removeChild(dialog);
      settings.serverUrl = serverUrlInput.value;
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
