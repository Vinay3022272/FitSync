import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser.js";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api.js";
import {
  StreamVideoClient,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  StreamCall,
  StreamVideo,
  useCall,
  useCallStateHooks,
  name,
} from "@stream-io/video-react-sdk";
import '@stream-io/video-react-sdk/dist/css/styles.css';
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader.jsx";
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsconnecting] = useState(true);
  const { authUser, isLoading } = useAuthUser();
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !authUser) return;
      try {
        console.log("Initializing Stream video call client...");
        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic
        }

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token
        })

        const callInstance = videoClient.call("default", callId)
        callInstance.join({create: true})
        console.log("Joined call successfully");
        setClient(videoClient)
        setCall(callInstance)
      } catch (error) {
        console.error("Error joining call: ", error);
        toast.error("Could not join the call. Please try again.")
      } finally {
        setIsconnecting(false)
      }
    };
    initCall();
  },[tokenData, authUser, callId]);

  if(isLoading || isConnecting) return <PageLoader/>
  return <div>Call Page</div>;
};

export default CallPage;
