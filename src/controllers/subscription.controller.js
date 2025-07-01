import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    // TODO: toggle subscription
    const {channelId} = req.params
    const subscriberId = req.user._id

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID")
    }

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID")
    }

    if (subscriberId.toString() === channelId.toString()) {
        throw new ApiError(400, "You cannot subscribe to your own channel")
    }   

    // Check if the subscription already exists
    const existingSubscription = await Subscription.findOne({
        channel: channelId,
        subscriber: subscriberId
    })

    if (existingSubscription) {
        // If it exists, unsubscribe
        await Subscription.deleteOne({
            channel: channelId,
            subscriber: subscriberId
        })
        return res
        .status(200)
        .json(new ApiResponse(200, null, "Unsubscribed successfully"))
    } else {
        // If it does not exist, subscribe
        const newSubscription = await Subscription.create({
            channel: channelId,
            subscriber: subscriberId
        })
        return res
        .status(201)
        .json(new ApiResponse(201, newSubscription, "Subscribed successfully"))
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID")
    }

    const subscribers = await Subscription.find({ channel: channelId })
        .populate('subscriber', '_id name email') // Populate subscriber details
        .sort({ createdAt: -1 }) // Sort by subscription date

    return res
        .status(200)
        .json(new ApiResponse(200, subscribers || [], "Subscribers fetched successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID")
    }

    const subscribedChannels = await Subscription.find({ subscriber: subscriberId })
        .populate('channel', '_id name email') // Populate channel details
        .sort({ createdAt: -1 }) // Sort by subscription date

    return res
        .status(200)
        .json(new ApiResponse(200, subscribedChannels || [], "Subscribed channels fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}