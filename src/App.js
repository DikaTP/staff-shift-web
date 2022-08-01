import React, { Fragment } from 'react';
import {
  Routes,
  Route,
} from "react-router-dom";
import { ShiftProvider } from './contexts/ShiftContext';

import { Dashboard } from './pages/Dashboard';
import { ShiftList } from './pages/ShiftList';

function App() {
  return (
    <Fragment>
        <ShiftProvider>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/shifts" element={<ShiftList />} />
          </Routes>
        </ShiftProvider>
    </Fragment>
  );
}

export default App;
