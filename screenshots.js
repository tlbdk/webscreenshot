var page = require('webpage').create();
var fs = require('fs');

/* Add pad method to numbers */
Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) { s = "0" + s; }
  return s;
};

/* Configuration */
var pageWidth = 1920;
var pageHeight = 1080;
var waittime = 10 * 000;

/* ULRs to load */
var urls = [
  'http://eu-b.demo.qlik.com/QvAJAXZfc/opendoc.htm?document=qvdocs%2FEpidemiology%20-Tycho.qvw&host=demo11&anonymous=true',
  /* 'http://www.google.com',
  'http://www.google.com#q=javascript',
  'http://www.google.com#q=html',
  'http://www.google.com#q=css' */
];

/* Set size of browser window */
page.viewportSize = { width: pageWidth, height: pageHeight };
page.clipRect = { top: 0, left: 0, width: pageWidth, height: pageHeight };

var indexhtml = 
  "<!doctype html>\n" +
  "<html lang=\"en\" class=\"demo2\">\n" +
  "<head>\n" +
  "  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n" +
  "  <meta charset=\"UTF-8\">\n" +
  "  <title>Slideshow</title>\n" +
  "  <link rel=\"stylesheet\" type=\"text/css\" href=\"css/main.css\" />\n" +
  "  <script type=\"text/javascript\" src=\"js/jquery.min.js\"></script>\n" +
  "  <script type=\"text/javascript\" src=\"js/jquery.cycle2.min.js\"></script>\n" +
  "  <script type=\"text/javascript\" src=\"js/jquery.cycle2.center.js\"></script>" + 
  "  <script type=\"text/javascript\" src=\"js/live.js\"></script>\n" +
  "  <script type=\"text/javascript\" src=\"js/screenfull.min.js\"></script>\n" +
  "  <script type=\"text/javascript\" src=\"js/webscreenshot.js\"></script>\n" +
  "  <script type=\"text/javascript\">var fullscreennotsupported = false;</script>\n" +
  "  <!--[if lte IE9]> <script type=\"text/javascript\">fullscreennotsupported = true; </script> < ![endif]-->\n" +
  "</head>\n" +
  "\n" +
  "<body>\n" +
  "  <div id=\"menu\">\n" +
  "    <button onclick=\"screenfull.request();\" id=\"launchFullscreenButton\">Launch Fullscreen</button>\n" +
  "  </div>\n" +
  "  <div class=\"slideshow\">\n";

var slideshowslides = [];

var urlcount = urls.length;
renderPage(urls.shift(), urlcount - urls.length);
function renderPage(url, index) {
  var filename = 'screenshot' + index.pad(2) + '.png';
  console.log("Open " + url);
  page.open(url, function (status) {
    console.log("Loaded " + url);
    // Retry if we failed to load the page
    if (status !== 'success') {
      renderPage(url, urlcount - urls.length);
      return;
    }

    // Registre everything a resource is loaded so we make sure they a finished loading before taking the screenshot
    var resources = {};
    page.onResourceRequested = function (request) {
      //console.log(request.id + ": " + request.url + ':' + request.stage);
      resources[request.id] = request.stage;
    };
    page.onResourceReceived = function (response) {
      //console.log(response.id + ": " + response.url + ':' + response.stage);
      resources[response.id] = response.stage;
    };

    // Special handling for QlikView
    page.onCallback = function (msg) {
      resources['qlikviewpage'] = 'end';
    };
    var qlikviewpage = page.evaluate(function () {
      if(typeof Qv === 'object') {
        Qv.GetCurrentDocument().SetOnUpdateComplete(function() { window.callPhantom(); } );
        return true;
      } else {
        return false;
      }
    });
    if(qlikviewpage && typeof trifle !== 'object') { // Disable on TrifleJS as it is not working
      resources['qlikviewpage'] = 'start';
    }
    
    // Make sure everything is loaded, before we try to do anything
    var interval = window.setInterval(function () {
      console.log("Check if everything is loaded");
      // Run over all the resources and check they are loaded
      for (var i in resources) {
        if (resources[i] !== 'end') {
          return false;
        }
      }
      window.clearInterval(interval);

      // Wait for waittime before taking screenshot
      window.setTimeout(function () {
        // Render page and add to slideshowlist
        console.log("Write to " + filename);
        page.render(filename);
        slideshowslides.push(filename);

        // Take next url or finish with writing the index.html
        if (urls.length > 0) {
          renderPage(urls.shift(), urlcount - urls.length);
        } else {
          console.log("Write index.html");
          indexhtml +=
                  "	</div>\n" +
                  " <script type=\"text/javascript\">var slideshowslides = " + JSON.stringify(slideshowslides) + ";</script>\n" +
                  "</body>\n" +
                  "</html>";
          fs.remove("index.html");
          fs.write("index.html", indexhtml, 'w');
          phantom.exit();
        }
      }, waittime);
    }, 1000);
  });
}