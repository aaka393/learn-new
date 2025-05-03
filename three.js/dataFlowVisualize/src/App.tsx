import { ThemeProvider } from './context/ThemeContext';
import DataVisualize from './components/dataFlowVisualize/DataVisualize';
import UnitDemo from './components/UnitDemo';

const App = () => {

  return (
    <ThemeProvider>
      <DataVisualize />
      {/* <UnitDemo />  */}
    </ThemeProvider>
  );
};

export default App;
