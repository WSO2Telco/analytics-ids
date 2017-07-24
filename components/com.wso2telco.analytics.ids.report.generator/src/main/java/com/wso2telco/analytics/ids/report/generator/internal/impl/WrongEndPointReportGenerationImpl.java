package com.wso2telco.analytics.ids.report.generator.internal.impl;

import java.io.File;
import java.util.Arrays;
import java.util.UUID;

import org.apache.commons.io.FileUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.wso2telco.analytics.ids.report.generator.WrongEndPointReportComponents;
import com.wso2telco.analytics.ids.report.generator.WrongEndPointReportGenerationService;

public class WrongEndPointReportGenerationImpl implements WrongEndPointReportGenerationService {


	private static final Log log = LogFactory.getLog(WrongEndPointReportGenerationImpl.class);
	private String fileName;
	private String uuid ;
	private String workingDir ;


	public WrongEndPointReportGenerationImpl() {
		uuid = UUID.randomUUID().toString();
		workingDir = System.getProperty("user.dir");
	}

	@Override
	public void generate(WrongEndPointReportComponents wrongEndPointReportComponents) {
		Thread wrongEndpointThread = new WrongEndPointThreadImpl(wrongEndPointReportComponents);
		wrongEndpointThread.start();
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
		}catch (Exception e){
			log.error(e);
		}
		return list;
	}

	@Override
	public boolean moveFile(String path, String fileName) {
		try{
			String  workingDir = System.getProperty("user.dir");
			String dir= "/repository/deployment/server/jaggeryapps/portal/tmp/WrongEndpoints/"+fileName;
			File destinationFile = new File(workingDir+dir);
			File file = new File(path);
			FileUtils.moveFile(file, destinationFile);
		}catch(Exception e){
			log.error("Delete operation is failed "+e);
		}
		return false;

	}

	@Override
	public String getUuid() {
		// TODO Auto-generated method stub
		return uuid;
	}

	@Override
	public String getFileName() {
		// TODO Auto-generated method stub
		return fileName;
	}

	@Override
	public String checkNull(String value) {
		if(value==null || value.isEmpty() || value.equals("undefined")){
			value ="0";
		}
		return value;
	}

}
