import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  // {path: '', component: LoginComponent},
  {
    path: '',
    loadChildren: () =>import("./pages/auth/login/login.module").then((m) => m.LoginModule),
  },
  {
    path:'forgot-password',
    loadChildren: () =>import("./pages/auth/forgot-password/forgot-password.module").then((m) => m.ForgotPasswordModule),
  },
  // {path: 'app-forgot-password', component: ForgotPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
