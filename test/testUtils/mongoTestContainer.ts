import {
  GenericContainer,
  StartedTestContainer,
  StoppedTestContainer,
  TestContainer,
} from 'testcontainers';

export class MongoTestContainer {
  static MONGO_PORT = 27017;

  private _host: string;
  /* c8 ignore start */
  public get host(): string {
    return this._host;
  }
  public set host(value: string) {
    this._host = value;
  }
  /* c8 ignore stop */

  private _mappedPort: number;
  /* c8 ignore start */
  public get mappedPort(): number {
    return this._mappedPort;
  }
  public set mappedPort(value: number) {
    this._mappedPort = value;
  }
  /* c8 ignore stop */

  private container: TestContainer = new GenericContainer('mongo')
    .withName('testcontainers_mongo')
    .withExposedPorts(MongoTestContainer.MONGO_PORT);
  private startedContainer: StartedTestContainer;
  constructor() {}

  start(): Promise<StartedTestContainer> {
    return this.container.start().then(startedContainer => {
      this.startedContainer = startedContainer;
      this.host = startedContainer.getHost();
      this.mappedPort = startedContainer.getMappedPort(
        MongoTestContainer.MONGO_PORT
      );
      return startedContainer;
    });
  }

  stop(): Promise<StoppedTestContainer> {
    return this.startedContainer.stop();
  }
}
