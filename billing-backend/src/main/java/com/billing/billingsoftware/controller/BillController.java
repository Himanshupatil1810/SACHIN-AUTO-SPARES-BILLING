package com.billing.billingsoftware.controller;

import com.billing.billingsoftware.dto.BillRequest;
import com.billing.billingsoftware.entity.Bill;
import com.billing.billingsoftware.service.BillService;
import com.billing.billingsoftware.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin
public class BillController {

    @Autowired
    private BillService billService;

    @Autowired
    private BillRepository billRepository;

    @PostMapping("/generate")
    public Bill generateBill(@RequestBody BillRequest request) {
        return billService.createBill(request);
    }

    @GetMapping("/{billNumber}")
    public Bill getBill(@PathVariable String billNumber) {
        // You may need to add findByBillNumber to your repository
        return billRepository.findAll().stream()
            .filter(b -> b.getBillNumber().equals(billNumber))
            .findFirst()
            .orElse(null);
    }

    // Optional: Add a method to get all bills for the frontend list view
    @GetMapping
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }
}