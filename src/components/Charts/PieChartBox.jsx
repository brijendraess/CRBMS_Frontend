import { Paper, styled } from "@mui/material";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
} from "recharts";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: "300px",
  width: "100%",
  lineHeight: "60px",
  borderRadius: "20px",
  padding: "15px",
}));

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
  { name: "Group E", value: 278 },
  { name: "Group F", value: 189 },
];

const PieChartBox = () => {
  const [elevation, setElevation] = useState(2);

  return (
    <div className="areaChartBox">
      <Item
        elevation={elevation}
        onMouseEnter={() => setElevation(24)}
        onMouseLeave={() => setElevation(6)}
        // style={{
        //   backgroundImage: `linear-gradient(to right, ${color[0]}, ${color[1]})`,
        // }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            />
            <Tooltip
              contentStyle={{ background: "#2e3447", borderRadius: "5px" }}
              labelStyle={{ display: "none" }}
              cursor={{ fill: "none" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Item>
    </div>
  );
};

export default PieChartBox;
