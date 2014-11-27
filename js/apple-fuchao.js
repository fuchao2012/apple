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