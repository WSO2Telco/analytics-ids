package com.wso2telco.analytics.ids.report.generator;

public interface WrongEndPointReportGenerationService {
	
    public void generate(WrongEndPointReportComponents wrongEndPointReportComponents);

    public String getFilenames(String filePath);

    public boolean moveFile(String path,String fileName);

    public String getUuid();

    public String getFileName();

    public String checkNull(String value);

}
