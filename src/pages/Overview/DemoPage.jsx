import React, { useEffect, useState, useRef } from "react";
import { Chart } from "react-google-charts";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import * as d3 from "d3";
import "./GraphDemoPage.css"; // Custom styles for the page

function GraphDemoPage() {
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];
  const [spendingData, setSpendingData] = useState([
    { category: "Food", value: 300 },
    { category: "Transport", value: 150 },
    { category: "Utilities", value: 100 },
  ]);

  // D3 Chart Component Logic
  const d3Ref = useRef();
  useEffect(() => {
    const svg = d3.select(d3Ref.current);
    svg.selectAll("*").remove(); // Clear previous renders

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal(COLORS);
    const pie = d3.pie().value((d) => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    g.selectAll("path")
      .data(pie(spendingData))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i));
  }, [spendingData]);

  return (
    <div className="GraphDemoPage">
      <h1>Spending Habits Visualization</h1>

      {/* React-Google-Charts */}
      <section>
        <h2>React-Google-Charts</h2>
        <Chart
          chartType="PieChart"
          data={[["Category", "Value"], ...spendingData.map((d) => [d.category, d.value])]}
          options={{ title: "Spending Habits", pieHole: 0.4 }}
          width={"100%"}
          height={"300px"}
        />
      </section>

      {/* Recharts */}
      <section>
        <h2>Recharts</h2>
        <PieChart width={300} height={300}>
          <Pie
            data={spendingData}
            dataKey="value"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {spendingData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </section>

      {/* D3.js */}
      <section>
        <h2>D3.js</h2>
        <svg ref={d3Ref}></svg>
      </section>
    </div>
  );
}

export default GraphDemoPage;
