/* eslint-disable @typescript-eslint/no-explicit-any*/
import * as jsdom from 'jsdom';
import moment from 'moment';
import {Host} from './host';
import {DlFile} from '../entity/dlFile';
import {logger} from '../../utils/logger';
import {CrawdlError} from '../crawdlError';
import {IHostWebsite} from './iHostWebsite';
import {DlFileStatus} from '../dlFileStatus';
import {randomString} from '../../utils/helpers';
import axios, {AxiosError, AxiosResponse} from 'axios';

export class Onefichier implements IHostWebsite {
  static readonly HOST: Host = Host.onefichier;
  static readonly HOST_URL: string = 'https://1fichier.com';
  static readonly FILE_PATH_CHAR_LENGTH: number = 20;
  private name: string;
  /* c8 ignore start */
  public get _name(): string {
    return this.name;
  }
  public set _name(value: string) {
    this.name = value;
  }
  /* c8 ignore stop */

  randomDlUrl(): Promise<URL> {
    return Promise.resolve(
      new URL(
        `?${randomString(Onefichier.FILE_PATH_CHAR_LENGTH)}`,
        Onefichier.HOST_URL
      )
    );
  }
  processDlFile(url: URL): Promise<DlFile | string> {
    return axios
      .get(url.toString())
      .then((response: AxiosResponse) => {
        const dom = new jsdom.JSDOM(response.data);
        return new DlFile(
          Onefichier.HOST,
          url,
          DlFileStatus.available,
          new Date(),
          this.extractFileNameFromDom(dom),
          this.extractFileDateFromDom(dom),
          this.extractFileSizeFromDom(dom)
        );
      })
      .catch((result: AxiosError | CrawdlError) => {
        if (result instanceof CrawdlError) {
          logger().debug(result.message);
          return new DlFile(
            Onefichier.HOST,
            url,
            DlFileStatus.extractFailure,
            new Date()
          );
        } else {
          if (result.response?.status === 404) {
            return new DlFile(
              Onefichier.HOST,
              url,
              DlFileStatus.unavailable,
              new Date()
            );
          } else {
            return `${result.response?.status}:${result.response?.statusText}`;
          }
        }
      });
  }

  private extractFileNameFromDom(dom: jsdom.JSDOM): string {
    const fileName = dom.window.document.querySelector(
      'table.premium tbody tr:nth-of-type(1) td:nth-last-of-type(1)'
    )?.textContent;
    if (fileName) {
      return fileName;
    } else {
      throw new CrawdlError('Error extracting file name from dom');
    }
  }

  private extractFileDateFromDom(dom: jsdom.JSDOM): Date {
    const fileDate = dom.window.document.querySelector(
      'table.premium tbody tr:nth-of-type(2) td:nth-last-of-type(1)'
    )?.textContent;
    if (fileDate) {
      return moment(fileDate, 'DD/MM/YYYY').toDate();
    } else {
      throw new CrawdlError('Error extracting file date from dom');
    }
  }

  private extractFileSizeFromDom(dom: jsdom.JSDOM): string {
    const fileSize = dom.window.document.querySelector(
      'table.premium tbody tr:nth-of-type(3) td:nth-last-of-type(1)'
    )?.textContent;
    if (fileSize) {
      return fileSize;
    } else {
      throw new CrawdlError('Error extracting file size from dom');
    }
  }
}
