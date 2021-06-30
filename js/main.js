/* LOAD PARTICLE JS */
particlesJS.load("particles-js", "js/particles.json", function() {
  console.log("callback - particles.js config loaded");
});

/* Change page language when the user selects the desired one */
let current_language = "en";
let it_btn = $('#it-btn');
let en_btn = $('#en-btn');

// Set the current language of the page or keep the default one
if(document.location.pathname.indexOf('index_it.html') >= 0){
	current_language = 'it';
}

it_btn.click(()=>{
	if(current_language == "en"){
		window.location.href = "../index_it.html";
	}
})

en_btn.click(()=>{
	if(current_language == "it"){
		window.location.href = "../index.html";
	}
})

/* 
  	Openable menu management 
*/
let menu_icon = $('#menu-icon');
let icon_change = $('#open-icon');
let nav = $('#myNav');
let is_on = true;
//fontawsome link
let lines = "fas fa-bars fa-2x";
let cross = "fas fa-times fa-2x";

menu_icon.click(()=>{
	openNav();
	return false;
});

// Called if one item of the list is clicked 
function closer() {
	openNav();
	toggle_icon("lines");
}

// Open when someone clicks on the span element
function openNav() {
	if (is_on) {
		document.getElementById("myNav").style.height = "100%";
		is_on = false;
		toggle_icon("cross");
	} else {
		document.getElementById("myNav").style.height = "0%";
		is_on = true;
		toggle_icon("lines");
	}
}
// Change between lines and cross menu icon
function toggle_icon(type){
	if(type == "cross"){
		icon_change.removeClass(lines);
		icon_change.addClass(cross);
	}
	else{
		icon_change.removeClass(cross);
		icon_change.addClass(lines);
	}
}

/*
	Scrolling with arrow management
*/

let home_height = $("#particles-js").outerHeight();
let arrow = $("#arrow i");
let up_arr = "fas fa-angle-up";
let down_arr = "fas fa-angle-down";
//change the arrow direction
$(document).on( 'scroll', function(){
	let curr_pos = document.documentElement.scrollTop || document.body.scrollTop;
	if(curr_pos >= home_height){
		arrow.removeClass(down_arr);
		arrow.addClass(up_arr);
	}
	else{
		arrow.removeClass(up_arr);
		arrow.addClass(down_arr);
	}
 });

// Scroll the page when the user clicks on the arrow
$("#arrow span").click(() => {
	let curr_pos = document.documentElement.scrollTop || document.body.scrollTop;
	//if the user is after the homepage it returns to the homepage
	if(curr_pos >= home_height){
		let scrollDistance = $("#particles-js").offset().top;
		$("html, body").animate(
			{
			scrollTop: scrollDistance + "px"
			},
			500
		); 
	}
	//if the user is in the homepage, it scrolls down to the about section
	else{
		let scrollDistance = $("#about").offset().top;
		$("html, body").animate(
			{
			scrollTop: scrollDistance + "px"
			},
			500
		); 
	}
});


/*
	Opening projects list management
*/
let univ_summ = $('#univ_summ');
let pers_summ = $('#pers_summ');

//fontawsome link
let open = "fas fa-caret-down";
let close = "fas fa-caret-up";

univ_summ.click(()=>{
	toggle_projects("#univ_summ ");
});

pers_summ.click(()=>{
	toggle_projects('#pers_summ ');
});

// Change the icon of the clicked menu
function toggle_projects(which){
	if($(which + ' > i').attr('class') == open){
		$(which + '> i').removeClass();
		$(which + '> i').addClass(close);
	}
	else{
		$(which + '> i').removeClass();
		$(which + '> i').addClass(open);
	}
}
