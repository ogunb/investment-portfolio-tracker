import type allJson from "@/portfolio/midas/json/.all.json";

export type MidasData = typeof allJson;
export type MidasSummary = MidasData[number]["summary"];
