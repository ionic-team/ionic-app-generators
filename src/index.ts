import * as chalk from 'chalk';

import { Generator } from './generator';
import { GeneratorOptions } from './generator-options';
import { ProjectStructureOptions } from './project-structure-options';
import { TabGenerator } from './tab-generator';
import { TABS_TYPE } from './utils';


export function printAvailableGenerators() {
  console.log(chalk.blue('Available generators:'as any));
  console.log(chalk.blue(' *' as any), 'Component');
  console.log(chalk.blue(' *' as any), 'Directive');
  console.log(chalk.blue(' *' as any), 'Page');
  console.log(chalk.blue(' *' as any), 'Pipe');
  console.log(chalk.blue(' *' as any), 'Provider');
  console.log(chalk.blue(' *' as any), 'Tabs');
}

export function generate(options: GeneratorOptions, projectStructureOptions: ProjectStructureOptions): Promise<any>{
  const error = validateOptions(options, projectStructureOptions);
  if (error) {
    return Promise.reject(error);
  }

  const generator = getGenerator(options, projectStructureOptions);
  return generator.generate();
}

function getGenerator(options: GeneratorOptions, projectStructureOptions: ProjectStructureOptions) {
  if (options.generatorType === TABS_TYPE) {
    return new TabGenerator(options, projectStructureOptions);
  }
  return new Generator(options, projectStructureOptions);
}

function validateOptions(options: GeneratorOptions, projectStructureOptions: ProjectStructureOptions) {
  if (!options) {
    return new Error('No options passed to generator');
  }

  if (!options.generatorType || options.generatorType.length === 0) {
    return new Error('No generator type passed');
  }

  if (!options.suppliedName || options.suppliedName.length === 0) {
    return new Error('No supplied name provided');
  }

  if (!projectStructureOptions) {
    return new Error('No projectStructureOptions passed to generator');
  }

  if (!projectStructureOptions.absolutePathTemplateBaseDir || projectStructureOptions.absolutePathTemplateBaseDir.length === 0) {
    return new Error('projectStructureOptions.absolutePathTemplateBaseDir is a required field');
  }

  if (!projectStructureOptions.absoluteComponentDirPath || projectStructureOptions.absoluteComponentDirPath.length === 0) {
    return new Error('projectStructureOptions.absoluteComponentDirPath is a required field');
  }

  if (!projectStructureOptions.absoluteDirectiveDirPath || projectStructureOptions.absoluteDirectiveDirPath.length === 0) {
    return new Error('projectStructureOptions.absoluteDirectiveDirPath is a required field');
  }

  if (!projectStructureOptions.absolutePagesDirPath || projectStructureOptions.absolutePagesDirPath.length === 0) {
    return new Error('projectStructureOptions.absolutePagesDirPath is a required field');
  }

  if (!projectStructureOptions.absolutePipeDirPath || projectStructureOptions.absolutePipeDirPath.length === 0) {
    return new Error('projectStructureOptions.absolutePipeDirPath is a required field');
  }

  if (!projectStructureOptions.absoluteProviderDirPath || projectStructureOptions.absoluteProviderDirPath.length === 0) {
    return new Error('projectStructureOptions.absoluteProviderDirPath is a required field');
  }
}