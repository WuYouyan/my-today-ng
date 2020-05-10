import { Injectable } from '@angular/core';

import { TodoService } from 'src/app/services/todo/todo.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { LAST_SUMMARY_DATE, START_USING_DATE, SUMMARIES } from 'src/app/services/local-storage/local-storage.namespace';
import { getTodayTime, floorToDate, ONE_DAY } from 'src/utils/time';
import { Todo, Summary } from 'src/domain/entities';

@Injectable()
export class SummaryService {

  summaries: Summary[] = [];

  constructor(
    private store: LocalStorageService,
    private todoService: TodoService
  ) {
    this.summaries = this.loadSummaries();
  }

  doSummary(): void {
    const todayDate = getTodayTime();
    let lastDate = this.store.get(LAST_SUMMARY_DATE) || floorToDate(this.store.get(START_USING_DATE));

    if (lastDate === todayDate) {
      return;
    }

    const todos = this.todoService.getRaw();
    /**
     * A list if Todo object
     * each todo's planAt (property) before today
     *
     */
    const todosToAna: Todo[] = [];
    const newSummaries: Summary[] = [];
    const dates: number[] = [];

    todos.forEach((todo) => {
      if (todo.planAt) {
        const date = floorToDate(todo.planAt);
        if (date < todayDate) { todosToAna.push(todo); }
      }
    });

    while (lastDate < todayDate) {
      dates.push(lastDate);
      lastDate += ONE_DAY;
    }

    dates.forEach(date => {
      const completedItems: string[] = [];
      const uncompletedItems: string[] = [];

      todosToAna.forEach(todo => {
        const planAt = floorToDate(todo.planAt);
        if (planAt <= date) {

          if (todo.completedFlag && floorToDate(todo.completedAt) === date) {
            completedItems.push(todo.title);
          } else if (
            todo.completedFlag &&
            floorToDate(todo.completedAt) < date
          ) { /* do nothing */ } else {
            uncompletedItems.push(todo.title);
          }
        }
      });

      newSummaries.push(new Summary(date, completedItems, uncompletedItems));
    });

    /**
     * change LAST_SUMMARY_DATE of localStorage
     */
    this.store.set(LAST_SUMMARY_DATE, todayDate);
    this.summaries = this.addSummaries(newSummaries);

  }

  public summaryForDate(date: number): Summary {
    if (!this.summaries.length) { this.summaries = this.loadSummaries(); }
    return this.summaries.find(s => s.date === date);
  }

  private loadSummaries(): Summary[] {
    return this.store.getList<Summary>(SUMMARIES);
  }

  /**
   * will add new summary object list to existing summary object list in localstorage
   *
   * @param summaries a list of Summary object to be added
   *
   * @return the result of add by adding new summaries to old summaries
   */
  private addSummaries(summaries: Summary[]): Summary[] {
    const oldSummaries = this.loadSummaries();
    const newSummaries = oldSummaries.concat(summaries);
    this.store.set(SUMMARIES, newSummaries);
    return newSummaries;
  }
}
