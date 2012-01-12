function cube_rotate(element,angle) {
	var units = 'rad';
	element.css('-webkit-transform','rotate('+angle+units+')');
	element.css('-moz-transform','rotate('+angle+units+')');
	element.css('-o-transform','rotate('+angle+units+')');
	element.css('-ms-transform','rotate('+angle+units+')');	
}

$(document).ready(function(){
	
	var debugmode	=	false;

	var stage		=	$('#stage');
	var sun			=	$('#sun');
	var hills		=	$('#hills');

	var stagewidth	=	$(document).width() - sun.width();
	var pagebottom	=	$(document).height() - $(window).height();

	var orgsunwidth		=	sun.width();
	var orgsunheight	=	sun.height();

	var radius 	= stagewidth/2;
	var centerX	= stagewidth/2;
	var centerY	= hills.offset().top;

	//make the stage full screen
	stage.width($(window).width());
	stage.height($(window).height());	

	var skycolours	=	({
		night : '#112B3D',
		dawn  : '#836f8e',
		morning : '#DDF6DF',
		midday : '#C2F5EE',
		afternoon : '#55DBEE',		
		dusk : '#B54D36'
	});

	//make sure the stage is a canvas element
	//draw the arc
	if(debugmode) {
		stage.prepend('<canvas id="canvas" />');
		var canvas	=	document.getElementById('canvas');
	    canvas.width = stagewidth;
	    canvas.height = stage.height();

		var context = canvas.getContext("2d");		
		var startingAngle	=	0;
		var endingAngle		=	1 * Math.PI;

		context.arc(centerX,centerY,radius,startingAngle,endingAngle,true);
		context.lineWidth	=	1;
		context.strokeStyle = 	"black";
		context.stroke();
	}
	


	$(document).bind('scroll',function(e){
		
		var scrollpos			=	$(this).scrollTop();
		var scrollpercent		=	scrollpos/pagebottom*100;

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

		stage.stop().animate({backgroundColor:to},'fast');		

//		colorStore(from);
//		stepCalc();
//		mixPalette();

		//move the sun along the circumference
		var angle 	=	-1*(scrollpercent / 180) * Math.PI*2 + Math.PI;
		xpos		=	radius * Math.cos(angle) + centerX;
		ypos		=	hills.height() + radius * Math.sin(angle);

		ypos -= sun.height()/2;
		sun.css({bottom:ypos,left:xpos});

	});

});