# BETTING CONTRACT HARDHAT PROJECT

### The project is a simple betting platform which allows 2 people to speculate on the price of an asset at a desired date.

### For example Alice and Bob are speculating on the price of Ethereum, Alice thinks it will be below $3000 on the 31st of December 2022, Bob thinks it will be above this price.

### _Using a smart contract we can act as the escrow for the bet._

<br />

# COMPILE CONTRACTS

```shell
npm run compile
```

<br />

# DEPLOY TO MUMBAI POLYGON TESTNET

### To adjust constructor args, you can edit the **`args.json`** file in the **`params`** folder

---

"betters": [\
&emsp;"0x23507516EC5k2688d97132Ced7C13952a58Bd889",\
&emsp;"0xFBaFafc3C61566cec082c9A2884543d9de35B009"\
],\
&emsp;"betEndDate": "2022-04-01 10:32:00",\
&emsp;"betAmounts": [0.01, 0.02], // values are in ETH\
&emsp;"betPositions": [0, 1], // 0 for up, 1 for down position\
&emsp;"pivotPrice": 3000 // $\
}\

---

```shell
npm run deploy
```

<br />

# UPGRADE THE CONTRACT

```shell
npm run upgrade
```

<br />

# RUN HARDHAT TESTS

```shell
npm run test
```
