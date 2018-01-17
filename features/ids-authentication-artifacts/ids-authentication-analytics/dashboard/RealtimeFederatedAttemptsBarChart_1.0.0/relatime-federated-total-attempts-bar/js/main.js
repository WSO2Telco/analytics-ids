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
            maxLength: 100,
            width: $('#canvas').width(),
            height: $('#canvas').height(),
            padding: { "top": 60, "left": 60, "bottom": 80, "right": 150 },
            colorScale : ["#5CB85C","#B6688F"],
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
            var filter = {
                timeFrom : data["timeFrom"],
                timeTo : data["timeTo"],
                operator : data["operator"],
                appID : data["appID"]
            };
            var SERVER_URL = "/portal/apis/telcoanalytics";
            var client = new TelcoAnalyticsClient().init(SERVER_URL);
            client.getRealtimeFederatedTotalAttempts(filter, function (response) {
                var results = JSON.parse(response.message);
                console.log("11111" + results);
                wso2gadgets.onDataReady(results);
            }, function (msg) {

            });
        }
    }],
    data: function() {
        var SERVER_URL = "/portal/apis/telcoanalytics";
        var client = new TelcoAnalyticsClient().init(SERVER_URL);
        client.getRealtimeFederatedTotalAttempts({}, function (response) {
            console.log("222222" + results);
            var results = JSON.parse(response.message);
            wso2gadgets.onDataReady(results);
        }, function (msg) {

        });
    }
};

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
