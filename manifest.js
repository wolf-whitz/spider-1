import { Spider } from "./types";
import spiderMTO from "./spider-bato.json";
import spiderHentai20 from "./spider-hentai20.json";

export const crawlers: Spider[] = [
  spiderMTO.spider,
  spiderHentai20.spider
];
