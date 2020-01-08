# jur-assessment

App to let users add and view statuses and status types which are stored on the blockchain

# Install and run

Make sure you have `truffle` installed.
`npm install -g truffle`

Install [Metamask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en) extension on chrome

Install [Ganache](https://www.trufflesuite.com/ganache), a blockchain running on your local machine

Then after cloning this repo,

1. run `npm install` from the main app folder.
2. Navigate to `/app` directory and run `npm install` again. This will install the client side app.
3. Then, navigate back to root and run `truffle develop` to start the truffle console.
4. Here, run `compile` and then run `migrate`. Leave the console running.
5. Start Ganache. Once you see a list of accounts on the local blockchain, click `show keys` and copy a private key.
6. Import that key into `MetaMask`
7. While leaving the truffle console running, open another terminal and navigate to the `/app` directory
8. Do `npm start`. The client side dapp will open in a new browser window. If not, go to `https://localhost:3000/`
9. If the dapp found Metamask, the local node from `truffle` and local blockchain from `ganache`, the client should run correctly.
