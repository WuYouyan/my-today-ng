import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';

import { NzNotificationService } from 'ng-zorro-antd';

import { pageSwitchTransition } from './summary.animation';
import { getTodayTime, ONE_DAY } from 'src/utils/time';
import { SummaryService } from './summary.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { USERNAME, START_USING_DATE } from 'src/app/services/local-storage/local-storage.namespace';
import { Summary } from 'src/domain/entities';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.less'],
  animations: [pageSwitchTransition]
})
export class SummaryComponent implements OnInit {

  username = this.store.get(USERNAME) || 'username';
  dateCount = Math.floor((getTodayTime() - this.store.get(START_USING_DATE)) / ONE_DAY + 1);

  @HostBinding('@pageSwitchTransition') private state = 'activated';

  constructor(
    private summaryService: SummaryService,
    private store: LocalStorageService,
    private router: Router,
    private noti: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.summaryService.doSummary();
  }

  requestForDate(date: Date): Summary | null {
    return this.summaryService.summaryForDate(date.getTime());
  }

  showSummaryDetail(summary: Summary): void {
    if (!summary) { return; }

    const { cCount, uCount } = summary;
    if (uCount) {
      this.noti.error('There are unfinished projects', `You completed ${cCount / (cCount + uCount)}% among all the tasks`);
    } else if (cCount) {
      this.noti.success('Completed all tasks for this day', 'good job!');
    }
  }

  goBack(): void {
    this.router.navigateByUrl('/main');
  }
}
