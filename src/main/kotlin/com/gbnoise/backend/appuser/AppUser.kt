package com.gbnoise.backend.appuser

import java.time.LocalDateTime


data class AppUser(
    var username:String,
    var email:String,
    val creationDate: LocalDateTime = LocalDateTime.now(),
    var updateDate:LocalDateTime = LocalDateTime.now()
) {
}