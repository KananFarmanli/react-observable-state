const { useState, useEffect } = require('react');
const { debounce, throttle } = require('throttle-debounce');
const { without, split, keys, juxt } = require('ramda');

const updateObjectInPlace = (originalObject, updatedProperties) => {
  Object.keys(updatedProperties).forEach((key) => {
    const value = updatedProperties[key];

    if (typeof value === 'object' && !Array.isArray(value)) {
      updateObjectInPlace(originalObject[key] || {}, value);
    } else if (typeof value !== 'undefined') {
      originalObject[key] = value;
    }
  });

  return originalObject;
};

const toNestedObject = (x) =>
  reduce(
    (a, [p, v]) => assocPath(p, v, a),
    {},
    map((y) => [split('.', y), x[y]], keys(x))
  );

const Observable = (init = {}) => {
  const subscribers = new Map();

  const handler = {
    ownKeys(target) {
      return without('__path__', Reflect.ownKeys(target));
    },
    set(target, path, value) {
      const fullPath = Reflect.get(target, '__path__')
        ? `${Reflect.get(target, '__path__')}.${path}`
        : path;
      if (typeof value === 'object' && value !== null) {
        value.__path__ = fullPath;
        value = new Proxy(value, handler);
      }
      target[path] = value;

      Array.from(subscribers.keys()).map(
        (x) =>
          new RegExp(x).test(fullPath) &&
          subscribers.get(x).map((f) => f(value, path))
      );

      return true;
    },
    get: (target, property, receiver) => {
      try {
        if (target[property]) return target[property];
        if (typeof property === 'symbol') return Reflect.get(target, property);

        const path = property.split('.');
        let current = target;
        for (let i = 0; i < path.length; i++) {
          current = current[path[i]];
          if (!current) {
            break;
          }
        }
        return current;
      } catch (e) {
        console.log(e);
      }
    },
  };

  init.subscribe = (path, fn) => {
    if (!subscribers.has(path)) {
      subscribers.set(path, []);
    }
    subscribers.get(path).push(fn);
    return () => {
      let subscriber = subscribers.get(path).filter((s) => s !== fn);
      if (subscriber.length === 0) {
        subscribers.delete(path);
      }
      return fn;
    };
  };

  init.update = (partialObject) => updateObjectInPlace(init, partialObject);

  init.subscribe.subscribers = subscribers;

  return new Proxy(init, handler);
};

const useObservable = (paths, timeout = 100) => {
  if (!paths) return;
  paths = split(/\s*,\s*/, paths);
  const [v, s] = useState(0);
  const rerender = timeout ? throttle(timeout, () => s(v + 1)) : () => s(v + 1);
  useEffect(() => juxt(paths.map((p) => State.subscribe(p, rerender))));
  return State;
};

module.exports = {
  useObservable: useObservable,
  Observable: Observable,
};
