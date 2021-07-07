import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { TaskDetailsPage } from '../tasks/task-details/task-details.page';
import { TaskService } from '../tasks/task.service';

@Injectable({
  providedIn: 'root',
})
export class SaveTimeGuard implements CanDeactivate<unknown> {
  constructor(private taskService: TaskService) {}
  canDeactivate(
    component: TaskDetailsPage,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.taskService.updateTime(component.timeAllocated, component.taskDoc);
    console.log(component.timeAllocated);
    return true;
  }
}
