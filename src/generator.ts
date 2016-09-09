import { camelCase, capitalize, kebabCase, template } from 'lodash';
import * as mkdirp from 'mkdirp-no-bin';

import { access, F_OK, readdirSync, readFileSync, writeFileSync } from 'fs';
import { basename, extname, join } from 'path';

import { GeneratorOptions } from './generator-options';
import { ProjectStructureOptions } from './project-structure-options';

export class Generator {

  fileName: string;
  className: string;

  constructor(public options: GeneratorOptions, public projectStructureOptions: ProjectStructureOptions){
    this.fileName = kebabCase(options.suppliedName);
    this.className = capitalize(camelCase(options.suppliedName));
  }

  generate() {
    const pathsObj = this.getPathsBasedOnGeneratorType(this.options.generatorType);
    this.makeDirectoryIfNeeded(pathsObj.outputDir).then( () => {
      return this.renderAndWriteTemplates(pathsObj.sourceTemplateDir, pathsObj.outputDir);
    }).catch( err => {
      console.log("ERROR: An unexpected error occurred");
      console.log(err.msg);
      process.exit(1);
    });
  }

  makeDirectoryIfNeeded(absolutePath: string): Promise<any>{
    return new Promise( (resolve, reject) => {
      access(absolutePath, F_OK, err => {
        if (err) {
          // the directory does not exist, so create it
          mkdirp(absolutePath, err => {
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

  renderAndWriteTemplates(templateSourceDir: string, destinationDir: string) {
    const templatePaths = this.loadTemplates(templateSourceDir);
    templatePaths.forEach(templatePath => {
      const renderedTemplate = this.renderTemplate(templatePath);
      const fileName = this.generateFileName(templatePath);
      const fileToWrite = join(destinationDir, fileName);
      writeFileSync(fileToWrite, renderedTemplate);
    });
  }

  generateFileName(templatePath) {
    // the files are named such realExtension${TEMPLATE_EXTENSION},
    // so removing ${TEMPLATE_EXTENSION} allows us to prefix the
    // filename and call it a day
    const realFileExtension = basename(templatePath, TEMPLATE_EXTENSION)
    const fileName = `${this.fileName}.${realFileExtension}`;
    return fileName;
  }

  loadTemplates(templateDirectoryPath: string): string[]{
    // filter the templates out
    const templates = readdirSync(templateDirectoryPath).filter( filePath => {
      // make sure it's a valid template file
      return extname(filePath) === TEMPLATE_EXTENSION;
    }).filter(filePath => {
      // filter out sass if the option is passed to do so
      if ( filePath.includes('.scss') && !this.options.includeSass) {
        return false;
      }
      return true;
    }).filter(filePath => {
      // filter out spec if the option is passed to do so
      if ( filePath.includes('.spec') && !this.options.includeSpec) {
        return false;
      }
      return true;
    });

    return templates;
  }

  renderTemplate(pathToTemplate: string) {
    const templateContent = readFileSync(pathToTemplate).toString();
    const templateCompiler = template(templateContent);
    const renderedContent = templateCompiler(this);
    return renderedContent;
  }

  private getPathsBasedOnGeneratorType(generatorType: string) {
    if (generatorType === COMPONENT_TYPE) {
      return {
        outputDir: join(this.projectStructureOptions.absoluteComponentDirPath, this.fileName),
        sourceTemplateDir: join(__dirname, COMPONENT_TYPE)
      };
    } else if (generatorType === DIRECTIVE_TYPE) {
      return {
        outputDir: join(this.projectStructureOptions.absoluteDirectiveDirPath, this.fileName),
        sourceTemplateDir: join(__dirname, DIRECTIVE_TYPE)
      };
    } else if (generatorType === PAGE_TYPE) {
      return {
        outputDir: join(this.projectStructureOptions.absolutePagesDirPath, this.fileName),
        sourceTemplateDir: join(__dirname, PAGE_TYPE)
      };
    } else if (generatorType === PIPE_TYPE) {
      return {
        outputDir: join(this.projectStructureOptions.absolutePipeDirPath),
        sourceTemplateDir: join(__dirname, PIPE_TYPE)
      };
    } else if (generatorType === PROVIDER_TYPE) {
      return {
        outputDir: join(this.projectStructureOptions.absoluteProviderDirPath),
        sourceTemplateDir: join(__dirname, PROVIDER_TYPE)
      };
    }
  }
}

const TEMPLATE_EXTENSION = '.tmpl';

const COMPONENT_TYPE = 'component';
const DIRECTIVE_TYPE = 'directive';
const PAGE_TYPE = 'page';
const PIPE_TYPE = 'pipe';
const PROVIDER_TYPE = 'provider';