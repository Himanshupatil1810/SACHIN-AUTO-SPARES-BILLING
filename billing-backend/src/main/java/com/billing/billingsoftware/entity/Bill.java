package com.billing.billingsoftware.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bills")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String billNumber;

    private String customerName;

    private String customerGSTIN;
    // ADD THIS LINE
    private String vehicleNumber;

    private LocalDate billDate;

    private double totalBeforeTax;

    private double cgstAmount;

    private double sgstAmount;

    private double totalAfterTax;

    // One bill can have multiple items
    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL)
    private List<BillItem> items = new ArrayList<>();


    // Constructors
    public Bill() {}

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public String getBillNumber() {
        return billNumber;
    }

    public void setBillNumber(String billNumber) {
        this.billNumber = billNumber;
    }

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

    public LocalDate getBillDate() {
        return billDate;
    }

    public void setBillDate(LocalDate billDate) {
        this.billDate = billDate;
    }

    public double getTotalBeforeTax() {
        return totalBeforeTax;
    }

    public void setTotalBeforeTax(double totalBeforeTax) {
        this.totalBeforeTax = totalBeforeTax;
    }

    public double getCgstAmount() {
        return cgstAmount;
    }

    public void setCgstAmount(double cgstAmount) {
        this.cgstAmount = cgstAmount;
    }

    public double getSgstAmount() {
        return sgstAmount;
    }

    public void setSgstAmount(double sgstAmount) {
        this.sgstAmount = sgstAmount;
    }

    public double getTotalAfterTax() {
        return totalAfterTax;
    }

    public void setTotalAfterTax(double totalAfterTax) {
        this.totalAfterTax = totalAfterTax;
    }

    public List<BillItem> getItems() {
        return items;
    }

    public void setItems(List<BillItem> items) {
        this.items = items;
    }

    // ADD THESE METHODS
    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }
}
