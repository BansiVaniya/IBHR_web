import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry, tap, throwError } from 'rxjs';
import { SpinnerService } from './spinner.service';
import { AuthenticationService } from './authentication.service';
import {configuration} from '../../configuration';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url:any;
  constructor(public http: HttpClient,private spinner: SpinnerService,private authService: AuthenticationService) { }

  get(request: any) {
    this.spinner.show();
    return this.http.get(configuration.BASE_URL+request.path, {
        headers: this.getHeader(request),
      })
      .pipe(
        tap((result:any) => {
          this.spinner.hide()
          if (result["token"]) {
            let data = this.authService.getAuthDetail();
            data = {
              ...data,
              token: result["token"],
            };
           this.authService.setAuth(data);
          }
        }),
        retry(1),
        catchError(this.handleError.bind(this))
      );
  }



  getStaticsData(request:any):Observable<any>{

    return this.http.get(configuration.BASE_URL+request.path,{headers:this.getHeader2(request)}).pipe(map((response:any)=>response))
  }
  public getHeader(request: Request) {
    const token = this.authService.getToken();
    let header: HttpHeaders = new HttpHeaders({
    });
    if (!!this.authService.getToken()) {
      header = header.append("Access-Control-Allow-Origin", "*");
      header = header.append("TOKEN", [token]);
    }
    return header;
  }

  logoutApi(request: any) {
    this.spinner.show();
    return this.http
      .get(configuration.BASE_URL + request.path, {
        headers: this.getHeader2(request),
      });
  }


  post(request: any): Observable<any[]> {
    return this.http
      .post<any[]>(configuration.BASE_URL + request["path"], request["data"], {
        headers: this.getHeader(request),
      })
      .pipe(
        map((result:any) => {
          this.spinner.hide()
          if (result["token"]) {
            let data = this.authService.getAuthDetail();
            data = {
              ...data,
              token: result["token"],
            };
            this.authService.setAuth(data);
          }
          return result;
        }),
        retry(1),
        catchError(this.handleError.bind(this))
      );
  }

  getWithCode(request:any): Observable<any[]> {
    let header = this.getHeader(request);

    header = header.append("TOKEN", [request["code"]]);

    return this.http
      .get<any[]>(configuration.BASE_URL + request["path"], {
        headers: header,
      })
      .pipe(
        map((result:any) => {
          if (result["token"]) {
            let data = this.authService.getAuthDetail();
            data = {
              ...data,
              token: result["token"],
            };
            this.authService.setAuth(data);
          }
          return result;
        }),
        retry(1),
        catchError(this.handleError.bind(this))
      );
  }
  postImage(request: any) {
    let headers = new HttpHeaders();
    const token = this.authService.getToken();
    if (request.isAuth) {
      headers = new HttpHeaders({ TOKEN: token });
    }
    return this.http
      .post(configuration.BASE_URL + request.path, request.data, {
        headers: headers,
      })
      .pipe(retry(1), catchError(this.handleError.bind(this)));
  }

  getUrl(request: any) {
    return this.http.get(request.path, {});
  }
  delete(request: any) {
    return this.http.delete(configuration.BASE_URL + request.path, {
      headers: this.getHeader(request),
    });
  }
  postWithoutToken(request:any): Observable<any[]> {
    return this.http
      .post<any[]>(configuration.BASE_URL + request["path"], request["data"], {
        headers: this.getHeaderWithoutHeader(request),
      })
      .pipe(
        map((result:any) => {
          if (result["token"]) {
            let data = this.authService.getAuthDetail();
            data = {
              ...data,
              token: result["token"],

            };
            this.authService.setAuth(data);
          }
          return result;
        }),
        catchError(this.handleError.bind(this))
      );
  }


  login(request:any): Observable<any[]> {
    return this.http.post<any[]>(
      configuration.BASE_URL + request.path,
      request.data,
      {}
    );
  }


  put(request: any) {
    return this.http.put(configuration.BASE_URL + request.path, request.data, {
      headers: this.getHeader(request),
    });
  }

  logout() {
    let request = {
      path: "auth/users/logout",
      isAuth: true
    };
    this.spinner.show()
    this.logoutApi(request).subscribe(response => { });
    setTimeout(() => {
      this.authService.logout();
    }, 1000)

  }

  public getHeader2(request: Request) {
    let header: HttpHeaders = new HttpHeaders({
    });
    header = header.append("Access-Control-Allow-Origin", "*");
    return header;
  }

  getHeaderWithoutHeader(request: Request) {
    let token = JSON.parse(localStorage.getItem("token") || '{}');
    let header: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    return header;
  }

  handleError(error:any) {
    if (error["error"] != undefined) {
      if (error['error']['status']['code'] && (error['error']['status']['code'] == "SESSION_EXPIRED" || error['error']['status']['code'] == 'UNAUTHORIZED')) {
        //localStorage.removeItem(AUTH);
        window.location.href = '/';
      }
    }
    if (error["error"] != undefined) {
      //this.spinner.hide();
      // this.toastrService.error(error['error']['status']['description']); TODO Implemnet This
    }
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // this.toastrService.error(error['error']['error']);
      // client-side error
      errorMessage = error; //`Error: ${error.error.message}`;
    } else {
      // this.toastrService.error(error['error']['error']);
      // server-side error
      errorMessage = error; //`Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
  getExcel(request: any):Observable<Blob> {
     this.url = configuration.BASE_URL + request.path;
     const token = this.authService.getToken();
      const headers = new HttpHeaders({
       'Content-Type': 'application/json',
      "TOKEN": token, responseType: 'application/octet-stream'
    });
    const body = {
      filter: {
        userRole: "SPONSOR",
        brandName:"",
        userStatuses: [ "ACTIVE" ]
      },
        page: {
         pageLimit: 1,
         pageNumber: 0
         },
         sort: {
         orderBy: "ASC",
         sortBy: "FIRST_NAME"
         },
         isAuth: true
     };
    return this.http.post(this.url, body, {
      headers: headers,
      responseType: 'blob'
    });
  }

}
