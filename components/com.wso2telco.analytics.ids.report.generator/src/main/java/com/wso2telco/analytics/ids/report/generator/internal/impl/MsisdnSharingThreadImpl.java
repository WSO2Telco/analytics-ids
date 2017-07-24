package com.wso2telco.analytics.ids.report.generator.internal.impl;


import com.wso2telco.analytics.ids.report.generator.MSISDNSharingReportComponents;
import com.wso2telco.analytics.ids.report.generator.internal.ds.ReportHolder;
import org.apache.commons.io.FileUtils;
import org.wso2.carbon.analytics.dataservice.commons.AnalyticsDataResponse;
import org.wso2.carbon.analytics.dataservice.commons.SearchResultEntry;
import org.wso2.carbon.analytics.dataservice.commons.SortByField;
import org.wso2.carbon.analytics.dataservice.core.AnalyticsDataService;
import org.wso2.carbon.analytics.dataservice.core.AnalyticsDataServiceUtils;
import org.wso2.carbon.analytics.datasource.commons.Record;
import org.wso2.carbon.analytics.datasource.commons.exception.AnalyticsException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;


public class MsisdnSharingThreadImpl extends Thread {

    private String workingDir;
    private String uuid ;
    private String dir;
    private static final Log logger = LogFactory.getLog(MsisdnSharingThreadImpl.class);
    private AnalyticsDataService analyticsDataService;
    private int MAX_VALUE = 1000;
    MSISDNSharingReportComponents rC;
    private String randomNumber ;
    Random random ;

    public MsisdnSharingThreadImpl(MSISDNSharingReportComponents MSISDNSharingReportComponents){
        this.rC = MSISDNSharingReportComponents;
        uuid = UUID.randomUUID().toString();
        workingDir = System.getProperty("user.dir");
        dir= "/repository/deployment/server/jaggeryapps/portal/tmp/";
        random= new Random();
        randomNumber =String.format("%04d", random.nextInt(10000));
        analyticsDataService = ReportHolder.getAnalyticsDataService();
    }



    @Override
    public void run() {
        String filePath = workingDir+dir;
        String fileName = filePath+uuid+".csv";
        Date date= new Date();
        Long createdTimestamp = date.getTime();
        File file = new File(fileName);
        try {
            if (file.exists()) {
                file.delete();
            }
            file.createNewFile();
            writeHeaderToFile(file);
            for(int i =-0;;i+=MAX_VALUE){
                try {
                    List<SortByField> sortByFieldsList = new ArrayList<SortByField>();
                    List<SearchResultEntry> searchResultEntries = analyticsDataService.search(rC.getTenantId(),rC.getTableName(), rC.getSearchParams(),i,this.MAX_VALUE,sortByFieldsList);

                    if(searchResultEntries.size()==0||searchResultEntries.isEmpty()){
                        break;
                    }
                    List<Record> records = search(searchResultEntries);
                    writeRecordsToFile(records,file);
                } catch (AnalyticsException e) {
                    logger.error("AnalyticsException errors "+e);
                }
            }
            File moveTempFile = new File(rC.getSaveFilePath()+ rC.getLoggedInUser());
            if (!moveTempFile.exists()) {
                if (moveTempFile.mkdir()) {
                    logger.info("Directory is created-"+rC.getLoggedInUser());
                }
            }
            File destinationFile = new File(rC.getSaveFilePath()+ rC.getLoggedInUser() + "/"+rC.getUserFileName()+"_"+randomNumber+"_"+createdTimestamp+".csv");
            FileUtils.moveFile(file, destinationFile);
            logger.info("File is moved successful -"+rC.getUserFileName()+"_"+randomNumber+"_"+createdTimestamp+".csv");
        } catch (Exception e) {
            logger.error(e);
        }


    }


    private void writeHeaderToFile(File file) throws Exception {
        FileWriter fileWriter=null;
        BufferedWriter bufferedWriter=null;
        try {
            fileWriter = new FileWriter(file,true);
            bufferedWriter = new BufferedWriter(fileWriter);
            bufferedWriter.write("Operator,"+rC.getOperator()+"\n");
            bufferedWriter.write("APP ID,"+rC.getAppName()+"\n");
            bufferedWriter.write("From Date,"+rC.getFromDate()+"\n");
            bufferedWriter.write("To Date,"+rC.getToDate()+"\n");
            bufferedWriter.write("Status,"+rC.getStatus()+"\n");
            bufferedWriter.write("Date Time,Operator,App ID,MSISDN,Active or Revoke,PCR,Transaction Timestamp,amr,acr,scope,attribute,Consent Time,Consent Type,Consent Expiry, Revocation Time"+"\n");
            bufferedWriter.flush();
        }catch (Exception e){
            throw e;
        }finally{
            try {
                bufferedWriter.close();
                fileWriter.close();
            }catch (Exception e){
                logger.error(e);
            }
        }
    }

