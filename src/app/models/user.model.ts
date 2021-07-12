export interface UserDetails {
  displayName: string;
  email: string;
  uid: string;
}

export interface LoginDetails {
  email: string;
  password: string;
}

export interface UserDetailsFull {
  docId?: string;
  email: string;
  displayName: string;
  currentStreak: number;
  highestStreak: number;
  status: string;
  friends: string[];
  friendId: string;
}
