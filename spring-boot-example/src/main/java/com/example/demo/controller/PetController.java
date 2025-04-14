package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/pets")
@Tag(name = "pets", description = "Pet operations")
public class PetController {
    
    @GetMapping
    @Operation(
        summary = "Get all pets",
        description = "Returns a list of all available pets",
        tags = { "pets" },
        operationId = "getAllPets",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "A list of pets",
                content = @Content(mediaType = "application/json")
            )
        }
    )
    public List<Pet> getAllPets() {
        return Arrays.asList(
            new Pet(1L, "Fluffy", "available"),
            new Pet(2L, "Rex", "sold")
        );
    }
    
    @GetMapping("/{petId}")
    @Operation(
        summary = "Get pet by ID",
        description = "Returns a pet by its ID",
        tags = { "pets" },
        operationId = "getPetById",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "A pet",
                content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                responseCode = "404",
                description = "Pet not found"
            )
        }
    )
    public Pet getPetById(@PathVariable Long petId) {
        return new Pet(petId, "Fluffy", "available");
    }
    
    static class Pet {
        private Long id;
        private String name;
        private String status;
        
        public Pet(Long id, String name, String status) {
            this.id = id;
            this.name = name;
            this.status = status;
        }
        
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getName() {
            return name;
        }
        
        public void setName(String name) {
            this.name = name;
        }
        
        public String getStatus() {
            return status;
        }
        
        public void setStatus(String status) {
            this.status = status;
        }
    }
} 