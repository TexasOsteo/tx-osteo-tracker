# Requirements

Below is a brief outline of our functional requirements. More in-depth documentation is available in the Project Plan document.

These requirements are built around two key user roles:

- Volunteers are normal users. They can view events and sign up for them.
- Admins are TOF staff. They can create new events, modify existing events, manage volunteers, and verify volunteer qualifications.

Admins have exclusive access to certain pages that allow them to perform their unique actions, but the general website layout is the same for both user types.

### Events

- Users should be able to see events in a list (`/event/listings`) and in a calendar view (`/event/calendar`)
- Admins should be able to manage the volunteers for each event (`/event/[id]/volunteers`)
- Admins should be able to edit existing events (`/event/[id]/edit`)
- Admins should be able to create new events (`/event/new`)
- Volunteers should be able to register and unregister from events (both `/event/calendar` and `/event/listings`)
- Users should be able to view events in external calendar (e.g. Google Calendar) (`/api/calendar/ical`)
- Users should be able to check themselves into events using a short code provided by admins (`/event/code/[id]` and `/event/checkin/[id]`)
- Events should have volunteer positions that have prerequisite qualifications, and volunteers should be only able to sign up for these positions if they have the approved qualifications

### Email

- Users should receive email notifications to remind them of upcoming events, of new events, and newsletters
- Admins should receive email digests and reports about the volunteers attending events
- Users should be able to report other users anonymously, and admins should be able to see these reports via email

### Users

- Users should be able to create accounts and login via Auth0 (`/api/auth/login`)
- Users should be able to log out (`/api/auth/logout`)
- Users should be able to create a volunteer profile (`/users/new`)
- Users should be able to edit their settings (`/users/me/settings`)
- Users should be able to view their profile and hours (`/users/me`)
- Admins should be able to make notes on specific users
- Admins should be able to override information about users (e.g. change attendance, make other users admin, delete other users, etc.) (`/admins`)
- Users should be able to leave notes about themselves (e.g. allergy information) (`/users/me/edit/`)
- Users should be able to apply for admin-created qualification categories, and admins should be able to approve/reject these qualifications (`/qualifications/list`, `/qualifications/application`, and `/qualifications/new`)

### Resources

- Users should be able to see TOF training videos (`/resources`)
