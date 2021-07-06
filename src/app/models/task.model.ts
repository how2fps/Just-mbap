export interface Task {
  date: Date;
  description: string;
  timeAllocated: string;
  title: string;
  visibleToFriends: string;
  currentTask: boolean;
  id?: string;
  userID?: string;
}
