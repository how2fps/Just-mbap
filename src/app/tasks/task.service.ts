import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Task } from '../models/task.model';
import { UserService } from '../users/user.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  currentDate$ = new BehaviorSubject<Date>(new Date());
  forceUpdate$ = new BehaviorSubject('');
  taskDetails$ = new BehaviorSubject<Task | null>(null);
  private tasksCollection: AngularFirestoreCollection<Task>;

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private userService: UserService
  ) {}

  getTasksByDate(date: Date) {
    return this.authService.currentUser$.pipe(
      filter((user) => user !== null),
      map((user) => user.uid),
      switchMap((userID) => {
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
    return this.authService.currentUser$
      .pipe(
        map((user) => user.uid),
        switchMap((userID) =>
          this.afs.collection<Task>('tasks').add({
            ...task,
            userID,
            date: new Date(task.date),
          })
        )
      )
      .subscribe();
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

  getTaskDetails(id: string) {
    return this.afs
      .collection<Task>('tasks')
      .doc(id)
      .get()
      .pipe(
        map((actions) => {
          const data = actions.data() as Task;
          const docId = actions.id;
          return { id: docId, ...data };
        })
      );
  }

  getCurrentTask() {
    return this.authService.currentUser$.pipe(
      filter((user) => user !== null),
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

  completeTask(taskId: string, dateOfTask: Date) {
    const updatedDateOfTask = (dateOfTask as any).toDate().getTime() / 1000;
    const currentDate = new Date();
    currentDate.setSeconds(0);
    currentDate.setMinutes(0);
    currentDate.setHours(12);
    const currentDateInSeconds = Math.floor(currentDate.getTime() / 1000);
    return this.userService.getUserDetailsOnce$().pipe(
      map((result) => {
        const streakData = {
          currentStreak: result.currentStreak,
          highestStreak: result.highestStreak,
          userDocId: result.id,
        };
        return streakData;
      }),
      tap(({ currentStreak, highestStreak, userDocId }) => {
        const latestStreak = currentStreak + 1;
        if (updatedDateOfTask >= currentDateInSeconds) {
          this.afs
            .collection('users')
            .doc(userDocId)
            .update({ currentStreak: latestStreak })
            .then(() => {
              if (latestStreak > highestStreak) {
                return this.afs
                  .collection('users')
                  .doc(userDocId)
                  .update({ highestStreak: latestStreak });
              }
            })
            .then(() => this.afs.collection('tasks').doc(taskId).delete())
            .catch((err) => console.log(err));
        } else {
          this.afs
            .collection('users')
            .doc(userDocId)
            .update({ currentStreak: 0 })
            .then(() => this.afs.collection('tasks').doc(taskId).delete())
            .catch((err) => console.log(err));
        }
      })
    );
  }
}
