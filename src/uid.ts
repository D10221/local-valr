import { randomBytes } from "crypto";
/** cheap UID */
export default function uid() {
  return randomBytes(8).toString("hex");
}
