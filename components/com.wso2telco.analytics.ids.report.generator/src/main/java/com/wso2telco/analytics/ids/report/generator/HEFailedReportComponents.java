package com.wso2telco.analytics.ids.report.generator;

public class HEFailedReportComponents {

    private String loggedInUser;
    private String tableName;
    private String searchParams;
    private String appName;
    private String operator;
    private String fromDate;
    private String toDate;
    private String saveFilePath;
    private String userFileName;
    private int tenantId;
    private boolean msisdnHash;
    private boolean acs;
    private boolean desec;
    private String successType;

    public String getSuccessType() {
        return successType;
    }

    public void setSuccessType(String successType) {
        this.successType = successType;
    }

    public boolean isDesec() {
        return desec;
    }

    public void setDesec(boolean desec) {
        this.desec = desec;
    }

    public boolean isAcs() {
        return acs;
    }

    public void setAcs(boolean acs) {
        this.acs = acs;
    }

    public boolean isMsisdnHash() {
        return msisdnHash;
    }

    public void setMsisdnHash(boolean msisdnHash) {
        this.msisdnHash = msisdnHash;
    }

    public String getUserFileName() {
        return userFileName;
    }

    public void setUserFileName(String userFileName) {
        this.userFileName = userFileName;
    }

    public String getSaveFilePath() {
        return saveFilePath;
    }

    public void setSaveFilePath(String saveFilePath) {
        this.saveFilePath = saveFilePath;
    }

    public String getLoggedInUser() {
        return loggedInUser;
    }

    public void setLoggedInUser(String loggedInUser) {
        this.loggedInUser = loggedInUser;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getSearchParams() {
        return searchParams;
    }

    public void setSearchParams(String searchParams) {
        this.searchParams = searchParams;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public String getFromDate() {
        return fromDate;
    }

    public void setFromDate(String fromDate) {
        this.fromDate = fromDate;
    }

    public String getToDate() {
        return toDate;
    }

    public void setToDate(String toDate) {
        this.toDate = toDate;
    }

    public int getTenantId() {
        return tenantId;
    }

    public void setTenantId(int tenantId) {
        this.tenantId = tenantId;
    }

}
