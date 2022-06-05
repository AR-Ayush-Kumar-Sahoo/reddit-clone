import { useMutation, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import Post from "../../components/Post";
import { GET_POST_BY_POST_ID } from "../../graphql/queries";
import { SubmitHandler, useForm } from "react-hook-form";
import { ADD_COMMENT } from "../../graphql/mutations";
import toast from "react-hot-toast";
import Avatar from "../../components/Avatar";
import moment from "moment";
import { DotWave } from "@uiball/loaders";

type FormData = {
  comment: string;
};

function PostPage() {
  const router = useRouter();

  const { data } = useQuery(GET_POST_BY_POST_ID, {
    variables: { post_id: router.query.postId },
  });
  const { data: session } = useSession();
  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [GET_POST_BY_POST_ID, "getPostListByPostId"],
  });

  const post: Post = data?.getPostListByPostId;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // post a comment
    const notification = toast.loading("Posting your comment...");

    await addComment({
      variables: {
        post_id: router.query.postId,
        text: data.comment,
        username: session?.user?.name,
      },
    });

    setValue("comment", "");

    toast.success("Comment posted!", { id: notification });
  };

  return (
    <>
      {post ? (
        <div className="mx-auto my-7 max-w-5xl">
          <Post post={post} />
          <div className="rounded-b-md border border-t-0 border-gray-300 bg-white p-5 pl-16 -mt-1">
            <p className="text-sm">
              Comment as{" "}
              <span className="text-red-500">{session?.user?.name}</span>
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col space-y-3 my-3 mx-auto"
            >
              <textarea
                {...register("comment", { required: true })}
                className="h-24 rounded-md border border-gray-300 p-2 pl-4 outline-none disabled:bg-gray-50"
                disabled={!session}
                placeholder={
                  session ? "What are your thoughts?" : "Sign in to comment."
                }
                style={{ resize: "none" }}
              ></textarea>

              <button
                type="submit"
                disabled={!session}
                className="rounded-full bg-red-500 p-3 font-semibold text-white disabled:bg-gray-400"
              >
                Comment
              </button>
            </form>
          </div>

          <div className="-my-5 rounded-b-md border border-t-0 border-gray-300 bg-white py-5 pb-10 px-10">
            <hr className="py-2" />

            {post?.comments.map((comment) => {
              return (
                <div
                  className="flex relative items-center space-x-2 space-y-5"
                  key={comment.id}
                >
                  <hr className="absolute top-10 h-16 border border-gray-300 left-7 z-0" />
                  <div className="z-30">
                    <Avatar seed={comment.username} />
                  </div>

                  <div className="flex flex-col">
                    <p className="py-2 text-xs text-gray-400">
                      <span className="font-semibold text-gray-600">
                        {comment.username}
                      </span>
                      {" • "}
                      {moment(comment.created_at).fromNow()}
                    </p>

                    <p>{comment.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex w-full items-center justify-center p-10 text-xl">
          <DotWave size={50} color="#FF4501" />
        </div>
      )}
    </>
  );
}

export default PostPage;
