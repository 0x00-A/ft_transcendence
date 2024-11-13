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

interface Match {
    match_id: number;
    player1: string | null;
    player2: string | null;
    p1_score: number;
    p2_score: number;
    status: string;
    winner: string | null;
    player1_ready: boolean;
    player2_ready: boolean;
}

interface Rounds {
    "1": Match[];
    "2": Match[];
    "3"?: Match[];
}

export interface TournamentState {
    tournament_id: number;
    name: string;
    status: string;
    created_at: string; // formatted date string
    players: string[];
    winner: string | null;
    rounds: Rounds;
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
  state: TournamentState;
}
