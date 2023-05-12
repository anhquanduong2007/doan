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
import { useForm, Controller } from "react-hook-form";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { columns, data } from "./columns";
import { default as ProductCreateBasic } from "./ProductCreate";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { createAxiosClient } from "src/helper/axiosInstance";
import { createProduct } from "src/features/catalog/product/actions";
import ProductAssetCreate from "./ProductAssetCreate";
import { ErrorValidateResponse } from "src/types";
import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import ProductOptionsCreate from "./ProductOptionsCreate";
import ProductDetail from "./ProductDetail";
import { HorizontalStack, Text, VerticalStack } from "@shopify/polaris";
import {
  AppProvider,
  Page,
  ResourceItem,
  Icon,
  Thumbnail,
  Tooltip
} from "@shopify/polaris";
import { DragHandleMinor } from "@shopify/polaris-icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
  enabled: true,
};

function ListItem(props) {
  const { id, index, title } = props;

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={
              snapshot.isDragging
                ? { background: "white", ...provided.draggableProps.style }
                : provided.draggableProps.style
            }
          >
            <ResourceItem id={id} url="https://github.com/qw-in">
              <HorizontalStack  algin="center" blockAlign="center">
                <div {...provided.dragHandleProps}>
                  <Tooltip content="Drag to reorder list items">
                    <Icon source={DragHandleMinor} color="inkLightest" />
                  </Tooltip>
                </div>
                <Thumbnail
                  source={`https://picsum.photos/id/${100 + id}/60/60`}
                  alt={""}
                />
                <Text variant="headingMd" as="h2">{title}</Text>
              </HorizontalStack >
            </ResourceItem>
          </div>
        );
      }}
    </Draggable>
  );
}

const options: SelectProps["options"] = [];
const ProductCreate: React.FC = () => {
  // ** State
  const [isSubmited, setIsSubmited] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(true);
  const [variantItem, setVariantItem] = useState<number[]>([]);
  const [variantItems, setVariantItems] = useState<number[]>([]);
  const [items, setItems] = useState(ITEMS);

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

  // ** Function handle
  const onSubmit = async (data) => {
    console.log("🚀 ~ file: index.tsx:165 ~ onSubmit ~ data:", data)
    // await createProduct({
    //     axiosClient,
    //     dispatch,
    //     product: {
    //         name: data.name,
    //         description: data.description,
    //         slug: data.slug,
    //         enabled: data.enabled
    //     }
    // })
    const { description, enabled, name, slug, ...options } = data;
    const optColor = [];
    const optSize = [];
    const optMaterial = [];
    const optStyle = [];
    Object.keys(options).forEach((option) => {
      if (option.includes("optionName") && options[option] === "color") {
        optColor.push(options[`optionValue-${option.slice(-1)}`]);
      } else if (option.includes("optionName") && options[option] === "size") {
        optSize.push(options[`optionValue-${option.slice(-1)}`]);
      } else if (
        option.includes("optionName") &&
        options[option] === "material"
      ) {
        optMaterial.push(options[`optionValue-${option.slice(-1)}`]);
      } else {
        optStyle.push(options[`optionValue-${option.slice(-1)}`]);
      }
    });
    const color = {
      name: "color",
      value: [...optColor],
    };
    const size = {
      name: "size",
      value: [...optSize],
    };
    
  };

  const handleDragEnd = useCallback(({ source, destination }) => {
    setItems(oldItems => {
      const newItems = oldItems.slice(); // Duplicate
      const [temp] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, temp);
      return newItems;
    });
  }, []);

  // useEffect(() => {
  //   watch((data) => {
  //     const { description, enabled, name, slug, ...options } = data;
  //     const optColor = [];
  //     const optSize = [];
  //     const optMaterial = [];
  //     const optStyle = [];
  
  //     Object.keys(options).forEach((option) => {
  //       if (option.includes("optionName") && options[option] === "color") {
  //         optColor.push(options[`optionValue-${option.slice(-1)}`]);
  //       } else if (option.includes("optionName") && options[option] === "size") {
  //         optSize.push(options[`optionValue-${option.slice(-1)}`]);
  //       } else if (
  //         option.includes("optionName") &&
  //         options[option] === "material"
  //       ) {
  //         optMaterial.push(options[`optionValue-${option.slice(-1)}`]);
  //       } else {
  //         optStyle.push(options[`optionValue-${option.slice(-1)}`]);
  //       }
  //     });
  //     const color = {
  //       name: "color",
  //       value: [...optColor],
  //     };
  //     const size = {
  //       name: "size",
  //       value: [...optSize],
  //     };
  //     setVariantItems({
  //       size: size,
  //       color: color,
  //     })
  //   })
  // }, [watch]);

  // useEffect(() => {
  //   let variant = []
    
  //   console.log("variantItems", variantItems)
  //   if(variantItems.size || variantItems.color) {
  //     const sizeLength = variantItems.size.value.length;
  //     const colorLength = variantItems.color.value.length;
  //     const total = sizeLength * colorLength;
  //     console.log("🚀 ~ file: index.tsx:262 ~ useEffect ~ total:", total)
  //     total > 0 ? new Array(total).fill(total).map((_, index) => variant.push(index)) : variant = [];
  //     console.log("total", total)
  //     variant.length > 0 && setVariantItem(variant);
  //     console.log(variant)
  //     console.log(variantItem)
  //   }
  // }, [setVariantItems, variantItems])

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
                      <ProductCreateBasic control={control} errors={errors} setValue={setValue} />
                      <ProductOptionsCreate control={control}  register={register} trigger={trigger} getValues={getValues} />
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
                      dataSource={data({ control, errors, variantItem })}
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
