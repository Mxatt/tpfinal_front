
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type LineConfig = {
  dataKey: string; 
  name: string; 
  color: string; 
};

type ReusableChartProps = {
  data: any[]; 
  lines: LineConfig[]; 
  yAxisFormatter?: (value: any) => string; 
  tooltipFormatter?: (value: any) => string; 
};

function ReusableChart({
  data,
  lines,
  yAxisFormatter,
  tooltipFormatter,
}: ReusableChartProps) {
  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 30,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="name" stroke="#666" fontSize={12} />
        <YAxis
          stroke="#666"
          fontSize={12}
          tickFormatter={yAxisFormatter}
          width={90} 
        />
        <Tooltip formatter={tooltipFormatter} />
        <Legend />

        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={2}
            activeDot={{ r: 8 }}
            dot={false} 
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default ReusableChart;
