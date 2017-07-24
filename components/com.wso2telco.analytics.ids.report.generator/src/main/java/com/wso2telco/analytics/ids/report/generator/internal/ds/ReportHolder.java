package com.wso2telco.analytics.ids.report.generator.internal.ds;

import org.wso2.carbon.analytics.api.AnalyticsDataAPI;
import org.wso2.carbon.analytics.dataservice.core.AnalyticsDataService;

public class ReportHolder {

    private static AnalyticsDataService analyticsDataService ;

    public static AnalyticsDataService getAnalyticsDataService() {
        return analyticsDataService;
    }

    public static void setAnalyticsDataService(AnalyticsDataService analyticsDataService) {
        ReportHolder.analyticsDataService = analyticsDataService;
    }




}