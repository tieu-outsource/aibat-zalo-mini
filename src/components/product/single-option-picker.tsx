import React, { FC } from "react";
import { Attribute, Variant } from "types/product";
import { Box, Radio, Text } from "zmp-ui";

export const SingleOptionPicker: FC<{
  attribute: Attribute;
  value: string;
  onChange: (value: string) => void;
}> = ({ attribute, value, onChange }) => {
  return (
    <Box my={8} className="space-y-2">
      <Text.Title size="small">{attribute.label}</Text.Title>
      <Radio.Group
        className="flex-1 grid grid-cols-3 justify-between"
        name={attribute.id}
        options={attribute.options.map((option) => ({
          value: option.id,
          label: option.label,
        }))}
        value={value}
        onChange={(selectedOption: string) => {
          onChange(selectedOption);
        }}
      />
    </Box>
  );
};
