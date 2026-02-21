package com.billing.billingsoftware.dto;

import java.util.List;

public class BillRequest {

    private String customerName;
    private String customerGSTIN;

    private List<BillItemRequest> items;

    // Getters and Setters

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerGSTIN() {
        return customerGSTIN;
    }

    public void setCustomerGSTIN(String customerGSTIN) {
        this.customerGSTIN = customerGSTIN;
    }

    public List<BillItemRequest> getItems() {
        return items;
    }

    public void setItems(List<BillItemRequest> items) {
        this.items = items;
    }
}