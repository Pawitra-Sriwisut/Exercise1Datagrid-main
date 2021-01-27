import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DxBulletModule, DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { DisplayUserComponent } from './display-user/display-user.component';
import { ModifiedUserComponent } from './modified-user/modified-user.component';
import { AppRoutingModule } from './app-routing.module';
import { ModifiedUserAddressinfoComponent } from './modified-user/modified-user-addressinfo/modified-user-addressinfo.component';
import { ModifiedUserModalComponent } from './modified-user/modified-user-modal/modified-user-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    DisplayUserComponent,
    ModifiedUserComponent,
    ModifiedUserAddressinfoComponent,
    ModifiedUserModalComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    DxDataGridModule,
    DxTemplateModule,
    DxBulletModule,
    AppRoutingModule,
    HttpClientModule,
    ModalModule.forRoot()
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
