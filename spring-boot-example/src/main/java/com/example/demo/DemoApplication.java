package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;

import java.util.List;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    /**
     * Programmatically define the OpenAPI specification.
     * Note: This is only used if a static YAML file is not specified.
     */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Pet Store API")
                        .version("1.0.0")
                        .description("A sample API for managing pets")
                        .contact(new Contact()
                                .name("API Support")
                                .email("api@example.com")
                                .url("https://example.com/support")))
                .servers(List.of(
                        new Server()
                                .url("https://api.example.com/v1/petstore")
                                .description("Production server")
                ));
    }
} 