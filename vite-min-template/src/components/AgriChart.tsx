import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { AgriData } from '../types/agri';
import { useMantineColorScheme } from '@mantine/core';

interface AgriChartProps {
  data: AgriData[];
}

export function AgriChart({ data }: AgriChartProps): React.JSX.Element {
  const chartRef = useRef<HTMLDivElement>(null);
  const { colorScheme } = useMantineColorScheme()
  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);

      // Aggregate data to calculate average production per crop
      const cropProduction: { [crop: string]: { total: number; count: number } } = {};
      data.forEach((item) => {
        const cropName = item['Crop Name'];
        const production = parseFloat(String(item['Crop Production (UOM:t(Tonnes))'] || '0.00'));

        if (!isNaN(production)) {
          if (!cropProduction[cropName]) {
            cropProduction[cropName] = { total: 0, count: 0 };
          }
          cropProduction[cropName].total += production;
          cropProduction[cropName].count += 1;
        }
      });

      // Prepare data for ECharts
      const cropNames = Object.keys(cropProduction);
      const averageProductions = cropNames.map(
        (crop) => cropProduction[crop].total / cropProduction[crop].count
      );

      const isDark = colorScheme === 'dark';

      const options: echarts.EChartsOption = {
        backgroundColor: isDark ? '#222' : '#fff',
        textStyle: {
          color: isDark ? '#fff' : '#000',
        },
        title: {
          text: 'Average Crop Production',
          left: 'center',
          textStyle: {
            color: isDark ? '#fff' : '#000',
          },
        },
        xAxis: {
          type: 'category',
          data: cropNames,
          axisLabel: {
            rotate: 35, // Rotate labels for better readability
            interval: 0, // Display all labels
            color: isDark ? '#fff' : '#000',
          },
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: 'value',
          name: 'Average Production (Tonnes)',
          nameTextStyle: {
            color: isDark ? '#fff' : '#000',
          },
          axisLabel: {
            color: isDark ? '#fff' : '#000',
          },
        },
        series: [
          {
            data: averageProductions,
            type: 'bar',
          },
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: (params: any) => {
            return `Crop: ${params[0].name}<br/>Average Production: ${params[0].value.toFixed(2)} Tonnes`;
          },
        },
        // visualMap: {
        //   min: Math.min(...averageProductions),
        //   max: Math.max(...averageProductions),
        //   calculable: true,
        //   orient: 'horizontal',
        //   left: 'center',
        //   bottom: '15%',
        // },
      };

      chart.setOption(options);

      return () => {
        chart.dispose();
      };
    }
  }, [data, colorScheme]);

  return <div ref={chartRef} style={{ width: '100%', height: '500px', marginTop: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '20px', backgroundColor: colorScheme === 'dark' ? '#333' : '#fff' }} />;
}
