import { Component, OnInit, Output, EventEmitter, HostBinding } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

import { first } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';

import { Todo } from 'src/domain/entities';
import { TodoService } from 'src/app/services/todo/todo.service';
import { lessThanADay, floorToDate, getTodayTime, floorToMinute, getCurrentTime } from 'src/utils/time';
import { detailTransition } from './detail.animation';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less'],
  animations: [detailTransition]
})
export class DetailComponent implements OnInit {
  @HostBinding('@detailTransition') state = 'activated';

  @Output() changedTodo = new EventEmitter();

  private trueSource: Todo;
  currentTodo: Todo;
  dueDate: Date;
  planDate: Date;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(first()).subscribe((paramsMap: ParamMap) => {
      const id = paramsMap.get('id');
      const todo = this.todoService.getByUUID(id);
      this.trueSource = todo;
      this.currentTodo = Object.assign({}, todo) as Todo;
      if (todo.dueAt) {
        this.dueDate = new Date(todo.dueAt);
      }
      if (todo.planAt) {
        this.planDate = new Date(todo.planAt);
      }
    });
  }

  goBack(): void {
    this.router.navigateByUrl('main');
  }

  handlePlanDateChange(date: Date): void {
    const t = date ? date.getTime() : undefined;
    if (!t) {
      this.currentTodo.notifyMe = false;
    }
    this.currentTodo.planAt = t;
    this.checkDate();
  }

  handleDueDateChange(date: Date): void {
    const dueAt = date ? date.getTime() : undefined;
    this.currentTodo.dueAt = dueAt;
    if (dueAt && lessThanADay(dueAt)) {
      this.message.warning('The project will expire in 24 hours', {
        nzDuration: 6000
      });
    }
    this.checkDate();
  }

  private checkDate(): void {
    const { dueAt, planAt } = this.currentTodo;
    if (dueAt && planAt && floorToDate(planAt) > dueAt) {
      this.message.warning('Are you sure you want to start this project after it expires?', {
        nzDuration: 6000
      });
    }
  }

  dueDisabledDate = (d: Date): boolean => floorToDate(d) < getTodayTime();
  planDisabledDate = (d: Date): boolean => floorToMinute(d) < getCurrentTime();

  clickSwitch(): void {
    if (this.currentTodo.completedFlag) { return; }
    if (!this.currentTodo.planAt) {
      this.message.warning('The planned date has not been set');
      return;
    }
    this.currentTodo.notifyMe = !this.currentTodo.notifyMe;
  }

  confirm(): void {
    this.todoService.update(this.currentTodo);
    this.goBack();
  }

  delete(): void {
    this.todoService.delete(this.currentTodo._id);
    this.goBack();
  }

}
