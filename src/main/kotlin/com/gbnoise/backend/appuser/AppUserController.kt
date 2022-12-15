package com.gbnoise.backend.appuser

import org.apache.coyote.Response
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import com.gbnoise.backend.constants.Constants.CURRENT_API_PATH as CP


@RestController
@RequestMapping(path=["${CP}/users"])
class AppUserController @Autowired constructor(val service: AppUserService){
    @GetMapping
    public fun getUsers(): ResponseEntity<List<AppUser>> {
        return ResponseEntity.ok().body(service.getAll())
    }

    @GetMapping("/{username}")
    public fun getUserByUsername(@PathVariable username:String)
    : ResponseEntity<AppUser>? {
        val user:AppUser? = service.getByUsername(username);
        return if (user != null) ResponseEntity.ok().body(user)
        else ResponseEntity.status(404).body(null)
    }

    @GetMapping("/id/{id}")
    public fun getUserById(@PathVariable id:Long):ResponseEntity<AppUser>? {
        val user:AppUser? = service.getById(id)
        return if (user != null) ResponseEntity.ok().body(user)
        else ResponseEntity.status(404).body(null)
    }

    @PostMapping
    public fun createUser(@RequestBody user:AppUser):ResponseEntity<AppUser>? {
        val createdUser = service.createUser(user)

        return if (createdUser != null) ResponseEntity.status(201).body(createdUser)
        else ResponseEntity.status(500).body(null)
    }

    @PutMapping
    public fun updateUser(@RequestBody user:AppUser):ResponseEntity<AppUser>? {
        val updatedUser = service.updateUser(user)
        return if (updatedUser != null) ResponseEntity.status(200).body(updatedUser)
        else ResponseEntity.status(500).body(null)
    }

    @DeleteMapping("/id/{id}")
    public fun deleteUserWithId(@PathVariable id:Long):ResponseEntity<String> {
        val deleteUserResponse = service.deleteUserById(id)
        return ResponseEntity.ok().body(deleteUserResponse)
    }
}