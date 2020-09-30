import { MongoDriverFactory } from "./MongoConnectorFactory";

MongoDriverFactory.build()
  .then(async (datastore) => {})
  .catch(e => {
    throw e;
  });
