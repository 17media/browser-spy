'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
require('intersection-observer');

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

var _assign = function __assign() {
  _assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return _assign.apply(this, arguments);
};
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function next() {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

/* global Reflect, Promise */
var _extendStatics = function extendStatics(d, b) {
  _extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) {
      if (b.hasOwnProperty(p)) d[p] = b[p];
    }
  };

  return _extendStatics(d, b);
};

function __extends(d, b) {
  _extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Do a deep-copy of basic JavaScript Objects or Arrays.
 */


function deepCopy(value) {
  return deepExtend(undefined, value);
}
/**
 * Copy properties from source to target (recursively allows extension
 * of Objects and Arrays).  Scalar values in the target are over-written.
 * If target is undefined, an object of the appropriate type will be created
 * (and returned).
 *
 * We recursively copy all child properties of plain Objects in the source- so
 * that namespace- like dictionaries are merged.
 *
 * Note that the target can be a function, in which case the properties in
 * the source Object are copied onto it as static properties of the Function.
 */


function deepExtend(target, source) {
  if (!(source instanceof Object)) {
    return source;
  }

  switch (source.constructor) {
    case Date:
      // Treat Dates like scalars; if the target date object had any child
      // properties - they will be lost!
      var dateValue = source;
      return new Date(dateValue.getTime());

    case Object:
      if (target === undefined) {
        target = {};
      }

      break;

    case Array:
      // Always copy the array source and overwrite the target.
      target = [];
      break;

    default:
      // Not a plain Object - treat it as a scalar.
      return source;
  }

  for (var prop in source) {
    if (!source.hasOwnProperty(prop)) {
      continue;
    }

    target[prop] = deepExtend(target[prop], source[prop]);
  }

  return target;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var Deferred =
/** @class */
function () {
  function Deferred() {
    var _this = this;

    this.reject = function () {};

    this.resolve = function () {};

    this.promise = new Promise(function (resolve, reject) {
      _this.resolve = resolve;
      _this.reject = reject;
    });
  }
  /**
   * Our API internals are not promiseified and cannot because our callback APIs have subtle expectations around
   * invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
   * and returns a node-style callback which will resolve or reject the Deferred's promise.
   */


  Deferred.prototype.wrapCallback = function (callback) {
    var _this = this;

    return function (error, value) {
      if (error) {
        _this.reject(error);
      } else {
        _this.resolve(value);
      }

      if (typeof callback === 'function') {
        // Attaching noop handler just in case developer wasn't expecting
        // promises
        _this.promise.catch(function () {}); // Some of our callbacks don't expect a value and our own tests
        // assert that the parameter length is 1


        if (callback.length === 1) {
          callback(error);
        } else {
          callback(error, value);
        }
      }
    };
  };

  return Deferred;
}();
/**
 * Detect Node.js.
 *
 * @return true if Node.js environment is detected.
 */
// Node detection logic from: https://github.com/iliakan/detect-node/


function isNode() {
  try {
    return Object.prototype.toString.call(global.process) === '[object process]';
  } catch (e) {
    return false;
  }
}
/**
 * Detect Browser Environment
 */


function isBrowser() {
  return (typeof self === "undefined" ? "undefined" : _typeof(self)) === 'object' && self.self === self;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var ERROR_NAME = 'FirebaseError'; // Based on code from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types

var FirebaseError =
/** @class */
function (_super) {
  __extends(FirebaseError, _super);

  function FirebaseError(code, message) {
    var _this = _super.call(this, message) || this;

    _this.code = code;
    _this.name = ERROR_NAME; // Fix For ES5
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work

    Object.setPrototypeOf(_this, FirebaseError.prototype); // Maintains proper stack trace for where our error was thrown.
    // Only available on V8.

    if (Error.captureStackTrace) {
      Error.captureStackTrace(_this, ErrorFactory.prototype.create);
    }

    return _this;
  }

  return FirebaseError;
}(Error);

var ErrorFactory =
/** @class */
function () {
  function ErrorFactory(service, serviceName, errors) {
    this.service = service;
    this.serviceName = serviceName;
    this.errors = errors;
  }

  ErrorFactory.prototype.create = function (code) {
    var data = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      data[_i - 1] = arguments[_i];
    }

    var customData = data[0] || {};
    var fullCode = this.service + "/" + code;
    var template = this.errors[code];
    var message = template ? replaceTemplate(template, customData) : 'Error'; // Service Name: Error message (service/code).

    var fullMessage = this.serviceName + ": " + message + " (" + fullCode + ").";
    var error = new FirebaseError(fullCode, fullMessage); // Keys with an underscore at the end of their name are not included in
    // error.data for some reason.
    // TODO: Replace with Object.entries when lib is updated to es2017.

    for (var _a = 0, _b = Object.keys(customData); _a < _b.length; _a++) {
      var key = _b[_a];

      if (key.slice(-1) !== '_') {
        if (key in error) {
          console.warn("Overwriting FirebaseError base field \"" + key + "\" can cause unexpected behavior.");
        }

        error[key] = customData[key];
      }
    }

    return error;
  };

  return ErrorFactory;
}();

function replaceTemplate(template, data) {
  return template.replace(PATTERN, function (_, key) {
    var value = data[key];
    return value != null ? value.toString() : "<" + key + "?>";
  });
}

var PATTERN = /\{\$([^}]+)}/g;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


function contains(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
/**
 * Helper to make a Subscribe function (just like Promise helps make a
 * Thenable).
 *
 * @param executor Function which can make calls to a single Observer
 *     as a proxy.
 * @param onNoObservers Callback when count of Observers goes to zero.
 */


function createSubscribe(executor, onNoObservers) {
  var proxy = new ObserverProxy(executor, onNoObservers);
  return proxy.subscribe.bind(proxy);
}
/**
 * Implement fan-out for any number of Observers attached via a subscribe
 * function.
 */


var ObserverProxy =
/** @class */
function () {
  /**
   * @param executor Function which can make calls to a single Observer
   *     as a proxy.
   * @param onNoObservers Callback when count of Observers goes to zero.
   */
  function ObserverProxy(executor, onNoObservers) {
    var _this = this;

    this.observers = [];
    this.unsubscribes = [];
    this.observerCount = 0; // Micro-task scheduling by calling task.then().

    this.task = Promise.resolve();
    this.finalized = false;
    this.onNoObservers = onNoObservers; // Call the executor asynchronously so subscribers that are called
    // synchronously after the creation of the subscribe function
    // can still receive the very first value generated in the executor.

    this.task.then(function () {
      executor(_this);
    }).catch(function (e) {
      _this.error(e);
    });
  }

  ObserverProxy.prototype.next = function (value) {
    this.forEachObserver(function (observer) {
      observer.next(value);
    });
  };

  ObserverProxy.prototype.error = function (error) {
    this.forEachObserver(function (observer) {
      observer.error(error);
    });
    this.close(error);
  };

  ObserverProxy.prototype.complete = function () {
    this.forEachObserver(function (observer) {
      observer.complete();
    });
    this.close();
  };
  /**
   * Subscribe function that can be used to add an Observer to the fan-out list.
   *
   * - We require that no event is sent to a subscriber sychronously to their
   *   call to subscribe().
   */


  ObserverProxy.prototype.subscribe = function (nextOrObserver, error, complete) {
    var _this = this;

    var observer;

    if (nextOrObserver === undefined && error === undefined && complete === undefined) {
      throw new Error('Missing Observer.');
    } // Assemble an Observer object when passed as callback functions.


    if (implementsAnyMethods(nextOrObserver, ['next', 'error', 'complete'])) {
      observer = nextOrObserver;
    } else {
      observer = {
        next: nextOrObserver,
        error: error,
        complete: complete
      };
    }

    if (observer.next === undefined) {
      observer.next = noop;
    }

    if (observer.error === undefined) {
      observer.error = noop;
    }

    if (observer.complete === undefined) {
      observer.complete = noop;
    }

    var unsub = this.unsubscribeOne.bind(this, this.observers.length); // Attempt to subscribe to a terminated Observable - we
    // just respond to the Observer with the final error or complete
    // event.

    if (this.finalized) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.task.then(function () {
        try {
          if (_this.finalError) {
            observer.error(_this.finalError);
          } else {
            observer.complete();
          }
        } catch (e) {// nothing
        }

        return;
      });
    }

    this.observers.push(observer);
    return unsub;
  }; // Unsubscribe is synchronous - we guarantee that no events are sent to
  // any unsubscribed Observer.


  ObserverProxy.prototype.unsubscribeOne = function (i) {
    if (this.observers === undefined || this.observers[i] === undefined) {
      return;
    }

    delete this.observers[i];
    this.observerCount -= 1;

    if (this.observerCount === 0 && this.onNoObservers !== undefined) {
      this.onNoObservers(this);
    }
  };

  ObserverProxy.prototype.forEachObserver = function (fn) {
    if (this.finalized) {
      // Already closed by previous event....just eat the additional values.
      return;
    } // Since sendOne calls asynchronously - there is no chance that
    // this.observers will become undefined.


    for (var i = 0; i < this.observers.length; i++) {
      this.sendOne(i, fn);
    }
  }; // Call the Observer via one of it's callback function. We are careful to
  // confirm that the observe has not been unsubscribed since this asynchronous
  // function had been queued.


  ObserverProxy.prototype.sendOne = function (i, fn) {
    var _this = this; // Execute the callback asynchronously
    // eslint-disable-next-line @typescript-eslint/no-floating-promises


    this.task.then(function () {
      if (_this.observers !== undefined && _this.observers[i] !== undefined) {
        try {
          fn(_this.observers[i]);
        } catch (e) {
          // Ignore exceptions raised in Observers or missing methods of an
          // Observer.
          // Log error to console. b/31404806
          if (typeof console !== 'undefined' && console.error) {
            console.error(e);
          }
        }
      }
    });
  };

  ObserverProxy.prototype.close = function (err) {
    var _this = this;

    if (this.finalized) {
      return;
    }

    this.finalized = true;

    if (err !== undefined) {
      this.finalError = err;
    } // Proxy is no longer needed - garbage collect references
    // eslint-disable-next-line @typescript-eslint/no-floating-promises


    this.task.then(function () {
      _this.observers = undefined;
      _this.onNoObservers = undefined;
    });
  };

  return ObserverProxy;
}();
/**
 * Return true if the object passed in implements any of the named methods.
 */


function implementsAnyMethods(obj, methods) {
  if (_typeof(obj) !== 'object' || obj === null) {
    return false;
  }

  for (var _i = 0, methods_1 = methods; _i < methods_1.length; _i++) {
    var method = methods_1[_i];

    if (method in obj && typeof obj[method] === 'function') {
      return true;
    }
  }

  return false;
}

function noop() {} // do nothing

var _assign$1 = function __assign() {
  _assign$1 = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return _assign$1.apply(this, arguments);
};
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
}
function __values$1(o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function next() {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) {
      ar.push(r.value);
    }
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
}

/**
 * Component for service name T, e.g. `auth`, `auth-internal`
 */

var Component =
/** @class */
function () {
  /**
   *
   * @param name The public service name, e.g. app, auth, firestore, database
   * @param instanceFactory Service factory responsible for creating the public interface
   * @param type whether the service provided by the component is public or private
   */
  function Component(name, instanceFactory, type) {
    this.name = name;
    this.instanceFactory = instanceFactory;
    this.type = type;
    this.multipleInstances = false;
    /**
     * Properties to be added to the service namespace
     */

    this.serviceProps = {};
    this.instantiationMode = "LAZY"
    /* LAZY */
    ;
  }

  Component.prototype.setInstantiationMode = function (mode) {
    this.instantiationMode = mode;
    return this;
  };

  Component.prototype.setMultipleInstances = function (multipleInstances) {
    this.multipleInstances = multipleInstances;
    return this;
  };

  Component.prototype.setServiceProps = function (props) {
    this.serviceProps = props;
    return this;
  };

  return Component;
}();
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var DEFAULT_ENTRY_NAME = '[DEFAULT]';
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Provider for instance for service name T, e.g. 'auth', 'auth-internal'
 * NameServiceMapping[T] is an alias for the type of the instance
 */

var Provider =
/** @class */
function () {
  function Provider(name, container) {
    this.name = name;
    this.container = container;
    this.component = null;
    this.instances = new Map();
    this.instancesDeferred = new Map();
  }
  /**
   * @param identifier A provider can provide mulitple instances of a service
   * if this.component.multipleInstances is true.
   */


  Provider.prototype.get = function (identifier) {
    if (identifier === void 0) {
      identifier = DEFAULT_ENTRY_NAME;
    } // if multipleInstances is not supported, use the default name


    var normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);

    if (!this.instancesDeferred.has(normalizedIdentifier)) {
      var deferred = new Deferred();
      this.instancesDeferred.set(normalizedIdentifier, deferred); // If the service instance is available, resolve the promise with it immediately

      try {
        var instance = this.getOrInitializeService(normalizedIdentifier);

        if (instance) {
          deferred.resolve(instance);
        }
      } catch (e) {// when the instance factory throws an exception during get(), it should not cause
        // a fatal error. We just return the unresolved promise in this case.
      }
    }

    return this.instancesDeferred.get(normalizedIdentifier).promise;
  };

  Provider.prototype.getImmediate = function (options) {
    var _a = _assign$1({
      identifier: DEFAULT_ENTRY_NAME,
      optional: false
    }, options),
        identifier = _a.identifier,
        optional = _a.optional; // if multipleInstances is not supported, use the default name


    var normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);

    try {
      var instance = this.getOrInitializeService(normalizedIdentifier);

      if (!instance) {
        if (optional) {
          return null;
        }

        throw Error("Service " + this.name + " is not available");
      }

      return instance;
    } catch (e) {
      if (optional) {
        return null;
      } else {
        throw e;
      }
    }
  };

  Provider.prototype.getComponent = function () {
    return this.component;
  };

  Provider.prototype.setComponent = function (component) {
    var e_1, _a;

    if (component.name !== this.name) {
      throw Error("Mismatching Component " + component.name + " for Provider " + this.name + ".");
    }

    if (this.component) {
      throw Error("Component for " + this.name + " has already been provided");
    }

    this.component = component; // if the service is eager, initialize the default instance

    if (isComponentEager(component)) {
      try {
        this.getOrInitializeService(DEFAULT_ENTRY_NAME);
      } catch (e) {// when the instance factory for an eager Component throws an exception during the eager
        // initialization, it should not cause a fatal error.
        // TODO: Investigate if we need to make it configurable, because some component may want to cause
        // a fatal error in this case?
      }
    }

    try {
      // Create service instances for the pending promises and resolve them
      // NOTE: if this.multipleInstances is false, only the default instance will be created
      // and all promises with resolve with it regardless of the identifier.
      for (var _b = __values$1(this.instancesDeferred.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
        var _d = __read(_c.value, 2),
            instanceIdentifier = _d[0],
            instanceDeferred = _d[1];

        var normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);

        try {
          // `getOrInitializeService()` should always return a valid instance since a component is guaranteed. use ! to make typescript happy.
          var instance = this.getOrInitializeService(normalizedIdentifier);
          instanceDeferred.resolve(instance);
        } catch (e) {// when the instance factory throws an exception, it should not cause
          // a fatal error. We just leave the promise unresolved.
        }
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
  };

  Provider.prototype.clearInstance = function (identifier) {
    if (identifier === void 0) {
      identifier = DEFAULT_ENTRY_NAME;
    }

    this.instancesDeferred.delete(identifier);
    this.instances.delete(identifier);
  }; // app.delete() will call this method on every provider to delete the services
  // TODO: should we mark the provider as deleted?


  Provider.prototype.delete = function () {
    return __awaiter(this, void 0, void 0, function () {
      var services;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            services = Array.from(this.instances.values());
            return [4
            /*yield*/
            , Promise.all(services.filter(function (service) {
              return 'INTERNAL' in service;
            }) // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map(function (service) {
              return service.INTERNAL.delete();
            }))];

          case 1:
            _a.sent();

            return [2
            /*return*/
            ];
        }
      });
    });
  };

  Provider.prototype.isComponentSet = function () {
    return this.component != null;
  };

  Provider.prototype.getOrInitializeService = function (identifier) {
    var instance = this.instances.get(identifier);

    if (!instance && this.component) {
      instance = this.component.instanceFactory(this.container, normalizeIdentifierForFactory(identifier));
      this.instances.set(identifier, instance);
    }

    return instance || null;
  };

  Provider.prototype.normalizeInstanceIdentifier = function (identifier) {
    if (this.component) {
      return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME;
    } else {
      return identifier; // assume multiple instances are supported before the component is provided.
    }
  };

  return Provider;
}(); // undefined should be passed to the service factory for the default instance


