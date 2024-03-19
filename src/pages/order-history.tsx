import React, { FC, Suspense, useEffect, useState } from "react";
import { ListRenderer } from "components/list-renderer";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Box, Button, Header, Page, Text } from "zmp-ui";
import { Divider } from "components/divider";
import { phoneState, requestPhoneTriesState } from "state";
import { getConfig } from "utils/config";
import { OrderHistoryItem } from "types/order";
import logo from "static/logo.png";
import { DisplayPrice } from "components/display/price";

const OrderHistoryList: FC = () => {
  const phone = useRecoilValue(phoneState);
  const retry = useSetRecoilState(requestPhoneTriesState);

  const [history, setHistory] = useState<OrderHistoryItem[]>([])

  async function fetchHistory() {
    if (!phone) return;

    const url = getConfig((config) => config.api.baseUrl);
    const apiKey = getConfig((config) => config.api.apiKey);

    const response = await fetch(`${url}/orders/history?phone=${phone}`, {
      headers: {
        "x-api-key": apiKey,
      },
    });

    const data = await response.json();
    setHistory(data.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt)
    })) || []);
  }

  useEffect(() => {
    fetchHistory();
  }, [phone]);

  if (!phone) {
    return <div className="flex flex-col space-y-2 items-center">
      <span>Yêu cầu truy cập số điện thoại </span>
      <Button
        type="highlight"
        onClick={() => retry((r) => r + 1)}
        size="small"
      >
        Thử lại
      </Button>
    </div>;
  }

  if (!history.length) {
    return <div className="flex flex-col space-y-2 items-center">
      <span>Chưa có đơn hàng nào</span>
    </div>;
  }

  return (
    <Box className="bg-background">
      <ListRenderer
        items={history}
        renderLeft={(order) => (
          <img className="w-14 h-14 rounded-md" src={order.image || logo} />
        )}
        renderRight={(order) => (
          <Box key={order.id}>
            <Text.Header>{order.title}</Text.Header>
            <div className="flex space-x-2">
              <Text
                size="small"
                className="overflow-hidden whitespace-nowrap text-ellipsis"
              >
                {order.code || "N/A"}
              </Text>
            </div>
            <div className="flex justify-between">
              <Text size="small" className="text-gray">
                {order.createdAt?.toLocaleDateString('vi-VN') || 'N/A'}
              </Text>
              <Text
                size="small"
                className="text-red-600 overflow-hidden whitespace-nowrap text-ellipsis"
              >
                <DisplayPrice>
                  {order.price || 0}
                </DisplayPrice>
              </Text>
            </div>
          </Box>
        )}
      />
    </Box>
  );
};

const OrderHistoryPage: FC = () => {
  return (
    <Page>
      <Header title="Lịch sử đơn hàng" showBackIcon />
      <Divider />

      <Suspense fallback={<div className="flex flex-col space-y-2 items-center">Loading...</div>}>
        <OrderHistoryList />
      </Suspense>
    </Page>
  );
};

export default OrderHistoryPage;
