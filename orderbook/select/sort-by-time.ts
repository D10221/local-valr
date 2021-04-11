import { sort } from "ramda";
import { Order } from "../types";
/** */
export const sortByTime = (o: Order) => o.createdAt;
/** */
export default sort(sortByTime);