function normalizeIdentifierForFactory(identifier) {
  return identifier === DEFAULT_ENTRY_NAME ? undefined : identifier;
}

function isComponentEager(component) {
  return component.instantiationMode === "EAGER"
  /* EAGER */
  ;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * ComponentContainer that provides Providers for service name T, e.g. `auth`, `auth-internal`
 */


var ComponentContainer =
/** @class */
function () {
  function ComponentContainer(name) {
    this.name = name;
    this.providers = new Map();
  }
  /**
   *
   * @param component Component being added
   * @param overwrite When a component with the same name has already been registered,
   * if overwrite is true: overwrite the existing component with the new component and create a new
   * provider with the new component. It can be useful in tests where you want to use different mocks
   * for different tests.
   * if overwrite is false: throw an exception
   */


  ComponentContainer.prototype.addComponent = function (component) {
    var provider = this.getProvider(component.name);

    if (provider.isComponentSet()) {
      throw new Error("Component " + component.name + " has already been registered with " + this.name);
    }

    provider.setComponent(component);
  };

  ComponentContainer.prototype.addOrOverwriteComponent = function (component) {
    var provider = this.getProvider(component.name);

    if (provider.isComponentSet()) {
      // delete the existing provider from the container, so we can register the new component
      this.providers.delete(component.name);
    }

    this.addComponent(component);
  };
  /**
   * getProvider provides a type safe interface where it can only be called with a field name
   * present in NameServiceMapping interface.
   *
   * Firebase SDKs providing services should extend NameServiceMapping interface to register
   * themselves.
   */


  ComponentContainer.prototype.getProvider = function (name) {
    if (this.providers.has(name)) {
      return this.providers.get(name);
    } // create a Provider for a service that hasn't registered with Firebase


    var provider = new Provider(name, this);
    this.providers.set(name, provider);
    return provider;
  };

  ComponentContainer.prototype.getProviders = function () {
    return Array.from(this.providers.values());
  };

  return ComponentContainer;
}();

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var _a;
/**
 * A container for all of the Logger instances
 */


var instances = [];
/**
 * The JS SDK supports 5 log levels and also allows a user the ability to
 * silence the logs altogether.
 *
 * The order is a follows:
 * DEBUG < VERBOSE < INFO < WARN < ERROR
 *
 * All of the log types above the current log level will be captured (i.e. if
 * you set the log level to `INFO`, errors will still be logged, but `DEBUG` and
 * `VERBOSE` logs will not)
 */

var LogLevel;

(function (LogLevel) {
  LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
  LogLevel[LogLevel["VERBOSE"] = 1] = "VERBOSE";
  LogLevel[LogLevel["INFO"] = 2] = "INFO";
  LogLevel[LogLevel["WARN"] = 3] = "WARN";
  LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
  LogLevel[LogLevel["SILENT"] = 5] = "SILENT";
})(LogLevel || (LogLevel = {}));

var levelStringToEnum = {
  'debug': LogLevel.DEBUG,
  'verbose': LogLevel.VERBOSE,
  'info': LogLevel.INFO,
  'warn': LogLevel.WARN,
  'error': LogLevel.ERROR,
  'silent': LogLevel.SILENT
};
/**
 * The default log level
 */

var defaultLogLevel = LogLevel.INFO;
/**
 * By default, `console.debug` is not displayed in the developer console (in
 * chrome). To avoid forcing users to have to opt-in to these logs twice
 * (i.e. once for firebase, and once in the console), we are sending `DEBUG`
 * logs to the `console.log` function.
 */

var ConsoleMethod = (_a = {}, _a[LogLevel.DEBUG] = 'log', _a[LogLevel.VERBOSE] = 'log', _a[LogLevel.INFO] = 'info', _a[LogLevel.WARN] = 'warn', _a[LogLevel.ERROR] = 'error', _a);
/**
 * The default log handler will forward DEBUG, VERBOSE, INFO, WARN, and ERROR
 * messages on to their corresponding console counterparts (if the log method
 * is supported by the current log level)
 */

var defaultLogHandler = function defaultLogHandler(instance, logType) {
  var args = [];

  for (var _i = 2; _i < arguments.length; _i++) {
    args[_i - 2] = arguments[_i];
  }

  if (logType < instance.logLevel) {
    return;
  }

  var now = new Date().toISOString();
  var method = ConsoleMethod[logType];

  if (method) {
    console[method].apply(console, __spreadArrays(["[" + now + "]  " + instance.name + ":"], args));
  } else {
    throw new Error("Attempted to log a message with an invalid logType (value: " + logType + ")");
  }
};

var Logger =
/** @class */
function () {
  /**
   * Gives you an instance of a Logger to capture messages according to
   * Firebase's logging scheme.
   *
   * @param name The name that the logs will be associated with
   */
  function Logger(name) {
    this.name = name;
    /**
     * The log level of the given Logger instance.
     */

    this._logLevel = defaultLogLevel;
    /**
     * The main (internal) log handler for the Logger instance.
     * Can be set to a new function in internal package code but not by user.
     */

    this._logHandler = defaultLogHandler;
    /**
     * The optional, additional, user-defined log handler for the Logger instance.
     */

    this._userLogHandler = null;
    /**
     * Capture the current instance for later use
     */

    instances.push(this);
  }

  Object.defineProperty(Logger.prototype, "logLevel", {
    get: function get() {
      return this._logLevel;
    },
    set: function set(val) {
      if (!(val in LogLevel)) {
        throw new TypeError("Invalid value \"" + val + "\" assigned to `logLevel`");
      }

      this._logLevel = val;
    },
    enumerable: true,
    configurable: true
  }); // Workaround for setter/getter having to be the same type.

  Logger.prototype.setLogLevel = function (val) {
    this._logLevel = typeof val === 'string' ? levelStringToEnum[val] : val;
  };

  Object.defineProperty(Logger.prototype, "logHandler", {
    get: function get() {
      return this._logHandler;
    },
    set: function set(val) {
      if (typeof val !== 'function') {
        throw new TypeError('Value assigned to `logHandler` must be a function');
      }

      this._logHandler = val;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Logger.prototype, "userLogHandler", {
    get: function get() {
      return this._userLogHandler;
    },
    set: function set(val) {
      this._userLogHandler = val;
    },
    enumerable: true,
    configurable: true
  });
  /**
   * The functions below are all based on the `console` interface
   */

  Logger.prototype.debug = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    this._userLogHandler && this._userLogHandler.apply(this, __spreadArrays([this, LogLevel.DEBUG], args));

    this._logHandler.apply(this, __spreadArrays([this, LogLevel.DEBUG], args));
  };

  Logger.prototype.log = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    this._userLogHandler && this._userLogHandler.apply(this, __spreadArrays([this, LogLevel.VERBOSE], args));

    this._logHandler.apply(this, __spreadArrays([this, LogLevel.VERBOSE], args));
  };

  Logger.prototype.info = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    this._userLogHandler && this._userLogHandler.apply(this, __spreadArrays([this, LogLevel.INFO], args));

    this._logHandler.apply(this, __spreadArrays([this, LogLevel.INFO], args));
  };

  Logger.prototype.warn = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    this._userLogHandler && this._userLogHandler.apply(this, __spreadArrays([this, LogLevel.WARN], args));

    this._logHandler.apply(this, __spreadArrays([this, LogLevel.WARN], args));
  };

  Logger.prototype.error = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    this._userLogHandler && this._userLogHandler.apply(this, __spreadArrays([this, LogLevel.ERROR], args));

    this._logHandler.apply(this, __spreadArrays([this, LogLevel.ERROR], args));
  };

  return Logger;
}();

function setLogLevel(level) {
  instances.forEach(function (inst) {
    inst.setLogLevel(level);
  });
}

