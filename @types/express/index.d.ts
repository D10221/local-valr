import "express-serve-static-core";
import type { Store } from "@reduxjs/toolkit";
import type { State } from "../../src/state";

declare module "express-serve-static-core" {
  /** */
  export interface Request {
    store: Store<State>;
  }
}
