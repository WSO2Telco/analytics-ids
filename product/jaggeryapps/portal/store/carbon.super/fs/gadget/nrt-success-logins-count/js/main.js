var charUpdateReference;
var view = {
    id: "chart-0",
    schema: [{
        "metadata": {
            "names": ["Day", "Count"],
            "types": ["time", "linear"]
        }
    }],
    chartConfig: {
        x : "Day",
          charts : [
            {type: "line", range:"true",  y : "Count" }
          ],
          maxLength: 50,
          width: $('#canvas').width(),
          height: $('#canvas').height(),
          padding: { "top": 60, "left": 60, "bottom": 60, "right": 150 }
    },
    callbacks: [{
        type: "click",
        callback: function() {
            //wso2gadgets.load("chart-1");
        //    alert("Clicked on bar chart of chart-0. You can implement your own callback handler for this.");
        }
    }],
    subscriptions: [{
          topic: "subscriber",
          callback: function (topic, data, subscriberData) {
              if (charUpdateReference) {
                  clearInterval(charUpdateReference);
              }
              charUpdateReference = setInterval(function () {
                  var SERVER_URL = "/portal/apis/telcoanalytics";
                  var client = new TelcoAnalyticsClient().init(SERVER_URL);
                  var filter = {
                      timeFrom: data["timeFrom"],
                      timeTo: data["timeTo"],
                      operator: data["operator"],
                      appID: data["appID"]
                  };
                  client.getRealTimeSuccessLogins(filter, function (response) {
                      var results = JSON.parse(response.message);
                      wso2gadgets.onDataReady(results, "append");
                  }, function (msg) {
                  });
              }, 1000);
          }
    }],

    data: function() {
        charUpdateReference = setInterval(function() {
            var SERVER_URL = "/portal/apis/telcoanalytics";
            var client = new TelcoAnalyticsClient().init(SERVER_URL);
            client.getRealTimeSuccessLogins({}, function (response) {
                var results = JSON.parse(response.message);
                wso2gadgets.onDataReady(results, "append");
            }, function (msg) {

            });
        }, 1000);
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
