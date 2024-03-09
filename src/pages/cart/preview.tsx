import { DisplayPrice } from "components/display/price";
import React, { FC, useState } from "react";
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from "recoil";
import { cartState, orderAddressState, orderNoteState, phoneState, totalPriceState, totalQuantityState, userState } from "state";
import { CreateOrderPayload } from "types/cart";
import { getConfig } from "utils/config";
import { Box, Button, Text, useSnackbar } from "zmp-ui";

const url = getConfig((config) => config.api.baseUrl);
const apiKey = getConfig((config) => config.api.apiKey);

export const CartPreview: FC = () => {
  const quantity = useRecoilValue(totalQuantityState);
  const totalPrice = useRecoilValue(totalPriceState);

  const [note, setNote] = useRecoilState(orderNoteState);
  const [cart, setCart] = useRecoilState(cartState);

  const address = useRecoilValue(orderAddressState);
  const user = useRecoilValueLoadable(userState).contents;
  const phone = useRecoilValueLoadable(phoneState).contents;

  const snackbar = useSnackbar();

  const [loading, setLoading] = useState(false);

  async function createOrder() {
    const createOrderPayload: CreateOrderPayload = {
      phone: typeof phone === "string" ? phone : "",
      name: user.name,
      address: address,
      note: note,
      items: (cart ?? []).map((item) => ({
        variantId: item.variant.id,
        quantity: item.quantity,
      })),
    }

    // validate
    if (!createOrderPayload.phone) {
      snackbar.openSnackbar({ type: "error", text: "Vui lòng nhập số điện thoại" });
      return;
    }

    setLoading(true);

    const response = await fetch(`${url}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(createOrderPayload),
    });

    setLoading(false);

    if (!response.ok) {
      snackbar.openSnackbar({ type: "error", text: "Đã có lỗi xảy ra" });
      return;
    }

    snackbar.openSnackbar({ type: "success", text: "Đặt hàng thành công" });
    setCart([]);
    setNote("");
  }

  return (
    <Box flex className="sticky bottom-0 bg-background p-4 space-x-4">
      <Box
        flex
        flexDirection="column"
        justifyContent="space-between"
        className="min-w-[120px] flex-none"
      >
        <Text className="text-gray" size="xSmall">
          {quantity} sản phẩm
        </Text>
        <Text.Title size="large">
          <DisplayPrice>{totalPrice}</DisplayPrice>
        </Text.Title>
      </Box>
      <Button
        type="highlight"
        disabled={!quantity || loading}
        fullWidth
        onClick={createOrder}
      >
        {loading ? "Đang xử lý..." : "Đặt hàng"}
      </Button>
    </Box>
  );
};
