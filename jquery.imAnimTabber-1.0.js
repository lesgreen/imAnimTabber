/*
 * 	 imAnimTabber, formerly imUpSideDownTabber  
 * 	 Copyright (C) 2008  Intriguing Minds, Inc.
 *   Version 1.0
 * 
 * 	 Change Log: Version 1.0
 * 		1. Ability to Control the speed
 * 		2. Style each tab individually and each selected tab separately (if active_tab_class is empty)
 * 		3. Added mode (manual, auto). 'auto' is default. if 'manual', initial tabs can be created manually
 * 		4. Added attribute option (slide, width, height, fade, marginLeft) - marginLeft is called by the carousel option only. 
 * 			The slide option is the original imUpSideDownTabber option 
 * 		5. Added carousel option. Can only be used in manual mode. Tabs option not needed. Tabs can't be individually styled. 
 * 			Takes format:
 * 			carousel: {"slide_container": "detailContainer", "slide_parent": "portfolio", "num_slides": 4, "active_tab_class": "selected"}
 * 
 * 		5. Added Queue: Default true. If false, new content will close at same time as old content opens
 * 		6. Changed name to imAnimTabber
 * 		7. Content container attributes can vary (each container can have a different height, width, etc).
 * 		8. Added Slide container option to be used for carousel effect; 
 * 
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.

 *   Demo and Documentation can be found at:   
 *   http://www.grasshopperpebbles.com
 *   
 */
////Find all link elements and add an onfocus attribute and value
//function hideFocusBorders(){
//var theahrefs = document.getElementsByTagName("a");
//if (!theahrefs){return;}
//for(var x=0;x!=theahrefs.length;x++){
//theahrefs[x].onfocus = function stopLinkFocus(){this.hideFocus=true;};
//}
//}

