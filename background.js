var settings = {
      'domain': "https://secure.opinionlab.com",
      'ip': "",
      'enabled': false
    },
    requestFilter = {urls: ["<all_urls>"]},
    onBeforeSendHeadersHandler = function(details) {
      if (settings.enabled && (details.url.indexOf(settings.ip) > -1)) {
        details.requestHeaders.push({ name: "Host", value: settings.domain });
        return {requestHeaders: details.requestHeaders};
      }
    },
    onBeforeRequestHandler = function(details) {
      if (settings.enabled && (details.url.indexOf(settings.domain) > -1)) {
        return { redirectUrl: settings.ip };
      }
    };

chrome.storage.sync.get(settings, function(result) {
  console.log('before', ' results', result);
  console.log('before', ' settings', settings);
  if(result.domain) settings.domain = result.domain;
  if(result.ip) settings.ip = result.ip;
  if(result.enabled) settings.enabled = result.enabled;
  console.log('after', ' results', result);
  console.log('after', ' settings', settings);
  chrome.browserAction.setIcon({path: (settings.enabled ? 'enabled' : 'disabled') + '.png'});
});

chrome.webRequest.onBeforeRequest.addListener(onBeforeRequestHandler, requestFilter, ["blocking"]);
chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeSendHeadersHandler, requestFilter, ["blocking", "requestHeaders"]);
