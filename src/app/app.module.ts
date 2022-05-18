import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AngularFullpageModule } from '@fullpage/angular-fullpage';
import { EnvironmentEnergyComponent } from './environment-energy/environment-energy.component';
import { EconomyFinanceComponent } from './economy-finance/economy-finance.component';
import { EconomyFinanceWealthComponent } from './economy-finance-wealth/economy-finance-wealth.component';
<<<<<<< HEAD
import { SatisfactionComponent } from './satisfaction/satisfaction.component';
=======
import { SelfPercievedHealthComponent } from './self-percieved-health/self-percieved-health.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
>>>>>>> 09cfb0f3c628354fd009dca527bb5ac45feb4f04

@NgModule({
  declarations: [
    AppComponent,
    EnvironmentEnergyComponent,
    EconomyFinanceComponent,
    EconomyFinanceWealthComponent,
<<<<<<< HEAD
    SatisfactionComponent
=======
    SelfPercievedHealthComponent
>>>>>>> 09cfb0f3c628354fd009dca527bb5ac45feb4f04
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
