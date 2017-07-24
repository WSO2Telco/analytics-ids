/*
 * Copyright (c) 2015, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.wso2telco.analytics.ids.report.generator.internal.ds;

import com.wso2telco.analytics.ids.report.generator.HEFailedReportGenerationService;
import com.wso2telco.analytics.ids.report.generator.MsisdnReportGenerationService;
import com.wso2telco.analytics.ids.report.generator.MsisdnSharingReportGenerationService;
import com.wso2telco.analytics.ids.report.generator.WrongEndPointReportGenerationService;
import com.wso2telco.analytics.ids.report.generator.internal.impl.HEFailedReportGenerationImpl;
import com.wso2telco.analytics.ids.report.generator.internal.impl.MsisdnReportGenerationImpl;
import com.wso2telco.analytics.ids.report.generator.internal.impl.MsisdnSharingReportGenerationImpl;
import com.wso2telco.analytics.ids.report.generator.internal.impl.WrongEndPointReportGenerationImpl;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.osgi.service.component.ComponentContext;
import org.wso2.carbon.analytics.dataservice.core.AnalyticsDataService;

/**
 * This class is used to get the MsisdnReportGenerationImpl,HEFailedReportGenerationImpl,WrongEndPointReportGenerationService,MsisdnSharingReportGenerationImpl,MsisdnSharingReportGenerationService.
 *
 * @scr.component name="com.wso2telco.analytics.ids.report.generator.MsisdnReportGenerationService,com.wso2telco.analytics.ids.report.generator.HEFailedReportGenerationService,com.wso2telco.analytics.ids.report.generator.WrongEndPointReportGenerationService,com.wso2telco.analytics.ids.report.generator.MsisdnSharingReportGenerationService" immediate="true"
 * @scr.reference name="org.wso2.carbon.analytics.dataservice.core.AnalyticsDataService" interface="org.wso2.carbon.analytics.dataservice.core.AnalyticsDataService"
 * cardinality="1..1" policy="dynamic" bind="setAnalyticsDataAPIService" unbind="unsetAnalyticsDataAPIService"
 */
public class ReportGeneratorServiceDS {
    private static final Log log = LogFactory.getLog(ReportGeneratorServiceDS.class);

    protected void activate(ComponentContext context) {
        try {
            MsisdnReportGenerationService msisdnReportGenerationService = new MsisdnReportGenerationImpl();
            HEFailedReportGenerationService heFailedReportGenerationService = new HEFailedReportGenerationImpl();
            WrongEndPointReportGenerationService endPointReportGenerationService=new WrongEndPointReportGenerationImpl();
            MsisdnSharingReportGenerationService msisdnSharingReportGenerationService = new MsisdnSharingReportGenerationImpl();
            context.getBundleContext().registerService(MsisdnReportGenerationService.class.getName(),
                    msisdnReportGenerationService, null);
            context.getBundleContext().registerService(HEFailedReportGenerationService.class.getName(),
                    heFailedReportGenerationService, null);
            context.getBundleContext().registerService(WrongEndPointReportGenerationService.class.getName(),
            		endPointReportGenerationService, null);
            context.getBundleContext().registerService(MsisdnSharingReportGenerationService.class.getName(),
            		msisdnSharingReportGenerationService, null);
            
            ReportValueHolder.setMsisdnReportGenerationService(msisdnReportGenerationService);
            ReportValueHolder.setHEFailedReportGenerationService(heFailedReportGenerationService);
            ReportValueHolder.setWrongEndPointReportGenerationService(endPointReportGenerationService);
            ReportValueHolder.setMsisdnSharingReportGenerationService(msisdnSharingReportGenerationService);
        } catch (Exception e) {
            log.error("MsisdnReportGenerationImpl cannot be deployed ", e);
        }

    }

    protected void setAnalyticsDataAPIService(AnalyticsDataService analyticsDataService) {
        ReportHolder.setAnalyticsDataService(analyticsDataService);
    }

    protected void unsetAnalyticsDataAPIService(AnalyticsDataService analyticsDataService) {
        // Nothing to do in unset
    }

}
