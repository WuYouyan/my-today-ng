import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { USERNAME } from 'src/app/services/local-storage/local-storage.namespace';
import { ListComponent } from './list/list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-left-control',
  templateUrl: './left-control.component.html',
  styleUrls: ['./left-control.component.less']
})
export class LeftControlComponent implements OnInit {
  @Input() isCollapsed: boolean;
  @ViewChild(ListComponent) listComponent: ListComponent;

  username: string;
  constructor(
    private store: LocalStorageService,
    private route: Router
    ) { }

  ngOnInit(): void {
    this.username = this.store.get(USERNAME) ? this.store.get(USERNAME) : 'Default user name';
  }

  goSetting(): void {
    this.route.navigateByUrl('setting');
  }

   goSummary(): void {
    this.route.navigateByUrl('summary');
  }

  openAddListModal(): void {
    this.listComponent.openAddListModal();
  }

}
