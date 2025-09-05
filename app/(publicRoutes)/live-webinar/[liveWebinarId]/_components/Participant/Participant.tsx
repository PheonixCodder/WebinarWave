"use client";
import { getStreamIoToken } from "@/actions/streamIo";
import { Button } from "@/components/ui/button";
import { WebinarWithPresenter } from "@/lib/type";
import { useAttendeeStore } from "@/store/useAttendeeStore";
import {
  Call,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { AlertCircle, Loader2, WifiOff } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import LiveWebinarView from "../Common/LiveWebinarView";

type Props = {
  apiKey: string;
  callId: string;
  webinar: WebinarWithPresenter;
};

const Participant = ({ apiKey, callId, webinar }: Props) => {
  const { attendee } = useAttendeeStore();
  const [showChat, setShowChat] = useState(true);
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "failed" | "reconnecting" | "connected"
  >("connecting");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clientInitialized = useRef<boolean>(false);

  useEffect(() => {
    if (clientInitialized.current) return;
    const initClient = async () => {
      try {
        setConnectionStatus("connecting");
        const user: User = {
          id: attendee?.id || "guest",
          name: attendee?.name || "Guest",
          image: `https://api.dicebear.com/7.x/initials/svg?seed=${
            attendee?.name || "Guest"
          }`,
        };

        const userToken = await getStreamIoToken(attendee);
        setToken(userToken);

        const streamClient = new StreamVideoClient({
          apiKey,
          user,
          token: userToken,
        });
        streamClient.on("connection.changed", (event) => {
          if (event.online) {
            setConnectionStatus("connected");
          } else {
            setConnectionStatus("reconnecting");
          }
        });

        await streamClient.connectUser(user, userToken);
        const streamCall = streamClient.call("livestream", callId);
        await streamCall.join({
          create: true,
        });

        setClient(streamClient);
        setCall(streamCall);
        setConnectionStatus("connected");

        clientInitialized.current = true;
      } catch (error) {
        setConnectionStatus("failed");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to initialize Stream client"
        );
      }
    };

    initClient();

    return () => {
      const currentCall = call;
      const currentClient = client;

      if (currentCall && currentClient) {
        currentCall
          .leave()
          .then(() => {
            currentClient.disconnectUser();
            clientInitialized.current = false;
          })
          .catch((e) => {
            console.error("Failed to leave call", e);
          });
      }
    };
  }, [apiKey, callId, attendee, call, client]);

  if (!attendee) {
    return (
      <div className="flex items-center justify-between h-screen bg-background text-foreground">
        <div className="text-center max-w-md p-8 rounded-lg border border-border bg-card">
          <h2 className="text-2xl font-bold mb-4">
            Please Register to Join the Webinar
          </h2>
          <p className="text-muted-foreground mb-6">
            Registration is required to join this webinar
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-accent-primary hover:bg-accent-primary/90 text-accent-foreground"
          >
            Register Now
          </Button>
        </div>
      </div>
    );
  }
  if (!client || !call || !token) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="text-center max-w-md p-8 rounded-lg border border-border bg-card">
          {connectionStatus === "connecting" && (
            <>
              <div className="relative mx-auto mb-6 w-24 h-24">
                <div className="absolute inset-0 rounded-full border-t-2 border-accent-primary animate-spin"></div>
                <div className="absolute inset-3 rounded-full bg-card flex items-center justify-center">
                  <Loader2 className="text-accent-primary h-10 w-10 animate-spin" />
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">Joining Webinar</h2>
              <p className="text-muted-foreground">
                Connecting to {webinar.title}...
              </p>
              <div className="mt-6 flex justify-center space-x-1">
                <span className="bg-accent-primary animate-bounce w-2 h-2 rounded-full"></span>
                <span
                  className="h-2 w-2 bg-accent-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></span>
                <span
                  className="h-2 w-2 bg-accent-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></span>
              </div>
            </>
          )}
          {connectionStatus === "reconnecting" && (
            <>
              <div className="mx-auto w-16 h-16 mb-4 text-amber-400">
                <WifiOff className="w-16 h-16 animate-pulse" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Reconnecting</h2>
              <p className="text-muted-foreground mb-4">
                Connection lost. Attempting to reconnect...
              </p>
              <div className="w-full bg-muted rounded-full h-2 mb-6">
                <div
                  className="bg-amber-500 h-2 rounded-full animate-pulse"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </>
          )}
          {connectionStatus === "failed" && (
            <>
              <div className="mx-auto w-16 h-16 mb-4 text-destructive animate-pulse">
                <AlertCircle className="w-16 h-16" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Connection Failed</h2>
              <p className="text-muted-foreground mb-4">
                {errorMessage || "Unable to join webinar"}
              </p>
              <div className="flex space-x-4 justify-center">
                <Button
                  onClick={() => window.location.reload()}
                  variant={"outline"}
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => (window.location.href = "/")}
                  variant={"outline"}
                >
                  Back to Home
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <LiveWebinarView
          showChat={showChat}
          setShowChat={setShowChat}
          webinar={webinar}
          isHost={false}
          username={attendee.name}
          userId={attendee.id}
          userToken={token}
        />
      </StreamCall>
    </StreamVideo>
  );
};
export default Participant;
