# Requirements

Below is an outline of our functional requirements. These requirements are built around two key user roles:

- Volunteers are normal users. They can view events and sign up for them.
- Admins are TOF staff. They can create new events, modify existing events, manage volunteers, and verify volunteer qualifications.

Admins have exclusive access to certain pages that allow them to perform their unique actions, but the general website layout is the same for both user types.

## Implemented Requirements (Dec 2023)

### Events

- Users should be able to see events in a list (`/event/listings`) and in a calendar view (`/event/calendar`)
- Admins should be able to manage the volunteers for each event (`/event/[id]/volunteers`)
- Admins should be able to edit existing events (`/event/[id]/edit`)
- Admins should be able to create new events (`/event/new`)
- Users should be able to register and unregister from events (both `/event/calendar` and `/event/listings`)

### Users

- Users should be able to create accounts and login via Auth0 (`/api/auth/login`)
- Users should be able to log out (`/api/auth/logout`)
- Users should be able to create a volunteer profile (`/users/new`)
- Users should be able to edit their settings (`/users/me/settings`)
- Users should be able to view their profile and hours (`/users/me`)

### Resources

- Users should be able to see TOF training videos (`/resources`)

## Planned Requirements (Dec 2023)

## Events

- View events in external calendar (e.g. Google Calendar)
- Users should be able to check themselves into events using an admin-approved method (e.g. QR Code)
- Users should receive email notifications to remind them of upcoming events
- Admins should receive email digests about the volunteers attending events
- Users should be able to provide feedback about events

## Users

- Admins should be able to leave notes (flags/tags) on specific users
- Users should be able to report other users, and admins should be able to see these reports
- Admins should be able to verify the qualifications from volunteer profiles
