import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AngularFullpageModule } from '@fullpage/angular-fullpage';
import { EnvironmentEnergyComponent } from './environment-energy/environment-energy.component';
import { EconomyFinanceComponent } from './economy-finance/economy-finance.component';
import { EconomyFinanceWealthComponent } from './economy-finance-wealth/economy-finance-wealth.component';
import { SatisfactionComponent } from './satisfaction/satisfaction.component';

@NgModule({
  declarations: [
    AppComponent,
    EnvironmentEnergyComponent,
    EconomyFinanceComponent,
    EconomyFinanceWealthComponent,
    SatisfactionComponent
  ],
  imports: [
    BrowserModule,
    AngularFullpageModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
