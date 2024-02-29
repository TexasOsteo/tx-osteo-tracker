/**
 * All of the email categories important to users.
 * Use Object.keys(UserEmailCategories) to get an array of all the categories.
 */
export enum UserEmailCategories {
  NEW_EVENT = 'NEW_EVENT',
  EVENT_REMINDER = 'EVENT_REMINDER',
  EVENT_SIGNUP = 'EVENT_SIGNUP',
  NEWSLETTER = 'NEWSLETTER',
  REPORT = 'REPORT',
  OTHER = 'OTHER',
}

/**
 * All of the email categories important to admins only.
 * Use Object.keys(AdminEmailCategories) to get an array of all the categories.
 */
export enum AdminEmailCategories {
  DIGEST = 'DIGEST',
  USER_REPORT = 'USER_REPORT',
}
