'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var crypto = require('crypto');
var react = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

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

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Op = Object.prototype;
var hasOwn = Op.hasOwnProperty;
var undefined$1; // More compressible than void 0.

var $Symbol = typeof Symbol === "function" ? Symbol : {};
var iteratorSymbol = $Symbol.iterator || "@@iterator";
var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

function wrap(innerFn, outerFn, self, tryLocsList) {
  // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
  var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
  var generator = Object.create(protoGenerator.prototype);
  var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
  // .throw, and .return methods.

  generator._invoke = makeInvokeMethod(innerFn, self, context);
  return generator;
} // Try/catch helper to minimize deoptimizations. Returns a completion
// record like context.tryEntries[i].completion. This interface could
// have been (and was previously) designed to take a closure to be
// invoked without arguments, but in all the cases we care about we
// already have an existing method we want to call, so there's no need
// to create a new function object. We can even get away with assuming
// the method takes exactly one argument, since that happens to be true
// in every case, so we don't have to touch the arguments object. The
// only additional allocation required is the completion record, which
// has a stable shape and so hopefully should be cheap to allocate.


function tryCatch(fn, obj, arg) {
  try {
    return {
      type: "normal",
      arg: fn.call(obj, arg)
    };
  } catch (err) {
    return {
      type: "throw",
      arg: err
    };
  }
}

var GenStateSuspendedStart = "suspendedStart";
var GenStateSuspendedYield = "suspendedYield";
var GenStateExecuting = "executing";
var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
// breaking out of the dispatch switch statement.

var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
// .constructor.prototype properties for functions that return Generator
// objects. For full spec compliance, you may wish to configure your
// minifier not to mangle the names of these two functions.

function Generator() {}

function GeneratorFunction() {}

function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
// don't natively support it.


var IteratorPrototype = {};

IteratorPrototype[iteratorSymbol] = function () {
  return this;
};

var getProto = Object.getPrototypeOf;
var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
  // This environment has a native %IteratorPrototype%; use it instead
  // of the polyfill.
  IteratorPrototype = NativeIteratorPrototype;
}

var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
GeneratorFunctionPrototype.constructor = GeneratorFunction;
GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction"; // Helper for defining the .next, .throw, and .return methods of the
// Iterator interface in terms of a single ._invoke method.

function defineIteratorMethods(prototype) {
  ["next", "throw", "return"].forEach(function (method) {
    prototype[method] = function (arg) {
      return this._invoke(method, arg);
    };
  });
}

function isGeneratorFunction(genFun) {
  var ctor = typeof genFun === "function" && genFun.constructor;
  return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
  // do is to check its .name property.
  (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
}

function mark(genFun) {
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
  } else {
    genFun.__proto__ = GeneratorFunctionPrototype;

    if (!(toStringTagSymbol in genFun)) {
      genFun[toStringTagSymbol] = "GeneratorFunction";
    }
  }

  genFun.prototype = Object.create(Gp);
  return genFun;
}
// `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
// `hasOwn.call(value, "__await")` to determine if the yielded value is
// meant to be awaited.

function awrap(arg) {
  return {
    __await: arg
  };
}

function AsyncIterator(generator, PromiseImpl) {
  function invoke(method, arg, resolve, reject) {
    var record = tryCatch(generator[method], generator, arg);

    if (record.type === "throw") {
      reject(record.arg);
    } else {
      var result = record.arg;
      var value = result.value;

      if (value && _typeof(value) === "object" && hasOwn.call(value, "__await")) {
        return PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        });
      }

      return PromiseImpl.resolve(value).then(function (unwrapped) {
        // When a yielded Promise is resolved, its final value becomes
        // the .value of the Promise<{value,done}> result for the
        // current iteration.
        result.value = unwrapped;
        resolve(result);
      }, function (error) {
        // If a rejected Promise was yielded, throw the rejection back
        // into the async generator function so it can be handled there.
        return invoke("throw", error, resolve, reject);
      });
    }
  }

  var previousPromise;

  function enqueue(method, arg) {
    function callInvokeWithMethodAndArg() {
      return new PromiseImpl(function (resolve, reject) {
        invoke(method, arg, resolve, reject);
      });
    }

    return previousPromise = // If enqueue has been called before, then we want to wait until
    // all previous Promises have been resolved before calling invoke,
    // so that results are always delivered in the correct order. If
    // enqueue has not been called before, then it is important to
    // call invoke immediately, without waiting on a callback to fire,
    // so that the async generator function has the opportunity to do
    // any necessary setup in a predictable way. This predictability
    // is why the Promise constructor synchronously invokes its
    // executor callback, and why async functions synchronously
    // execute code before the first await. Since we implement simple
    // async functions in terms of async generators, it is especially
    // important to get this right, even though it requires care.
    previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
    // invocations of the iterator.
    callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
  } // Define the unified helper method that is used to implement .next,
  // .throw, and .return (see defineIteratorMethods).


  this._invoke = enqueue;
}

defineIteratorMethods(AsyncIterator.prototype);

AsyncIterator.prototype[asyncIteratorSymbol] = function () {
  return this;
}; // Note that simple async functions are implemented on top of
// AsyncIterator objects; they just return a Promise for the value of
// the final result produced by the iterator.


function async(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
  if (PromiseImpl === void 0) PromiseImpl = Promise;
  var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
  return isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
  : iter.next().then(function (result) {
    return result.done ? result.value : iter.next();
  });
}

function makeInvokeMethod(innerFn, self, context) {
  var state = GenStateSuspendedStart;
  return function invoke(method, arg) {
    if (state === GenStateExecuting) {
      throw new Error("Generator is already running");
    }

    if (state === GenStateCompleted) {
      if (method === "throw") {
        throw arg;
      } // Be forgiving, per 25.3.3.3.3 of the spec:
      // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


      return doneResult();
    }

    context.method = method;
    context.arg = arg;

    while (true) {
      var delegate = context.delegate;

      if (delegate) {
        var delegateResult = maybeInvokeDelegate(delegate, context);

        if (delegateResult) {
          if (delegateResult === ContinueSentinel) continue;
          return delegateResult;
        }
      }

      if (context.method === "next") {
        // Setting context._sent for legacy support of Babel's
        // function.sent implementation.
        context.sent = context._sent = context.arg;
      } else if (context.method === "throw") {
        if (state === GenStateSuspendedStart) {
          state = GenStateCompleted;
          throw context.arg;
        }

        context.dispatchException(context.arg);
      } else if (context.method === "return") {
        context.abrupt("return", context.arg);
      }

      state = GenStateExecuting;
      var record = tryCatch(innerFn, self, context);

      if (record.type === "normal") {
        // If an exception is thrown from innerFn, we leave state ===
        // GenStateExecuting and loop back for another invocation.
        state = context.done ? GenStateCompleted : GenStateSuspendedYield;

        if (record.arg === ContinueSentinel) {
          continue;
        }

        return {
          value: record.arg,
          done: context.done
        };
      } else if (record.type === "throw") {
        state = GenStateCompleted; // Dispatch the exception by looping back around to the
        // context.dispatchException(context.arg) call above.

        context.method = "throw";
        context.arg = record.arg;
      }
    }
  };
} // Call delegate.iterator[context.method](context.arg) and handle the
// result, either by returning a { value, done } result from the
// delegate iterator, or by modifying context.method and context.arg,
// setting context.delegate to null, and returning the ContinueSentinel.


function maybeInvokeDelegate(delegate, context) {
  var method = delegate.iterator[context.method];

  if (method === undefined$1) {
    // A .throw or .return when the delegate iterator has no .throw
    // method always terminates the yield* loop.
    context.delegate = null;

    if (context.method === "throw") {
      // Note: ["return"] must be used for ES3 parsing compatibility.
      if (delegate.iterator["return"]) {
        // If the delegate iterator has a return method, give it a
        // chance to clean up.
        context.method = "return";
        context.arg = undefined$1;
        maybeInvokeDelegate(delegate, context);

        if (context.method === "throw") {
          // If maybeInvokeDelegate(context) changed context.method from
          // "return" to "throw", let that override the TypeError below.
          return ContinueSentinel;
        }
      }

      context.method = "throw";
      context.arg = new TypeError("The iterator does not provide a 'throw' method");
    }

    return ContinueSentinel;
  }

  var record = tryCatch(method, delegate.iterator, context.arg);

  if (record.type === "throw") {
    context.method = "throw";
    context.arg = record.arg;
    context.delegate = null;
    return ContinueSentinel;
  }

  var info = record.arg;

  if (!info) {
    context.method = "throw";
    context.arg = new TypeError("iterator result is not an object");
    context.delegate = null;
    return ContinueSentinel;
  }

  if (info.done) {
    // Assign the result of the finished delegate to the temporary
    // variable specified by delegate.resultName (see delegateYield).
    context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

    context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
    // exception, let the outer generator proceed normally. If
    // context.method was "next", forget context.arg since it has been
    // "consumed" by the delegate iterator. If context.method was
    // "return", allow the original .return call to continue in the
    // outer generator.

    if (context.method !== "return") {
      context.method = "next";
      context.arg = undefined$1;
    }
  } else {
    // Re-yield the result returned by the delegate method.
    return info;
  } // The delegate iterator is finished, so forget it and continue with
  // the outer generator.


  context.delegate = null;
  return ContinueSentinel;
} // Define Generator.prototype.{next,throw,return} in terms of the
// unified ._invoke helper method.


defineIteratorMethods(Gp);
Gp[toStringTagSymbol] = "Generator"; // A Generator should always return itself as the iterator object when the
// @@iterator function is called on it. Some browsers' implementations of the
// iterator prototype chain incorrectly implement this, causing the Generator
// object to not be returned from this call. This ensures that doesn't happen.
// See https://github.com/facebook/regenerator/issues/274 for more details.

Gp[iteratorSymbol] = function () {
  return this;
};

Gp.toString = function () {
  return "[object Generator]";
};

function pushTryEntry(locs) {
  var entry = {
    tryLoc: locs[0]
  };

  if (1 in locs) {
    entry.catchLoc = locs[1];
  }

  if (2 in locs) {
    entry.finallyLoc = locs[2];
    entry.afterLoc = locs[3];
  }

  this.tryEntries.push(entry);
}

