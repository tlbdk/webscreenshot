var page = require('webpage').create();

/* Add pad method to numbers */
Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) { s = "0" + s; }
  return s;
}

/* Configuration */
var pageHeight = 1920;
var pageWidth = 1080;
var waittime = 30 * 1000;

/* ULRs to load */
var urls = [
  'http://eu-b.demo.qlik.com/QvAJAXZfc/opendoc.htm?document=qvdocs%2FItalian%20Schools%20Navigator.qvw&host=demo11&anonymous=true',
  'http://eu-b.demo.qlik.com/QvAJAXZfc/opendoc.htm?document=qvdocs%2FItalian%20Schools%20Navigator.qvw&host=demo11&anonymous=true'
];

/* Set size of browser window */
page.viewportSize = { width: pageWidth, height: pageHeight };
page.clipRect = { top: 0, left: 0, width: pageWidth, height: pageHeight };

var urlcount = urls.length;

renderPage(urls.shift(), urlcount - urls.length);

function renderPage(url, index) {
  var filename = 'screenshot' + index.pad(2) + '.png';
  console.log("Open " + url);
  page.open(url, function() {
      window.setTimeout(function () {
          console.log("Write to " + filename);
          page.render(filename);
          if(urls.length > 0) {
            renderPage(urls.shift(), urlcount - urls.length);
          } else {
            phantom.exit();
          }
      }, waittime);
  });
}