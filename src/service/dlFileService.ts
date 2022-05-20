import {getMongoUri} from '../cli/crawdlCli';
import {DlFile} from '../model/entity/dlFile';
import {ICliArguments} from '../cli/iArgumentsParser';
import {Collection, Db, InsertOneResult, MongoClient} from 'mongodb';

export class DlFileService {
  static DLFILE_COLLECTION = 'dlfiles';
  static DLFILE_INDEX_KEY = 'downloadUrl.href';
  static DLFILE_INDEX_NAME = 'url';

  private _client: MongoClient;
  /* c8 ignore start */
  public get client(): MongoClient {
    return this._client;
  }
  public set client(value: MongoClient) {
    this._client = value;
  }
  /* c8 ignore stop */

  private _db: Db;
  /* c8 ignore start */
  public get db(): Db {
    return this._db;
  }
  public set db(value: Db) {
    this._db = value;
  }
  /* c8 ignore stop */

  private _dlFileCollection: Collection;
  /* c8 ignore start */
  public get dlFileCollection(): Collection {
    return this._dlFileCollection;
  }
  public set dlFileCollection(value: Collection) {
    this._dlFileCollection = value;
  }
  /* c8 ignore stop */

  private _args: ICliArguments;
  /* c8 ignore start */
  public get args(): ICliArguments {
    return this._args;
  }
  public set args(value: ICliArguments) {
    this._args = value;
  }
  /* c8 ignore stop */

  constructor(args: ICliArguments) {
    this.args = args;
    this.client = new MongoClient(
      getMongoUri(
        args.mongoProtocol,
        args.mongoHost,
        args.mongoUsername,
        args.mongoPassword
      )
    );
  }

  initialize(): Promise<DlFileService> {
    return this.client
      .connect()
      .then(() => {
        this.db = this.client.db(this.args.mongoDatabase);
        this.dlFileCollection = this.db.collection(
          DlFileService.DLFILE_COLLECTION
        );
      })
      .then(() => {
        return this.ensureIndexes();
      })
      .then(() => {
        return Promise.resolve(this);
      });
  }

  isStoredDlFile(url: URL): Promise<boolean> {
    return this.dlFileCollection
      .countDocuments({'downloadUrl.href': url.href})
      .then(count => {
        return Promise.resolve(count !== 0);
      });
  }

  insertOne(dlFile: DlFile): Promise<InsertOneResult<Document>> {
    return this.dlFileCollection.insertOne(dlFile);
  }

  private ensureIndexes(): Promise<string[]> {
    return this.dlFileCollection.createIndexes([
      {
        key: {[DlFileService.DLFILE_INDEX_KEY]: 1},
        name: DlFileService.DLFILE_INDEX_NAME,
        unique: true,
      },
    ]);
  }
}
