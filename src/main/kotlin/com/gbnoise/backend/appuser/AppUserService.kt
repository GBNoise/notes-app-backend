package com.gbnoise.backend.appuser

import org.springframework.http.HttpStatus

interface AppUserService {
    fun getAll():List<AppUser>
    fun getByUsername(username:String):AppUser?
    fun getById(id:Long):AppUser?
    fun createUser(user:AppUser) : AppUser?
    fun updateUser(user:AppUser) : AppUser?
    fun deleteUserByUsername(username:String)
    fun deleteUserByEmail(email:String)
    fun deleteUserById(id:Long)
}