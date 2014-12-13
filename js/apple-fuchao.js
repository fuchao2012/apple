$(document).ready(function () {
	// Cache selectors for faster performance.
	var $window = $(window),
		$mainMenuBar = $('#mainMenuBar'),
		$mainMenuBarAnchor = $('#mainMenuBarAnchor');

	// Run this on scroll events.
	$window.scroll(function () {
		var window_top = $window.scrollTop();
		var div_top = $mainMenuBarAnchor.offset().top;
		if (window_top > div_top) {
			// Make the div sticky.
			$mainMenuBar.addClass('stick');
			$mainMenuBarAnchor.height($mainMenuBar.height());
		} else {
			// Unstick the div.
			$mainMenuBar.removeClass('stick');
			$mainMenuBarAnchor.height(0);
		}
	});
});
//change image color
function change_silicone(color){
    var select = document.getElementById('gallery-silicone-iphone-6-cases').childNodes;
    var target = select[1].childNodes[1];
    target.className = 'silicone-iphone-6-'+color.trim()+'-case-image';
}
function change_leather(color){
    var select = document.getElementById('gallery-leather-iphone-6-cases').childNodes;
    var target = select[1].childNodes[1];
    target.className = 'leather-iphone-6-'+color.trim()+'-case-image';
}
function change_silicone_plus(color){
    var select = document.getElementById('gallery-silicone-iphone-6-plus-cases').childNodes;
    var target = select[1].childNodes[1];
    target.className = 'silicone-iphone-6-plus-'+color.trim()+'-case-image';
}
function change_leather_plus(color){
    var select = document.getElementById('gallery-leather-iphone-6-plus-cases').childNodes;
    var target = select[1].childNodes[1];
    target.className = 'leather-iphone-6-plus-'+color.trim()+'-case-image';
}