function setUserLogHandler(logCallback, options) {
  var _loop_1 = function _loop_1(instance) {
    var customLogLevel = null;

    if (options && options.level) {
      customLogLevel = levelStringToEnum[options.level];
    }

    if (logCallback === null) {
      instance.userLogHandler = null;
    } else {
      instance.userLogHandler = function (instance, level) {
        var args = [];

        for (var _i = 2; _i < arguments.length; _i++) {
          args[_i - 2] = arguments[_i];
        }

        var message = args.map(function (arg) {
          if (arg == null) {
            return null;
          } else if (typeof arg === 'string') {
            return arg;
          } else if (typeof arg === 'number' || typeof arg === 'boolean') {
            return arg.toString();
          } else if (arg instanceof Error) {
            return arg.message;
          } else {
            try {
              return JSON.stringify(arg);
            } catch (ignored) {
              return null;
            }
          }
        }).filter(function (arg) {
          return arg;
        }).join(' ');

        if (level >= (customLogLevel !== null && customLogLevel !== void 0 ? customLogLevel : instance.logLevel)) {
          logCallback({
            level: LogLevel[level].toLowerCase(),
            message: message,
            args: args,
            type: instance.name
          });
        }
      };
    }
  };

  for (var _i = 0, instances_1 = instances; _i < instances_1.length; _i++) {
    var instance = instances_1[_i];

    _loop_1(instance);
  }
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var _a$1;

var ERRORS = (_a$1 = {}, _a$1["no-app"
/* NO_APP */
] = "No Firebase App '{$appName}' has been created - " + 'call Firebase App.initializeApp()', _a$1["bad-app-name"
/* BAD_APP_NAME */
] = "Illegal App name: '{$appName}", _a$1["duplicate-app"
/* DUPLICATE_APP */
] = "Firebase App named '{$appName}' already exists", _a$1["app-deleted"
/* APP_DELETED */
] = "Firebase App named '{$appName}' already deleted", _a$1["invalid-app-argument"
/* INVALID_APP_ARGUMENT */
] = 'firebase.{$appName}() takes either no argument or a ' + 'Firebase App instance.', _a$1["invalid-log-argument"
/* INVALID_LOG_ARGUMENT */
] = 'First argument to `onLog` must be null or a function.', _a$1);
var ERROR_FACTORY = new ErrorFactory('app', 'Firebase', ERRORS);
var name$1 = "@firebase/app";
var version = "0.6.5";
var name$2 = "@firebase/analytics";
var name$3 = "@firebase/auth";
var name$4 = "@firebase/database";
var name$5 = "@firebase/functions";
var name$6 = "@firebase/installations";
var name$7 = "@firebase/messaging";
var name$8 = "@firebase/performance";
var name$9 = "@firebase/remote-config";
var name$a = "@firebase/storage";
var name$b = "@firebase/firestore";
var name$c = "firebase-wrapper";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var _a$1$1;

var DEFAULT_ENTRY_NAME$1 = '[DEFAULT]';
var PLATFORM_LOG_STRING = (_a$1$1 = {}, _a$1$1[name$1] = 'fire-core', _a$1$1[name$2] = 'fire-analytics', _a$1$1[name$3] = 'fire-auth', _a$1$1[name$4] = 'fire-rtdb', _a$1$1[name$5] = 'fire-fn', _a$1$1[name$6] = 'fire-iid', _a$1$1[name$7] = 'fire-fcm', _a$1$1[name$8] = 'fire-perf', _a$1$1[name$9] = 'fire-rc', _a$1$1[name$a] = 'fire-gcs', _a$1$1[name$b] = 'fire-fst', _a$1$1['fire-js'] = 'fire-js', _a$1$1[name$c] = 'fire-js-all', _a$1$1);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var logger = new Logger('@firebase/app');
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Global context object for a collection of services using
 * a shared authentication state.
 */

var FirebaseAppImpl =
/** @class */
function () {
  function FirebaseAppImpl(options, config, firebase_) {
    var e_1, _a;

    var _this = this;

    this.firebase_ = firebase_;
    this.isDeleted_ = false;
    this.name_ = config.name;
    this.automaticDataCollectionEnabled_ = config.automaticDataCollectionEnabled || false;
    this.options_ = deepCopy(options);
    this.container = new ComponentContainer(config.name); // add itself to container

    this._addComponent(new Component('app', function () {
      return _this;
    }, "PUBLIC"
    /* PUBLIC */
    ));

    try {
      // populate ComponentContainer with existing components
      for (var _b = __values(this.firebase_.INTERNAL.components.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
        var component = _c.value;

        this._addComponent(component);
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
  }

  Object.defineProperty(FirebaseAppImpl.prototype, "automaticDataCollectionEnabled", {
    get: function get() {
      this.checkDestroyed_();
      return this.automaticDataCollectionEnabled_;
    },
    set: function set(val) {
      this.checkDestroyed_();
      this.automaticDataCollectionEnabled_ = val;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(FirebaseAppImpl.prototype, "name", {
    get: function get() {
      this.checkDestroyed_();
      return this.name_;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(FirebaseAppImpl.prototype, "options", {
    get: function get() {
      this.checkDestroyed_();
      return this.options_;
    },
    enumerable: true,
    configurable: true
  });

  FirebaseAppImpl.prototype.delete = function () {
    var _this = this;

    return new Promise(function (resolve) {
      _this.checkDestroyed_();

      resolve();
    }).then(function () {
      _this.firebase_.INTERNAL.removeApp(_this.name_);

      return Promise.all(_this.container.getProviders().map(function (provider) {
        return provider.delete();
      }));
    }).then(function () {
      _this.isDeleted_ = true;
    });
  };
  /**
   * Return a service instance associated with this app (creating it
   * on demand), identified by the passed instanceIdentifier.
   *
   * NOTE: Currently storage and functions are the only ones that are leveraging this
   * functionality. They invoke it by calling:
   *
   * ```javascript
   * firebase.app().storage('STORAGE BUCKET ID')
   * ```
   *
   * The service name is passed to this already
   * @internal
   */


  FirebaseAppImpl.prototype._getService = function (name, instanceIdentifier) {
    if (instanceIdentifier === void 0) {
      instanceIdentifier = DEFAULT_ENTRY_NAME$1;
    }

    this.checkDestroyed_(); // getImmediate will always succeed because _getService is only called for registered components.

    return this.container.getProvider(name).getImmediate({
      identifier: instanceIdentifier
    });
  };
  /**
   * Remove a service instance from the cache, so we will create a new instance for this service
   * when people try to get this service again.
   *
   * NOTE: currently only firestore is using this functionality to support firestore shutdown.
   *
   * @param name The service name
   * @param instanceIdentifier instance identifier in case multiple instances are allowed
   * @internal
   */


  FirebaseAppImpl.prototype._removeServiceInstance = function (name, instanceIdentifier) {
    if (instanceIdentifier === void 0) {
      instanceIdentifier = DEFAULT_ENTRY_NAME$1;
    } // eslint-disable-next-line @typescript-eslint/no-explicit-any


    this.container.getProvider(name).clearInstance(instanceIdentifier);
  };
  /**
   * @param component the component being added to this app's container
   */


  FirebaseAppImpl.prototype._addComponent = function (component) {
    try {
      this.container.addComponent(component);
    } catch (e) {
      logger.debug("Component " + component.name + " failed to register with FirebaseApp " + this.name, e);
    }
  };

  FirebaseAppImpl.prototype._addOrOverwriteComponent = function (component) {
    this.container.addOrOverwriteComponent(component);
  };
  /**
   * This function will throw an Error if the App has already been deleted -
   * use before performing API actions on the App.
   */


  FirebaseAppImpl.prototype.checkDestroyed_ = function () {
    if (this.isDeleted_) {
      throw ERROR_FACTORY.create("app-deleted"
      /* APP_DELETED */
      , {
        appName: this.name_
      });
    }
  };

  return FirebaseAppImpl;
}(); // Prevent dead-code elimination of these methods w/o invalid property
// copying.


FirebaseAppImpl.prototype.name && FirebaseAppImpl.prototype.options || FirebaseAppImpl.prototype.delete || console.log('dc');
var version$1 = "7.15.0";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Because auth can't share code with other components, we attach the utility functions
 * in an internal namespace to share code.
 * This function return a firebase namespace object without
 * any utility functions, so it can be shared between the regular firebaseNamespace and
 * the lite version.
 */

function createFirebaseNamespaceCore(firebaseAppImpl) {
  var apps = {}; // eslint-disable-next-line @typescript-eslint/no-explicit-any

  var components = new Map(); // A namespace is a plain JavaScript Object.

  var namespace = {
    // Hack to prevent Babel from modifying the object returned
    // as the firebase namespace.
    // @ts-ignore
    __esModule: true,
    initializeApp: initializeApp,
    // @ts-ignore
    app: app,
    registerVersion: registerVersion,
    setLogLevel: setLogLevel,
    onLog: onLog,
    // @ts-ignore
    apps: null,
    SDK_VERSION: version$1,
    INTERNAL: {
      registerComponent: registerComponent,
      removeApp: removeApp,
      components: components,
      useAsService: useAsService
    }
  }; // Inject a circular default export to allow Babel users who were previously
  // using:
  //
  //   import firebase from 'firebase';
  //   which becomes: var firebase = require('firebase').default;
  //
  // instead of
  //
  //   import * as firebase from 'firebase';
  //   which becomes: var firebase = require('firebase');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  namespace['default'] = namespace; // firebase.apps is a read-only getter.

  Object.defineProperty(namespace, 'apps', {
    get: getApps
  });
  /**
   * Called by App.delete() - but before any services associated with the App
   * are deleted.
   */

  function removeApp(name) {
    delete apps[name];
  }
  /**
   * Get the App object for a given name (or DEFAULT).
   */


  function app(name) {
    name = name || DEFAULT_ENTRY_NAME$1;

    if (!contains(apps, name)) {
      throw ERROR_FACTORY.create("no-app"
      /* NO_APP */
      , {
        appName: name
      });
    }

    return apps[name];
  } // @ts-ignore


  app['App'] = firebaseAppImpl;

  function initializeApp(options, rawConfig) {
    if (rawConfig === void 0) {
      rawConfig = {};
    }

    if (_typeof(rawConfig) !== 'object' || rawConfig === null) {
      var name_1 = rawConfig;
      rawConfig = {
        name: name_1
      };
    }

    var config = rawConfig;

    if (config.name === undefined) {
      config.name = DEFAULT_ENTRY_NAME$1;
    }

    var name = config.name;

    if (typeof name !== 'string' || !name) {
      throw ERROR_FACTORY.create("bad-app-name"
      /* BAD_APP_NAME */
      , {
        appName: String(name)
      });
    }

    if (contains(apps, name)) {
      throw ERROR_FACTORY.create("duplicate-app"
      /* DUPLICATE_APP */
      , {
        appName: name
      });
    }

    var app = new firebaseAppImpl(options, config, namespace);
    apps[name] = app;
    return app;
  }
  /*
   * Return an array of all the non-deleted FirebaseApps.
   */


  function getApps() {
    // Make a copy so caller cannot mutate the apps list.
    return Object.keys(apps).map(function (name) {
      return apps[name];
    });
  }

  function registerComponent(component) {
    var e_1, _a;

    var componentName = component.name;

    if (components.has(componentName)) {
      logger.debug("There were multiple attempts to register component " + componentName + ".");
      return component.type === "PUBLIC"
      /* PUBLIC */
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      namespace[componentName] : null;
    }

    components.set(componentName, component); // create service namespace for public components

    if (component.type === "PUBLIC"
    /* PUBLIC */
    ) {
        // The Service namespace is an accessor function ...
        var serviceNamespace = function serviceNamespace(appArg) {
          if (appArg === void 0) {
            appArg = app();
          } // eslint-disable-next-line @typescript-eslint/no-explicit-any


          if (typeof appArg[componentName] !== 'function') {
            // Invalid argument.
            // This happens in the following case: firebase.storage('gs:/')
            throw ERROR_FACTORY.create("invalid-app-argument"
            /* INVALID_APP_ARGUMENT */
            , {
              appName: componentName
            });
          } // Forward service instance lookup to the FirebaseApp.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any


          return appArg[componentName]();
        }; // ... and a container for service-level properties.


        if (component.serviceProps !== undefined) {
          deepExtend(serviceNamespace, component.serviceProps);
        } // eslint-disable-next-line @typescript-eslint/no-explicit-any


        namespace[componentName] = serviceNamespace; // Patch the FirebaseAppImpl prototype
        // eslint-disable-next-line @typescript-eslint/no-explicit-any

        firebaseAppImpl.prototype[componentName] = // TODO: The eslint disable can be removed and the 'ignoreRestArgs'
        // option added to the no-explicit-any rule when ESlint releases it.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function () {
          var args = [];

          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }

          var serviceFxn = this._getService.bind(this, componentName);

          return serviceFxn.apply(this, component.multipleInstances ? args : []);
        };
      }

    try {
      // add the component to existing app instances
      for (var _b = __values(Object.keys(apps)), _c = _b.next(); !_c.done; _c = _b.next()) {
        var appName = _c.value;

        apps[appName]._addComponent(component);
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_1) throw e_1.error;
      }
    }

    return component.type === "PUBLIC"
    /* PUBLIC */
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    namespace[componentName] : null;
  }

  function registerVersion(libraryKeyOrName, version, variant) {
    var _a; // TODO: We can use this check to whitelist strings when/if we set up
    // a good whitelist system.


    var library = (_a = PLATFORM_LOG_STRING[libraryKeyOrName]) !== null && _a !== void 0 ? _a : libraryKeyOrName;

    if (variant) {
      library += "-" + variant;
    }

    var libraryMismatch = library.match(/\s|\//);
    var versionMismatch = version.match(/\s|\//);

    if (libraryMismatch || versionMismatch) {
      var warning = ["Unable to register library \"" + library + "\" with version \"" + version + "\":"];

      if (libraryMismatch) {
        warning.push("library name \"" + library + "\" contains illegal characters (whitespace or \"/\")");
      }

      if (libraryMismatch && versionMismatch) {
        warning.push('and');
      }

      if (versionMismatch) {
        warning.push("version name \"" + version + "\" contains illegal characters (whitespace or \"/\")");
      }

      logger.warn(warning.join(' '));
      return;
    }

    registerComponent(new Component(library + "-version", function () {
      return {
        library: library,
        version: version
      };
    }, "VERSION"
    /* VERSION */
    ));
  }

  function onLog(logCallback, options) {
    if (logCallback !== null && typeof logCallback !== 'function') {
      throw ERROR_FACTORY.create("invalid-log-argument"
      /* INVALID_LOG_ARGUMENT */
      , {
        appName: name
      });
    }

    setUserLogHandler(logCallback, options);
  } // Map the requested service to a registered service name
  // (used to map auth to serverAuth service when needed).


  function useAsService(app, name) {
    if (name === 'serverAuth') {
      return null;
    }

    var useService = name;
    return useService;
  }

  return namespace;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Return a firebase namespace object.
 *
 * In production, this will be called exactly once and the result
 * assigned to the 'firebase' global.  It may be called multiple times
 * in unit tests.
 */


function createFirebaseNamespace() {
  var namespace = createFirebaseNamespaceCore(FirebaseAppImpl);
  namespace.INTERNAL = _assign(_assign({}, namespace.INTERNAL), {
    createFirebaseNamespace: createFirebaseNamespace,
    extendNamespace: extendNamespace,
    createSubscribe: createSubscribe,
    ErrorFactory: ErrorFactory,
    deepExtend: deepExtend
  });
  /**
   * Patch the top-level firebase namespace with additional properties.
   *
   * firebase.INTERNAL.extendNamespace()
   */

  function extendNamespace(props) {
    deepExtend(namespace, props);
  }

  return namespace;
}

var firebase = createFirebaseNamespace();
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var PlatformLoggerService =
/** @class */
function () {
  function PlatformLoggerService(container) {
    this.container = container;
  } // In initial implementation, this will be called by installations on
  // auth token refresh, and installations will send this string.


  PlatformLoggerService.prototype.getPlatformInfoString = function () {
    var providers = this.container.getProviders(); // Loop through providers and get library/version pairs from any that are
    // version components.

    return providers.map(function (provider) {
      if (isVersionServiceProvider(provider)) {
        var service = provider.getImmediate();
        return service.library + "/" + service.version;
      } else {
        return null;
      }
    }).filter(function (logString) {
      return logString;
    }).join(' ');
  };

  return PlatformLoggerService;
}();
/**
 *
 * @param provider check if this provider provides a VersionService
 *
 * NOTE: Using Provider<'app-version'> is a hack to indicate that the provider
 * provides VersionService. The provider is not necessarily a 'app-version'
 * provider.
 */


function isVersionServiceProvider(provider) {
  var component = provider.getComponent();
  return (component === null || component === void 0 ? void 0 : component.type) === "VERSION"
  /* VERSION */
  ;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


function registerCoreComponents(firebase, variant) {
  firebase.INTERNAL.registerComponent(new Component('platform-logger', function (container) {
    return new PlatformLoggerService(container);
  }, "PRIVATE"
  /* PRIVATE */
  )); // Register `app` package.

  firebase.registerVersion(name$1, version, variant); // Register platform SDK identifier (no version).

  firebase.registerVersion('fire-js', '');
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Firebase Lite detection test
// eslint-disable-next-line @typescript-eslint/no-explicit-any


if (isBrowser() && self.firebase !== undefined) {
  logger.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  "); // eslint-disable-next-line

  var sdkVersion = self.firebase.SDK_VERSION;

  if (sdkVersion && sdkVersion.indexOf('LITE') >= 0) {
    logger.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ");
  }
}

var initializeApp = firebase.initializeApp; // TODO: This disable can be removed and the 'ignoreRestArgs' option added to
// the no-explicit-any rule when ESlint releases it.
// eslint-disable-next-line @typescript-eslint/no-explicit-any

firebase.initializeApp = function () {
  var args = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  } // Environment check before initializing app
  // Do the check in initializeApp, so people have a chance to disable it by setting logLevel
  // in @firebase/logger


  if (isNode()) {
    logger.warn("\n      Warning: This is a browser-targeted Firebase bundle but it appears it is being\n      run in a Node environment.  If running in a Node environment, make sure you\n      are using the bundle specified by the \"main\" field in package.json.\n      \n      If you are using Webpack, you can specify \"main\" as the first item in\n      \"resolve.mainFields\":\n      https://webpack.js.org/configuration/resolve/#resolvemainfields\n      \n      If using Rollup, use the rollup-plugin-node-resolve plugin and specify \"main\"\n      as the first item in \"mainFields\", e.g. ['main', 'module'].\n      https://github.com/rollup/rollup-plugin-node-resolve\n      ");
  }

  return initializeApp.apply(undefined, args);
};

var firebase$1 = firebase;
registerCoreComponents(firebase$1);

var name$d = "firebase";
var version$2 = "7.15.1";
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

firebase$1.registerVersion(name$d, version$2, 'app');

var _assign$2 = function __assign() {
  _assign$2 = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return _assign$2.apply(this, arguments);
};
function __awaiter$1(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator$1(thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
}
function __values$2(o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function next() {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read$1(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) {
      ar.push(r.value);
    }
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
}
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++) {
    ar = ar.concat(__read$1(arguments[i]));
  }

  return ar;
}

function toArray(arr) {
  return Array.prototype.slice.call(arr);
}

function promisifyRequest(request) {
  return new Promise(function (resolve, reject) {
    request.onsuccess = function () {
      resolve(request.result);
    };

    request.onerror = function () {
      reject(request.error);
    };
  });
}

function promisifyRequestCall(obj, method, args) {
  var request;
  var p = new Promise(function (resolve, reject) {
    request = obj[method].apply(obj, args);
    promisifyRequest(request).then(resolve, reject);
  });
  p.request = request;
  return p;
}

function promisifyCursorRequestCall(obj, method, args) {
  var p = promisifyRequestCall(obj, method, args);
  return p.then(function (value) {
    if (!value) return;
    return new Cursor(value, p.request);
  });
}

function proxyProperties(ProxyClass, targetProp, properties) {
  properties.forEach(function (prop) {
    Object.defineProperty(ProxyClass.prototype, prop, {
      get: function get() {
        return this[targetProp][prop];
      },
      set: function set(val) {
        this[targetProp][prop] = val;
      }
    });
  });
}

function proxyRequestMethods(ProxyClass, targetProp, Constructor, properties) {
  properties.forEach(function (prop) {
    if (!(prop in Constructor.prototype)) return;

    ProxyClass.prototype[prop] = function () {
      return promisifyRequestCall(this[targetProp], prop, arguments);
    };
  });
}

function proxyMethods(ProxyClass, targetProp, Constructor, properties) {
  properties.forEach(function (prop) {
    if (!(prop in Constructor.prototype)) return;

    ProxyClass.prototype[prop] = function () {
      return this[targetProp][prop].apply(this[targetProp], arguments);
    };
  });
}

function proxyCursorRequestMethods(ProxyClass, targetProp, Constructor, properties) {
  properties.forEach(function (prop) {
    if (!(prop in Constructor.prototype)) return;

    ProxyClass.prototype[prop] = function () {
      return promisifyCursorRequestCall(this[targetProp], prop, arguments);
    };
  });
}

function Index(index) {
  this._index = index;
}

proxyProperties(Index, '_index', ['name', 'keyPath', 'multiEntry', 'unique']);
proxyRequestMethods(Index, '_index', IDBIndex, ['get', 'getKey', 'getAll', 'getAllKeys', 'count']);
proxyCursorRequestMethods(Index, '_index', IDBIndex, ['openCursor', 'openKeyCursor']);

function Cursor(cursor, request) {
  this._cursor = cursor;
  this._request = request;
}

proxyProperties(Cursor, '_cursor', ['direction', 'key', 'primaryKey', 'value']);
proxyRequestMethods(Cursor, '_cursor', IDBCursor, ['update', 'delete']); // proxy 'next' methods

['advance', 'continue', 'continuePrimaryKey'].forEach(function (methodName) {
  if (!(methodName in IDBCursor.prototype)) return;

  Cursor.prototype[methodName] = function () {
    var cursor = this;
    var args = arguments;
    return Promise.resolve().then(function () {
      cursor._cursor[methodName].apply(cursor._cursor, args);

      return promisifyRequest(cursor._request).then(function (value) {
        if (!value) return;
        return new Cursor(value, cursor._request);
      });
    });
  };
});

function ObjectStore(store) {
  this._store = store;
}

ObjectStore.prototype.createIndex = function () {
  return new Index(this._store.createIndex.apply(this._store, arguments));
};

ObjectStore.prototype.index = function () {
  return new Index(this._store.index.apply(this._store, arguments));
};

proxyProperties(ObjectStore, '_store', ['name', 'keyPath', 'indexNames', 'autoIncrement']);
proxyRequestMethods(ObjectStore, '_store', IDBObjectStore, ['put', 'add', 'delete', 'clear', 'get', 'getAll', 'getKey', 'getAllKeys', 'count']);
proxyCursorRequestMethods(ObjectStore, '_store', IDBObjectStore, ['openCursor', 'openKeyCursor']);
proxyMethods(ObjectStore, '_store', IDBObjectStore, ['deleteIndex']);

function Transaction(idbTransaction) {
  this._tx = idbTransaction;
  this.complete = new Promise(function (resolve, reject) {
    idbTransaction.oncomplete = function () {
      resolve();
    };

    idbTransaction.onerror = function () {
      reject(idbTransaction.error);
    };

    idbTransaction.onabort = function () {
      reject(idbTransaction.error);
    };
  });
}

Transaction.prototype.objectStore = function () {
  return new ObjectStore(this._tx.objectStore.apply(this._tx, arguments));
};

proxyProperties(Transaction, '_tx', ['objectStoreNames', 'mode']);
proxyMethods(Transaction, '_tx', IDBTransaction, ['abort']);

function UpgradeDB(db, oldVersion, transaction) {
  this._db = db;
  this.oldVersion = oldVersion;
  this.transaction = new Transaction(transaction);
}

UpgradeDB.prototype.createObjectStore = function () {
  return new ObjectStore(this._db.createObjectStore.apply(this._db, arguments));
};

proxyProperties(UpgradeDB, '_db', ['name', 'version', 'objectStoreNames']);
proxyMethods(UpgradeDB, '_db', IDBDatabase, ['deleteObjectStore', 'close']);

function DB(db) {
  this._db = db;
}

DB.prototype.transaction = function () {
  return new Transaction(this._db.transaction.apply(this._db, arguments));
};

proxyProperties(DB, '_db', ['name', 'version', 'objectStoreNames']);
proxyMethods(DB, '_db', IDBDatabase, ['close']); // Add cursor iterators
// TODO: remove this once browsers do the right thing with promises

['openCursor', 'openKeyCursor'].forEach(function (funcName) {
  [ObjectStore, Index].forEach(function (Constructor) {
    // Don't create iterateKeyCursor if openKeyCursor doesn't exist.
    if (!(funcName in Constructor.prototype)) return;

    Constructor.prototype[funcName.replace('open', 'iterate')] = function () {
      var args = toArray(arguments);
      var callback = args[args.length - 1];
      var nativeObject = this._store || this._index;
      var request = nativeObject[funcName].apply(nativeObject, args.slice(0, -1));

      request.onsuccess = function () {
        callback(request.result);
      };
    };
  });
}); // polyfill getAll

[Index, ObjectStore].forEach(function (Constructor) {
  if (Constructor.prototype.getAll) return;

  Constructor.prototype.getAll = function (query, count) {
    var instance = this;
    var items = [];
    return new Promise(function (resolve) {
      instance.iterateCursor(query, function (cursor) {
        if (!cursor) {
          resolve(items);
          return;
        }

        items.push(cursor.value);

        if (count !== undefined && items.length == count) {
          resolve(items);
          return;
        }

        cursor.continue();
      });
    });
  };
});
function openDb(name, version, upgradeCallback) {
  var p = promisifyRequestCall(indexedDB, 'open', [name, version]);
  var request = p.request;

  if (request) {
    request.onupgradeneeded = function (event) {
      if (upgradeCallback) {
        upgradeCallback(new UpgradeDB(request.result, event.oldVersion, request.transaction));
      }
    };
  }

  return p.then(function (db) {
    return new DB(db);
  });
}

var name$e = "@firebase/installations";
var version$3 = "0.4.11";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var PENDING_TIMEOUT_MS = 10000;
var PACKAGE_VERSION = "w:" + version$3;
var INTERNAL_AUTH_VERSION = 'FIS_v2';
var INSTALLATIONS_API_URL = 'https://firebaseinstallations.googleapis.com/v1';
var TOKEN_EXPIRATION_BUFFER = 60 * 60 * 1000; // One hour

var SERVICE = 'installations';
var SERVICE_NAME = 'Installations';
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var _a$2;

var ERROR_DESCRIPTION_MAP = (_a$2 = {}, _a$2["missing-app-config-values"
/* MISSING_APP_CONFIG_VALUES */
] = 'Missing App configuration value: "{$valueName}"', _a$2["not-registered"
/* NOT_REGISTERED */
] = 'Firebase Installation is not registered.', _a$2["installation-not-found"
/* INSTALLATION_NOT_FOUND */
] = 'Firebase Installation not found.', _a$2["request-failed"
/* REQUEST_FAILED */
] = '{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"', _a$2["app-offline"
/* APP_OFFLINE */
] = 'Could not process request. Application offline.', _a$2["delete-pending-registration"
/* DELETE_PENDING_REGISTRATION */
] = "Can't delete installation while there is a pending registration request.", _a$2);
var ERROR_FACTORY$1 = new ErrorFactory(SERVICE, SERVICE_NAME, ERROR_DESCRIPTION_MAP);
/** Returns true if error is a FirebaseError that is based on an error from the server. */

function isServerError(error) {
  return error instanceof FirebaseError && error.code.includes("request-failed"
  /* REQUEST_FAILED */
  );
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


function getInstallationsEndpoint(_a) {
  var projectId = _a.projectId;
  return INSTALLATIONS_API_URL + "/projects/" + projectId + "/installations";
}

function extractAuthTokenInfoFromResponse(response) {
  return {
    token: response.token,
    requestStatus: 2
    /* COMPLETED */
    ,
    expiresIn: getExpiresInFromResponseExpiresIn(response.expiresIn),
    creationTime: Date.now()
  };
}

function getErrorFromResponse(requestName, response) {
  return __awaiter$1(this, void 0, void 0, function () {
    var responseJson, errorData;
    return __generator$1(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , response.json()];

        case 1:
          responseJson = _a.sent();
          errorData = responseJson.error;
          return [2
          /*return*/
          , ERROR_FACTORY$1.create("request-failed"
          /* REQUEST_FAILED */
          , {
            requestName: requestName,
            serverCode: errorData.code,
            serverMessage: errorData.message,
            serverStatus: errorData.status
          })];
      }
    });
  });
}

function getHeaders(_a) {
  var apiKey = _a.apiKey;
  return new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'x-goog-api-key': apiKey
  });
}

function getHeadersWithAuth(appConfig, _a) {
  var refreshToken = _a.refreshToken;
  var headers = getHeaders(appConfig);
  headers.append('Authorization', getAuthorizationHeader(refreshToken));
  return headers;
}
/**
 * Calls the passed in fetch wrapper and returns the response.
 * If the returned response has a status of 5xx, re-runs the function once and
 * returns the response.
 */


function retryIfServerError(fn) {
  return __awaiter$1(this, void 0, void 0, function () {
    var result;
    return __generator$1(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , fn()];

        case 1:
          result = _a.sent();

          if (result.status >= 500 && result.status < 600) {
            // Internal Server Error. Retry request.
            return [2
            /*return*/
            , fn()];
          }

          return [2
          /*return*/
          , result];
      }
    });
  });
}

function getExpiresInFromResponseExpiresIn(responseExpiresIn) {
  // This works because the server will never respond with fractions of a second.
  return Number(responseExpiresIn.replace('s', '000'));
}

function getAuthorizationHeader(refreshToken) {
  return INTERNAL_AUTH_VERSION + " " + refreshToken;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


function createInstallationRequest(appConfig, _a) {
  var fid = _a.fid;
  return __awaiter$1(this, void 0, void 0, function () {
    var endpoint, headers, body, request, response, responseValue, registeredInstallationEntry;
    return __generator$1(this, function (_b) {
      switch (_b.label) {
        case 0:
          endpoint = getInstallationsEndpoint(appConfig);
          headers = getHeaders(appConfig);
          body = {
            fid: fid,
            authVersion: INTERNAL_AUTH_VERSION,
            appId: appConfig.appId,
            sdkVersion: PACKAGE_VERSION
          };
          request = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
          };
          return [4
          /*yield*/
          , retryIfServerError(function () {
            return fetch(endpoint, request);
          })];

        case 1:
          response = _b.sent();
          if (!response.ok) return [3
          /*break*/
          , 3];
          return [4
          /*yield*/
          , response.json()];

        case 2:
          responseValue = _b.sent();
          registeredInstallationEntry = {
            fid: responseValue.fid || fid,
            registrationStatus: 2
            /* COMPLETED */
            ,
            refreshToken: responseValue.refreshToken,
            authToken: extractAuthTokenInfoFromResponse(responseValue.authToken)
          };
          return [2
          /*return*/
          , registeredInstallationEntry];

        case 3:
          return [4
          /*yield*/
          , getErrorFromResponse('Create Installation', response)];

        case 4:
          throw _b.sent();
      }
    });
  });
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** Returns a promise that resolves after given time passes. */


function sleep(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


function bufferToBase64UrlSafe(array) {
  var b64 = btoa(String.fromCharCode.apply(String, __spread(array)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_');
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var VALID_FID_PATTERN = /^[cdef][\w-]{21}$/;
var INVALID_FID = '';
/**
 * Generates a new FID using random values from Web Crypto API.
 * Returns an empty string if FID generation fails for any reason.
 */

function generateFid() {
  try {
    // A valid FID has exactly 22 base64 characters, which is 132 bits, or 16.5
    // bytes. our implementation generates a 17 byte array instead.
    var fidByteArray = new Uint8Array(17);
    var crypto_1 = self.crypto || self.msCrypto;
    crypto_1.getRandomValues(fidByteArray); // Replace the first 4 random bits with the constant FID header of 0b0111.

    fidByteArray[0] = 112 + fidByteArray[0] % 16;
    var fid = encode(fidByteArray);
    return VALID_FID_PATTERN.test(fid) ? fid : INVALID_FID;
  } catch (_a) {
    // FID generation errored
    return INVALID_FID;
  }
}
/** Converts a FID Uint8Array to a base64 string representation. */


function encode(fidByteArray) {
  var b64String = bufferToBase64UrlSafe(fidByteArray); // Remove the 23rd character that was added because of the extra 4 bits at the
  // end of our 17 byte array, and the '=' padding.

  return b64String.substr(0, 22);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** Returns a string key that can be used to identify the app. */


function getKey(appConfig) {
  return appConfig.appName + "!" + appConfig.appId;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var fidChangeCallbacks = new Map();
/**
 * Calls the onIdChange callbacks with the new FID value, and broadcasts the
 * change to other tabs.
 */

function fidChanged(appConfig, fid) {
  var key = getKey(appConfig);
  callFidChangeCallbacks(key, fid);
  broadcastFidChange(key, fid);
}

function addCallback(appConfig, callback) {
  // Open the broadcast channel if it's not already open,
  // to be able to listen to change events from other tabs.
  getBroadcastChannel();
  var key = getKey(appConfig);
  var callbackSet = fidChangeCallbacks.get(key);

  if (!callbackSet) {
    callbackSet = new Set();
    fidChangeCallbacks.set(key, callbackSet);
  }

  callbackSet.add(callback);
}

function removeCallback(appConfig, callback) {
  var key = getKey(appConfig);
  var callbackSet = fidChangeCallbacks.get(key);

  if (!callbackSet) {
    return;
  }

  callbackSet.delete(callback);

  if (callbackSet.size === 0) {
    fidChangeCallbacks.delete(key);
  } // Close broadcast channel if there are no more callbacks.


  closeBroadcastChannel();
}

function callFidChangeCallbacks(key, fid) {
  var e_1, _a;

  var callbacks = fidChangeCallbacks.get(key);

  if (!callbacks) {
    return;
  }

  try {
    for (var callbacks_1 = __values$2(callbacks), callbacks_1_1 = callbacks_1.next(); !callbacks_1_1.done; callbacks_1_1 = callbacks_1.next()) {
      var callback = callbacks_1_1.value;
      callback(fid);
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (callbacks_1_1 && !callbacks_1_1.done && (_a = callbacks_1.return)) _a.call(callbacks_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }
}

function broadcastFidChange(key, fid) {
  var channel = getBroadcastChannel();

  if (channel) {
    channel.postMessage({
      key: key,
      fid: fid
    });
  }

  closeBroadcastChannel();
}

var broadcastChannel = null;
/** Opens and returns a BroadcastChannel if it is supported by the browser. */

function getBroadcastChannel() {
  if (!broadcastChannel && 'BroadcastChannel' in self) {
    broadcastChannel = new BroadcastChannel('[Firebase] FID Change');

    broadcastChannel.onmessage = function (e) {
      callFidChangeCallbacks(e.data.key, e.data.fid);
    };
  }

  return broadcastChannel;
}

function closeBroadcastChannel() {
  if (fidChangeCallbacks.size === 0 && broadcastChannel) {
    broadcastChannel.close();
    broadcastChannel = null;
  }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var DATABASE_NAME = 'firebase-installations-database';
var DATABASE_VERSION = 1;
var OBJECT_STORE_NAME = 'firebase-installations-store';
var dbPromise = null;

function getDbPromise() {
  if (!dbPromise) {
    dbPromise = openDb(DATABASE_NAME, DATABASE_VERSION, function (upgradeDB) {
      // We don't use 'break' in this switch statement, the fall-through
      // behavior is what we want, because if there are multiple versions between
      // the old version and the current version, we want ALL the migrations
      // that correspond to those versions to run, not only the last one.
      // eslint-disable-next-line default-case
      switch (upgradeDB.oldVersion) {
        case 0:
          upgradeDB.createObjectStore(OBJECT_STORE_NAME);
      }
    });
  }

  return dbPromise;
}
/** Assigns or overwrites the record for the given key with the given value. */


function set(appConfig, value) {
  return __awaiter$1(this, void 0, void 0, function () {
    var key, db, tx, objectStore, oldValue;
    return __generator$1(this, function (_a) {
      switch (_a.label) {
        case 0:
          key = getKey(appConfig);
          return [4
          /*yield*/
          , getDbPromise()];

        case 1:
          db = _a.sent();
          tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
          objectStore = tx.objectStore(OBJECT_STORE_NAME);
          return [4
          /*yield*/
          , objectStore.get(key)];

        case 2:
          oldValue = _a.sent();
          return [4
          /*yield*/
          , objectStore.put(value, key)];

        case 3:
          _a.sent();

          return [4
          /*yield*/
          , tx.complete];

        case 4:
          _a.sent();

          if (!oldValue || oldValue.fid !== value.fid) {
            fidChanged(appConfig, value.fid);
          }

          return [2
          /*return*/
          , value];
      }
    });
  });
}
/** Removes record(s) from the objectStore that match the given key. */


function remove(appConfig) {
  return __awaiter$1(this, void 0, void 0, function () {
    var key, db, tx;
    return __generator$1(this, function (_a) {
      switch (_a.label) {
        case 0:
          key = getKey(appConfig);
          return [4
          /*yield*/
          , getDbPromise()];

        case 1:
          db = _a.sent();
          tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
          return [4
          /*yield*/
          , tx.objectStore(OBJECT_STORE_NAME).delete(key)];

        case 2:
          _a.sent();

          return [4
          /*yield*/
          , tx.complete];

        case 3:
          _a.sent();

          return [2
          /*return*/
          ];
      }
    });
  });
}
/**
 * Atomically updates a record with the result of updateFn, which gets
 * called with the current value. If newValue is undefined, the record is
 * deleted instead.
 * @return Updated value
 */


function update(appConfig, updateFn) {
  return __awaiter$1(this, void 0, void 0, function () {
    var key, db, tx, store, oldValue, newValue;
    return __generator$1(this, function (_a) {
      switch (_a.label) {
        case 0:
          key = getKey(appConfig);
          return [4
          /*yield*/
          , getDbPromise()];

        case 1:
          db = _a.sent();
          tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
          store = tx.objectStore(OBJECT_STORE_NAME);
          return [4
          /*yield*/
          , store.get(key)];

        case 2:
          oldValue = _a.sent();
          newValue = updateFn(oldValue);
          if (!(newValue === undefined)) return [3
          /*break*/
          , 4];
          return [4
          /*yield*/
          , store.delete(key)];

        case 3:
          _a.sent();

          return [3
          /*break*/
          , 6];

        case 4:
          return [4
          /*yield*/
          , store.put(newValue, key)];

        case 5:
          _a.sent();

          _a.label = 6;

        case 6:
          return [4
          /*yield*/
          , tx.complete];

        case 7:
          _a.sent();

          if (newValue && (!oldValue || oldValue.fid !== newValue.fid)) {
            fidChanged(appConfig, newValue.fid);
          }

          return [2
          /*return*/
          , newValue];
      }
    });
  });
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Updates and returns the InstallationEntry from the database.
 * Also triggers a registration request if it is necessary and possible.
 */


function getInstallationEntry(appConfig) {
  return __awaiter$1(this, void 0, void 0, function () {
    var registrationPromise, installationEntry, _a;

    return __generator$1(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4
          /*yield*/
          , update(appConfig, function (oldEntry) {
            var installationEntry = updateOrCreateInstallationEntry(oldEntry);
            var entryWithPromise = triggerRegistrationIfNecessary(appConfig, installationEntry);
            registrationPromise = entryWithPromise.registrationPromise;
            return entryWithPromise.installationEntry;
          })];

        case 1:
          installationEntry = _b.sent();
          if (!(installationEntry.fid === INVALID_FID)) return [3
          /*break*/
          , 3];
          _a = {};
          return [4
          /*yield*/
          , registrationPromise];

        case 2:
          // FID generation failed. Waiting for the FID from the server.
          return [2
          /*return*/
          , (_a.installationEntry = _b.sent(), _a)];

        case 3:
          return [2
          /*return*/
          , {
            installationEntry: installationEntry,
            registrationPromise: registrationPromise
          }];
      }
    });
  });
}
/**
 * Creates a new Installation Entry if one does not exist.
 * Also clears timed out pending requests.
 */


function updateOrCreateInstallationEntry(oldEntry) {
  var entry = oldEntry || {
    fid: generateFid(),
    registrationStatus: 0
    /* NOT_STARTED */

  };
  return clearTimedOutRequest(entry);
}
/**
 * If the Firebase Installation is not registered yet, this will trigger the
 * registration and return an InProgressInstallationEntry.
 *
 * If registrationPromise does not exist, the installationEntry is guaranteed
 * to be registered.
 */


function triggerRegistrationIfNecessary(appConfig, installationEntry) {
  if (installationEntry.registrationStatus === 0
  /* NOT_STARTED */
  ) {
      if (!navigator.onLine) {
        // Registration required but app is offline.
        var registrationPromiseWithError = Promise.reject(ERROR_FACTORY$1.create("app-offline"
        /* APP_OFFLINE */
        ));
        return {
          installationEntry: installationEntry,
          registrationPromise: registrationPromiseWithError
        };
      } // Try registering. Change status to IN_PROGRESS.


      var inProgressEntry = {
        fid: installationEntry.fid,
        registrationStatus: 1
        /* IN_PROGRESS */
        ,
        registrationTime: Date.now()
      };
      var registrationPromise = registerInstallation(appConfig, inProgressEntry);
      return {
        installationEntry: inProgressEntry,
        registrationPromise: registrationPromise
      };
    } else if (installationEntry.registrationStatus === 1
  /* IN_PROGRESS */
  ) {
      return {
        installationEntry: installationEntry,
        registrationPromise: waitUntilFidRegistration(appConfig)
      };
    } else {
    return {
      installationEntry: installationEntry
    };
  }
}
/** This will be executed only once for each new Firebase Installation. */


function registerInstallation(appConfig, installationEntry) {
  return __awaiter$1(this, void 0, void 0, function () {
    var registeredInstallationEntry, e_1;
    return __generator$1(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2,, 7]);

          return [4
          /*yield*/
          , createInstallationRequest(appConfig, installationEntry)];

        case 1:
          registeredInstallationEntry = _a.sent();
          return [2
          /*return*/
          , set(appConfig, registeredInstallationEntry)];

        case 2:
          e_1 = _a.sent();
          if (!(isServerError(e_1) && e_1.serverCode === 409)) return [3
          /*break*/
          , 4]; // Server returned a "FID can not be used" error.
          // Generate a new ID next time.

          return [4
          /*yield*/
          , remove(appConfig)];

        case 3:
          // Server returned a "FID can not be used" error.
          // Generate a new ID next time.
          _a.sent();

          return [3
          /*break*/
          , 6];

        case 4:
          // Registration failed. Set FID as not registered.
          return [4
          /*yield*/
          , set(appConfig, {
            fid: installationEntry.fid,
            registrationStatus: 0
            /* NOT_STARTED */

          })];

        case 5:
          // Registration failed. Set FID as not registered.
          _a.sent();

          _a.label = 6;

        case 6:
          throw e_1;

        case 7:
          return [2
          /*return*/
          ];
      }
    });
  });
}
/** Call if FID registration is pending in another request. */


function waitUntilFidRegistration(appConfig) {
  return __awaiter$1(this, void 0, void 0, function () {
    var entry, _a, installationEntry, registrationPromise;

    return __generator$1(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4
          /*yield*/
          , updateInstallationRequest(appConfig)];

        case 1:
          entry = _b.sent();
          _b.label = 2;

        case 2:
          if (!(entry.registrationStatus === 1
          /* IN_PROGRESS */
          )) return [3
            /*break*/
            , 5]; // createInstallation request still in progress.

          return [4
          /*yield*/
          , sleep(100)];

        case 3:
          // createInstallation request still in progress.
          _b.sent();

          return [4
          /*yield*/
          , updateInstallationRequest(appConfig)];

        case 4:
          entry = _b.sent();
          return [3
          /*break*/
          , 2];

        case 5:
          if (!(entry.registrationStatus === 0
          /* NOT_STARTED */
          )) return [3
            /*break*/
            , 7];
          return [4
          /*yield*/
          , getInstallationEntry(appConfig)];

        case 6:
          _a = _b.sent(), installationEntry = _a.installationEntry, registrationPromise = _a.registrationPromise;

          if (registrationPromise) {
            return [2
            /*return*/
            , registrationPromise];
          } else {
            // if there is no registrationPromise, entry is registered.
            return [2
            /*return*/
            , installationEntry];
          }

        case 7:
          return [2
          /*return*/
          , entry];
      }
    });
  });
}
/**
 * Called only if there is a CreateInstallation request in progress.
 *
 * Updates the InstallationEntry in the DB based on the status of the
 * CreateInstallation request.
 *
 * Returns the updated InstallationEntry.
 */


function updateInstallationRequest(appConfig) {
  return update(appConfig, function (oldEntry) {
    if (!oldEntry) {
      throw ERROR_FACTORY$1.create("installation-not-found"
      /* INSTALLATION_NOT_FOUND */
      );
    }

    return clearTimedOutRequest(oldEntry);
  });
}

function clearTimedOutRequest(entry) {
  if (hasInstallationRequestTimedOut(entry)) {
    return {
      fid: entry.fid,
      registrationStatus: 0
      /* NOT_STARTED */

    };
  }

  return entry;
}

function hasInstallationRequestTimedOut(installationEntry) {
  return installationEntry.registrationStatus === 1
  /* IN_PROGRESS */
  && installationEntry.registrationTime + PENDING_TIMEOUT_MS < Date.now();
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


function generateAuthTokenRequest(_a, installationEntry) {
  var appConfig = _a.appConfig,
      platformLoggerProvider = _a.platformLoggerProvider;
  return __awaiter$1(this, void 0, void 0, function () {
    var endpoint, headers, platformLogger, body, request, response, responseValue, completedAuthToken;
    return __generator$1(this, function (_b) {
      switch (_b.label) {
        case 0:
          endpoint = getGenerateAuthTokenEndpoint(appConfig, installationEntry);
          headers = getHeadersWithAuth(appConfig, installationEntry);
          platformLogger = platformLoggerProvider.getImmediate({
            optional: true
          });

          if (platformLogger) {
            headers.append('x-firebase-client', platformLogger.getPlatformInfoString());
          }

          body = {
            installation: {
              sdkVersion: PACKAGE_VERSION
            }
          };
          request = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
          };
          return [4
          /*yield*/
          , retryIfServerError(function () {
            return fetch(endpoint, request);
          })];

        case 1:
          response = _b.sent();
          if (!response.ok) return [3
          /*break*/
          , 3];
          return [4
          /*yield*/
          , response.json()];

        case 2:
          responseValue = _b.sent();
          completedAuthToken = extractAuthTokenInfoFromResponse(responseValue);
          return [2
          /*return*/
          , completedAuthToken];

        case 3:
          return [4
          /*yield*/
          , getErrorFromResponse('Generate Auth Token', response)];

        case 4:
          throw _b.sent();
      }
    });
  });
}

function getGenerateAuthTokenEndpoint(appConfig, _a) {
  var fid = _a.fid;
  return getInstallationsEndpoint(appConfig) + "/" + fid + "/authTokens:generate";
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Returns a valid authentication token for the installation. Generates a new
 * token if one doesn't exist, is expired or about to expire.
 *
 * Should only be called if the Firebase Installation is registered.
 */


function refreshAuthToken(dependencies, forceRefresh) {
  if (forceRefresh === void 0) {
    forceRefresh = false;
  }

  return __awaiter$1(this, void 0, void 0, function () {
    var tokenPromise, entry, authToken, _a;

    return __generator$1(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4
          /*yield*/
          , update(dependencies.appConfig, function (oldEntry) {
            if (!isEntryRegistered(oldEntry)) {
              throw ERROR_FACTORY$1.create("not-registered"
              /* NOT_REGISTERED */
              );
            }

            var oldAuthToken = oldEntry.authToken;

            if (!forceRefresh && isAuthTokenValid(oldAuthToken)) {
              // There is a valid token in the DB.
              return oldEntry;
            } else if (oldAuthToken.requestStatus === 1
            /* IN_PROGRESS */
            ) {
                // There already is a token request in progress.
                tokenPromise = waitUntilAuthTokenRequest(dependencies, forceRefresh);
                return oldEntry;
              } else {
              // No token or token expired.
              if (!navigator.onLine) {
                throw ERROR_FACTORY$1.create("app-offline"
                /* APP_OFFLINE */
                );
              }

              var inProgressEntry = makeAuthTokenRequestInProgressEntry(oldEntry);
              tokenPromise = fetchAuthTokenFromServer(dependencies, inProgressEntry);
              return inProgressEntry;
            }
          })];

        case 1:
          entry = _b.sent();
          if (!tokenPromise) return [3
          /*break*/
          , 3];
          return [4
          /*yield*/
          , tokenPromise];

        case 2:
          _a = _b.sent();
          return [3
          /*break*/
          , 4];

        case 3:
          _a = entry.authToken;
          _b.label = 4;

        case 4:
          authToken = _a;
          return [2
          /*return*/
          , authToken];
      }
    });
  });
}
/**
 * Call only if FID is registered and Auth Token request is in progress.
 *
 * Waits until the current pending request finishes. If the request times out,
 * tries once in this thread as well.
 */


function waitUntilAuthTokenRequest(dependencies, forceRefresh) {
  return __awaiter$1(this, void 0, void 0, function () {
    var entry, authToken;
    return __generator$1(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , updateAuthTokenRequest(dependencies.appConfig)];

        case 1:
          entry = _a.sent();
          _a.label = 2;

        case 2:
          if (!(entry.authToken.requestStatus === 1
          /* IN_PROGRESS */
          )) return [3
            /*break*/
            , 5]; // generateAuthToken still in progress.

          return [4
          /*yield*/
          , sleep(100)];

        case 3:
          // generateAuthToken still in progress.
          _a.sent();

          return [4
          /*yield*/
          , updateAuthTokenRequest(dependencies.appConfig)];

        case 4:
          entry = _a.sent();
          return [3
          /*break*/
          , 2];

        case 5:
          authToken = entry.authToken;

          if (authToken.requestStatus === 0
          /* NOT_STARTED */
          ) {
              // The request timed out or failed in a different call. Try again.
              return [2
              /*return*/
              , refreshAuthToken(dependencies, forceRefresh)];
            } else {
            return [2
            /*return*/
            , authToken];
          }

      }
    });
  });
}
/**
 * Called only if there is a GenerateAuthToken request in progress.
 *
 * Updates the InstallationEntry in the DB based on the status of the
 * GenerateAuthToken request.
 *
 * Returns the updated InstallationEntry.
 */


