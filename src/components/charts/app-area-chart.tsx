"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CurveType } from "recharts/types/shape/Curve";
import { Formatter } from "@/types/chars/formatter";
import { formatValue } from "@/lib/chart/formatters";
import { DateRange } from "@/types/chars/date-range";
import { ChartRangeSelector } from "./chat-range-selector";

type Props<T extends Record<string, unknown>> = {
  title: string;
  description?: string;

  chartConfig: ChartConfig;
  chartData: T[];

  xKey: keyof T;

  areas: {
    key: keyof T;
    gradientId: string;
  }[];

  curveType?: CurveType;
  xFormatter?: Formatter;
  tooltipFormatter?: Formatter;

  useTimeRange?: boolean;
  timeRange?: DateRange;
  onTimeRangeChange?: (value: DateRange) => void;
};

export default function AppAreaChart<T extends Record<string, unknown>>({
  title,
  description,
  chartConfig,
  chartData,
  xKey,
  areas,
  curveType,
  xFormatter = "none",
  tooltipFormatter = "none",
  useTimeRange,
  timeRange,
  onTimeRangeChange,
}: Props<T>) {
  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {useTimeRange && (
          <ChartRangeSelector
            value={timeRange ?? "all"}
            onChange={onTimeRangeChange!}
          />
        )}
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              {areas.map((area) => (
                <linearGradient
                  key={String(area.gradientId)}
                  id={area.gradientId}
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={chartConfig[area.key as string]?.color}
                    stopOpacity={0.8}
                  />

                  <stop
                    offset="95%"
                    stopColor={chartConfig[area.key as string]?.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey={String(xKey)}
              tickFormatter={(value) => formatValue(value, xFormatter)}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) =>
                    formatValue(value, tooltipFormatter)
                  }
                />
              }
            />

            {areas.map((area) => (
              <Area
                key={String(area.key)}
                dataKey={String(area.key)}
                type={curveType ?? "natural"}
                stroke={chartConfig[area.key as string]?.color}
                fill={`url(#${area.gradientId})`}
                fillOpacity={0.8}
              />
            ))}

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
