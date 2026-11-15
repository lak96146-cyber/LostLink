package com.lostlink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LostLinkApplication {
    public static void main(String[] args) {
        SpringApplication.run(LostLinkApplication.class, args);
    }
}
