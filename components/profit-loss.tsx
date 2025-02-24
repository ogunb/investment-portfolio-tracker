"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { usdToNumber } from "@/lib/midas";
import { MidasData } from "@/types/midas";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

type ProfitLossProps = {
  midasData: MidasData;
};
export function ProfitLoss({ midasData }: ProfitLossProps) {
  const chartData = midasData.map((data) => {
    const date = new Intl.DateTimeFormat("tr-TR", {
      month: "short",
      year: "numeric",
    }).format(new Date(data.date));
    const totalProfitLoss = data.summary.reduce((acc, stock) => {
      return acc + usdToNumber(stock.profitLoss);
    }, 0);

    return {
      date,
      profitLoss: totalProfitLoss,
    };
  });

  const chartConfig = {
    profitLoss: {
      label: "Profit/Loss",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit Loss</CardTitle>
        <CardDescription>{chartData.at(-1)?.profitLoss} USD</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              type="natural"
              dataKey="profitLoss"
              stroke="var(--color-profitLoss)"
              strokeWidth={2}
              dot={false}
            ></Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
