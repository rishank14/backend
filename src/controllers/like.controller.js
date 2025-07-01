import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on video
    const {videoId} = req.params
    const userId = req.user._id

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }

    // Check if the like already exists
    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: userId
    })

    if (existingLike) {
        // If the like exists, remove it
        await Like.deleteOne({ _id: existingLike._id })

        return res
        .status(200)
        .json(new ApiResponse(200, null, "Video unliked"))
    }

    // If the like doesn't exist, create it
    await Like.create({ video: videoId, user: userId })
    return res
        .status(201)
        .json(new ApiResponse(201, null, "Video liked"))
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on comment
    const {commentId} = req.params
    const userId = req.user._id

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }

    // Check if the like already exists
    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: userId
    })

    if (existingLike) {
        // If the like exists, remove it
        await Like.deleteOne({ _id: existingLike._id })
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Comment unliked"))
    }

    // If the like doesn't exist, create it
    await Like.create({ comment: commentId, user: userId })
    return res
        .status(201)
        .json(new ApiResponse(201, null, "Comment liked"))
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on tweet
    const {tweetId} = req.params
    const userId = req.user._id

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID")
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }

    // Check if the like already exists
    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: userId
    })

    if (existingLike) {
        // If the like exists, remove it
        await Like.deleteOne({ _id: existingLike._id })
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Tweet unliked"))
    }

    // If the like doesn't exist, create it
    await Like.create({ tweet: tweetId, user: userId })
    return res
        .status(201)
        .json(new ApiResponse(201, null, "Tweet liked"))
}
);

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user._id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }

    const likedVideos = await Like.find({
        likedBy: userId,
        video: { $exists: true }
    }).populate("video", "_id title thumbnail");

    return res
        .status(200)
        .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}