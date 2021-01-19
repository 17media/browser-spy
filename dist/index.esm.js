import qs from 'qs';
import { v4 } from 'uuid';
import 'intersection-observer';
import { useEffect } from 'react';

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

function isTrackingEvent(value) {
  if (_typeof(value) !== 'object') return false;
  if (value === null) return false;
  return value.$$type === 'TrackingEvent';
}

/**
 * @see https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
 */
function isMobile() {
  var check = false;

  (function (a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);

  return check;
}

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
var ACTION_ENTER = 'scroll';
var __CLIENT__ = typeof window !== 'undefined' && typeof window.document !== 'undefined';
var matomoCustomDimensionMap = {
  contentId: 'dimension1',
  contentType: 'dimension2',
  search: 'dimension5',
  comment: 'dimension6',
  genericJson: 'dimension11',
  genericText: 'dimension12',
  traceId: 'dimension13',
  appVersion: 'dimension15',
  deviceId: 'dimension16',
  timestamp: 'dimension17',
  componentId: 'dimension21',
  componentType: 'dimension22',
  advertisingId: 'dimension23',
  sourceUrl: 'dimension24',
  user: 'dimension25'
};
var IS_MOBILE = isMobile();

function getUserID() {
  var qsUserID = qs.parse(window.location.search, {
    ignoreQueryPrefix: true
  }).userID;

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
function createMatomoCustomDimensions(event) {
  var dimensions = {};

  for (var key in event.payload) {
    var dimensionKey = matomoCustomDimensionMap[key];
    if (!dimensionKey) continue;
    dimensions[dimensionKey] = event.payload[key];
  }

  return dimensions;
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
function createTrackingEvent(event) {
  return _objectSpread(_objectSpread({}, event), {}, {
    payload: _objectSpread(_objectSpread({}, createDefaultEventParams()), event.payload),
    type: 'tracking',
    $$type: 'TrackingEvent'
  });
}

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
      this.client.logEvent('page_view', _objectSpread$1({
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
      if (isTrackingEvent(event)) {
        var name = event.name,
            payload = event.payload;
        trim(payload);
        this.client.logEvent(name, convertParamsToSankecase(payload));
        return;
      }

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
    _this3.trackPageViewTimer = 0;
    _this3.campaignID = '';
    return _this3;
  }

  _createClass(MatomoAgent, [{
    key: "doInitialize",
    value: function () {
      var _doInitialize2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.client.push(['setTrackerUrl', "".concat(this.config.endpoint, "matomo.php")]);
                this.client.push(['setSiteId', this.config.siteId]);
                this.client.push(['trackPageView']);
                this.client.push(['enableLinkTracking']);
                this.client.push(['trackAllContentImpressions']);
                _context3.next = 7;
                return loadScript("".concat(this.config.endpoint, "piwik.js"));

              case 7:
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
    key: "setCampaignID",
    value: function setCampaignID(campaignID) {
      this.campaignID = campaignID;
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
      this.client.push(['setReferrerUrl', fromScene.pathname]);
      this.client.push(['setCustomUrl', toScene.pathname]);
      this.client.push(['setDocumentTitle', toScene.title]);
      this.client.push(['setGenerationTimeMs', 0]);
      this.requestTrackPageView();
      this.client.push(['enableLinkTracking']);
      this.client.push(['trackAllContentImpressions']);
    }
  }, {
    key: "track",
    value: function track(event) {
      if (isTrackingEvent(event)) {
        var category = event.category,
            action = event.action,
            name = event.name;
        event.payload.genericText = IS_MOBILE ? 'Event_Mobile' : 'Event_Web';

        if (this.campaignID) {
          event.payload.contentType = 'Event';
          event.payload.contentId = this.campaignID;
        }

        var dimensions = createMatomoCustomDimensions(event);
        this.client.push(['trackEvent', category, action, name, '', dimensions]);
        return;
      } // matomo support only v2 event
      // /**
      //  * ref : https://developer.matomo.org/guides/tracking-javascript
      //  * trackEvent(category, action, [name], [value]) -
      //  * Log an event with an event category (Videos, Music, Games...), an event action (Play, Pause, Duration, Add Playlist, Downloaded, Clicked...), and an optional event name and optional numeric value.
      //  */
      // const { eventName, category, trackingParams = {} } = event;
      // const { name = '', value = '' } = trackingParams;
      // const dimensions = {};
      // /**
      //  * _paq.push(['trackEvent', category, action, name, value, {dimension1: 'DimensionValue'}]);
      //  * _paq.push(['trackSiteSearch', keyword, category, resultsCount, {dimension1: 'DimensionValue'}]);
      //  * _paq.push(['trackLink', url, linkType, {dimension1: 'DimensionValue'}]);
      //  * _paq.push(['trackGoal', idGoal, customRevenue, {dimension1: 'DimensionValue'}]);
      //  */
      // this.client.push(['trackEvent', category, eventName, name, value, dimensions]);

    }
  }, {
    key: "requestTrackPageView",
    value: function requestTrackPageView() {
      var _this4 = this;

      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : createTrackingEvent({
        category: '',
        action: '',
        name: '',
        payload: {}
      });
      if (this.trackPageViewTimer) clearTimeout(this.trackPageViewTimer);
      this.trackPageViewTimer = setTimeout(function () {
        if (isTrackingEvent(event)) {
          var dimensions = createMatomoCustomDimensions(event);

          _this4.client.push(['trackPageView', null, dimensions]);
        } else {
          _this4.client.push(['trackPageView']);
        }

        _this4.trackPageViewTimer = 0;
      });
    }
  }, {
    key: "client",
    get: function get() {
      window._paq = window._paq || []; // eslint-disable-line no-underscore-dangle

      return window._paq; // eslint-disable-line no-underscore-dangle
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

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
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
            trackingParams: _objectSpread$2({
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
          trackingParams: _objectSpread$2({
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
      this.report({
        type: 'login',
        userId: userId
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
      this.report(event);
    }
  }, {
    key: "track",
    value: function track(event) {
      if (isTrackingEvent(event)) {
        this.report(event);
        return;
      }

      var trackingParams = event.trackingParams;
      var defaultParams = (trackingParams === null || trackingParams === void 0 ? void 0 : trackingParams.hasOwnProperty('productName')) ? {} : createDefaultEventParams();

      var mergedTrackingParams = _objectSpread$2(_objectSpread$2({}, defaultParams), trackingParams);

      event.trackingParams = mergedTrackingParams;
      this.report(_objectSpread$2({
        type: 'tracking'
      }, event));
    }
  }, {
    key: "report",
    value: function report(event) {
      this.agents.forEach(function (agent) {
        try {
          agent.report(event);
        } catch (error) {
          console.error(error);
        }
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

var completeSectionObserver;
var halfSectionObserver;
var minSectionObserver;
var rankSectionObserver;
function registCompleteSectionObserver(ref, callback) {
  if (!__CLIENT__) {
    throw new Error('[registCompleteSectionObserver()] should be invoked on client side.');
  }

  if (!completeSectionObserver) completeSectionObserver = new SectionObserver(false, Threshold.FULL);
  completeSectionObserver.sectionObserve(ref, callback);
  return function () {
    completeSectionObserver.sectionUnobserve(ref);
  };
}
function registHalfSectionObserver(ref, callback) {
  if (!__CLIENT__) {
    throw new Error('[registHalfSectionObserver()] should be invoked on client side.');
  }

  if (!halfSectionObserver) halfSectionObserver = new SectionObserver(false, Threshold.HALF);
  halfSectionObserver.sectionObserve(ref, callback);
  return function () {
    halfSectionObserver.sectionUnobserve(ref);
  };
}
function registMinSectionObserver(ref, callback) {
  if (!__CLIENT__) {
    throw new Error('[registMinSectionObserver()] should be invoked on client side.');
  }

  if (!minSectionObserver) minSectionObserver = new SectionObserver(false, Threshold.MIN);
  minSectionObserver.sectionObserve(ref, callback);
  return function () {
    minSectionObserver.sectionUnobserve(ref);
  };
}
function registRankSectionObserver(ref, callback) {
  if (!__CLIENT__) {
    throw new Error('[registRankSectionObserver()] should be invoked on client side.');
  }

  if (!rankSectionObserver) rankSectionObserver = new SectionObserver(true, Threshold.FULL);
  rankSectionObserver.sectionObserve(ref, callback);
  return function () {
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
  useEffect(function () {
    if (ref.current === null) return;
    return registCompleteSectionObserver(ref, callback);
  });
}
function useHalfSectionTracking(ref, callback) {
  useEffect(function () {
    if (ref.current === null) return;
    return registHalfSectionObserver(ref, callback);
  });
}
function useMinSectionTracking(ref, callback) {
  useEffect(function () {
    if (ref.current === null) return;
    return registMinSectionObserver(ref, callback);
  });
}
function useRankSectionTracking(ref, callback) {
  useEffect(function () {
    if (ref.current === null) return;
    return registRankSectionObserver(ref, callback);
  });
}
function usePageTransitionListener(trackingSource, history) {
  useEffect(function () {
    // Regist history (for page_view & screen_view)
    trackingSource.spyTransition(history);
    return history.listen(function () {
      resetSectionObserverStatus();
    });
  }, [history]);
}

function createButtonClickAction(buttonName, link) {
  return {
    eventName: EVENT_NAME_CLICK,
    category: 'PageSurfing',
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
    category: 'PageSurfing',
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
    category: liveStatus ? 'LiveStream' : 'Profile',
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
    category: 'Content',
    trackingParams: {
      searchString: keyword,
      resultCount: count
    }
  };
}
function createVoteAction(voteTopic) {
  return {
    eventName: EVENT_NAME_CLICK,
    category: 'Interaction_vote',
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
    category: 'PageSurfing',
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
    category: 'PageSurfing',
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
    category: 'PageSurfing',
    trackingParams: {
      action: ACTION_ENTER,
      section: section,
      // For customized event to use.
      customPath: customPath
    }
  };
}

export { Agent, DefaultSource, FirebaseAgent, MatomoAgent, Threshold, completeSectionObserver, createButtonClickAction, createDefaultEventParams, createLeaderboardSectionViewAction, createLinkClickAction, createPageEnterAction, createPageLeaveAction, createProfileClickAction, createSearchAction, createSectionViewAction, createTabClickAction, createTrackingEvent as createV2TrackingEvent, createVoteAction, halfSectionObserver, minSectionObserver, rankSectionObserver, registCompleteSectionObserver, registHalfSectionObserver, registMinSectionObserver, registRankSectionObserver, resetSectionObserverStatus, useCompleteSectionTracking, useHalfSectionTracking, useMinSectionTracking, usePageTransitionListener, useRankSectionTracking };
//# sourceMappingURL=index.esm.js.map
