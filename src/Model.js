import { getSnapshot, types } from 'mobx-state-tree';
import _ from 'lodash';

const { array, model, compose, string, optional, union, undefined: undef } = types;

// replicates the base transform model we have in the app
const BaseTransformModel = model('transformationPipeline', {
  type: string,
  associatedTransform: optional(union(string, undef), undefined), // useful if you need to tie a specific transform to another transform
})
  .volatile(() => ({
    key: _.uniqueId(),
  }));

// replicates the mst model we have in the app, minus all the extra methods we shouldn't need anymore
const RenameModel = model({
  type: optional(string, 'rename'),
  rename: optional(array(model('Rename', {
    column: optional(string, ''),
    name: optional(string, ''),
  })), []),
});

// replicates how the rename model is exported in the app
const UsedModel = compose(BaseTransformModel, RenameModel)
  .preProcessSnapshot(snapshot => {
    if (_.isNil(snapshot.rename)) {
      return {
        ...snapshot,
        rename: [],
      };
    }
    return snapshot;
  })
  .named('RenameModel');

// simulates a vc for the general view adding multiple transforms
const FakeVC = model({
  renames: optional(array(UsedModel), []),
})
  .actions(self => ({
    afterCreate() {
      self.addRenameModel();
    },
    addRenameModel() {
      self.renames.push(UsedModel.create({
        type: 'rename',
        rename: [{
          column: 'blah' + _.uniqueId(), // setting with an initial value to test the snapshot mount flow
        }],
      }))
    },
    logSnapshot() {
      console.log(getSnapshot(self.renames));
    }
  }));

export default FakeVC;
