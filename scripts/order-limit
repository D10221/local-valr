#!/usr/bin/env sh

curl --location --request POST 'http://localhost:5000/api/orders/limit' \
--header 'Content-Type: application/json' \
--header "API-KEY: $API_KEY" \
--data-raw '{
	"side": "SELL",
	"quantity": "0.100000",
	"price": "10000",
	"currencyPair": "BTCZAR",
	"postOnly": true,
	"customerOrderId": "1235"
}'