function updateAuthTokenRequest(appConfig) {
  return update(appConfig, function (oldEntry) {
    if (!isEntryRegistered(oldEntry)) {
      throw ERROR_FACTORY$1.create("not-registered"
      /* NOT_REGISTERED */
      );
    }

    var oldAuthToken = oldEntry.authToken;

    if (hasAuthTokenRequestTimedOut(oldAuthToken)) {
      return _assign$2(_assign$2({}, oldEntry), {
        authToken: {
          requestStatus: 0
          /* NOT_STARTED */

        }
      });
    }

    return oldEntry;
  });
}

function fetchAuthTokenFromServer(dependencies, installationEntry) {
  return __awaiter$1(this, void 0, void 0, function () {
    var authToken, updatedInstallationEntry, e_1, updatedInstallationEntry;
    return __generator$1(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 3,, 8]);

          return [4
          /*yield*/
          , generateAuthTokenRequest(dependencies, installationEntry)];

        case 1:
          authToken = _a.sent();
          updatedInstallationEntry = _assign$2(_assign$2({}, installationEntry), {
            authToken: authToken
          });
          return [4
          /*yield*/
          , set(dependencies.appConfig, updatedInstallationEntry)];

        case 2:
          _a.sent();

          return [2
          /*return*/
          , authToken];

        case 3:
          e_1 = _a.sent();
          if (!(isServerError(e_1) && (e_1.serverCode === 401 || e_1.serverCode === 404))) return [3
          /*break*/
          , 5]; // Server returned a "FID not found" or a "Invalid authentication" error.
          // Generate a new ID next time.

          return [4
          /*yield*/
          , remove(dependencies.appConfig)];

        case 4:
          // Server returned a "FID not found" or a "Invalid authentication" error.
          // Generate a new ID next time.
          _a.sent();

          return [3
          /*break*/
          , 7];

        case 5:
          updatedInstallationEntry = _assign$2(_assign$2({}, installationEntry), {
            authToken: {
              requestStatus: 0
              /* NOT_STARTED */

            }
          });
          return [4
          /*yield*/
          , set(dependencies.appConfig, updatedInstallationEntry)];

        case 6:
          _a.sent();

          _a.label = 7;

        case 7:
          throw e_1;

        case 8:
          return [2
          /*return*/
          ];
      }
    });
  });
}

