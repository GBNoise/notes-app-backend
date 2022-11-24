package com.gbnoise.backend.appuser

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController


@RestController
class AppUserController {
    @GetMapping("/")
    public fun getUsers(): ResponseEntity<List<AppUser>> {
        val noisex = AppUser("noisex","noisex@gmail.com")
        val gbnoise = AppUser("GBNoise","GBNoise@gmail.com")
        return ResponseEntity.ok().body(listOf(noisex,gbnoise))
    }
}z