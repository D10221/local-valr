#!/usr/bin/env sh

# help: https://docs.valr.com/#5beb7328-24ca-4d8a-84f2-6029725ad923

curl --location --request POST 'https://api.valr.com/v1/orders/limit' \
--header 'Content-Type: application/json' \
--header 'X-VALR-API-KEY: yourApiKey' \
--header 'X-VALR-SIGNATURE: b10d9ee0347d84be33e958693a554355e66333152231ccdd2cf240a22f5d4a16' \
--header 'X-VALR-TIMESTAMP: 1560007630778' \
--data-raw '{
	"side": "SELL",
	"quantity": "0.100000",
	"price": "10000",
	"pair": "BTCZAR",
	"postOnly": true,
	"customerOrderId": "1235"
}'