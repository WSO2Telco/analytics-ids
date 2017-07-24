package com.wso2telco.analytics.ids.report.generator.beans;

import java.util.ArrayList;

public class MsisdnGadgetBeen
{
    private String date;

    public String getRow1() {
        return row1;
    }

    public String getDate() {
        return date;
    }

    public String getRow2() {
        return row2;
    }

    public String getRow3() {
        return row3;
    }

    private String row1;
    private String row2;
    private String row3;

    public MsisdnGadgetBeen(String date, ArrayList arrayList) {
        this.date=date;
        this.row1=arrayList.get(0).toString();
        this.row2=arrayList.get(1).toString();
        this.row3=arrayList.get(2).toString();

    }
}
