# jur-assessment

App to let users add and view statuses and status types which are stored on the blockchain

# Install and run

Make sure you have `truffle` installed.
`npm install -g truffle`

Then after cloning this repo,

1. run `npm install` from the main app folder.
2. Navigate to `/app` directory and run `npm install` again. This will install the client side app.
3. Then, navigate back to root and run `truffle develop` to start the truffle console.
4. Here, run `compile` and then run `migrate`
5. While leaving the truffle console running, open another terminal and navigate to the `/app` directory
6. Do `npm start`. The client side app will open in a new browser window. If not, go to `https://localhost:3000/`
