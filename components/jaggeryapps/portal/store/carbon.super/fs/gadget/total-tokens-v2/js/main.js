var view = {
    id: "chart-0",
    schema: [{
        "metadata": {
            "names": ["Day", "Type", "Count"],
            "types": ["ordinal", "ordinal", "linear"]
        }
    }],
    chartConfig: {
            x : "Day",
            charts : [{type: "bar",  y : "Count", color: "Type", mode:"group"}],
            barGap: 0.1,
            tooltip: {"enabled":true, "color":"#e5f2ff", "type":"symbol", "content":["Day","Type","Count"], "label":true },
            maxLength: 240,
            width: $('#canvas').width(),
            height: $('#canvas').height(),
            padding: { "top": 60, "left": 60, "bottom": 80, "right": 100 },
	        colorScale : [CLR_USSD, CLR_SMS, CLR_MSISDN],
            xAxisAngle:true
    },
    callbacks: [{
        type: "click",
        callback: function() {
            //wso2gadgets.load("chart-1");
         //   alert("Clicked on bar chart of chart-0. You can implement your own callback handler for this.");
        }
    }],
    subscriptions: [{
        topic: "subscriber",
        callback: function(topic, data, subscriberData) {
			wso2.gadgets.controls.showGadget();
            var filter = {
                timeFrom : data["timeFrom"],
                timeTo : data["timeTo"],
                operator : data["operator"],
                appID : data["appID"]
            };
            $('#modalPopup').modal('hide');
            $( document ).ready(function() {
                urlAppend(filter);
            });
            var SERVER_URL = "/portal/apis/telcoanalytics";
            var client = new TelcoAnalyticsClient().init(SERVER_URL);
            client.getTotalTokens_v2(filter, function (response) {
                var results = JSON.parse(response.message);
                wso2gadgets.onDataReady(results);
            }, function (msg) {

            });
			wso2.gadgets.state.setGadgetState(filter);
        }
    }],
    data: function() {
        var filter = {};

        var SERVER_URL = "/portal/apis/telcoanalytics";
        var client = new TelcoAnalyticsClient().init(SERVER_URL);
        wso2.gadgets.state.getGadgetState(function(filter) {
        wso2.gadgets.controls.showGadget();
            client.getTotalTokens_v2(filter || {}, function (response) {
                var results = JSON.parse(response.message);
                wso2gadgets.onDataReady(results);
                $( document ).ready(function() {
                    urlAppend(filter);
                });
            }, function (msg) {

            });
        });
    }
};


function urlAppend(filter){
    if(filter==undefined){
        filter={};
    }
    $("#downloadpdf").attr("href","/portal/apis/report" + "?type=9&timeFrom=" + filter["timeFrom"]
        + "&timeTo=" + filter["timeTo"] + "&operator=" + filter["operator"]
        + "&appID=" + filter["appID"]+"&extra=OFFNET&download=pdf");
    $("#downloadxl").attr("href","/portal/apis/report" + "?type=9&timeFrom=" + filter["timeFrom"]
        + "&timeTo=" + filter["timeTo"] + "&operator=" + filter["operator"]
        + "&appID=" + filter["appID"]+"&extra=OFFNET&download=xl");

}

$(function() {
    try {
        wso2gadgets.init("#canvas",view);
        wso2gadgets.load("chart-0");
    } catch (e) {
        console.error(e); 
    }
});

gadgets.HubSettings.onConnect = function() {
    if (view.subscriptions) {
        view.subscriptions.forEach(function(subscription) {
            gadgets.Hub.subscribe(subscription.topic, subscription.callback);
        });
    }
};
