const _ = require('lodash');

class BaseModel {
  _data = null;
  _listeners = {
    dataChanged: (modelInstance, oldData, newData) => {},
  };

  /* Each class extending BaseModel will need to have the following fields:
   * _defaults = null;
   * _validator = null;
  */

  constructor(data = {}, listeners = {}) {
    this._initialData = data;
    this._listeners = listeners || {};

    // inheriting class should call this._init in its constructor (it can't be here because of js inheritance order of operations)
  }

  _init() {
    const { _defaults, _validator } = this.constructor;
    /* validate specific required properties for the model inheriting this to be present */
    if (!_validator) {
      throw new Error('Yo dev! You forgot to associate the schema to this model');
    }
    if (_.isUndefined(this.checkIsValid)) {
      throw new Error('Yo dev! You need to define the checkIsValid(strict) method for this model');
    }
    
    /* load and validate the data */
    if (_defaults) {
      _.defaultsDeep(this._initialData, _defaults);
    }
    this._validate(this._initialData);
  }

  _validate(newData) {
    const { _validator } = this.constructor;
    const oldData = this._snapshot();
    const cloned = _.cloneDeep(newData); // because validate might modify the object
    const isValid = _validator(cloned);
    if (!isValid) {
      throw new Error(JSON.stringify(_validator.errors));
    }
    this._data = cloned;

    this._listeners.dataChanged?.(this, oldData, newData);
  }

  _snapshot() {
    return _.cloneDeep(this._data);
  }

  /*
    Strict snapshot with full validation so the output is database worthy to save
  */
  getDBReadySnapshot() {
    this.checkIsValid(true);
    return this._snapshot();
  }

  /*
    Loose snapshot that gets current state, but some fields might not be valid so the user can actively edit them
  */
  getLooseSnapshot() {
    this.checkIsValid(false);
    return this._snapshot();
  }
}

module.exports = { BaseModel };
