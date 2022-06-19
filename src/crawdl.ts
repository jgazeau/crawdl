#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-explicit-any*/
import {red} from 'kleur';
import {logger} from './utils/logger';
import {CrawdlCli} from './cli/crawdlCli';
import {DlFile} from './model/entity/dlFile';
import {headerFactory} from './utils/helpers';
import {CrawdlError} from './model/crawdlError';
import {OneFichier} from './model/host/oneFichier';
import {ICliArguments} from './cli/iArgumentsParser';
import {DlFileService} from './service/dlFileService';
import {IHostWebsite} from './model/host/iHostWebsite';

export class Crawdl {
  static main(): Promise<any> {
    return new CrawdlCli().parse().then((cliArgs: ICliArguments) => {
      headerFactory();
      const dlFileService = new DlFileService(cliArgs);
      return dlFileService
        .initialize()
        .then(() => {
          const host = new OneFichier();
          return processRandomUrlOnHost(
            host,
            cliArgs.processIteration,
            dlFileService
          );
        })
        .finally(() => {
          return dlFileService.client.close();
        });
    });
  }
}

function processRandomUrlOnHost(
  host: IHostWebsite,
  iteration: number,
  service: DlFileService
): Promise<any> {
  if (iteration) {
    return host
      .randomDlUrl()
      .then(url => {
        return service.isStoredDlFile(url).then(isStoredDlFile => {
          if (isStoredDlFile) {
            return Promise.reject(`DlFile with url ${url} already exists`);
          } else {
            return Promise.resolve(url);
          }
        });
      })
      .then(url => {
        return host.processDlFile(url);
      })
      .then((result: DlFile | string) => {
        if (result instanceof DlFile) {
          logger().info(
            `Storing file with url ${result.downloadUrl} with status ${result.status}`
          );
          return service.dlFileCollection.insertOne(result);
        } else {
          return Promise.reject(
            new CrawdlError(`Process returned a fatal error (${result})`)
          );
        }
      })
      .then(() => {
        return processRandomUrlOnHost(host, iteration - 1, service);
      });
  } else {
    return Promise.resolve();
  }
}

Crawdl.main().catch((error: Error) => {
  logger().error(red(`${error.message}`));
  logger().debug(error);
});
