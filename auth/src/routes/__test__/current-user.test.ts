import request from 'supertest';
import { app } from '../../app';

it('responds with current user details', async() =>{
  const cookie = await global.signup();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with 401 if not authenticated', async() => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(401);

  console.log(response.body.currentUser);
});