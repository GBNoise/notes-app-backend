package com.gbnoise.backend

import com.gbnoise.backend.appuser.AppUser
import com.gbnoise.backend.appuser.AppUserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import com.gbnoise.backend.constants.Constants.CURRENT_API_PATH as CP

@SpringBootApplication
class BackendApplication @Autowired constructor(val repo:AppUserRepository) {
    @Bean
    fun create() = CommandLineRunner {
        val noisex = AppUser(null,"noisex", "noisex@gmail.com")
        repo.save(noisex)
    }
}

fun main(args: Array<String>) {
    runApplication<BackendApplication>(*args)
}


