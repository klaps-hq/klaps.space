"use client";

import {
  createContext,
  useContext,
  useTransition,
  type ReactNode,
  type TransitionStartFunction,
} from "react";

interface ScreeningsTransitionContextValue {
  isPending: boolean;
  startTransition: TransitionStartFunction;
}

const ScreeningsTransitionContext =
  createContext<ScreeningsTransitionContextValue>({
    isPending: false,
    startTransition: (fn) => fn(),
  });

export const useScreeningsTransition = () =>
  useContext(ScreeningsTransitionContext);

interface ScreeningsTransitionProviderProps {
  children: ReactNode;
}

export const ScreeningsTransitionProvider = ({
  children,
}: ScreeningsTransitionProviderProps) => {
  const [isPending, startTransition] = useTransition();

  return (
    <ScreeningsTransitionContext.Provider
      value={{ isPending, startTransition }}
    >
      {children}
    </ScreeningsTransitionContext.Provider>
  );
};
