# Authentication

Authentication is split into two parts:

- Auth0 handles the emails and passwords. We redirect users to Auth0, the user fills out their info, and Auth0 sends the user back to us.
- Our own API handles the user's real name, phone number, age, etc. This information is filled out on our website and is stored on our Postgres server.

The way this system interacts is through the Oauth2 protocol. This is a very complicated protocol, but the way we have it implemented is as follows:

- The user clicks `Log in` or `Sign Up` (they do the same thing)
- They are redirected to `/api/auth/login` which redirects them to our Auth0 application
- They sign in or create an account with their email or through Google, Apple, etc.
- Auth0 redirects them back to `/api/auth/callback/login` with a signed [JWT](#what-is-a-jwt) contains their email and Auth0 ID.
- Our system then checks if a user with this ID exists:
  - If a user exists, then the system creates a new JWT containing the id of the user in our system and their admin status. It then sets two cookies for each of the JWTs. It then redirects the user to `/event/listings`.
  - If the user does not exist, it creates one cookie for the Auth0 JWT. It then redirects the user to `/users/new` so they can setup their account. Once they do, they are redirected back to `/api/auth/login`.
- Whenever a user now makes a request, the server intercepts this request and checks both of their JWT cookies. If either is invalid, it will send them back to Auth0 to re-authenticate.

# What is a JWT?

JWT stands for JSON Web Token. Basically, it is a signed JSON object with information about the user such as their ID, email, and their admin status.

In our system, JWTs are stored as cookies, and whenever a user makes a request, these tokens are sent to the server. The server then checks the token's signature, and if it is valid, then it executes the request.

Read more about JWTs [here](https://jwt.io/).

# How do we use JWTs?

We have two JWTs in our system:

- The Auth0 JWT is used to verify that a user has logged in. It signals that they have given proper credentials and provides their email address. However, it provides no more information about this user than this.
- The Texas Osteo JWT is signed by our system and verifies that the user has an account in our system and whether or not they are an admin. The session length and secret signature are the same as the Auth0 JWT token.
