import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AngularFullpageModule } from '@fullpage/angular-fullpage';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularFullpageModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
