import {rootPath} from './testUtils/const';
import {SinonStubs} from './testUtils/sinonStubs';

describe('Crawdl tests', () => {
  const sinonMock = new SinonStubs({});
  beforeEach(() => {
    process.chdir(rootPath);
    sinonMock.logger = true;
    sinonMock.consoleLog = true;
    sinonMock.sinonSetStubs();
  });
  afterEach(() => {
    sinonMock.sinonRestoreStubs();
  });
});
