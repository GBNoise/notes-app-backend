package com.gbnoise.backend.appuser

import lombok.extern.slf4j.Slf4j
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Slf4j
class AppUserServiceImplementation
    @Autowired constructor(val repository: AppUserRepository)
    : AppUserService {

    val logger: Logger = LoggerFactory.getLogger(this::class.java)
    override fun getAll(): List<AppUser> {
        return repository.findAll()
    }

    override fun getByUsername(username: String): AppUser? {
        return repository.findByUsername(username)
    }

    override fun getByEmail(email:String): AppUser? {
        return repository.findByEmail(email)
    }

    override fun getById(id: Long): AppUser? {
        return repository.findById(id).get()
    }

    override fun createUser(user: AppUser): AppUser? {
        val createdUser = repository.save(user);
        return createdUser
    }

    @Transactional
    override fun updateUser(user: AppUser): AppUser? {
        val foundUser = getById(user.id as Long) ?: return null
        foundUser.username = user.username
        foundUser.email = user.email
        foundUser.updateDate = user.updateDate
        repository.save(foundUser)

        return foundUser
    }
    override fun deleteUserByUsername(username: String):String {
        val user = getByUsername(username)?: return "USER DOES NOT EXISTS"
        repository.delete(user)
        return "USER DELETED FROM THE DATABASE"
    }

    override fun deleteUserByEmail(email: String):String {
        val user = getByEmail(email)?: return "USER DOES NOT EXISTS"
        repository.delete(user)
        return "USER DELETED FROM THE DATABASE"
    }

    override fun deleteUserById(id: Long):String {
        val user = getById(id)?: return "USER DOES NOT EXISTS"
        val username = user.username
        repository.delete(user)
        return "USER $username DELETED FROM THE DATABASE"
    }
}