import { atom } from "recoil";

export const selectedTabState = atom({
  key: "selectedTabState",
  default: "Purchase Request",
});
