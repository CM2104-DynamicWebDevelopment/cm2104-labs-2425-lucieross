$(function(){
	// usual main starting point when web page loads
	
	// simple CSS class switcher
	// find all divs
	// bind to click events
	// alter the CSS of the specific clicked div element
	$("div").click(function(){
		// $(this) is a shortcut for the element we just selected
		// using $("div")
		if ($("div").hasClass("red")) {
			$( this ).toggleClass( "blue" );
		}

		else if ($("div").hasClass("blue")) {
			$( this ).toggleClass( "green" );
		}

		else if ($("div").hasClass("green")) {
			$( this ).toggleClass( "red" );
		}

		$( ".red" ).on( "click", function() {
			$( ".red" ).animate({left: "+=50", height: "toggle"
			}, 5000, function() {
			});
		});

		$( ".blue" ).on( "click", function() {
			$( ".blue" ).animate({
			  width: [ "toggle", "swing" ], height: [ "toggle", "swing" ],
			}, 5000, "linear", function() {
			});
		});

		$(".green").click(function(){
			$(this).css("position", "absolute");
			$(this).animate({left:"+=360"}, 1000, function(){});
		});
		  

	});
	
});