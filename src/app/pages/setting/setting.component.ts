import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';

import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { AVATAR_CODE, USERNAME } from 'src/app/services/local-storage/local-storage.namespace';
import { pageSwitchTransition } from './setting.animation';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.less'],
  animations: [pageSwitchTransition]
})
export class SettingComponent implements OnInit, AfterViewInit {

  avatar: string;
  username: string;

  @HostBinding('@pageSwitchTransition') state = 'activated';
  @ViewChild('usernameInput') private usernameInput: ElementRef;

  constructor(
    private router: Router,
    private msg: NzMessageService,
    private store: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.avatar = this.store.get(AVATAR_CODE);
    this.username = this.store.get(USERNAME);
  }

  ngAfterViewInit(): void {
      this.usernameInput.nativeElement.value = this.username;
  }

  goBack(): void {
    this.router.navigateByUrl('main');
  }

  validateUsername(username: string): void {
    if (!username) {
      this.msg.error('user name cannot be empty!');
      this.usernameInput.nativeElement.value = this.username;
    } else if (username !== this.username) {
      this.username = username;
      this.store.set(USERNAME, username);
      this.msg.success('user name is modified!');
    }
  }
}
