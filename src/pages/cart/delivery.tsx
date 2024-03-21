import { ElasticTextarea } from "components/elastic-textarea";
import { ListRenderer } from "components/list-renderer";
import React, { FC, Suspense } from "react";
import { Box, Icon, Input, Text } from "zmp-ui";
import { PersonPicker, RequestPersonPickerPhone } from "./person-picker";
import { orderAddressState, orderNoteState } from "state";
import { useRecoilState } from "recoil";

export const Delivery: FC = () => {
  const [note, setNote] = useRecoilState(orderNoteState);
  const [address, setAddress] = useRecoilState(orderAddressState);

  return (
    <Box className="space-y-3 px-4">
      <Text.Header>Hình thức nhận hàng</Text.Header>
      <ListRenderer
        items={[
          {
            left: <Icon icon="zi-user" className="my-auto" />,
            right: (
              <Suspense fallback={<div>Loading ....</div>}>
                <PersonPicker />
              </Suspense>
            ),
          },
          {
            left: <Icon icon="zi-location" className="my-auto" />,
            right: (
              <Box flex>
                <ElasticTextarea
                  value={address}
                  onChange={(e: any) => setAddress(e.target?.value)}
                  placeholder="Nhập địa chỉ..."
                  className="border-none px-0 w-full focus:outline-none"
                  maxRows={2}
                />
              </Box>
            ),
          },
          {
            left: <Icon icon="zi-note" className="my-auto" />,
            right: (
              <Box flex>
                <ElasticTextarea
                  value={note}
                  onChange={(e: any) => setNote(e.target?.value)}
                  placeholder="Nhập ghi chú..."
                  className="border-none px-0 w-full focus:outline-none"
                  maxRows={4}
                />
              </Box>
            ),
          },
        ]}
        limit={4}
        renderLeft={(item) => item.left}
        renderRight={(item) => item.right}
      />
    </Box>
  );
};
