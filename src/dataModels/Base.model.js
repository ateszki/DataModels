const _ = require('lodash');

class BaseModel {
  _data = null;
  /* Each class extending BaseModel will need to have the following fields:
   * _defaults = null;
   * _validator = null;
  */

  constructor(data = {}) {
    const { _defaults, _validator } = this.constructor;
    /* validate specific required properties for the model inheriting this to be present */
    if (!_validator) {
      throw new Error('Yo dev! You forgot to associate the schema to this model');
    }
    if (_.isUndefined(this.checkIsValid)) {
      throw new Error('Yo dev! You need to define the isValid method for this model');
    }
    
    /* load and validate the data */
    if (_defaults) {
      _.defaultsDeep(data, _defaults);
    }
    
    this._validate(data);

    const self = this;

    const _handler = {
      get(target, key) {
        console.log('data getter', target, key, target[key])
        if (_.isObject(target[key]) && target[key] !== null && key !== 'prototype') {
          return new Proxy(target[key], _handler);
        } else {
          return target[key];
        }
      },

      set(target, prop, value) {
        const previousValue = _.cloneDeep(target);
        target[prop] = value;

        console.log('set proxy', previousValue, target, prop, value, target[prop], self._data, _validator(self._data))
        
        if (!_validator(self._data)) {
          target = previousValue;
          throw new Error(JSON.stringify(_validator.errors));
        }
        return true;
      },
    };

    this._data = new Proxy(data, _handler);
  }

  get _snapshot() {
    return this._data;
  }

  getSnapshot() {
    this.checkIsValid();
    return this._snapshot;
  }

  _validate(newData) {
    const { _validator } = this.constructor;
    const isValid = _validator(newData);
    if (!isValid) {
      throw new Error(JSON.stringify(_validator.errors));
    }
  }
}

module.exports = { BaseModel };