import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMAIL_PATTERN } from '../../../helpers/emailValidation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm : FormGroup;
  loginSubmitted:boolean=false;

  constructor(){
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(EMAIL_PATTERN),
      ]),
      password:new FormControl('',[Validators.required])
    });
  }
  ngOnInit() {

  }
  login(){

  }
}
