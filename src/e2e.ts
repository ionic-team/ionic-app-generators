import { generate } from './index';


function getOptions() {
  return {
    generatorType: 'page',
    suppliedName: 'my page of doom',
    includeSpec: true,
    includeSass: true
  };
}

function getProjectStructureObject() {
  return  {
    absoluteComponentDirPath: `${process.cwd()}/e2e/components`,
    absoluteDirectiveDirPath: `${process.cwd()}/e2e/components`,
    absolutePagesDirPath: `${process.cwd()}/e2e/pages`,
    absolutePipeDirPath: `${process.cwd()}/e2e/pipes`,
    absoluteProviderDirPath: `${process.cwd()}/e2e/providers`,
    absolutePathTemplateBaseDir: `${process.env.HOME}/Dev/ionic2-build/scripts/templates`
  }
}

generate(getOptions(), getProjectStructureObject());