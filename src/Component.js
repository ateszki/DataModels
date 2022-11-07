import './App.css';
import { observer } from 'mobx-react';

function Component({ model }) {
  console.log('jsx model value:', model.firstColumn)
  return (
    <input
      type="number"
      value={model.firstColumn || ''}
      onChange={e => model.setFirstColumn(parseInt(e.target.value))}
      placeholder="enter first column name"
    />
  );
}

export default observer(Component);
