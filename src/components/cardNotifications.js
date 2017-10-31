/**
 * This will be invisible on the outsize
 */

var win = false;
var https = require('https');

var API_RELATIVE_URL = "/api/adenin.Now.Service/CardStatus";
var serverUrl = 'https://mps.adenin.com';
var domainName = 'mps.adenin.com';
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

function setBadgeBackgroundColorHelper(color) {
  // this is not supproted in nw.js 0.12.3
  // and I didn't see that it is supported in nw.js 0.13.1
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
  var cookies = win.cookies.getAll({ domain: domainName }, function(cookies) {
    var cookieStr = '';
    if (cookies && cookies.forEach) {
      cookies.forEach(function (cookie, index) {
        cookieStr = cookieStr + cookie.name + '=' + cookie.value + ';';
      });
    }

    var requestOptions = {
      hostname: domainName,
      path: API_RELATIVE_URL,
      method: 'GET',
      port: 443,
      headers: {
        cookie: cookieStr,
        'content-type': 'application/json',
        accept: 'application/json'
      }
    };

    var request = https.request(requestOptions, function(response) {
      var status = response.statusCode;
      var statusText = response.statusMessage;

      response.on('data', function(responseData) {
        var responseStr = responseData.toString();
        var response = JSON.parse(responseStr);

        if (response.ErrorCode === 0) {
          var counter = response.Data.cardInstanceCount;

          var newNormalHigh = counter.newHigh + counter.newNormal;
          var countTotal = counter.newLow + newNormalHigh;

          // hide bade if we have no new cards
          if(countTotal === 0) {
            setBadgeTextHelper("");
          } else {
            setBadgeTextHelper(countTotal + "");
          }

          if (newNormalHigh === 0) {
            // only low priority == green badge
            setBadgeBackgroundColorHelper([0, 255, 0, 128]);
          } else {
            // red badge
            setBadgeBackgroundColorHelper([255, 0, 0, 128]);
          }

          if (countTotal === 0 || newNormalHigh === 0) {
            setExtensionIconHelper("green");
          } else {
            setExtensionIconHelper("red");
          }

        } else if (response.ErrorCode === 401) {
          // set error icon on browserAction
          var errorText = response.Data.ErrorText;

          setBadgeTextHelper("");
          setExtensionIconHelper("red");
        } else if (response.ErrorCode === 404) {
          // something special should be done here but its not specified yet
        }

      });
    }).on('error', function(error) {
      console.log('Error message' + error);
    });
    request.end();

  });
}

var attachedToCookiesChanged = false;

/*
 * this will be visible on the outsize
 */
module.exports = {
  refresh: function(_win) {
    win = _win;

    if(!attachedToCookiesChanged) {
      attachedToCookiesChanged = true;
      win.cookies.onChanged.addListener(function (change) {
        refresh();
      });
    }

    refresh();
  }
};
