import * as fs from 'fs-extra';
import { basename, extname, join } from 'path';

import * as paramCase from 'param-case';

import { GeneratorOptions } from './generator-options';
import { ProjectStructureOptions } from './project-structure-options';

export function getPathsBasedOnGeneratorType(generatorType: string, fileName: String, projectStructureOptions: ProjectStructureOptions) {
  if (generatorType === COMPONENT_TYPE) {
    return {
      outputDir: join(projectStructureOptions.absoluteComponentDirPath, fileName),
      sourceTemplateDir: join(projectStructureOptions.absolutePathTemplateBaseDir, COMPONENT_TYPE)
    };
  } else if (generatorType === DIRECTIVE_TYPE) {
    return {
      outputDir: join(projectStructureOptions.absoluteDirectiveDirPath, fileName),
      sourceTemplateDir: join(projectStructureOptions.absolutePathTemplateBaseDir, DIRECTIVE_TYPE)
    };
  } else if (generatorType === PAGE_TYPE) {
    return {
      outputDir: join(projectStructureOptions.absolutePagesDirPath, fileName),
      sourceTemplateDir: join(projectStructureOptions.absolutePathTemplateBaseDir, PAGE_TYPE)
    };
  } else if (generatorType === PIPE_TYPE) {
    return {
      outputDir: join(projectStructureOptions.absolutePipeDirPath),
      sourceTemplateDir: join(projectStructureOptions.absolutePathTemplateBaseDir, PIPE_TYPE)
    };
  } else if (generatorType === PROVIDER_TYPE) {
    return {
      outputDir: join(projectStructureOptions.absoluteProviderDirPath),
      sourceTemplateDir: join(projectStructureOptions.absolutePathTemplateBaseDir, PROVIDER_TYPE)
    };
  } else if (generatorType === TABS_TYPE) {
    return {
      outputDir: join(projectStructureOptions.absolutePagesDirPath, fileName),
      sourceTemplateDir: join(projectStructureOptions.absolutePathTemplateBaseDir, TABS_TYPE)
    };
  }
  else {
    throw new Error("Unknown Generator Type");
  }
}

export function renderTemplate(templateContent: string, suppliedName: string, fileName: string, className: string, tabContent: string, tabImports: string, tabVariables: string) {
  let processedTemplate = replaceAll(templateContent, FILE_NAME, fileName);
  processedTemplate = replaceAll(processedTemplate, SUPPLIED_NAME, suppliedName);
  processedTemplate = replaceAll(processedTemplate, CLASS_NAME, className);
  processedTemplate = replaceAll(processedTemplate, TAB_CONTENT, tabContent);
  processedTemplate = replaceAll(processedTemplate, TAB_IMPORTS, tabImports);
  processedTemplate = replaceAll(processedTemplate, TAB_VARIABLES, tabVariables);
  return processedTemplate;
}

export function capitalize(input: string) {
  return input[0].toUpperCase() + input.substr(1);
}

export function camelCase(input: string) {
  return input.replace(/[^A-Za-z0-9]/g, ' ').replace(/^\w|[A-Z]|\b\w|\s+/g, function (match, index) {
    if (+match === 0 || match === '-' || match === '.' ) {
      return ""; // or if (/\s+/.test(match)) for white spaces
    }
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

export function stringToClassCase(input: string) {
  return capitalize(camelCase(input));
}

export function kebabCase(input: string) {
  return paramCase(input);
}

export function replaceAll(input: string, toReplace: string, replacement: string) {
  return input.split(toReplace).join(replacement);
}

export function makeDirectoryIfNeeded(absolutePath: string): Promise<any> {
  return new Promise( (resolve, reject) => {
    //console.log(fs);
    fs.access(absolutePath, fs.F_OK, err => {
      if (err) {
        // the directory does not exist, so create it
        fs.mkdirp(absolutePath, err => {
          if (err) {
            // we failed to create the directory
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        // the directory exists already, sweet
        resolve();
      }
    });
  });
}

export function getTemplatesInDir(templateDirectoryPath: string) {
  return fs.readdirSync(templateDirectoryPath);
}

export function filterAndCleanUpTemplates(templates: string[], templateDirectoryPath: string, options: GeneratorOptions) {
  // filter the templates out
  const filteredTemplates = templates.filter( filePath => {
    // make sure it's a valid template file
    return extname(filePath) === TEMPLATE_EXTENSION;
  }).map(fileName => {
    return `${templateDirectoryPath}/${fileName}`
  }).filter(filePath => {
    // filter out sass if the option is passed to do so
    if ( filePath.includes('scss.tmpl') && ! options.includeSass) {
      return false;
    }
    return true;
  }).filter(filePath => {
    // filter out spec if the option is passed to do so
    if (filePath.includes('spec.ts.tmpl') && ! options.includeSpec) {
      return false;
    }
    return true;
  });

  return filteredTemplates;
}

export function generateFileName(templatePath, fileName) {
  // the files are named such realExtension${TEMPLATE_EXTENSION},
  // so removing ${TEMPLATE_EXTENSION} allows us to prefix the
  // filename and call it a day
  const realFileExtension = basename(templatePath, TEMPLATE_EXTENSION)
  const result = `${fileName}.${realFileExtension}`;
  return result;
}

export function mergeObjects(obj1: any, obj2: any ) {
  if (! obj1) {
    obj1 = {};
  }
  if (! obj2) {
    obj2 = {};
  }
  var obj3 = {};
  for (var attrname in obj1) {
    (<any>obj3)[attrname] = obj1[attrname];
  }
  for (var attrname in obj2) {
    (<any>obj3)[attrname] = obj2[attrname];
  }
  return obj3;
}

export const COMPONENT_TYPE = 'component';
export const DIRECTIVE_TYPE = 'directive';
export const PAGE_TYPE = 'page';
export const PIPE_TYPE = 'pipe';
export const PROVIDER_TYPE = 'provider';
export const TABS_TYPE = 'tabs';

const FILE_NAME = '$FILENAME';
const CLASS_NAME = '$CLASSNAME';
const SUPPLIED_NAME = '$SUPPLIEDNAME';
const TAB_CONTENT = '$TAB_CONTENT';
const TAB_IMPORTS = '$TAB_IMPORTS';
const TAB_VARIABLES = '$TAB_VARIABLES';

const TEMPLATE_EXTENSION = '.tmpl';

