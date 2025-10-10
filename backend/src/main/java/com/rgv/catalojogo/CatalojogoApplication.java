package com.rgv.catalojogo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CatalojogoApplication {

	public static void main(String[] args) {
		SpringApplication.run(CatalojogoApplication.class, args);

		System.out.println("BUILD WITH SUCCESS!");
	}

}
