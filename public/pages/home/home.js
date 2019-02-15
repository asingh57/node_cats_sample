
function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}


function add_table_row(v0,v1,v2,v3){
	console.log("adding row")
	$('#preferences_data_table tr.data_insert_row').before('<td>'+v0+'</td><td>'+v1+'</td><td>'+v2+'</td><td>'+v3+'</td>');
	$('#preferences_data_table tr.data_insert_row').before('<td>'+v0+'</td><td>'+v1+'</td><td>'+v2+'</td><td>'+v3+'</td>');
	$('#preferences_data_table tr.data_insert_row').before('<td>'+v0+'</td><td>'+v1+'</td><td>'+v2+'</td><td>'+v3+'</td>');
	console.log("added")
}
function fill_table(){
	add_table_row("d","a","b","c");
	showPage()
}
function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("data_section").style.display = "block";
}


loadScript('/js/jquery.min.js',function(){
	$(document).ready(function () {
	fill_table();	
								}
				)	
})
