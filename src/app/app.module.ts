import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { RegistroComponent } from './features/registro/registro.component';
import { LoginComponent } from './features/auth/login/login/login.component';
import { HomeComponent } from './features/general/home/home.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DiagnosticoFreeComponent } from './features/general/diagnostico-free/diagnostico-free.component';
import { InicioFreeComponent } from './features/general/inicio-free/inicio-free.component';
import { MenuComponent } from './shared/menu/menu.component';
import { MiPerfilComponent } from './features/general/mi-perfil/mi-perfil.component';
import { HeaderInternoComponent } from './shared/header-interno/header-interno.component';
import { DiagnosticoGeneralComponent } from './features/general/diagnostico-general/diagnostico-general.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CurrencyPipe } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    LoginComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    DiagnosticoFreeComponent,
    InicioFreeComponent,
    MenuComponent,
    MiPerfilComponent,
    DiagnosticoGeneralComponent,
    HeaderInternoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxChartsModule,
    CurrencyPipe,
    NgxEchartsModule.forRoot({ echarts })
  ],
  providers: [NgbActiveModal, NgbModal, CurrencyPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
