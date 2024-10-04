import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import '../../CSS Files/Dashboard Components/MainPieChart.css';
import SubPieChart from './SubPieChart.jsx';

const data = [
  { name: 'Category 1', value: 400 },
  { name: 'Category 2', value: 300 },
  { name: 'Other', value: 300 },
];

const colors = ['#8884d8', '#82ca9d', '#8dd1e1'];

const MainPieChart = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [chartSize, setChartSize] = useState({ width: 400, height: 400 });
  const containerRef = useRef(null);

  useEffect(() => {
    // Function to update chart dimensions based on container size
    const updateChartSize = () => {
      if (containerRef.current) {
        const { offsetWidth } = containerRef.current;
        const newSize = Math.min(Math.max(offsetWidth, 200), 350); // Bound width between 220 and 450
        setChartSize({ width: newSize, height: newSize }); // Set width and height equally
      }
    };

    updateChartSize(); // Initial size setting
    window.addEventListener('resize', updateChartSize); // Handle window resize

    return () => {
      window.removeEventListener('resize', updateChartSize);
    };
  }, []);

  const handleClick = (data) => {
    setSelectedCategory(data.name);
  };

  return (
    <div className="chart-container" ref={containerRef}> {/* Container ref */}
      {!selectedCategory ? (
        <PieChart width={chartSize.width} height={chartSize.height}>
          <Pie
            data={data}
            cx="50%" // Center horizontally
            cy="50%" // Center vertically
            labelLine={false}
            outerRadius={Math.min(chartSize.width, chartSize.height) / 2.5}
            fill="#8884d8"
            dataKey="value"
            onClick={(e) => handleClick(e)}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      ) : (
        <SubPieChart
          category={selectedCategory}
          onBack={() => setSelectedCategory(null)}
        />
      )}
    </div>
  );
};

export default MainPieChart;
