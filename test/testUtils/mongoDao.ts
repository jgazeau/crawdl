/* eslint-disable @typescript-eslint/no-explicit-any*/
import {MongoClient} from 'mongodb';
import {getMongoUri} from '../../src/cli/crawdlCli';
import {StartedTestContainer} from 'testcontainers';
import {MongoTestContainer} from './mongoTestContainer';
import {DEFAULT_MONGO_PROTOCOL} from '../../src/utils/const';

export class MongoDao {
  private _client: MongoClient;
  /* c8 ignore start */
  public get client(): MongoClient {
    return this._client;
  }
  public set client(value: MongoClient) {
    this._client = value;
  }
  /* c8 ignore stop */

  constructor(startedContainer: StartedTestContainer) {
    this.client = new MongoClient(
      getMongoUri(
        DEFAULT_MONGO_PROTOCOL,
        `${startedContainer.getHost()}:${startedContainer.getMappedPort(
          MongoTestContainer.MONGO_PORT
        )}`
      )
    );
  }

  init(
    databaseName: string,
    collectionName: string,
    entity: any[]
  ): Promise<any> {
    return this.client.connect().then(() => {
      return this.client
        .db(databaseName)
        .collection(collectionName)
        .insertMany(entity);
    });
  }

  stop(): Promise<void> {
    return this.client.close();
  }
}
