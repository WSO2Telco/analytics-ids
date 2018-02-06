var DATA_TYPE_JSON = "json";
var CONTENT_TYPE_JSON = "application/json";
var AUTHORIZATION_HEADER = "Authorization";

function TelcoAnalyticsClient() {
    var TYPE_LOGIN_CHANNELS_PER_DAY = 1;
    var TYPE_DAILY_REGISTRATIONS_PER_DAy = 2;
    var TYPE_TOTAL_ATTEMPTS_VS_LOGINS = 3;
    var TYPE_ONNET_LOGINS = 4;
    var TYPE_OFFNET_LOGINS = 10;
    var TYPE_SUBSCRIBER_GROWTH_PER_OPERATOR_PER_DAY = 5;
    var TYPE_TOTAL_LOGIN_CHANNELS = 6;
    var TYPE_ONNET_REGISTRATIONS = 7;
    var TYPE_OFFNET_REGISTRATIONS = 11;
    var TYPE_OPERATOR_LIST = 8;
    var TYPE_DROPOUTS = 9;
    var TYPE_REALTIME_LOGINS = 12;
    var TYPE_TOTAL_DROPOUTS = 13;
    var TYPE_ONNET_SUCCESS_FAIL_LOGINS = 14;
    var TYPE_OFFNET_SUCCESS_FAIL_LOGINS = 15;
    var TYPE_TOTAL_SUCCESS_FAIL_LOGINS = 16;
    var TYPE_DAILY_ACTIVE_USERS = 17;
    var TYPE_MONTHLY_ACTIVE_USERS = 18;
    var TYPE_TOTAL_TOKENS = 19;
    var TYPE_TOTAL_AUTH_ATTEMPTS=20;
    var TYPE_TOTAL_FEDERATED_SUCCESS_ATTEMPTS=27;
    var TYPE_TOTAL_FEDERATED_FAILED_ATTEMPTS=28;
    var TYPE_TOTAL_REALTIME_SUCCESS_ATTEMPTS=29;
    var HTTP_GET = "GET";
    var HTTP_POST = "POST";
    var RESPONSE_ELEMENT = "responseJSON";
    this.serverUrl = "";

    this.getTotalAuthCount = function (filter, callback, error) {
        this.getData(filter, TYPE_TOTAL_AUTH_ATTEMPTS, callback, error);
    };

    this.getLoginChannelsPerDay = function (filter, callback, error) {
        this.getData(filter, TYPE_LOGIN_CHANNELS_PER_DAY, callback, error);
    };

    this.getTotalLoginChannels = function (filter, callback, error) {
        this.getData(filter, TYPE_TOTAL_LOGIN_CHANNELS, callback, error);
    }

    this.getDailyRegistrationsPerDay = function (filter, callback, error) {
        this.getData(filter, TYPE_DAILY_REGISTRATIONS_PER_DAy, callback, error);
    };

    this.getAttemptsVsLogins = function (filter, callback, error) {
        this.getData(filter, TYPE_TOTAL_ATTEMPTS_VS_LOGINS, callback, error);
    };

    this.getOnNetLoginsPerDay = function (filter, callback, error) {
        this.getData(filter, TYPE_ONNET_LOGINS, callback, error);
    };

    this.getOffNetLoginsPerDay = function (filter, callback, error) {
        this.getData(filter, TYPE_OFFNET_LOGINS, callback, error);
    };

    this.getSubscriberGrowthPerOperatorPerDay = function (filter, callback, error) {
        this.getData(filter, TYPE_SUBSCRIBER_GROWTH_PER_OPERATOR_PER_DAY, callback, error);
    };

    this.getOnNetRegistrationsPerDay = function (filter, callback, error) {
        this.getData(filter, TYPE_ONNET_REGISTRATIONS, callback, error);
    };

    this.getOffNetRegistrationsPerDay = function (filter, callback, error) {
        this.getData(filter, TYPE_OFFNET_REGISTRATIONS, callback, error);
    };

    this.getOperatorsAndAppsLists = function (filter, callback, error) {
        this.getData(filter, TYPE_OPERATOR_LIST, callback, error);
    };

    this.getDropoutsPerDay = function (filter, callback, error) {
        this.getData(filter, TYPE_DROPOUTS, callback, error);
    };

    this.getTotalDropouts = function (filter, callback, error) {
        this.getData(filter, TYPE_TOTAL_DROPOUTS, callback, error);
    };

    this.getOnNetSuccessFailLoginsPerDay = function (filter, callback, error) {
        this.getData(filter, TYPE_ONNET_SUCCESS_FAIL_LOGINS, callback, error);
    };

    this.getOffNetSuccessFailLoginsPerDay = function (filter, callback, error) {
        this.getData(filter, TYPE_OFFNET_SUCCESS_FAIL_LOGINS, callback, error);
    };

    this.getTotalSuccessFailedLogins = function (filter, callback, error) {
        this.getData(filter, TYPE_TOTAL_SUCCESS_FAIL_LOGINS, callback, error);
    };

    this.getRealTimeSuccessLogins = function (filter, callback, error) {
        this.getData(filter, TYPE_REALTIME_LOGINS, callback, error);
    };var HTTP_GET = "GET";

    this.getDailyActiveUsers = function (filter, callback, error) {
        this.getData(filter, TYPE_DAILY_ACTIVE_USERS, callback, error);
    };

    this.getMonthlyActiveUsers = function (filter, callback, error) {
        this.getData(filter, TYPE_MONTHLY_ACTIVE_USERS, callback, error);
    };

    this.getTotalTokens = function (filter, callback, error) {
        this.getData(filter, TYPE_TOTAL_TOKENS, callback, error);
    };

    this.getFederatedSuccessAttempts = function (filter, callback, error) {
        this.getData(filter, TYPE_TOTAL_FEDERATED_SUCCESS_ATTEMPTS, callback, error);
    };

    this.getFederatedFailedAttempts = function (filter, callback, error) {
        this.getData(filter, TYPE_TOTAL_FEDERATED_FAILED_ATTEMPTS, callback, error);
    };

    this.getRealtimeFederatedTotalAttempts = function (filter, callback, error) {
        this.getData(filter, TYPE_TOTAL_REALTIME_SUCCESS_ATTEMPTS, callback, error);
    };
    
    this.getData = function (filter, type, callback, error) {
		var timeFrom=filter["timeFrom"];
		var timeTo=filter["timeTo"]; 
		if(timeFrom==null && timeTo== null){
			timeFrom=getISTTimeZoneTime(new Date(moment().startOf('day').subtract(31, 'days')));
			timeTo=getISTTimeZoneTime(new Date(moment().endOf('day').subtract(1, 'day')));
		}var HTTP_GET = "GET";
        jQuery.ajax({
                        url: this.serverUrl + "?type=" + type + "&timeFrom=" + timeFrom
                                + "&timeTo=" + timeTo + "&operator=" + filter["operator"]
                                + "&appID=" + filter["appID"],
                        type: HTTP_GET,
                        success: function (data) {
                            callback(data);
                        },
                        error: function (msg) {
                            error(msg[RESPONSE_ELEMENT]);
                            
                        },
                        complete: function(xhr, textStatus) {
                            if(xhr.status==403){
                            	window.top.location.reload(false);
                            }
                        }
                    });
    };
}

    function getISTTimeZoneTime(date){
        // convert to msec
        // add local time zonevar HTTP_GET = "GET"; offset
        // get UTC time in msec
        var utc = date.getTime() - (date.getTimezoneOffset() * 60000);
        // create new Date object for different city
        // using supplied offset
        var ISTOffset = -330;   // IST offset UTC +5:30
        var nd = new Date(utc + (60000 * ISTOffset));
        return nd.getTime();
    }

TelcoAnalyticsClient.prototype.init = function (svrUrl) {
    this.serverUrl = svrUrl;
    jQuery.ajaxSetup({
                         dataType: DATA_TYPE_JSON,
                         contentType: CONTENT_TYPE_JSON,
                         beforeSend: function (request) {
                             request.setRequestHeader(AUTHORIZATION_HEADER, null);
                         }
                     });
    return this;
};