function resetTryEntry(entry) {
  var record = entry.completion || {};
  record.type = "normal";
  delete record.arg;
  entry.completion = record;
}

function Context(tryLocsList) {
  // The root entry object (effectively a try statement without a catch
  // or a finally block) gives us a place to store values thrown from
  // locations where there is no enclosing try statement.
  this.tryEntries = [{
    tryLoc: "root"
  }];
  tryLocsList.forEach(pushTryEntry, this);
  this.reset(true);
}

function keys(object) {
  var keys = [];

  for (var key in object) {
    keys.push(key);
  }

  keys.reverse(); // Rather than returning an object with a next method, we keep
  // things simple and return the next function itself.

  return function next() {
    while (keys.length) {
      var key = keys.pop();

      if (key in object) {
        next.value = key;
        next.done = false;
        return next;
      }
    } // To avoid creating an additional object, we just hang the .value
    // and .done properties off the next function object itself. This
    // also ensures that the minifier will not anonymize the function.


    next.done = true;
    return next;
  };
}

function values(iterable) {
  if (iterable) {
    var iteratorMethod = iterable[iteratorSymbol];

    if (iteratorMethod) {
      return iteratorMethod.call(iterable);
    }

    if (typeof iterable.next === "function") {
      return iterable;
    }

    if (!isNaN(iterable.length)) {
      var i = -1,
          next = function next() {
        while (++i < iterable.length) {
          if (hasOwn.call(iterable, i)) {
            next.value = iterable[i];
            next.done = false;
            return next;
          }
        }

        next.value = undefined$1;
        next.done = true;
        return next;
      };

      return next.next = next;
    }
  } // Return an iterator with no values.


  return {
    next: doneResult
  };
}

function doneResult() {
  return {
    value: undefined$1,
    done: true
  };
}

Context.prototype = {
  constructor: Context,
  reset: function reset(skipTempReset) {
    this.prev = 0;
    this.next = 0; // Resetting context._sent for legacy support of Babel's
    // function.sent implementation.

    this.sent = this._sent = undefined$1;
    this.done = false;
    this.delegate = null;
    this.method = "next";
    this.arg = undefined$1;
    this.tryEntries.forEach(resetTryEntry);

    if (!skipTempReset) {
      for (var name in this) {
        // Not sure about the optimal order of these conditions:
        if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
          this[name] = undefined$1;
        }
      }
    }
  },
  stop: function stop() {
    this.done = true;
    var rootEntry = this.tryEntries[0];
    var rootRecord = rootEntry.completion;

    if (rootRecord.type === "throw") {
      throw rootRecord.arg;
    }

    return this.rval;
  },
  dispatchException: function dispatchException(exception) {
    if (this.done) {
      throw exception;
    }

    var context = this;

    function handle(loc, caught) {
      record.type = "throw";
      record.arg = exception;
      context.next = loc;

      if (caught) {
        // If the dispatched exception was caught by a catch block,
        // then let that catch block handle the exception normally.
        context.method = "next";
        context.arg = undefined$1;
      }

      return !!caught;
    }

    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
      var entry = this.tryEntries[i];
      var record = entry.completion;

      if (entry.tryLoc === "root") {
        // Exception thrown outside of any try block that could handle
        // it, so set the completion value of the entire function to
        // throw the exception.
        return handle("end");
      }

      if (entry.tryLoc <= this.prev) {
        var hasCatch = hasOwn.call(entry, "catchLoc");
        var hasFinally = hasOwn.call(entry, "finallyLoc");

        if (hasCatch && hasFinally) {
          if (this.prev < entry.catchLoc) {
            return handle(entry.catchLoc, true);
          } else if (this.prev < entry.finallyLoc) {
            return handle(entry.finallyLoc);
          }
        } else if (hasCatch) {
          if (this.prev < entry.catchLoc) {
            return handle(entry.catchLoc, true);
          }
        } else if (hasFinally) {
          if (this.prev < entry.finallyLoc) {
            return handle(entry.finallyLoc);
          }
        } else {
          throw new Error("try statement without catch or finally");
        }
      }
    }
  },
  abrupt: function abrupt(type, arg) {
    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
      var entry = this.tryEntries[i];

      if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
        var finallyEntry = entry;
        break;
      }
    }

    if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
      // Ignore the finally entry if control is not jumping to a
      // location outside the try/catch block.
      finallyEntry = null;
    }

    var record = finallyEntry ? finallyEntry.completion : {};
    record.type = type;
    record.arg = arg;

    if (finallyEntry) {
      this.method = "next";
      this.next = finallyEntry.finallyLoc;
      return ContinueSentinel;
    }

    return this.complete(record);
  },
  complete: function complete(record, afterLoc) {
    if (record.type === "throw") {
      throw record.arg;
    }

    if (record.type === "break" || record.type === "continue") {
      this.next = record.arg;
    } else if (record.type === "return") {
      this.rval = this.arg = record.arg;
      this.method = "return";
      this.next = "end";
    } else if (record.type === "normal" && afterLoc) {
      this.next = afterLoc;
    }

    return ContinueSentinel;
  },
  finish: function finish(finallyLoc) {
    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
      var entry = this.tryEntries[i];

      if (entry.finallyLoc === finallyLoc) {
        this.complete(entry.completion, entry.afterLoc);
        resetTryEntry(entry);
        return ContinueSentinel;
      }
    }
  },
  "catch": function _catch(tryLoc) {
    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
      var entry = this.tryEntries[i];

      if (entry.tryLoc === tryLoc) {
        var record = entry.completion;

        if (record.type === "throw") {
          var thrown = record.arg;
          resetTryEntry(entry);
        }

        return thrown;
      }
    } // The context.catch method must only be called with a location
    // argument that corresponds to a known catch block.


    throw new Error("illegal catch attempt");
  },
  delegateYield: function delegateYield(iterable, resultName, nextLoc) {
    this.delegate = {
      iterator: values(iterable),
      resultName: resultName,
      nextLoc: nextLoc
    };

    if (this.method === "next") {
      // Deliberately forget the last sent value so that we don't
      // accidentally pass it on to the delegate.
      this.arg = undefined$1;
    }

    return ContinueSentinel;
  }
}; // Export a default namespace that plays well with Rollup

var _regeneratorRuntime = {
  wrap: wrap,
  isGeneratorFunction: isGeneratorFunction,
  AsyncIterator: AsyncIterator,
  mark: mark,
  awrap: awrap,
  async: async,
  keys: keys,
  values: values
};

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function loadScript(src) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.defer = true;
  script.src = src;
  var firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(script, firstScript);
  return new Promise(function (resolve, reject) {
    script.onload = resolve;
    script.onerror = reject;
  });
}
function loadScripts() {
  for (var _len = arguments.length, src = new Array(_len), _key = 0; _key < _len; _key++) {
    src[_key] = arguments[_key];
  }

  return Promise.all(src.map(loadScript));
}

