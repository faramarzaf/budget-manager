package com.example.budgetmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class BudgetManagerApplication {

    // docker-compose up --build
    public static void main(String[] args) {
        SpringApplication.run(BudgetManagerApplication.class, args);
    }

}
