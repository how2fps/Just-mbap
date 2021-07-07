export interface Task {
  date: Date;
  description: string;
  timeAllocated: number;
  title: string;
  visibleToFriends: string;
  currentTask: boolean;
  id?: string;
  userID?: string;
}
