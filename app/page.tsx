import { ProfitLoss } from "@/components/profit-loss";
import { TotalPortfolioValue } from "@/components/total-portfolio-value";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllMidasData, usdToNumber } from "@/lib/midas";
import { MidasData, MidasSummary } from "@/types/midas";

type StockListProps = {
  summary: MidasSummary;
};
function StockList({ summary }: StockListProps) {
  const total = summary
    .reduce((acc, stock) => {
      return acc + usdToNumber(stock.totalValue);
    }, 0)
    .toFixed(2);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stocks</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stock</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Profit - Loss</TableHead>
              <TableHead className="text-right">Total Value</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {summary.map((stock) => (
              <TableRow key={stock.stock}>
                <TableCell className="font-medium">{stock.stock} </TableCell>
                <TableCell>{stock.quantity}</TableCell>
                <TableCell className="text-right">{stock.price}</TableCell>
                <TableCell className="text-right">{stock.profitLoss}</TableCell>
                <TableCell className="text-right">{stock.totalValue}</TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total</TableCell>
              <TableCell className="text-right">{total} USD</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const midasData = getAllMidasData();

  const latestMidasData = midasData.at(-1);

  if (!latestMidasData) {
    return <div>No data found.</div>;
  }

  const totalInvested = midasData
    .reduce(
      (acc, data) =>
        acc +
        data.transactions.reduce((acc, transaction) => {
          if (transaction.type === "Döviz Alış") {
            return acc + usdToNumber(transaction.amount);
          }

          return acc;
        }, 0),
      0
    )
    .toFixed(2);

  const totalWithdrawn = midasData
    .reduce(
      (acc, data) =>
        acc +
        data.transactions.reduce((acc, transaction) => {
          if (transaction.type === "Döviz Satış") {
            return acc + usdToNumber(transaction.amount);
          }

          return acc;
        }, 0),
      0
    )
    .toFixed(2);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Invested</CardTitle>
            <CardDescription>{totalInvested} USD</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Withdrawn</CardTitle>
            <CardDescription>{totalWithdrawn} USD</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ProfitLoss midasData={midasData} />
        <TotalPortfolioValue midasData={midasData} />
      </div>

      <StockList summary={latestMidasData?.summary} />
    </div>
  );
}
