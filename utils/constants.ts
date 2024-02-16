/**
 * All of the email categories important to users.
 * Use Object.keys(UserEmailCategories) to get an array of all the categories.
 */
export const UserEmailCategories = {
  NEW_EVENT: 'Reminders about new events',
  EVENT_REMINDER: 'Reminders about events you have signed up for',
  EVENT_SIGNUP: 'Confirmation of your sign-up for an event',
  NEWSLETTER: 'Newsletters and other information from TOF',
  OTHER: 'Other emails from TOF',
}

/**
 * All of the email categories important to admins only.
 * Use Object.keys(AdminEmailCategories) to get an array of all the categories.
 */
export const AdminEmailCategories = {
  DIGEST: 'Periodic updates about event activity and more',
  USER_REPORT: 'Reports about user activity',
}
