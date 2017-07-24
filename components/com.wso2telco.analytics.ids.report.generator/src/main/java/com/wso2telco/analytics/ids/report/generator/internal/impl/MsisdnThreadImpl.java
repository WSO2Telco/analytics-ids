package com.wso2telco.analytics.ids.report.generator.internal.impl;


import com.wso2telco.analytics.ids.report.generator.MSISDNReportComponents;
import com.wso2telco.analytics.ids.report.generator.internal.ds.ReportHolder;
import org.apache.commons.io.FileUtils;
import org.wso2.carbon.analytics.dataservice.commons.AnalyticsDataResponse;
import org.wso2.carbon.analytics.dataservice.commons.SearchResultEntry;
import org.wso2.carbon.analytics.dataservice.commons.SortByField;
import org.wso2.carbon.analytics.dataservice.commons.SortType;
import org.wso2.carbon.analytics.dataservice.core.AnalyticsDataService;
import org.wso2.carbon.analytics.dataservice.core.AnalyticsDataServiceUtils;
import org.wso2.carbon.analytics.datasource.commons.Record;
import org.wso2.carbon.analytics.datasource.commons.exception.AnalyticsException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.*;
import java.util.*;


public class MsisdnThreadImpl extends Thread {

    private String workingDir;
    private String uuid ;
    private String dir;
    private static final Log logger = LogFactory.getLog(MsisdnThreadImpl.class);
    private AnalyticsDataService analyticsDataService;
    private int MAX_VALUE = 1000;
    MSISDNReportComponents rC;
    private String randomNumber ;
    Random random ;

    public MsisdnThreadImpl(MSISDNReportComponents MSISDNReportComponents){
        this.rC = MSISDNReportComponents;
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
                    if(rC.isAcs()){
                        SortByField sortByField = new SortByField("_timestamp",SortType.ASC);
                        sortByFieldsList.add(sortByField);
                    } else if (rC.isDesec()){
                        SortByField sortByField = new SortByField("_timestamp",SortType.DESC);
                        sortByFieldsList.add(sortByField);
                    }
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
            bufferedWriter.write("Success Type,"+rC.getSuccessType()+"\n");
            bufferedWriter.write("Reason,"+rC.getReason()+"\n");
            bufferedWriter.write("Date Time,Operator,App ID,MSISDN,Success or Failure,Success or Fail Type"+"\n");
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
        try {
            writer = new FileWriter(file, true);
            bufferedWriter = new BufferedWriter(writer);
            for (Record record : records) {
                String content = record.getValues().get("datetime").toString() + "," +
                    record.getValues().get("operator").toString() + "," +
                    record.getValues().get("appID").toString() + "," ;
                if(rC.isMsisdnHash()) {
                    content+=record.getValues().get("msisdn_hash").toString() + ",";
                }else{
                    content+= record.getValues().get("msisdn").toString() + "," ;
                }
                content+=record.getValues().get("success").toString() + "," +
                    record.getValues().get("authtype").toString()+"\n";
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
