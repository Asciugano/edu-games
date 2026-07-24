"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Formatter } from "@/types/chars/formatter";
import { formatValue } from "@/lib/chart/formatters";

export const description = "A multiple bar chart";

interface Props<T extends Record<string, unknown>> {
  title: string;
  description?: string;

  chartConfig: ChartConfig;
  chartData: T[];

  xKey: keyof T;

  bars: {
    key: keyof T;
    radius?: number;
  }[];

  xFormatter?: Formatter;
  tooltipFormatter?: Formatter;

  children?: React.ReactNode;
}

export function AppBarChart<T extends Record<string, unknown>>({
  title,
  description,

  chartConfig,
  chartData,

  xKey,

  bars,

  xFormatter,
  tooltipFormatter,

  children,
}: Props<T>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xKey as string}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => formatValue(value, xFormatter)}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dashed"
                  labelFormatter={(value) =>
                    formatValue(value, tooltipFormatter)
                  }
                />
              }
            />
            {bars.map((bar) => (
              <Bar
                key={bar.key as string}
                dataKey={bar.key as string}
                fill={chartConfig[bar.key as string].color}
                radius={bar.radius ?? 4}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
      {children && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {children}
        </CardFooter>
      )}
    </Card>
  );
}
