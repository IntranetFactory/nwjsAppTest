var Store = require('jfs');
var path = require('path');

var DEFAULT_SETTINGS = {
  launchOnStartup: false,
  checkUpdateOnLaunch: true,
  openLinksInBrowser: true,
  autoHideSidebar: false,
  asMenuBarAppOSX: false,
  windowState: {},
  theme: 'default',
  serverUrl: 'https://mps.adenin.com',
  firstTimeStart: true
};

var db = new Store(path.join(nw.App.dataPath, 'preferences.json'));
var settings = db.getSync('settings');
var watchers = {};

// Watch changes to the storage
settings.watch = function(name, callback) {
  if (!Array.isArray(watchers[name])) {
    watchers[name] = [];
  }

  watchers[name].push(callback);
};

var settingsProxyHandler = {
  set: function(obj, prop, value) {
    obj[prop] = value;

    var keyWatchers = watchers[prop];

    // Call all the watcher functions for the changed key
    if (keyWatchers && keyWatchers.length) {
      for (var i = 0; i < keyWatchers.length; i++) {
        try {
          keyWatchers[i](value);
        } catch(ex) {
          console.error(ex);
          keyWatchers.splice(i--, 1);
        }
      }
    }

  },
  get: function(obj, prop) {
    return obj[prop];
  }
};

var settingsProxy = new Proxy(settings, settingsProxyHandler);

// Ensure the default values exist
Object.keys(DEFAULT_SETTINGS).forEach(function(key) {
  if (!settings.hasOwnProperty(key)) {
    settings[key] = DEFAULT_SETTINGS[key];
  }
});

module.exports = settingsProxy;
