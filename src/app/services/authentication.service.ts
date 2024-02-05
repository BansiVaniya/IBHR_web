import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {configuration} from '../../configuration';
import { Observable, Subject } from 'rxjs';
import { EncryptionService } from './encryption.service';

const AUTH = configuration.AUTH_KEY;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public data: AuthData = new AuthData();
  reqData: any = [];
  institutionInfo : any =[];
  encrypt : any;
  private userLoggedIn = new Subject<boolean>();
  constructor(public router: Router,public encryptionService:EncryptionService) { }

  getToken(){
    if (localStorage.getItem(AUTH) != null){
      let decrypt = this.encryptionService.decrypt(localStorage.getItem(AUTH) || '{}');
      this.data =JSON.parse(decrypt);
    }
    return this.data.token;
  }

  getVerifyToken(){
    let verifyToken;
    if (localStorage.getItem('verifyToken') != null){
      verifyToken =localStorage.getItem('verifyToken')
    }
    return verifyToken;
  }

  getAuthDetail(){
    if (localStorage.getItem(AUTH) != null){
      let decrypt = this.encryptionService.decrypt(localStorage.getItem(AUTH) || '{}');
      this.data =JSON.parse(decrypt);
    }
    return this.data;
  }

  setAuth(data:any){
    this.data = data;
    localStorage.removeItem(AUTH);
    this.encrypt = this.encryptionService.encrypt(JSON.stringify(data))
    localStorage.setItem(AUTH, this.encrypt);
    let decrypt = this.encryptionService.decrypt(localStorage.getItem(AUTH) || '{}');
    this.data =JSON.parse(decrypt);
    this.getAuthDetail();
  }

  logout()
  {
    localStorage.removeItem(AUTH);
    localStorage.removeItem('verifyToken');
    location.reload();
  }

  sessiontimeout()
  {
    localStorage.removeItem(AUTH);
  }

  isAuthenticated() {
    if (localStorage.getItem(AUTH) != null){
      let decrypt = this.encryptionService.decrypt(localStorage.getItem(AUTH) || '{}');
      this.data =JSON.parse(decrypt);
    }
    return this.data.isLoggedIn;
  }

  getUserLoggedIn(): Observable<boolean> {
    return this.userLoggedIn.asObservable();
  }
  setNewAuthDetail(data:any)
  {
    this.data=data;
    localStorage.setItem(AUTH, JSON.stringify(this.data));
    this.getAuthDetail();
  }


}

export class AuthData{
  isLoggedIn:boolean=false;
  token: string='';
  verifyToken: string='';
  authDetail:any=''
}
