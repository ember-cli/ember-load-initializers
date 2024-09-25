import type { default as Engine, Initializer } from '@ember/engine';

interface ModuleProvider {
  names(): string[];
  load(name: string): Record<string, unknown>;
}

function resolveInitializer<T>(modules: ModuleProvider, moduleName: string): Initializer<T> {
  let module = modules.load(moduleName);
  if (!module) {
    throw new Error(moduleName + ' must export an initializer.');
  }
  let initializer = module.default as Initializer<T> | undefined;
  if (!initializer) {
    throw new Error(moduleName + ' must have a default export');
  }
  if (!initializer.name) {
    initializer.name = moduleName.slice(moduleName.lastIndexOf('/') + 1);
  }
  return initializer;
}

function registerInitializers(app: typeof Engine, modules: ModuleProvider, moduleNames: string[]) {
  for (let moduleName of moduleNames) {
    app.initializer(resolveInitializer(modules, moduleName));
  }
}

function registerInstanceInitializers(app: typeof Engine, modules: ModuleProvider, moduleNames: string[]) {
  for (let moduleName of moduleNames) {
    app.instanceInitializer(resolveInitializer(modules, moduleName));
  }
}

/**
 * Configure your application as it boots
 */
export default function loadInitializers(app: typeof Engine, prefix: string, explicitModules?: Record<string, Record<string, unknown>>): void {
  var initializerPrefix = prefix + '/initializers/';
  var instanceInitializerPrefix = prefix + '/instance-initializers/';
  var initializers = [];
  var instanceInitializers = [];

  let modules: ModuleProvider;
  if (explicitModules) {
    modules = {
      names() {
        return Object.keys(explicitModules);
      },
      load(name) {
        return explicitModules[name];
      }
    }
  } else {
    modules = {
      names() {
        let requirejs = globalThis.requirejs;
        if (!requirejs || !requirejs._eak_seen) {
          throw new Error("No global AMD loader found. To use loadInitializers without a global AMD loader you must provide explicit modules");
        }
        return Object.keys(requirejs._eak_seen);
      },
      load(name) {
        return globalThis.require(name, null, null, true);
      }
    }
  }

  for (let moduleName of modules.names()) {
    if (moduleName.startsWith(initializerPrefix) && !moduleName.endsWith('-test')) {
      initializers.push(moduleName);
    } else if (moduleName.startsWith(instanceInitializerPrefix) && !moduleName.endsWith('-test')) {
      instanceInitializers.push(moduleName);
    }
  }
  registerInitializers(app, modules, initializers);
  registerInstanceInitializers(app, modules, instanceInitializers);
}
