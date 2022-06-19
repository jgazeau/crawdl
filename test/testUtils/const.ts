/* c8 ignore start */
import * as path from 'path';
import * as fs from 'fs-extra';
import {TLogLevelName} from 'tslog';
import {Host} from '../../src/model/host/host';
import {DlFile} from '../../src/model/entity/dlFile';
import {DlFileStatus} from '../../src/model/dlFileStatus';
import {OneFichier} from '../../src/model/host/oneFichier';
import {ICliArguments} from '../../src/cli/iArgumentsParser';
import {
  DEFAULT_MONGO_PROTOCOL,
  DEFAULT_PROCESS_ITERATION,
} from '../../src/utils/const';

export const logTestLevel: TLogLevelName = 'debug';
export const rootPath: string = path.join(process.cwd());
export const testResourcesPath: string = path.join(rootPath, 'test/resources');
export const testFatalErrorLabel = 'Fatal error';
export const ONEFICHIER_OK = fs.readFileSync(
  path.join(testResourcesPath, '1fichier', 'file_ok.html'),
  'utf8'
);
export const ONEFICHIER_ERROR_NAME = fs.readFileSync(
  path.join(testResourcesPath, '1fichier', 'file_error_name.html'),
  'utf8'
);
export const ONEFICHIER_ERROR_DATE = fs.readFileSync(
  path.join(testResourcesPath, '1fichier', 'file_error_date.html'),
  'utf8'
);
export const ONEFICHIER_ERROR_SIZE = fs.readFileSync(
  path.join(testResourcesPath, '1fichier', 'file_error_size.html'),
  'utf8'
);
export const DUMMY_CLIARGS: ICliArguments = {
  _: [],
  $0: '',
  host: Host.onefichier,
  debug: false,
  processIteration: DEFAULT_PROCESS_ITERATION,
  mongoProtocol: DEFAULT_MONGO_PROTOCOL,
  mongoHost: 'localhost:27017',
  mongoDatabase: 'crawdl',
  mongoUsername: 'admin',
  mongoPassword: 'admin123',
};

export const DUMMY_CLIARGS_NO_AUTH: ICliArguments = {
  _: [],
  $0: '',
  host: Host.onefichier,
  debug: false,
  processIteration: DEFAULT_PROCESS_ITERATION,
  mongoProtocol: DEFAULT_MONGO_PROTOCOL,
  mongoHost: 'localhost:27017',
  mongoDatabase: 'crawdl',
};
export function containerCliArgs(mappedPort: number): ICliArguments {
  return {
    _: [],
    $0: '',
    host: Host.onefichier,
    debug: false,
    processIteration: DEFAULT_PROCESS_ITERATION,
    mongoProtocol: DEFAULT_MONGO_PROTOCOL,
    mongoHost: `localhost:${mappedPort}`,
    mongoDatabase: 'crawdl',
  };
}
export const DUMMY_DL_FILE: DlFile = new DlFile(
  OneFichier.HOST,
  new URL('http://test.com/xxxxx'),
  DlFileStatus.available,
  new Date(),
  'fileName',
  new Date(),
  '1 Mo'
);
