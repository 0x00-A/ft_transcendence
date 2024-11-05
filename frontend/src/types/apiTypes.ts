export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface NewPostData {
  title: string;
  body: string;
  userId: number;
}

export interface User {
  id: number;
  username: string;
}

export interface Tournament {
  id: number;
  name: string;
  creator: User;
  created_at: string; // Use `Date` if you plan to parse it into a Date object
  participants_count: number;
  number_of_players: number;
  user_id: number;
  players: number[];
}
