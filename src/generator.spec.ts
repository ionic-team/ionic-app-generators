/*import * as proxyquire from 'proxyquire';
proxyquire.noCallThru();

let mockLodash;
let mockMkDirp;
let mockFs;
let mockPath;

function getTestSubject() {
  let testSubject = proxyquire('./generator', {
    'lodash': mockLodash,
    'mkdirp-no-bin': mockMkDirp,
    'fs': mockFs,
    'path': mockPath
  });
  return testSubject;
}

function getGeneratorOptions() {
  return {
    generatorType: 'generatorType',
    suppliedName: 'suppliedName',
    includeSpec: true,
    includeSass: true
  }
}

function getProjectStructureOptions() {
  return {
    absoluteComponentDirPath: 'absoluteComponentDirPath',
    absoluteDirectiveDirPath: 'absoluteDirectiveDirPath',
    absolutePagesDirPath: 'absolutePagesDirPath',
    absolutePipeDirPath: 'absolutePipeDirPath',
    absoluteProviderDirPath: 'absoluteProviderDirPath',
  }
}

describe('generator', () => {
  beforeEach(() => {
    mockLodash = {
      camelCase: () => {},
      capitalize: () => {},
      kebabCase: () => {},
      template: () => {},
    };

    mockMkDirp = () => {};

    mockFs = {
      access: () => {},
      readdirSync: () => {},
      readFileSync: () => {},
      writeFileSync: () => {},
    };

    mockPath = {
      basename: () => {},
      extname: () => {},
      join: () => {}
    };
  });
  describe('constructor', () => {
    it('should store options and create the fileName and className', () => {
      // arrange
      let testSubject = getTestSubject();
      let generatorOptions = getGeneratorOptions();
      let pso = getProjectStructureOptions();
      spyOn(mockLodash, 'kebabCase').and.returnValue('fileName');
      spyOn(mockLodash, 'camelCase').and.returnValue('className');
      spyOn(mockLodash, 'capitalize').and.returnValue('ClassName');

      // act
      let generator = new testSubject.Generator(generatorOptions, pso);

      // assert
      expect(generator.fileName).toEqual('fileName');
      expect(mockLodash.kebabCase).toHaveBeenCalledWith(generatorOptions.suppliedName);
      expect(generator.className).toEqual('ClassName');
      expect(mockLodash.capitalize).toHaveBeenCalledWith('className');
      expect(mockLodash.camelCase).toHaveBeenCalledWith('suppliedName');
      expect(generator.options).toEqual(generatorOptions);
      expect(generator.projectStructureOptions).toEqual(pso);
    });
  });
});
*/
