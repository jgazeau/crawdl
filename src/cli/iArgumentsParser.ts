import {Arguments, Argv} from 'yargs';
import {Host} from '../model/host/host';

export interface IArgumentsParser extends Argv {
  argv: ICliArguments;
}

export interface ICliArguments extends Arguments {
  host: Host;
  debug: boolean;
  processIteration: number;
  mongoProtocol: string;
  mongoHost: string;
  mongoDatabase: string;
  mongoUsername?: string;
  mongoPassword?: string;
}
