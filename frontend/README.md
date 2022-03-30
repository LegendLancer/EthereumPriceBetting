### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\

### `yarn build`

Builds the app for production to the `build` folder.\

### Please change the contract address in `contract` folder when new deploy

When you deploy a new contract at the backend, you should change the contract address in the frontend.
proxyAddress is saved automatically when deploying a new contract in `backend/proxy.json` file, so once you deployed a new contract, please reflect change at the frontend.
