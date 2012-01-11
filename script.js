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

	var skycolours	=	{
		night : '#112B3D',
		dawn  : '#836f8e',
		morning : '#DDF6DF'
		midday : '#C2F5EE',
		afternoon : '#55DBEE',		
		dusk : '#B54D36'
	};

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
			to   = skycolors.morning;
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

		colorStore(from);
		stepCalc();
		mixPalette();

		//move the sun along the circumference
		var angle 	=	-1*(scrollpercent / 180) * Math.PI*2 + Math.PI;
		xpos		=	radius * Math.cos(angle) + centerX;
		ypos		=	hills.height() + radius * Math.sin(angle);

		ypos -= sun.height()/2;
		sun.css({bottom:ypos,left:xpos});

	});

})

/**
* Color calculator by Lucent, improved by Andre Steenveld
* http://refactormycode.com/codes/254-hex-color-between-two-colors
*/
function calc_color( value, start, end, min, max ){
  var n = ( value - min ) / ( max - min );
    
  end = parseInt( end.substring( 1, 7 ), 16 );
  start = parseInt( start.substring( 1, 7 ), 16 );
         
  var result = start +
    ( ( ( Math.round( ( ( ( ( end & 0xFF0000 ) >> 16 ) - ( ( start & 0xFF0000 ) >> 16 ) ) * n ) ) ) << 16 )
    + ( ( Math.round( ( ( ( ( end & 0x00FF00 ) >> 8 ) - ( ( start & 0x00FF00 ) >> 8 ) ) * n ) ) ) << 8 )
    + ( ( Math.round( ( ( ( end & 0x0000FF ) - ( start & 0x0000FF ) ) * n ) ) ) ) ) ;

     return "#" + 
       ( ( result >= 0x100000 )
         ? ""
         : ( result >= 0x010000 )
           ? "0"
           : ( result >= 0x001000 )
             ? "00"
             : ( result >= 0x000100 )
               ? "000"
               : ( result >= 0x000010 )
                 ? "0000"
                 : "00000" ) + result.toString( 16 );  
}

// Thanks to Steve Champeon (hesketh.com) for explaining the math in such a way that I could 
// understand it and create this tool
// Thanks to Roberto Diez for the idea to create the "waterfall" display
// Thanks to the Rhino book, I was able to (clumsily) set up the Color object

var cursor = 0;
var colType = 'hex';
var base = 16;
var ends = new Array(new Color,new Color);
var step = new Array(3);
var palette = new Array(new Color,new Color,new Color,new Color,new Color,new Color,new Color,new Color,new Color,new Color,new Color,new Color);

function GetElementsWithClassName(elementName,className) {
	var allElements = document.getElementsByTagName(elementName);
	var elemColl = new Array();
	for (i = 0; i< allElements.length; i++) {
		if (allElements[i].className == className) {
			elemColl[elemColl.length] = allElements[i];
		}
	}
	return elemColl;
}

function Color(r,g,b) {
	this.r = r;
	this.g = g;
	this.b = b;
	this.coll = new Array(r,g,b);
	this.valid = cVerify(this.coll);
	this.text = cText(this.coll);
	this.bg = cText(this.coll);
}

function cVerify(c) {
	var valid = 'n';
	if ((!isNaN(c[0])) && (!isNaN(c[1])) && (!isNaN(c[2]))) {valid = 'y'}
	return valid;
}

function cText(c) {
	var result = '';
	var d = 1;
	if (colType == 'rgbp') {d = 2.55}
	for (k = 0; k < 3; k++) {
		val = Math.round(c[k]/d);
		piece = val.toString(base);
		if (colType == 'hex' && piece.length < 2) {piece = '0' + piece;}
		if (colType == 'rgbp') {piece = piece + '%'};
		if (colType != 'hex' && k < 2) {piece = piece + ',';}
		result = result + piece;
	}
	if (colType == 'hex') {result = '#' + result.toUpperCase();}
		else {result = 'rgb(' + result + ')';}
	return result;
}

