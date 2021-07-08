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
  email: string;
  currentStreak: string;
  displayName: string;
  highestStreak: string;
  status: string;
  friends: string[];
}
