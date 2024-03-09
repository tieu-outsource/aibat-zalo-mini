import { Sheet } from "components/fullscreen-sheet";
import React, { FC, ReactNode, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Attribute, Product, Variant } from "types/product";
import { Box, Button, Text } from "zmp-ui";
import { QuantityPicker } from "./quantity-picker";
import { SingleOptionPicker } from "./single-option-picker";
import logo from "static/logo.png";
import { DisplayPrice } from "components/display/price";
import { getConfig } from "utils/config";
import { useSetRecoilState } from "recoil";
import { cartState } from "state";
import { CartItem } from "types/cart";

// TODO: handle remove

export interface ProductPickerProps {
  product?: Product;
  selected?: CartItem;
  children: (methods: { open: () => void; close: () => void }) => ReactNode;
}

export const ProductPicker: FC<ProductPickerProps> = ({
  children,
  product,
  selected,
}) => {
  const [visible, setVisible] = useState(false);
  const [quantity, setQuantity] = useState(selected?.quantity || 1);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>(selected?.selectedOptions || {}); // { "Color": "Red", "Size": "M" }

  const setCart = useSetRecoilState(cartState);

  async function fetchVariants() {
    const productId = product?.id;
    if (!productId) return;

    const url = getConfig((config) => config.api.baseUrl);
    const apiKey = getConfig((config) => config.api.apiKey);

    const response = await fetch(`${url}/products/${productId}/variants`, {
      headers: {
        "x-api-key": apiKey,
      },
    });

    const data = await response.json();
    setVariants(data || []);
    setAttributes(extractAttributes(data))
  }

  function handleOptionChange(attributeId: string, value: string) {
    setSelectedOptions((prev) => ({
      ...prev,
      [attributeId]: value,
    }));
  }

  const selectedVariant = useMemo(() => {
    if (variants.length === 1) return variants[0];

    return variants?.find((variant) => {
      return variant.attributes.every((attribute) => {
        return selectedOptions[attribute.name] === attribute.value;
      });
    });
  }, [variants, selectedOptions]);

  const handleAddToCart = () => {
    if (selected) return;
    if (quantity === 0) return;
    if (!selectedVariant) return;
    if (!product) return;

    const cartItem: CartItem = {
      product: product,
      variant: selectedVariant,
      quantity: quantity,
      selectedOptions: selectedOptions,
    };

    setCart((prev) => {
      const index = prev.findIndex((item) => item.variant.id === selectedVariant.id);
      if (index !== -1) {
        const newItems = [...prev];
        newItems[index] = cartItem;
        return newItems;
      } else {
        return [...prev, cartItem];
      }
    });

    setVisible(false);
  };

  const handleUpdateCart = () => {
    if (!selected) return;
    if (quantity === 0) return;
    if (!selectedVariant) return;
    if (!product) return;

    const cartItem: CartItem = {
      product: product,
      variant: selectedVariant,
      quantity: quantity,
      selectedOptions: selectedOptions,
    };

    setCart((prev) => {
      const index = prev.findIndex((item) => item.variant.id === selectedVariant.id);
      if (index !== -1) {
        const newItems = [...prev];
        newItems[index] = cartItem;
        return newItems;
      } else {
        return prev;
      }
    });

    setVisible(false);
  }

  return (
    <>
      {children({
        open: () => {
          setVisible(true);
          fetchVariants();
        },
        close: () => setVisible(false),
      })}
      {createPortal(
        <Sheet visible={visible} onClose={() => setVisible(false)} height="90%">
          {product && (
            <Box className="space-y-6 mt-2 overflow-y-auto" p={4}>
              <Box className="w-full aspect-square relative">
                <img
                  loading="lazy"
                  src={product.image || logo}
                  className="absolute left-0 right-0 top-0 bottom-0 w-full h-full object-cover object-center rounded-lg bg-skeleton"
                />
              </Box>

              <Box className="space-y-2">
                <Text.Title>{product.name}</Text.Title>
                <DisplayPrice>
                  {product.price}
                </DisplayPrice>
                <Text>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: product.description ?? "",
                    }}
                  ></div>
                </Text>
              </Box>

              <Box className="space-y-5">
                {attributes.map((attribute) =>
                  <SingleOptionPicker
                    key={attribute.id}
                    attribute={attribute}
                    value={selectedOptions[attribute.id]}
                    onChange={(value) => {
                      handleOptionChange(attribute.id, value);
                    }}
                  />
                )}
              </Box>

              <Box className="space-y-5">
                <QuantityPicker value={quantity} onChange={setQuantity} />
                {selected ? (
                  <Button
                    onClick={handleUpdateCart}
                    variant={(quantity > 0) ? "primary" : "secondary"}
                    type={(quantity > 0) ? "highlight" : "neutral"}
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
                    onClick={handleAddToCart}
                    disabled={!quantity || !selectedVariant}
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

function extractAttributes(variants: any[]): Attribute[] {
  const attributes = {};

  variants.forEach(item => {
    item.attributes
      .filter(attribute => !!attribute.name)
      .forEach(attribute => {
        const attributeName = attribute.name;
        const attributeValue = attribute.value;

        if (!attributes[attributeName]) {
          // If the attribute is not present in the result object, add it
          attributes[attributeName] = {
            id: attributeName,
            label: attributeName,
            options: [],
          };
        }

        const attributeOptions = attributes[attributeName].options;

        // Check if the attribute value already exists in options
        const existingOption = attributeOptions.find(option => option.label === attributeValue);

        if (!existingOption) {
          // If the attribute value is not present in options, add it
          attributeOptions.push({
            id: attributeValue,
            label: attributeValue,
          });
        }
      });
  });

  // Convert the result object to an array
  const result = Object.values(attributes);
  return result as Attribute[];
}
