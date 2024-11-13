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

export interface Profile {
  user: number;
  avatar: string;
  age: number | null;
  level: number | null;
  stats: Record<string, unknown>;
  is_online: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  is_oauth_user: boolean;
  first_name: string;
  last_name: string;
  profile: Profile;
  friend_request_status?: "accepted" | "pending" | "Add Friend" | "cancel";
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
  status: string;
  winner: User;
  // state: {};
}
