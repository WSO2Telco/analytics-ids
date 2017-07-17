var view = {
    id: "chart-0",
    schema: [{
        "metadata": {
            "names": ["Type", "Count"],
            "types": ["ordinal", "linear"]
        }
    }],
    chartConfig: {
        charts: [{type: "arc", x: "Count", color: "Type", mode: "donut"}],
        width: $('#canvas').width(),
        height: $('#canvas').height(),
        padding: {"top": 60, "left": 60, "bottom": 60, "right": 100},
        colorScale: ["#C59787", "#438CAD", "#B6688F", "#434343", "#E0CABA"],
        percentage: true
    },
    callbacks: [{
        type: "click",
        callback: function () {
            //wso2gadgets.load("chart-1");
            //  alert("Clicked on bar chart of chart-0. You can implement your own callback handler for this.");
        }
    }],
    subscriptions: [{
        topic: "subscriber",
        callback: function (topic, data, subscriberData) {
            var filter = {
                timeFrom: data["timeFrom"],
                timeTo: data["timeTo"],
                operator: data["operator"],
                appID: data["appID"]
            };
	        $('#modalPopup').modal('hide');
            $( document ).ready(function() {
                urlAppend(filter);
            });
        }
    }],
    data: function () {
        var filter = {};
        //wso2.gadgets.state.getGlobalState('filter',function(filter) {

        $( document ).ready(function() {
            urlAppend(filter);
        });
            
        //});
    }
};

function urlAppend(filter){
    if( filter ==undefined ){
        filter = {};
    }
    var TYPE_REG_REPORT="null";
    $("#downloadpdfdr").attr("href","/portal/apis/reportext" + "?type="+TYPE_REG_REPORT+"&timeFrom=" + filter["timeFrom"]
        + "&timeTo=" + filter["timeTo"] + "&operator=" + filter["operator"]
        + "&appID=" + filter["appID"]+"&download=drPdf");
    $("#downloadcsvdr").attr("href","/portal/apis/reportext" + "?type="+TYPE_REG_REPORT+"&timeFrom=" +  filter["timeFrom"]
        + "&timeTo=" + filter["timeTo"] + "&operator=" + filter["operator"]
        + "&appID=" + filter["appID"]+"&download=drXl");
}

function urlAppendChange(reportType) {

    var TYPE_OFFLINE_BREAKDOWN_REPORT = 27;
    var TYPE_CUMULATIVE_REPORT = 28;
    var TYPE_SELECTED_REPORT;
    if (reportType === 'breakdown') {
        TYPE_SELECTED_REPORT = TYPE_OFFLINE_BREAKDOWN_REPORT;
    } else {
        TYPE_SELECTED_REPORT = TYPE_CUMULATIVE_REPORT;
    }

    var getVarRegex = /(type).*?(&)/;
    var csvDownload = $("#downloadcsvdr");
    csvDownload.attr("href", csvDownload.attr("href").replace(getVarRegex, '$1=' + TYPE_SELECTED_REPORT + '$2'));
}



function checkAccess(){
	var filter = {};
    
    //wso2.gadgets.state.getGlobalState('filter',function(filter) {
       
   // $( document ).ready(function() {
    	checkAccessWithFilter(filter);
   // });
        
    //});
	
}



function checkAccessWithFilter(filter){
	
	if( filter ==undefined || filter==null){
        	filter = {};
    	}

    //var selectedApp=filter["appID"];
    var selectedApp=$("#downloadcsvdr").attr("href").split("&appID=")[1].split("&download=")[0];

    var valid=false;
    var USERREG=28;
    var SERVER_URL = "/portal/apis/telcoanalytics";
    var HTTP_GET = "GET";
    var RESPONSE_ELEMENT = "responseJSON";
	    jQuery.ajax({
	        url: SERVER_URL + "?type=" + USERREG+"&appID=" + selectedApp,
	        type: HTTP_GET,
	        success: function (data) {
	            var isOperator = JSON.parse(data.message);
	            if(isOperator){
	                document.getElementById('downloadcsvdr').click();
	            }else{
	                $('#modalPopup').modal('hide');
	                $('#popupCheckAccess').modal({
	                    show: 'true'
	                });
	            }
	        },
	        error: function (msg) {
	            error(msg[RESPONSE_ELEMENT]);
	        }
	    });
	
    return valid;
}

$(function () {
    try {
        wso2gadgets.init("#canvas", view);
        wso2gadgets.load("chart-0");

    } catch (e) {
        console.error(e);
    }
});

gadgets.HubSettings.onConnect = function () {
    if (view.subscriptions) {
        view.subscriptions.forEach(function (subscription) {
            gadgets.Hub.subscribe(subscription.topic, subscription.callback);
        });
    }
};

function checkLoged(){
    var valid=false;
    var TYPE_LOGGIN_CHECK=25;
    var SERVER_URL = "/portal/apis/telcoanalytics";
    var HTTP_GET = "GET";
    var RESPONSE_ELEMENT = "responseJSON";
    $.ajax({
        url: SERVER_URL + "?type=" + TYPE_LOGGIN_CHECK,
        type: HTTP_GET,
        /*success: function (data) {
        	
            var isLogged = JSON.parse(data.message);
            if(isLogged){
                document.getElementById('downloadcsvdr').click();
            }
        },
        error: function (msg) {
        	var ErrorMesssage = JSON.parse(msg.message);
        									  
        	 if(ErrorMesssage=="User is not authenticated."){
        		 console.log("test works correctly")
             }else{
            	 document.getElementById('downloadcsvdr').click();
             }
        	
            error(msg[RESPONSE_ELEMENT]);
        }*/
        
        success: function(data, textStatus, xhr) {
            var isLogged = JSON.parse(data.message);
            if(isLogged){
                document.getElementById('downloadcsvdrReal').click();
            }
        },
        complete: function(xhr, textStatus) {
            if(xhr.status==403){
            	window.top.location.reload(false);
            }
        } 
    });
    return valid;
}

$( document ).ready(function() {
    $('#modalPopup').on('show.bs.modal', function (e) {
        var reportType = $(e.relatedTarget).data('report');
        urlAppendChange(reportType);
    });
});