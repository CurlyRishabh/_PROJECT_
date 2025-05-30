import React from 'react';
import {
  Table,
  Text,
  ScrollArea,
  useMantineTheme,
  useMantineColorScheme,
} from '@mantine/core';
import { AgriData, TableData, AgriTableProps } from '../types/agri';

function processData(data: AgriData[]): TableData[] {
  const yearlyData: { [year: string]: { crop: string; production: number }[] } = {};

  data.forEach((item) => {
    const year = item.Year;
    const production = parseFloat(String(item['Crop Production (UOM:t(Tonnes))'] || '0')); // Handle empty strings

    if (!yearlyData[year]) {
      yearlyData[year] = [];
    }

    yearlyData[year].push({ crop: item['Crop Name'], production });
  });

  const tableData: TableData[] = Object.entries(yearlyData).map(([year, crops]) => {
    const validCrops = crops.filter(crop => !isNaN(crop.production)); // Filter out crops with invalid production values
    if (validCrops.length === 0) {
      return { year: year, maxCrop: 'No data', minCrop: 'No data' };
    }
    const maxCrop = validCrops.reduce((prev, current) => (prev.production > current.production) ? prev : current);
    const minCrop = validCrops.reduce((prev, current) => (prev.production < current.production) ? prev : current);

    return {
      year: year,
      maxCrop: `${maxCrop.crop} (${maxCrop.production.toFixed(2)})`,
      minCrop: `${minCrop.crop} (${minCrop.production.toFixed(2)})`,
    };
  });

  return tableData;
}

export function AgriTable({ data }: AgriTableProps): React.JSX.Element {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme()
  console.log("in table", colorScheme)
  const processed = processData(data);

  const isDark = colorScheme === 'dark';

  const rows = processed.map((element, index) => (
    <Table.Tr
      key={element.year}
      style={{
        backgroundColor:
          index % 2 === 0
            ? isDark
              ? theme.colors.dark[7]
              : theme.colors.gray[1]
            : isDark
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
      }}
    >
      <Table.Td><Text style={{ color: isDark ? theme.colors.gray[0] : theme.colors.dark[6] }}>{element.year}</Text></Table.Td>
      <Table.Td><Text style={{ color: isDark ? theme.colors.gray[0] : theme.colors.dark[6] }}>{element.maxCrop}</Text></Table.Td>
      <Table.Td><Text style={{ color: isDark ? theme.colors.gray[0] : theme.colors.dark[6] }}>{element.minCrop}</Text></Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <Table horizontalSpacing="xl" verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th><Text fw={500} style={{ color: isDark ? theme.colors.gray[0] : theme.colors.dark[6] }}>Year</Text></Table.Th>
            <Table.Th><Text fw={500} style={{ color: isDark ? theme.colors.gray[0] : theme.colors.dark[6] }}>Crop with Maximum Production</Text></Table.Th>
            <Table.Th><Text fw={500} style={{ color: isDark ? theme.colors.gray[0] : theme.colors.dark[6] }}>Crop with Minimum Production</Text></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
}