function trim(object) {
  for (var key in object) {
    if (typeof object[key] === 'undefined') {
      delete object[key];
    }

    if (object[key] === null) {
      delete object[key];
    }
  }
}
function convertStringToSankecase(str) {
  var upperCaseMap = new Map();
  var strArray = Array.from(str);
  strArray.forEach(function (char, index) {
    var currentCharCode = char.charCodeAt(0);
    var asciiCodeA = 'A'.charCodeAt(0);
    var asciiCodeZ = 'Z'.charCodeAt(0);

    if (currentCharCode >= asciiCodeA && currentCharCode <= asciiCodeZ) {
      upperCaseMap.set(index, char);
    }
  });
  upperCaseMap.forEach(function (value, key) {
    strArray[key] = "_".concat(value.toLowerCase());
  });
  return strArray.join('');
}
function convertParamsToSankecase(params) {
  return Object.keys(params).reduce(function (prev, key) {
    var currentParams = prev;
    var snakecaseKey = convertStringToSankecase(key);
    currentParams[snakecaseKey] = params[key];
    return currentParams;
  }, {});
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
var AgentState;

(function (AgentState) {
  AgentState[AgentState["Uninitialized"] = 0] = "Uninitialized";
  AgentState[AgentState["Initializing"] = 1] = "Initializing";
  AgentState[AgentState["Initialized"] = 2] = "Initialized";
  AgentState[AgentState["InitializeFail"] = 3] = "InitializeFail";
})(AgentState || (AgentState = {}));

var Agent = /*#__PURE__*/function () {
  function Agent() {
    _classCallCheck(this, Agent);

    this.state = AgentState.Uninitialized;
  }

  _createClass(Agent, [{
    key: "initialize",
    value: function () {
      var _initialize = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(this.state !== AgentState.Uninitialized)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                this.state = AgentState.Initializing;
                _context.prev = 3;
                _context.next = 6;
                return this.doInitialize();

              case 6:
                this.state = AgentState.Initialized;
                _context.next = 13;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](3);
                console.error(_context.t0);
                this.state = AgentState.InitializeFail;

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 9]]);
      }));

      function initialize() {
        return _initialize.apply(this, arguments);
      }

      return initialize;
    }()
  }]);

  return Agent;
}();
var isInit = false;
var FirebaseAgent = /*#__PURE__*/function (_Agent) {
  _inherits(FirebaseAgent, _Agent);

  var _super = _createSuper(FirebaseAgent);

  /**
   * @param config @see https://support.google.com/firebase/answer/7015592
   */
  function FirebaseAgent(config) {
    var _this;

    _classCallCheck(this, FirebaseAgent);

    _this = _super.call(this);
    _this.config = config;
    _this.queue = [];
    return _this;
  }

  _createClass(FirebaseAgent, [{
    key: "doInitialize",
    value: function () {
      var _doInitialize = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return loadScripts('https://www.gstatic.com/firebasejs/7.14.1/firebase-app.js', 'https://www.gstatic.com/firebasejs/7.14.1/firebase-analytics.js');

              case 2:
                if (!isInit) {
                  this.client = firebase.initializeApp(this.config).analytics();
                  isInit = true;
                } else {
                  this.client = firebase.analytics();
                }

                this.queue.forEach(function (callback) {
                  return callback();
                });
                this.queue = [];

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function doInitialize() {
        return _doInitialize.apply(this, arguments);
      }

      return doInitialize;
    }()
  }, {
    key: "report",
    value: function report(event) {
      var _this2 = this;

      this.queueIfNotInitialized(function () {
        return _this2.doReport(event);
      });
    }
  }, {
    key: "doReport",
    value: function doReport(event) {
      switch (event.type) {
        case 'login':
          return this.login(event);

        case 'tracking':
          return this.track(event);

        case 'transition':
          return this.transit(event);
      }
    }
  }, {
    key: "login",
    value: function login(event) {
      var userId = event.userId;
      this.client.setUserId(userId, {
        global: true
      });
      if (userId) this.client.logEvent('login', {
        userId: userId
      });
    }
  }, {
    key: "transit",
    value: function transit(event) {
      var toScene = event.toScene,
          defaultTrackingParams = event.defaultTrackingParams;
      var title = toScene.title,
          hostname = toScene.hostname,
          pathname = toScene.pathname;
      this.client.logEvent('page_view', _objectSpread({
        page_title: title,
        page_location: hostname,
        page_path: pathname
      }, convertParamsToSankecase(defaultTrackingParams)));
      this.client.setCurrentScreen(event.toScene.title, {
        global: true
      });
    }
  }, {
    key: "track",
    value: function track(event) {
      var eventName = event.eventName,
          _event$trackingParams = event.trackingParams,
          trackingParams = _event$trackingParams === void 0 ? {} : _event$trackingParams;
      trim(trackingParams);
      this.client.logEvent(eventName, convertParamsToSankecase(trackingParams));
    }
  }, {
    key: "queueIfNotInitialized",
    value: function queueIfNotInitialized(callback) {
      if (this.state === AgentState.Initialized) callback();else this.queue.push(callback);
    }
  }]);

  return FirebaseAgent;
}(Agent);
var MatomoAgent = /*#__PURE__*/function (_Agent2) {
  _inherits(MatomoAgent, _Agent2);

  var _super2 = _createSuper(MatomoAgent);

  function MatomoAgent(config) {
    var _this3;

    _classCallCheck(this, MatomoAgent);

    _this3 = _super2.call(this);
    _this3.config = config;
    _this3.client = window._paq; // eslint-disable-line no-underscore-dangle

    _this3.trackPageViewTimer = 0;
    _this3.intialized = false;
    return _this3;
  }

  _createClass(MatomoAgent, [{
    key: "doInitialize",
    value: function () {
      var _doInitialize2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
        var url;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                url = "//".concat(this.config.endpoint, "/");
                this.client.push(['setTrackerUrl', "".concat(url, "matomo.php")]);
                this.client.push(['setSiteId', this.config.siteId]);
                this.client.push(['trackPageView']);
                this.client.push(['enableLinkTracking']);
                this.client.push(['trackAllContentImpressions']);
                _context3.next = 8;
                return loadScript("".concat(url, "piwik.js"));

              case 8:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function doInitialize() {
        return _doInitialize2.apply(this, arguments);
      }

      return doInitialize;
    }()
  }, {
    key: "report",
    value: function report(event) {
      switch (event.type) {
        case 'login':
          return this.login(event);

        case 'tracking':
          return this.track(event);

        case 'transition':
          return this.transit(event);
      }
    }
  }, {
    key: "login",
    value: function login(event) {
      var userId = event.userId;
      if (userId) this.client.push(['setUserId', userId]);else this.client.push(['resetUserId']);
      this.requestTrackPageView();
    }
  }, {
    key: "transit",
    value: function transit(event) {
      var fromScene = event.fromScene,
          toScene = event.toScene;
      this.client.push(['setReferrerUrl', "".concat(fromScene.hostname).concat(fromScene.pathname)]);
      this.client.push(['setCustomUrl', "".concat(toScene.hostname).concat(fromScene.pathname)]);
      this.client.push(['setDocumentTitle', toScene.title]);
      this.client.push(['setGenerationTimeMs', 0]);
      this.requestTrackPageView();
      this.client.push(['enableLinkTracking']);
      this.client.push(['trackAllContentImpressions']);
    }
  }, {
    key: "track",
    value: function track(event) {
      /**
       * ref : https://developer.matomo.org/guides/tracking-javascript
       * trackEvent(category, action, [name], [value]) -
       * Log an event with an event category (Videos, Music, Games...), an event action (Play, Pause, Duration, Add Playlist, Downloaded, Clicked...), and an optional event name and optional numeric value.
       */
      var eventName = event.eventName,
          category = event.category,
          _event$trackingParams2 = event.trackingParams,
          trackingParams = _event$trackingParams2 === void 0 ? {} : _event$trackingParams2;
      var _trackingParams$name = trackingParams.name,
          name = _trackingParams$name === void 0 ? '' : _trackingParams$name,
          _trackingParams$value = trackingParams.value,
          value = _trackingParams$value === void 0 ? '' : _trackingParams$value;
      this.client.push(['trackEvent', category, eventName, name, value]);
    }
  }, {
    key: "requestTrackPageView",
    value: function requestTrackPageView() {
      var _this4 = this;

      if (this.trackPageViewTimer) clearTimeout(this.trackPageViewTimer);
      this.trackPageViewTimer = setTimeout(function () {
        _this4.client.push(['trackPageView']);

        _this4.trackPageViewTimer = 0;
      });
    }
  }]);

  return MatomoAgent;
}(Agent);

var tagNameRole = {
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

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var hexTable = function () {
  var array = [];

  for (var i = 0; i < 256; ++i) {
    array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
  }

  return array;
}();

var compactQueue = function compactQueue(queue) {
  while (queue.length > 1) {
    var item = queue.pop();
    var obj = item.obj[item.prop];

    if (isArray(obj)) {
      var compacted = [];

      for (var j = 0; j < obj.length; ++j) {
        if (typeof obj[j] !== 'undefined') {
          compacted.push(obj[j]);
        }
      }

      item.obj[item.prop] = compacted;
    }
  }
};

var arrayToObject = function arrayToObject(source, options) {
  var obj = options && options.plainObjects ? Object.create(null) : {};

  for (var i = 0; i < source.length; ++i) {
    if (typeof source[i] !== 'undefined') {
      obj[i] = source[i];
    }
  }

  return obj;
};

var merge = function merge(target, source, options) {
  /* eslint no-param-reassign: 0 */
  if (!source) {
    return target;
  }

  if (_typeof(source) !== 'object') {
    if (isArray(target)) {
      target.push(source);
    } else if (target && _typeof(target) === 'object') {
      if (options && (options.plainObjects || options.allowPrototypes) || !has.call(Object.prototype, source)) {
        target[source] = true;
      }
    } else {
      return [target, source];
    }

    return target;
  }

  if (!target || _typeof(target) !== 'object') {
    return [target].concat(source);
  }

  var mergeTarget = target;

  if (isArray(target) && !isArray(source)) {
    mergeTarget = arrayToObject(target, options);
  }

  if (isArray(target) && isArray(source)) {
    source.forEach(function (item, i) {
      if (has.call(target, i)) {
        var targetItem = target[i];

        if (targetItem && _typeof(targetItem) === 'object' && item && _typeof(item) === 'object') {
          target[i] = merge(targetItem, item, options);
        } else {
          target.push(item);
        }
      } else {
        target[i] = item;
      }
    });
    return target;
  }

  return Object.keys(source).reduce(function (acc, key) {
    var value = source[key];

    if (has.call(acc, key)) {
      acc[key] = merge(acc[key], value, options);
    } else {
      acc[key] = value;
    }

    return acc;
  }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
  return Object.keys(source).reduce(function (acc, key) {
    acc[key] = source[key];
    return acc;
  }, target);
};

var decode = function decode(str, decoder, charset) {
  var strWithoutPlus = str.replace(/\+/g, ' ');

  if (charset === 'iso-8859-1') {
    // unescape never throws, no try...catch needed:
    return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
  } // utf-8


  try {
    return decodeURIComponent(strWithoutPlus);
  } catch (e) {
    return strWithoutPlus;
  }
};

var encode = function encode(str, defaultEncoder, charset) {
  // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
  // It has been adapted here for stricter adherence to RFC 3986
  if (str.length === 0) {
    return str;
  }

  var string = str;

  if (_typeof(str) === 'symbol') {
    string = Symbol.prototype.toString.call(str);
  } else if (typeof str !== 'string') {
    string = String(str);
  }

  if (charset === 'iso-8859-1') {
    return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
      return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
    });
  }

  var out = '';

  for (var i = 0; i < string.length; ++i) {
    var c = string.charCodeAt(i);

    if (c === 0x2D // -
    || c === 0x2E // .
    || c === 0x5F // _
    || c === 0x7E // ~
    || c >= 0x30 && c <= 0x39 // 0-9
    || c >= 0x41 && c <= 0x5A // a-z
    || c >= 0x61 && c <= 0x7A // A-Z
    ) {
        out += string.charAt(i);
        continue;
      }

    if (c < 0x80) {
      out = out + hexTable[c];
      continue;
    }

    if (c < 0x800) {
      out = out + (hexTable[0xC0 | c >> 6] + hexTable[0x80 | c & 0x3F]);
      continue;
    }

    if (c < 0xD800 || c >= 0xE000) {
      out = out + (hexTable[0xE0 | c >> 12] + hexTable[0x80 | c >> 6 & 0x3F] + hexTable[0x80 | c & 0x3F]);
      continue;
    }

    i += 1;
    c = 0x10000 + ((c & 0x3FF) << 10 | string.charCodeAt(i) & 0x3FF);
    out += hexTable[0xF0 | c >> 18] + hexTable[0x80 | c >> 12 & 0x3F] + hexTable[0x80 | c >> 6 & 0x3F] + hexTable[0x80 | c & 0x3F];
  }

  return out;
};

var compact = function compact(value) {
  var queue = [{
    obj: {
      o: value
    },
    prop: 'o'
  }];
  var refs = [];

  for (var i = 0; i < queue.length; ++i) {
    var item = queue[i];
    var obj = item.obj[item.prop];
    var keys = Object.keys(obj);

    for (var j = 0; j < keys.length; ++j) {
      var key = keys[j];
      var val = obj[key];

      if (_typeof(val) === 'object' && val !== null && refs.indexOf(val) === -1) {
        queue.push({
          obj: obj,
          prop: key
        });
        refs.push(val);
      }
    }
  }

  compactQueue(queue);
  return value;
};

