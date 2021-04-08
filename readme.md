# Usage

## Dev

```bash
$ yarn start
```

##

## Build

```bash
$ yarn build
```

## Test

```bash
$ yarn build
```

## Run

```bash
$ node .
```

## Config

```bash
$ cat .env
```

## API:

### orderbook:

```bash
# {"asks":[],"bids":[]}
$ curl http://localhost:5000/api/BTCZAR/orderbook \
  --header 'API-KEY: 809415613ed35a2eb0863cb59f603f41803f009b1914aac86f7b3fba3b8e7297'
```

### limit:

```bash
curl --location --request POST 'https://api.valr.com/v1/orders/limit' \
--header 'Content-Type: application/json' \
--header 'API-KEY: abracadabra' \
--data-raw '{
	"side": "SELL",
	"quantity": "0.100000",
	"price": "10000",
	"pair": "BTCZAR",
	"postOnly": true,
	"customerOrderId": "1235"
}'
```
