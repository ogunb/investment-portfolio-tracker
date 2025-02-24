import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllMidasData } from "@/lib/midas";
import { MidasSummary } from "@/types/midas";

type StockListProps = {
  summary: MidasSummary;
};
function StockList({ summary }: StockListProps) {
  const total = summary
    .reduce((acc, stock) => {
      return (
        acc + Number(stock.totalValue.replace(" USD", "").replace(",", "."))
      );
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

  return (
    <div>
      {latestMidasData ? (
        <StockList summary={latestMidasData?.summary} />
      ) : null}
    </div>
  );
}
