import React, { Fragment, useEffect, useState } from "react";
import {
  Breadcrumb,
  Col,
  Row,
  Card,
  Form,
  Switch,
  Button,
  Divider,
  Table,
  SelectProps,
  message,
} from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { columns, data } from "./columns";
import { default as ProductCreateBasic } from "./ProductCreate";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { createAxiosClient } from "src/helper/axiosInstance";
import {
  createProduct,
  createProductOption,
  createProductVariantOption,
} from "src/features/catalog/product/actions";
import { Box, Flex } from "@chakra-ui/react";
import ProductOptionsCreate from "./ProductOptionsCreate";
import { getValueByName, removeEmpty } from "src/hooks/catalog";
import SelectImage from "../SelectImage";
import { Asset } from "src/types";

const options: SelectProps["options"] = [];

const ProductCreate: React.FC = () => {
  const [isSubmited, setIsSubmited] = useState<boolean>(false);
  const [isProductOptionSubmited, setIsProductOptionSubmited] =
    useState<boolean>(false);
  const [isProductVariantSubmited, setIsProductVariantSubmited] =
    useState<boolean>(false);
  const [formIsSubmited, setFormIsSubmited] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(true);
  const [variantItem, setVariantItem] = useState<number[]>([]);
  const [productOptions, setProductOptions] = useState<number[]>([]);
  const [featuredAsset, setFeaturedAsset] = useState<Asset>();
  const [isModalAssetOpen, setIsModalAssetOpen] = useState<boolean>(false);
  const [isDisableButton, setIsDisableButton] = useState<boolean>(true);

  const [createProductOptionStatus, setCreateProductOptionStatus] =
    useState<boolean>(false);

  //** Third party
  const navigate = useNavigate();
  let { id } = useParams();
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    register,
    getValues,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      active: 1,
      options: [],
      variant: [],
    },
  });

  //** Variables
  const store = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();
  const axiosClient = createAxiosClient();
  const watchFormVariantValue = useWatch({ name: "variant", control });
  const watchFormSlugValue = useWatch({ name: "slug", control });

  // Effect
  useEffect(() => {
    // ** Create product
    if (
      !store.createProduct.loading &&
      isSubmited &&
      !store.createProduct.error &&
      store.createProduct.result &&
      !store.createProductOption.error &&
      !store.createProductVariant.error
    ) {
      setIsSubmited(false);
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

  useEffect(() => {
    // ** Create product option
    if (
      !store.createProductOption.loading &&
      isProductOptionSubmited &&
      !store.createProductOption.error &&
      store.createProductOption.result
    ) {
      setIsProductOptionSubmited(false);
    }
    // ** Check product option is have error
    if (
      !store.createProductOption.loading &&
      store.createProductOption.error &&
      store.createProductOption.result
    ) {
      const error = { ...store.createProductOption.result };
      setError(error.fieldError, { message: error.message });
    }
  }, [
    store.createProductOption.loading,
    isProductOptionSubmited,
    store.createProductOption.error,
  ]);

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
        featured_asset_id: featuredAsset?.id,
      },
    });

    const colorOption = data.option && getValueByName(data.option, "Color");
    const sizeOption = data.option && getValueByName(data.option, "Size");
    const materialOption =
      data.option && getValueByName(data.option, "Material");
    const styleOption = data.option && getValueByName(data.option, "Style");

    const options = Object.values(
      removeEmpty({ colorOption, sizeOption, materialOption, styleOption }),
    );
    setProductOptions([...options]);
  };

  useEffect(() => {
    //Create Product option {...option, product_id}
    if (
      store.createProduct.result &&
      !store.createProduct.loading &&
      !store.createProduct.error &&
      productOptions &&
      formIsSubmited
    ) {
      const options = productOptions.map((item) => {
        return {
          ...item,
          product_id: store.createProduct.result.id,
        };
      });
      createProductOption({
        axiosClient,
        dispatch,
        options: options,
      });
      setCreateProductOptionStatus(true);
    }
  }, [
    store.createProduct.result,
    store.createProduct.loading,
    setProductOptions,
    productOptions,
    formIsSubmited,
    setFormIsSubmited,
  ]);

  useEffect(() => {
    //Create product variant
    if (
      !store.createProductOption.loading &&
      store.createProductOption.result &&
      !store.createProduct.error &&
      !store.createProductOption.error &&
      formIsSubmited
    ) {
      const colorValue = store.createProductOption.result?.filter(
        (item) => item.name === "Color",
      );
      const sizeValue = store.createProductOption.result?.filter(
        (item) => item.name === "Size",
      );

      let result = [];
      if (colorValue.length > 0 && sizeValue.length > 0) {
        colorValue.map((item) => {
          const all = sizeValue.map((size) => {
            return {
              name: `${item.value}-${size.value}`,
              option_ids: [Number(item.id), Number(size.id)],
              product_id: Number(store.createProduct.result.id),
            };
          });

          result.push(...all);
        });
      } else {
        colorValue.length > 0 &&
          colorValue.map((item) => {
            return result.push({
              name: `${item.value}`,
              option_ids: [Number(item.id)],
              product_id: Number(store.createProduct.result.id),
            });
          });

        sizeValue.length > 0 &&
          sizeValue.map((item) => {
            return result.push({
              name: `${item.value}`,
              option_ids: [Number(item.id)],
              product_id: Number(store.createProduct.result.id),
            });
          });
      }

      const variantOption = result.map((item, index) => {
        return {
          sku: getValues("sku") && getValues("sku")[index],
          name: item.name,
          option_ids: item.option_ids,
          product_id: item.product_id,
        };
      });

      variantOption &&
        formIsSubmited &&
        createProductOptionStatus &&
        createProductVariantOption({
          axiosClient,
          dispatch,
          variants: variantOption,
          navigate,
          message,
          setError
        });
    }
  }, [
    store.createProductOption.loading,
    store.createProductOption.result,
    createProductOptionStatus,
    store.createProduct.error,
    store.createProductOption.error,
    formIsSubmited,
    setFormIsSubmited,
  ]);

  useEffect(() => {
    //check disable button
    if (watchFormSlugValue !== "") {
      if (watchFormVariantValue.length > 0) {
        const result = watchFormVariantValue.reduce(function (
          result,
          currentObject,
        ) {
          for (var key in currentObject) {
            if (currentObject.hasOwnProperty(key)) {
              result[key] = currentObject[key];
            }
          }
          return result;
        },
        {});

        if (
          result.sku !== "" &&
          result.sku !== undefined &&
          result.sku !== null &&
          result.name !== "" &&
          result.name !== undefined &&
          result.name !== null
        ) {
          setIsDisableButton(false);
        } else {
          setIsDisableButton(true);
        }
      }
    } else {
      setIsDisableButton(true);
    }
  }, [watchFormVariantValue, watchFormSlugValue]);

  return (
    <Fragment>
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/catalog/products">Products</Link>
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
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={isDisableButton}
                >
                  {!id ? "Create" : "Update"}
                </Button>
              </Flex>
              <Divider />
              {!id ? (
                <Fragment>
                  <Row gutter={[24, 0]}>
                    <Col span={19}>
                      <ProductCreateBasic
                        control={control}
                        errors={errors}
                        setValue={setValue}
                      />
                      <ProductOptionsCreate
                        control={control}
                        register={register}
                        setProductOptions={setProductOptions}
                        setVariantItem={setVariantItem}
                        setValue={setValue}
                        watch={watch}
                      />
                    </Col>
                    <Col span={5}>
                      <Flex flexDirection={"column"} alignItems={"center"}>
                        <Box
                          border={"1px solid #dbdbdb"}
                          borderRadius={"10px"}
                          w={"100%"}
                        >
                          <img
                            style={{
                              width: "100%",
                              padding: "10px",
                              height: "300px",
                              objectFit: "contain",
                            }}
                            src={
                              featuredAsset
                                ? featuredAsset.url
                                : "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132484366.jpg"
                            }
                          />
                        </Box>
                        <Button
                          onClick={() => setIsModalAssetOpen(true)}
                          style={{ marginTop: "10px" }}
                        >
                          Select image
                        </Button>
                      </Flex>
                    </Col>
                  </Row>
                  <div style={{ marginTop: "1rem" }}>
                    <Table
                      bordered
                      columns={columns()}
                      dataSource={data({
                        control,
                        errors,
                        variantItem,
                        register,
                        setValue,
                        clearErrors
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
      <SelectImage
        isModalAssetOpen={isModalAssetOpen}
        setIsModalAssetOpen={setIsModalAssetOpen}
        setFeaturedAsset={setFeaturedAsset}
        featuredAsset={featuredAsset as Asset}
      />
    </Fragment>
  );
};
export default ProductCreate;
