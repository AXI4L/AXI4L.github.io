
$(document).ready(function () {
    $('#rez_search').tooltip({'trigger':'focus', 'title': 'Name is Required Field'});
	$('#ddg').tooltip({'trigger':'focus', 'title': 'Name is Required Field'});    $('#password').tooltip({'trigger':'focus', 'title': 'Password is Required Field'});
});

var flag=false;
$("#rez_search").on('keydown', function() {
    if($("#arch").val() == "Select the Architecture" && flag==false){
        flag=true;
        alertify.notify('Please select any Architecture before Searching','error', 5, function(){ 
            flag=false;
        });
    }
});

var update = (async (value) => {
    var data = new Array();
    var jsondata;

    if(value == "Select the Architecture"){
        return false;
    }
    await $.ajax({
        url:`/projects/rez/data/${value}.json`,
        method:"GET",
        dataType: 'JSON',
    }).then(function(result){
        jsondata=result;
        $.each(result,(i)=>{
            data.push(result[i]['Mnemonic']);
        });

        $("#rez_search").autocomplete({
            maxShowItems: 10,
            source: data,
            delay: 0,
            minLength: 0,
            autoFocus: true,
            open: function (event, ui) {                
                $(".ui-menu").css("width", "227px");                
                $(".ui-menu").css("list-style", "none");
                $(".ui-menu").css("margin",0);
                $(".ui-menu").css("background-color", "white");
                $(".ui-menu").css("display","block");
                $(".ui-autocomplete .ui-menu-item a.ui-state-focus").css("background"," #C4FFC4 !important");
           },
           select: function(event,ui){
                var ind = data.indexOf(ui.item.label);
                var text = "";
                $.each(jsondata[ind],(key,value)=>{
                    if(value)
                        if(key == "Know More")
                            text+= `Know More: <a href="${value}" target="_blank"> Here </p>`
                        else
                            text+= `<p class="text-dark"> ${key} : ${value} </p>`
                })
                alertify.alert(ui.item.label,text).set({'pinnable': false, 'modal':false});
           }
        });
    });
});

var searchengine = (async(site,query)=>{
    await $.ajax({
        url:`https://api.stackexchange.com/2.2/search?page=1&order=desc&sort=activity&intitle=${query}&site=${site}`,
        method:"GET",
        dataType: 'JSON',
    }).then(response => {
        var data = response['items']
        if(data.length > 0){
            var text = "";
            $.each(data,(i)=>{
                if(data[i]['is_answered'] === true)
                    text+= `<a href="${data[i]['link']}" target="_blank">${data[i]['title']}</a><br><br>`
            })
            alertify.alert("Search Results",text);
        }else if(flag == false){
            flag=true;
            alertify.notify('Sorry No Results Found','error', 5, function(){ 
                flag=false;
            });
        }
    })
});

$("#stackoverflow").on("keydown",function(event){
    if(event.keyCode == 13){
        searchengine("stackoverflow",$(this).val());
    }
})

$("#reverse").on("keydown",function(event){
    if(event.keyCode == 13){
        searchengine("reverseengineering",$(this).val());
    }
})

$("#ddg").on("keydown", function(event){
    if(event.keyCode == 13){
        $.ajax({
            url:`https://api.duckduckgo.com/?q=${$("#ddg").val()}&format=json`,
            method:"GET",
            dataType: 'JSON',
        }).then(response => {
            var data = response['RelatedTopics'];
            if(data.length > 0){
                var text = "";
                $.each(data,(i) => {
                    try{
                        text+= `<a href="${data[i]['FirstURL']}" target="_blank">${data[i]['Text']}</a><br><br>`
                    }catch(Exception){

                    }
                })
                alertify.alert("Search Results",text);
            }else if(flag == false){
                flag=true;
                alertify.notify('Sorry No Results Found','error', 5, function(){ 
                    flag=false;
                });
            }
        });
    }
})