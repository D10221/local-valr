export type CurrencyPair = "BTCZAR" | "ETHZAR" | "XRPZAR";

export type Side = "SELL" | "BUY";

export type TimeInForce = "GTC" | "FOK" | "IOC";

/** Orderbook's Column/row/entry schema */
export type Order = {
  id: string;
  currencyPair: CurrencyPair;
  side: Side;
  quantity: string; // is number
  price: string; // is number
  // postOnly: boolean, // not implemented
  // customerOrderId: string; // is ?
  // timeInForce?: TimeInForce; //not implemented
  requestid: string;
  balance: string;
  createdAt: number;
};

/** Store/Slice/Table Schema */
export type Orderbook = {
  [key: string]: Order;
};
/** Api Request */
export type LimitRequest = {
  requestid: string;
  currencyPair: CurrencyPair;
  quantity: string; // is number
  price: string; // is number
  side: Side;
  // customerOrderId: string; // is ?
};
/** API Response */
export type OrderBookResponse = {
  side: Side;
  quantity: string;
  price: string;
  currencyPair: CurrencyPair;
  orderCount: number;
};
