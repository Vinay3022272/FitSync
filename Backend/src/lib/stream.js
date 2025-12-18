import {StreamChat} from "stream-chat"
import "dotenv/config"

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

if(!apiKey || !apiSecret){
    console.log("Stream API key or secret is missing");
}

const streamClient = StreamChat.getInstance( apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
         await streamClient
        .channel("messaging", `user-${newUser._id}`, {
          members: [newUser._id.toString()],
        })
        .create();
        return userData
    } catch (error) {
        console.log("Error upserting Stream user:",error);
    }
}

export const generateStreamToken = (userId) => {
    try {
        // ensure useId is a string
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr)
    } catch (error) {
        console.error("Error generating Stream token",error);
    }
}