// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck

import { Box, Flex } from "@chakra-ui/react";
import React, { Fragment, useEffect } from "react";
import { Form, Input, Select } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import Button from "antd-button-color";
import { Controller, useFieldArray, useWatch } from "react-hook-form";

const ProductOptionsCreate = ({ control, register, setValue, setProductOptions }) => {
  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "option",
  });

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  const optionArray = useWatch({ name: "option", control })



  // useEffect(() => {
  //   const out = optionArray?.reduce((a, v) => {
  //     if(a[v.name]) {
  //       a[v.name].value = [a[v.name].value, v.value]
  //     } else {
  //       a[v.name] = v
  //     }
  //     return a
  //   }, {})
  //   out && setProductOptions(Object?.values(out))
  // }, [])
  
  
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
                  name={`option[${index}].name`}
                  {...register(`option[${index}].name`)}
                  control={control}
                  render={({ field: { value, ...other } }) => {
                    return (
                      <Box>
                        <Select style={{ width: 120 }} value={value} {...other}>
                          <Select.Option value="Size">Size</Select.Option>
                          <Select.Option value="Color">Color</Select.Option>
                          <Select.Option value="Material">
                            Material
                          </Select.Option>
                          <Select.Option value="Style">Style</Select.Option>
                        </Select>
                      </Box>
                    );
                  }}
                />
              </Box>
              <Box>
                <Controller
                  name={`option[${index}].value`}
                  {...register(`option[${index}].value`)}
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
                <MinusCircleOutlined onClick={() => remove(index)} />
              </Box>
            </Flex>
          );
        })}

        <Button
          onClick={() => {
            append({ name: "", value: "" });
          }}
        >
          Add Option
        </Button>
      </Box>
    </Fragment>
  );
};

export default ProductOptionsCreate;
