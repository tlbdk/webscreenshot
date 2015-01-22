var page = require('webpage').create();
var fs = require('fs');

/* Add pad method to numbers */
Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) { s = "0" + s; }
  return s;
}

/* Configuration */
var pageWidth = 1920;
var pageHeight = 1080;
var waittime = 1 * 1000;

/* ULRs to load */
var urls = [
  'http://www.google.com',
  'http://www.google.com#q=javascript',
  'http://www.google.com#q=html',
  'http://www.google.com#q=css',
];

/* Set size of browser window */
page.viewportSize = { width: pageWidth, height: pageHeight };
page.clipRect = { top: 0, left: 0, width: pageWidth, height: pageHeight };

var indexhtml = 
  "<!doctype html>\n" +
  "<html lang=\"en\" class=\"demo2\">\n" +
  "<head>\n" +
  "	<meta charset=\"UTF-8\">\n" +
  "	<title>Slideshow</title>\n" +
  "	<link rel=\"stylesheet\" type=\"text/css\" href=\"css/main.css\" />\n" +
  "	<script type=\"text/javascript\" src=\"js/jquery.min.js\"></script>\n" +
  "	<script type=\"text/javascript\" src=\"js/jquery.cycle2.min.js\"></script>\n" +
  "	<script type=\"text/javascript\" src=\"js/jquery.imagefit.js\"></script>\n" +
  "	<script type=\"text/javascript\">\n" +
  "		function fitting() {\n" +
  "			$('div.cycle-slideshow').imagefit({\n" +
  "				mode : 'inside',\n" +
  "				force: false,\n" +
  "				halign : 'center',\n" +
  "				valign : 'middle'\n" +
  "			});\n" +
  "		}\n" +
  "\n" +
  "		$(window).load(function(){\n" +
  "			fitting();\n" +
  "			$(window).resize(function(){  fitting();  });\n" +
  "		});\n" +
  "	</script>\n" +
  "</head>\n" +
  "\n" +
  "<body class=\"demo2\">\n" +
  "	<div class=\"cycle-slideshow\" data-cycle-slide-css='{ \"position\": \"absolute\" }'>\n";

var urlcount = urls.length;
renderPage(urls.shift(), urlcount - urls.length);
function renderPage(url, index) {
  var filename = 'screenshot' + index.pad(2) + '.png';
  console.log("Open " + url);
  page.open(url, function() {
      window.setTimeout(function () {
          console.log("Write " + filename);
          page.render(filename);
          indexhtml += "		<img src=\"" + filename + "\" alt=\"\">\n";
          if(urls.length > 0) {
            renderPage(urls.shift(), urlcount - urls.length);
          } else {
            indexhtml +=
              "	</div>\n" +	
              "</body>\n" +
              "</html>";
            fs.write("index.html", indexhtml, 'w');
            phantom.exit();
          }
      }, waittime);
  });
}