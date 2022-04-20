import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AngularFullpageModule } from '@fullpage/angular-fullpage';
import { EnvironmentEnergyComponent } from './environment-energy/environment-energy.component';

@NgModule({
  declarations: [
    AppComponent,
    EnvironmentEnergyComponent
  ],
  imports: [
    BrowserModule,
    AngularFullpageModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
