// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck

import { Box, Flex } from "@chakra-ui/react";
import React, { Fragment, useEffect } from "react";
import { Form, Input, Select } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import Button from "antd-button-color";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { getValueByName } from "src/hooks/catalog";

const ProductOptionsCreate = ({ control, register, setVariantItem, setValue }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "option",
  });
  //watch change option
  const watchOption = useWatch({name: "option", control});

  useEffect(() => {
    //create input to clien type sku,price, stock, auto fill variant
     if(watchOption?.length > 0) {
      const  colorOption= getValueByName(watchOption, "Color")?.value
      const  sizeOption= getValueByName(watchOption, "Size")?.value
      const variantArr = []
    
      colorOption?.map((color) => {
        const sizeMap = sizeOption?.map((size) => {
          const variantCode = `${color}-${size}`
          return {
            variantCode: variantCode,
          }
        })
        sizeMap && variantArr.push(...sizeMap);
      })
      
      if(variantArr?.length > 0) {
        setVariantItem(variantArr)
        variantArr.forEach((item, index) => {
          setValue(`variant[${index}].name`, item.variantCode);
          setValue(`price[${index}]`, 0);
          setValue(`stock[${index}]`, 0);
        })
      }
     }
  }, [watchOption])

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
                          {/* <Select.Option value="Material">Material</Select.Option>
                          <Select.Option value="Style">Style</Select.Option> */}
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
