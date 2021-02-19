import Document from './document';
import getClient from './client';

export default class Test extends Document {
  static docName() {
    return 'tests';
  }

  async start() {
    const response = getClient().get(`start-test/${this.ID}`);
    return response;
  }
}
