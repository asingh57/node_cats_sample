
function loadScript(url, callback) //loads a static script file
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

var escape = document.createElement('textarea');
function escapeHTML(html) {//escapes data from html using a textarea conversion and back
    escape.textContent = html;
    return escape.innerHTML;
}


function add_table_row(v0,v1,v2,v3){//add row to the preferences table
	console.log("adding row")
	$('#preferences_data_table tr').eq(-1).before('<tr class="data_class"><td>'+v0+'</td><td>'+v1+'</td><td>'+v2+'</td><td colspan="3">'+v3+'</td><tr>');
	console.log("added")
}


function fill_table(){//fill up the preferences table
    $('.data_class').remove()

    $.get("/get_all_users", function(data, status){

    for(i =0; i< data.length; i++){
       add_table_row(escapeHTML(data[i].preference_id),escapeHTML(data[i].name),escapeHTML(data[i].colour),escapeHTML(data[i].animal));
    }            
       
      }).fail(function(response) {
        alert('Error: ' + response.responseText);
        fill_table();
    });
	show_page();
}



function add_entry(){//add an entry to the preference database
    hide_page();    
    $.post("/add_user",{
        name:$('#name').val(),
        colour:$('#colour').val(),
        animal:$("input[name='animal']:checked").val()
        }
    ,function(data,status){
            location.reload();
        
    })
    .fail(function(response) {
        alert('Error: ' + response.responseText);
        fill_table();
    });
}


function show_page() {//unblock the page
  document.getElementById("loader").style.display = "none";
  document.getElementById("data_section").style.display = "block";
}

function hide_page() {//block the page till data loaded
  document.getElementById("loader").style.display = "show";
  document.getElementById("data_section").style.display = "none";
}


loadScript('/js/jquery.min.js',function(){//load jquery library into the web page
	$(document).ready(function () {
	fill_table();	
								}
				)	
})
