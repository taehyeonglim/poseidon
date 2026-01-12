import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Harbor from './pages/Harbor';
import Compass from './pages/Compass';
import Logbook from './pages/Logbook';
import BriefingRoom from './pages/BriefingRoom';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Harbor />} />
            <Route path="/search" element={<Compass />} />
            <Route path="/journal/:id" element={<Logbook />} />
            <Route path="/brief/:id" element={<BriefingRoom />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
