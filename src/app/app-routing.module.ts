import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent }  from './core-module/components/home/home.component';
import { LoginComponent } from "./core-module/components/login/login.component";
import { AuthGuardService as AuthGuard } from "./shared/auth-guard.service";
import { RoleGuardService as RoleGuard } from "./shared/role-guard.service";
import { NotDevelopedComponent } from "./core-module/components/notDeveloped.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "login/:mode",
    component: LoginComponent,
    data: {
      expectedRole: ["uposlenik"],
    },
  },
  {
    path: 'home-not-developed/:form',
    component: NotDevelopedComponent   
  },   
  { path: "**", redirectTo: "/" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: "reload"
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
