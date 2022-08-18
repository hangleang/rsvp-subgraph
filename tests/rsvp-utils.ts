import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  EventCheckedIn,
  EventCreated,
  EventRSVP,
  UnclaimedDepositPaid
} from "../generated/RSVP/RSVP"

export function createEventCheckedInEvent(
  eventId: Bytes,
  attendee: Address
): EventCheckedIn {
  let eventCheckedInEvent = changetype<EventCheckedIn>(newMockEvent())

  eventCheckedInEvent.parameters = new Array()

  eventCheckedInEvent.parameters.push(
    new ethereum.EventParam("eventId", ethereum.Value.fromFixedBytes(eventId))
  )
  eventCheckedInEvent.parameters.push(
    new ethereum.EventParam("attendee", ethereum.Value.fromAddress(attendee))
  )

  return eventCheckedInEvent
}

export function createEventCreatedEvent(
  eventId: Bytes,
  creator: Address,
  deposit: BigInt,
  startAt: BigInt,
  maxAttendees: BigInt,
  contentCID: string
): EventCreated {
  let eventCreatedEvent = changetype<EventCreated>(newMockEvent())

  eventCreatedEvent.parameters = new Array()

  eventCreatedEvent.parameters.push(
    new ethereum.EventParam("eventId", ethereum.Value.fromFixedBytes(eventId))
  )
  eventCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  eventCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "deposit",
      ethereum.Value.fromUnsignedBigInt(deposit)
    )
  )
  eventCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "startAt",
      ethereum.Value.fromUnsignedBigInt(startAt)
    )
  )
  eventCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "maxAttendees",
      ethereum.Value.fromUnsignedBigInt(maxAttendees)
    )
  )
  eventCreatedEvent.parameters.push(
    new ethereum.EventParam("contentCID", ethereum.Value.fromString(contentCID))
  )

  return eventCreatedEvent
}

export function createEventRSVPEvent(
  eventId: Bytes,
  attendee: Address
): EventRSVP {
  let eventRsvpEvent = changetype<EventRSVP>(newMockEvent())

  eventRsvpEvent.parameters = new Array()

  eventRsvpEvent.parameters.push(
    new ethereum.EventParam("eventId", ethereum.Value.fromFixedBytes(eventId))
  )
  eventRsvpEvent.parameters.push(
    new ethereum.EventParam("attendee", ethereum.Value.fromAddress(attendee))
  )

  return eventRsvpEvent
}

export function createUnclaimedDepositPaidEvent(
  eventId: Bytes,
  unclaimedAmount: BigInt
): UnclaimedDepositPaid {
  let unclaimedDepositPaidEvent = changetype<UnclaimedDepositPaid>(
    newMockEvent()
  )

  unclaimedDepositPaidEvent.parameters = new Array()

  unclaimedDepositPaidEvent.parameters.push(
    new ethereum.EventParam("eventId", ethereum.Value.fromFixedBytes(eventId))
  )
  unclaimedDepositPaidEvent.parameters.push(
    new ethereum.EventParam(
      "unclaimedAmount",
      ethereum.Value.fromUnsignedBigInt(unclaimedAmount)
    )
  )

  return unclaimedDepositPaidEvent
}
