import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AngularFullpageModule } from '@fullpage/angular-fullpage';
import { EnvironmentEnergyComponent } from './environment-energy/environment-energy.component';
import { EconomyFinanceComponent } from './economy-finance/economy-finance.component';
import { EconomyFinanceWealthComponent } from './economy-finance-wealth/economy-finance-wealth.component';
import { SatisfactionComponent } from './satisfaction/satisfaction.component';
import { SelfPercievedHealthComponent } from './self-percieved-health/self-percieved-health.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@NgModule({
  declarations: [
    AppComponent,
    EnvironmentEnergyComponent,
    EconomyFinanceComponent,
    EconomyFinanceWealthComponent,
    SatisfactionComponent,
    SelfPercievedHealthComponent,
    SatisfactionComponent,
    SelfPercievedHealthComponent
  ],
  imports: [
    BrowserModule,
    AngularFullpageModule,
    NgxSliderModule,
    MatButtonToggleModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
