import { FinalPrice } from "components/display/final-price";
import { Sheet } from "components/fullscreen-sheet";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { cartState } from "state";
import { SelectedOptions } from "types/cart";
import { Attribute, Product, Variant } from "types/product";
import { isIdentical } from "utils/product";
import { Box, Button, Text } from "zmp-ui";
import { MultipleOptionPicker } from "./multiple-option-picker";
import { QuantityPicker } from "./quantity-picker";
import { SingleOptionPicker } from "./single-option-picker";

const a1: Attribute = {
  id: "1",
  label: "Size",
  options: [
    { id: "1", label: "S" },
    { id: "2", label: "M" },
    { id: "3", label: "L" },
  ],
};

const a2: Attribute = {
  id: "2",
  label: "Color",
  options: [
    { id: "1", label: "Red" },
    { id: "2", label: "Green" },
    { id: "3", label: "Blue" },
  ],
};

export interface ProductPickerProps {
  product?: Product;
  selected?: {
    options: SelectedOptions;
    quantity: number;
  };
  children: (methods: { open: () => void; close: () => void }) => ReactNode;
}

function getDefaultOptions(variants: Variant[]): SelectedOptions {
  const firstVariant = variants[0];

  return firstVariant.options.reduce<SelectedOptions>((acc, option) => {
    if (firstVariant.type === "single") {
      acc[option.id] = firstVariant.options[0].id;
    } else {
      acc[option.id] = [];
    }
    return acc;
  }, {});
}

export const ProductPicker: FC<ProductPickerProps> = ({
  children,
  product,
  selected,
}) => {
  const [visible, setVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);

  return (
    <>
      {children({
        open: () => setVisible(true),
        close: () => setVisible(false),
      })}
      {createPortal(
        <Sheet visible={visible} onClose={() => setVisible(false)} autoHeight>
          {product && (
            <Box className="space-y-6 mt-2" p={4}>
              <Box className="space-y-2">
                <Text.Title>{product.name}</Text.Title>
                <Text>
                  asdf
                </Text>
                <Text>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: product.description ?? "",
                    }}
                  ></div>
                </Text>
              </Box>

              <Box className="space-y-5">
                <SingleOptionPicker
                  attribute={a1}
                  value={"1"}
                  onChange={(value) => { }}
                />

                <SingleOptionPicker
                  attribute={a1}
                  value={"1"}
                  onChange={(value) => { }}
                />
              </Box>

              <Box className="space-y-5">
                <QuantityPicker value={quantity} onChange={setQuantity} />
                {selected ? (
                  <Button
                    variant={quantity > 0 ? "primary" : "secondary"}
                    type={quantity > 0 ? "highlight" : "neutral"}
                    fullWidth
                  >
                    {quantity > 0
                      ? selected
                        ? "Cập nhật giỏ hàng"
                        : "Thêm vào giỏ hàng"
                      : "Xoá"}
                  </Button>
                ) : (
                  <Button
                    disabled={!quantity}
                    variant="primary"
                    type="highlight"
                    fullWidth
                  >
                    Thêm vào giỏ hàng
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Sheet>,
        document.body,
      )}
    </>
  );
};
