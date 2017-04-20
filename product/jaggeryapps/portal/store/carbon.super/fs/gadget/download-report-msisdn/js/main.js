var url = "";
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
            $(document).ready(function () {
                url = "/portal/apis/report" + "?type=22&timeFrom=" + filter["timeFrom"]
                    + "&timeTo=" + filter["timeTo"] + "&operator=" + filter["operator"]
                    + "&appID=" + filter["appID"];

            });


        }
    }],
    data: function () {

        var filter = {};
        $(document).ready(function () {
            url = "/portal/apis/report" + "?type=22&timeFrom=" + filter["timeFrom"]
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
            })
                .done(function (files) {
                    $('#fileTable').empty();
                    files.forEach(function (fileName) {
                    	fileName = fileName.replace(/\s/g, '');
                        fileNameConvert = fileName.split("_");
                        var time = fileNameConvert[2].split(".");
                        var timeMill = time[0];
                        var d = new Date(parseInt(timeMill));
                        $('#fileTable').append('<tr><td class="filenametd" style="width:35%"><div class="form-group"><label style="margin-top:15px;" for="file type">'+fileNameConvert[0]+'</label></div></td><td style="width:30%"><div class="form-group"><label for="file type">'+d.toLocaleString()+'</label></div>'
                            +'</td><td style="width:35%"><a class="btn btn-success btn-small" style="float:left" href="'+url+"&fileName="+fileName+'" onclick="hideModal()"><span class="glyphicon glyphicon-save" aria-hidden="true"></span>&nbsp;Download</a>&nbsp;&nbsp;<a class="btn btn-danger btn-small" href="#" style="float:right;color:#ffffff;padding:5%;" onclick="deleteFile(\''+fileName+'\')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a></td></tr>');
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
            var reason = $("#dropdown-reason option:selected").val();
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
                    url = url + "&success=" + success + "&authtype=" + reason + "&fileName=" + fileName;
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
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }

        $("#dropdown-success").change(function () {

            var success = $("#dropdown-success option:selected").val();
            var options = {};
            if (success == "true") {
                $('#dropdown-reason').empty();
                options = {
                    undefined: 'All',
                    USSD_PUSH: 'USSD_PUSH',
                    USSD_PUSH_PIN: 'USSD_PUSH_PIN',
                    SMS: 'SMS',
                    HEADER_ENRICHMENT: 'HEADER_ENRICHMENT'
                };
            } else if (success == "false") {
                $('#dropdown-reason').empty();
                options = {
                    undefined: 'All',
                    ONNET_TC: 'ONNET_TC',
                    SMS: 'SMS',
                    MSISDN: 'MSISDN',
                    OFFNET_TC: 'OFFNET_TC',
                    USSD_PUSH: 'USSD_PUSH'

                };
            } else if (success == "undefined") {
                $('#dropdown-reason').empty();
                options = {
                    undefined: 'All'
                };
            }

            var select = $('#dropdown-reason');
            $.each(options, function (val, text) {
                select.append(
                    $('<option></option>').val(val).html(text)
                );
            });

        });
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

function checkAccess(){
    var valid=false;
    var TYPE_MSISDNS_SUCCESS_FAILED_REPORT=24;
    var SERVER_URL = "/portal/apis/telcoanalytics";
    var HTTP_GET = "GET";
    var RESPONSE_ELEMENT = "responseJSON";
    jQuery.ajax({
        url: SERVER_URL + "?type=" + TYPE_MSISDNS_SUCCESS_FAILED_REPORT,
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
    return valid;
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