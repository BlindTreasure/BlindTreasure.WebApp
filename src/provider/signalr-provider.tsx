"use client";

import React from "react";
import { useAppSelector } from "@/stores/store";
import { useSignalRNotification } from "@/hooks/use-signalR-notification";

const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const user = useAppSelector((state) => state.userSlice.user);
  useSignalRNotification(user);

  return <>{children}</>;
};

export default SignalRProvider;