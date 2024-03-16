import React, { FC } from "react";
import { Box, Header, Icon, Page, Text } from "zmp-ui";
import { Divider } from "components/divider";
import { ListRenderer } from "components/list-renderer";
import { IconProps } from "zmp-ui/icon";
import { openChat, openPhone } from "zmp-sdk";

type ContactInfo = {
  key: string;
  label: string;
  value: string;
  icon: IconProps["icon"];
};

const ContactPage: FC = () => {
  const contactInfo: ContactInfo[] = [
    {
      key: "phone",
      label: "Phone",
      value: "1800 12313",
      icon: "zi-call"
    },
    {
      key: "zalo",
      label: "Zalo",
      value: "0387238882",
      icon: "zi-chat"
    },
    {
      key: "email",
      label: "Email",
      value: "support@aibat.vn",
      icon: "zi-at"
    },
    {
      key: "address",
      label: "Address",
      value: "C2 Apartment, Xuân Đỉnh, Bắc Từ Liêm, Hà Nội",
      icon: "zi-location"
    },
  ];

  const onClick = async (item: ContactInfo) => {
    switch (item.key) {
      case "phone":
        await openPhone({
          phoneNumber: item.value,
        });
        break;
      case "zalo":
        await openChat({
          type: "user",
          id: "6080363583887748749",
          message: "Xin Chào",
        });
        break;
      default:
        console.log(item);
    }
  };

  return (
    <Page>
      <Header title="Liên hệ" showBackIcon />
      <Divider />
      <Box className="bg-background">
        <ListRenderer
          onClick={onClick}
          items={contactInfo}
          renderLeft={(item) => (
            <Box className="flex items-center w-24">
              <Icon icon={item.icon} className="mr-3" />
              <Text.Header>{item.label}</Text.Header>
            </Box>
          )}
          renderRight={(item) => <Text>{item.value}</Text>}
        />
      </Box>
    </Page>
  );
};

export default ContactPage;
