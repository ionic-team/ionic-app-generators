import * as proxyquire from 'proxyquire';
proxyquire.noCallThru();

let mockGeneratorInstance;
let mockGeneratorImport;

function getTestSubject() {
  let testSubject = proxyquire('./index', {
    './generator': mockGeneratorImport
  });
  return testSubject;
}

function getGeneratorOptions() {
  return {
    generatorType: "generatorType",
    suppliedName: "suppliesName",
    includeSpec: true,
    includeSass: true
  }
}

function getProjectStructureOptions() {
  return {
    absoluteComponentDirPath: "absoluteComponentDirPath",
    absoluteDirectiveDirPath: "absoluteDirectiveDirPath",
    absolutePagesDirPath: "absolutePagesDirPath",
    absolutePipeDirPath: "absolutePipeDirPath",
    absoluteProviderDirPath: "absoluteProviderDirPath",
  }
}

describe('index', () => {
  beforeEach(() => {
    mockGeneratorInstance = {
      generate: () => {}
    };

    mockGeneratorImport = {
      Generator: () => {
        return mockGeneratorInstance;
      }
    }
  });

  describe('generate', () => {
    it('should throw an exception when no options are provided', () => {
      try{
        // arrange
        let testSubject = getTestSubject();
        // act
        testSubject.generate(null, null);

        // fail the test if it doesn't throw
        expect(true).toEqual(false);
      } catch(ex) {
        // assert
        expect(ex.message).toBeDefined;
      }
    });

    it('should throw when missing generatorType', () => {
      try{
        // arrange
        let testSubject = getTestSubject();
        let options = getGeneratorOptions();
        options.generatorType = null;

        // act
        testSubject.generate(options, null);
        // fail the test if it doesn't throw
        expect(true).toEqual(false);
      } catch(ex) {
        // assert
        expect(ex.message).toBeDefined;
      }
    });

    it('should throw when missing suppliedName', () => {
      try{
        // arrange
        let testSubject = getTestSubject();
        let options = getGeneratorOptions();
        options.suppliedName = null;

        // act
        testSubject.generate(options, null);
        // fail the test if it doesn't throw
        expect(true).toEqual(false);
      } catch(ex) {
        // assert
        expect(ex.message).toBeDefined;
      }
    });

    it('should throw when missing projectStructureOptions', () => {
      try{
        // arrange
        let testSubject = getTestSubject();
        let options = getGeneratorOptions();

        // act
        testSubject.generate(options, null);
        // fail the test if it doesn't throw
        expect(true).toEqual(false);
      } catch(ex) {
        // assert
        expect(ex.message).toBeDefined;
      }
    });

    it('should throw when missing absoluteComponentDirPath', () => {
      try{
        // arrange
        let testSubject = getTestSubject();
        let options = getGeneratorOptions();
        let pso = getProjectStructureOptions();
        pso.absoluteComponentDirPath = null;
        // act
        testSubject.generate(options, pso);
        // fail the test if it doesn't throw
        expect(true).toEqual(false);
      } catch(ex) {
        // assert
        expect(ex.message).toBeDefined;
      }
    });

    it('should throw when missing absoluteDirectiveDirPath', () => {
      try{
        // arrange
        let testSubject = getTestSubject();
        let options = getGeneratorOptions();
        let pso = getProjectStructureOptions();
        pso.absoluteDirectiveDirPath = null;
        // act
        testSubject.generate(options, pso);
        // fail the test if it doesn't throw
        expect(true).toEqual(false);
      } catch(ex) {
        // assert
        expect(ex.message).toBeDefined;
      }
    });

    it('should throw when missing absolutePagesDirPath', () => {
      try{
        // arrange
        let testSubject = getTestSubject();
        let options = getGeneratorOptions();
        let pso = getProjectStructureOptions();
        pso.absolutePagesDirPath = null;
        // act
        testSubject.generate(options, pso);
        // fail the test if it doesn't throw
        expect(true).toEqual(false);
      } catch(ex) {
        // assert
        expect(ex.message).toBeDefined;
      }
    });

    it('should throw when missing absolutePipeDirPath', () => {
      try{
        // arrange
        let testSubject = getTestSubject();
        let options = getGeneratorOptions();
        let pso = getProjectStructureOptions();
        pso.absolutePipeDirPath = null;
        // act
        testSubject.generate(options, pso);
        // fail the test if it doesn't throw
        expect(true).toEqual(false);
      } catch(ex) {
        // assert
        expect(ex.message).toBeDefined;
      }
    });

    it('should throw when missing absoluteProviderDirPath', () => {
      try{
        // arrange
        let testSubject = getTestSubject();
        let options = getGeneratorOptions();
        let pso = getProjectStructureOptions();
        pso.absoluteProviderDirPath = null;
        // act
        testSubject.generate(options, pso);
        // fail the test if it doesn't throw
        expect(true).toEqual(false);
      } catch(ex) {
        // assert
        expect(ex.message).toBeDefined;
      }
    });

    it('should call generate on new instance', () => {
      // arrange
      let testSubject = getTestSubject();
      let options = getGeneratorOptions();
      let pso = getProjectStructureOptions();
      spyOn(mockGeneratorImport, 'Generator').and.callThrough();
      spyOn(mockGeneratorInstance, 'generate').and.callThrough();

      // act
      testSubject.generate(options, pso);

      // assert

      expect(mockGeneratorImport.Generator).toHaveBeenCalledWith(options, pso);
      expect(mockGeneratorInstance.generate).toHaveBeenCalled();
    });
  });
});