import { Paper, styled } from "@mui/material";
import React, { useState } from "react";
import { BarChart, Bar, ResponsiveContainer, Tooltip } from "recharts";

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
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const BarChartBox = ({ color }) => {
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
        <ResponsiveContainer width="99%" height="100%">
          <BarChart data={data}>
            <Tooltip
              contentStyle={{ background: "#2e3447", borderRadius: "5px" }}
              labelStyle={{ display: "none" }}
              cursor={{ fill: "none" }}
            />
            <Bar dataKey="uv" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Item>
    </div>
  );
};

export default BarChartBox;
