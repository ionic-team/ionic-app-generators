import * as colors from 'colors';

import { Generator } from './generator';
import { GeneratorOptions } from './generator-options';
import { ProjectStructureOptions } from "./project-structure-options";


export function printAvailableGenerators() {
  console.log(('Available generators:'as any).blue);
  console.log((' *' as any).blue, 'Component');
  console.log((' *' as any).blue, 'Directive');
  console.log((' *' as any).blue, 'Page');
  console.log((' *' as any).blue, 'Pipe');
  console.log((' *' as any).blue, 'Provider');
}

export function generate(options: GeneratorOptions, projectStructureOptions: ProjectStructureOptions) {
  validateOptions(options, projectStructureOptions);
  const generator = new Generator(options, projectStructureOptions);
  generator.generate();
}

function validateOptions(options: GeneratorOptions, projectStructureOptions: ProjectStructureOptions) {
  if (!options) {
    throw new Error('No options passed to generator');
  }

  if (!options.generatorType || options.generatorType.length === 0) {
    throw new Error('No generator type passed');
  }

  if (!options.suppliedName || options.suppliedName.length === 0) {
    throw new Error('No supplied name provided');
  }

  if (!projectStructureOptions) {
    throw new Error('No projectStructureOptions passed to generator');
  }

  if (!projectStructureOptions.absoluteComponentDirPath || projectStructureOptions.absoluteComponentDirPath.length === 0) {
    throw new Error('projectStructureOptions.absoluteComponentDirPath is a required field');
  }

  if (!projectStructureOptions.absoluteDirectiveDirPath || projectStructureOptions.absoluteDirectiveDirPath.length === 0) {
    throw new Error('projectStructureOptions.absoluteDirectiveDirPath is a required field');
  }

  if (!projectStructureOptions.absolutePagesDirPath || projectStructureOptions.absolutePagesDirPath.length === 0) {
    throw new Error('projectStructureOptions.absolutePagesDirPath is a required field');
  }

  if (!projectStructureOptions.absolutePipeDirPath || projectStructureOptions.absolutePipeDirPath.length === 0) {
    throw new Error('projectStructureOptions.absolutePipeDirPath is a required field');
  }

  if (!projectStructureOptions.absoluteProviderDirPath || projectStructureOptions.absoluteProviderDirPath.length === 0) {
    throw new Error('projectStructureOptions.absoluteProviderDirPath is a required field');
  }
}