import {ObjectId} from 'mongodb';
import {Host} from '../host/host';
import {DlFileType} from '../dlFileType';
import {DlFileStatus} from '../dlFileStatus';

export class DlFile {
  constructor(
    public host: Host,
    public downloadUrl: URL,
    public status: DlFileStatus,
    public checkDate: Date,
    public name?: string,
    public date?: Date,
    public size?: string,
    public type?: DlFileType,
    public _id?: ObjectId
  ) {}
}
