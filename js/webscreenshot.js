function getParameterByName(name) {
    var name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(document).on(screenfull.raw.fullscreenchange, function () {
    if (screenfull.isFullscreen) {
        $("#launchFullscreenButton").hide();
    } else {
        $("#launchFullscreenButton").show();
    }
});

$(window).load(function () {
    var slides = getParameterByName("slides") ? getParameterByName("slides").split(',') : [];
    var slideshow = $('div.slideshow'); 
    var expandedslides = {};
    
    // Disable fullscreen button on IE9 and down
     if (fullscreennotsupported) {
        $("#launchFullscreenButton").hide();
    }
    
    // Expand ranges so we don't have to list them one by one
    if (slides.length > 0) {
        slides.forEach(function(element, index, array){
            var range = element.split('-');
            if(range.length > 1) {
                for(i=range[0];i<=range[1];i++) {
                    expandedslides[i - 1] = true; 
                }
            } else {
                expandedslides[element - 1] = true;
            }
        });
        slides = expandedslides;
    
    } else {
        for (i = 0; i <= slideshowslides.length; i++) {
            expandedslides[i] = true;
        }
    }
    
    // Add slide images
    slideshowslides.forEach(function(element, index, array){
        if(expandedslides[index]) {
            slideshow.append("<img src=" + element + " alt=\"\">");
        }
    });
    
    // Start slideshow
    slideshow.cycle({
        "centerHorz" : true,
        "centerVert" : true
    });
});