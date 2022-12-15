package com.gbnoise.backend.appuser

import java.time.LocalDateTime
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.SequenceGenerator
import javax.persistence.UniqueConstraint


@Entity
data class AppUser(
    @Id
    @SequenceGenerator(
        name = "app_user_sequence",
        sequenceName = "app_user_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "app_user_sequence"
    )
    var id:Long?,

    @Column(unique = true)
    var username:String,
    @Column(unique = true)
    var email:String,
    val creationDate: LocalDateTime = LocalDateTime.now(),
    var updateDate:LocalDateTime = LocalDateTime.now()
) {
}