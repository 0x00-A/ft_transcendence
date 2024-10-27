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
