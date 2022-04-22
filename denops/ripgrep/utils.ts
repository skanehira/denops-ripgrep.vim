import { Denops } from "./deps.ts";

export type QFList = {
  filename: string;
  lnum: number;
  col: number;
  text: string;
};

export async function addloclist(denops: Denops, qflist: QFList[]) {
  await denops.call("setloclist", 0, qflist, "a");
}

export async function clearloclist(denops: Denops) {
  await denops.call("setloclist", 0, [], "r");
}
