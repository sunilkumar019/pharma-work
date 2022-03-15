import React, { Component } from 'react';
import './scss/style.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './styles.css'
import Routes from './routes/index';

class App extends Component {
 
  render() {
    return <Routes />
  }
}

export default App;
