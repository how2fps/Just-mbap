import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  currentUserID: string;
  private tasksCollection: AngularFirestoreCollection<Task>;

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService
  ) {}

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
        return this.tasksCollection.snapshotChanges().pipe(
          map((actions) =>
            actions.map((a) => {
              const data = a.payload.doc.data() as Task;
              const id = a.payload.doc.id;
              return { id, ...data };
            })
          )
        );
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

  getTaskDetails(id: string) {
    return this.afs
      .collection<Task>('tasks')
      .doc(id)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          const data = actions.payload.data() as Task;
          const docId = actions.payload.id;
          return { id: docId, ...data };
        })
      );
  }
}
