package com.gbnoise.backend.appuser

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController


@RestController
class AppUserController @Autowired constructor(val service: AppUserService){
    @GetMapping("/api/v1/users")
    public fun getUsers(): ResponseEntity<List<AppUser>> {
        return ResponseEntity.ok().body(service.getAll())
    }
}