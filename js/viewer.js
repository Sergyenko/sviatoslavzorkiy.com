/* JS/VIEWER.JS
 *Photoalbum Viewer version 1.05 Script
 *Develop by: sergey.sergyenko@gmail.com
 *Date: 2010-02-15 
  */ 

	var albums = new Array();
	var photos = new Array();
	var images = new Array();
	
	var startAfter;
	var slideshowInterval;
	var effectInterval;
	var isload;
	var currentAlbum;
	var currentPath;
		
	function checkstatus(){
		
		var buffer = '';
				
		$(".control a").hover(function (){
			
			var id = $(this).attr('id');
			$("#viewer").stopTime("slideshow");
			$("#viewer").stopTime("trigger");			
			$("#viewer").everyTime(startAfter,"trigger",function(){
				slideshow(id);
			});
			
			if($(this).attr('id') != $("a.active").attr('id')){
										
				$("a.active").removeClass();
				$(this).addClass("active");
				$("#viewer").stop();
				$("#viewer").animate({opacity: 0},effectInterval,function () {
					$("#viewer").css("background-image", "url('" + currentPath + photos[currentAlbum][id] + "')");
					$("#viewer").animate({opacity: 1},effectInterval);
				});
			
			}
		});
				
		for( var i = 0; i < photos[currentAlbum].length; i++ ){
			
			if( !images[i].complete){
				
				if(currentAlbum != 0){
					for(var j = Number($(".control a:last").attr('id')) + 1; j < i; j++){
						buffer = $(".control").html();
						$(".control").html(buffer + "<a href='#' id='" + j + "'>"+ j +"</a>");
					}
				}
				return false;
				
			}
			
			if( i == (photos[currentAlbum].length -1) ){
				
				$("#status").stopTime("checkstatus");
				if(currentAlbum != 0){
					for( j = Number($(".control a:last").attr('id')) + 1; j <= i; j++){
						buffer = $(".control").html();
						$(".control").html(buffer + "<a href='#' id='" + j + "'>"+ j +"</a>");
					}
				}
				isload = true;			
				viewer();
				
			}
		}
		
	}
	
	function showfirst(){
		
		if(images[0].complete){
			
			if(currentAlbum == 0){
				$("#viewer").hide();
			}else{
				$(".control a:first").addClass("active");
			}
			
			$("#status").stopTime("showfirst");
			$("#viewer").css("background-image", "url('" + currentPath + photos[currentAlbum][0] + "')");
			$('#loader').fadeOut(function(){
				
				if(currentAlbum == 0) {
					$("#viewer").fadeIn();
				}else{
					$("#viewer").animate({opacity: 1},effectInterval);
				}
			
			});
			
			$("#viewer").everyTime(startAfter,"trigger",function(){
				slideshow(0);
			});	
			viewer();
		}else{
			return false;
		}
	}
	
	function load(){
		
		isload = false;
		$(".menu a:first").addClass("hidden");
		
		if(currentAlbum != 0) $(".control").html("<a href='#' id='0'>0</a>");
		
		for( var i = 0; i <= images.length; i++) delete images[i];
		
		for (i = 0; i < photos[currentAlbum].length; i++ ){
			
			images[i] = new Image();
			images[i].src = currentPath + photos[currentAlbum][i];
									
		}
		
		$('#loader').show();
		$("#status").everyTime(50,"showfirst",function(){
			showfirst();
		});
		
	}		
	
	function viewer(){
		
		$(".control a").hover(function (){
			
			var id = $(this).attr('id');
			$("#viewer").stopTime("slideshow");
			$("#viewer").stopTime("trigger");			
			$("#viewer").everyTime(startAfter,"trigger",function(){
				slideshow(id);
			});
			
			if($(this).attr('id') != $("a.active").attr('id')){
										
				$("a.active").removeClass();
				$(this).addClass("active");
				$("#viewer").stop();
				$("#viewer").animate({opacity: 0},effectInterval,function () {
					$("#viewer").css("background-image", "url('" + currentPath + photos[currentAlbum][id] + "')");
					$("#viewer").animate({opacity: 1},effectInterval);
				});
			
			}
		});
		
		$(".menu a").hover(function (){
			
			if($(this).attr('id') != $("a.selected").attr('id')){
			
				$("#viewer").stopTime("slideshow");
				$("#viewer").stopTime("trigger");
				$("#viewer").stop();
				
				var id = $(this).attr('id').substr(1);
				
				$(".control").html('');
				$("a.selected").removeClass();
				$(this).addClass("selected");
											
				$("#viewer").animate({opacity: 0},effectInterval,function () {
				
					$("#viewer").css("background-image", "none");
					currentAlbum = id;
					currentPath = albums[id][1];
					load();					
				});
				
				
			}
		});
		
		if(!isload){
			$("#status").everyTime(50,"checkstatus",function(){
				checkstatus();
			});
		}
		
		if(currentAlbum == 0){
			$("#viewer").everyTime(startAfter,"trigger",function(){
				slideshow(0);
			});
		}
		
	}
	
	function slideshow(start){
		
		var flag = true;
		$("#viewer").stopTime("trigger");
		
		if(start != (photos[currentAlbum].length - 1))  
			if (!images[Number(start) + 1].complete){
				flag = false;
				$("#viewer").everyTime(startAfter,"trigger",function(){
					slideshow(start);
				});
			}
		
		if(photos[currentAlbum].length != 1 && flag){
			
			$("#viewer").everyTime(slideshowInterval,"slideshow",function(){
				
				$("#viewer").stop();
				$("#viewer").animate({opacity: 0},effectInterval,function () {
					$("#viewer").css("background-image", "url('" + currentPath + photos[currentAlbum][start] + "')");
					$("#viewer").animate({opacity: 1},effectInterval);
					$("a.active").removeClass();
					$("#"+start).addClass("active");
				});
							
				if(start == (photos[currentAlbum].length - 1)){start =0}else{start++}
				
			});
		}
						
		return false;
	}
		
	$(document).ready(function() {
					
		var i = 0;
		var j = 0;
		var buffer = '';
				
		$.ajax({
			type: 	"GET",
			url: 	"settings.xml",
			dataType: "xml",
			success: function(msg){
				
				$(msg).find('viewer').each(function () {
					
					$(this).find('album').each(function () {
						albums[i] = new Array();
						albums[i][0] = $(this).attr('name');
						albums[i][1] = $(this).attr('path');
						
						photos[i] = new Array();
						$(this).find('photo').each(function () {
								photos[i][j] = $(this).attr('src');
								j++;
						})
						i++;
						j = 0;
						
					});
					
					$(this).find('slideshow').each(function () {
						startAfter = Number($(this).attr('startAfter'));
						slideshowInterval = Number($(this).attr('slideshowInterval'));
						effectInterval = Number($(this).attr('effectInterval'));
					});
					
				});
				
				for (i = 0; i < albums.length; i++){
					buffer = $(".menu").html();
					$(".menu").html(buffer + "<a href='#' id='a" + i +"'>" + albums[i][0] + "</a>");
				}
			currentAlbum = 0;
			currentPath = albums[0][1];
			load();
			}
		});
					
	});