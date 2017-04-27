var href = parent.window.location.href,
    hrefLastSegment = href.substr(href.lastIndexOf('/') + 1),
    resolveURI = parent.ues.global.dashboard.id == hrefLastSegment ? '../' : '../../',
    parentWindow = window.parent.document,
    gadgetWrapper = $('#' + gadgets.rpc.RPC_ID, parentWindow).closest('.grid-stack-item');

var TOPIC = "range-selected";
var publishFilter = function(filter){
    displayRangeOverflowStatus(filter);
    //wso2.gadgets.state.setGlobalState('filter', filter);
    gadgets.Hub.publish(TOPIC, filter);
}

var displayRangeOverflowStatus = function(filter){
    //function to check if the date range is applicable for the pre-defined graph parameters and display necessary alert
    var dayFrom = moment(filter.timeFrom);
    var dayTo = moment(filter.timeTo);
    var dayFromByTo = moment(dayTo).subtract(60, 'days').startOf('day'); // moment(dayTo).subtract(2, 'months').startOf('day')
    if(dayFromByTo.isAfter(dayFrom)){
        alert("Please note that data for only 60 days is displayed on the graphs due to visibility limitations. The full data set for the selected range is available to be downloaded."); //(from "+ dayFromByTo.format('MMMM D, YYYY hh:mm A') + " to "+ dayTo.format('MMMM D, YYYY hh:mm A') +")
    }
}

