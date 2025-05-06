import { ThemeProvider } from './context/ThemeContext';
import DataVisualize from './components/dataFlowVisualize/DataVisualize';
import UnitDemo from './components/UnitDemo';
import LunarFishing from './components/sticky-men/LunarFishing';

const App = () => {

  return (
    <ThemeProvider>
      {/* <DataVisualize /> */}
      {/* <UnitDemo />  */}
      <LunarFishing />
    </ThemeProvider>
  );
};

export default App;
