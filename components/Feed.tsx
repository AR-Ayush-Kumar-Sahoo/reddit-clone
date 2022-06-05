import { useQuery } from "@apollo/client";
import { Jelly } from "@uiball/loaders";
import React from "react";
import { GET_POST_LIST, GET_POST_LIST_BY_TOPIC } from "../graphql/queries";
import Post from "./Post";

type Props = {
  topic?: string;
};

function Feed({ topic }: Props) {
  const { data, error } = !topic
    ? useQuery(GET_POST_LIST)
    : useQuery(GET_POST_LIST_BY_TOPIC, {
        variables: {
          topic,
        },
      });
  console.log(error);
  console.log(data);
  const posts: Post[] = !topic ? data?.getPostList : data?.getPostListByTopic;
  return (
    <div className="mt-5 space-y-4">
      {posts &&
        posts.map((post) => <Post hoverable key={post.id} post={post} />)}
    </div>
  );
}
export default Feed;
