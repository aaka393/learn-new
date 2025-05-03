import Three from './components/Three';
import { ThemeProvider } from './context/ThemeContext';

const App = () => {

  return (
    <ThemeProvider>
      <Three />
    </ThemeProvider>
  );
};

export default App;
