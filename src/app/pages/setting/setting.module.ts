import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgZorroAntdModule } from 'ng-zorro-antd';

import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './setting.component';


@NgModule({
  declarations: [
    SettingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    SettingRoutingModule
  ]
})
export class SettingModule { }
