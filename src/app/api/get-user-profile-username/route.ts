import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
const UserNameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    // validate with zod
    const result = UserNameQuerySchema.safeParse(queryParam);
    // console.log(result)
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid Query Parameters",
          success: false,
        },
        { status: 400 }
      );
    }
    const { username } = result.data;
    // const username='anand'
    // console.log(username)
    const userDetails = await UserModel.aggregate([
      {
        $match: {
          username: username,
        },
      },
      {
        $lookup: {
          from: "subscription",
          localField: "_id",
          foreignField: "follower",
          as: "followers",
        },
      },
      {
        $lookup: {
          from: "subscription",
          localField: "_id",
          foreignField: "following",
          as: "followings",
        },
      },
      {
        $lookup: {
          from: "posts", // Assuming your posts collection is named "posts"
          localField: "_id",
          foreignField: "user", // Assuming "user_id" is the field in the posts collection representing the user
          as: "user_posts",
        },
      },
      {
        $lookup: {
          from: "videos", // Assuming your videos collection is named "videos"
          localField: "_id",
          foreignField: "user", // Assuming "user_id" is the field in the videos collection representing the user
          as: "user_videos",
        },
      },
      {
        $lookup: {
          from: "articles", // Assuming your articles collection is named "articles"
          localField: "_id",
          foreignField: "user", // Assuming "user_id" is the field in the articles collection representing the user
          as: "user_articles",
        },
      },
      {
        $addFields: {
          followerCount: {
            size: "$followers",
          },
          followingCount: {
            $size: "$followings",
          },
          isfollow: {
            $cond: {
              if: {
                $in: [session?.user._id?.toString(), "$followers.following"],
              },
              then: true,
              else: false,
            },
          },
          total_posts: { $size: "$user_posts" },
          total_videos: { $size: "$user_videos" },
          total_articles: { $size: "$user_articles" }, 
        },
      },
      {
        $project: {
          name: 1,
          usernaem: 1,
          followerCount: 1,
          followingCount: 1,
          isfollow: 1,
          image: 1,
          email: 1,
          bio:1,
          total_posts:1,
          total_videos:1,
          total_articles:1,
        },
      },
    ]);
    if (!userDetails.length) {
      return Response.json(
        {
          success: false,
          message: "User Not found",
        },
        { status: 201 }
      );
    }
    // console.log(userDetails)
    return Response.json(
      {
        success: true,
        userDetails,
        message: "Get user profile successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error during get profile details by username  ", error);
    return Response.json(
      {
        success: false,
        message: "Error during checking user name",
      },
      { status: 500 }
    );
  }
}
