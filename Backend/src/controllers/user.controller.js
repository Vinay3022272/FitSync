import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
import e from "express";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;
    // console.log(currentUserId,currentUser);

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { _id: { $nin: currentUser.friends } },
        { isOnboarded: true },
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage"
      );
      res.status(200).json(user.friends)
  } catch (error) {
    console.error("Error in getMyFriends controller",error.message);
    res.status(500).json({message: "Internal Server Error"})
  }
}

export async function sendFriendRequest(req, res){
    try {
        const myId = req.user.id;
        const {id: recipientId} = req.params;

        // console.log("recipientId: ",recipientId);
        // return res.status(200).json({message: recipientId})

        // prevent sending req to yourself
        if(myId === recipientId){
            return res.status(400).json({message: "You can't send friend request to yourself"})
        } 

        const recipient = await User.findById(recipientId)
        if(!recipient){
            return res.status(404).json({message: "Recipient not found"})
        }

        // check if the user is already friends
        if(recipient.friends.includes(myId)){
            return res.status(400).json({message: "You are already friends with this user"})
        }

        // check if a request already exists
        const existingRequest = await User.findOne({
            $or: [
                {sender: myId, recipient: recipientId},
                {sender: recipientId, recipient: myId}
            ]
        })
        if(existingRequest){
            return res.status(400).json({message: "A friend request already exist between you and this user"})
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        })
        res.status(200).json(friendRequest)
    } catch (error) {
        console.error("Error in sendFriendRequest controller",error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}

export async function acceptFriendRequest(req, res){
    try {
        const {id: requestId} = req.params;
        // console.log("requestId: ",requestId);
        // return res.status(200).json({message: requestId})

        const friendRequest = await FriendRequest.findById(requestId)
        if(!friendRequest){
            return res.status(404).json({message: "Friend Request not found"})
        }

        // Verify the current user in the recipient 
        if(friendRequest.recipient.toString() !== req.user.id){
            return res.status(403).json({message: "You are not authorised to accept this request"})
        }
        friendRequest.status = "accepted"
        await friendRequest.save()

        // add each user to other's friends array
        // $addToSet adds elements to an array only if they do not already exist
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet: {
                friends: friendRequest.recipient
            }
        })
        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: {
                friends: friendRequest.sender
            }
        })
       res.status(200).json({message: "Friend request accepted"})
    } catch (error) {
        console.error("Error in acceptFriendRequest controller",error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}

export async function getFriendRequests(req, res){
    try {
        // user is getting req and he is recipient
        const incomingReqs = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending"
        }).populate("Sender","fullName profilePic nativeLanguage learningLanguage")
        
        // sended request that got accepted(recipient is someone else)
        const acceptedRequest = await FriendRequest.find({
            sender: req.user.id,
            status:"accepted"
        }).populate("recipient","fullName profilePic")
        res.status(200).json({incomingReqs, acceptedRequest});
    } catch (error) {
        console.error("Error in getFriendRequests controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}

export async function getOutgoingFriendReqs(req, res){
    try {
        const outGoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status:"pending"
        }).populate("recipient","fullName profilePic nativeLanguage learningLanguage")
        res.status(200).json(outGoingRequests)
    } catch (error) {
        console.error("Error in getOutgoingFriendReqs controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}


// rename getFriendRequests to Notification 

// export async function rejectFriendRequest(req, res) {
//   try {
//     const { id: requestId } = req.params;

//     // Find friend request
//     const friendRequest = await FriendRequest.findById(requestId);
//     if (!friendRequest) {
//       return res.status(404).json({ message: "Friend request not found" });
//     }

//     // Sirf recipient hi reject kar sakta hai
//     if (friendRequest.recipient.toString() !== req.user.id) {
//       return res
//         .status(403)
//         .json({ message: "You are not authorised to reject this request" });
//     }

//     // Option 1 (Recommended): Delete request directly
//     await FriendRequest.findByIdAndDelete(requestId);

//     return res
//       .status(200)
//       .json({ message: "Friend request rejected" });
//   } catch (error) {
//     console.error("Error in rejectFriendRequest controller", error.message);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }
