# Brevity

full-stack dapp template project using foundry and next.js

### Prerequisites

* yarn
* https://getfoundry.sh/

### Quickstart

```
yarn
yarn start
```

### Deployment

* Add the applicable secrets and vars to the github repo settings
* Create the project on vercel

### Adding Contracts

* Add your contract to contracts folder
* Add the contract to the forge deployment scripts in ```script``` folder
* Update the ```src/scripts/deploy.ts``` with the contract name and deploy function
* Deploy the contract via ```yarn deploy```

### Adding External Contracts
* [contractInfo.ts](contractInfo.ts) needs to be updated with the contract chain, name, address and ABI
* You can use the example/contract app to more easily add an external contract

### Reference Projects

* https://github.com/scaffold-eth/scaffold-eth-typescript
* https://github.com/blacksmith-eth/blacksmith