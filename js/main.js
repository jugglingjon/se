// ====================================
// 				^GLOBALS
// ====================================

var $currentScreen='screen-splash',
	$globalFadeTime=400,
	$currentObject;



// ====================================
// 				^DATA
// ====================================

var $OLDobjects={
	100:{
		"name": "CD",
		"slug": "cd",
		"id": 100,
		"distractors":[
			{
				"name": "Pen",
				"slug": "pen"
			},
			{
				"name": "Wrench",
				"slug": "wrench"
			}
		]
	},
	200:{
		"name": "Envelope",
		"slug": "envelope",
		"id": 200,
		"distractors":[
			{
				"name": "Knife",
				"slug": "knife"
			},
			{
				"name": "Calculator",
				"slug": "calculator"
			}
		]
	},
	300:{
		"name": "USB",
		"slug": "usb",
		"id": 300,
		"distractors":[
			{
				"name": "Mouse",
				"slug": "mouse"
			},
			{
				"name": "Soda",
				"slug": "soda"
			}
		]
	}
}

var beaconlist = [
{
	"major":100,
	"minors":[1,2],
	"text":'You found location 1.',
	"found":false,
	"name": "CD",
	"slug": "cd",
	"id": 100,
	"distractors":[
		{
			"name": "Pen",
			"slug": "pen"
		},
		{
			"name": "Wrench",
			"slug": "wrench"
		}
	],
	"onFind":function(){
		//what to do when beacon 1 is found
		alert('beacon 1 found');
		this.found = true;
		beaconFinder.stop();
	}
},
{
	"major":200,
	"minors":[1,2],
	"text":'You found location 2.',
	"found":false,
	"name": "Envelope",
	"slug": "envelope",
	"id": 200,
	"distractors":[
		{
			"name": "Knife",
			"slug": "knife"
		},
		{
			"name": "Calculator",
			"slug": "calculator"
		}
	],
	"onFind":function(){
		//what to do when beacon 2 is found
		alert('beacon 2 found');
		this.found = true;
		beaconFinder.stop();
	}
},
{
	"major":300,
	"minors":[1,2],
	"text":'You found location 3.',
	"found":false,
	"name": "USB",
	"slug": "usb",
	"id": 300,
	"distractors":[
		{
			"name": "Mouse",
			"slug": "mouse"
		},
		{
			"name": "Soda",
			"slug": "soda"
		}
	],
	"onFind":function(){
		//what to do when beacon 3 is found
		alert("beacon 3 found");
		this.found = true;
		beaconFinder.stop();
	}
}
];

// ====================================
// 				^UTILITIES
// ====================================

//array shuffle function
function shuffle(a) {
  var j, x, i;

	for (i = a.length; i; i--) {
		j = Math.floor(Math.random() * i);
		x = a[i - 1];
		a[i - 1] = a[j];
		a[j] = x;
	}
	console.log(a);
  a.sort(function(a,b){
    if(a.complete&&b.complete){
      return 0;
    }
    else if(a.complete){
      return 1;
    }
    else{
      return -1
    }
  })
  
  
}

//randomize jquery object children
$.fn.randomize = function(selector){
    (selector ? this.find(selector) : this).parent().each(function(){
        $(this).children(selector).sort(function(){
            return Math.random() - 0.5;
        }).detach().appendTo(this);
    });

    return this;
};

//convert number to number with commas
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//converts spaces to dashes
function toDashes(text){
	return text.replace(' ','-');
}

//converts spaces to spaces
function toSpaces(text){
	return text.replace('-',' ');
}


// ====================================
// 				^SCREEN CONTROL
// ====================================



//changes to targeted screen
//callback object: {before:<callback before fadein begins>, after: <callback after faded in>}
function changeScreen(screenClass, callbackObj){
	
	//manage current and last screen variables
	$lastScreen=$currentScreen;
	$currentScreen=screenClass;

	var elementsToFade=$('.screen:not(.'+screenClass+')');
	var fadeCount=elementsToFade.length;

	elementsToFade.fadeOut($globalFadeTime, function(){
		if(--fadeCount>0) return;

		if(callbackObj&&callbackObj.before){
			callbackObj.before();
		}
		
		$('.'+screenClass).fadeIn($globalFadeTime,function(){
			if(callbackObj&&callbackObj.after){
				callbackObj.after();
			}
		});
	});
}


// ====================================
// 				^BEACONS
// ====================================

function evalTriggers(){
	$('.btn-trigger').each(function(){
		if($objects[$(this).attr('data-id')].found){
			$(this).css('background','red').addClass('found');
		}
	});

	if($('.btn-trigger.found').length==3){
		alert('game over!');
	}
}


// ====================================
// 				^EVENTS
// ====================================

$(document).ready(function(){

	//generic link type to change between screens
	$('.nav-link').on('click',function(){
		changeScreen($(this).attr('data-to'));
		return false;
	});

	//simulates ibeacon trigger
	$('.btn-trigger').click(function(){
		$currentObject=$(this).attr('data-id');

		$.get('template-foundModal.html',function(template){
			//console.log(template);
			var rendered=Mustache.render(template,{"id":$currentObject});
			$('.dynamic-modal').empty().html(rendered);
			$('#modal-found').modal();
		});
		
		return false;
	});

	//opens 'found' screen, renders options
	$('body').on('click','.btn-found',function(){
		$('#modal-found').modal('hide');

		$.get('template-found.html',function(template){
			var rendered=Mustache.render(template,$objects[$currentObject]);
			$('.screen-found').empty().html(rendered);
			$('.found-options').randomize('.found-option');
			changeScreen('screen-found');
		});

		return false;
	});

	$('body').on('click','.found-option a',function(){
		if($(this).hasClass('correct')){
			alert('Correct');
		}
		else{
			alert('Incorrect');
		}
		$objects[$currentObject].found=true;
		evalTriggers();
		changeScreen('screen-search');
		return false;
	});

	$('.btn-toSearch').click(function(){
		beaconFinder.initialize;
		changeScreen('screen-search');
	});

});
