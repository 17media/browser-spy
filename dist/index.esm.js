import 'intersection-observer';

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
  strArray.forEach(function (_char, index) {
    var currentCharCode = _char.charCodeAt(0);

    var asciiCodeA = 'A'.charCodeAt(0);
    var asciiCodeZ = 'Z'.charCodeAt(0);

    if (currentCharCode >= asciiCodeA && currentCharCode <= asciiCodeZ) {
      upperCaseMap.set(index, _char);
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
        var firebase;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return loadScripts('https://www.gstatic.com/firebasejs/7.14.1/firebase-app.js', 'https://www.gstatic.com/firebasejs/7.14.1/firebase-analytics.js');

              case 2:
                _context2.next = 4;
                return import('firebase');

              case 4:
                firebase = _context2.sent;

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

              case 8:
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
  if (!slashCount) return {
    eventId: '',
    codename: ''
  };
  if (slashCount === 1 || slashCount === 2) return {
    eventId: '',
    codename: pathname
  }; // slashCount === 3+

  var pathnameArray = pathname.split('-');
  var eventId = pathnameArray[0];
  var codename = pathnameArray.splice(1, pathnameArray.length).join('-');
  return {
    eventId: eventId,
    codename: codename
  };
}
function createDefaultEventParams() {
  var codenameArray = window.location.pathname.split('/');
  var eventPathname = codenameArray.length > 1 ? codenameArray[1] : '';

  var _refineEventPathname = refineEventPathname(eventPathname),
      eventId = _refineEventPathname.eventId,
      codename = _refineEventPathname.codename;

  return {
    userId: sessionStorage.getItem('userID') || 'guest',
    lang: navigator.language || '',
    os: navigator.userAgent || '',
    timestamp: Date.now(),
    codename: codename,
    eventId: eventId
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

var Threshold;

(function (Threshold) {
  Threshold[Threshold["MIN"] = 0] = "MIN";
  Threshold[Threshold["HALF"] = 0.5] = "HALF";
  Threshold[Threshold["FULL"] = 1] = "FULL";
})(Threshold || (Threshold = {}));

var SectionObserver = function SectionObserver(debounce, threshold) {
  var _this = this;

  _classCallCheck(this, SectionObserver);

  this.debounceExecute = 0;

  this.sectionObserve = function (ref, callback) {
    var _this$observer;

    (_this$observer = _this.observer) === null || _this$observer === void 0 ? void 0 : _this$observer.observe(ref.current);

    _this.elementMap.set(ref.current, callback);
  };

  this.sectionUnobserve = function (ref) {
    var _this$observer2;

    (_this$observer2 = _this.observer) === null || _this$observer2 === void 0 ? void 0 : _this$observer2.unobserve(ref.current);
    if (_this.elementMap.has(ref.current)) _this.elementMap.delete(ref.current);
  };

  this.resetSectionObserver = function () {
    _this.elementMap.forEach(function (value, key) {
      var _this$observer3;

      (_this$observer3 = _this.observer) === null || _this$observer3 === void 0 ? void 0 : _this$observer3.observe(key);
    });
  };

  this.sectionIntersect = function (entries) {
    entries.forEach(function (entry) {
      var target = entry.target;

      if (entry.isIntersecting && _this.elementMap.has(target)) {
        var _this$observer4;

        var callback = _this.elementMap.get(target);

        if (!callback) return;
        callback();
        (_this$observer4 = _this.observer) === null || _this$observer4 === void 0 ? void 0 : _this$observer4.unobserve(target);
      }
    });
  };

  this.debounceSectionIntersect = function (entries) {
    entries.forEach(function (entry) {
      var target = entry.target;

      if (entry.isIntersecting && _this.elementMap.has(target)) {
        var _this$observer5;

        var callback = _this.elementMap.get(target);

        if (!callback) return;
        clearTimeout(_this.debounceExecute);
        _this.debounceExecute = window.setTimeout(function () {
          callback();
        }, 1000);
        (_this$observer5 = _this.observer) === null || _this$observer5 === void 0 ? void 0 : _this$observer5.unobserve(target);
      }
    });
  };

  this.elementMap = new Map();

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
};

var completeSectionObserver = new SectionObserver(false, Threshold.FULL);
var halfSectionObserver = new SectionObserver(false, Threshold.HALF);
var minSectionObserver = new SectionObserver(false, Threshold.MIN);
var rankSectionObserver = new SectionObserver(true, Threshold.FULL);

var Test = 'test';

export { Agent, DefaultSource, FirebaseAgent, MatomoAgent, Test, Threshold, completeSectionObserver, halfSectionObserver, minSectionObserver, rankSectionObserver };
//# sourceMappingURL=index.esm.js.map
