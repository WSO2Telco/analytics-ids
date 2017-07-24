package com.wso2telco.analytics.ids.report.generator.internal.ds;

import com.wso2telco.analytics.ids.report.generator.HEFailedReportGenerationService;
import com.wso2telco.analytics.ids.report.generator.MsisdnReportGenerationService;
import com.wso2telco.analytics.ids.report.generator.MsisdnSharingReportGenerationService;
import com.wso2telco.analytics.ids.report.generator.WrongEndPointReportGenerationService;

public class ReportValueHolder {


    private static MsisdnReportGenerationService msisdnReportGenerationService;

    public static MsisdnReportGenerationService getMsisdnReportGenerationService() {
        return msisdnReportGenerationService;
    }

    public static void setMsisdnReportGenerationService(MsisdnReportGenerationService msisdnReportGenerationService) {
        ReportValueHolder.msisdnReportGenerationService = msisdnReportGenerationService;
    }

    private static HEFailedReportGenerationService heFailedReportGenerationService;

    public static HEFailedReportGenerationService getHEFailedReportGenerationService() {
        return heFailedReportGenerationService;
    }

    public static void setHEFailedReportGenerationService(HEFailedReportGenerationService heFailedReportGenerationService) {
        ReportValueHolder.heFailedReportGenerationService = heFailedReportGenerationService;
    }
    
    private static WrongEndPointReportGenerationService wrongEndPointReportGenerationService;

    public static WrongEndPointReportGenerationService getWrongEndPointReportGenerationService() {
		return wrongEndPointReportGenerationService;
	}

    public static void setWrongEndPointReportGenerationService(
			WrongEndPointReportGenerationService wrongEndPointReportGenerationService) {
		ReportValueHolder.wrongEndPointReportGenerationService = wrongEndPointReportGenerationService;
	}
    
    private static MsisdnSharingReportGenerationService msisdnSharingReportGenerationService;

	public static MsisdnSharingReportGenerationService getMsisdnSharingReportGenerationService() {
		return msisdnSharingReportGenerationService;
	}

	public static void setMsisdnSharingReportGenerationService(
			MsisdnSharingReportGenerationService msisdnSharingReportGenerationService) {
		ReportValueHolder.msisdnSharingReportGenerationService = msisdnSharingReportGenerationService;
	}      

}
