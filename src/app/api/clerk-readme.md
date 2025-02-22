Important notes:

For client-side components using useUser(), you need to add 'use client' at the top of your file 2
The currentUser() helper on the server-side uses fetch() so it is automatically deduped per request 1
Server-side currentUser() makes a call to the Backend API and counts towards rate limits
