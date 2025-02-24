import allJson from "@/portfolio/midas/json/.all.json";

export const getAllMidasData = () => {
  return allJson.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
};

export const usdToNumber = (usd: string) => {
  return Number(usd.replace(" USD", "").replace(",", "."));
}
