import './App.css';
import { observer } from 'mobx-react';
import { useRef } from 'react';
import Model from './Model';
import Component from './Component';

function App() {
  const modelRef = useRef(Model.create());

  return (
    <div className="App">
      <Component model={modelRef.current} />
    </div>
  );
}

export default observer(App);
