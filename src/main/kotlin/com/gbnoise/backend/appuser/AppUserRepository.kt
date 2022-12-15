package com.gbnoise.backend.appuser

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface AppUserRepository : JpaRepository<AppUser,Long> {
    fun findByUsername(username:String) : AppUser?
    fun findByEmail(email:String): AppUser?
}