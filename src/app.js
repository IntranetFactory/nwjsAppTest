
var win = nw.Window.get();

var platform = require('./components/platform');
var updater = require('./components/updater');
var menus = require('./components/menus');
var themer = require('./components/themer');
var settings = require('./components/settings');
var windowBehaviour = require('./components/window-behaviour');
var notification = require('./components/notification');
var dispatcher = require('./components/dispatcher');
var cardNofitications = require('./components/cardNotifications');
var preferences = require('./components/preferences');

// Ensure there's an app shortcut for toast notifications to work on Windows
if (platform.isWindows) {
  // debugger;
  // gui.App.createShortcut(process.env.APPDATA + "\\Microsoft\\Windows\\Start Menu\\Programs\\NowAssistant.lnk");
}

// Add dispatcher events
dispatcher.addEventListener('win.alert', function(data) {
  data.win.window.alert(data.message);
});

dispatcher.addEventListener('win.confirm', function(data) {
  data.callback(data.win.window.confirm(data.message));
});

// Window state
windowBehaviour.restoreWindowState(win);
windowBehaviour.bindWindowStateEvents(win);

// Check for update
if (settings.checkUpdateOnLaunch) {
  // updater.checkAndPrompt(gui.App.manifest, win);
}

// Run as menu bar app
if (settings.asMenuBarAppOSX) {
  win.setShowInTaskbar(false);
  menus.loadTrayIcon(win);
}

// Load the app menus
menus.loadMenuBar(win);
if (platform.isWindows) {
  menus.loadTrayIcon(win);
}

// Adjust the default behaviour of the main window
windowBehaviour.set(win);
windowBehaviour.setNewWinPolicy(win);

// Inject logic into the app when it's loaded
var iframe = document.querySelector('iframe');
iframe.onload = function() {
  // Load the theming module
  themer.apply(iframe.contentDocument);

  // Inject a callback in the notification API
  notification.inject(iframe.contentWindow, win);

  // Add a context menu
  menus.injectContextMenu(win, iframe.contentWindow, iframe.contentDocument);

  // Bind native events to the content window
  windowBehaviour.bindEvents(win, iframe.contentWindow);

  // Watch the iframe periodically to sync the badge and the title
  // windowBehaviour.syncBadgeAndTitle(win, document, iframe.contentDocument);

  // Listen for ESC key press
  windowBehaviour.closeWithEscKey(win, iframe.contentDocument);
};

if (settings.firstTimeStart) {
  settings.firstTimeStart = false;
  preferences.openPreferences(win);
} else {
  if (settings.serverUrl) {
    iframe.setAttribute('src', settings.serverUrl);
  } else {
    preferences.openPreferences(win);
  }
}

settings.watch('serverUrl', function (updatedServerUrl) {
  iframe.setAttribute('src', updatedServerUrl);
});

cardNofitications.refresh(win);

// Reload the app periodically until it loads
var reloadIntervalId = setInterval(function() {
  if (win.window.navigator.onLine) {
    clearInterval(reloadIntervalId);
  } else {
    win.reload();
  }
}, 10 * 1000);
