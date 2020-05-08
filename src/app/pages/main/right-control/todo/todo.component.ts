import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NzContextMenuService, NzDropdownMenuComponent } from "ng-zorro-antd";

import { ListService } from 'src/app/services/list/list.service';
import { TodoService } from 'src/app/services/todo/todo.service';
import { Todo, List } from 'src/domain/entities';
import { RankBy } from 'src/domain/type';
import { floorToDate, getTodayTime } from 'src/utils/time';

const rankerGenerator = (type: RankBy = 'title'): any => {
  if (type === 'completeFlag') {
    return (t1:Todo, t2: Todo) => t1.completedFlag && !t2.completedFlag;
  }
  return (t1:Todo, t2: Todo) => t1[type] > t2[type];
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.less']
})
export class TodoComponent implements OnInit, OnDestroy {
  
  private destory$ = new Subject<any>();

  todos: Todo[] = [];
  lists: List[] = [];
  currentContextTodo: Todo;
  
  constructor(
    private listService: ListService,
    private todoService: TodoService,
    private dropdownService: NzContextMenuService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.listService.lists$
      .pipe(takeUntil(this.destory$))
      .subscribe(lists => {
        this.lists = lists;
      });

      combineLatest(this.listService.currentUuid$, this.todoService.todo$, this.todoService.rank$)
      .pipe(takeUntil(this.destory$))
      .subscribe(sources => {
        this.processTodos(sources[0], sources[1], sources[2]);
      });
      this.todoService.getAll();
      this.listService.getAll();

  }

  ngOnDestroy(): void {
    this.destory$.next();
  }

  private processTodos(listUUID: string, todos: Todo[], rank: RankBy): void {
    const filteredTodos = todos
      .filter(todo => {
        return ((listUUID === 'today' && todo.planAt && floorToDate(todo.planAt) <= getTodayTime())
          || (listUUID === 'todo' && (!todo.listUUID || todo.listUUID === 'todo'))
          || (listUUID === todo.listUUID));
      })
      .map(todo => Object.assign({}, todo) as Todo)
      .sort(rankerGenerator(rank));
    this.todos = [].concat(filteredTodos);
  }

  add(title: string): void {
    this.todoService.add(title);
  }

  click(uuid: string): void {
    this.router.navigateByUrl(`/main/${uuid}`);
  }

  toggle(uuid: string): void {
    this.todoService.toggleTodoComplete(uuid);
  }

  contextMenu(
    $event: MouseEvent,
    template: NzDropdownMenuComponent,
    uuid: string
  ): void {
    this.dropdownService.create($event, template);
    this.currentContextTodo = this.todos.find(t => t._id === uuid);
  }

  listsExcept(listUUID: string): List[] {
    return this.lists.filter(l => l._id !== listUUID);
  }

  delete(): void {
    this.todoService.delete(this.currentContextTodo._id);
  }

  setToday(): void {
    this.todoService.setTodoToday(this.currentContextTodo._id);
  }

  moveToList(listUuid: string): void {
    this.todoService.moveToList(this.currentContextTodo._id, listUuid);
  }

  close(): void {
    this.dropdownService.close();
  }
}
