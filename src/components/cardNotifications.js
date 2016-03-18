/**
 * This will be invisible on the outsize
 */

var win = false;
var http = require('http');

var API_RELATIVE_URL = "/api/adenin.Now.Service/CardStatus";
var serverUrl = 'https://mps.adenin.com';
var apiUrl = false;
var intervalId = false;

function refresh() {
  apiUrl = serverUrl + API_RELATIVE_URL;
  updateBadge(apiUrl);
  if (intervalId) {
    clearInterval(intervalId);
  }
  intervalId = setInterval(updateBadge, 60000, apiUrl);
}

function setBadgeTextHelper(text) {
  win.setBadgeLabel(text);
}

/**
 * @icon - one of [red, green]
 * red is error icon, green is normal icon
 */
function setExtensionIconHelper(icon) {
  if (icon === "red") {
    win.tray.icon = "images/icon_64_red.png";
  } else if (icon === "green") {
    win.tray.icon = "images/icon_64.png";
  }
}

function updateBadge(apiUrl) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.withCredentials = true;
  xhr.open("GET", apiUrl, true);

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      var status = xhr.status;
      var statusText = xhr.statusText;

      if (status === 200 && statusText === "OK") {
        var response = xhr.response;
        if (response.ErrorCode === 0) {
          var count = response.Data.visibleCardInstancesCount;

          setBadgeTextHelper(count + "");
          setExtensionIconHelper("green");
        } else if (response.ErrorCode === 401) {
          // set error icon on browserAction
          var errorText = response.Data.ErrorText;

          setBadgeTextHelper("");
          setExtensionIconHelper("red");
        } else if (response.ErrorCode === 404) {
          // something special should be done here but its not specified yet
        }
      } else if (status === 404 && statusText === "Not Found") {
        // something special should be done here but its not specified yet
      } else {
        // set error icon on browserAction
        setBadgeTextHelper("");
        setExtensionIconHelper("red");
      }
    }
  };

  xhr.send();
}

/*
 * this will be visible on the outsize
 */
module.exports = {
  refresh: function(_win) {
    win = _win;
    refresh();
  }
};