;(function($) {
	$.fn.extend({
        imAnimTabber: function(options) { 
        	opts = $.extend({}, $.tabberDisplay.defaults, options);
			return this.each(function() {
				new $.tabberDisplay(this, opts);
			});
        }
    });	

$.tabberDisplay = function(obj, opts) {
	var $this = $(obj);
	var selected, sel_class, cntId, btn, cnt_width = null;
	var attrib = new Array();
	if (opts.mode == 'auto') {
		$this.append($('<div></div>').attr("id", opts.tab_container));
		$.each(opts.tabs, function(i, itm) {
			attrib[itm.content_id] = (itm.attribute) ? itm.attribute : opts.attribute;
			attrib['tcls'+itm.content_id] = (itm.active_tab_class) ? itm.active_tab_class : opts.active_tab_class;
			attrib['attr'+itm.content_id] = $("#"+itm.content_id).css(attrib[itm.content_id]);
			$("#"+opts.tab_container).append($('<a></a>')						
			//a = document.createElement(a);
			//$(a)
				.append(itm.caption)
				.attr("href", "#")
				.addClass(itm.class_name)
				.click(function() {
					toggleShow($(this), itm.content_id);
					return false;
				}));
		});
	} else {
		if (opts.carousel) {
			opts.attribute = 'marginLeft';
			// get the width of the parent. Parent must have overflow:hidden set in stylesheet 
			cnt_width = $('#'+opts.carousel.slide_parent).css('width');
			attrib[opts.carousel.slide_container] = opts.attribute;
			var nl = opts.carousel.num_slides;
			//try using index
			for (var i = 0; i<nl; i++) {
				attrib['a'+i] = opts.attribute;
				attrib['order'+i] = i;
				// tabs can't be indvidually styled
				attrib['tcls'+i] = opts.active_tab_class;
				// For carousel, menu items should be ordered the same as they appear on the screen
				var a = $('#'+opts.tab_container+' a:eq('+i+')');
				$(a).attr("title", i);
				$(a).click(function() {
					toggleShow($(this), $(this).attr('title'));
					return false;
				});
			}
		} else {	
			$.each(opts.tabs, function(i, itm) {
				attrib[itm.content_id] = (itm.attribute) ? itm.attribute : opts.attribute;
				attrib['tcls'+itm.content_id] = (itm.active_tab_class) ? itm.active_tab_class : opts.active_tab_class;
				attrib['attr'+itm.content_id] = $("#"+itm.content_id).css(attrib[itm.content_id]);
				//the tab_container option must be specified if itm.class_name is not
				var a = (itm.class_name) ? $('.'+itm.class_name) : $('#'+opts.tab_container+' a:eq('+i+')');
				//set initial tab for fade and width
				if ((attrib[itm.content_id] == 'width') || (attrib[itm.content_id] == 'fade')) {
					if (itm.selected) {
						toggleShow($(a), itm.content_id);
					}
				}
				$(a).click(function() {
					toggleShow($(this), itm.content_id);
					return false;
				});
			});
		}
	} 
	
	function toggleShow(b, cid) {
		btn = b;
		//opts.active_tab_class = (itm.active_tab_class) ? itm.active_tab_class : opts.active_tab_class;
		cntId = cid;
		if (opts.carousel) {
			showContent();
		} else {
			if (opts.queue) {
				if (selected) {
					hideContent(true);
				} else {
					showContent();
				}
			} else {
				hideContent(false);
				showContent();
			}
		}
	};
	
	function hideContent(callback) {
		if (attrib[selected] == 'fade') {
			if (callback) {
				$("#"+selected).fadeOut(opts.speed, showContent);
			} else {
				$("#"+selected).fadeOut(opts.speed);
			}
		} else if (attrib[selected] == 'slide') {
			if (callback) {
				$("#"+selected).slideUp(opts.speed, showContent);
			} else {
				$("#"+selected).slideUp(opts.speed);
			}
		} else {
			var attr = (attrib[selected] == 'height') ? {height: 0} : {width: 0};
			if (callback) {
				$("#"+selected).animate( attr, opts.speed, "linear", showContent);
			} else {
				$("#"+selected).animate( attr, opts.speed, "linear");
			}
		}
	};
	
	function showContent() {
		if (sel_class) {
			$("."+sel_class).removeClass(sel_class);
		}
		if ((selected) && (!opts.carousel)) {
			$("#"+selected).css('display', 'none');
		}
		if (selected == cntId) {
			selected = '';	
			$("."+sel_class).removeClass(sel_class);
			sel_class = '';
			//attrib = '';
		} else {
			if (attrib['tcls'+cntId] != '') { 
				btn.addClass(attrib['tcls'+cntId]);
			}	
			if (attrib[cntId] == 'fade') {
				$("#"+cntId).fadeIn(opts.speed);
			} else if (attrib[cntId] == "slide") {
				$("#"+cntId).slideDown(opts.speed);
			} else if (attrib['a'+cntId] == "marginLeft") {
				var dir = (parseInt(cnt_width)*cntId)+'px';
				$("#"+opts.carousel.slide_container).animate( {marginLeft : '-'+dir}, 'slow');
			} else {
				var wd = attrib['attr'+cntId];
				$("#"+cntId).css(attrib[cntId], '0px');
				var attr = (attrib[cntId] == 'height') ? {height: wd } : {width: wd };
				//$("#"+cntId).animate( attr, {queue: opts.queue, duration:opts.speed});
				$("#"+cntId).animate( attr, opts.speed);
			}	
			selected = cntId;
			sel_class = attrib['tcls'+cntId];
		}	
	};
	
};

$.tabberDisplay.defaults = {
	//element: 'a';//this value can be blank. It will be automatically set to "a"
	//active_tab_class: 'selected';//this value can be blank. It will be automatically set to "a.selected"
	tab_container: '',
	active_tab_class: '',
	tabs: '',
	attribute: 'slide',
	speed: 'slow',
	queue: true,
	mode: 'auto',
	carousel: ''
};

})(jQuery);	