import { FinalPrice } from "components/display/final-price";
import React, { FC } from "react";
import { Product } from "types/product";
import { Box, Text } from "zmp-ui";
import { ProductPicker } from "./picker";
import logo from "static/logo.png";
import { DisplayPrice } from "components/display/price";

export const ProductItem: FC<{ product: Product }> = ({ product }) => {
  return (
    <ProductPicker product={product}>
      {({ open }) => (
        <div className="space-y-2" onClick={open}>
          <Box className="w-full aspect-square relative">
            <img
              loading="lazy"
              src={product.image || logo}
              className="absolute left-0 right-0 top-0 bottom-0 w-full h-full object-cover object-center rounded-lg bg-skeleton"
            />
          </Box>
          <Text>{product.name}</Text>
          {
            product.isSale &&
            <Text size="xxSmall" className="line-through text-gray">
              <DisplayPrice>{product.price}</DisplayPrice>
            </Text>
          }
          <Text size="large" className="font-medium text-primary">
            <DisplayPrice>{product.currentPrice}</DisplayPrice>
          </Text>
        </div>
      )}
    </ProductPicker>
  );
};
