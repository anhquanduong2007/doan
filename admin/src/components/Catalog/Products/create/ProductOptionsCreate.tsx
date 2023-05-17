// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck

import { Box, Flex } from "@chakra-ui/react";
import React, { Fragment, useEffect } from "react";
import { Form, Input, Select } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import Button from "antd-button-color";
import { Controller, useFieldArray, useWatch } from "react-hook-form";

const ProductOptionsCreate = ({ control, register, setVariantItems }) => {
  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "option",
  });

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const optionsHook = useWatch({ name: "option", control });

  useEffect(() => {
    console.log("optionsHook", optionsHook)
    const a = optionsHook.filter((option) => option.optionName == "Size")
    const b = optionsHook.filter((option) => option.optionName == "Color")
    const c = a.map((option) => option.optionValue)
    const d = b.map((option) => option.optionValue)
 
   const color = {
      name: "Color",
      value: optionsHook ? d : [],
    };
    const size = {
      name: "Size",
      value: optionsHook ? c : []
    };
    const variant = [color, size]
  //   console.log("variant", variant)
    setVariantItems(variant);
  }, [optionsHook]);
  return (
    <Fragment>
      <Box mb={3}>
        <Box
          as="span"
          fontWeight="semibold"
          mb={1}
          sx={{ display: "inline-block" }}
        >
          Options
        </Box>
        {fields.map((field, index) => {
          return (
            <Flex
              key={index}
              alignItems="center"
              gap={2}
              justifyContent="flex-start"
              mb={2}
            >
              <Box>
                <Controller
                  name={`option[${index}].optionName`}
                  {...register(`option[${index}].optionName`)}
                  control={control}
                  render={({ field: { value, ...other } }) => {
                    return (
                      <Box>
                        <Select style={{ width: 120 }} value={value} {...other}>
                          <Select.Option value="size">Size</Select.Option>
                          <Select.Option value="color">Color</Select.Option>
                          <Select.Option value="material">
                            Material
                          </Select.Option>
                          <Select.Option value="style">Style</Select.Option>
                        </Select>
                      </Box>
                    );
                  }}
                />
              </Box>
              <Box>
                <Controller
                  name={`option[${index}].optionValue`}
                  {...register(`option[${index}].optionValue`)}
                  control={control}
                  render={({ field: { value, ...other } }) => {
                    return (
                      <Box>
                        <Input {...other} value={value || ""} />
                      </Box>
                    );
                  }}
                />
              </Box>
              <Box>
                      <MinusCircleOutlined
                        onClick={() => remove(index)}
                      />
                    </Box>
            </Flex>
          );
        })}

        <Button
          onClick={() => {
            append({ optionName: "", optionValue: "" });
          }}
        >
          Add Option
        </Button>
      </Box>
    </Fragment>
  );
};

export default ProductOptionsCreate;
