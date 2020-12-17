import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS{
    interface Global{
      signin(): string[];
    }
  }
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  
  // build a jwt payload { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  };

  // create the jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // build session object
  const session = { jwt: token };
    
  //{"jwt":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZDhkODRjMTU2YWNhMDAyMzIzYjZlNiIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTYwODA0NjY2OX0.pHPMh3YKvcECf6g9tFt6FydkF3rEYxNsP8Jml6VP-5Y"}
  
  // turn session into json
  const sessionJSON = JSON.stringify(session);
  
  // encode json as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  
  // return a string
  return [`express:sess=${base64}`];
};