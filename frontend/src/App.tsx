import React from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import BetPanel from './components/betpanel';
import { Mumbai, DAppProvider } from '@usedapp/core';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const config = {
  readOnlyChainId: Mumbai.chainId,
  readOnlyUrls: {
    [Mumbai.chainId]: `https://rpc-mumbai.maticvigil.com/`,
  },
};

function App() {
  return (
    <DAppProvider config={config}>
      <Header />
      <BetPanel />
      <Footer />
      <ToastContainer />
    </DAppProvider>
  );
}

export default App;
