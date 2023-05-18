// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck

import React, { Fragment, useCallback, useEffect, useState } from "react";
import {
  Breadcrumb,
  Col,
  Row,
  Card,
  Form,
  Input,
  Switch,
  Button,
  Divider,
  Space,
  Table,
  Select,
  SelectProps,
  message,
} from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm, Controller, useWatch } from "react-hook-form";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { columns, data } from "./columns";
import { default as ProductCreateBasic } from "./ProductCreate";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { createAxiosClient } from "src/helper/axiosInstance";
import {
  createProduct,
  createProductOption,
  createProductVariantOption,
} from "src/features/catalog/product/actions";
import ProductAssetCreate from "./ProductAssetCreate";
import { ErrorValidateResponse } from "src/types";
import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import ProductOptionsCreate from "./ProductOptionsCreate";
import ProductDetail from "./ProductDetail";
import { useSelector } from "react-redux";
import { set, size } from "lodash";
import { color } from "framer-motion";

const ITEMS = [
  {
    id: "1",
    title: "Example list item",
  },
  {
    id: "2",
    title: "Example list item",
  },
  {
    id: "3",
    title: "Example list item",
  },
  {
    id: "4",
    title: "Example list item",
  },
  {
    id: "5",
    title: "Example list item",
  },
];

const defaultValues = {
  name: "",
  slug: "",
  description: "",
  active: true,
};

