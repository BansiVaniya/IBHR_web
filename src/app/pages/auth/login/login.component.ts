import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMAIL_PATTERN } from '../../../helpers/emailValidation';
import { ApiService } from '../../../services/api.service';
import { SpinnerService } from '../../../services/spinner.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  
})
export class LoginComponent {
  loginForm : FormGroup;
  loginSubmitted:boolean=false;
  hide = true;
  isLoginFormSubmitted:boolean=false;
  //request var
  loginRequest:any={};
  constructor(private apiService:ApiService,private spinner:SpinnerService){
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
    if(this.loginForm.valid){
      console.log("dighdjdfh");
      
this.isLoginFormSubmitted=false;
    console.log(this.loginForm.value);
    this.loginRequest = {
      path: "core/event/create",
      data: this.loginForm.value,
      isAuth: true,
    };

    this.apiService.post(this.loginRequest).subscribe((response:any) => {
      if (response['status'].code == "OK") {
        this.spinner.hide();
        // this.clearVideoForm();
        // this.toaster.success(response["status"]["description"])

      }
      else {
        this.spinner.hide();
        // this.toaster.error(response["status"]["description"])
      }
    })
    }
    else{
      this.isLoginFormSubmitted=true;
    }
  }
}
