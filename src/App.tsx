import React from 'react';
import { BrowserRouter } from 'react-router-dom'

import GlobolStyle from './styles/globol'
import Routes from './routes'

import AppProvider from './context/index'

const App: React.FC = () => {

  return (
  	<BrowserRouter>
      <AppProvider>
        <Routes />
      </AppProvider>
	    <GlobolStyle />
    </BrowserRouter>
  )
}

export default App;
