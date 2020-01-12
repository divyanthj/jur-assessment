# Jur-assessment

App to let users add and view statuses and status types which are stored on the blockchain

# Prerequisites

1. [MetaMask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en), an ETH wallet chrome extension.
2. [Ganache](https://www.trufflesuite.com/ganache), a blockchain running on your local machine.
3. [Truffle](https://www.trufflesuite.com/), a dev environment for compiling, migrating and deploying Dapps.

# Install and run

Make sure you have `truffle` installed.
`npm install -g truffle`

Install [Metamask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en) extension on chrome

Install [Ganache](https://www.trufflesuite.com/ganache), a blockchain running on your local machine

Then after cloning this repo,

1. Run `npm install` from the main app folder.
2. Navigate to `/app` directory and run `npm install` again to install dependencies for client side app.
3. Start Ganache.
4. Start Metamask and switch the network to one present in Ganache (most likely `localhost:7545`)
5. Import any key from Ganache into Metamask.
6. From the root directory of this project, do `truffle compile`, then `truffle migrate`.
7. Do `npm start`. If Metamask detects your app, you should see the UI to add status types.

# App usage

1. In the beginning, only the UI to add status types is visible.
2. To add status type, type in a type and click "submit".
3. After clicking "submit", MetaMask will prompt you to pay.
4. After confirming payment, a new status type will have been added and UI to add new statuses will appear.
5. Similarly, add a new status and pick an existing status type. Once done, a list of available statuses will be displayed below.
6. Once the list of statuses is displayed, users may activate or deactive statuses using the switch.

_Note:_ If the data is not being updated after the transaction is confirmed, refresh the page.
