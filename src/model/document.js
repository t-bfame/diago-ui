import getClient from './client';
import store from '../store';
import { RECEIVE_DOCUMENTS } from './actions';

export default class Document {
  constructor(obj) {
    Object.assign(this, obj);
  }

  static BASE_URL() {
    return '/api';
  }

  static docName() {
    throw new Error('A model class must implement `docName()`');
  }

  static async get(id) {
    const response = await getClient().get(`${this.docName()}/${id}`);
    if (response.data?.success) {
      const doc = new this(response.data?.payload);
      store.dispatch({
        type: RECEIVE_DOCUMENTS,
        data: {
          docs: [doc],
          docType: this.docName(),
        },
      })
      return Object.assign(response, { doc })
    }
    return response;
  }

  static async all() {
    const response = await getClient().get(`${this.docName()}/all`);
    if (response.data?.success) {
      const docs = response.data?.payload.map(raw => new this(raw));
      store.dispatch({
        type: RECEIVE_DOCUMENTS,
        data: {
          docs,
          docType: this.docName(),
        },
      });
      return Object.assign(response, { docs });
    }
    return response;
  }

  static async create(data) {
    const response = await getClient().post(`${this.docName()}`, data);
    return response;
  }

  static async delete() {
    const response = await getClient().delete(`${this.docName()}/${this.id}`);
    return response;
  }
}
