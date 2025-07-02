import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userId = req.user._id

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }

    const totalVideos = await Video.countDocuments({owner: userId})

    if (!totalVideos) {
        throw new ApiError(500, "Failed to retrieve total videos")
    }

    const totalSubscribers = await Subscription.countDocuments({channel: userId})

    if (!totalSubscribers) {
        throw new ApiError(500, "Failed to retrieve total subscribers")
    }

    const totalLikes = await Like.countDocuments({
        video: { $in: await Video.find({owner: userId}).distinct('_id') }
    })

    if (!totalLikes) {
        throw new ApiError(500, "Failed to retrieve total likes")
    }

    const totalViews = await Video.aggregate([
        { $match: { owner: userId } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ])

    if (!totalViews) {
        throw new ApiError(500, "Failed to retrieve total views")
    }

    return res.status(200).json(new ApiResponse(200, {
        totalVideos,
        totalSubscribers,
        totalLikes,
        totalViews: totalViews[0]?.totalViews || 0
    }, "Channel stats retrieved successfully"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const userId = req.user._id

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }

    const videos = await Video.find({owner: userId}).sort({createdAt: -1})

    if (!videos) {
        throw new ApiError(500, "Failed to retrieve videos")
    }

    return res.status(200).json(new ApiResponse(200, videos, "Channel videos retrieved successfully"))
})

export {
    getChannelStats, 
    getChannelVideos
    }