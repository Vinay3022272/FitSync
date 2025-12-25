import React from "react";
import useAuthUser from "../hooks/useAuthUser.js";
import { Link, useLocation } from "react-router-dom";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector.jsx";
import useLogout from "../hooks/useLogout.js";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api.js";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout();

  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const reqCount = incomingRequests.length;

  return (
    <nav className="border-b bg-base-200 border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          
          {isChatPage && (
            <div className="pl-5 mr-auto">
              <Link to="/" className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  Streamify
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* IMPROVED BADGE DESIGN */}
            <Link to={"/notifications"} className="relative">
              <div className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </div>

              {/* Only show badge if count > 0 */}
              {reqCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-base-100">
                  {reqCount > 9 ? "9+" : reqCount}
                </span>
              )}
            </Link>

            <ThemeSelector />

            <div className="avatar">
              <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={authUser?.profilePic || "/avatar.png"}
                  alt="User Avatar"
                />
              </div>
            </div>

            <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
              <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;