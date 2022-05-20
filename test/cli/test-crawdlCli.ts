import {expect} from 'chai';
import {Host} from '../../src/model/host/host';
import {DUMMY_CLIARGS} from '../testUtils/const';
import {SinonStubs} from '../testUtils/sinonStubs';
import {mockArgs, setChaiAsPromised} from '../testUtils/helpers';
import {
  CrawdlCli,
  getMongoUri as getMongoConnectionString,
} from '../../src/cli/crawdlCli';
import {
  DEFAULT_MONGO_PROTOCOL,
  DEFAULT_PROCESS_ITERATION,
  MONGO_DATABASE_OPTION,
  MONGO_HOST_OPTION,
  MONGO_PASSWORD_OPTION,
  MONGO_PROTOCOL_OPTION,
  MONGO_USERNAME_OPTION,
  PROCESS_ITERATION_OPTION,
} from '../../src/utils/const';

describe('Crawdl CLI tests', () => {
  const sinonMock = new SinonStubs({});
  const processTestIteration = 50;
  const mongoTestProtocol = 'mongodb+srv';
  const mongoTestHost = 'test-host';
  const mongoTestDatabase = 'test-database';
  const mongoTestUsername = 'test-username';
  const mongoTestPassword = 'test-password';
  const nominalCommand = ['walk', Object.values(Host)[0]];
  const nominalProcessIterationArg = [
    `--${PROCESS_ITERATION_OPTION}`,
    `${processTestIteration}`,
  ];
  const nominalMongoProtocolArg = [
    `--${MONGO_PROTOCOL_OPTION}`,
    mongoTestProtocol,
  ];
  const nominalMongoHostArg = [`--${MONGO_HOST_OPTION}`, mongoTestHost];
  const nominalMongoDatabaseArg = [
    `--${MONGO_DATABASE_OPTION}`,
    mongoTestDatabase,
  ];
  const nominalMongoUsernameArg = [
    `--${MONGO_USERNAME_OPTION}`,
    mongoTestUsername,
  ];
  const nominalMongoPasswordArg = [
    `--${MONGO_PASSWORD_OPTION}`,
    mongoTestPassword,
  ];
  const nominalArgs = [
    ...nominalCommand,
    ...nominalProcessIterationArg,
    ...nominalMongoProtocolArg,
    ...nominalMongoHostArg,
    ...nominalMongoDatabaseArg,
    ...nominalMongoUsernameArg,
    ...nominalMongoPasswordArg,
  ];
  const nominalDefaultArgs = [
    ...nominalCommand,
    ...nominalMongoHostArg,
    ...nominalMongoDatabaseArg,
    ...nominalMongoUsernameArg,
    ...nominalMongoPasswordArg,
  ];
  const nominalNoAuthArgs = [
    ...nominalCommand,
    ...nominalMongoProtocolArg,
    ...nominalMongoHostArg,
    ...nominalMongoDatabaseArg,
  ];
  afterEach(() => {
    sinonMock.sinonRestoreStubs();
  });
  it('parse should display help and exit when help option', () => {
    setChaiAsPromised();
    sinonMock.consoleLog = true;
    sinonMock.processExit = true;
    sinonMock.sinonSetStubs();
    mockArgs(['--help']);
    const cli = new CrawdlCli();
    return cli.parse().then(() => {
      expect(console.log).to.be.calledOnce;
      expect(process.exit).to.be.calledOnce;
    });
  });
  it('parse should display version and exit when version option', () => {
    setChaiAsPromised();
    sinonMock.consoleLog = true;
    sinonMock.processExit = true;
    sinonMock.sinonSetStubs();
    mockArgs(['--version']);
    const cli = new CrawdlCli();
    return cli.parse().then(() => {
      expect(console.log).to.be.calledOnce;
      expect(process.exit).to.be.calledOnce;
    });
  });
  it('parse should display error and exit when mongo host option is not set', () => {
    setChaiAsPromised();
    sinonMock.consoleError = true;
    sinonMock.processExit = true;
    sinonMock.sinonSetStubs();
    mockArgs(['walk', 'test']);
    const cli = new CrawdlCli();
    return cli.parse().then(() => {
      expect(console.error).to.be.called;
      expect(process.exit).to.be.called;
    });
  });
  it('parse should set logger in debug mode when debug option', () => {
    setChaiAsPromised();
    mockArgs([...nominalArgs, '--debug']);
    const cli = new CrawdlCli();
    return cli.parse().then(argv => {
      expect(argv.debug).to.be.true;
    });
  });
  it('parse should parse arguments', () => {
    setChaiAsPromised();
    mockArgs([...nominalArgs, '--debug']);
    const cli = new CrawdlCli();
    return cli.parse().then(argv => {
      expect(argv.host).to.be.equal(Object.values(Host)[0]);
      expect(argv.processIteration).to.be.equal(processTestIteration);
      expect(argv.mongoProtocol).to.be.equal(mongoTestProtocol);
      expect(argv.mongoHost).to.be.equal(mongoTestHost);
      expect(argv.mongoDatabase).to.be.equal(mongoTestDatabase);
      expect(argv.mongoUsername).to.be.equal(mongoTestUsername);
      expect(argv.mongoPassword).to.be.equal(mongoTestPassword);
    });
  });
  it('parse should parse arguments with default values', () => {
    setChaiAsPromised();
    mockArgs([...nominalDefaultArgs, '--debug']);
    const cli = new CrawdlCli();
    return cli.parse().then(argv => {
      expect(argv.host).to.be.equal(Object.values(Host)[0]);
      expect(argv.processIteration).to.be.equal(DEFAULT_PROCESS_ITERATION);
      expect(argv.mongoProtocol).to.be.equal(DEFAULT_MONGO_PROTOCOL);
      expect(argv.mongoHost).to.be.equal(mongoTestHost);
      expect(argv.mongoDatabase).to.be.equal(mongoTestDatabase);
      expect(argv.mongoUsername).to.be.equal(mongoTestUsername);
      expect(argv.mongoPassword).to.be.equal(mongoTestPassword);
    });
  });
  it('parse should parse arguments when no auth for mongo', () => {
    setChaiAsPromised();
    mockArgs([...nominalNoAuthArgs, '--debug']);
    const cli = new CrawdlCli();
    return cli.parse().then(argv => {
      expect(argv.host).to.be.equal(Object.values(Host)[0]);
      expect(argv.mongoHost).to.be.equal(mongoTestHost);
      expect(argv.mongoDatabase).to.be.equal(mongoTestDatabase);
      expect(argv.mongoUsername).to.be.undefined;
      expect(argv.mongoPassword).to.be.undefined;
    });
  });
  it('parse should display error and exit when process iteration is not set', () => {
    setChaiAsPromised();
    sinonMock.consoleError = true;
    sinonMock.processExit = true;
    sinonMock.sinonSetStubs();
    mockArgs([
      ...nominalCommand,
      `--${PROCESS_ITERATION_OPTION}`,
      ...nominalMongoHostArg,
      ...nominalMongoDatabaseArg,
      ...nominalMongoUsernameArg,
      ...nominalMongoPasswordArg,
    ]);
    const cli = new CrawdlCli();
    return cli.parse().then(() => {
      expect(console.error).to.be.called;
      expect(process.exit).to.be.called;
    });
  });
  it('parse should display error and exit when mongo host is not set', () => {
    setChaiAsPromised();
    sinonMock.consoleError = true;
    sinonMock.processExit = true;
    sinonMock.sinonSetStubs();
    mockArgs([
      ...nominalCommand,
      `--${MONGO_HOST_OPTION}`,
      ...nominalMongoDatabaseArg,
      ...nominalMongoUsernameArg,
      ...nominalMongoPasswordArg,
    ]);
    const cli = new CrawdlCli();
    return cli.parse().then(() => {
      expect(console.error).to.be.called;
      expect(process.exit).to.be.called;
    });
  });
  it('parse should display error and exit when mongo database is not set', () => {
    setChaiAsPromised();
    sinonMock.consoleError = true;
    sinonMock.processExit = true;
    sinonMock.sinonSetStubs();
    mockArgs([
      ...nominalCommand,
      ...nominalMongoHostArg,
      `--${MONGO_DATABASE_OPTION}`,
      ...nominalMongoUsernameArg,
      ...nominalMongoPasswordArg,
    ]);
    const cli = new CrawdlCli();
    return cli.parse().then(() => {
      expect(console.error).to.be.called;
      expect(process.exit).to.be.called;
    });
  });
  it('parse should display error and exit when mongo username is not set', () => {
    setChaiAsPromised();
    sinonMock.consoleError = true;
    sinonMock.processExit = true;
    sinonMock.sinonSetStubs();
    mockArgs([
      ...nominalCommand,
      ...nominalMongoHostArg,
      ...nominalMongoDatabaseArg,
      `--${MONGO_USERNAME_OPTION}`,
      ...nominalMongoPasswordArg,
    ]);
    const cli = new CrawdlCli();
    return cli.parse().then(() => {
      expect(console.error).to.be.called;
      expect(process.exit).to.be.called;
    });
  });
  it('parse should display error and exit when mongo password is not set', () => {
    setChaiAsPromised();
    sinonMock.consoleError = true;
    sinonMock.processExit = true;
    sinonMock.sinonSetStubs();
    mockArgs([
      ...nominalCommand,
      ...nominalMongoHostArg,
      ...nominalMongoDatabaseArg,
      ...nominalMongoUsernameArg,
      `--${MONGO_PASSWORD_OPTION}`,
    ]);
    const cli = new CrawdlCli();
    return cli.parse().then(() => {
      expect(console.error).to.be.called;
      expect(process.exit).to.be.called;
    });
  });
  it('getMongoConnectionString should return a mongo connection string', () => {
    expect(
      getMongoConnectionString(
        DUMMY_CLIARGS.mongoProtocol,
        DUMMY_CLIARGS.mongoHost,
        DUMMY_CLIARGS.mongoUsername,
        DUMMY_CLIARGS.mongoPassword
      )
    ).to.match(
      new RegExp(
        `${DEFAULT_MONGO_PROTOCOL}:\\/\\/${DUMMY_CLIARGS.mongoUsername}:${DUMMY_CLIARGS.mongoPassword}@${DUMMY_CLIARGS.mongoHost}.*`
      )
    );
  });
});
