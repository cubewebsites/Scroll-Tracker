/**
* Method for applying vendor specific styles for rotation
**/
function cube_rotate(element,angle) {
	var units = 'rad';
	element.css('-webkit-transform','rotate('+angle+units+')');
	element.css('-moz-transform','rotate('+angle+units+')');
	element.css('-o-transform','rotate('+angle+units+')');
	element.css('-ms-transform','rotate('+angle+units+')');	
}

$(document).ready(function(){
	//globals
	var stage		=	$('#stage');
	var sun			=	$('#sun');
	var hills		=	$('#hills');
	var cloud1		=	$('#cloud1');
	var cloud2		=	$('#cloud2');
	var stars		=	$('#stars');
	var showcontent	=	false;
	//hide content if showcontent is off
	if(!showcontent) {
		$('.content-wrapper').hide();
		$('body').css({height:'2000px'});
	}
	//calculate some useful dimensions
	var stagewidth	=	$(document).width();
	var sunstage	=	stagewidth - sun.width();
	var orgsunwidth		=	sun.width();
	var orgsunheight	=	sun.height();
	//useful variables for the sun motion
	var radius 	= stagewidth/2;
	var centerX	= sunstage/2;
	var centerY	= hills.offset().top;
	//make the stage full screen
	stage.width($(window).width());
	stage.height($(window).height());
	//various colours of the day
	var skycolours	=	({
		night : '#112B3D',
		dawn  : '#3E3146',
		morning : '#DDF6DF',
		midday : '#C2F5EE',
		afternoon : '#55DBEE',		
		dusk : '#B54D36'
	});
	//the fun bit - initialize the tracker
	scrollTracker.initialize();
	//callback for when the window is resized
	scrollTracker.onResize = resize;

	//add some objects to track on the scroll event
	scrollTracker.addObject('sun',animateSun);
	//an example of an inline callback, rather than explicitly named function
	scrollTracker.addObject('cloud1',function(scrollpercent,scrollpos){	
		var cloudright	=	scrollpercent / 100 * stagewidth;
		cloud1.css({right:cloudright});
	});
	scrollTracker.addObject('cloud2',animateCloud2);
	scrollTracker.addObject('stars',animateStars);

	//callback function for window resize
	function resize() {
		//recalculate all the varaibles
		stagewidth	=	$(document).width();
		sunstage	=	stagewidth - sun.width();		
		radius 	= stagewidth/2;
		centerX	= sunstage/2;
		centerY	= hills.offset().top;
		stage.width($(window).width());
		stage.height($(window).height());
	}

	//callback for the sun object
	function animateSun(scrollpercent,scrollpos) {
		//the sun moves into the distance towards midday...
		var x = sun.offset().left - centerX;
		var scalefactor = Math.abs(x) * 1/radius;
		sun.width(orgsunwidth * scalefactor);
		sun.height(orgsunheight * scalefactor);

		//the sun also complete a full rotation in 24 hours
		var rotation	=	scrollpercent / 100 * Math.PI * 2;		
		cube_rotate(sun,rotation);

		//and obviously the sky changes colour
		var from	=	skycolours.night;
		var to = skycolours.dawn;		
		if(scrollpercent > 10 && scrollpercent < 20) {
			from = skycolours.dawn;
			to   = skycolours.morning;
		}
		else if(scrollpercent >= 20 && scrollpercent < 50) {
			from = skycolours.morning;
			to   = skycolours.midday;
		}
		else if(scrollpercent >= 50 && scrollpercent < 70) {
			from = skycolours.midday;
			to = skycolours.afternoon;
		}
		else if(scrollpercent >= 70 && scrollpercent < 90) {
			from = skycolours.afternoon;
			to = skycolours.dusk;
		}
		else if(scrollpercent >= 90) {
			from = skycolours.dusk;
			to = skycolours.night;
		}
		//let me light up the sky...
		stage.stop().animate({backgroundColor:to},'fast');		

		//move the sun along the arc
		var angle 	=	-1*(scrollpercent / 180) * Math.PI*2 + Math.PI; //*-1 gets the clockwise angle, 
		xpos		=	radius * Math.cos(angle) + centerX;
		ypos		=	hills.height() + radius * Math.sin(angle);

		ypos -= sun.height()/2;
		sun.css({bottom:ypos,left:xpos});
	}
	
	//callback for cloud2
	function animateCloud2(scrollpercent,scrollpos) {
		var cloudright	=	scrollpercent / 100 * stagewidth;
		cloud2.css({right:cloudright});
	}
	
	//callback for the stars
	function animateStars(scrollpercent,scrollpos) {
		//destroy the stars if user has scrolled away from night
		if(scrollpercent < 90 && stars.hasClass('nighttime')) {
			stars.removeClass('nighttime');
			stars.html('');
			stars.hide();
			return true;
		}
		
		//do nothing if its not nighttime yet
		if(scrollpercent < 90 || stars.hasClass('nighttime')) {
			return true;
		}
		
		//add a class name to track if it's already nighttime
		stars.addClass('nighttime');
		
		//get the size of the stars element
		var starswidth	=	stars.width();
		var starsheight	=	stars.height();
		
		//create 40 random stars
		for(var i=0;i<40;i++) {
			var w		=	Math.random()*2;			//max 2 pixels wide
			var h		=	Math.random()*2;			//max 2 pixels high
			var top		=	Math.random()*starsheight;	//ensure it's within the stars element
			var left	=	Math.random()*starswidth;	//ensure it's within the stars element
			var star	=	'<div class="star"></div>'; //create the html syntax for it
			//add to stars,  and apply attributes
			stars.append(star);
			$('.star:last',stars).width(w).height(h).css({left:left,top:top});
		}
		stars.fadeIn();
	}
});