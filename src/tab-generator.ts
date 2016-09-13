import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import * as inquirer from 'inquirer';

import { Generator } from './generator';
import { GeneratorOptions } from './generator-options';
import { filterAndCleanUpTemplates, getPathsBasedOnGeneratorType, getTemplatesInDir, kebabCase, makeDirectoryIfNeeded, mergeObjects, stringToClassCase } from './utils';

export class TabGenerator extends Generator {

  tabNames: string[];

  generate():Promise<any>{
    this.tabNames = [];
    return this.tabCountPrompt()
    .then( (numTabs: number) => {
      return this.promptForTabNames(0, numTabs);
    })
    .then(() => {
      return this.createPages(this.tabNames);
    })
    .then(() => {
      this.tabContent = this.createTabContent(this.tabNames);
      this.tabImports = this.createTabImports(this.tabNames);
      this.tabVariables = this.createTabVariables(this.tabNames);
      return super.generate();
    }).catch((err) => {
      console.log("ERROR: An unexpected error occurred");
      console.log(err.msg);
      process.exit(1);
    });
  }

  tabCountPrompt() {
    return inquirer.prompt({
      choices: ['1', '2', '3', '4', '5'],
      message: 'How many tabs would you like?',
      name: 'count',
      type: 'list'
    }).then(result => {
      return parseInt(result.count)
    });
  }

  validate(input: string): any{
    if (isNaN(parseInt(input))) {
      // Pass the return value in the done callback
      return 'You need to provide a number';
    }
    return true;
  }

  tabNamePromptInternal(index: number) {
    const numberNames = ['first', 'second', 'third', 'fourth', 'fifth'];
    return inquirer.prompt({
      message: 'Enter the ' + numberNames[index] + ' tab name:',
      name: 'name',
      type: 'input'
    }).then(result => {
      return result.name;
    });

  }

  promptForTabNames(numTabsCompleted: number, numTabsNeeded: number) {

    if ( numTabsNeeded === numTabsCompleted ) {
      // we're done
      return Promise.resolve();
    } else {
      // we need to prompt for a tab
      return this.tabNamePromptInternal(numTabsCompleted).then( (tabName: string) => {
        this.tabNames.push(tabName);
        numTabsCompleted++;
        return this.promptForTabNames(numTabsCompleted, numTabsNeeded);
      });
    }
  }

  createPages(pageNames) {

    let promises = [];
    for ( let pageName of pageNames ) {
      const compontentOptions = (mergeObjects(this.options, {generatorType: 'page', suppliedName: pageName}) as GeneratorOptions);
      const pageGenerator = new Generator(compontentOptions, this.projectStructureOptions);
      promises.push(pageGenerator.generate());
    }
    return Promise.all(promises);
  }

  createTabContent(tabs: string[]) {
    let templateString = '';
    for (let i = 0; i < tabs.length; i++) {
      templateString = `${templateString}  <ion-tab [root]="tab${i + 1}Root" tabTitle="${tabs[i]}" tabIcon="${this.getTabIconForIndex(i)}"></ion-tab>`
      if (i !== tabs.length - 1) {
        // add a newline character
        templateString = `${templateString}\n`
      }
    }
    return templateString;
  }

  getTabIconForIndex(index: number) {
    if (index === 0) {
      return 'home';
    } else if (index === 1) {
      return 'text';
    } else if (index === 2) {
      return 'stats';
    } else if (index === 3) {
      return 'image';
    } else if (index === 4) {
      return 'star';
    }
  }

  createTabImports(tabs: string[]) {
    let importString = '';
    for (let i = 0; i < tabs.length; i++) {
      importString = `${importString}import { ${stringToClassCase(tabs[i])} } from '../${kebabCase(tabs[i])}/${kebabCase(tabs[i])}'`
      if (i !== tabs.length - 1) {
        // add a newline character
        importString = `${importString}\n`;
      }
    }
    return importString;
  }

  createTabVariables(tabs: string[]) {
    let tabVariableString = '';
    for (let i = 0; i < tabs.length; i++) {
      tabVariableString = `${tabVariableString}  tab${i + 1}Root: any = ${stringToClassCase(tabs[i])};`
      if (i !== tabs.length - 1) {
        // add a newline character
        tabVariableString = `${tabVariableString}\n`;
      }
    }
    return tabVariableString;
  }
}