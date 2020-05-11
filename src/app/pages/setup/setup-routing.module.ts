import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetupComponent } from './setup.component';
import { InitGuardService } from 'src/app/services/init-guard/init-guard.service';


const routes: Routes = [
  {path: 'setup', component: SetupComponent, canActivate: [InitGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule { }
