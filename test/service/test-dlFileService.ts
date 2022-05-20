import {expect} from 'chai';
import {MongoDao} from '../testUtils/mongoDao';
import {DlFile} from '../../src/model/entity/dlFile';
import {setChaiAsPromised} from '../testUtils/helpers';
import {ICliArguments} from '../../src/cli/iArgumentsParser';
import {DlFileService} from '../../src/service/dlFileService';
import {MongoTestContainer} from '../testUtils/mongoTestContainer';
import {containerCliArgs, DUMMY_DL_FILE} from '../testUtils/const';
import {Collection, Db, MongoClient, MongoServerError, ObjectId} from 'mongodb';

let mongoContainer: MongoTestContainer;
let mongoDao: MongoDao;
let mongoCliArgs: ICliArguments;

before(() => {
  mongoContainer = new MongoTestContainer();
  return mongoContainer
    .start()
    .then(startedContainer => {
      mongoCliArgs = containerCliArgs(mongoContainer.mappedPort);
      mongoDao = new MongoDao(startedContainer);
    })
    .then(() => {
      mongoDao.init(
        mongoCliArgs.mongoDatabase,
        DlFileService.DLFILE_COLLECTION,
        [DUMMY_DL_FILE]
      );
    });
});
after(() => {
  return mongoContainer.stop().finally(() => {
    mongoDao.stop();
  });
});

describe('DlFileService tests', () => {
  it('initialize should initialize the db connection', () => {
    setChaiAsPromised();
    const dlFileService = new DlFileService(mongoCliArgs);
    return dlFileService
      .initialize()
      .then(service => {
        expect(service).to.be.instanceOf(DlFileService);
        expect(service.client).to.be.instanceOf(MongoClient);
        expect(service.db).to.be.instanceOf(Db);
        expect(service.db.databaseName).to.be.equal(mongoCliArgs.mongoDatabase);
        expect(service.dlFileCollection).to.be.instanceOf(Collection);
        expect(service.dlFileCollection.dbName).to.be.equal(
          mongoCliArgs.mongoDatabase
        );
        expect(service.dlFileCollection.collectionName).to.be.equal(
          DlFileService.DLFILE_COLLECTION
        );
      })
      .finally(() => {
        return dlFileService.client.close();
      });
  });
  it('initialize should ensure indexes creation', () => {
    setChaiAsPromised();
    const dlFileService = new DlFileService(mongoCliArgs);
    return dlFileService
      .initialize()
      .then(service => {
        return service.dlFileCollection
          .indexExists(DlFileService.DLFILE_INDEX_NAME)
          .then(isIndexExists => {
            expect(isIndexExists).to.be.true;
          });
      })
      .finally(() => {
        return dlFileService.client.close();
      });
  });
  it('isStoredDlFile should return true when file already exist', () => {
    setChaiAsPromised();
    const dlFileService = new DlFileService(mongoCliArgs);
    return dlFileService
      .initialize()
      .then(service => {
        return service
          .isStoredDlFile(DUMMY_DL_FILE.downloadUrl)
          .then(isDlFileExists => {
            expect(isDlFileExists).to.be.true;
          });
      })
      .finally(() => {
        return dlFileService.client.close();
      });
  });
  it('isStoredDlFile should return false when file does not exist', () => {
    setChaiAsPromised();
    const dlFileService = new DlFileService(mongoCliArgs);
    return dlFileService
      .initialize()
      .then(service => {
        return service
          .isStoredDlFile(new URL('http://test.com/unexisting'))
          .then(isDlFileExists => {
            expect(isDlFileExists).to.be.false;
          });
      })
      .finally(() => {
        return dlFileService.client.close();
      });
  });
  it('insertOne should return true acknowledged when file does not exist', () => {
    setChaiAsPromised();
    const dlFileService = new DlFileService(mongoCliArgs);
    const newFile = new DlFile(
      DUMMY_DL_FILE.host,
      new URL(`${DUMMY_DL_FILE.downloadUrl}/newfile`),
      DUMMY_DL_FILE.status,
      DUMMY_DL_FILE.checkDate,
      DUMMY_DL_FILE.name,
      DUMMY_DL_FILE.date,
      DUMMY_DL_FILE.size
    );
    return dlFileService
      .initialize()
      .then(service => {
        return service.insertOne(newFile).then(insertResult => {
          expect(insertResult.acknowledged).to.be.true;
          expect(insertResult.insertedId).to.be.instanceOf(ObjectId);
        });
      })
      .finally(() => {
        return dlFileService.client.close();
      });
  });
  it('insertOne should return MongoServerError when file already exist', () => {
    setChaiAsPromised();
    const dlFileService = new DlFileService(mongoCliArgs);
    return dlFileService
      .initialize()
      .then(service => {
        return expect(
          service.insertOne(DUMMY_DL_FILE)
        ).to.eventually.be.rejectedWith(MongoServerError, 'E11000');
      })
      .finally(() => {
        return dlFileService.client.close();
      });
  });
});
