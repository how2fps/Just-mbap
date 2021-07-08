import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CurrentTaskPage } from '../tasks/current-task/current-task.page';
import { TaskService } from '../tasks/task.service';

@Injectable({
  providedIn: 'root',
})
export class SaveTimeGuard implements CanDeactivate<unknown> {
  constructor(private taskService: TaskService) {}
  canDeactivate(
    component: CurrentTaskPage,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (component.taskDetails) {
      window.localStorage.setItem(
        'timerRunning',
        component.timerRunning.toString()
      );
      window.localStorage.setItem('taskId', component.taskDetails.id);
      window.localStorage.setItem(
        'timeAllocated',
        component.timeAllocated.toString()
      );
      window.localStorage.setItem('timeOnLeave', Date.now().toString());
      this.taskService.updateTime(component.timeAllocated, component.taskDoc);
    }
    return true;
  }
}
