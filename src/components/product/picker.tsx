import { Sheet } from "components/fullscreen-sheet";
import React, { FC, ReactNode, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Attribute, Product } from "types/product";
import { Box, Button, Text } from "zmp-ui";
import { QuantityPicker } from "./quantity-picker";
import { SingleOptionPicker } from "./single-option-picker";
import logo from "static/logo.png";
import { DisplayPrice } from "components/display/price";
import { getConfig } from "utils/config";

export interface ProductPickerProps {
  product?: Product;
  selected?: {
    options: any;
    quantity: number;
  };
  children: (methods: { open: () => void; close: () => void }) => ReactNode;
}

export const ProductPicker: FC<ProductPickerProps> = ({
  children,
  product,
  selected,
}) => {
  const [visible, setVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [variants, setVariants] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({}); // { "Color": "Red", "Size": "M" }

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
    setVariants(data);
    setAttributes(extractAttributes(data))
  }

  function handleOptionChange(attributeId: string, value: string) {
    setSelectedOptions((prev) => ({
      ...prev,
      [attributeId]: value,
    }));
  }

  const selectedVariant = useMemo(() => {
    return variants.find((variant) => {
      return variant.attributes.every((attribute) => {
        return selectedOptions[attribute.name] === attribute.value;
      });
    });
  }, [variants, selectedOptions]);

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

function extractAttributes(variants: any[]): Attribute[] {
  const attributes = {};

  variants.forEach(item => {
    item.attributes.forEach(attribute => {
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
