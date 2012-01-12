scrollTracker 				=	new Object();
scrollTracker.objects		=	({});		//container for all the trackers/bojects
scrollTracker.scrollpos		=	0;			//current scroll position
scrollTracker.scrollpercent	=	0;			//current scroll percent
scrollTracker.pagebottom	=	0;			//height of the page
scrollTracker.onResize		=	null;		//callback for browser resize

/**
* Initialize - call first, before doing anything else!
**/
scrollTracker.initialize	=	function(callback) {
	this.pagebottom			=	$(document).height() - $(window).height();
	scrollTracker._scroll();	
	if(typeof callback === 'function')
		callback(this);	
}

/**
* AddObject - add a new object which is tracking the page scroll.
* @myobject - name of the tracker
* @mycallback - function to call when the page is scrolled
**/
scrollTracker.addObject 	= function(myobject,mycallback){
	this.objects[myobject]	=	mycallback;
};

/**
* DeleteObject - Allows an object to stop tracking the page scroll
* @myobject - the name of the object to stop tracking
* @mycallback - optional callback function
**/
scrollTracker.deleteObject	= function(myobject,callback) {
	delete this.objects[myobject];
	if(typeof callback === 'function')
		callback();
}

/**
* _Scroll - What happens when the page is scrolled
* Shouldn't be called by the user
* Loops through the objects which are tracking the page scroll and executes their callback function
**/
scrollTracker._scroll		=	function(callback) {
	for(var key in this.objects) {
		if(typeof this.objects[key] === 'function')
			this.objects[key](this.scrollpercent,this.scrollpos);
	}
	if(typeof callback === 'function')
		callback();
}

/**
* Resize - what happens when the browser gets resized
* This gets called automatically on resize event - user doesn't need to call it
* Triggers a user specified callback if specified
**/
scrollTracker._resize		= function() {
	this.initialize();
	var callback = this.onResize;
	if(typeof callback === 'function')
		callback();
}

/**
* jQuery Scroll Event Handler
* Hooks onto the scroll event
* Works out what percentage of the page has been scrolled, the triggers the _scroll method
**/
$(window).scroll(function(e){
	scrollTracker.scrollpos			=	$(this).scrollTop();
	scrollTracker.scrollpercent		=	scrollTracker.scrollpos/scrollTracker.pagebottom*100;
	scrollTracker._scroll();
	return true;
});

/**
* jQuery Resize Event Handler
* Hooks onto the resize event
* Triggers the scrollTracker resize method
**/
$(window).resize(function(){	
	scrollTracker._resize();
})