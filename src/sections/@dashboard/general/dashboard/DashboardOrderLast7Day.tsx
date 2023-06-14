import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Box, Card, CardHeader, CardProps } from '@mui/material';
// components
import { BaseOptionChart } from '../../../../components/chart';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chartLabels: string[];
  chartData: {
    data: {
      name: string;
      data: number[];
    }[];
  }[];
}

export default function DashboardOrderLast7Day({
  title,
  subheader,
  chartLabels,
  chartData,
  ...other
}: Props) {
  const chartOptions = merge(BaseOptionChart(), {
    fill: { type: chartData.map((i) => i.data) },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: chartLabels,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      {chartData.map((item, index) => (
        <Box key={index} dir="ltr">
          <ReactApexChart type="bar" series={item.data} options={chartOptions} />
        </Box>
      ))}
    </Card>
  );
}