$(function() {
    var dateLabel = $('#reportrange'),
        datePickerBtn = $('#btnCustomRange');
    //if there are url elemements present, use them. Otherwis use last hour

    var timeFrom = moment().startOf('day').subtract(31, 'days');
    var timeTo = moment().endOf('day').subtract(1, 'day');
    var message = {};

    var qs = gadgetUtil.getQueryString();
    if (qs.timeFrom != null) {
        timeFrom = parseInt(qs.timeFrom);
    }
    if (qs.timeTo != null) {
        timeTo = parseInt(qs.timeTo);
    }
    var count = 0;

    //make the selected time range highlighted
    var timeUnit = qs.timeUnit;

    if (timeUnit != null) {
        $("#date-select [role=date-update][data-value=" + timeUnit + "]").addClass("active");
    } else {
        $("#date-select [role=date-update][data-value=LastMonth]").addClass("active");
    }

    cb(timeFrom, timeTo);


    function getISTTimeZoneTime(date){
        // convert to msec
        // add local time zone offset
        // get UTC time in msec
        var utc = date.getTime() - (date.getTimezoneOffset() * 60000);
        // create new Date object for different city
        // using supplied offset
        var ISTOffset = -330;   // IST offset UTC +5:30
        var nd = new Date(utc + (60000 * ISTOffset));
        return nd.getTime();
    }

    function cb(start, end) {
        dateLabel.html(start.format('MMMM D, YYYY hh:mm A') + ' - ' + end.format('MMMM D, YYYY hh:mm A'));
        if (count != 0) {
            message = {
                timeFrom: getISTTimeZoneTime(new Date(start)),
                timeTo: getISTTimeZoneTime(new Date(end)),
                timeUnit: "Custom",
                operator : getOperator(),
                appID : getApp()
            };
            publishFilter(message);
        }
        count++;
        if (message.timeUnit && (message.timeUnit == 'Custom')) {
            $("#date-select button").removeClass("active");
            $(datePickerBtn).addClass("active");
        }
    }

    function getOperator() {
        if($("#dropdown-operator option:selected").text() == "All operators") {
            return "";
        } else {
            return $("#dropdown-operator option:selected").text();
        }
    }
    function getApp() {
        if($("#dropdown-app option:selected").text() == "All apps") {
            return "";
        } else {
            return $("#dropdown-app option:selected").text();
        }
    }

    function loadDropDownLists(fromTime, toTime) {
        var filter = {
            timeFrom : fromTime,
            timeTo : toTime
        };
        var SERVER_URL = "/portal/apis/telcoanalytics";
        var client = new TelcoAnalyticsClient().init(SERVER_URL);
        client.getOperatorsAndAppsLists(filter, function (response) {
            var data = JSON.parse(response.message);
            if (data.isAdmin !=null && data.isAdmin) {
                $('#dropdown-operator').empty();
                $('#dropdown-app').empty();
                $('#dropdown-operator').append(new Option("All operators", "AllOperators"));
                $('#dropdown-app').append(new Option("All apps", "AllApps"));
                for (var i=0; i < data.operators.length; i++) {
                    $('#dropdown-operator').append(new Option(data.operators[i], data.operators[i]));
                }
                for (var i=0; i < data.apps.length; i++) {
                    $('#dropdown-app').append(new Option(data.apps[i], data.apps[i]));
                }
            } else if (data.isOperator !=null && data.isOperator) {
                $('#dropdown-operator').hide();
                $('#date-select-div').removeClass('col-8');
                $('#date-select-div').addClass('col-10');

                $('#dropdown-app').empty();
                $('#dropdown-app').append(new Option("All apps", "AllApps"));
                for (var i=0; i < data.apps.length; i++) {
                    $('#dropdown-app').append(new Option(data.apps[i], data.apps[i]));
                }
            } else if (data.isServiceProvider !=null &&  data.isServiceProvider) {
                $('#dropdown-app').hide();
                $('#date-select-div').removeClass('col-8');
                $('#date-select-div').addClass('col-10');

                $('#dropdown-operator').empty();
                $('#dropdown-operator').append(new Option("All operators", "AllOperators"));
                for (var i=0; i < data.operators.length; i++) {
                    $('#dropdown-operator').append(new Option(data.operators[i], data.operators[i]));
                }
            } else {
                $('#dropdown-operator').hide();
                $('#dropdown-app').hide();
                $('#date-select-div').removeClass('col-8');
                $('#date-select-div').addClass('col-12');
            }
        }, function (msg) {

        });
    }

    loadDropDownLists();

    $(datePickerBtn).on('apply.daterangepicker', function(ev, picker) {
        cb(picker.startDate, picker.endDate);
    });

    $(datePickerBtn).on('show.daterangepicker', function(ev, picker) {
        $(this).attr('aria-expanded', 'true');
    });

    $(datePickerBtn).on('hide.daterangepicker', function(ev, picker) {
        $(this).attr('aria-expanded', 'false');
    });

    $(datePickerBtn).daterangepicker({
        "timePicker": false,
        "autoApply": true,
        "alwaysShowCalendars": true,
        "opens": "left",
        "maxDate": moment().endOf('day').subtract(1, 'days'),
    });

    $("#date-select [role=date-update]").click(function(){

        $("#date-select button").removeClass("active");
        $("#date-select [data-value=" + $(this).data('value') + "]").addClass("active");
        $('#btnDropdown > span:first-child').html($(this).html());
        $('#btnDropdown').addClass('active');

        switch($(this).data('value')){
            case 'LastHour':
                dateLabel.html(moment().subtract(1, 'hours').format('MMMM D, YYYY hh:mm A') + ' - ' + moment().format('MMMM D, YYYY hh:mm A'));
                message = {
                    timeFrom: getISTTimeZoneTime(new Date(moment().subtract(1, 'hours'))),
                    timeTo: getISTTimeZoneTime(new Date(moment())),
                    timeUnit: "Hour",
                    operator : getOperator(),
                    appID : getApp()
                };
                break;
            case 'LastDay':
                dateLabel.html(moment().startOf('day').subtract(1, 'day').format('MMMM D, YYYY hh:mm A') + ' - ' + moment().endOf('day').subtract(1, 'day').format('MMMM D, YYYY hh:mm A'));
                message = {
                    timeFrom: getISTTimeZoneTime(new Date(moment().startOf('day').subtract(1, 'day'))),
                    timeTo: getISTTimeZoneTime(new Date(moment().endOf('day').subtract(1, 'day'))),
                    timeUnit: "Day",
                    operator : getOperator(),
                    appID : getApp()
                };
                break;
            case 'LastMonth':
                dateLabel.html(moment().startOf('day').subtract(31, 'days').format('MMMM D, YYYY hh:mm A') + ' - ' + moment().endOf('day').subtract(1, 'day').format('MMMM D, YYYY hh:mm A'));
                message = {
                    timeFrom: getISTTimeZoneTime(new Date(moment().startOf('day').subtract(31, 'days'))),
                    timeTo: getISTTimeZoneTime(new Date(moment().endOf('day').subtract(1, 'day'))),
                    timeUnit: "Month",
                    operator : getOperator(),
                    appID : getApp()
                };
                break;
            case 'LastYear':
                dateLabel.html(moment().startOf('day').subtract(1, 'year').format('MMMM D, YYYY hh:mm A') + ' - ' + moment().endOf('day').subtract(1, 'day').format('MMMM D, YYYY hh:mm A'));
                message = {
                    timeFrom: getISTTimeZoneTime(new Date(moment().startOf('day').subtract(1, 'year'))),
                    timeTo: getISTTimeZoneTime(new Date(moment().endOf('day').subtract(1, 'day'))),
                    timeUnit: "Year",
                    operator : getOperator(),
                    appID : getApp()
                };
                break;
            default:
                return;
        }

        publishFilter(message);

        $(gadgetWrapper).removeClass('btn-dropdown-menu-open');
        $('#btnDropdown').attr('aria-expanded', 'false');
    });

    $('#btnDropdown').click(function() {
        if($(gadgetWrapper).hasClass('btn-dropdown-menu-open')){
            $(gadgetWrapper).removeClass('btn-dropdown-menu-open');
            $(this).attr('aria-expanded', 'false');
        }
        else{
            $(gadgetWrapper).addClass('btn-dropdown-menu-open');
            $(this).attr('aria-expanded', 'true');
        }
    });

    $("#dropdown-operator").change(function() {
        if(message.timeFrom == undefined && message.timeTo == undefined) {
            $("#date-select [data-value=LastMonth]").click();
        } else {
            message.operator = getOperator();
        }
        publishFilter(message);
    });

    $("#dropdown-app").change(function() {
        if(message.timeFrom == undefined && message.timeTo == undefined) {
            $("#date-select [data-value=LastMonth]").click();
        } else {
            message.appID = getApp();
        }
        publishFilter(message);
    });

});

