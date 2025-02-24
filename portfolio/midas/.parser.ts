import { PdfReader } from "pdfreader";
import fs from "fs";

type MidasJson = {
  date: string;
  balance: string;
  totalPortfolioValue: string;
  summary: {
    stock: string;
    quantity: string;
    price: string;
    profitLoss: string;
    totalValue: string;
  }[];
  transactions: {
    demandDate: string;
    transactionDate: string;
    type: string;
    status: string;
    amount: string;
  }[];
};

function generateDate(pdf: string[]) {
  const index = pdf.indexOf("PORTFÖY ÖZETİ (") + 1;
  const date = pdf[index];

  const [day, month, year] = date.split("/");

  return new Date(Number(`20${year}`), Number(month) - 1, Number(day))
    .toISOString()
    .split("T")[0];
}

function generateBalance(pdf: string[]) {
  const index = pdf.indexOf("Nakit Bakiye") + 1;
  return pdf[index];
}

function generateTotalPortfolioValue(pdf: string[]) {
  const index = pdf.indexOf("Toplam Portföy Değeri") + 1;
  return pdf[index];
}

function generateSummary(pdf: string[]) {
  const COLUMN_COUNT = 5;
  const SKIP_START_INDEX_COUNT = 2 + COLUMN_COUNT;

  const startIndex = pdf.indexOf("PORTFÖY ÖZETİ (") + SKIP_START_INDEX_COUNT;
  const endIndex = pdf.indexOf("*Kar zarar ");

  const summary: {
    stock: string;
    quantity: string;
    price: string;
    profitLoss: string;
    totalValue: string;
  }[] = [];

  for (let i = startIndex; i < endIndex; i += COLUMN_COUNT) {
    const stock = pdf[i];
    const quantity = pdf[i + 1];
    const price = pdf[i + 2];
    const profitLoss = pdf[i + 3];
    const totalValue = pdf[i + 4];

    summary.push({
      stock,
      quantity,
      price,
      profitLoss,
      totalValue,
    });
  }

  return summary;
}

function generateTransactions(pdf: string[]) {
  const COLUMN_COUNT = 6;
  const SKIP_START_INDEX_COUNT = 4 + COLUMN_COUNT;

  const startIndex = pdf.indexOf("HESAP İŞLEMLERİ (") + SKIP_START_INDEX_COUNT;
  const endIndex = pdf.indexOf("TEMETTÜ İŞLEMLERİ (");

  const transactions: {
    demandDate: string;
    transactionDate: string;
    type: string;
    status: string;
    amount: string;
  }[] = [];

  for (let i = startIndex; i < endIndex; i += COLUMN_COUNT) {
    const demandDate = pdf[i];
    const transactionDate = pdf[i + 1];
    const type = pdf[i + 2];
    const status = pdf[i + 4];
    const amount = pdf[i + 5];

    transactions.push({
      demandDate,
      transactionDate,
      type,
      status,
      amount,
    });
  }

  return transactions;
}

async function generateJson(path: string): Promise<MidasJson> {
  let pdf: string[] = [];

  return new Promise((resolve, reject) => {
    new PdfReader().parseFileItems(path, (err, item) => {
      if (err) {
        console.error(err);
        reject(err);
      } else if (!item) {
        const date = generateDate(pdf);
        const balance = generateBalance(pdf);
        const totalPortfolioValue = generateTotalPortfolioValue(pdf);
        const summary = generateSummary(pdf);
        const transactions = generateTransactions(pdf);

        const data = {
          date,
          balance,
          totalPortfolioValue,
          summary,
          transactions,
        };

        fs.writeFileSync(
          `portfolio/midas/json/${date}.json`,
          JSON.stringify(data, null, 2)
        );

        resolve(data);
      } else {
        if (
          item.text &&
          item.text !== ":" &&
          item.text !== " " &&
          item.text !== ")"
        ) {
          pdf.push(item.text);
        }
      }
    });
  });
}

let promises: Promise<MidasJson>[] = [];
fs.readdirSync("portfolio/midas/pdf").forEach(async (file) => {
  if (file.endsWith(".pdf")) {
    console.info(`Started generating JSON for ${file}`);
    promises.push(generateJson(`portfolio/midas/pdf/${file}`));
  }
});

console.info("Started generating all.json");
Promise.all(promises).then((data) => {
  fs.writeFileSync(
    "portfolio/midas/json/.all.json",
    JSON.stringify(data, null, 2)
  );

  console.info("Finished generating all.json");
});
