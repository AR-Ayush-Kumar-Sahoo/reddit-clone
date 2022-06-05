type PostComment = {
  text: string;
  id: number;
  username: string;
  post_id: string;
  created_at: string;
};

type Vote = {
  created_at: string;
  id: number;
  post_id: number;
  upvote: boolean;
  username: string;
};

type Subreddit = {
  created_at: string;
  id: number;
  topic: string;
};

type Post = {
  body: string;
  created_at: string;
  id: number;
  image: string;
  subreddit: Subreddit[];
  subreddit_id: number;
  title: string;
  username: string;
  votes: Vote[];
  comments: PostComment[];
};
