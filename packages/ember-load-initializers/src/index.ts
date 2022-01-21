import type Engine from '@ember/engine';

declare global {
  const requirejs: {
    _eak_seen: Record<string, unknown>;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function require(moduleName: string, ...args: any[]): any;

function resolveInitializer(moduleName: string) {
  const module = require(moduleName, null, null, true);
  if (!module) {
    throw new Error(moduleName + ' must export an initializer.');
  }
  const initializer = module['default'];
  if (!initializer) {
    throw new Error(moduleName + ' must have a default export');
  }
  if (!initializer.name) {
    initializer.name = moduleName.slice(moduleName.lastIndexOf('/') + 1);
  }
  return initializer;
}

function registerInitializers(app: typeof Engine, moduleNames: string[]) {
  for (let i = 0; i < moduleNames.length; i++) {
    app.initializer(resolveInitializer(moduleNames[i]));
  }
}

function registerInstanceInitializers(
  app: typeof Engine,
  moduleNames: string[]
) {
  for (let i = 0; i < moduleNames.length; i++) {
    app.instanceInitializer(resolveInitializer(moduleNames[i]));
  }
}

function _endsWith(str: string, suffix: string): boolean {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

/**
 * Configure your application as it boots
 */
export default function loadInitializers(
  app: typeof Engine,
  prefix: string
): void {
  const initializerPrefix = prefix + '/initializers/';
  const instanceInitializerPrefix = prefix + '/instance-initializers/';
  const initializers = [];
  const instanceInitializers = [];
  // this is 2 pass because generally the first pass is the problem
  // and is reduced, and resolveInitializer has potential to deopt
  const moduleNames = Object.keys(requirejs._eak_seen);
  for (let i = 0; i < moduleNames.length; i++) {
    const moduleName = moduleNames[i];
    if (moduleName.lastIndexOf(initializerPrefix, 0) === 0) {
      if (!_endsWith(moduleName, '-test')) {
        initializers.push(moduleName);
      }
    } else if (moduleName.lastIndexOf(instanceInitializerPrefix, 0) === 0) {
      if (!_endsWith(moduleName, '-test')) {
        instanceInitializers.push(moduleName);
      }
    }
  }
  registerInitializers(app, initializers);
  registerInstanceInitializers(app, instanceInitializers);
}
