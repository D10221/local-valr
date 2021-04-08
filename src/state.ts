export type CurrencyPair = "BTCZAR" | "ETHZAR" | "XRPZAR";

export type Side = "SELL" | "BUY";

export type TimeInForce = "GTC" | "FOK" | "IOC";

export type Order = {
  id: string;
  currencyPair: CurrencyPair;
  side: Side;
  quantity: string; // is number
  price: string; // is number
  // postOnly: boolean, // not implemented
  customerOrderId: string; // is ?
  timeInForce?: TimeInForce;
};

export type OrderBook = {
  side: Side;
  quantity: string;
  price: string;
  currencyPair: CurrencyPair;
  orderCount: number;
};

export type Orders = {
  [key: string]: Order;
};

export type LimitRequest = {
  currencyPair: CurrencyPair;
  customerOrderId: string; // is ?
  quantity: string; // is number
  price: string; // is number
  pair: CurrencyPair; //
  side: Side;
  // postOnly: boolean, NOT implemented!
  // timeInForce?: TimeInForce // Not Implemented
};

export type TradeHistoryRecord = {
  orderid: string;
  tradedAt: string; // Date
};

export type TradeHistory = {
  [key: string]: TradeHistoryRecord;
};

export type State = { orders: Orders; tradeHistory: TradeHistory };

const state: State = { orders: {}, tradeHistory: {} };

export default state;
