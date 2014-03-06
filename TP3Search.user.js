// ==UserScript==
// @name       Add TP2 Search Capabilities back to TP3
// @version    1.0
// @include      *targetprocess.corp.volusion.com*
// @include      *targetprocess*
// @include      *targetprocess.ads.volusion.com*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js
// @copyright  2014
// ==/UserScript==


(function ($, window) {

	var $modal, $overlay, $TP2Link, iframe, baseSearchPath,
		iframe = document.createElement('iframe'),
		iframeClass = '.tp2search'
		baseSearchPath = '/Search/Search.aspx?SearchString=';

	function showModal(uri) {
		$modal.add($overlay).show();

		$newIframe(uri).load(function () {
			$(iframeClass).parent().find('.close').click(closeButtonHandler);
		}).appendTo($modal);

		function closeButtonHandler() {
			$modal.find('iframe').remove();
			$modal.add($overlay).hide();
		}
	}

	function $newIframe(uri) {
		return $(iframe.cloneNode()).attr({'src' : uri, 'class' : 'tp2search'}).css({
			'width' : '100%',
			'height' : '100%'
		});
	}

	function appendNewSearchLink() {
		var $searchField = $('<input type="text" id="tp2searchfield" />').insertBefore($TP2Link).keypress(enterHandler);
		var $searchButton = $('<input type="button" value="Search TP2" style="position:relative; margin-right: 100px;" />')
			.insertAfter($searchField)
			.click(function () {
				var searchQuery = $searchField.val();
				showModal(generateSearchURI(searchQuery, location.hostname));
			});

		function enterHandler(e) {
			if (e.which == 13) {
    			$searchButton.trigger('click');
  			}
		}
	}

	function generateSearchURI(searchTerm, host) {
		return '//' + host + '/' + baseSearchPath + searchTerm;
	}

	function cacheJQElements() {
		$modal = $('div.ui-popup').eq(0);
		$overlay = $('div.ui-popup-overlay').eq(0);
		$TP2Link = $('a[data-title="Go back to the TP2 interface"]');
	}

	function init() {
		cacheJQElements();
		appendNewSearchLink();
	}

	function JQReady() {
		if(window.$ && $('.context-menu-list').length) {
			init();
		} else {
			setTimeout(JQReady, 500);
		}
	}

	JQReady();

}(jQuery, window));
