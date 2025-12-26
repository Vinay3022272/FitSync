import React, { useEffect, useState } from "react";
import { getLanguageFlag } from "../utils/getFlagIcon.jsx";
import { Link } from "react-router-dom"; // Fixed import based on previous fix
import { StreamChat } from "stream-chat";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api.js";
import useAuthUser from "../hooks/useAuthUser.js";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const FriendCard = ({ friend }) => {
  const { authUser } = useAuthUser();
  const [unreadCount, setUnreadCount] = useState(0);

  // 1. Fetch the token (Same logic as ChatPage)
  // Note: React Query caches this, so it won't spam the API even if you have 10 friends
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  // 2. Check for unread messages
  useEffect(() => {
    if (!tokenData?.token || !authUser) return;

    const client = StreamChat.getInstance(STREAM_API_KEY);

    const getUnreadCount = async () => {
      try {
        // Connect user if not already connected
        if (!client.userID) {
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: authUser.profilePic,
            },
            tokenData.token
          );
        }

        // Define the channel ID exactly like you do in ChatPage
        // (Alphabetical sort ensures both users see the same channel)
        const channelId = [authUser._id, friend._id].sort().join("-");

        const channel = client.channel("messaging", channelId, {
          members: [authUser._id, friend._id],
        });

        // Get the current state
        const state = await channel.watch();
        setUnreadCount(state.unreadCount);

        // Optional: Listen for new messages while looking at this card
        channel.on("message.new", () => {
          setUnreadCount(channel.countUnread());
        });
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    getUnreadCount();
  }, [authUser, friend, tokenData]);

  return (
    <div
      className={`card bg-base-200 hover:shadow-md transition-shadow ${
        unreadCount > 0 ? "border border-primary" : ""
      }`}
    >
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          {/* AVATAR WITH INDICATOR */}
          <div className="indicator">
            {unreadCount > 0 && (
              <span className="indicator-item badge badge-secondary badge-sm text-white font-bold ring-2 ring-base-100 transform translate-x-1 -translate-y-1">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
            <div className="avatar size-12">
              <img
                src={friend.profilePic}
                alt={friend.fullName}
                className="rounded-full"
              />
            </div>
          </div>

          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>

        {/* Language boxes */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        <Link
          to={`/chat/${friend._id}`}
          className="btn btn-outline w-full group"
        >
          Message
          {unreadCount > 0 && (
            <span className="badge badge-error badge-xs ml-1 group-hover:badge-outline"></span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;
