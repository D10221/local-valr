import { Orders, TradeHistory } from "./types";

export type State = { orders: Orders; tradeHistory: TradeHistory };

const state: State = { orders: {}, tradeHistory: {} };

export default state;
