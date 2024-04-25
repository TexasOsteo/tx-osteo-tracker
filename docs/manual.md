# User Manual

Welcome to the Texas Osteo Website User Manual! This comprehensive guide is designed to provide admins with detailed instructions and insights into navigating and utilizing the various features and functionalities on the website. This manual will be highlighting what each page does within the nav bar, from left to right.

## Sign Up / Log In Page

When visiting the website, users are directed to a landing page, and prompted to sign up or log in to access their accounts and the web application. We utilize Auth0 encryption to ensure secure authentication and safeguard user data which you can learn more about [here](./authentication.md).

When the user logs into the website for the first time, the user will be prompted to enter personal information and qualifications for the user's account, once submitted, the user's information will be attached to their account and is available to change later, if needed. Find more about changing this in the user page [here](##User-Page).

## Calendar

The calendar page provides a comprehensive view of all events hosted by Texas Osteo, including past, present, and upcoming events. The calendar is designed to be user-friendly, allowing easy navigation and exploration of scheduled activities. Below are the key features and functionalities of the calendar page:

- "<" button: Clicking this button navigates the calendar back to the previous month, allowing users to view past events.
- ">" button: Clicking this button advances the calendar to the next month, facilitating exploration of upcoming events.
- "today" button: Clicking this button will center the calender on the todays month.
- "Export To My Calendar" button: clicking this button will provide a export link of the calendar for whatever the user decides to do with.
- Events: the user may click on past, present, and upcoming events within the calendar and each will provide info about the event, and the ability to de-register themselves from the event.

## Events

The events page lists present, and upcoming events created by the web apps admins, find more about creating events [here](#New-Events). Within the page the user has the ability to sort by location, organization, and dates of events listed. Admins accounts have the ability to edit anything about the events when created, as well as create a unique "Attendance Code" via the generate code button for volunteers to verify they are registered for the event in person.

## New Events

The New Event page will allow admin accounts to create a new event viewable on the events and calendar page, all entry fields within the page are needed to successfully post an event in order for volunteers to sign up. The entry fields include event name, organzation title, location, date/time, duration, volunteer hours offered, a thumbnail, basic contact information, description of the event, and some amount of volunteer positions with or without qualifications. The creation form also offers wheter the event should send an email about such new event to all subscribed volunteers, which is toggleable for volunteer accounts within [the-user-page](#user-page).

## Resources

The resources page offers general basic information about what the volunteers will be helping treat, so volunteers unfamiliar to TOF and/or Osteoporosis are given insight what kind of treatments will be utilized for patients.

## User Page

The user page is accessed through the profile picture at the top right of the web application, and will display general information about the user on the banner on the left, clicking the "edit account" at the bottom of the banner will allow the information entered upon creation of the their account to be changed to the discretion of the user, most notably the qualifications of the user. Users may also delete their account by clicking the "delete account" on the banner, this will prompt a pop-up to verify the decision to delete of an account. The page also hosts information about past, present, and upcoming events the user decided to sign up for which will display the same basic information of the event.

### The user manual is up to date as of the website's initial deployment.
