import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import {  map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  currentUserID: string;
  private tasksCollection: AngularFirestoreCollection<Task>;
  private task: AngularFirestoreDocument<Task>;

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
      .get()
      .pipe(
        tap(() => console.log('getTaskDetails')),
        map((actions) => {
          const data = actions.data() as Task;
          const docId = actions.id;
          return { id: docId, ...data };
        })
      );
  }

  updateTime(time: number, task: AngularFirestoreDocument<Task>) {
    task.update({ timeAllocated: time });
  }

  updateTaskToCurrent(taskToCurrentId: string) {
    const taskDoc = this.afs.collection('tasks').doc<Task>(taskToCurrentId);
    return this.authService.currentUser$.pipe(
      map((user) => user.uid),
      switchMap((userID) =>
        this.afs
          .collection('tasks', (ref) =>
            ref.where('userID', '==', userID).where('currentTask', '==', true)
          )
          .get()
      ),
      tap((currentTask) => {
        let currentTaskId;
        if (currentTask.empty) {
          return taskDoc.update({ currentTask: true });
        }
        currentTask.forEach((task) => {
          if (currentTask.docs.length > 1) {
            return this.afs
              .collection('tasks')
              .doc<Task>(task.id)
              .update({ currentTask: false });
          }
          currentTaskId = task.id;
          if (currentTaskId === taskToCurrentId) {
            return;
          } else {
            this.afs
              .collection('tasks')
              .doc<Task>(currentTaskId)
              .update({ currentTask: false })
              .then(() =>
                this.afs
                  .collection('tasks')
                  .doc<Task>(taskToCurrentId)
                  .update({ currentTask: true })
              )
              .catch((err) => console.log(err));
          }
        });
      })
    );
  }

  getCurrentTask() {
    return this.authService.currentUser$.pipe(
      map((user) => user.uid),
      switchMap((userID) =>
        this.afs
          .collection('tasks', (ref) =>
            ref.where('userID', '==', userID).where('currentTask', '==', true)
          )
          .get()
      ),
      map((result) => {
        if (!result.empty) {
          const id = result.docs[0].id;
          const data = result.docs[0].data() as Task;
          return { ...data, id };
        }
      })
    );
  }
}
