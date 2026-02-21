package com.billing.billingsoftware.repository;

import com.billing.billingsoftware.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {

    // Custom method (optional, useful later)
    Bill findTopByOrderByIdDesc();

}
