const request = require('supertest');
const app = require('../../app');
const truncate = require('../truncate');
const { ToDo } = require('../../models');

const rootPath = '/todos';

describe('/todos', () => {

  beforeEach(() => {
    return truncate();
  });

  afterAll(() => {
    return ToDo.sequelize.close();
  });

  describe('GET /', () => {
    it('should return an empty array', () => {
      return request(app)
        .get(rootPath)
        .expect((response) => {
          return expect(response.body.todos).toEqual([]);
        });
    });

    it('should return 1 item in the array', () => {
      return ToDo.create({
        subject: 'test',
      }).then(() => {
        return request(app).get(rootPath).expect((response) => {
          return expect(response.body.todos.length).toEqual(1);
        });
      });
    });
  });

  describe('POST /', () => {
    it('should create one todo item', () => {
      return request(app)
        .post(rootPath)
        .send({
          subject: 'test',
        })
        .expect(200)
        .then((response) => {
          return expect(response.body.subject).toEqual('test');
        });
    });

    it('should return a 404 error', () => {
      return request(app).post(rootPath + '/test').expect(404);
    });
  });

  describe('DELETE /', () => {
    it('should delete a todo', () => {
      return ToDo.create({
        subject: 'test',
      }).then((res) => {
        return request(app).delete(rootPath + '/' + res.id).expect((response) => {
          return expect(response.body.delete).toEqual(true);
        });
      });
    });
  });
});
