"use client";

import { Radar, PolarAngleAxis, PolarGrid, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type Props = {
  chartConfig: ChartConfig;
  chartData: any;
  title: string;
  description?: string;
};

export default function AppRadarChart({
  chartConfig,
  chartData,
  title,
  description,
}: Props) {
  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="overflow-visible">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] overflow-visible"
        >
          <RadarChart
            data={chartData}
            margin={{
              top: -40,
              bottom: -10,
              left: 0,
              right: 0,
            }}
            outerRadius="70%"
          >
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(_, payload) =>
                    payload[0].payload.title ?? ""
                  }
                />
              }
            />
            <PolarAngleAxis dataKey="game" />
            <PolarGrid />
            <Radar
              dataKey="played"
              fill="var(--color-chart-1)"
              fillOpacity={0.6}
            />
            <Radar
              dataKey="correct"
              fill="var(--color-chart-2)"
              fillOpacity={0.6}
            />
            <Radar
              dataKey="wrong"
              fill="var(--color-chart-3)"
              fillOpacity={0.6}
            />
            <ChartLegend className="mt-8" content={<ChartLegendContent />} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
