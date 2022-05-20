import {DlFile} from '../entity/dlFile';

export interface IHostWebsite {
  _name: string;

  randomDlUrl(): Promise<URL>;
  processDlFile(url: URL): Promise<DlFile | string>;
}
