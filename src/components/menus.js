var gui = window.require('nw.gui');
var clipboard = gui.Clipboard.get();
var AutoLaunch = require('auto-launch');
var windowBehaviour = require('./window-behaviour');
var dispatcher = require('./dispatcher');
var platform = require('./platform');
var settings = require('./settings');
var updater = require('./updater');
var utils = require('./utils');
var preferences = require('./preferences');

module.exports = {
  /**
   * The main settings items. Their placement differs for each platform:
   * - on OS X they're in the top menu bar
   * - on Windows they're in the tray icon's menu
   * - on all 3 platform, they're also in the right-click context menu
   */
  settingsItems: function(win, keep) {
    var self = this;
    return [{
      label: 'File',
      submenu: this.createFilesMenu(win)
    }, {
      label: 'Launch Dev Tools',
      click: function() {
        win.showDevTools();
      }
    }].map(function(item) {
       var menuItem = new gui.MenuItem(item);
       return menuItem;
     });
  },

  /**
   * Create the files submenu shown in the main one.
   */
  createFilesMenu: function(win) {
    var self = this;
    var menu = new gui.Menu();
      menu.append(new gui.MenuItem({
        label: 'Preferences ...',
        click: function() {
          preferences.openPreferences(win);
        }
      }));

    return menu;
  },

  openPreferences: function (win) {

    alert('this is asprta!');
  },

  /**
   * Create the menu bar for the given window, only on OS X.
   */
  loadMenuBar: function(win) {
    if (!platform.isOSX) {
      return;
    }

    var menu = new gui.Menu({
      type: 'menubar'
    });

    menu.createMacBuiltin('Now Assistant');
    var submenu = menu.items[0].submenu;

    submenu.insert(new gui.MenuItem({
      type: 'separator'
    }), 1);

    // Add the main settings
    this.settingsItems(win, true).forEach(function(item, index) {
      submenu.insert(item, index + 2);
    });

    // Watch the items that have a 'setting' property
    submenu.items.forEach(function(item) {
      if (item.setting) {
        settings.watch(item.setting, function(value) {
          item.checked = value;
        });
      }
    });

    win.menu = menu;
  },

  /**
   * Create the menu for the tray icon.
   */
  createTrayMenu: function(win) {
    var menu = new gui.Menu();
    var self = this;
    // Add the main settings
    // this.settingsItems(win, true).forEach(function(item) {
    //   menu.append(item);
    // });

    // menu.append(new gui.MenuItem({
    //   type: 'separator'
    // }));

    // menu.append(new gui.MenuItem({
    //   label: 'Show Now Assistant',
    //   click: function() {
    //     win.show();
    //   }
    // }));
    //
    menu.append(new gui.MenuItem({
      label: 'Preferences ...',
      click: function () {
        preferences.openPreferences(win);        
      }
    }));

    menu.append(new gui.MenuItem({
      label: 'Quit Now Assistant',
      click: function() {
        win.close(true);
      }
    }));


    // Watch the items that have a 'setting' property
    // menu.items.forEach(function(item) {
    //   if (item.setting) {
    //     settings.watch(item.setting, function(value) {
    //       item.checked = value;
    //     });
    //   }
    // });

    return menu;
  },

  /**
   * Create the tray icon.
   */
  loadTrayIcon: function(win) {
    if (win.tray) {
      win.tray.remove();
      win.tray = null;
    }

    var tray = new gui.Tray({
      icon: 'images/icon_' + (platform.isOSX ? 'menubar.tiff' : 'icon_64.png')
    });

    tray.on('click', function() {
      win.show();
    });

    tray.tooltip = 'Now Asistant for Desktop';
    tray.menu = this.createTrayMenu(win);

    // keep the object in memory
    win.tray = tray;
  },

  /**
   * Create a context menu for the window and document.
   */
  createContextMenu: function(win, window, document, targetElement) {
    var menu = new gui.Menu();

    if (targetElement.tagName.toLowerCase() == 'input') {
      menu.append(new gui.MenuItem({
        label: "Cut",
        click: function() {
          clipboard.set(targetElement.value);
          targetElement.value = '';
        }
      }));

      menu.append(new gui.MenuItem({
        label: "Copy",
        click: function() {
          clipboard.set(targetElement.value);
        }
      }));

      menu.append(new gui.MenuItem({
        label: "Paste",
        click: function() {
          targetElement.value = clipboard.get();
        }
      }));
    } else if (targetElement.tagName.toLowerCase() == 'a') {
      menu.append(new gui.MenuItem({
        label: "Copy Link",
        click: function() {
          var url = utils.skipFacebookRedirect(targetElement.href);
          clipboard.set(url);
        }
      }));
    } else {
      var selection = window.getSelection().toString();
      if (selection.length > 0) {
        menu.append(new gui.MenuItem({
          label: "Copy",
          click: function() {
            clipboard.set(selection);
          }
        }));
      }
    }

    this.settingsItems(win).forEach(function(item) {
      menu.append(item);
    });

    return menu;
  },

  /**
   * Listen for right clicks and show a context menu.
   */
  injectContextMenu: function(win, window, document) {
    document.body.addEventListener('contextmenu', function(event) {
      event.preventDefault();
      this.createContextMenu(win, window, document, event.target).popup(event.screenX, event.screenY);
      return false;
    }.bind(this));
  }
};
