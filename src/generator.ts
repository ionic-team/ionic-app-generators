import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { camelCase, capitalize, filterAndCleanUpTemplates, generateFileName, getPathsBasedOnGeneratorType, getTemplatesInDir, kebabCase, makeDirectoryIfNeeded, renderTemplate, stringToClassCase } from './utils';
import { GeneratorOptions } from './generator-options';
import { ProjectStructureOptions } from './project-structure-options';

export class Generator {

  suppliedName: string;
  fileName: string;
  className: string;
  tabContent: string;
  tabImports: string;
  tabVariables: string;

  constructor(public options: GeneratorOptions, public projectStructureOptions: ProjectStructureOptions){
    this.suppliedName = options.suppliedName;
    this.fileName = kebabCase(options.suppliedName);
    this.className = stringToClassCase(options.suppliedName);
    this.tabContent = '';
    this.tabImports = '';
    this.tabVariables = '';
  }

  generate(): Promise<any>{
    let pathsObj;
    try{
      pathsObj = getPathsBasedOnGeneratorType(this.options.generatorType, this.fileName, this.projectStructureOptions);
    } catch (ex) {
      return Promise.reject(ex);
    }

    return makeDirectoryIfNeeded(pathsObj.outputDir).then( () => {
      return this.renderAndWriteTemplates(pathsObj.sourceTemplateDir, pathsObj.outputDir);
    });
  }

  renderAndWriteTemplates(templateSourceDir: string, destinationDir: string) {
    const allTemplates = getTemplatesInDir(templateSourceDir);
    const filteredTemplatePaths = filterAndCleanUpTemplates(allTemplates, templateSourceDir);
    filteredTemplatePaths.forEach(templatePath => {
      const templateContent = readFileSync(templatePath).toString();
      const renderedTemplate = renderTemplate(templateContent, this.suppliedName, this.fileName, this.className, this.tabContent, this.tabImports, this.tabVariables);
      const fileName = generateFileName(templatePath, this.fileName);
      const fileToWrite = join(destinationDir, fileName);
      writeFileSync(fileToWrite, renderedTemplate);
    });
  }
}