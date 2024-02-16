import React, { FC } from "react";
import { Box, Header, Text } from "zmp-ui";
import { useRecoilValueLoadable } from "recoil";
import logo from "static/logo.png";
import { userState } from "state";
import { configInfoState } from "state/config";

export const Welcome: FC = () => {
  const user = useRecoilValueLoadable(userState);
  const configInfo = useRecoilValueLoadable(configInfoState);

  return (
    <Header
      className="app-header no-border pl-4 flex-none pb-[6px]"
      showBackIcon={false}
      title={
        (
          <Box flex alignItems="center" className="space-x-2">
            <img
              className="w-8 h-8 rounded-lg border-inset"
              src={
                configInfo.state === "hasValue"
                  ? configInfo.contents.logo
                  : logo
              }
            />
            <Box>
              <Text.Title size="small">
                {configInfo.state === "hasValue"
                  ? configInfo.contents.name
                  : "Loading..."}
              </Text.Title>

              {user.state === "hasValue" ? (
                <Text size="xxSmall" className="text-gray">
                  Welcome, {user.contents.name}!
                </Text>
              ) : (
                <Text>...</Text>
              )}
            </Box>
          </Box>
        ) as unknown as string
      }
    />
  );
};
