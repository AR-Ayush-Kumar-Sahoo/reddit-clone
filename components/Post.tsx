import React, { useEffect, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookmarkIcon,
  ChatAltIcon,
  DotsHorizontalIcon,
  GiftIcon,
  ShareIcon,
} from "@heroicons/react/outline";
import Avatar from "./Avatar";
import moment from "moment";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { ADD_VOTE } from "../graphql/mutations";
import { GET_ALL_VOTES_BY_POST_ID } from "../graphql/queries";

type Props = {
  post: Post;
  hoverable?: boolean;
};

function Post({ post, hoverable }: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  const [vote, setVote] = useState<boolean>();
  const { data, loading } = useQuery(GET_ALL_VOTES_BY_POST_ID, {
    variables: {
      post_id: post.id,
    },
  });

  const [addVote] = useMutation(ADD_VOTE, {
    refetchQueries: [GET_ALL_VOTES_BY_POST_ID, "getVotesByPostId"],
  });

  const upVote = async (isUpvote: boolean) => {
    if (!session) {
      toast.error("You need to login to vote!");
      return;
    }

    if (vote && isUpvote) return;

    if (vote == false && !isUpvote) return;

    console.log("voting....");
    const notification = toast.loading("Voting...");

    await addVote({
      variables: {
        post_id: post.id,
        username: session?.user?.name,
        upvote: isUpvote,
      },
    });

    toast.success("Voted!", { id: notification });
  };

  useEffect(() => {
    const votes: Vote[] = data?.getVotesByPostId;

    const vote = votes?.find(
      (vote) => vote.username == session?.user?.name
    )?.upvote;

    setVote(vote);
  }, [data]);

  const displayVotes = (data: any) => {
    const votes: Vote[] = data?.getVotesByPostId;
    const displayNumber = votes?.reduce(
      (total, vote) => (vote.upvote ? (total += 1) : (total -= 1)),
      0
    );

    if (votes?.length === 0) return 0;
    if (displayNumber === 0) {
      return votes[0]?.upvote ? 1 : -1;
    }

    return displayNumber;
  };

  return (
    <div
      className={`flex cursor-pointer rounded-md border transition  border-gray-300 bg-white shadow-sm ${
        hoverable && "hover:border-gray-600"
      }`}
    >
      {/* votes */}
      <div className="flex flex-col items-center justify-start space-y-1 rounded-l-md bg-gray-50 text-gray-400">
        <ArrowUpIcon
          onClick={() => upVote(true)}
          className={`voteButtons hover:text-blue-400 ${
            vote && "text-red-400"
          }`}
        />
        <p className="text-gray-400">{displayVotes(data)}</p>
        <ArrowDownIcon
          onClick={() => upVote(false)}
          className={`voteButtons hover:text-red-400 ${
            vote == false && "text-blue-400"
          }`}
        />
      </div>

      <div className="p-3 pb-1" onClick={() => router.push("/post/" + post.id)}>
        {/* header */}
        <div className="flex items-center space-x-2">
          <Avatar seed={post.subreddit[0].topic} />
          <p className="text-xs text-gray-400">
            <Link href={"r/" + post.subreddit[0].topic}>
              <span className="font-bold text-black hover:text-blue-400 hover:underline">
                r/{post.subreddit[0].topic}
              </span>
            </Link>
            • Posted by u/
            {post.username} {moment(post.created_at).fromNow()}
          </p>
        </div>

        {/* body */}
        <div className="py-4">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="m-2 text-sm font-normal">{post.body}</p>
        </div>

        {/* image*/}
        <img src={post.image} className="w-full" />

        {/* footer */}
        <div className="flex space-x-4 text-gray-400">
          <div className="postButtons">
            <ChatAltIcon className="h-6 w-6" />
            <p>{post.comments.length} Comments</p>
          </div>

          <div className="postButtons">
            <GiftIcon className="h-6 w-6" />
            <p className="hidden sm:inline-flex">Award</p>
          </div>

          <div className="postButtons">
            <ShareIcon className="h-6 w-6" />
            <p className="hidden sm:inline-flex">Share</p>
          </div>

          <div className="postButtons">
            <BookmarkIcon className="h-6 w-6" />
            <p className="hidden sm:inline-flex">Save</p>
          </div>

          <div className="postButtons">
            <DotsHorizontalIcon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
