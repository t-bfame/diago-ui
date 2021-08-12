import axios from 'axios';

class Client {
  BASE_URL = '/api';
  get = (path) => {
      const token = sessionStorage.getItem("access_token");
      if (token=== null) {
        return axios.get(`${this.BASE_URL}/${path}`);
      }
      else {
        return axios.get(`${this.BASE_URL}/${path}`, {
          headers: {
            "Authorization" : `${token}`
          }
        })
      }
    }
  post = (path, data) => {
      const token = sessionStorage.getItem("access_token");
      if (token === null) {
        return axios.post(`${this.BASE_URL}/${path}`, data);
      }
      else {
        return axios.post(`${this.BASE_URL}/${path}`, data, {
          headers: {
            "Authorization" : `${token}`
          }
        });
      }
    }
  delete = (path) => {
      const token = sessionStorage.getItem("access_token");
      if (token === null) {
        return axios.delete(`${this.BASE_URL}/${path}`);
      }
      else {
        return axios.delete(`${this.BASE_URL}/${path}`, {
          headers: {
            "Authorization" : `${token}`
          }
        })
      }
    }
}

let client;
const getClient = () => {
  if (!client) {
    client = new Client();
  }
  return client;
};

export default getClient;
