import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import {
  INIT_FLAG,
  START_USING_DATE,
  USERNAME
} from 'src/app/services/local-storage/local-storage.namespace';
import { getTodayTime } from 'src/utils/time';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.less']
})
export class SetupComponent implements OnInit {
  username: string;

  constructor(
    private store: LocalStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  completeSetup(): void {
    this.store.set(INIT_FLAG, true);
    this.store.set(START_USING_DATE, getTodayTime());
    this.store.set(USERNAME, this.username);
    this.router.navigateByUrl('main');
  }

}
