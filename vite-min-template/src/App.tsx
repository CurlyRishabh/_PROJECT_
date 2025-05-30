import "@mantine/core/styles.css";
import { MantineProvider, Container, Button, useMantineColorScheme, AppShell, Box, Title, useMantineTheme } from "@mantine/core";
import { AgriTable } from './components/AgriTable';
import { AgriChart } from './components/AgriChart';
import rawAgriData from './data/agri.json';
import { AgriData } from './types/agri';
import "@mantine/core/styles.css";

const agriData: AgriData[] = rawAgriData.map(item => ({
  Country: item.Country,
  Year: item.Year,
  'Crop Name': item['Crop Name'],
  'Crop Production (UOM:t(Tonnes))': parseFloat(String(item['Crop Production (UOM:t(Tonnes))'] || '0')),
  'Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))': parseFloat(String(item['Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))'] || '0')),
  'Area Under Cultivation (UOM:Ha(Hectares))': parseFloat(String(item['Area Under Cultivation (UOM:Ha(Hectares))'] || '0')),
}));



function App() {
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };
  console.log("in app", colorScheme)
  return (
    <AppShell>
      <AppShell.Header>
        <div
          style={{
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1rem',
          }}
        >
          <h1>Agricultural Data</h1>
          <Button onClick={toggleColorScheme}>
            Toggle {colorScheme === 'dark' ? 'Light' : 'Dark'} Mode
          </Button>
        </div>
      </AppShell.Header>
      <AppShell.Main>
        <Container style={{ padding: '4rem 0' }}>
          <Title order={1}>Agricultural Data Chart</Title>
          <Box style={{ overflowX: 'auto', marginBottom: '5vh' }}>
            <AgriChart data={agriData} />
          </Box>
          <Title order={1}>Agricultural Data Table</Title>
          <Box style={{ height: '70vh', overflowY: 'auto' }}>
            <AgriTable data={agriData} />
          </Box>
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}

export default App;