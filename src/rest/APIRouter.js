'use strict';

// eslint-disable-next-line
const noop = () => {};
const method = ['get', 'post', 'put', 'patch', 'delete'];

function APIRouter(manager) {
  const route = [''];
  const handler = {
    get(target, name) {
      if (method.includes(name)) {
        return options => manager.request(name, route.join('/'), options || {});
      }

      route.push(name);
      return new Proxy(noop, handler);
    },
    apply(target, _, args) {
      route.push(...args.filter(x => x !== null));
      return new Proxy(noop, handler);
    },
  };
  return new Proxy(noop, handler);
}

module.exports = APIRouter;