function isEntryRegistered(installationEntry) {
  return installationEntry !== undefined && installationEntry.registrationStatus === 2
  /* COMPLETED */
  ;
}

function isAuthTokenValid(authToken) {
  return authToken.requestStatus === 2
  /* COMPLETED */
  && !isAuthTokenExpired(authToken);
}

function isAuthTokenExpired(authToken) {
  var now = Date.now();
  return now < authToken.creationTime || authToken.creationTime + authToken.expiresIn < now + TOKEN_EXPIRATION_BUFFER;
}
/** Returns an updated InstallationEntry with an InProgressAuthToken. */


function makeAuthTokenRequestInProgressEntry(oldEntry) {
  var inProgressAuthToken = {
    requestStatus: 1
    /* IN_PROGRESS */
    ,
    requestTime: Date.now()
  };
  return _assign$2(_assign$2({}, oldEntry), {
    authToken: inProgressAuthToken
  });
}

function hasAuthTokenRequestTimedOut(authToken) {
  return authToken.requestStatus === 1
  /* IN_PROGRESS */
  && authToken.requestTime + PENDING_TIMEOUT_MS < Date.now();
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


function _getId(dependencies) {
  return __awaiter$1(this, void 0, void 0, function () {
    var _a, installationEntry, registrationPromise;

    return __generator$1(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4
          /*yield*/
          , getInstallationEntry(dependencies.appConfig)];

        case 1:
          _a = _b.sent(), installationEntry = _a.installationEntry, registrationPromise = _a.registrationPromise;

          if (registrationPromise) {
            registrationPromise.catch(console.error);
          } else {
            // If the installation is already registered, update the authentication
            // token if needed.
            refreshAuthToken(dependencies).catch(console.error);
          }

          return [2
          /*return*/
          , installationEntry.fid];
      }
    });
  });
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


