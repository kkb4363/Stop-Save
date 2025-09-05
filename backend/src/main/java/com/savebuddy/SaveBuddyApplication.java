package com.savebuddy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SaveBuddyApplication {

	public static void main(String[] args) {
		SpringApplication.run(SaveBuddyApplication.class, args);
	}

}
