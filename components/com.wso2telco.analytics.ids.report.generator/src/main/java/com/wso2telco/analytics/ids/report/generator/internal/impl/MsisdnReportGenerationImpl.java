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
package com.wso2telco.analytics.ids.report.generator.internal.impl;

import com.wso2telco.analytics.ids.report.generator.MsisdnReportGenerationService;
import com.wso2telco.analytics.ids.report.generator.MSISDNReportComponents;
import org.apache.commons.io.FileUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.File;
import java.util.*;


public class MsisdnReportGenerationImpl implements MsisdnReportGenerationService {
    private static final Log log = LogFactory.getLog(MsisdnReportGenerationImpl.class);
    String fileName;
    String uuid ;
    String workingDir ;


    public MsisdnReportGenerationImpl(){
        uuid = UUID.randomUUID().toString();
        workingDir = System.getProperty("user.dir");
    }

    @Override
    public void generate(MSISDNReportComponents MSISDNReportComponents) {
        Thread msisdnreport = new MsisdnThreadImpl(MSISDNReportComponents);
        msisdnreport.start();
    }

    @Override
    public String getFilenames(String filePath) {
        String list = "[]";
        try {
            File folder = new File(filePath);
            File[] listOfFiles = folder.listFiles();

            String[] filelist = new String[listOfFiles.length];
            for (int i = 0; i < listOfFiles.length; i++) {
                if (listOfFiles[i].isFile()) {
                    filelist[i] = "\"" + listOfFiles[i].getName() + "\"";
                }
            }
            list = Arrays.toString(filelist);
        }catch (NullPointerException e){

        }

        return list;
    }



    @Override
    public boolean moveFile(String path,String fileName) {
        try{
            String  workingDir = System.getProperty("user.dir");
            String dir= "/repository/deployment/server/jaggeryapps/portal/tmp/"+fileName;
            File destinationFile = new File(workingDir+dir);
            File file = new File(path);
            FileUtils.moveFile(file, destinationFile);
            return true;

        }catch(Exception e){

            log.error("Delete operation is failed "+e);
            return false;

        }
    }


    @Override
    public  String getUuid() {
        return uuid;
    }

    @Override
    public  String getFileName() {
        return fileName;
    }

    @Override
    public String checkNull(String value){
        if(value.equals(null) || value.isEmpty() || value.equals("undefined")){
            value ="0";
        }
        return value;
    }



}