    private void writeRecordsToFile(List<Record> records, File file) throws Exception {
        FileWriter writer=null;
        BufferedWriter bufferedWriter=null;
        String content = "";

        String datetime;
        String operator;
        String appID;
        String msisdn;
        String consentStatus;
        String consentGivenTimeTimestamp;
        String amr;
        String pcrValue;
        String acrValue;
        String telcoScope;
        String consentGivenTime;
        String consentTypeName;
        String consentExpireDatetime;
        String consentRevokedTime;
        Date startDate = null;

        String attribute_value=null;
        String attribute = null;

        try {
            writer = new FileWriter(file, true);
            bufferedWriter = new BufferedWriter(writer);
            for (Record record : records) {

                if(record.getValues().get("consentGivenTime") != null){
                    startDate = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss").parse(record.getValues().get("consentGivenTime").toString());
                    consentGivenTimeTimestamp = String.valueOf(startDate.getTime());
                }else{
                    consentGivenTimeTimestamp = " ";
                }

                if(record.getValues().get("attributes") != null){
                    attribute = record.getValues().get("attributes").toString();
                    attribute = attribute.replace("}","");
                    attribute = attribute.replace("{","");
                    List<String> myList = new ArrayList<String>(Arrays.asList(attribute.split(",")));
                    for(int i=0; i<myList.size();i++){
                        if(myList.get(i).contains("device_msisdn=")){
                            attribute_value = myList.get(i);

                        }
                        else if(myList.get(i).contains("device_msisdn_hash=")){
                            attribute_value = myList.get(i);
                        }
                    }
                }else{
                    attribute_value = " ";
                }


                if(record.getValues().get("msisdn") != null){
                    msisdn = record.getValues().get("msisdn").toString();
                    msisdn = msisdn.replace("tel:+","");
                }else{
                    msisdn = " ";
                }

                if(record.getValues().get("telcoScope") != null){
                    telcoScope = record.getValues().get("telcoScope").toString();
                    telcoScope = telcoScope.replace("mc_attr_vm_share openid","mc_attr_vm_share");
                    telcoScope = telcoScope.replace("mc_attr_vm_share_hash openid","mc_attr_vm_share_hash");
                }else{
                    telcoScope = " ";
                }

                datetime = record.getValues().get("datetime") != null  ? record.getValues().get("datetime").toString(): " ";
                operator = record.getValues().get("operator") != null  ? record.getValues().get("operator").toString(): " ";
                appID = record.getValues().get("appID") != null  ? record.getValues().get("appID").toString(): " ";
                consentStatus = record.getValues().get("consentStatus") != null  ? record.getValues().get("consentStatus").toString(): " ";
                pcrValue = record.getValues().get("pcrValue") != null  ? record.getValues().get("pcrValue").toString(): " ";
                amr = record.getValues().get("amr") != null  ? record.getValues().get("amr").toString(): " ";
                acrValue = record.getValues().get("acrValue") != null  ? record.getValues().get("acrValue").toString(): " ";
//                telcoScope = record.getValues().get("telcoScope") != null  ? record.getValues().get("telcoScope").toString(): " ";
                consentGivenTime = record.getValues().get("consentGivenTime") != null  ? record.getValues().get("consentGivenTime").toString(): " ";
                consentTypeName = record.getValues().get("consentTypeName") != null  ? record.getValues().get("consentTypeName").toString(): " ";
                consentExpireDatetime = record.getValues().get("consentExpireDatetime") != null  ? record.getValues().get("consentExpireDatetime").toString(): " ";
                consentRevokedTime = record.getValues().get("consentRevokedTime") != null  ? record.getValues().get("consentRevokedTime").toString(): " ";

                content = datetime + "," + operator + "," + appID + "," + msisdn + "," + consentStatus + "," + pcrValue + "," + consentGivenTimeTimestamp + "," + amr + "," + acrValue + "," + telcoScope + "," + attribute_value + "," + consentGivenTime + "," +consentTypeName + "," + consentExpireDatetime + "," + consentRevokedTime + ",\n";

                bufferedWriter.write(content);
            }
            bufferedWriter.flush();
        }catch (Exception e){
            throw e;
        }finally{
            try {
                bufferedWriter.close();
                writer.close();
            }catch (Exception e){
                logger.error(e);
            }
        }
    }

    private List<Record> search(List<SearchResultEntry> searchResultEntries) throws AnalyticsException {

        List<String> stringArrayList = new ArrayList<String>();

        for (int i = 0; i < searchResultEntries.size(); i++) {
            stringArrayList.add(searchResultEntries.get(i).getId());
        }
        AnalyticsDataResponse resp = analyticsDataService.get(rC.getTenantId(), rC.getTableName(), 1, null, stringArrayList);
        List<Record> sortedRecords = new ArrayList<Record>();


        Map<String, Record> recordsWithIds = new HashMap<String, Record>();
        List<Record> records = AnalyticsDataServiceUtils.listRecords(analyticsDataService, resp);
        for (Record record : records) {
            recordsWithIds.put(record.getId(), record);
        }
        for (String id : stringArrayList) {
            sortedRecords.add(recordsWithIds.get(id));
        }
        return sortedRecords;

    }

}
