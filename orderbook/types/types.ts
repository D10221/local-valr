export type CurrencyPair = "BTCZAR" | "ETHZAR" | "XRPZAR";

export type Side = "SELL" | "BUY";

export type TimeInForce = "GTC" | "FOK" | "IOC";

/** Orderbook's Column/row/entry schema */
export type Order = {
  id: string;
  currencyPair: CurrencyPair;
  side: Side;
  quantity: number; // is number
  price: number; // is number
  // postOnly: boolean, // not implemented
  // customerOrderId: string; // is ?
  // timeInForce?: TimeInForce; //not implemented
  balance: number;
  createdAt: number;
};

/** Store/Slice/Table Schema */
export type Orderbook = {
  [key: string]: Order;
};
/** Api Request */
export type LimitRequest = {
  currencyPair: CurrencyPair;
  quantity: number; // is number
  price: number; // is number
  side: Side;
  // customerOrderId: string; // is ?
};
/** API Response */
export type OrderBookResponse = {
  side: Side;
  quantity: number;
  price: number;
  currencyPair: CurrencyPair;
  orderCount: number;
};
