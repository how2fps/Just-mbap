import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  currentUserID: string;
  tasks$: Observable<Task[]>;
  private tasksCollection: AngularFirestoreCollection<Task>;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.tasks$ = this.authService.currentUser$.pipe(
      tap((user) => {
        this.currentUserID = user.uid;
      }),
      switchMap((user) => {
        const userID = user.uid;
        this.tasksCollection = this.afs.collection<Task>('tasks', (ref) =>
          ref.where('userID', '==', userID)
        );
        return this.tasksCollection.valueChanges();
      })
    );
  }

  getTasksByDate(date: Date) {
    return this.authService.currentUser$.pipe(
      tap((user) => {
        this.currentUserID = user.uid;
      }),
      switchMap((user) => {
        const userID = user.uid;
        this.tasksCollection = this.afs.collection<Task>('tasks', (ref) =>
          ref.where('userID', '==', userID).where('date', '==', date)
        );
        return this.tasksCollection.valueChanges();
      })
    );
  }

  createTask(task: Task) {
    return this.tasksCollection.add({
      ...task,
      userID: this.currentUserID,
      date: new Date(task.date),
    });
  }
}
