// Polyfills pour la compatibilité cross-browser

// Promise polyfill pour IE11 (version simple)
if (typeof Promise === 'undefined') {
  // Version très basique de Promise pour IE11
  // @ts-ignore
  window.Promise = function(executor: any) {
    // @ts-ignore
    const self = this;
    // @ts-ignore
    self.state = 'pending';
    // @ts-ignore
    self.value = undefined;

    function resolve(result: any) {
      // @ts-ignore
      if (self.state === 'pending') {
        // @ts-ignore
        self.state = 'fulfilled';
        // @ts-ignore
        self.value = result;
      }
    }

    function reject(error: any) {
      // @ts-ignore
      if (self.state === 'pending') {
        // @ts-ignore
        self.state = 'rejected';
        // @ts-ignore
        self.value = error;
      }
    }

    // @ts-ignore
    this.then = function(onFulfilled?: any, onRejected?: any) {
      return {
        then: function(callback: any) {
          return callback && callback();
        }
      };
    };

    try {
      executor(resolve, reject);
    } catch (ex) {
      reject(ex);
    }
  };
}

// Object.assign polyfill pour IE
if (typeof Object.assign !== 'function') {
  Object.assign = function(target: any, ...sources: any[]) {
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    const to = Object(target);

    for (let index = 0; index < sources.length; index++) {
      const nextSource = sources[index];

      if (nextSource != null) {
        for (const nextKey in nextSource) {
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

// Array.from polyfill pour IE
if (!Array.from) {
  Array.from = function(arrayLike: any, mapFn?: any, thisArg?: any) {
    const C = this;
    const items = Object(arrayLike);
    if (arrayLike == null) {
      throw new TypeError('Array.from requires an array-like object - not null or undefined');
    }
    const mapFunction = mapFn === undefined ? undefined : mapFn;
    if (typeof mapFunction !== 'undefined' && typeof mapFunction !== 'function') {
      throw new TypeError('Array.from: when provided, the second argument must be a function');
    }
    const len = parseInt(items.length);
    const A = typeof C === 'function' ? Object(new C(len)) : new Array(len);
    let k = 0;
    let kValue;
    while (k < len) {
      kValue = items[k];
      if (mapFunction) {
        A[k] = typeof thisArg === 'undefined' ? mapFunction(kValue, k) : mapFunction.call(thisArg, kValue, k);
      } else {
        A[k] = kValue;
      }
      k += 1;
    }
    A.length = len;
    return A;
  };
}

// String.startsWith polyfill pour IE
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString: string, position?: number) {
    position = position || 0;
    return this.substr(position, searchString.length) === searchString;
  };
}

// String.endsWith polyfill pour IE
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString: string, length?: number) {
    if (length === undefined || length > this.length) {
      length = this.length;
    }
    return this.substring(length - searchString.length, length) === searchString;
  };
}

// String.includes polyfill pour IE
if (!String.prototype.includes) {
  String.prototype.includes = function(search: string, start?: number) {
    if (typeof start !== 'number') {
      start = 0;
    }
    
    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

// Array.includes polyfill pour IE
if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement: any, fromIndex?: number) {
    return this.indexOf(searchElement, fromIndex) !== -1;
  };
}

// CustomEvent polyfill pour IE
if (typeof CustomEvent !== 'function') {
  function CustomEvent(event: string, params?: any) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }
  // @ts-ignore
  CustomEvent.prototype = window.Event.prototype;
  // @ts-ignore
  window.CustomEvent = CustomEvent;
}

// Performance.now polyfill
if (typeof performance === 'undefined') {
  // @ts-ignore
  window.performance = {};
}

if (typeof performance.now === 'undefined') {
  performance.now = function() {
    return Date.now();
  };
}

export {};
