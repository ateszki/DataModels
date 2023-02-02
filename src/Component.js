import { useRef } from 'react';
import './App.css';
import { observer } from 'mobx-react';
import Rename from './dataModels';
import { applySnapshot, getSnapshot } from 'mobx-state-tree';
import _ from 'lodash';

function useModelConnector(mstModelInstance, dataModelClass) {
  const onDataChanged = (model, oldData, newData) => {
    applySnapshot(mstModelInstance, newData);
  };

  // create the core model based on the initial data from the mstModel
  const coreModelRef = useRef(new Rename(
    getSnapshot(mstModelInstance),
    { dataChanged: onDataChanged }
  ));
  const coreModel = coreModelRef.current;

  return coreModel;
}

function View({ model: vc }) {
  return (
    <>
      {vc.renames.map((renameModel, i) => (
        <Transform key={renameModel.key} mstModel={renameModel} index={i} />
      ))}
      <br />
      <button onClick={vc.addRenameModel}>add transform</button>
      <button onClick={vc.logSnapshot}>console.log snapshot</button>
    </>
  );
}

// this current example does all interactions through the core model, but rendering
// is still synced and rendered through the mst model (via observer)
const Transform = observer(({ mstModel, index }) => {
  const coreModel = useModelConnector(mstModel, Rename);

  const addRename = () => {
    const column = 'blah' + _.uniqueId();
    coreModel.addRename({ column, name: '' });
  };

  const removeRename = (index) => {
    coreModel.removeRenameByIndex(index);
  };

  const setColumnName = (index, value) => {
    coreModel.setRenameByIndex(index, value);
  };

  return (
    <div className="transform">
      {coreModel.rename.map((rename, i) => (
        <div key={i} className="renameItem">
          {`Column: ${rename.column}`}
          <input
            type="text"
            value={rename.name}
            onChange={e => setColumnName(i, e.target.value)}
            placeholder="column name"
          />
          <button onClick={() => removeRename(i)}>X</button>
        </div>
      ))}
      <button onClick={addRename}>add rename</button>
    </div>
  );
});

export default observer(View);