function _getToken(dependencies, forceRefresh) {
  if (forceRefresh === void 0) {
    forceRefresh = false;
  }

  return __awaiter$1(this, void 0, void 0, function () {
    var authToken;
    return __generator$1(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , completeInstallationRegistration(dependencies.appConfig)];

        case 1:
          _a.sent();

          return [4
          /*yield*/
          , refreshAuthToken(dependencies, forceRefresh)];

        case 2:
          authToken = _a.sent();
          return [2
          /*return*/
          , authToken.token];
      }
    });
  });
}

function completeInstallationRegistration(appConfig) {
  return __awaiter$1(this, void 0, void 0, function () {
    var registrationPromise;
    return __generator$1(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , getInstallationEntry(appConfig)];

        case 1:
          registrationPromise = _a.sent().registrationPromise;
          if (!registrationPromise) return [3
          /*break*/
          , 3]; // A createInstallation request is in progress. Wait until it finishes.

          return [4
          /*yield*/
          , registrationPromise];

        case 2:
          // A createInstallation request is in progress. Wait until it finishes.
          _a.sent();

          _a.label = 3;

        case 3:
          return [2
          /*return*/
          ];
      }
    });
  });
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


function deleteInstallationRequest(appConfig, installationEntry) {
  return __awaiter$1(this, void 0, void 0, function () {
    var endpoint, headers, request, response;
    return __generator$1(this, function (_a) {
      switch (_a.label) {
        case 0:
          endpoint = getDeleteEndpoint(appConfig, installationEntry);
          headers = getHeadersWithAuth(appConfig, installationEntry);
          request = {
            method: 'DELETE',
            headers: headers
          };
          return [4
          /*yield*/
          , retryIfServerError(function () {
            return fetch(endpoint, request);
          })];

        case 1:
          response = _a.sent();
          if (!!response.ok) return [3
          /*break*/
          , 3];
          return [4
          /*yield*/
          , getErrorFromResponse('Delete Installation', response)];

        case 2:
          throw _a.sent();

        case 3:
          return [2
          /*return*/
          ];
      }
    });
  });
}