var isRegExp = function isRegExp(obj) {
  return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
  if (!obj || _typeof(obj) !== 'object') {
    return false;
  }

  return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

var combine = function combine(a, b) {
  return [].concat(a, b);
};

var maybeMap = function maybeMap(val, fn) {
  if (isArray(val)) {
    var mapped = [];

    for (var i = 0; i < val.length; i += 1) {
      mapped.push(fn(val[i]));
    }

    return mapped;
  }

  return fn(val);
};

var utils = {
  arrayToObject: arrayToObject,
  assign: assign,
  combine: combine,
  compact: compact,
  decode: decode,
  encode: encode,
  isBuffer: isBuffer,
  isRegExp: isRegExp,
  maybeMap: maybeMap,
  merge: merge
};

var utils_1 = utils.arrayToObject;
var utils_2 = utils.assign;
var utils_3 = utils.combine;
var utils_4 = utils.compact;
var utils_5 = utils.decode;
var utils_6 = utils.encode;
var utils_7 = utils.isBuffer;
var utils_8 = utils.isRegExp;
var utils_9 = utils.maybeMap;
var utils_10 = utils.merge;

var utils$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  arrayToObject: utils_1,
  assign: utils_2,
  combine: utils_3,
  compact: utils_4,
  decode: utils_5,
  encode: utils_6,
  isBuffer: utils_7,
  isRegExp: utils_8,
  maybeMap: utils_9,
  merge: utils_10
});

var replace = String.prototype.replace;
var percentTwenties = /%20/g;



var Format = {
  RFC1738: 'RFC1738',
  RFC3986: 'RFC3986'
};
var formats = utils$1.assign({
  'default': Format.RFC3986,
  formatters: {
    RFC1738: function RFC1738(value) {
      return replace.call(value, percentTwenties, '+');
    },
    RFC3986: function RFC3986(value) {
      return String(value);
    }
  }
}, Format);

var toISO = Date.prototype.toISOString;
var defaultFormat = formats['default'];
var defaults = {
  addQueryPrefix: false,
  allowDots: false,
  charset: 'utf-8',
  charsetSentinel: false,
  delimiter: '&',
  encode: true,
  encoder: utils$1.encode,
  encodeValuesOnly: false,
  format: defaultFormat,
  formatter: formats.formatters[defaultFormat],
  // deprecated
  indices: false,
  serializeDate: function serializeDate(date) {
    return toISO.call(date);
  },
  skipNulls: false,
  strictNullHandling: false
};

var stringify = /*#__PURE__*/Object.freeze({
  __proto__: null
});

var has$1 = Object.prototype.hasOwnProperty;
var isArray$1 = Array.isArray;
var defaults$1 = {
  allowDots: false,
  allowPrototypes: false,
  arrayLimit: 20,
  charset: 'utf-8',
  charsetSentinel: false,
  comma: false,
  decoder: utils$1.decode,
  delimiter: '&',
  depth: 5,
  ignoreQueryPrefix: false,
  interpretNumericEntities: false,
  parameterLimit: 1000,
  parseArrays: true,
  plainObjects: false,
  strictNullHandling: false
};

var interpretNumericEntities = function interpretNumericEntities(str) {
  return str.replace(/&#(\d+);/g, function ($0, numberStr) {
    return String.fromCharCode(parseInt(numberStr, 10));
  });
};

var parseArrayValue = function parseArrayValue(val, options) {
  if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
    return val.split(',');
  }

  return val;
}; // This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.


var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')
// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.

var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
  var obj = {};
  var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
  var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
  var parts = cleanStr.split(options.delimiter, limit);
  var skipIndex = -1; // Keep track of where the utf8 sentinel was found

  var i;
  var charset = options.charset;

  if (options.charsetSentinel) {
    for (i = 0; i < parts.length; ++i) {
      if (parts[i].indexOf('utf8=') === 0) {
        if (parts[i] === charsetSentinel) {
          charset = 'utf-8';
        } else if (parts[i] === isoSentinel) {
          charset = 'iso-8859-1';
        }

        skipIndex = i;
        i = parts.length; // The eslint settings do not allow break;
      }
    }
  }

  for (i = 0; i < parts.length; ++i) {
    if (i === skipIndex) {
      continue;
    }

    var part = parts[i];
    var bracketEqualsPos = part.indexOf(']=');
    var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;
    var key, val;

    if (pos === -1) {
      key = options.decoder(part, defaults$1.decoder, charset, 'key');
      val = options.strictNullHandling ? null : '';
    } else {
      key = options.decoder(part.slice(0, pos), defaults$1.decoder, charset, 'key');
      val = utils$1.maybeMap(parseArrayValue(part.slice(pos + 1), options), function (encodedVal) {
        return options.decoder(encodedVal, defaults$1.decoder, charset, 'value');
      });
    }

    if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
      val = interpretNumericEntities(val);
    }

    if (part.indexOf('[]=') > -1) {
      val = isArray$1(val) ? [val] : val;
    }

    if (has$1.call(obj, key)) {
      obj[key] = utils$1.combine(obj[key], val);
    } else {
      obj[key] = val;
    }
  }

  return obj;
};

var parseObject = function parseObject(chain, val, options, valuesParsed) {
  var leaf = valuesParsed ? val : parseArrayValue(val, options);

  for (var i = chain.length - 1; i >= 0; --i) {
    var obj;
    var root = chain[i];

    if (root === '[]' && options.parseArrays) {
      obj = [].concat(leaf);
    } else {
      obj = options.plainObjects ? Object.create(null) : {};
      var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
      var index = parseInt(cleanRoot, 10);

      if (!options.parseArrays && cleanRoot === '') {
        obj = {
          0: leaf
        };
      } else if (!isNaN(index) && root !== cleanRoot && String(index) === cleanRoot && index >= 0 && options.parseArrays && index <= options.arrayLimit) {
        obj = [];
        obj[index] = leaf;
      } else {
        obj[cleanRoot] = leaf;
      }
    }

    leaf = obj; // eslint-disable-line no-param-reassign
  }

  return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
  if (!givenKey) {
    return;
  } // Transform dot notation to bracket notation


  var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey; // The regex chunks

  var brackets = /(\[[^[\]]*])/;
  var child = /(\[[^[\]]*])/g; // Get the parent

  var segment = options.depth > 0 && brackets.exec(key);
  var parent = segment ? key.slice(0, segment.index) : key; // Stash the parent if it exists

  var keys = [];

  if (parent) {
    // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
    if (!options.plainObjects && has$1.call(Object.prototype, parent)) {
      if (!options.allowPrototypes) {
        return;
      }
    }

    keys.push(parent);
  } // Loop through children appending to the array until we hit depth


  var i = 0;

  while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
    i += 1;

    if (!options.plainObjects && has$1.call(Object.prototype, segment[1].slice(1, -1))) {
      if (!options.allowPrototypes) {
        return;
      }
    }

    keys.push(segment[1]);
  } // If there's a remainder, just add whatever is left


  if (segment) {
    keys.push('[' + key.slice(segment.index) + ']');
  }

  return parseObject(keys, val, options, valuesParsed);
};

var normalizeParseOptions = function normalizeParseOptions(opts) {
  if (!opts) {
    return defaults$1;
  }

  if (opts.decoder !== null && opts.decoder !== undefined && typeof opts.decoder !== 'function') {
    throw new TypeError('Decoder has to be a function.');
  }

  if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
    throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
  }

  var charset = typeof opts.charset === 'undefined' ? defaults$1.charset : opts.charset;
  return {
    allowDots: typeof opts.allowDots === 'undefined' ? defaults$1.allowDots : !!opts.allowDots,
    allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults$1.allowPrototypes,
    arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults$1.arrayLimit,
    charset: charset,
    charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults$1.charsetSentinel,
    comma: typeof opts.comma === 'boolean' ? opts.comma : defaults$1.comma,
    decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults$1.decoder,
    delimiter: typeof opts.delimiter === 'string' || utils$1.isRegExp(opts.delimiter) ? opts.delimiter : defaults$1.delimiter,
    // eslint-disable-next-line no-implicit-coercion, no-extra-parens
    depth: typeof opts.depth === 'number' || opts.depth === false ? +opts.depth : defaults$1.depth,
    ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
    interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults$1.interpretNumericEntities,
    parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults$1.parameterLimit,
    parseArrays: opts.parseArrays !== false,
    plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults$1.plainObjects,
    strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults$1.strictNullHandling
  };
};

var parse = function (str, opts) {
  var options = normalizeParseOptions(opts);

  if (str === '' || str === null || typeof str === 'undefined') {
    return options.plainObjects ? Object.create(null) : {};
  }

  var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
  var obj = options.plainObjects ? Object.create(null) : {}; // Iterate over the keys and setup the new object

  var keys = Object.keys(tempObj);

  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i];
    var newObj = parseKeys(key, tempObj[key], options, typeof str === 'string');
    obj = utils$1.merge(obj, newObj, options);
  }

  return utils$1.compact(obj);
};

var lib = {
  formats: formats,
  parse: parse,
  stringify: stringify
};

var rnds8 = new Uint8Array(16);
function rng() {
  return crypto__default['default'].randomFillSync(rnds8);
}

var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

