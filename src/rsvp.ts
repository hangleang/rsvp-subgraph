import { Address, BigInt, ipfs, json } from "@graphprotocol/graph-ts"
import {
  EventCheckedIn,
  EventCreated,
  EventRSVP,
  UnclaimedDepositPaid,
} from "../generated/RSVP/RSVP"
import { Event, Attendee, RSVPOnEvent, AttendedOnEvent } from "../generated/schema"

export function handleEventCreated(event: EventCreated): void {
  let newEvent = Event.load(event.params.eventId.toHex())

  if (!newEvent) {
    newEvent = new Event(event.params.eventId.toHex())
    newEvent.eventId = event.params.eventId
    newEvent.creator = event.params.creator
    newEvent.startDate = event.params.startAt
    newEvent.deposit = event.params.deposit
    newEvent.maxAttendees = event.params.maxAttendees.toI32()
    newEvent.paidOut = false
    newEvent.unclaimedAmount = BigInt.zero()
    newEvent.totalRSVPs = 0
    newEvent.totalConfirmed = 0

    let metadata = ipfs.cat(event.params.contentCID + "/data.json")
    if (metadata) {
      const value = json.fromBytes(metadata).toObject()

      if (value) {
        const title = value.get("name")
        const desc = value.get("description")
        const link = value.get("link")
        const imagePath = value.get("image")

        newEvent.title = title ? title.toString() : ''
        newEvent.description = desc ? desc.toString() : ''
        newEvent.link = link ? link.toString() : ''
        
        if (imagePath) {
          const imageURL = "https://ipfs.io/ipfs/" + event.params.contentCID + imagePath.toString()
          newEvent.imageURL = imageURL
        } else {
          const fallbackURL =
            "https://ipfs.io/ipfs/bafybeibssbrlptcefbqfh4vpw2wlmqfj2kgxt3nil4yujxbmdznau3t5wi/event.png";
          newEvent.imageURL = fallbackURL
        }
      }
    }

    newEvent.save()
  }
}

export function handleEventRSVP(event: EventRSVP): void {
  const id = event.params.eventId.toHex() + event.params.attendee.toHex()
  let newRSVP = RSVPOnEvent.load(id)
  let attendeeAccount = getOrCreateAttendee(event.params.attendee)
  let targetEvent = Event.load(event.params.eventId.toHex())

  if (!newRSVP && targetEvent) {
    newRSVP = new RSVPOnEvent(id)
    newRSVP.attendee = attendeeAccount.id
    newRSVP.event = targetEvent.id
    newRSVP.save()

    targetEvent.totalRSVPs++
    targetEvent.save()

    attendeeAccount.totalRSVPs++
    attendeeAccount.save()
  }
}

export function handleEventCheckedIn(event: EventCheckedIn): void {
  const id = event.params.eventId.toHex() + event.params.attendee.toHex()
  let newAttended = AttendedOnEvent.load(id)
  let attendeeAccount = getOrCreateAttendee(event.params.attendee)
  let targetEvent = Event.load(event.params.eventId.toHex())

  if (!newAttended && targetEvent) {
    newAttended = new AttendedOnEvent(id)
    newAttended.attendee = attendeeAccount.id
    newAttended.event = targetEvent.id
    newAttended.save()

    targetEvent.totalConfirmed++
    targetEvent.save()

    attendeeAccount.totalAttendedEvents++
    attendeeAccount.save()
  }
}

export function handleUnclaimedDepositPaid(event: UnclaimedDepositPaid): void {
  let targetEvent = Event.load(event.params.eventId.toHex())

  if (targetEvent) {
    targetEvent.paidOut = true
    targetEvent.unclaimedAmount = event.params.unclaimedAmount
    targetEvent.save()
  }
}

function getOrCreateAttendee(userAddress: Address): Attendee {
  let attendee = Attendee.load(userAddress.toHex())

  if (!attendee) {
    attendee = new Attendee(userAddress.toHex())
    attendee.user = userAddress
    attendee.totalRSVPs = 0
    attendee.totalAttendedEvents = 0
    attendee.save()
  }

  return attendee
}
