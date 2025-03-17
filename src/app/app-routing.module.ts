import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistroComponent } from './features/registro/registro.component';
import { HomeComponent } from './features/general/home/home.component';
import { LoginComponent } from './features/auth/login/login/login.component';
import { InicioFreeComponent } from './features/general/inicio-free/inicio-free.component';
import { authGuard } from './core/guards/auth.guard';
import { MiPerfilComponent } from './features/general/mi-perfil/mi-perfil.component';
import { DiagnosticoGeneralComponent } from './features/general/diagnostico-general/diagnostico-general.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'inicio-free', component: InicioFreeComponent, canActivate: [authGuard] },
  { path: 'mi-perfil', component: MiPerfilComponent, canActivate: [authGuard] },
  { path: 'diagnostico', component: DiagnosticoGeneralComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
