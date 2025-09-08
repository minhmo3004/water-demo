import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './core/layout/main/main.component';
import { MainComponentComponent } from './modules/dashboard/components/main-component/main-component.component';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { TopbarComponent } from './core/layout/topbar/topbar.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { DetailsComponent } from './modules/meter-manager/components/details/details.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MainComponentComponent,
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
    DetailsComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
