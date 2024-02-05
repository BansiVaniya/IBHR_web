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


  //request var
  loginRequest:any={};
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
    console.log(this.loginForm.value);
    // this.loginRequest = {
    //   path: "core/event/create",
    //   data: this.loginForm.value,
    //   isAuth: true,
    // };

    // this.apiService.post(loginRequest).subscribe((response) => {
    //   if (response['status'].code == "OK") {
    //     this.spinner.hide();
    //     this.clearVideoForm();
    //     this.url = "";
    //     this.toaster.success(response["status"]["description"])

    //   }
    //   else {
    //     this.spinner.hide();
    //     this.toaster.error(response["status"]["description"])
    //   }
    // })

  }
}