gadgets.HubSettings.onConnect = function() {
    gadgets.Hub.subscribe("chart-zoomed", function(topic, data, subscriberData) {
        onChartZoomed(data);
    });
};

function onChartZoomed(data) {
    console.log(data);
    message = {
        timeFrom: data.timeFrom,
        timeTo: data.timeTo,
        timeUnit: "Custom"
    };
    publishFilter(message);
    var start = data.timeFrom;
    var end = data.timeTo;
    // dateLabel.html(start.format('MMMM D, YYYY hh:mm A') + ' - ' + end.format('MMMM D, YYYY hh:mm A'));
    if (data.timeUnit && (data.timeUnit == 'Custom')) {
        $("#date-select button").removeClass("active");
        $(datePickerBtn).addClass("active");
    }
};

$(window).resize(function() {
    if(($('body').attr('media-screen') == 'md') || ($('body').attr('media-screen') == 'lg')){
        $(gadgetWrapper).removeClass('btn-dropdown-menu-open');
        $('#btnDropdown').attr('aria-expanded', 'false');
    }
});

$(window).load(function() {
    var datePicker = $('.daterangepicker'),
        dropdown = $('ul.dropdown-menu');

    $('body').click(function(e){
        if ((!dropdown.is(e.target) && dropdown.has(e.target).length === 0)
            && (!$('#btnDropdown').is(e.target) && $('#btnDropdown').has(e.target).length === 0)) {
            $(gadgetWrapper).removeClass('btn-dropdown-menu-open');
            $('#btnDropdown').attr('aria-expanded', 'false');
        }
    });

    $('head', parentWindow).append('<link rel="stylesheet" type="text/css" href="' + resolveURI + 'store/carbon.super/fs/gadget/Date_Range_Picker/css/daterangepicker.css" />');
    $('body', parentWindow).append('<script src="' + resolveURI + 'store/carbon.super/fs/gadget/Date_Range_Picker/js/daterangepicker.js" type="text/javascript"></script>');
    $(gadgetWrapper).append(datePicker);
    $(gadgetWrapper).append(dropdown);
    $(gadgetWrapper).closest('.ues-component-box').addClass('widget form-control-widget');
    $('body').addClass('widget');
});