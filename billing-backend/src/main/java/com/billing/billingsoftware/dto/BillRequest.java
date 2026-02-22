package com.billing.billingsoftware.dto;

import java.util.List;

public class BillRequest {

    private String customerName;
    private String customerGSTIN;
    private String vehicleNumber;

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

    // Add Getter and Setter for vehicleNumber
    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }
}