function validate(uuid) {
  return typeof uuid === 'string' && REGEX.test(uuid);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify$1(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!validate(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return stringify$1(rnds);
}

function getUserID() {
  var qsUserID = lib.parse(window.location.search).userID;

  if (Array.isArray(qsUserID)) {
    return sessionStorage.getItem('userID') || 'guest';
  } // The order of checking UserID.
  // 1. sessionStorage
  // 2. query string


  return sessionStorage.getItem('userID') || "".concat(qsUserID) || 'guest';
}

function createTrackingToken() {
  var storageKey = 'trackingToken';
  var days30 = 60 * 60 * 24 * 30 * 1000;
  var newTrackingToken = {
    sessionID: v4(),
    date: Date.now()
  };

  try {
    var trackingToken = JSON.parse(localStorage.getItem(storageKey) || '');
    var date = trackingToken.date,
        sessionID = trackingToken.sessionID; // Expired checking (after 30 days)

    if (Date.now() - date < days30) return sessionID;
    localStorage.setItem(storageKey, JSON.stringify(newTrackingToken));
  } catch (error) {
    localStorage.setItem(storageKey, JSON.stringify(newTrackingToken));
  }

  return newTrackingToken.sessionID;
}

function createScene() {
  var title = window.document.title;
  var _window$location = window.location,
      hostname = _window$location.hostname,
      pathname = _window$location.pathname;
  return {
    title: title,
    hostname: hostname,
    pathname: pathname
  };
}
function refineEventPathname(pathname) {
  var _pathname$match;

  var slashCount = (_pathname$match = pathname.match(/-/g)) === null || _pathname$match === void 0 ? void 0 : _pathname$match.length;

  if (slashCount && slashCount >= 3) {
    // slashCount === 3+
    var pathnameArray = pathname.split('-');
    var eventId = pathnameArray[0];
    var codename = pathnameArray.splice(1, pathnameArray.length).join('-');
    return {
      eventId: eventId,
      codename: codename
    };
  }

  return {
    eventId: '',
    codename: pathname
  };
}
function createDefaultEventParams() {
  var codenameArray = window.location.pathname.split('/');
  var eventPathname = codenameArray.length > 1 ? codenameArray[1] : '';

  var _refineEventPathname = refineEventPathname(eventPathname),
      eventId = _refineEventPathname.eventId,
      codename = _refineEventPathname.codename;

  var trackingToken = createTrackingToken();
  return {
    userId: getUserID(),
    lang: navigator.language || '',
    os: navigator.userAgent || '',
    timestamp: Date.now(),
    codename: codename,
    eventId: eventId,
    guestSessionId: trackingToken
  };
}

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var DefaultSource = /*#__PURE__*/function () {
  function DefaultSource() {
    _classCallCheck(this, DefaultSource);

    this.agents = [];
    this.currentScene = createScene();
  }

  _createClass(DefaultSource, [{
    key: "addAgent",
    value: function addAgent(agent) {
      agent.initialize();
      this.agents.push(agent);
    }
  }, {
    key: "spyTransition",
    value: function spyTransition(history) {
      var _this = this;

      // wait for whole page updated
      // init page_view
      setTimeout(function () {
        return _this.transit(createScene());
      }, 100);
      history.listen(function () {
        var action = history.action; // Filtering replace action (The pushed url is not matching, ex: Redirect)

        if (action === 'PUSH') {
          setTimeout(function () {
            return _this.transit(createScene());
          }, 100);
        }
      });
    }
  }, {
    key: "spyClick",
    value: function spyClick() {
      var _this2 = this;

      window.addEventListener('click', function (event) {
        var target = event.target;

        if (target instanceof HTMLElement) {
          _this2.track({
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

  }, {
    key: "spyPageDurationByVisible",
    value: function spyPageDurationByVisible(params) {
      var _this3 = this;

      var startDurationTime = 0;

      var handleVisibleChange = function handleVisibleChange(e) {
        if (document.visibilityState === 'hidden') {
          var endDurationTime = e.timeStamp;
          var duration = Math.floor(endDurationTime - startDurationTime);

          _this3.track({
            eventName: 'pageView',
            category: 'default',
            trackingParams: _objectSpread$1({
              url: window.location.href,
              duration: duration
            }, params)
          });
        }

        if (document.visibilityState === 'visible') {
          startDurationTime = e.timeStamp;
        }
      };

      document.addEventListener('visibilitychange', handleVisibleChange);
    }
  }, {
    key: "spyPageDurationByTransition",
    value: function spyPageDurationByTransition(history, params) {
      var _this4 = this;

      var startDurationTime = Date.now();
      var url = window.location.href;
      history.listen(function () {
        var endDurationTime = Date.now();
        var duration = Math.floor(endDurationTime - startDurationTime);

        _this4.track({
          eventName: 'pageView',
          category: 'default',
          trackingParams: _objectSpread$1({
            url: url,
            duration: duration
          }, params)
        });

        startDurationTime = endDurationTime;
        url = window.location.href;
      });
    }
  }, {
    key: "login",
    value: function login(userId) {
      this.agents.forEach(function (agent) {
        return agent.report({
          type: 'login',
          userId: userId
        });
      });
    }
  }, {
    key: "transit",
    value: function transit(toScene) {
      var fromScene = this.currentScene;
      var event = {
        type: 'transition',
        fromScene: fromScene,
        toScene: toScene,
        defaultTrackingParams: createDefaultEventParams()
      };
      this.agents.forEach(function (agent) {
        return agent.report(event);
      });
    }
  }, {
    key: "track",
    value: function track(event) {
      var trackingParams = event.trackingParams;
      var defaultParams = (trackingParams === null || trackingParams === void 0 ? void 0 : trackingParams.hasOwnProperty('productName')) ? {} : createDefaultEventParams();

      var mergedTrackingParams = _objectSpread$1(_objectSpread$1({}, defaultParams), trackingParams);

      event.trackingParams = mergedTrackingParams;
      this.agents.forEach(function (agent) {
        return agent.report(_objectSpread$1({
          type: 'tracking'
        }, event));
      });
    }
  }]);

  return DefaultSource;
}();

(function (Threshold) {
  Threshold[Threshold["MIN"] = 0] = "MIN";
  Threshold[Threshold["HALF"] = 0.5] = "HALF";
  Threshold[Threshold["FULL"] = 1] = "FULL";
})(exports.Threshold || (exports.Threshold = {}));

var EVENT_NAME_CLICK = 'click';
var EVENT_NAME_ENTER = 'enter';
var EVENT_NAME_LEAVE = 'leave';
var EVENT_NAME_SEARCH = 'search';
var EVENT_NAME_SECTION_VIEW = 'section_view';
var CATEGORY_DEFAULT = 'default';
var ACTION_BUTTON_CLICK = 'ButtonClick';
var ACTION_TAB_CLICK = 'TabClick';
var ACTION_PROFILE_CLICK = 'ProfileClick';
var ACTION_LINK_CLICK = 'LinkClick';
var ACTION_ENTER = 'enter';
var __CLIENT__ = typeof window !== 'undefined' && typeof window.document !== 'undefined';

/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE.
 *
 *  https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 */
(function () {

  if ((typeof window === "undefined" ? "undefined" : _typeof(window)) !== 'object') {
    return;
  } // Exit early if all IntersectionObserver and IntersectionObserverEntry
  // features are natively supported.


  if ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
    // Minimal polyfill for Edge 15's lack of `isIntersecting`
    // See: https://github.com/w3c/IntersectionObserver/issues/211
    if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
      Object.defineProperty(window.IntersectionObserverEntry.prototype, 'isIntersecting', {
        get: function get() {
          return this.intersectionRatio > 0;
        }
      });
    }

    return;
  }
  /**
   * A local reference to the document.
   */


  var document = window.document;
  /**
   * An IntersectionObserver registry. This registry exists to hold a strong
   * reference to IntersectionObserver instances currently observing a target
   * element. Without this registry, instances without another reference may be
   * garbage collected.
   */

  var registry = [];
  /**
   * The signal updater for cross-origin intersection. When not null, it means
   * that the polyfill is configured to work in a cross-origin mode.
   * @type {function(DOMRect|ClientRect, DOMRect|ClientRect)}
   */

  var crossOriginUpdater = null;
  /**
   * The current cross-origin intersection. Only used in the cross-origin mode.
   * @type {DOMRect|ClientRect}
   */

  var crossOriginRect = null;
  /**
   * Creates the global IntersectionObserverEntry constructor.
   * https://w3c.github.io/IntersectionObserver/#intersection-observer-entry
   * @param {Object} entry A dictionary of instance properties.
   * @constructor
   */

  function IntersectionObserverEntry(entry) {
    this.time = entry.time;
    this.target = entry.target;
    this.rootBounds = ensureDOMRect(entry.rootBounds);
    this.boundingClientRect = ensureDOMRect(entry.boundingClientRect);
    this.intersectionRect = ensureDOMRect(entry.intersectionRect || getEmptyRect());
    this.isIntersecting = !!entry.intersectionRect; // Calculates the intersection ratio.

    var targetRect = this.boundingClientRect;
    var targetArea = targetRect.width * targetRect.height;
    var intersectionRect = this.intersectionRect;
    var intersectionArea = intersectionRect.width * intersectionRect.height; // Sets intersection ratio.

    if (targetArea) {
      // Round the intersection ratio to avoid floating point math issues:
      // https://github.com/w3c/IntersectionObserver/issues/324
      this.intersectionRatio = Number((intersectionArea / targetArea).toFixed(4));
    } else {
      // If area is zero and is intersecting, sets to 1, otherwise to 0
      this.intersectionRatio = this.isIntersecting ? 1 : 0;
    }
  }
  /**
   * Creates the global IntersectionObserver constructor.
   * https://w3c.github.io/IntersectionObserver/#intersection-observer-interface
   * @param {Function} callback The function to be invoked after intersection
   *     changes have queued. The function is not invoked if the queue has
   *     been emptied by calling the `takeRecords` method.
   * @param {Object=} opt_options Optional configuration options.
   * @constructor
   */


  function IntersectionObserver(callback, opt_options) {
    var options = opt_options || {};

    if (typeof callback != 'function') {
      throw new Error('callback must be a function');
    }

    if (options.root && options.root.nodeType != 1) {
      throw new Error('root must be an Element');
    } // Binds and throttles `this._checkForIntersections`.


    this._checkForIntersections = throttle(this._checkForIntersections.bind(this), this.THROTTLE_TIMEOUT); // Private properties.

    this._callback = callback;
    this._observationTargets = [];
    this._queuedEntries = [];
    this._rootMarginValues = this._parseRootMargin(options.rootMargin); // Public properties.

    this.thresholds = this._initThresholds(options.threshold);
    this.root = options.root || null;
    this.rootMargin = this._rootMarginValues.map(function (margin) {
      return margin.value + margin.unit;
    }).join(' ');
    /** @private @const {!Array<!Document>} */

    this._monitoringDocuments = [];
    /** @private @const {!Array<function()>} */

    this._monitoringUnsubscribes = [];
  }
  /**
   * The minimum interval within which the document will be checked for
   * intersection changes.
   */


  IntersectionObserver.prototype.THROTTLE_TIMEOUT = 100;
  /**
   * The frequency in which the polyfill polls for intersection changes.
   * this can be updated on a per instance basis and must be set prior to
   * calling `observe` on the first target.
   */

  IntersectionObserver.prototype.POLL_INTERVAL = null;
  /**
   * Use a mutation observer on the root element
   * to detect intersection changes.
   */

  IntersectionObserver.prototype.USE_MUTATION_OBSERVER = true;
  /**
   * Sets up the polyfill in the cross-origin mode. The result is the
   * updater function that accepts two arguments: `boundingClientRect` and
   * `intersectionRect` - just as these fields would be available to the
   * parent via `IntersectionObserverEntry`. This function should be called
   * each time the iframe receives intersection information from the parent
   * window, e.g. via messaging.
   * @return {function(DOMRect|ClientRect, DOMRect|ClientRect)}
   */

  IntersectionObserver._setupCrossOriginUpdater = function () {
    if (!crossOriginUpdater) {
      /**
       * @param {DOMRect|ClientRect} boundingClientRect
       * @param {DOMRect|ClientRect} intersectionRect
       */
      crossOriginUpdater = function crossOriginUpdater(boundingClientRect, intersectionRect) {
        if (!boundingClientRect || !intersectionRect) {
          crossOriginRect = getEmptyRect();
        } else {
          crossOriginRect = convertFromParentRect(boundingClientRect, intersectionRect);
        }

        registry.forEach(function (observer) {
          observer._checkForIntersections();
        });
      };
    }

    return crossOriginUpdater;
  };
  /**
   * Resets the cross-origin mode.
   */


  IntersectionObserver._resetCrossOriginUpdater = function () {
    crossOriginUpdater = null;
    crossOriginRect = null;
  };
  /**
   * Starts observing a target element for intersection changes based on
   * the thresholds values.
   * @param {Element} target The DOM element to observe.
   */


  IntersectionObserver.prototype.observe = function (target) {
    var isTargetAlreadyObserved = this._observationTargets.some(function (item) {
      return item.element == target;
    });

    if (isTargetAlreadyObserved) {
      return;
    }

    if (!(target && target.nodeType == 1)) {
      throw new Error('target must be an Element');
    }

    this._registerInstance();

    this._observationTargets.push({
      element: target,
      entry: null
    });

    this._monitorIntersections(target.ownerDocument);

    this._checkForIntersections();
  };
  /**
   * Stops observing a target element for intersection changes.
   * @param {Element} target The DOM element to observe.
   */


  IntersectionObserver.prototype.unobserve = function (target) {
    this._observationTargets = this._observationTargets.filter(function (item) {
      return item.element != target;
    });

    this._unmonitorIntersections(target.ownerDocument);

    if (this._observationTargets.length == 0) {
      this._unregisterInstance();
    }
  };
  /**
   * Stops observing all target elements for intersection changes.
   */


  IntersectionObserver.prototype.disconnect = function () {
    this._observationTargets = [];

    this._unmonitorAllIntersections();

    this._unregisterInstance();
  };
  /**
   * Returns any queue entries that have not yet been reported to the
   * callback and clears the queue. This can be used in conjunction with the
   * callback to obtain the absolute most up-to-date intersection information.
   * @return {Array} The currently queued entries.
   */


  IntersectionObserver.prototype.takeRecords = function () {
    var records = this._queuedEntries.slice();

    this._queuedEntries = [];
    return records;
  };
  /**
   * Accepts the threshold value from the user configuration object and
   * returns a sorted array of unique threshold values. If a value is not
   * between 0 and 1 and error is thrown.
   * @private
   * @param {Array|number=} opt_threshold An optional threshold value or
   *     a list of threshold values, defaulting to [0].
   * @return {Array} A sorted list of unique and valid threshold values.
   */


  IntersectionObserver.prototype._initThresholds = function (opt_threshold) {
    var threshold = opt_threshold || [0];
    if (!Array.isArray(threshold)) threshold = [threshold];
    return threshold.sort().filter(function (t, i, a) {
      if (typeof t != 'number' || isNaN(t) || t < 0 || t > 1) {
        throw new Error('threshold must be a number between 0 and 1 inclusively');
      }

      return t !== a[i - 1];
    });
  };
  /**
   * Accepts the rootMargin value from the user configuration object
   * and returns an array of the four margin values as an object containing
   * the value and unit properties. If any of the values are not properly
   * formatted or use a unit other than px or %, and error is thrown.
   * @private
   * @param {string=} opt_rootMargin An optional rootMargin value,
   *     defaulting to '0px'.
   * @return {Array<Object>} An array of margin objects with the keys
   *     value and unit.
   */


  IntersectionObserver.prototype._parseRootMargin = function (opt_rootMargin) {
    var marginString = opt_rootMargin || '0px';
    var margins = marginString.split(/\s+/).map(function (margin) {
      var parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin);

      if (!parts) {
        throw new Error('rootMargin must be specified in pixels or percent');
      }

      return {
        value: parseFloat(parts[1]),
        unit: parts[2]
      };
    }); // Handles shorthand.

    margins[1] = margins[1] || margins[0];
    margins[2] = margins[2] || margins[0];
    margins[3] = margins[3] || margins[1];
    return margins;
  };
  /**
   * Starts polling for intersection changes if the polling is not already
   * happening, and if the page's visibility state is visible.
   * @param {!Document} doc
   * @private
   */


  IntersectionObserver.prototype._monitorIntersections = function (doc) {
    var win = doc.defaultView;

    if (!win) {
      // Already destroyed.
      return;
    }

    if (this._monitoringDocuments.indexOf(doc) != -1) {
      // Already monitoring.
      return;
    } // Private state for monitoring.


    var callback = this._checkForIntersections;
    var monitoringInterval = null;
    var domObserver = null; // If a poll interval is set, use polling instead of listening to
    // resize and scroll events or DOM mutations.

    if (this.POLL_INTERVAL) {
      monitoringInterval = win.setInterval(callback, this.POLL_INTERVAL);
    } else {
      addEvent(win, 'resize', callback, true);
      addEvent(doc, 'scroll', callback, true);

      if (this.USE_MUTATION_OBSERVER && 'MutationObserver' in win) {
        domObserver = new win.MutationObserver(callback);
        domObserver.observe(doc, {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true
        });
      }
    }

    this._monitoringDocuments.push(doc);

    this._monitoringUnsubscribes.push(function () {
      // Get the window object again. When a friendly iframe is destroyed, it
      // will be null.
      var win = doc.defaultView;

      if (win) {
        if (monitoringInterval) {
          win.clearInterval(monitoringInterval);
        }

        removeEvent(win, 'resize', callback, true);
      }

      removeEvent(doc, 'scroll', callback, true);

      if (domObserver) {
        domObserver.disconnect();
      }
    }); // Also monitor the parent.


    if (doc != (this.root && this.root.ownerDocument || document)) {
      var frame = getFrameElement(doc);

      if (frame) {
        this._monitorIntersections(frame.ownerDocument);
      }
    }
  };
  /**
   * Stops polling for intersection changes.
   * @param {!Document} doc
   * @private
   */


  IntersectionObserver.prototype._unmonitorIntersections = function (doc) {
    var index = this._monitoringDocuments.indexOf(doc);

    if (index == -1) {
      return;
    }

    var rootDoc = this.root && this.root.ownerDocument || document; // Check if any dependent targets are still remaining.

    var hasDependentTargets = this._observationTargets.some(function (item) {
      var itemDoc = item.element.ownerDocument; // Target is in this context.

      if (itemDoc == doc) {
        return true;
      } // Target is nested in this context.


      while (itemDoc && itemDoc != rootDoc) {
        var frame = getFrameElement(itemDoc);
        itemDoc = frame && frame.ownerDocument;

        if (itemDoc == doc) {
          return true;
        }
      }

      return false;
    });

    if (hasDependentTargets) {
      return;
    } // Unsubscribe.


    var unsubscribe = this._monitoringUnsubscribes[index];

    this._monitoringDocuments.splice(index, 1);

    this._monitoringUnsubscribes.splice(index, 1);

    unsubscribe(); // Also unmonitor the parent.

    if (doc != rootDoc) {
      var frame = getFrameElement(doc);

      if (frame) {
        this._unmonitorIntersections(frame.ownerDocument);
      }
    }
  };
  /**
   * Stops polling for intersection changes.
   * @param {!Document} doc
   * @private
   */


  IntersectionObserver.prototype._unmonitorAllIntersections = function () {
    var unsubscribes = this._monitoringUnsubscribes.slice(0);

    this._monitoringDocuments.length = 0;
    this._monitoringUnsubscribes.length = 0;

    for (var i = 0; i < unsubscribes.length; i++) {
      unsubscribes[i]();
    }
  };
  /**
   * Scans each observation target for intersection changes and adds them
   * to the internal entries queue. If new entries are found, it
   * schedules the callback to be invoked.
   * @private
   */


  IntersectionObserver.prototype._checkForIntersections = function () {
    if (!this.root && crossOriginUpdater && !crossOriginRect) {
      // Cross origin monitoring, but no initial data available yet.
      return;
    }

    var rootIsInDom = this._rootIsInDom();

    var rootRect = rootIsInDom ? this._getRootRect() : getEmptyRect();

    this._observationTargets.forEach(function (item) {
      var target = item.element;
      var targetRect = getBoundingClientRect(target);

      var rootContainsTarget = this._rootContainsTarget(target);

      var oldEntry = item.entry;

      var intersectionRect = rootIsInDom && rootContainsTarget && this._computeTargetAndRootIntersection(target, targetRect, rootRect);

      var newEntry = item.entry = new IntersectionObserverEntry({
        time: now(),
        target: target,
        boundingClientRect: targetRect,
        rootBounds: crossOriginUpdater && !this.root ? null : rootRect,
        intersectionRect: intersectionRect
      });

      if (!oldEntry) {
        this._queuedEntries.push(newEntry);
      } else if (rootIsInDom && rootContainsTarget) {
        // If the new entry intersection ratio has crossed any of the
        // thresholds, add a new entry.
        if (this._hasCrossedThreshold(oldEntry, newEntry)) {
          this._queuedEntries.push(newEntry);
        }
      } else {
        // If the root is not in the DOM or target is not contained within
        // root but the previous entry for this target had an intersection,
        // add a new record indicating removal.
        if (oldEntry && oldEntry.isIntersecting) {
          this._queuedEntries.push(newEntry);
        }
      }
    }, this);

    if (this._queuedEntries.length) {
      this._callback(this.takeRecords(), this);
    }
  };
  /**
   * Accepts a target and root rect computes the intersection between then
   * following the algorithm in the spec.
   * TODO(philipwalton): at this time clip-path is not considered.
   * https://w3c.github.io/IntersectionObserver/#calculate-intersection-rect-algo
   * @param {Element} target The target DOM element
   * @param {Object} targetRect The bounding rect of the target.
   * @param {Object} rootRect The bounding rect of the root after being
   *     expanded by the rootMargin value.
   * @return {?Object} The final intersection rect object or undefined if no
   *     intersection is found.
   * @private
   */


  IntersectionObserver.prototype._computeTargetAndRootIntersection = function (target, targetRect, rootRect) {
    // If the element isn't displayed, an intersection can't happen.
    if (window.getComputedStyle(target).display == 'none') return;
    var intersectionRect = targetRect;
    var parent = getParentNode(target);
    var atRoot = false;

    while (!atRoot && parent) {
      var parentRect = null;
      var parentComputedStyle = parent.nodeType == 1 ? window.getComputedStyle(parent) : {}; // If the parent isn't displayed, an intersection can't happen.

      if (parentComputedStyle.display == 'none') return null;

      if (parent == this.root || parent.nodeType ==
      /* DOCUMENT */
      9) {
        atRoot = true;

        if (parent == this.root || parent == document) {
          if (crossOriginUpdater && !this.root) {
            if (!crossOriginRect || crossOriginRect.width == 0 && crossOriginRect.height == 0) {
              // A 0-size cross-origin intersection means no-intersection.
              parent = null;
              parentRect = null;
              intersectionRect = null;
            } else {
              parentRect = crossOriginRect;
            }
          } else {
            parentRect = rootRect;
          }
        } else {
          // Check if there's a frame that can be navigated to.
          var frame = getParentNode(parent);
          var frameRect = frame && getBoundingClientRect(frame);

          var frameIntersect = frame && this._computeTargetAndRootIntersection(frame, frameRect, rootRect);

          if (frameRect && frameIntersect) {
            parent = frame;
            parentRect = convertFromParentRect(frameRect, frameIntersect);
          } else {
            parent = null;
            intersectionRect = null;
          }
        }
      } else {
        // If the element has a non-visible overflow, and it's not the <body>
        // or <html> element, update the intersection rect.
        // Note: <body> and <html> cannot be clipped to a rect that's not also
        // the document rect, so no need to compute a new intersection.
        var doc = parent.ownerDocument;

        if (parent != doc.body && parent != doc.documentElement && parentComputedStyle.overflow != 'visible') {
          parentRect = getBoundingClientRect(parent);
        }
      } // If either of the above conditionals set a new parentRect,
      // calculate new intersection data.


      if (parentRect) {
        intersectionRect = computeRectIntersection(parentRect, intersectionRect);
      }

      if (!intersectionRect) break;
      parent = parent && getParentNode(parent);
    }

    return intersectionRect;
  };
  /**
   * Returns the root rect after being expanded by the rootMargin value.
   * @return {ClientRect} The expanded root rect.
   * @private
   */


  IntersectionObserver.prototype._getRootRect = function () {
    var rootRect;

    if (this.root) {
      rootRect = getBoundingClientRect(this.root);
    } else {
      // Use <html>/<body> instead of window since scroll bars affect size.
      var html = document.documentElement;
      var body = document.body;
      rootRect = {
        top: 0,
        left: 0,
        right: html.clientWidth || body.clientWidth,
        width: html.clientWidth || body.clientWidth,
        bottom: html.clientHeight || body.clientHeight,
        height: html.clientHeight || body.clientHeight
      };
    }

    return this._expandRectByRootMargin(rootRect);
  };
  /**
   * Accepts a rect and expands it by the rootMargin value.
   * @param {DOMRect|ClientRect} rect The rect object to expand.
   * @return {ClientRect} The expanded rect.
   * @private
   */


  IntersectionObserver.prototype._expandRectByRootMargin = function (rect) {
    var margins = this._rootMarginValues.map(function (margin, i) {
      return margin.unit == 'px' ? margin.value : margin.value * (i % 2 ? rect.width : rect.height) / 100;
    });

    var newRect = {
      top: rect.top - margins[0],
      right: rect.right + margins[1],
      bottom: rect.bottom + margins[2],
      left: rect.left - margins[3]
    };
    newRect.width = newRect.right - newRect.left;
    newRect.height = newRect.bottom - newRect.top;
    return newRect;
  };
  /**
   * Accepts an old and new entry and returns true if at least one of the
   * threshold values has been crossed.
   * @param {?IntersectionObserverEntry} oldEntry The previous entry for a
   *    particular target element or null if no previous entry exists.
   * @param {IntersectionObserverEntry} newEntry The current entry for a
   *    particular target element.
   * @return {boolean} Returns true if a any threshold has been crossed.
   * @private
   */


  IntersectionObserver.prototype._hasCrossedThreshold = function (oldEntry, newEntry) {
    // To make comparing easier, an entry that has a ratio of 0
    // but does not actually intersect is given a value of -1
    var oldRatio = oldEntry && oldEntry.isIntersecting ? oldEntry.intersectionRatio || 0 : -1;
    var newRatio = newEntry.isIntersecting ? newEntry.intersectionRatio || 0 : -1; // Ignore unchanged ratios

    if (oldRatio === newRatio) return;

    for (var i = 0; i < this.thresholds.length; i++) {
      var threshold = this.thresholds[i]; // Return true if an entry matches a threshold or if the new ratio
      // and the old ratio are on the opposite sides of a threshold.

      if (threshold == oldRatio || threshold == newRatio || threshold < oldRatio !== threshold < newRatio) {
        return true;
      }
    }
  };
  /**
   * Returns whether or not the root element is an element and is in the DOM.
   * @return {boolean} True if the root element is an element and is in the DOM.
   * @private
   */


  IntersectionObserver.prototype._rootIsInDom = function () {
    return !this.root || containsDeep(document, this.root);
  };
  /**
   * Returns whether or not the target element is a child of root.
   * @param {Element} target The target element to check.
   * @return {boolean} True if the target element is a child of root.
   * @private
   */


  IntersectionObserver.prototype._rootContainsTarget = function (target) {
    return containsDeep(this.root || document, target) && (!this.root || this.root.ownerDocument == target.ownerDocument);
  };
  /**
   * Adds the instance to the global IntersectionObserver registry if it isn't
   * already present.
   * @private
   */


  IntersectionObserver.prototype._registerInstance = function () {
    if (registry.indexOf(this) < 0) {
      registry.push(this);
    }
  };
  /**
   * Removes the instance from the global IntersectionObserver registry.
   * @private
   */


  IntersectionObserver.prototype._unregisterInstance = function () {
    var index = registry.indexOf(this);
    if (index != -1) registry.splice(index, 1);
  };
  /**
   * Returns the result of the performance.now() method or null in browsers
   * that don't support the API.
   * @return {number} The elapsed time since the page was requested.
   */


  function now() {
    return window.performance && performance.now && performance.now();
  }
  /**
   * Throttles a function and delays its execution, so it's only called at most
   * once within a given time period.
   * @param {Function} fn The function to throttle.
   * @param {number} timeout The amount of time that must pass before the
   *     function can be called again.
   * @return {Function} The throttled function.
   */


  function throttle(fn, timeout) {
    var timer = null;
    return function () {
      if (!timer) {
        timer = setTimeout(function () {
          fn();
          timer = null;
        }, timeout);
      }
    };
  }
  /**
   * Adds an event handler to a DOM node ensuring cross-browser compatibility.
   * @param {Node} node The DOM node to add the event handler to.
   * @param {string} event The event name.
   * @param {Function} fn The event handler to add.
   * @param {boolean} opt_useCapture Optionally adds the even to the capture
   *     phase. Note: this only works in modern browsers.
   */


  function addEvent(node, event, fn, opt_useCapture) {
    if (typeof node.addEventListener == 'function') {
      node.addEventListener(event, fn, opt_useCapture || false);
    } else if (typeof node.attachEvent == 'function') {
      node.attachEvent('on' + event, fn);
    }
  }
  /**
   * Removes a previously added event handler from a DOM node.
   * @param {Node} node The DOM node to remove the event handler from.
   * @param {string} event The event name.
   * @param {Function} fn The event handler to remove.
   * @param {boolean} opt_useCapture If the event handler was added with this
   *     flag set to true, it should be set to true here in order to remove it.
   */


  function removeEvent(node, event, fn, opt_useCapture) {
    if (typeof node.removeEventListener == 'function') {
      node.removeEventListener(event, fn, opt_useCapture || false);
    } else if (typeof node.detatchEvent == 'function') {
      node.detatchEvent('on' + event, fn);
    }
  }
  /**
   * Returns the intersection between two rect objects.
   * @param {Object} rect1 The first rect.
   * @param {Object} rect2 The second rect.
   * @return {?Object|?ClientRect} The intersection rect or undefined if no
   *     intersection is found.
   */


  function computeRectIntersection(rect1, rect2) {
    var top = Math.max(rect1.top, rect2.top);
    var bottom = Math.min(rect1.bottom, rect2.bottom);
    var left = Math.max(rect1.left, rect2.left);
    var right = Math.min(rect1.right, rect2.right);
    var width = right - left;
    var height = bottom - top;
    return width >= 0 && height >= 0 && {
      top: top,
      bottom: bottom,
      left: left,
      right: right,
      width: width,
      height: height
    } || null;
  }
  /**
   * Shims the native getBoundingClientRect for compatibility with older IE.
   * @param {Element} el The element whose bounding rect to get.
   * @return {DOMRect|ClientRect} The (possibly shimmed) rect of the element.
   */


  function getBoundingClientRect(el) {
    var rect;

    try {
      rect = el.getBoundingClientRect();
    } catch (err) {// Ignore Windows 7 IE11 "Unspecified error"
      // https://github.com/w3c/IntersectionObserver/pull/205
    }

    if (!rect) return getEmptyRect(); // Older IE

    if (!(rect.width && rect.height)) {
      rect = {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.right - rect.left,
        height: rect.bottom - rect.top
      };
    }

    return rect;
  }
  /**
   * Returns an empty rect object. An empty rect is returned when an element
   * is not in the DOM.
   * @return {ClientRect} The empty rect.
   */


  function getEmptyRect() {
    return {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0
    };
  }
  /**
   * Ensure that the result has all of the necessary fields of the DOMRect.
   * Specifically this ensures that `x` and `y` fields are set.
   *
   * @param {?DOMRect|?ClientRect} rect
   * @return {?DOMRect}
   */


  function ensureDOMRect(rect) {
    // A `DOMRect` object has `x` and `y` fields.
    if (!rect || 'x' in rect) {
      return rect;
    } // A IE's `ClientRect` type does not have `x` and `y`. The same is the case
    // for internally calculated Rect objects. For the purposes of
    // `IntersectionObserver`, it's sufficient to simply mirror `left` and `top`
    // for these fields.


    return {
      top: rect.top,
      y: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      x: rect.left,
      right: rect.right,
      width: rect.width,
      height: rect.height
    };
  }
  /**
   * Inverts the intersection and bounding rect from the parent (frame) BCR to
   * the local BCR space.
   * @param {DOMRect|ClientRect} parentBoundingRect The parent's bound client rect.
   * @param {DOMRect|ClientRect} parentIntersectionRect The parent's own intersection rect.
   * @return {ClientRect} The local root bounding rect for the parent's children.
   */


  function convertFromParentRect(parentBoundingRect, parentIntersectionRect) {
    var top = parentIntersectionRect.top - parentBoundingRect.top;
    var left = parentIntersectionRect.left - parentBoundingRect.left;
    return {
      top: top,
      left: left,
      height: parentIntersectionRect.height,
      width: parentIntersectionRect.width,
      bottom: top + parentIntersectionRect.height,
      right: left + parentIntersectionRect.width
    };
  }
  /**
   * Checks to see if a parent element contains a child element (including inside
   * shadow DOM).
   * @param {Node} parent The parent element.
   * @param {Node} child The child element.
   * @return {boolean} True if the parent node contains the child node.
   */


  function containsDeep(parent, child) {
    var node = child;

    while (node) {
      if (node == parent) return true;
      node = getParentNode(node);
    }

    return false;
  }
  /**
   * Gets the parent node of an element or its host element if the parent node
   * is a shadow root.
   * @param {Node} node The node whose parent to get.
   * @return {Node|null} The parent node or null if no parent exists.
   */


  function getParentNode(node) {
    var parent = node.parentNode;

    if (node.nodeType ==
    /* DOCUMENT */
    9 && node != document) {
      // If this node is a document node, look for the embedding frame.
      return getFrameElement(node);
    }

    if (parent && parent.nodeType == 11 && parent.host) {
      // If the parent is a shadow root, return the host element.
      return parent.host;
    }

    if (parent && parent.assignedSlot) {
      // If the parent is distributed in a <slot>, return the parent of a slot.
      return parent.assignedSlot.parentNode;
    }

    return parent;
  }
  /**
   * Returns the embedding frame element, if any.
   * @param {!Document} doc
   * @return {!Element}
   */


  function getFrameElement(doc) {
    try {
      return doc.defaultView && doc.defaultView.frameElement || null;
    } catch (e) {
      // Ignore the error.
      return null;
    }
  } // Exposes the constructors globally.


  window.IntersectionObserver = IntersectionObserver;
  window.IntersectionObserverEntry = IntersectionObserverEntry;
})();

var SectionObserver = /*#__PURE__*/function () {
  function SectionObserver(debounce, threshold) {
    var _this = this;

    _classCallCheck(this, SectionObserver);

    this.elementMap = new Map();
    this.debounceExecute = 0;

    try {
      this.observer = new window.IntersectionObserver(function (entries) {
        if (debounce) {
          _this.debounceSectionIntersect(entries);
        } else {
          _this.sectionIntersect(entries);
        }
      }, {
        threshold: [threshold]
      });
    } catch (error) {
      console.log("Error occur when creating IntersectionObserver: ".concat(error));
    }
  }

  _createClass(SectionObserver, [{
    key: "sectionObserve",
    value: function sectionObserve(ref, callback) {
      if (this.observer) this.observer.observe(ref.current);
      this.elementMap.set(ref.current, callback);
    }
  }, {
    key: "sectionUnobserve",
    value: function sectionUnobserve(ref) {
      if (this.observer) this.observer.unobserve(ref.current);
      if (this.elementMap.has(ref.current)) this.elementMap.delete(ref.current);
    }
  }, {
    key: "resetSectionObserver",
    value: function resetSectionObserver() {
      var _this2 = this;

      this.elementMap.forEach(function (value, key) {
        if (_this2.observer) _this2.observer.observe(key);
      });
    }
  }, {
    key: "sectionIntersect",
    value: function sectionIntersect(entries) {
      var _this3 = this;

      entries.forEach(function (entry) {
        var target = entry.target;

        if (entry.isIntersecting && _this3.elementMap.has(target)) {
          var callback = _this3.elementMap.get(target);

          if (!callback) return;
          callback();
          if (_this3.observer) _this3.observer.unobserve(target);
        }
      });
    }
  }, {
    key: "debounceSectionIntersect",
    value: function debounceSectionIntersect(entries) {
      var _this4 = this;

      entries.forEach(function (entry) {
        var target = entry.target;

        if (entry.isIntersecting && _this4.elementMap.has(target)) {
          var callback = _this4.elementMap.get(target);

          if (!callback) return;
          clearTimeout(_this4.debounceExecute);
          _this4.debounceExecute = window.setTimeout(function () {
            callback();
          }, 1000);
          if (_this4.observer) _this4.observer.unobserve(target);
        }
      });
    }
  }]);

  return SectionObserver;
}();
function registCompleteSectionObserver(ref, callback) {
  if (!__CLIENT__) {
    throw new Error('[registCompleteSectionObserver()] should be invoked on client side.');
  }

  if (!exports.completeSectionObserver) exports.completeSectionObserver = new SectionObserver(false, exports.Threshold.FULL);
  exports.completeSectionObserver.sectionObserve(ref, callback);
  return function () {
    exports.completeSectionObserver.sectionUnobserve(ref);
  };
}
function registHalfSectionObserver(ref, callback) {
  if (!__CLIENT__) {
    throw new Error('[registHalfSectionObserver()] should be invoked on client side.');
  }

  if (!exports.halfSectionObserver) exports.halfSectionObserver = new SectionObserver(false, exports.Threshold.HALF);
  exports.halfSectionObserver.sectionObserve(ref, callback);
  return function () {
    exports.halfSectionObserver.sectionUnobserve(ref);
  };
}
function registMinSectionObserver(ref, callback) {
  if (!__CLIENT__) {
    throw new Error('[registMinSectionObserver()] should be invoked on client side.');
  }

  if (!exports.minSectionObserver) exports.minSectionObserver = new SectionObserver(false, exports.Threshold.MIN);
  exports.minSectionObserver.sectionObserve(ref, callback);
  return function () {
    exports.minSectionObserver.sectionUnobserve(ref);
  };
}
function registRankSectionObserver(ref, callback) {
  if (!__CLIENT__) {
    throw new Error('[registRankSectionObserver()] should be invoked on client side.');
  }

  if (!exports.rankSectionObserver) exports.rankSectionObserver = new SectionObserver(true, exports.Threshold.FULL);
  exports.rankSectionObserver.sectionObserve(ref, callback);
  return function () {
    exports.rankSectionObserver.sectionUnobserve(ref);
  };
}
function resetSectionObserverStatus() {
  if (exports.completeSectionObserver) exports.completeSectionObserver.resetSectionObserver();
  if (exports.halfSectionObserver) exports.halfSectionObserver.resetSectionObserver();
  if (exports.minSectionObserver) exports.minSectionObserver.resetSectionObserver();
  if (exports.rankSectionObserver) exports.rankSectionObserver.resetSectionObserver();
}

function useCompleteSectionTracking(ref, callback) {
  react.useEffect(function () {
    if (ref.current === null) return;
    return registCompleteSectionObserver(ref, callback);
  });
}
function useHalfSectionTracking(ref, callback) {
  react.useEffect(function () {
    if (ref.current === null) return;
    return registHalfSectionObserver(ref, callback);
  });
}
function useMinSectionTracking(ref, callback) {
  react.useEffect(function () {
    if (ref.current === null) return;
    return registMinSectionObserver(ref, callback);
  });
}
function useRankSectionTracking(ref, callback) {
  react.useEffect(function () {
    if (ref.current === null) return;
    return registRankSectionObserver(ref, callback);
  });
}
function usePageTransitionListener(trackingSource, history) {
  react.useEffect(function () {
    // Regist history (for page_view & screen_view)
    trackingSource.spyTransition(history);
    history.listen(function () {
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
      utmCampaign: utmCampaign,
      utmContent: utmContent,
      utmMedium: utmMedium,
      utmSource: utmSource
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
      rank: rank
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
      section: section,
      // For customized event to use.
      customPath: customPath
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
exports.registCompleteSectionObserver = registCompleteSectionObserver;
exports.registHalfSectionObserver = registHalfSectionObserver;
exports.registMinSectionObserver = registMinSectionObserver;
exports.registRankSectionObserver = registRankSectionObserver;
exports.resetSectionObserverStatus = resetSectionObserverStatus;
exports.useCompleteSectionTracking = useCompleteSectionTracking;
exports.useHalfSectionTracking = useHalfSectionTracking;
exports.useMinSectionTracking = useMinSectionTracking;
exports.usePageTransitionListener = usePageTransitionListener;
exports.useRankSectionTracking = useRankSectionTracking;
//# sourceMappingURL=index.js.map
