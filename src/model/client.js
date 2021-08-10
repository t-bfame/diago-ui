import axios from 'axios';

class Client {
  BASE_URL = '/api';
  get = (path) => {
      token = sessionStorage.getItem("access_token")
      if (token=== null) {
        return axios.get(`${this.BASE_URL}/${path}`);
      }
      else {
        return axios.get(`${this.BASE_URL}/${path}`, {
          headers: {
            "Authorization" : `Bearer ${token}`
          }
        })
      }
    }
  post = (path, data) => {
      axios.post(`${this.BASE_URL}/${path}`, data);
      if (token === null) {
        return axios.post(`${this.BASE_URL}/${path}`, data);
      }
      else {
        return axios.post(`${this.BASE_URL}/${path}`, data, {
          headers: {
            "Authorization" : `Bearer ${token}`
          }
        });
      }
    }
  delete = (path) => {
      if (token === null) {
        return axios.delete(`${this.BASE_URL}/${path}`);
      }
      else {
        return axios.delete(`${this.BASE_URL}/${path}`, {
          headers: {
            "Authorization" : `Bearer ${token}`
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
