import { Routes, Route } from 'react-router-dom';

import { Home } from './web';
import { Navbar } from '../components';
import { AdminRouter } from './admin';

export const Router = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Admin routes */}
        <Route path="admin/*" element={<AdminRouter />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  )
}
