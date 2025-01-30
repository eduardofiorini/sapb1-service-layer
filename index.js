import axios from 'axios';
import dayjs from 'dayjs';
import https from 'https';

class ServiceLayer {
  constructor() {
    if (!ServiceLayer.instance) {
      this.session = null;
      this.sessionTimeout = 0;
      this.startSessionTime = null;
      this.endSessionTime = null;
      this.config = {};
      this.instance = this.createInstance();
      ServiceLayer.instance = this;
    }
    return ServiceLayer.instance;
  }

  createInstance() {
    const instance = axios.create({
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });

    instance.interceptors.request.use(async (config) => {
      await this.refreshSession();
      return config;
    }, error => Promise.reject(error));
    
    return instance;
  }

  async createSession(config) {
    this.config = { ...this.config, ...config };
    if (this.config.debug) console.log("Config parameters", this.config);

    this.instance.defaults.baseURL = `${this.config.host}:${this.config.port}/b1s/${this.config.version}/`;

    try {
      const result = await this.instance.post('Login', {
        CompanyDB: config.company,
        Password: config.password,
        UserName: config.username
      });

      this.session = result.data.SessionId;
      this.sessionTimeout = result.data.SessionTimeout;
      this.startSessionTime = dayjs();
      this.endSessionTime = this.startSessionTime.add(this.sessionTimeout - 1, 'minute');
      this.instance.defaults.headers.common['Cookie'] = `B1SESSION=${this.session};CompanyDB=${config.company}`;
      if (this.config.debug) console.log(`Session renewed: ${this.session}`);
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  }

  async refreshSession() {
    if (dayjs().isAfter(this.endSessionTime)) {
      if (this.config.debug) console.warn("Session expired. Refreshing...");
      await this.createSession(this.config);
    }
  }

  async request(method, resource, data = {}, options = {}) {
    await this.refreshSession();
    return this.instance[method](resource, data, options)
      .then(res => res.data)
      .catch(this.parseError);
  }

  async get(resource, options = {}) { return this.request('get', resource, {}, options); }
  async post(resource, data) { return this.request('post', resource, data); }
  async put(resource, data) { return this.request('put', resource, data); }
  async patch(resource, data) { return this.request('patch', resource, data); }
  async delete(resource) { return this.request('delete', resource); }
  async find(query, options = {}) { return this.get(query, options); }

  parseError(error) {
    console.error("Service Layer Error:", error.response ? error.response.data : error.message);
    return { error: true, message: error.response ? error.response.data : error.message };
  }
}

const instance = new ServiceLayer();
export default instance;