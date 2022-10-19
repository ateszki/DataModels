import './App.css';
import { observer } from 'mobx-react';

function Component({ model }) {
  console.log('jsx model value:', model.firstColumn)
  return (
    <input
      type="text"
      value={model.firstColumn || ''}
      onChange={e => model.setFirstColumn(e.target.value)}
      placeholder="enter first column name"
    />
  );
}

export default observer(Component);
