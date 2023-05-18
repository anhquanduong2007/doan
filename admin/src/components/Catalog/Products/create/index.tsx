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
        }
      }
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
}
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




