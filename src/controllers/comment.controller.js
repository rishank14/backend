import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  // Check if videoId is a valid ObjectId
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  // Fetch comments from the database
  const comments = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $project: {
        content: 1,
        video: { $arrayElemAt: ["$video", 0] },
        owner: { $arrayElemAt: ["$owner", 0] },
        createdAt: 1,
      },
    },
    {
      $sort: { createdAt: -1 }, // Sort by creation date, newest first
    },
    {
      $skip: (page - 1) * limit, // Pagination: skip documents
    },
    {
      $limit: parseInt(limit), // Limit the number of documents returned
    },
  ]);
  // Check if comments were found
  if (!comments?.length) {
    throw new ApiError(404, "No comments found for this video");
  }
  return res.json(
    new ApiResponse(200, comments, "Comments fetched successfully")
  );
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;
  // Check if videoId is a valid ObjectId
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  // Check if content is provided
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Comment content cannot be empty");
  }
  // Create a new comment
  const newComment = await Comment.create({
    content,
    video: videoId,
    owner: req.user?._id,
  });
  // Check if the comment was created successfully
  if (!newComment) {
    throw new ApiError(500, "Failed to add comment");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, newComment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
    const { commentId } = req.params;
    const { content } = req.body;
    // Check if commentId is a valid ObjectId
    if (!isValidObjectId(commentId)) {
      throw new ApiError(400, "Invalid comment ID");
    }
    // Check if content is provided
    if (!content || content.trim() === "") {
      throw new ApiError(400, "Comment content cannot be empty");
    }
    // Update the comment
    // Find the comment to check ownership
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }
    if (String(comment.owner) !== String(req.user?._id)) {
      throw new ApiError(403, "You are not authorized to update this comment");
    }
    // Update the comment
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $set: { content } },
      { new: true }
    );
    // Check if the comment was updated successfully
    if (!updatedComment) {
      throw new ApiError(500, "Failed to update comment");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
      );
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  // Check if commentId is a valid ObjectId
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }
  // Find the comment to check ownership
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  if (String(comment.owner) !== String(req.user?._id)) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }
  // Delete the comment
  const deletedComment = await Comment.findByIdAndDelete(commentId);
  // Check if the comment was deleted successfully
  if (!deletedComment) {
    throw new ApiError(500, "Failed to delete comment");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedComment, "Comment deleted successfully")
    );
});

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
};