function colorParse(c,t) {
	var m = 1;
	c = c.toUpperCase();
	col = c.replace(/[\#rgb\(]*/,'');
	if (t == 'hex') {
		if (col.length == 3) {
			a = col.substr(0,1);
			b = col.substr(1,1);
			c = col.substr(2,1);
			col = a + a + b + b + c + c;
		}
		var num = new Array(col.substr(0,2),col.substr(2,2),col.substr(4,2));
		var base = 16;
	} else {
		var num = col.split(',');
		var base = 10;
	}
	if (t == 'rgbp') {m = 2.55}
	var ret = new Array(parseInt(num[0],base)*m,parseInt(num[1],base)*m,parseInt(num[2],base)*m);
	return(ret);
}

function colorPour(pt,n) {
	var textObj = document.getElementById(pt + n.toString());
	var colObj = document.getElementById(pt.substring(0,1) + n.toString());
	if (pt == 'col') {temp = ends[n]} else {temp = palette[n]}
	if (temp.valid == 'y') {
		textObj.value = temp.text;
		colObj.style.backgroundColor = temp.bg;
	}
}

function colorStore(colour) {
	// var inVal = 'col'+n.toString();
	// var inCol = document.getElementById(inVal).value;
	//var c = colorParse(inCol,colType);
	var c = colorParse(colour,colType);
	ends[n] = new Color(c[0],c[1],c[2]);
	if (ends[n].valid == 'y') {colorPour('col',n)}
}

function stepCalc() {
	//var steps = parseInt(document.getElementById('steps').value) + 1;
	var steps	=	10;
	step[0] = (ends[1].r - ends[0].r) / steps;
	step[1] = (ends[1].g - ends[0].g) / steps;
	step[2] = (ends[1].b - ends[0].b) / steps;
}

function mixPalette() {
	//var steps = parseInt(document.getElementById('steps').value);
	var steps = 10;
	var count = steps + 1;
	palette[0] = new Color(ends[0].r,ends[0].g,ends[0].b);
	palette[count] = new Color(ends[1].r,ends[1].g,ends[1].b);
	for (i = 1; i < count; i++) {
		var r = (ends[0].r + (step[0] * i));
		var g = (ends[0].g + (step[1] * i));
		var b = (ends[0].b + (step[2] * i));
			palette[i] = new Color(r,g,b);
	}
	for (j = count + 1; j < 12; j++) {
		palette[j].text = '';
		palette[j].bg = 'white';
	}
}

function drawPalette() {
	stepCalc();
	mixPalette();
	for (i = 0; i < 12; i++) {
		colorPour('pal',i);
	}		
}

function setCursor(n) {
	cursor = n;
	var obj1 = document.getElementById('col0');
	var obj2 = document.getElementById('col1');
	obj1.style.backgroundColor = '';
	obj2.style.backgroundColor = '';
	if (cursor >= 0 && cursor <= 1) {
		document.getElementById('col'+cursor).style.backgroundColor = '#FF9';
	}
}

function colorIns(c) {
	var obj = document.getElementById('col'+cursor);
	var result = colorParse(c,'hex');
	ends[cursor] = new Color(result[0],result[1],result[2]);
	obj.value = ends[cursor].text;
	if (ends[cursor].valid == 'y') {colorPour('col',cursor)}
}

function setType(inp) {
	colType = inp;
	if (inp == 'hex') {base = 16;} else {base = 10;}
	for (i = 0; i < 2; i++) {
		var obj = document.getElementById('col' + i);
		if (ends[i].valid == 'y') {
			ends[i] = new Color(ends[i].r,ends[i].g,ends[i].b);
			obj.value = ends[i].text;
		}
	}
	drawPalette();
	document.getElementById('hex').className = '';
	document.getElementById('rgbd').className = '';
	document.getElementById('rgbp').className = '';
	document.getElementById(inp).className = 'coltype';	
}

function init(inp) {
	if (!inp) {
		obj = GetElementsWithClassName('a','coltype');
		inp = obj[0].id;
	}
	document.getElementById(inp).className = 'coltype';
	for (i = 0; i < 2; i++) {
		ends[i] = new Color;
		document.getElementById('col'+i).value = '';
		document.getElementById('c'+i).style.background = 'white';
	}
	for (j = 0; j < 12; j++) {
		palette[j] = new Color;
		document.getElementById('pal'+j).value = '';
		document.getElementById('p'+j).style.background = 'white';
	}
	document.getElementById('steps').value = '0';
	document.getElementById('col0').focus();
}