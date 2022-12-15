package com.gbnoise.backend.appuser

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus

interface AppUserService {

    fun getAll():List<AppUser>
    fun getByUsername(username:String):AppUser?
    fun getByEmail(email: String):AppUser?
    fun getById(id:Long):AppUser?
    fun createUser(user:AppUser) : AppUser?
    fun updateUser(user:AppUser) : AppUser?
    fun deleteUserByUsername(username:String): String
    fun deleteUserByEmail(email:String): String
    fun deleteUserById(id:Long): String
}