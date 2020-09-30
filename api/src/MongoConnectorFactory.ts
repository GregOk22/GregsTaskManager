import { MongoClient } from 'mongodb';
import { MongoDriver } from './MongoConnector';

// Set the connection url based on the defaults provided
//const url = 'mongodb://admin:pass@localhost:27017/TaskManager';

export class MongoDriverFactory {

  static build() {
    return new Promise<MongoDriver>((resolve, reject) => {
      MongoClient.connect('mongodb://localhost:27017/TaskManager', { useNewUrlParser: true }, function (err, client) {
        if (err) reject(err);
        resolve(new MongoDriver(client));
      });
    })
  }
}
