import {expect} from 'chai';
import {DlFile} from '../../src/model/entity/dlFile';
import {setChaiAsPromised} from '../testUtils/helpers';
import {Onefichier} from '../../src/model/host/onefichier';
import {
  ONEFICHIER_ERROR_DATE,
  ONEFICHIER_ERROR_NAME,
  ONEFICHIER_ERROR_SIZE,
  ONEFICHIER_OK,
  testFatalErrorLabel,
} from '../testUtils/const';
import {
  AxiosMethodStub,
  createSandbox,
  restoreSandbox,
  setAxiosStub,
} from '../testUtils/sinonStubs';
import {DlFileStatus} from '../../src/model/dlFileStatus';

const TEST_FILE_URL = 'https://1fichier.com/?xxxxxxxxxxxxxxxxxxxx';

describe('1fichier tests', () => {
  beforeEach(() => {
    createSandbox();
  });
  afterEach(() => {
    restoreSandbox();
  });
  it('getRandomDlUrl should return a random download URL', () => {
    setChaiAsPromised();
    const onefichier = new Onefichier();
    return onefichier.randomDlUrl().then(url => {
      expect(url).to.be.instanceOf(URL);
      expect(url.toString()).to.match(
        new RegExp(
          `${Onefichier.HOST_URL}/\\?[a-z0-9]{${Onefichier.FILE_PATH_CHAR_LENGTH}}`
        )
      );
    });
  });
  it('getDlFile should return a file', () => {
    setChaiAsPromised();
    setAxiosStub('get', [new AxiosMethodStub(TEST_FILE_URL, ONEFICHIER_OK)]);
    const onefichier = new Onefichier();
    return onefichier.processDlFile(new URL(TEST_FILE_URL)).then(file => {
      expect(file).to.be.instanceOf(DlFile);
      expect((file as DlFile).status).to.be.equal(DlFileStatus.available);
    });
  });
  it('getDlFile should return a file when request return 404', () => {
    setChaiAsPromised();
    setAxiosStub('get', [new AxiosMethodStub(TEST_FILE_URL, '', 404)]);
    const onefichier = new Onefichier();
    return onefichier.processDlFile(new URL(TEST_FILE_URL)).then(file => {
      expect(file).to.be.instanceOf(DlFile);
      expect((file as DlFile).status).to.be.equal(DlFileStatus.unavailable);
    });
  });
  it('getDlFile should return a string error when request return error', () => {
    setChaiAsPromised();
    const errorHttpStatus = 403;
    setAxiosStub('get', [
      new AxiosMethodStub(TEST_FILE_URL, '', errorHttpStatus),
    ]);
    const onefichier = new Onefichier();
    return onefichier
      .processDlFile(new URL(TEST_FILE_URL))
      .then(errorString => {
        expect(errorString).to.be.equal(
          `${errorHttpStatus}:${testFatalErrorLabel}`
        );
      });
  });
  it('getDlFile should return a file when file name cannot be extracted', () => {
    setChaiAsPromised();
    setAxiosStub('get', [
      new AxiosMethodStub(TEST_FILE_URL, ONEFICHIER_ERROR_NAME),
    ]);
    const onefichier = new Onefichier();
    return onefichier.processDlFile(new URL(TEST_FILE_URL)).then(file => {
      expect(file).to.be.instanceOf(DlFile);
      expect((file as DlFile).status).to.be.equal(DlFileStatus.extractFailure);
    });
  });
  it('getDlFile should return a file when file date cannot be extracted', () => {
    setChaiAsPromised();
    setAxiosStub('get', [
      new AxiosMethodStub(TEST_FILE_URL, ONEFICHIER_ERROR_DATE),
    ]);
    const onefichier = new Onefichier();
    return onefichier.processDlFile(new URL(TEST_FILE_URL)).then(file => {
      expect(file).to.be.instanceOf(DlFile);
      expect((file as DlFile).status).to.be.equal(DlFileStatus.extractFailure);
    });
  });
  it('getDlFile should return a file when file size cannot be extracted', () => {
    setChaiAsPromised();
    setAxiosStub('get', [
      new AxiosMethodStub(TEST_FILE_URL, ONEFICHIER_ERROR_SIZE),
    ]);
    const onefichier = new Onefichier();
    return onefichier.processDlFile(new URL(TEST_FILE_URL)).then(file => {
      expect(file).to.be.instanceOf(DlFile);
      expect((file as DlFile).status).to.be.equal(DlFileStatus.extractFailure);
    });
  });
});
