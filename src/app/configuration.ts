export class Configuration {
  BASE_URL = '';
  AUTH_KEY: string = "authDetail";

  constructor(public state: projectState) {
    if (this.state == "staging") {
      this.BASE_URL = 'https://dev-hr.retailbudget.us/hr';
    }else if (this.state == "local") {
      this.BASE_URL = 'http://localhost:8081';
    }else {
      this.BASE_URL = 'https://prod-apis.test.com/';
    }
  }

}

type projectState = 'staging' | 'production' | "local" ;
export const configuration = new Configuration('staging');
