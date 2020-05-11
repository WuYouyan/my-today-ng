import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { TodoComponent } from './todo/todo.component';

@Component({
  selector: 'app-right-control',
  templateUrl: './right-control.component.html',
  styleUrls: ['./right-control.component.less']
})
export class RightControlComponent implements OnInit, AfterViewChecked {

  @ViewChild(TodoComponent) todoList: TodoComponent;

  todoListLength: boolean = false;
  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  
  ngOnInit(): void {
  }

  ngAfterViewChecked(): void {
    this.todoListLength = this.todoList.todos.length === 0 ? true : false;
    this.cdr.detectChanges();
  }

  
  add(title: string){
    this.todoList.add(title);
  }

}
