import { Box, Flex } from "@chakra-ui/react";
import Button from "antd-button-color";
import React, { Fragment, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { columns, data } from "./columns";
import { Table, Select, Input } from "antd";
import { useSelector } from "react-redux";
import { MinusCircleOutlined } from "@ant-design/icons";
import { getValueByName } from "src/hooks/catalog";

function ManageVariant() {
  const [variantItem, setVariantItem] = useState<number[]>([]);

  const { register, control, handleSubmit, reset, watch, setValue, getValues } =
    useForm({
      defaultValues: {
        option: [],
      },
    });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "option",
  });

  const store = useSelector((state: any) => state.product.single);

  useEffect(() => {
    let productOptions = [] as Object[];
    if (store.result && !store.loading) {
      // const variantArr =
      //   store.result.product_variants &&
      //   store.result.product_variants.length > 0 &&
      //   store.result.product_variants.map((item: any, index: any) => {
      //     setValue(`variant[${index}]`, item.name);
      //     setValue(`sku[${index}]`, item.sku);
      //     setValue(`originPrice[${index}]`, item.origin_price);
      //     setValue(`price[${index}]`, item.price);
      //     setValue(`stock[${index}]`, item.stock);
      //     return item.name
      //   });

      //   setVariantItem(variantArr)

      store.result.product_variants.map((item: any) => {
        item.product_options.map((item: any) => {
          productOptions.push({
            name: item.product_option.name,
            value: item.product_option.value,
          });
        });
      });
      // setVariantItem(variantArr)
    }
    // console.log([...new Set(productOptions)])
    //Remove duplicate
    // const result = productOptions.filter((obj, index) => {
    //   return (
    //     index ===
    //     productOptions.findIndex(
    //       (o) => obj.name === o.name && obj.value === o.value,
    //     )
    //   );
    // });
    // result.length > 0 && setValue("option", result);
  }, [store.result, store.loading]);

  const watchOption = useWatch({ name: "option", control });

  useEffect(() => {
      //create input to clien type sku,price, stock, auto fill variant
      if (watchOption?.length > 0) {
          const colorOption = getValueByName(watchOption, "Color")?.value
          const sizeOption = getValueByName(watchOption, "Size")?.value
          const variantArr = []

          if (colorOption && sizeOption) {
              colorOption?.map((color) => {
                  const sizeMap = sizeOption?.map((size) => {
                      const variantCode = `${color}-${size}`
                      return {
                          variantCode: variantCode,
                      }
                  })
                  sizeMap && variantArr.push(...sizeMap);
              })
          } else {
              colorOption && colorOption?.map((color) => {
                  const variantCode = `${color}`
                  return variantArr.push({
                      variantCode: variantCode,
                  })
              })
              sizeOption && sizeOption?.map((color) => {
                  const variantCode = `${color}`
                  return variantArr.push({
                      variantCode: variantCode,
                  })
              })
          }

          if (variantArr?.length > 0) {
                // const rs = variantArr.filter(val => !variantItem.includes(val));
                console.log(variantArr)
              setVariantItem(variantArr)
              variantArr.forEach((item, index) => {
                  setValue(`variant[${index}]`, item.variantCode);
                  setValue(`price[${index}]`, 0);
                  setValue(`stock[${index}]`, 0);
              })
          }
      } else {
          setVariantItem([])
      }
  }, [watchOption])


  return (
    <Fragment>
      <Flex mb={3} flexDirection={"column"}>
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
      </Flex>
      <div style={{ marginTop: "1rem" }}>
        <Table
          bordered
          columns={columns()}
          dataSource={data({
            control,
            variantItem,
            register,
          })}
          pagination={{ hideOnSinglePage: true }}
        />
      </div>
    </Fragment>
  );
}

export default ManageVariant;
