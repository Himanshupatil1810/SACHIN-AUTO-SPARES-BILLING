package com.billing.billingsoftware.controller;

import com.billing.billingsoftware.dto.BillRequest;
import com.billing.billingsoftware.entity.Bill;
import com.billing.billingsoftware.service.BillService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin
public class BillController {

    @Autowired
    private BillService billService;

    @PostMapping("/generate")
    public Bill generateBill(@RequestBody BillRequest request) {
        return billService.createBill(request);
    }
}