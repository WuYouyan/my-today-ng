import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgZorroAntdModule } from 'ng-zorro-antd';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { LeftControlComponent } from './left-control/left-control.component';
import { ListComponent } from './left-control/list/list.component';


@NgModule({
  declarations: [
    MainComponent,
    LeftControlComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    MainRoutingModule
  ]
})
export class MainModule { }
