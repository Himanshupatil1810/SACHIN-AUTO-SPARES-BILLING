package com.billing.billingsoftware.service;

import com.billing.billingsoftware.dto.BillItemRequest;
import com.billing.billingsoftware.dto.BillRequest;
import com.billing.billingsoftware.entity.Bill;
import com.billing.billingsoftware.entity.BillItem;
import com.billing.billingsoftware.repository.BillRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    private final double CGST_RATE = 0.09;
    private final double SGST_RATE = 0.09;


    public Bill createBill(BillRequest request) {

        Bill bill = new Bill();

        bill.setCustomerName(request.getCustomerName());
        bill.setCustomerGSTIN(request.getCustomerGSTIN());
        bill.setBillDate(LocalDate.now());

        BigDecimal totalBeforeTax = BigDecimal.ZERO;
        BigDecimal totalCGST = BigDecimal.ZERO;
        BigDecimal totalSGST = BigDecimal.ZERO;
        BigDecimal totalAfterTax = BigDecimal.ZERO;

        for (BillItemRequest itemRequest : request.getItems()) {

            BillItem item = new BillItem();

            item.setDescription(itemRequest.getDescription());
            item.setQuantity(itemRequest.getQuantity());
            item.setRate(itemRequest.getRate());

            BigDecimal qty = BigDecimal.valueOf(itemRequest.getQuantity());
            BigDecimal rate = BigDecimal.valueOf(itemRequest.getRate());

            // Total price entered by user (GST included)
            BigDecimal totalPrice = qty.multiply(rate);

            // Extract base price (taxable value)
            BigDecimal base = totalPrice.divide(
                    BigDecimal.valueOf(1.18),
                    2,
                    RoundingMode.HALF_UP
            );

            // Calculate CGST and SGST
            BigDecimal cgst = base.multiply(BigDecimal.valueOf(0.09))
                    .setScale(2, RoundingMode.HALF_UP);

            BigDecimal sgst = base.multiply(BigDecimal.valueOf(0.09))
                    .setScale(2, RoundingMode.HALF_UP);

            // Final amount remains total price
            BigDecimal finalAmount = totalPrice.setScale(2, RoundingMode.HALF_UP);

            item.setAmountBeforeTax(base.doubleValue());
            item.setCgstAmount(cgst.doubleValue());
            item.setSgstAmount(sgst.doubleValue());
            item.setFinalAmount(finalAmount.doubleValue());

            item.setBill(bill);

            bill.getItems().add(item);

            totalBeforeTax = totalBeforeTax.add(base);
            totalCGST = totalCGST.add(cgst);
            totalSGST = totalSGST.add(sgst);
            totalAfterTax = totalAfterTax.add(finalAmount);
        }
        totalBeforeTax = totalBeforeTax.setScale(2, RoundingMode.HALF_UP);
        totalCGST = totalCGST.setScale(2, RoundingMode.HALF_UP);
        totalSGST = totalSGST.setScale(2, RoundingMode.HALF_UP);
        totalAfterTax = totalAfterTax.setScale(2, RoundingMode.HALF_UP);

        bill.setTotalBeforeTax(totalBeforeTax.doubleValue());
        bill.setCgstAmount(totalCGST.doubleValue());
        bill.setSgstAmount(totalSGST.doubleValue());
        bill.setTotalAfterTax(totalAfterTax.doubleValue());

        // Save bill first to generate ID
        Bill savedBill = billRepository.save(bill);

        // Generate bill number using ID
        savedBill.setBillNumber(String.valueOf(savedBill.getId()));

        return billRepository.save(savedBill);
    }
}