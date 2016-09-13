import * as proxyquire from 'proxyquire';
proxyquire.noCallThru();

let mockFs;

function getTestSubject() {
  const testSubject = proxyquire('./utils', {
    'fs-extra': mockFs
  });
  return testSubject;
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

describe('utils', () => {
  beforeEach(() => {
    mockFs = {
      access: () => { console.log("mock access")},
      mkdirp: () => {},
      readFileSync: () => {},
      readdirSync: () => {}
    };
  });
  describe('getPathsBasedOnGeneratorType', () => {
    it('should use component/fileName for components', () => {
      // arrange
      const testSubject = getTestSubject();
      let pso = getProjectStructureOptions();
      // act
      const result = testSubject.getPathsBasedOnGeneratorType('component', 'fileName', pso);

      // assert
      expect(result.outputDir).toEqual(`${pso.absoluteComponentDirPath}/fileName`);
      expect(result.sourceTemplateDir).toEqual(`${__dirname}/component`);
    });

    it('should use provided directive dir as dir', () => {
      // arrange
      const testSubject = getTestSubject();
      let pso = getProjectStructureOptions();
      // act
      const result = testSubject.getPathsBasedOnGeneratorType('directive', 'fileName', pso);

      // assert
      expect(result.outputDir).toEqual(`${pso.absoluteDirectiveDirPath}/fileName`);
      expect(result.sourceTemplateDir).toEqual(`${__dirname}/directive`);
    });

    it('should use pages/fileName for pages', () => {
      // arrange
      const testSubject = getTestSubject();
      let pso = getProjectStructureOptions();
      // act
      const result = testSubject.getPathsBasedOnGeneratorType('page', 'fileName', pso);

      // assert
      expect(result.outputDir).toEqual(`${pso.absolutePagesDirPath}/fileName`);
      expect(result.sourceTemplateDir).toEqual(`${__dirname}/page`);
    });

    it('should return pipe directory info', () => {
      // arrange
      const testSubject = getTestSubject();
      let pso = getProjectStructureOptions();
      // act
      const result = testSubject.getPathsBasedOnGeneratorType('pipe', 'fileName', pso);

      // assert
      expect(result.outputDir).toEqual(`${pso.absolutePipeDirPath}`);
      expect(result.sourceTemplateDir).toEqual(`${__dirname}/pipe`);
    });

    it('should return provider directory info', () => {
      // arrange
      const testSubject = getTestSubject();
      let pso = getProjectStructureOptions();
      // act
      const result = testSubject.getPathsBasedOnGeneratorType('provider', 'fileName', pso);

      // assert
      expect(result.outputDir).toEqual(`${pso.absoluteProviderDirPath}`);
      expect(result.sourceTemplateDir).toEqual(`${__dirname}/provider`);
    });
  });

  describe('renderTemplate', () => {
    it('should replace all instance of filename const', () => {
      const testSubject = getTestSubject();
      const result = testSubject.renderTemplate(`My sample string: $FILENAME $FILENAME`, '', 'taco', '');
      expect(result).toEqual(`My sample string: taco taco`);
    });

    it('should replace all instance of supplied name const', () => {
      const testSubject = getTestSubject();
      const result = testSubject.renderTemplate(`My sample string: $SUPPLIEDNAME $SUPPLIEDNAME`, 'taco', '', '');
      expect(result).toEqual(`My sample string: taco taco`);
    });

    it('should replace all instance of supplied name const', () => {
      const testSubject = getTestSubject();
      const result = testSubject.renderTemplate(`My sample string: $CLASSNAME $CLASSNAME`, '', '', 'taco');
      expect(result).toEqual(`My sample string: taco taco`);
    });

    it('should replace all instance of supplied name const', () => {
      const testSubject = getTestSubject();
      const result = testSubject.renderTemplate(`My sample string: $FILENAME $SUPPLIEDNAME $CLASSNAME $FILENAME $SUPPLIEDNAME $CLASSNAME`,
        'mySuppliedName', 'myFileName', 'myClassName');
      expect(result).toEqual(`My sample string: myFileName mySuppliedName myClassName myFileName mySuppliedName myClassName`);
    });
  });

  describe('capitalize', () => {
    it('should capitalize the first letter', () => {
      const testSubject = getTestSubject();
      let result = testSubject.capitalize('myTest');
      expect(result).toEqual('MyTest');
    });
  });

  describe('camelCase', () => {
    it('should not change all lowercase input', () => {
      const testSubject = getTestSubject();
      let result = testSubject.camelCase('test');
      expect(result).toEqual('test');
    });

    it('should change capital T to lowercase', () => {
      const testSubject = getTestSubject();
      let result = testSubject.camelCase('Test');
      expect(result).toEqual('test');
    });

    it('should handle hyphen', () => {
      const testSubject = getTestSubject();
      let result = testSubject.camelCase('Test-test');
      expect(result).toEqual('testTest');
    });

     it('should handle hyphen and capital', () => {
      const testSubject = getTestSubject();
      let result = testSubject.camelCase('Test-Test');
      expect(result).toEqual('testTest');
    });

    it('should handle space', () => {
      const testSubject = getTestSubject();
      let result = testSubject.camelCase('Test test');
      expect(result).toEqual('testTest');
    });

    it('should handle space and Cap', () => {
      const testSubject = getTestSubject();
      let result = testSubject.camelCase('Test Test');
      expect(result).toEqual('testTest');
    });

    it('should handle capitalized word separation', () => {
      const testSubject = getTestSubject();
      let result = testSubject.camelCase('MyTestProject');
      expect(result).toEqual('myTestProject');
    });

    it('should handle double word, space and cap', () => {
      const testSubject = getTestSubject();
      let result = testSubject.camelCase('MyTest Project');
      expect(result).toEqual('myTestProject');
    });

    it('should handle double word, space and cap', () => {
      const testSubject = getTestSubject();
      let result = testSubject.camelCase('MyTest-Project');
      expect(result).toEqual('myTestProject');
    });
  });

  describe("kebabCase", () => {
    it('should separate camelCase', () => {
      const testSubject = getTestSubject();
      let result = testSubject.kebabCase('mySampleProject');
      expect(result).toEqual('my-sample-project');
    });

    it('should handle titleCase', () => {
      const testSubject = getTestSubject();
      let result = testSubject.kebabCase('MySampleProject');
      expect(result).toEqual('my-sample-project');
    });

    it('should handle spaces', () => {
      const testSubject = getTestSubject();
      let result = testSubject.kebabCase('My Sample project');
      expect(result).toEqual('my-sample-project');
    });

    it('should handle spaces and hyphens', () => {
      const testSubject = getTestSubject();
      let result = testSubject.kebabCase('My-Sample project');
      expect(result).toEqual('my-sample-project');
    });
  });

  describe('makeDirectoryIfNeeded', () => {
    it('should return a resolved promise when path exists', (done) => {
      // arrange
      const testSubject = getTestSubject();
      spyOn(mockFs, 'access').and.callThrough;

      // act
      const promise = testSubject.makeDirectoryIfNeeded('myPath');
      const callback = mockFs.access.calls.mostRecent().args[2];
      callback();

      // assert
      promise.then(() => {
        expect(true).toEqual(true);
        done();
      });
    });

    it('should create dir when it doesnt exist', (done) => {
      // arrange
      const testSubject = getTestSubject();
      spyOn(mockFs, 'access').and.callThrough;
      spyOn(mockFs, 'mkdirp').and.callThrough;
      // act
      const promise = testSubject.makeDirectoryIfNeeded('myPath');
      const accessCallback = mockFs.access.calls.mostRecent().args[2];
      accessCallback(new Error('file not found'));
      const mkdirpCallback =  mockFs.mkdirp.calls.mostRecent().args[1];
      mkdirpCallback();

      // assert
      promise.then(() => {
        expect(true).toEqual(true);
        done();
      });
    });

    it('should reject when cant create dir', (done) => {
      // arrange
      const testSubject = getTestSubject();
      spyOn(mockFs, 'access').and.callThrough;
      spyOn(mockFs, 'mkdirp').and.callThrough;
      // act
      const promise = testSubject.makeDirectoryIfNeeded('myPath');
      const accessCallback = mockFs.access.calls.mostRecent().args[2];
      accessCallback(new Error('file not found'));
      const mkdirpCallback =  mockFs.mkdirp.calls.mostRecent().args[1];
      mkdirpCallback(new Error('failed to create dir'));

      // assert
      promise.catch(err => {
        expect(err.message).toEqual('failed to create dir');
        done();
      });
    });
  });

  describe('generateFileName', () => {
    it('should generate the file name', () => {
      const testSubject = getTestSubject();
      const result = testSubject.generateFileName('/Users/dan/Dev/something/ts.tmpl', 'taco');
      expect(result).toEqual('taco.ts');
    });
  });

  describe('getTemplatesInDir', () => {
    it('should call readdirSync on provided path', () => {
       // arrange
      const testSubject = getTestSubject();
       spyOn(mockFs, 'readdirSync').and.returnValue('returnValue');
      // act
      const result = testSubject.getTemplatesInDir('./mypath/of/doom');
      expect(result).toEqual('returnValue');
      expect(mockFs.readdirSync.calls.mostRecent().args[0]).toEqual('./mypath/of/doom');
    });
  });

});
