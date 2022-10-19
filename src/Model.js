import { types } from 'mobx-state-tree';
import { observable, makeObservable } from 'mobx';
import RenameModel from './dataModels';

const { model } = types;

const Model = model({})
  .volatile(() => ({
    dataModel: new RenameModel(),
  }))
  .actions(self => ({
    afterCreate() {
      // makes the "data" attribute in our data model become an observed property
      makeObservable(self.dataModel, {
        data: observable,
      });
    },
    setFirstColumn(column) {
      console.log('setting:', column)
      self.dataModel.setColumn(column, 0);
    },
  }))
  .views(self => ({
    get firstRename() {
      return self.dataModel.rename.length ? self.dataModel.rename[0] : null;
    },
    get firstColumn() {
      console.log('getter:', self.firstRename?.column)
      return self.firstRename?.column;
    },
  }));

export default Model;
