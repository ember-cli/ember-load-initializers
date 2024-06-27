import Engine from '@ember/engine';

function resolveInitializer(moduleName: string, compatModules: any) {
  let module = compatModules[moduleName];
  if (!module) {
    throw new Error(moduleName + ' must export an initializer.');
  }
  let initializer = module['default'];
  if (!initializer) {
    throw new Error(moduleName + ' must have a default export');
  }
  if (!initializer.name) {
    initializer.name = moduleName.slice(moduleName.lastIndexOf('/') + 1);
  }
  return initializer;
}

function registerInitializers(app: typeof Engine, moduleNames: string[], compatModules: any) {
  for (let i = 0; i < moduleNames.length; i++) {
    app.initializer(resolveInitializer(moduleNames[i], compatModules));
  }
}

function registerInstanceInitializers(app: typeof Engine, moduleNames: string[], compatModules: any) {
  for (let i = 0; i < moduleNames.length; i++) {
    app.instanceInitializer(resolveInitializer(moduleNames[i], compatModules));
  }
}

function _endsWith(str: string, suffix: string): boolean {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

/**
 * Configure your application as it boots
 */
export default function loadInitializers(app: typeof Engine, prefix: string, compatModules: any): void {
  const initializerPrefix = prefix + '/initializers/';
  const instanceInitializerPrefix = prefix + '/instance-initializers/';
  let initializers = [];
  let instanceInitializers = [];
  // this is 2 pass because generally the first pass is the problem
  // and is reduced, and resolveInitializer has potential to deopt
  const moduleNames = Object.keys(compatModules);
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
  registerInitializers(app, initializers, compatModules);
  registerInstanceInitializers(app, instanceInitializers, compatModules);
}
