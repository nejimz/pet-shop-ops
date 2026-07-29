"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type ReportChartsData = {
  revenueByDay: Array<{ date: string; revenue: number; count: number }>;
  byPaymentMethod: Array<{ paymentMethod: string; revenue: number; count: number }>;
  byStatus: Array<{ status: string; count: number }>;
};

const BRAND = {
  primary: "#245a42",
  mid: "#3d7a5c",
  soft: "#6a9a84",
  pale: "#9fc0b0",
  warn: "#b45309",
  muted: "#5f7268",
};

const PAYMENT_COLORS: Record<string, string> = {
  CASH: BRAND.primary,
  CARD: BRAND.mid,
  OTHER: BRAND.soft,
};

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: BRAND.primary,
  VOIDED: BRAND.warn,
};

function ChartEmpty({ message }: { message: string }) {
  return (
    <div className="flex h-56 items-center justify-center text-sm text-neutral-500">
      {message}
    </div>
  );
}

export function ReportCharts({
  charts,
  loading,
  formatMoney,
}: {
  charts?: ReportChartsData | null;
  loading?: boolean;
  formatMoney: (value: number | string) => string;
}) {
  if (loading && !charts) {
    return (
      <div className="grid gap-4 lg:grid-cols-3">
        {["Revenue over time", "Payment mix", "Status mix"].map((title) => (
          <div key={title} className="card p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
              {title}
            </p>
            <ChartEmpty message="Loading chart…" />
          </div>
        ))}
      </div>
    );
  }

  const revenueByDay = charts?.revenueByDay ?? [];
  const byPaymentMethod = charts?.byPaymentMethod ?? [];
  const byStatus = charts?.byStatus ?? [];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="card p-5 lg:col-span-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
          Revenue over time
        </p>
        <p className="mt-1 text-sm text-neutral-600">Completed sales by day</p>
        {revenueByDay.length === 0 ? (
          <ChartEmpty message="No revenue in this range." />
        ) : (
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByDay} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={BRAND.mid} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={BRAND.mid} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#dceee6" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: BRAND.muted, fontSize: 11 }}
                  tickMargin={8}
                  minTickGap={28}
                />
                <YAxis
                  tick={{ fill: BRAND.muted, fontSize: 11 }}
                  tickFormatter={(v) => formatMoney(v)}
                  width={64}
                />
                <Tooltip
                  formatter={(value: number) => [formatMoney(value), "Revenue"]}
                  labelFormatter={(label) => String(label)}
                  contentStyle={{
                    borderRadius: 12,
                    borderColor: "#dceee6",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={BRAND.primary}
                  strokeWidth={2}
                  fill="url(#revenueFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="card p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
          Payment mix
        </p>
        <p className="mt-1 text-sm text-neutral-600">Revenue by method</p>
        {byPaymentMethod.length === 0 ? (
          <ChartEmpty message="No payment data." />
        ) : (
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byPaymentMethod}
                  dataKey="revenue"
                  nameKey="paymentMethod"
                  innerRadius={48}
                  outerRadius={78}
                  paddingAngle={2}
                >
                  {byPaymentMethod.map((entry) => (
                    <Cell
                      key={entry.paymentMethod}
                      fill={PAYMENT_COLORS[entry.paymentMethod] || BRAND.pale}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, _name, item) => [
                    formatMoney(value),
                    item?.payload?.paymentMethod ?? "Payment",
                  ]}
                  contentStyle={{
                    borderRadius: 12,
                    borderColor: "#dceee6",
                    fontSize: 12,
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={28}
                  formatter={(value) => (
                    <span className="text-xs text-neutral-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="card p-5 lg:col-span-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
          Status mix
        </p>
        <p className="mt-1 text-sm text-neutral-600">Completed vs voided count</p>
        {byStatus.length === 0 ? (
          <ChartEmpty message="No status data." />
        ) : (
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byStatus} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dceee6" vertical={false} />
                <XAxis dataKey="status" tick={{ fill: BRAND.muted, fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: BRAND.muted, fontSize: 11 }} width={40} />
                <Tooltip
                  formatter={(value: number) => [value, "Count"]}
                  contentStyle={{
                    borderRadius: 12,
                    borderColor: "#dceee6",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={64}>
                  {byStatus.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || BRAND.soft} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
