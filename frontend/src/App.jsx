import React from 'react';
import { Routes, Route, Router } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import { ProtectedRoute } from './components/ProtectedRoutes';


function App() {
  return (
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        {/* How we'll secure/render different dashboards based on different users/roles */}
        {/* <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<Dashboard />} /> 
        </Route>*/}
      </Routes>
  );
}

export default App;
