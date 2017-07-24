package com.wso2telco.analytics.ids.report.generator.beans;

import java.util.List;

public class GadgetBeen {

    private List<String> count;
    private String date;

    public GadgetBeen(List<String> count, String date) {
        this.count = count;
        this.date = date;
    }

    public List<String> getCount() {
        return count;
    }

    public String getDate() {
        return date;
    }
}