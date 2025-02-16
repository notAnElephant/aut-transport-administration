package com.transportmanagement.DTOs

import kotlinx.datetime.LocalDateTime
import kotlinx.serialization.Serializable

@Serializable
data class TransportCreation (
    val startSiteId: Int,
    val startTime: LocalDateTime,
    val destinationSiteId: Int,
    val transportSections: List<TransportSectionInfo>,
    val truckId: Int,
    val cargoIds: List<Int>
)