import kleur = require('kleur');
import {hideBin} from 'yargs/helpers';
import {Host} from '../model/host/host';
import {getOutputWidth} from '../utils/helpers';
import {IArgumentsParser, ICliArguments} from './iArgumentsParser';
import {
  CLI_USAGE,
  DEFAULT_MONGO_PROTOCOL,
  DEFAULT_PROCESS_ITERATION,
  MONGO_DATABASE_OPTION,
  MONGO_HOST_OPTION,
  MONGO_PASSWORD_OPTION,
  MONGO_PROTOCOL_OPTION,
  MONGO_USERNAME_OPTION,
  PROCESS_ITERATION_OPTION,
} from '../utils/const';
const yargs = require('yargs');

export class CrawdlCli {
  private GROUPS = {
    MONGO: 'Mongo options:',
  };
  private static _cliArgs: ICliArguments;
  /* c8 ignore start */
  public static get cliArgs(): ICliArguments {
    return CrawdlCli._cliArgs;
  }
  public static set cliArgs(value: ICliArguments) {
    CrawdlCli._cliArgs = value;
  }
  /* c8 ignore stop */

  private parser: IArgumentsParser;
  /* c8 ignore start */
  public get _parser(): IArgumentsParser {
    return this.parser;
  }
  public set _parser(value: IArgumentsParser) {
    this.parser = value;
  }
  /* c8 ignore stop */

  constructor() {
    this._parser = yargs(hideBin(process.argv))
      .scriptName('crawdl')
      .env('CRAWDL')
      .check((argv: ICliArguments) => {
        CrawdlCli.cliArgs = argv;
        return true;
      })
      .command(
        'walk [host]',
        'Walkthrough host links',
        (yargs: IArgumentsParser) => {
          yargs.positional('host', {
            type: 'string',
            describe: 'The host to walkthrough',
            choices: Object.values(Host),
            demandOption: true,
          });
        }
      )
      .updateStrings({
        'Options:': 'Other Options:',
        'Commands:': 'Commands:',
      })
      .usage(`${CLI_USAGE}`)
      .alias('v', 'version')
      .alias('h', 'help')
      .options({
        debug: {
          type: 'boolean',
          default: false,
          description: 'Turn on debug logging',
        },
        processIteration: {
          alias: [PROCESS_ITERATION_OPTION],
          type: 'number',
          default: DEFAULT_PROCESS_ITERATION,
          description: 'Process iteration count',
          group: this.GROUPS.MONGO,
          nargs: 1,
        },
        mongoProtocol: {
          alias: [MONGO_PROTOCOL_OPTION],
          type: 'string',
          default: DEFAULT_MONGO_PROTOCOL,
          description: 'Mongo protocol',
          group: this.GROUPS.MONGO,
          demandOption: true,
          nargs: 1,
        },
        mongoHost: {
          alias: [MONGO_HOST_OPTION],
          type: 'string',
          description: 'Mongo host',
          group: this.GROUPS.MONGO,
          demandOption: true,
          nargs: 1,
        },
        mongoDatabase: {
          alias: [MONGO_DATABASE_OPTION],
          type: 'string',
          description: 'Mongo database',
          group: this.GROUPS.MONGO,
          demandOption: true,
          nargs: 1,
        },
        mongoUsername: {
          alias: [MONGO_USERNAME_OPTION],
          type: 'string',
          description: 'Mongo username',
          group: this.GROUPS.MONGO,
          nargs: 1,
        },
        mongoPassword: {
          alias: [MONGO_PASSWORD_OPTION],
          type: 'string',
          description: 'Mongo password',
          group: this.GROUPS.MONGO,
          nargs: 1,
        },
      })
      .wrap(getOutputWidth())
      .epilog(
        `Additional information:
  GitHub: ${kleur.green('https://github.com/jgazeau/crawdl.git')}
  Documentation: ${kleur.blue('https://github.com/jgazeau/crawdl#readme')}
  Issues: ${kleur.red('https://github.com/jgazeau/crawdl/issues')}
      `
      );
  }

  parse(): Promise<ICliArguments> {
    this._parser.argv;
    return Promise.resolve(CrawdlCli.cliArgs);
  }
}

export function getMongoUri(
  mongoProtocol: string,
  mongoHost: string,
  mongoUsername?: string,
  mongoPassword?: string
): string {
  const userAuth =
    mongoUsername !== undefined && mongoPassword !== undefined
      ? `${mongoUsername}:${mongoPassword}@`
      : '';
  return `${mongoProtocol}://${userAuth}${mongoHost}?retryWrites=true&writeConcern=majority`;
}
