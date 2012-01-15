#ScrollTracker
ScrollTracker is a tiny plugin which lets you easily do things depending on how far down the page the viewer has scrolled  
[VIEW DEMO](http://cubewebsites.github.com/Scroll-Tracker/)

##Requirements
* jQuery

## Installation
Simply include the `scrolltracker.js` file on your page __after__ your inclusion of jQuery  
E.g.

	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
	<script type="text/javascript" src="scrolltracker.js"></script>


##Usage
Once included, you'll need to initialize the tracker, and then add at least one callback (a function which is called whenever the page is scrolled)
The callback can accept two parameters:

`scrollpercent` - how far the viewer has scrolled as a percent

`scrollpos` - the number of pixels the viewer has scrolled  
E.g.

	$(document).ready(function(){
		//initialize the tracker
		scrollTracker.initialize();
		//add a callback	
		scrollTracker.addObject('body',function(scrollpercent,scrollpos){
			//do something really cool here		
		});
	});


##Documentation
Beyond the basics, you can take advantage of various other features:

`onResize` - attach a callback function to this event if you need to handle window resizing.  
E.g.
 
	scrollTracker.onResize = function(){
		alert('window resized');
	};

`deleteObject` - allows you to delete a tracker  
E.g.

	scrollTracker.addObject('myobject',function(scrollpercent,scrollpos){
		if(scrollpercent > 50) {
			scrollTracker.deleteObject('myobject');
			return;
		}
		var leftpos = scrollpercent/100*960;
		$('#myobject').css('left':leftpos);
	})

`pagebottom` - a useful variable.  It's the maximum scroll position (height of the page minus the viewport height).  
This may be useful when doing certain calculations.  
E.g.  

	var pagebottom = scrollTracker.pagebottom;
	//do something with pagebottom here