const options: SelectProps["options"] = [];
const ProductCreate: React.FC = () => {
  // ** State
  const [isSubmited, setIsSubmited] = useState<boolean>(false);
  const [formIsSubmited, setFormIsSubmited] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(true);
  const [variantItem, setVariantItem] = useState<number[]>([]);
  const [productOptions, setProductOptions] = useState<number[]>([]);
  const [createProductStatus, setCreateProductStatus] = useState<any>(false);
  const [createProductOptionStatus, setCreateProductOptionStatus] =
    useState<any>(true);
  // const [createProductVariantStatus, setCreateProductVariantStatus] =
  //   useState<any>(false);

  // ** Third party
  const navigate = useNavigate();
  let { id } = useParams();
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    register,
    trigger,
    getValues,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });

  // ** Variables
  const store = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();
  const axiosClient = createAxiosClient();

  // Effect
  useEffect(() => {
    // ** Create product
    if (
      !store.createProduct.loading &&
      isSubmited &&
      !store.createProduct.error &&
      store.createProduct.result
    ) {
      setIsSubmited(false);
      navigate("catalog/products");
      message.success("Create product successfully!");
    }
    // ** Check product is have error
    if (
      !store.createProduct.loading &&
      store.createProduct.error &&
      store.createProduct.result
    ) {
      const error = { ...store.createProduct.result };
      setError(error.fieldError, { message: error.message });
    }
  }, [store.createProduct.loading, isSubmited, store.createProduct.error]);

  // console.log("getValues", getValues("option"));
  // const out = getValues("option")?.reduce((a, v) => {
  //   if(a[v.name]) {
  //     a[v.name].value = [a[v.name].value, v.value]
  //   } else {
  //     a[v.name] = v
  //   }
  //   return a
  // }, {})
  // out && console.log(Object?.values(out))

  // useEffect(() => {
  //   setProductOptions(getValues("option"))
  // }, [getValues])

  // useEffect(() => {
  //   const a = getValues("option").filter((item) => item.name === "Color");
  //   const b = getValues("option").filter((item) => item.name === "Size");

  //   const colorOption = {
  //     name: "Color",
  //     value: a.map((item) => item.value),
  //   };
  //   const sizeOption = {
  //     name: "Size",
  //     value: b.map((item) => item.value),
  //   };

  //   const options = [colorOption, sizeOption];
  //   console.log("object, formIsSubmited", formIsSubmited);
  //   formIsSubmited && createProductOptionStatus && createProductOption({
  //     axiosClient,
  //     dispatch,
  //     options: options,
  //   });

  //   setCreateProductOptionStatus(false);
  // }, [ formIsSubmited, setFormIsSubmited]);

  // ** Function handle
  const onSubmit = async (data) => {
    setFormIsSubmited(true);
    await createProduct({
      axiosClient,
      dispatch,
      product: {
        name: data.name,
        description: data.description,
        slug: data.slug,
        active: 1,
      },
    });

    const a = data?.option.filter((item) => item.name === "Color");
    const b = data?.option.filter((item) => item.name === "Size");

    const colorOption = {
      name: "Color",
      value: a.map((item) => item.value),
    };
    const sizeOption = {
      name: "Size",
      value: b.map((item) => item.value),
    };

    const options = [colorOption, sizeOption];

    setProductOptions(options);

    createProductOption({
      axiosClient,
      dispatch,
      options: options,
    });

    // getValues.map((item, index) => {
    //   setValue(`variant[${index}].price`, item.price);
    //   setValue(`variant[${index}].stock`, item.stock);
    //   setValue(`variant[${index}].sku`, item.sku);
    // });
    // console.log("");
    // setCreateProductStatus(true);
  };

  //  let variant = [];
  // if (variantItems.size || variantItems.color) {
  //   const sizeLength = variantItems.size.value.length;
  //   const colorLength = variantItems.color.value.length;
  //   const total = sizeLength * colorLength;
  //   total > 0
  //     ? new Array(total).fill(total).map((_, index) => variant.push(index))
  //     : (variant = []);
  //   variant.length > 0 && setVariantItem(variant);
  //   }

  useEffect(() => {
    if (!store.createProduct.loading && store.createProduct.result) {
      const { id } = store.createProduct.result;
      let abc = [];
      if (
        !store.createProductOption.loading &&
        store.createProductOption.result
      ) {
        const colorValue = store.createProductOption.result?.filter(
          (item) => item.name === "Color",
        );
        const sizeValue = store.createProductOption.result?.filter(
          (item) => item.name === "Size",
        );
        colorValue.map((item) => {
          const a = sizeValue.map((size) => {
            return {
              variantCode: `${item.value}-${size.value}`,
              id: [item.id, size.id],
              productId: id,
            };
          });
          abc.push(...a);
        });
      }

      const variantsColumn = abc.map((item) => {
        return {
          variantCode: item.variantCode,
        };
      });
      console.log(
        "🚀 ~ file: index.tsx:256 ~ variantsColumn ~ variantsColumn:",
        variantsColumn,
      );

      variantsColumn && setVariantItem(variantsColumn);

      if (id && abc.length > 0 && formIsSubmited) {
        console.log("getValue", getValues())
        const abcd = abc.map((item, index) => {
          return {
            sku: getValues("sku")[index],
            name: item.variantCode,
            // price: item.price,
            // stock: item.stock,
            option_ids: item.id,
            product_id: item.productId,
          };
        });
        console.log("🚀 ~ file: index.tsx:248 ~ useEffect ~ id:", abcd);
        abcd.length > 0 &&
          abcd.map((item, index) => {
            setValue(`variant[${index}]`, item.name);
          });
        abcd.length > 0 &&
          createProductVariantOption({
            axiosClient,
            dispatch,
            variants: abcd,
          });

          console.log(getValues());
      }
    }
    // let variant = [];
    // if (variantItems.size || variantItems.color) {
    //   const sizeLength = variantItems.size.value.length;
    //   const colorLength = variantItems.color.value.length;
    //   const total = sizeLength * colorLength;
    //   total > 0
    //     ? new Array(total).fill(total).map((_, index) => variant.push(index))
    //     : (variant = []);
    //   variant.length > 0 && setVariantItem(variant);
    // }

    // abc.length > 0 &&
    //   abc.map((item, index) => {
    //     setValue(`variant[${index}]`, item);
    //   });
    // // setCreateProductVariantStatus(true);

    // console.log("🚀 ~ file: index.tsx:176 ~ onSubmit ~ abc", abc);
    // console.log("🚀 ~ file: index.tsx:176 ~ onSubmit ~ abc", getValues());
  }, [
    store.createProduct.loading,
    store.createProduct.result,
    productOptions,
    setProductOptions,
    store.createProductOption.result,
    store.createProductOption.loading,
    formIsSubmited,
    setFormIsSubmited
  ]);

  // useEffect(() => {
  //   // const createProductOption = async () => {
  //   //   const data = await createProductOption({
  //   //     axiosClient,
  //   //     dispatch,
  //   //     options: variantItems,
  //   //   });
  //   //   return data;
  //   // };

  //   if (productStore.createProduct.result) {
  //     const { id } = productStore.createProduct.result;
  //     if (id && variantItems.length > 0 && createProductStatus) {
  //       createProductOptionStatus === false &&
  //         createProductOption({
  //           axiosClient,
  //           dispatch,
  //           options: variantItems,
  //         });
  //       setCreateProductOptionStatus(true);
  //     }
  //     if (
  //       (id && createProductOptionStatus) ||
  //       productStore.createProductOption?.result?.length > 0
  //     ) {
  //       const colorValue = productStore.createProductOption.result.filter(
  //         (item) => item.name === "Color",
  //       );
  //       const sizeValue = productStore.createProductOption.result.filter(
  //         (item) => item.name === "Size",
  //       );
  //       let abc = [];
  //       colorValue.map((item) => {
  //         const a = sizeValue.map((size) => {
  //           return {
  //             variantCode: `${item.value}-${size.value}`,
  //             id: `${item.id}-${size.id}`,
  //           };
  //         });
  //         abc.push(...a);
  //       });
  //       abc.length > 0 && setVariantItem(abc);
  //       abc.length > 0 &&
  //         abc.map((item, index) => {
  //           setValue(`variant[${index}]`, item);
  //         });
  //       setCreateProductVariantStatus(true);
  //     }
  //     if (id && createProductVariantStatus) {
  //       setCreateProductVariantStatus(false);

  //       // .map((item, index) => {
  //       //   setValue(`variant[${index}].price`, item.price)
  //       //   setValue(`variant[${index}].stock`, item.stock)
  //       //   setValue(`variant[${index}].sku`, item.sku)
  //       // })
  //       getValues("price").map((item, index) => {
  //         setValue(`variant[${index}].price`, item);
  //         // setValue(`variant[${index}].productId`, id);
  //       });
  //       getValues("stock").map((item, index) => {
  //         setValue(`variant[${index}].stock`, item);
  //       });
  //       getValues("sku").map((item, index) => {
  //         setValue(`variant[${index}].sku`, item);
  //       });

  //       console.log(
  //         "🚀 ~ file: index.tsx:203 ~ useEffect asdfasdfasdf~ data",
  //         getValues(),
  //       );
  //       getValues("variant");
  //       const abc = getValues("variant").map((item) => {
  //         const convertId = item.id.split("-").map((item) => Number(item));
  //         return {
  //           sku: item.sku,
  //           name: item.variantCode,
  //           // price: item.price,
  //           // stock: item.stock,
  //           option_ids: convertId,
  //           product_id: id,
  //         };
  //       });
  //       //  abc.sku &&  createProductVariantOption({
  //       //   axiosClient,
  //       //   dispatch,
  //       //   abc,
  //       // })
  //       console.log("abcasdcasdc", abc);
  //       console.log(
  //         "🚀 ~ file: index.tsx:248 ~ useEffect ~ id:",
  //         getValues("variant"),
  //       );
  //       // const convertId = id.split("-").map(item => Number(item))

  //       abc.length > 0 &&
  //         createProductVariantOption({
  //           axiosClient,
  //           dispatch,
  //           variant: abc,
  //         });
  //       // console.log("basdbva", convertId)
  //       // createProductVariantStatus && createProductVariantOption({
  //       //   axiosClient,
  //       //   dispatch,
  //       //   variant: variantItems,
  //       // })
  //     }
  //   }
  // }, [
  //   productStore,
  //   createProductStatus,
  //   setCreateProductStatus,
  //   createProductOptionStatus,
  //   setCreateProductOptionStatus,
  // ]);

  return (
    <Fragment>
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/products">Products</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Create</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={24}>
          <Card>
            <Form onFinish={handleSubmit(onSubmit)} autoComplete="off">
              <Flex justifyContent="space-between" alignItems="center">
                <Flex justifyContent="center" alignItems="center">
                  <Switch
                    checked={enabled}
                    size="small"
                    onChange={() => setEnabled(!enabled)}
                  />
                  <Box as="span" ml={2} fontWeight="semibold">
                    Enabled
                  </Box>
                </Flex>
                <Button type="primary" htmlType="submit">
                  {!id ? "Create" : "Update"}
                </Button>
              </Flex>
              <Divider />
              {!id ? (
                <Fragment>
                  <Row gutter={[24, 0]}>
                    <Col span={14}>
                      <ProductCreateBasic
                        control={control}
                        errors={errors}
                        setValue={setValue}
                      />
                      <ProductOptionsCreate
                        control={control}
                        register={register}
                        setProductOptions={setProductOptions}
                        setValue={setValue}
                      />
                    </Col>
                    <Col span={10}>
                      <ProductAssetCreate />
                    </Col>
                  </Row>
                  {/* <Row>
                    <Col span={24}>
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="root">
                        {(provided) => {
                          return (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {items.map((item, index) => (
                                <ListItem
                                  key={item.id}
                                  id={item.id}
                                  index={index}
                                  title={item.title}
                                />
                              ))}
                              {provided.placeholder}
                            </div>
                          );
                        }}
                      </Droppable>
                    </DragDropContext>
                    </Col>
                  </Row> */}
                  <div>
                    <Table
                      bordered
                      columns={columns()}
                      dataSource={data({
                        control,
                        errors,
                        variantItem,
                        register,
                      })}
                      pagination={{ hideOnSinglePage: true }}
                    />
                  </div>
                </Fragment>
              ) : (
                <ProductDetail />
              )}
            </Form>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

const Placeholder = ({ height = "auto" }) => {
  return (
    <div
      style={{
        background: "var(--p-color-text-info)",
        padding: "14px var(--p-space-2)",
        height: height,
      }}
    />
  );
};

export default ProductCreate;
