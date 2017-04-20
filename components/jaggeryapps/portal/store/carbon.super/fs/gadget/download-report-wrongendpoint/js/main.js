var url = "";
var view = {
    id: "chart-0",
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
            $(document).ready(function () {
                var TYPE_OPERATOR_WRONG_EP =24;
                url = "/portal/apis/reportext" + "?type="+TYPE_OPERATOR_WRONG_EP+"&timeFrom=" + filter["timeFrom"]
                    + "&timeTo=" + filter["timeTo"] + "&operator=" + filter["operator"]
                    + "&appID=" + filter["appID"];

            });


        }
    }],
    data: function () {

        var filter = {};
        $(document).ready(function () {
            var TYPE_OPERATOR_WRONG_EP =24;
            url = "/portal/apis/reportext" + "?type="+TYPE_OPERATOR_WRONG_EP+"&timeFrom=" + filter["timeFrom"]
                + "&timeTo=" + filter["timeTo"] + "&operator=" + filter["operator"]
                + "&appID=" + filter["appID"];

        });
    }
};

$(function () {

    try {
        wso2gadgets.init("#canvas", view);
        wso2gadgets.load("chart-0");


        $("#downloadreport").click(function () {
            $.ajax({
                method: "GET",
                url: url + "&fileName=list"
            }).done(function (files) {
                    $('#fileTable').empty();
                    files.forEach(function (fileName) {
                    	fileName = fileName.replace(/\s/g, '');
                        fileNameConvert = fileName.split("_");
                        var time = fileNameConvert[2].split(".");
                        var timeMill = time[0];
                        var d = new Date(parseInt(timeMill));
                        $('#fileTable').
                        append("<tr>" +
                                    "<td class=\"filenametd\" style=\"width:35%\">" +
                                        "<div class=\"form-group\"> " +
                                            "<label style=\"margin-top:15px;\" for=\"file type\">"+fileNameConvert[0]+"</label>" +
                                        "</div>" +
                                    "</td>" +
                                    "<td style=\"width:30%\">" +
                                        "<div class=\"form-group\">" +
                                            "<label for=\"file type\">"+d.toLocaleString()+"</label>" +
                                        "</div>"+
                                    "</td>" +
                                    "<td style=\"width:35%\">" +
                                        "<a class=\"btn btn-success btn-small\" style=\"float:left\" href=\""+url+"\&fileName="+fileName+"\" onclick=\"hideModal()\">" +
                                            "<span class=\"glyphicon glyphicon-save\" aria-hidden=\"true\"></span>" +
                                            "&nbsp;Download" +
                                        "</a>&nbsp;&nbsp;" +
                                        "<a class=\"btn btn-danger btn-small\" href=\"#\" style=\"float:right;color:#ffffff;padding:5%;\" onclick=\"deleteFile('"+fileName+"')\">" +
                                        "<span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span>" +
                                        "</a></td></tr>");
                    })
                });
            $('#modalPopup').modal({
                show: 'true'
            });
        });
		

  $('#usr').bind("cut copy paste",function(e) {
      e.preventDefault();
  });



        $("#download").click(function () {
            var success = $("#dropdown-success option:selected").val();
            var fileName = $("input:text").val();
            if (fileName == "") {
                $("input:text").addClass('has-error');
                $("input:text").attr("placeholder", "Required field");
            } else {
                var timeFrom = getParameterByName("timeFrom", url);
                var tomeTo = getParameterByName("timeTo", url);
                var timedif = tomeTo - timeFrom;
                var days = timedif / (1000 * 60 * 60 * 24);
                if (days <= 2) {
                    var tempUrl = url;
                    url += "&fileName=" + fileName;
                    $.ajax({
                        method: "POST",
                        url: url,
                        async: true
                    })
                    $('#popUpDownload').modal({
                        show: 'true'
                    });
                    url = tempUrl;
                }else{
                    $('#popupDayValidation').modal({
                        show: 'true'
                    });
                }
            }
        });


        function getParameterByName(name, url) {
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }

    } catch (e) {
        console.error(e);
    }


});

        function deleteFile(fileName) {
			var tempUrl = url;
            url = url + "&fileName=" + fileName;
            $.ajax({
                method: "DELETE",
                url: url,
                async: true
            });
			url=tempUrl;
			hideModal();
        }

gadgets.HubSettings.onConnect = function () {
    if (view.subscriptions) {
        view.subscriptions.forEach(function (subscription) {
            gadgets.Hub.subscribe(subscription.topic, subscription.callback);
        });
    }
};

function hideModal(){
    $('#modalPopup').modal('hide');
    $('#popupDayValidation').modal('hide');
}

function checkAccess(){
    var TYPE_OPERATOR_WRONG_EP=26;
    var SERVER_URL = "/portal/apis/telcoanalytics";
    var HTTP_GET = "GET";
    var RESPONSE_ELEMENT = "responseJSON";
    jQuery.ajax({
        url: SERVER_URL + "?type=" + TYPE_OPERATOR_WRONG_EP,
        type: HTTP_GET,
        success: function (data) {
            var isOperator = JSON.parse(data.message);
            if(isOperator){
                document.getElementById('download').click();
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
}

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
