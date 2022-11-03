import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Clientes from './pages/Clientes';
import Users from './pages/Users';


const App = () => {



  return (
    <BrowserRouter>
      <Sidebar>
        <Routes>
          <Route path="/" element={<Clientes />} />
          <Route path="/clientes" element={<Clientes/>} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Sidebar>
    </BrowserRouter>
  );
};

export default App;
