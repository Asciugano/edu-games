"use client";

import { useState, useTransition } from "react";

import AppAreaChart from "@/components/charts/app-area-chart";
import { ChartConfig } from "@/components/ui/chart";

import { DateRange } from "@/types/chars/date-range";
import { getUsersChart } from "@/actions/user";

interface Props {
  initialUsersChart: {
    date: string;
    users: number;
  }[];
}

const usersChartConfig = {
  users: {
    label: "Nuovi utenti",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function AdminUserChart({ initialUsersChart }: Props) {
  const [range, setRange] = useState<DateRange>("30d");
  const [chartData, setChartData] = useState(initialUsersChart);

  const [, startTransition] = useTransition();

  async function handleRangeChange(newRange: DateRange) {
    setRange(newRange);

    startTransition(async () => {
      const data = await getUsersChart(newRange);

      setChartData(data);
    });
  }

  return (
    <AppAreaChart
      title="Nuovi utenti"
      description="Registrazioni utenti"
      chartConfig={usersChartConfig}
      chartData={chartData}
      xKey="date"
      areas={[
        {
          key: "users",
          gradientId: "fillUsers",
        },
      ]}
      timeRange={range}
      onTimeRangeChange={handleRangeChange}
      useTimeRange
      xFormatter="date"
      tooltipFormatter="date"
    />
  );
}
