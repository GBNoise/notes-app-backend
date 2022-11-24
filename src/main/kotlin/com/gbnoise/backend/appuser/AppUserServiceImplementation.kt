package com.gbnoise.backend.appuser

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class AppUserServiceImplementation
    @Autowired constructor(val repository: AppUserRepository)
    : AppUserService {
    override fun getAll(): List<AppUser> {
        return repository.findAll()
    }

    override fun getByUsername(username: String): AppUser? {
        return repository.findByUsername(username)
    }

    override fun getById(id: Long): AppUser? {
        return repository.findById(id).get()
    }

    override fun createUser(user: AppUser): AppUser? {
        return repository.save(user)
    }

    override fun updateUser(user: AppUser): AppUser? {
        TODO("Not yet implemented")
    }

    override fun deleteUserByUsername(username: String) {
        TODO("Not yet implemented")
    }

    override fun deleteUserByEmail(email: String) {
        TODO("Not yet implemented")
    }

    override fun deleteUserById(id: Long) {
        TODO("Not yet implemented")
    }
}