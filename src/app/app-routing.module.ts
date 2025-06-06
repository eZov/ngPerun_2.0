import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent }  from './core-module/components/home/home.component';
import { LoginComponent } from "./core-module/components/login/login.component";
import { AuthGuardService as AuthGuard } from "./shared/auth-guard.service";
import { RoleGuardService as RoleGuard } from "./shared/role-guard.service";
import { NotDevelopedComponent } from "./core-module/components/notDeveloped.component";
import { AppRole } from "./app-roles";

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
      expectedRole: [AppRole.Uposlenik],
    },
  },
  {
    path: 'home-not-developed/:form',
    component: NotDevelopedComponent   
  },  
  
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin-module/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'evid',
    loadChildren: () =>
      import('./evid-module/evid.module').then((m) => m.EvidModule),
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