function getDeleteEndpoint(appConfig, _a) {
  var fid = _a.fid;
  return getInstallationsEndpoint(appConfig) + "/" + fid;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


function deleteInstallation(dependencies) {
  return __awaiter$1(this, void 0, void 0, function () {
    var appConfig, entry;
    return __generator$1(this, function (_a) {
      switch (_a.label) {
        case 0:
          appConfig = dependencies.appConfig;
          return [4
          /*yield*/
          , update(appConfig, function (oldEntry) {
            if (oldEntry && oldEntry.registrationStatus === 0
            /* NOT_STARTED */
            ) {
                // Delete the unregistered entry without sending a deleteInstallation request.
                return undefined;
              }

            return oldEntry;
          })];

        case 1:
          entry = _a.sent();
          if (!entry) return [3
          /*break*/
          , 6];
          if (!(entry.registrationStatus === 1
          /* IN_PROGRESS */
          )) return [3
            /*break*/
            , 2]; // Can't delete while trying to register.

          throw ERROR_FACTORY$1.create("delete-pending-registration"
          /* DELETE_PENDING_REGISTRATION */
          );

        case 2:
          if (!(entry.registrationStatus === 2
          /* COMPLETED */
          )) return [3
            /*break*/
            , 6];
          if (!!navigator.onLine) return [3
          /*break*/
          , 3];
          throw ERROR_FACTORY$1.create("app-offline"
          /* APP_OFFLINE */
          );

        case 3:
          return [4
          /*yield*/
          , deleteInstallationRequest(appConfig, entry)];

        case 4:
          _a.sent();

          return [4
          /*yield*/
          , remove(appConfig)];

        case 5:
          _a.sent();

          _a.label = 6;

        case 6:
          return [2
          /*return*/
          ];
      }
    });
  });
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Sets a new callback that will get called when Installation ID changes.
 * Returns an unsubscribe function that will remove the callback when called.
 */


function _onIdChange(_a, callback) {
  var appConfig = _a.appConfig;
  addCallback(appConfig, callback);
  return function () {
    removeCallback(appConfig, callback);
  };
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


function extractAppConfig(app) {
  var e_1, _a;

  if (!app || !app.options) {
    throw getMissingValueError('App Configuration');
  }

  if (!app.name) {
    throw getMissingValueError('App Name');
  } // Required app config keys


  var configKeys = ['projectId', 'apiKey', 'appId'];

  try {
    for (var configKeys_1 = __values$2(configKeys), configKeys_1_1 = configKeys_1.next(); !configKeys_1_1.done; configKeys_1_1 = configKeys_1.next()) {
      var keyName = configKeys_1_1.value;

      if (!app.options[keyName]) {
        throw getMissingValueError(keyName);
      }
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (configKeys_1_1 && !configKeys_1_1.done && (_a = configKeys_1.return)) _a.call(configKeys_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  return {
    appName: app.name,
    projectId: app.options.projectId,
    apiKey: app.options.apiKey,
    appId: app.options.appId
  };
}

function getMissingValueError(valueName) {
  return ERROR_FACTORY$1.create("missing-app-config-values"
  /* MISSING_APP_CONFIG_VALUES */
  , {
    valueName: valueName
  });
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


function registerInstallations(instance) {
  var installationsName = 'installations';
  instance.INTERNAL.registerComponent(new Component(installationsName, function (container) {
    var app = container.getProvider('app').getImmediate(); // Throws if app isn't configured properly.

    var appConfig = extractAppConfig(app);
    var platformLoggerProvider = container.getProvider('platform-logger');
    var dependencies = {
      appConfig: appConfig,
      platformLoggerProvider: platformLoggerProvider
    };
    var installations = {
      app: app,
      getId: function getId() {
        return _getId(dependencies);
      },
      getToken: function getToken(forceRefresh) {
        return _getToken(dependencies, forceRefresh);
      },
      delete: function _delete() {
        return deleteInstallation(dependencies);
      },
      onIdChange: function onIdChange(callback) {
        return _onIdChange(dependencies, callback);
      }
    };
    return installations;
  }, "PUBLIC"
  /* PUBLIC */
  ));
  instance.registerVersion(name$e, version$3);
}

registerInstallations(firebase$1);

var _assign$3 = function __assign() {
  _assign$3 = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return _assign$3.apply(this, arguments);
};
function __awaiter$2(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator$2(thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var ANALYTICS_ID_FIELD = 'measurementId'; // Key to attach FID to in gtag params.

var GA_FID_KEY = 'firebase_id';
var ORIGIN_KEY = 'origin';
var GTAG_URL = 'https://www.googletagmanager.com/gtag/js';
var GtagCommand;

(function (GtagCommand) {
  GtagCommand["EVENT"] = "event";
  GtagCommand["SET"] = "set";
  GtagCommand["CONFIG"] = "config";
})(GtagCommand || (GtagCommand = {}));
/*
 * Officially recommended event names for gtag.js
 * Any other string is also allowed.
 */


var EventName;

(function (EventName) {
  EventName["ADD_SHIPPING_INFO"] = "add_shipping_info";
  EventName["ADD_PAYMENT_INFO"] = "add_payment_info";
  EventName["ADD_TO_CART"] = "add_to_cart";
  EventName["ADD_TO_WISHLIST"] = "add_to_wishlist";
  EventName["BEGIN_CHECKOUT"] = "begin_checkout";
  /** @deprecated */

  EventName["CHECKOUT_PROGRESS"] = "checkout_progress";
  EventName["EXCEPTION"] = "exception";
  EventName["GENERATE_LEAD"] = "generate_lead";
  EventName["LOGIN"] = "login";
  EventName["PAGE_VIEW"] = "page_view";
  EventName["PURCHASE"] = "purchase";
  EventName["REFUND"] = "refund";
  EventName["REMOVE_FROM_CART"] = "remove_from_cart";
  EventName["SCREEN_VIEW"] = "screen_view";
  EventName["SEARCH"] = "search";
  EventName["SELECT_CONTENT"] = "select_content";
  EventName["SELECT_ITEM"] = "select_item";
  EventName["SELECT_PROMOTION"] = "select_promotion";
  /** @deprecated */

  EventName["SET_CHECKOUT_OPTION"] = "set_checkout_option";
  EventName["SHARE"] = "share";
  EventName["SIGN_UP"] = "sign_up";
  EventName["TIMING_COMPLETE"] = "timing_complete";
  EventName["VIEW_CART"] = "view_cart";
  EventName["VIEW_ITEM"] = "view_item";
  EventName["VIEW_ITEM_LIST"] = "view_item_list";
  EventName["VIEW_PROMOTION"] = "view_promotion";
  EventName["VIEW_SEARCH_RESULTS"] = "view_search_results";
})(EventName || (EventName = {}));
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Logs an analytics event through the Firebase SDK.
 *
 * @param gtagFunction Wrapped gtag function that waits for fid to be set before sending an event
 * @param eventName Google Analytics event name, choose from standard list or use a custom string.
 * @param eventParams Analytics event parameters.
 */


function _logEvent(gtagFunction, analyticsId, eventName, eventParams, options) {
  var params = eventParams || {};

  if (!options || !options.global) {
    params = _assign$3(_assign$3({}, eventParams), {
      'send_to': analyticsId
    });
  } // Workaround for http://b/141370449 - third argument cannot be undefined.


  gtagFunction(GtagCommand.EVENT, eventName, params || {});
} // TODO: Brad is going to add `screen_name` to GA Gold config parameter schema

/**
 * Set screen_name parameter for this Google Analytics ID.
 *
 * @param gtagFunction Wrapped gtag function that waits for fid to be set before sending an event
 * @param screenName Screen name string to set.
 */


function _setCurrentScreen(gtagFunction, analyticsId, screenName, options) {
  if (options && options.global) {
    gtagFunction(GtagCommand.SET, {
      'screen_name': screenName
    });
  } else {
    gtagFunction(GtagCommand.CONFIG, analyticsId, {
      update: true,
      'screen_name': screenName
    });
  }
}
/**
 * Set user_id parameter for this Google Analytics ID.
 *
 * @param gtagFunction Wrapped gtag function that waits for fid to be set before sending an event
 * @param id User ID string to set
 */


function _setUserId(gtagFunction, analyticsId, id, options) {
  if (options && options.global) {
    gtagFunction(GtagCommand.SET, {
      'user_id': id
    });
  } else {
    gtagFunction(GtagCommand.CONFIG, analyticsId, {
      update: true,
      'user_id': id
    });
  }
}
/**
 * Set all other user properties other than user_id and screen_name.
 *
 * @param gtagFunction Wrapped gtag function that waits for fid to be set before sending an event
 * @param properties Map of user properties to set
 */


function _setUserProperties(gtagFunction, analyticsId, properties, options) {
  if (options && options.global) {
    var flatProperties = {};

    for (var _i = 0, _a = Object.keys(properties); _i < _a.length; _i++) {
      var key = _a[_i]; // use dot notation for merge behavior in gtag.js

      flatProperties["user_properties." + key] = properties[key];
    }

    gtagFunction(GtagCommand.SET, flatProperties);
  } else {
    gtagFunction(GtagCommand.CONFIG, analyticsId, {
      update: true,
      'user_properties': properties
    });
  }
}
/**
 * Set whether collection is enabled for this ID.
 *
 * @param enabled If true, collection is enabled for this ID.
 */


function _setAnalyticsCollectionEnabled(analyticsId, enabled) {
  window["ga-disable-" + analyticsId] = !enabled;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var logger$1 = new Logger('@firebase/analytics');
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Initialize the analytics instance in gtag.js by calling config command with fid.
 *
 * NOTE: We combine analytics initialization and setting fid together because we want fid to be
 * part of the `page_view` event that's sent during the initialization
 * @param app Firebase app
 * @param gtagCore The gtag function that's not wrapped.
 */

function initializeGAId(app, installations, gtagCore) {
  return __awaiter$2(this, void 0, void 0, function () {
    var fid;

    var _a;

    return __generator$2(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4
          /*yield*/
          , installations.getId()];

        case 1:
          fid = _b.sent(); // This command initializes gtag.js and only needs to be called once for the entire web app,
          // but since it is idempotent, we can call it multiple times.
          // We keep it together with other initialization logic for better code structure.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any

          gtagCore('js', new Date()); // It should be the first config command called on this GA-ID
          // Initialize this GA-ID and set FID on it using the gtag config API.

          gtagCore(GtagCommand.CONFIG, app.options[ANALYTICS_ID_FIELD], (_a = {}, _a[GA_FID_KEY] = fid, // guard against developers accidentally setting properties with prefix `firebase_`
          _a[ORIGIN_KEY] = 'firebase', _a.update = true, _a));
          return [2
          /*return*/
          ];
      }
    });
  });
}

function insertScriptTag(dataLayerName) {
  var script = document.createElement('script'); // We are not providing an analyticsId in the URL because it would trigger a `page_view`
  // without fid. We will initialize ga-id using gtag (config) command together with fid.

  script.src = GTAG_URL + "?l=" + dataLayerName;
  script.async = true;
  document.head.appendChild(script);
}
/** Get reference to, or create, global datalayer.
 * @param dataLayerName Name of datalayer (most often the default, "_dataLayer")
 */


function getOrCreateDataLayer(dataLayerName) {
  // Check for existing dataLayer and create if needed.
  var dataLayer = [];

  if (Array.isArray(window[dataLayerName])) {
    dataLayer = window[dataLayerName];
  } else {
    window[dataLayerName] = dataLayer;
  }

  return dataLayer;
}
/**
 * Wraps a standard gtag function with extra code to wait for completion of
 * relevant initialization promises before sending requests.
 *
 * @param gtagCore Basic gtag function that just appends to dataLayer
 * @param initializedIdPromisesMap Map of gaIds to their initialization promises
 */


function wrapGtag(gtagCore, initializedIdPromisesMap) {
  return function (command, idOrNameOrParams, gtagParams) {
    // If event, check that relevant initialization promises have completed.
    if (command === GtagCommand.EVENT) {
      var initializationPromisesToWaitFor = []; // If there's a 'send_to' param, check if any ID specified matches
      // a FID we have begun a fetch on.

      if (gtagParams && gtagParams['send_to']) {
        var gaSendToList = gtagParams['send_to']; // Make it an array if is isn't, so it can be dealt with the same way.

        if (!Array.isArray(gaSendToList)) {
          gaSendToList = [gaSendToList];
        }

        for (var _i = 0, gaSendToList_1 = gaSendToList; _i < gaSendToList_1.length; _i++) {
          var sendToId = gaSendToList_1[_i];
          var initializationPromise = initializedIdPromisesMap[sendToId]; // Groups will not be in the map.

          if (initializationPromise) {
            initializationPromisesToWaitFor.push(initializationPromise);
          } else {
            // There is an item in 'send_to' that is not associated
            // directly with an FID, possibly a group.  Empty this array
            // and let it get populated below.
            initializationPromisesToWaitFor = [];
            break;
          }
        }
      } // This will be unpopulated if there was no 'send_to' field , or
      // if not all entries in the 'send_to' field could be mapped to
      // a FID. In these cases, wait on all pending initialization promises.


      if (initializationPromisesToWaitFor.length === 0) {
        for (var _a = 0, _b = Object.values(initializedIdPromisesMap); _a < _b.length; _a++) {
          var idPromise = _b[_a];
          initializationPromisesToWaitFor.push(idPromise);
        }
      } // Run core gtag function with args after all relevant initialization
      // promises have been resolved.


      Promise.all(initializationPromisesToWaitFor) // Workaround for http://b/141370449 - third argument cannot be undefined.
      .then(function () {
        return gtagCore(GtagCommand.EVENT, idOrNameOrParams, gtagParams || {});
      }).catch(function (e) {
        return logger$1.error(e);
      });
    } else if (command === GtagCommand.CONFIG) {
      var initializationPromiseToWait = initializedIdPromisesMap[idOrNameOrParams] || Promise.resolve();
      initializationPromiseToWait.then(function () {
        gtagCore(GtagCommand.CONFIG, idOrNameOrParams, gtagParams);
      }).catch(function (e) {
        return logger$1.error(e);
      });
    } else {
      // SET command.
      // Splitting calls for CONFIG and SET to make it clear which signature
      // Typescript is checking.
      gtagCore(GtagCommand.SET, idOrNameOrParams);
    }
  };
}
/**
 * Creates global gtag function or wraps existing one if found.
 * This wrapped function attaches Firebase instance ID (FID) to gtag 'config' and
 * 'event' calls that belong to the GAID associated with this Firebase instance.
 *
 * @param initializedIdPromisesMap Map of gaId to initialization promises.
 * @param dataLayerName Name of global GA datalayer array.
 * @param gtagFunctionName Name of global gtag function ("gtag" if not user-specified)
 */


function wrapOrCreateGtag(initializedIdPromisesMap, dataLayerName, gtagFunctionName) {
  // Create a basic core gtag function
  var gtagCore = function gtagCore() {
    var _args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      _args[_i] = arguments[_i];
    } // Must push IArguments object, not an array.


    window[dataLayerName].push(arguments);
  }; // Replace it with existing one if found


  if (window[gtagFunctionName] && typeof window[gtagFunctionName] === 'function') {
    // @ts-ignore
    gtagCore = window[gtagFunctionName];
  }

  window[gtagFunctionName] = wrapGtag(gtagCore, initializedIdPromisesMap);
  return {
    gtagCore: gtagCore,
    wrappedGtag: window[gtagFunctionName]
  };
}
/**
 * Returns first script tag in DOM matching our gtag url pattern.
 */


function findGtagScriptOnPage() {
  var scriptTags = window.document.getElementsByTagName('script');

  for (var _i = 0, _a = Object.values(scriptTags); _i < _a.length; _i++) {
    var tag = _a[_i];

    if (tag.src && tag.src.includes(GTAG_URL)) {
      return tag;
    }
  }

  return null;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var _a$3;

var ERRORS$1 = (_a$3 = {}, _a$3["no-ga-id"
/* NO_GA_ID */
] = "\"" + ANALYTICS_ID_FIELD + "\" field is empty in " + 'Firebase config. Firebase Analytics ' + 'requires this field to contain a valid measurement ID.', _a$3["already-exists"
/* ALREADY_EXISTS */
] = 'A Firebase Analytics instance with the measurement ID ${id} ' + ' already exists. ' + 'Only one Firebase Analytics instance can be created for each measurement ID.', _a$3["already-initialized"
/* ALREADY_INITIALIZED */
] = 'Firebase Analytics has already been initialized.' + 'settings() must be called before initializing any Analytics instance' + 'or it will have no effect.', _a$3["interop-component-reg-failed"
/* INTEROP_COMPONENT_REG_FAILED */
] = 'Firebase Analytics Interop Component failed to instantiate', _a$3);
var ERROR_FACTORY$2 = new ErrorFactory('analytics', 'Analytics', ERRORS$1);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Maps gaId to FID fetch promises.
 */

var initializedIdPromisesMap = {};
/**
 * Name for window global data layer array used by GA: defaults to 'dataLayer'.
 */

var dataLayerName = 'dataLayer';
/**
 * Name for window global gtag function used by GA: defaults to 'gtag'.
 */

var gtagName = 'gtag';
/**
 * Reproduction of standard gtag function or reference to existing
 * gtag function on window object.
 */

var gtagCoreFunction;
/**
 * Wrapper around gtag function that ensures FID is sent with all
 * relevant event and config calls.
 */

var wrappedGtagFunction;
/**
 * Flag to ensure page initialization steps (creation or wrapping of
 * dataLayer and gtag script) are only run once per page load.
 */

var globalInitDone = false;
/**
 * This must be run before calling firebase.analytics() or it won't
 * have any effect.
 * @param options Custom gtag and dataLayer names.
 */


function settings(options) {
  if (globalInitDone) {
    throw ERROR_FACTORY$2.create("already-initialized"
    /* ALREADY_INITIALIZED */
    );
  }

  if (options.dataLayerName) {
    dataLayerName = options.dataLayerName;
  }

  if (options.gtagName) {
    gtagName = options.gtagName;
  }
}

function factory(app, installations) {
  var analyticsId = app.options[ANALYTICS_ID_FIELD];

  if (!analyticsId) {
    throw ERROR_FACTORY$2.create("no-ga-id"
    /* NO_GA_ID */
    );
  }

  if (initializedIdPromisesMap[analyticsId] != null) {
    throw ERROR_FACTORY$2.create("already-exists"
    /* ALREADY_EXISTS */
    , {
      id: analyticsId
    });
  }

  if (!globalInitDone) {
    // Steps here should only be done once per page: creation or wrapping
    // of dataLayer and global gtag function.
    // Detect if user has already put the gtag <script> tag on this page.
    if (!findGtagScriptOnPage()) {
      insertScriptTag(dataLayerName);
    }

    getOrCreateDataLayer(dataLayerName);

    var _a = wrapOrCreateGtag(initializedIdPromisesMap, dataLayerName, gtagName),
        wrappedGtag = _a.wrappedGtag,
        gtagCore = _a.gtagCore;

    wrappedGtagFunction = wrappedGtag;
    gtagCoreFunction = gtagCore;
    globalInitDone = true;
  } // Async but non-blocking.


  initializedIdPromisesMap[analyticsId] = initializeGAId(app, installations, gtagCoreFunction);
  var analyticsInstance = {
    app: app,
    logEvent: function logEvent(eventName, eventParams, options) {
      return _logEvent(wrappedGtagFunction, analyticsId, eventName, eventParams, options);
    },
    setCurrentScreen: function setCurrentScreen(screenName, options) {
      return _setCurrentScreen(wrappedGtagFunction, analyticsId, screenName, options);
    },
    setUserId: function setUserId(id, options) {
      return _setUserId(wrappedGtagFunction, analyticsId, id, options);
    },
    setUserProperties: function setUserProperties(properties, options) {
      return _setUserProperties(wrappedGtagFunction, analyticsId, properties, options);
    },
    setAnalyticsCollectionEnabled: function setAnalyticsCollectionEnabled(enabled) {
      return _setAnalyticsCollectionEnabled(analyticsId, enabled);
    }
  };
  return analyticsInstance;
}

var name$f = "@firebase/analytics";
var version$4 = "0.3.6";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Type constant for Firebase Analytics.
 */

var ANALYTICS_TYPE = 'analytics';

function registerAnalytics(instance) {
  instance.INTERNAL.registerComponent(new Component(ANALYTICS_TYPE, function (container) {
    // getImmediate for FirebaseApp will always succeed
    var app = container.getProvider('app').getImmediate();
    var installations = container.getProvider('installations').getImmediate();
    return factory(app, installations);
  }, "PUBLIC"
  /* PUBLIC */
  ).setServiceProps({
    settings: settings,
    EventName: EventName
  }));
  instance.INTERNAL.registerComponent(new Component('analytics-internal', internalFactory, "PRIVATE"
  /* PRIVATE */
  ));
  instance.registerVersion(name$f, version$4);

  function internalFactory(container) {
    try {
      var analytics = container.getProvider(ANALYTICS_TYPE).getImmediate();
      return {
        logEvent: analytics.logEvent
      };
    } catch (e) {
      throw ERROR_FACTORY$2.create("interop-component-reg-failed"
      /* INTEROP_COMPONENT_REG_FAILED */
      , {
        reason: e
      });
    }
  }
}

registerAnalytics(firebase$1);

function loadScript(src) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.defer = true;
  script.src = src;
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(script, firstScript);
  return new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onerror = reject;
  });
}

function trim(object) {
  for (const key in object) {
    if (typeof object[key] === 'undefined') {
      delete object[key];
    }

    if (object[key] === null) {
      delete object[key];
    }
  }
}
function convertStringToSankecase(str) {
  const upperCaseMap = new Map();
  const strArray = Array.from(str);
  strArray.forEach((char, index) => {
    const currentCharCode = char.charCodeAt(0);
    const asciiCodeA = 'A'.charCodeAt(0);
    const asciiCodeZ = 'Z'.charCodeAt(0);

    if (currentCharCode >= asciiCodeA && currentCharCode <= asciiCodeZ) {
      upperCaseMap.set(index, char);
    }
  });
  upperCaseMap.forEach((value, key) => {
    strArray[key] = `_${value.toLowerCase()}`;
  });
  return strArray.join('');
}
function convertParamsToSankecase(params) {
  return Object.keys(params).reduce((prev, key) => {
    const currentParams = prev;
    const snakecaseKey = convertStringToSankecase(key);
    currentParams[snakecaseKey] = params[key];
    return currentParams;
  }, {});
}

/* eslint-disable @typescript-eslint/camelcase */
var AgentState;

(function (AgentState) {
  AgentState[AgentState["Uninitialized"] = 0] = "Uninitialized";
  AgentState[AgentState["Initializing"] = 1] = "Initializing";
  AgentState[AgentState["Initialized"] = 2] = "Initialized";
  AgentState[AgentState["InitializeFail"] = 3] = "InitializeFail";
})(AgentState || (AgentState = {}));

class Agent {
  constructor() {
    this.state = AgentState.Uninitialized;
  }

  async initialize() {
    if (this.state !== AgentState.Uninitialized) return;
    this.state = AgentState.Initializing;

    try {
      await this.doInitialize();
      this.state = AgentState.Initialized;
    } catch (error) {
      console.error(error);
      this.state = AgentState.InitializeFail;
    }
  }

}
let isInit = false;
class FirebaseAgent extends Agent {
  /**
   * @param config @see https://support.google.com/firebase/answer/7015592
   */
  constructor(config) {
    super();
    this.config = config;
    this.queue = [];
  }

  async doInitialize() {
    // TODO del
    // await loadScripts(
    //   'https://www.gstatic.com/firebasejs/7.14.1/firebase-app.js',
    //   'https://www.gstatic.com/firebasejs/7.14.1/firebase-analytics.js',
    // );
    // const firebase = await import('firebase/app');
    if (!isInit) {
      this.client = firebase$1.initializeApp(this.config).analytics();
      isInit = true;
    } else {
      this.client = firebase$1.analytics();
    }

    this.queue.forEach(callback => callback());
    this.queue = [];
  }

  report(event) {
    this.queueIfNotInitialized(() => this.doReport(event));
  }

  doReport(event) {
    switch (event.type) {
      case 'login':
        return this.login(event);

      case 'tracking':
        return this.track(event);

      case 'transition':
        return this.transit(event);
    }
  }

  login(event) {
    const {
      userId
    } = event;
    this.client.setUserId(userId, {
      global: true
    });
    if (userId) this.client.logEvent('login', {
      userId
    });
  }

  transit(event) {
    const {
      toScene,
      defaultTrackingParams
    } = event;
    const {
      title,
      hostname,
      pathname
    } = toScene;
    this.client.logEvent('page_view', {
      page_title: title,
      page_location: hostname,
      page_path: pathname,
      ...convertParamsToSankecase(defaultTrackingParams)
    });
    this.client.setCurrentScreen(event.toScene.title, {
      global: true
    });
  }

  track(event) {
    const {
      eventName,
      trackingParams = {}
    } = event;
    trim(trackingParams);
    this.client.logEvent(eventName, convertParamsToSankecase(trackingParams));
  }

  queueIfNotInitialized(callback) {
    if (this.state === AgentState.Initialized) callback();else this.queue.push(callback);
  }

}
class MatomoAgent extends Agent {
  constructor(config) {
    super();
    this.config = config;
    this.client = window._paq; // eslint-disable-line no-underscore-dangle

    this.trackPageViewTimer = 0;
    this.intialized = false;
  }

  async doInitialize() {
    const url = `//${this.config.endpoint}/`;
    this.client.push(['setTrackerUrl', `${url}matomo.php`]);
    this.client.push(['setSiteId', this.config.siteId]);
    this.client.push(['trackPageView']);
    this.client.push(['enableLinkTracking']);
    this.client.push(['trackAllContentImpressions']);
    await loadScript(`${url}piwik.js`);
  }

  report(event) {
    switch (event.type) {
      case 'login':
        return this.login(event);

      case 'tracking':
        return this.track(event);

      case 'transition':
        return this.transit(event);
    }
  }

  login(event) {
    const {
      userId
    } = event;
    if (userId) this.client.push(['setUserId', userId]);else this.client.push(['resetUserId']);
    this.requestTrackPageView();
  }

  transit(event) {
    const {
      fromScene,
      toScene
    } = event;
    this.client.push(['setReferrerUrl', `${fromScene.hostname}${fromScene.pathname}`]);
    this.client.push(['setCustomUrl', `${toScene.hostname}${fromScene.pathname}`]);
    this.client.push(['setDocumentTitle', toScene.title]);
    this.client.push(['setGenerationTimeMs', 0]);
    this.requestTrackPageView();
    this.client.push(['enableLinkTracking']);
    this.client.push(['trackAllContentImpressions']);
  }

  track(event) {
    /**
     * ref : https://developer.matomo.org/guides/tracking-javascript
     * trackEvent(category, action, [name], [value]) -
     * Log an event with an event category (Videos, Music, Games...), an event action (Play, Pause, Duration, Add Playlist, Downloaded, Clicked...), and an optional event name and optional numeric value.
     */
    const {
      eventName,
      category,
      trackingParams = {}
    } = event;
    const {
      name = '',
      value = ''
    } = trackingParams;
    this.client.push(['trackEvent', category, eventName, name, value]);
  }

  requestTrackPageView() {
    if (this.trackPageViewTimer) clearTimeout(this.trackPageViewTimer);
    this.trackPageViewTimer = setTimeout(() => {
      this.client.push(['trackPageView']);
      this.trackPageViewTimer = 0;
    });
  }

}

const tagNameRole = {
  alert: 'alert',
  alertdialog: 'alertdialog',
  application: 'application',
  article: 'article',
  banner: 'banner',
  button: 'button',
  cell: 'cell',
  checkbox: 'checkbox',
  columnheader: 'columnheader',
  combobox: 'combobox',
  command: 'command',
  complementary: 'complementary',
  composite: 'composite',
  contentinfo: 'contentinfo',
  definition: 'definition',
  dialog: 'dialog',
  directory: 'directory',
  document: 'document',
  feed: 'feed',
  figure: 'figure',
  form: 'form',
  grid: 'grid',
  gridcell: 'gridcell',
  group: 'group',
  heading: 'heading',
  img: 'img',
  input: 'input',
  landmark: 'landmark',
  link: 'link',
  list: 'list',
  listbox: 'listbox',
  listitem: 'listitem',
  log: 'log',
  main: 'main',
  'The main content of a document.': 'The main content of a document.',
  marquee: 'marquee',
  math: 'math',
  'Content that represents a mathematical expression.': 'Content that represents a mathematical expression.',
  menu: 'menu',
  menubar: 'menubar',
  menuitem: 'menuitem',
  menuitemcheckbox: 'menuitemcheckbox',
  menuitemradio: 'menuitemradio',
  navigation: 'navigation',
  none: 'none',
  note: 'note',
  option: 'option',
  presentation: 'presentation',
  progressbar: 'progressbar',
  radio: 'radio',
  radiogroup: 'radiogroup',
  range: 'range',
  region: 'region',
  roletype: 'roletype',
  row: 'row',
  rowgroup: 'rowgroup',
  rowheader: 'rowheader',
  scrollbar: 'scrollbar',
  search: 'search',
  searchbox: 'searchbox',
  section: 'section',
  sectionhead: 'sectionhead',
  select: 'select',
  separator: 'separator',
  slider: 'slider',
  spinbutton: 'spinbutton',
  status: 'status',
  structure: 'structure',
  switch: 'switch',
  tab: 'tab',
  table: 'table',
  tablist: 'tablist',
  tabpanel: 'tabpanel',
  term: 'term',
  textbox: 'textbox',
  timer: 'timer',
  toolbar: 'toolbar',
  tooltip: 'tooltip',
  tree: 'tree',
  treegrid: 'treegrid',
  treeitem: 'treeitem',
  widget: 'widget',
  window: 'window'
};
function guessRole(element) {
  return element.getAttribute('role') || tagNameRole[element.tagName] || 'unknown';
}
function getContent(element) {
  return element.innerText;
}

function createScene() {
  const {
    title
  } = window.document;
  const {
    hostname,
    pathname
  } = window.location;
  return {
    title,
    hostname,
    pathname
  };
}
function refineEventPathname(pathname) {
  var _pathname$match;

  const slashCount = (_pathname$match = pathname.match(/-/g)) === null || _pathname$match === void 0 ? void 0 : _pathname$match.length;
  if (!slashCount) return {
    eventId: '',
    codename: ''
  };
  if (slashCount === 1 || slashCount === 2) return {
    eventId: '',
    codename: pathname
  }; // slashCount === 3+

  const pathnameArray = pathname.split('-');
  const eventId = pathnameArray[0];
  const codename = pathnameArray.splice(1, pathnameArray.length).join('-');
  return {
    eventId,
    codename
  };
}
function createDefaultEventParams() {
  const codenameArray = window.location.pathname.split('/');
  const eventPathname = codenameArray.length > 1 ? codenameArray[1] : '';
  const {
    eventId,
    codename
  } = refineEventPathname(eventPathname);
  return {
    userId: sessionStorage.getItem('userID') || 'guest',
    lang: navigator.language || '',
    os: navigator.userAgent || '',
    timestamp: Date.now(),
    codename,
    eventId
  };
}

class DefaultSource {
  constructor() {
    this.agents = [];
    this.currentScene = createScene();
  }

  addAgent(agent) {
    agent.initialize();
    this.agents.push(agent);
  }

  spyTransition(history) {
    // wait for whole page updated
    // init page_view
    setTimeout(() => this.transit(createScene()), 100);
    history.listen(() => {
      const {
        action
      } = history; // Filtering replace action (The pushed url is not matching, ex: Redirect)

      if (action === 'PUSH') {
        setTimeout(() => this.transit(createScene()), 100);
      }
    });
  }

  spyClick() {
    window.addEventListener('click', event => {
      const {
        target
      } = event;

      if (target instanceof HTMLElement) {
        this.track({
          eventName: 'click',
          category: 'default',
          trackingParams: {
            name: getContent(target),
            value: '',
            role: guessRole(target)
          }
        });
      }
    });
  } // tracking page visibility. e.g. page minimized, change browser tab or page unload


  spyPageDurationByVisible(params) {
    let startDurationTime = 0;

    const handleVisibleChange = e => {
      if (document.visibilityState === 'hidden') {
        const endDurationTime = e.timeStamp;
        const duration = Math.floor(endDurationTime - startDurationTime);
        this.track({
          eventName: 'pageView',
          category: 'default',
          trackingParams: {
            url: window.location.href,
            duration,
            ...params
          }
        });
      }

      if (document.visibilityState === 'visible') {
        startDurationTime = e.timeStamp;
      }
    };

    document.addEventListener('visibilitychange', handleVisibleChange);
  }

  spyPageDurationByTransition(history, params) {
    let startDurationTime = Date.now();
    let url = window.location.href;
    history.listen(() => {
      const endDurationTime = Date.now();
      const duration = Math.floor(endDurationTime - startDurationTime);
      this.track({
        eventName: 'pageView',
        category: 'default',
        trackingParams: {
          url,
          duration,
          ...params
        }
      });
      startDurationTime = endDurationTime;
      url = window.location.href;
    });
  }

  login(userId) {
    this.agents.forEach(agent => agent.report({
      type: 'login',
      userId
    }));
  }

  transit(toScene) {
    const fromScene = this.currentScene;
    const event = {
      type: 'transition',
      fromScene,
      toScene,
      defaultTrackingParams: createDefaultEventParams()
    };
    this.agents.forEach(agent => agent.report(event));
  }

  track(event) {
    const {
      trackingParams
    } = event;
    const defaultParams = (trackingParams === null || trackingParams === void 0 ? void 0 : trackingParams.hasOwnProperty('productName')) ? {} : createDefaultEventParams();
    const mergedTrackingParams = { ...defaultParams,
      ...trackingParams
    };
    event.trackingParams = mergedTrackingParams;
    this.agents.forEach(agent => agent.report({
      type: 'tracking',
      ...event
    }));
  }

}

(function (Threshold) {
  Threshold[Threshold["MIN"] = 0] = "MIN";
  Threshold[Threshold["HALF"] = 0.5] = "HALF";
  Threshold[Threshold["FULL"] = 1] = "FULL";
})(exports.Threshold || (exports.Threshold = {}));

const EVENT_NAME_CLICK = 'click';
const EVENT_NAME_ENTER = 'enter';
const EVENT_NAME_LEAVE = 'leave';
const EVENT_NAME_SEARCH = 'search';
const EVENT_NAME_SECTION_VIEW = 'section_view';
const CATEGORY_DEFAULT = 'default';
const ACTION_BUTTON_CLICK = 'ButtonClick';
const ACTION_TAB_CLICK = 'TabClick';
const ACTION_PROFILE_CLICK = 'ProfileClick';
const ACTION_LINK_CLICK = 'LinkClick';
const ACTION_ENTER = 'enter';
const __CLIENT__ = typeof window !== 'undefined' && typeof window.document !== 'undefined';

class SectionObserver {
  constructor(debounce, threshold) {
    this.debounceExecute = 0;

    this.sectionObserve = (ref, callback) => {
      var _this$observer;

      (_this$observer = this.observer) === null || _this$observer === void 0 ? void 0 : _this$observer.observe(ref.current);
      this.elementMap.set(ref.current, callback);
    };

    this.sectionUnobserve = ref => {
      var _this$observer2;

      (_this$observer2 = this.observer) === null || _this$observer2 === void 0 ? void 0 : _this$observer2.unobserve(ref.current);
      if (this.elementMap.has(ref.current)) this.elementMap.delete(ref.current);
    };

    this.resetSectionObserver = () => {
      this.elementMap.forEach((value, key) => {
        var _this$observer3;

        (_this$observer3 = this.observer) === null || _this$observer3 === void 0 ? void 0 : _this$observer3.observe(key);
      });
    };

    this.sectionIntersect = entries => {
      entries.forEach(entry => {
        const {
          target
        } = entry;

        if (entry.isIntersecting && this.elementMap.has(target)) {
          var _this$observer4;

          const callback = this.elementMap.get(target);
          if (!callback) return;
          callback();
          (_this$observer4 = this.observer) === null || _this$observer4 === void 0 ? void 0 : _this$observer4.unobserve(target);
        }
      });
    };

    this.debounceSectionIntersect = entries => {
      entries.forEach(entry => {
        const {
          target
        } = entry;

        if (entry.isIntersecting && this.elementMap.has(target)) {
          var _this$observer5;

          const callback = this.elementMap.get(target);
          if (!callback) return;
          clearTimeout(this.debounceExecute);
          this.debounceExecute = window.setTimeout(() => {
            callback();
          }, 1000);
          (_this$observer5 = this.observer) === null || _this$observer5 === void 0 ? void 0 : _this$observer5.unobserve(target);
        }
      });
    };

    this.elementMap = new Map();

    try {
      this.observer = new window.IntersectionObserver(entries => {
        if (debounce) {
          this.debounceSectionIntersect(entries);
        } else {
          this.sectionIntersect(entries);
        }
      }, {
        threshold: [threshold]
      });
    } catch (error) {
      console.log(`Error occur when creating IntersectionObserver: ${error}`);
    }
  }

}

let completeSectionObserver;
let halfSectionObserver;
let minSectionObserver;
let rankSectionObserver;
function registCompleteSectionObserver(ref, callback) {
  if (!__CLIENT__) {
    throw new Error('[registCompleteSectionObserver()] should be invoked on client side.');
  }

  if (!completeSectionObserver) completeSectionObserver = new SectionObserver(false, exports.Threshold.FULL);
  completeSectionObserver.sectionObserve(ref, callback);
  return () => {
    completeSectionObserver.sectionUnobserve(ref);
  };
}
function registHalfSectionObserver(ref, callback) {
  if (!__CLIENT__) {
    throw new Error('[registHalfSectionObserver()] should be invoked on client side.');
  }

  if (!halfSectionObserver) halfSectionObserver = new SectionObserver(false, exports.Threshold.HALF);
  halfSectionObserver.sectionObserve(ref, callback);
  return () => {
    halfSectionObserver.sectionUnobserve(ref);
  };
}
function registMinSectionObserver(ref, callback) {
  if (!__CLIENT__) {
    throw new Error('[registMinSectionObserver()] should be invoked on client side.');
  }

  if (!minSectionObserver) minSectionObserver = new SectionObserver(false, exports.Threshold.MIN);
  minSectionObserver.sectionObserve(ref, callback);
  return () => {
    minSectionObserver.sectionUnobserve(ref);
  };
}
function registRankSectionObserver(ref, callback) {
  if (!__CLIENT__) {
    throw new Error('[registRankSectionObserver()] should be invoked on client side.');
  }

  if (!rankSectionObserver) rankSectionObserver = new SectionObserver(true, exports.Threshold.FULL);
  rankSectionObserver.sectionObserve(ref, callback);
  return () => {
    rankSectionObserver.sectionUnobserve(ref);
  };
}
function resetSectionObserverStatus() {
  if (completeSectionObserver) completeSectionObserver.resetSectionObserver();
  if (halfSectionObserver) halfSectionObserver.resetSectionObserver();
  if (minSectionObserver) minSectionObserver.resetSectionObserver();
  if (rankSectionObserver) rankSectionObserver.resetSectionObserver();
}

function useCompleteSectionTracking(ref, callback) {
  react.useEffect(() => {
    if (ref.current === null) return;
    return registCompleteSectionObserver(ref, callback);
  });
}
function useHalfSectionTracking(ref, callback) {
  react.useEffect(() => {
    if (ref.current === null) return;
    return registHalfSectionObserver(ref, callback);
  });
}
function useMinSectionTracking(ref, callback) {
  react.useEffect(() => {
    if (ref.current === null) return;
    return registMinSectionObserver(ref, callback);
  });
}
function useRankSectionTracking(ref, callback) {
  react.useEffect(() => {
    if (ref.current === null) return;
    return registRankSectionObserver(ref, callback);
  });
}
function usePageTransitionListener(trackingSource, history) {
  react.useEffect(() => {
    // Regist history (for page_view & screen_view)
    trackingSource.spyTransition(history);
    history.listen(() => {
      resetSectionObserverStatus();
    });
  }, [history]);
}

function createButtonClickAction(buttonName, link) {
  return {
    eventName: EVENT_NAME_CLICK,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      action: ACTION_BUTTON_CLICK,
      name: buttonName,
      page: link
    }
  };
}
function createPageEnterAction(utmCampaign, utmContent, utmMedium, utmSource) {
  return {
    eventName: EVENT_NAME_ENTER,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      utmCampaign,
      utmContent,
      utmMedium,
      utmSource
    }
  };
}
function createPageLeaveAction() {
  return {
    eventName: EVENT_NAME_LEAVE,
    category: CATEGORY_DEFAULT
  };
}
function createTabClickAction(link, tabName) {
  return {
    eventName: EVENT_NAME_CLICK,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      action: ACTION_TAB_CLICK,
      page: link,
      name: tabName
    }
  };
}
function createProfileClickAction(userID, liveStatus, profileType) {
  return {
    eventName: EVENT_NAME_CLICK,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      action: ACTION_PROFILE_CLICK,
      type: profileType,
      streamerId: userID,
      liveStatus: liveStatus,
      leaderboardId: '',
      hasDeeplink: false
    }
  };
}
function createSearchAction(keyword, count) {
  return {
    eventName: EVENT_NAME_SEARCH,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      searchString: keyword,
      resultCount: count
    }
  };
}
function createVoteAction(voteTopic) {
  return {
    eventName: EVENT_NAME_CLICK,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      action: ACTION_BUTTON_CLICK,
      name: voteTopic,
      type: 'vote'
    }
  };
}
function createLeaderboardSectionViewAction(rank) {
  return {
    eventName: EVENT_NAME_SECTION_VIEW,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      action: ACTION_ENTER,
      section: 'leaderboardItem',
      rank
    }
  };
}
function createLinkClickAction(link, linkName) {
  return {
    eventName: EVENT_NAME_CLICK,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      action: ACTION_LINK_CLICK,
      url: link,
      name: linkName
    }
  };
}
function createSectionViewAction(section, customPath) {
  return {
    eventName: EVENT_NAME_SECTION_VIEW,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      action: ACTION_ENTER,
      section,
      // For customized event to use.
      customPath
    }
  };
}

exports.Agent = Agent;
exports.DefaultSource = DefaultSource;
exports.FirebaseAgent = FirebaseAgent;
exports.MatomoAgent = MatomoAgent;
exports.createButtonClickAction = createButtonClickAction;
exports.createLeaderboardSectionViewAction = createLeaderboardSectionViewAction;
exports.createLinkClickAction = createLinkClickAction;
exports.createPageEnterAction = createPageEnterAction;
exports.createPageLeaveAction = createPageLeaveAction;
exports.createProfileClickAction = createProfileClickAction;
exports.createSearchAction = createSearchAction;
exports.createSectionViewAction = createSectionViewAction;
exports.createTabClickAction = createTabClickAction;
exports.createVoteAction = createVoteAction;
exports.useCompleteSectionTracking = useCompleteSectionTracking;
exports.useHalfSectionTracking = useHalfSectionTracking;
exports.useMinSectionTracking = useMinSectionTracking;
exports.usePageTransitionListener = usePageTransitionListener;
exports.useRankSectionTracking = useRankSectionTracking;
//# sourceMappingURL=index.js.map
