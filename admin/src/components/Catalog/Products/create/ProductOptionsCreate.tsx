// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck

import { Box, Flex } from '@chakra-ui/react';
import React, { Fragment } from 'react';
import { Form, Input, Select } from 'antd';
import {
    PlusOutlined,
    MinusCircleOutlined
} from '@ant-design/icons';
import Button from 'antd-button-color';
import { Controller } from 'react-hook-form';

const ProductOptionsCreate = ({ control }) => {
    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    };
    return (
        <Fragment>
            <Box mb={3}>
                <Box as="span" fontWeight="semibold" mb={1} sx={{ display: "inline-block" }}>Options</Box>
                <Form.List name="options">
                    {(fields, { add, remove }) => (
                        <Box>
                            {fields.map((field) => {
                                return (
                                    <Flex key={field.key} alignItems="center" gap={2} justifyContent="flex-start" mb={2}>
                                        <Box>
                                            <Controller
                                                name={`optionName-${field.name}`}
                                                control={control}
                                                render={({ field: { value, ...other } }) => {
                                                    return (
                                                        <Box>
                                                            <Select
                                                                style={{ width: 120 }}
                                                                value={value}
                                                                {...other}
                                                            >
                                                                <Select.Option value='size'>Size</Select.Option>
                                                                <Select.Option value='color'>Color</Select.Option>
                                                                <Select.Option value='material'>Material</Select.Option>
                                                                <Select.Option value='style'>Style</Select.Option>
                                                            </Select>
                                                        </Box>
                                                    )
                                                }}
                                            />
                                        </Box>
                                        <Box>
                                            <Controller
                                                name={`optionValue-${field.name}`}
                                                control={control}
                                                render={({ field: { value, ...other } }) => {
                                                    return (
                                                        <Box>
                                                            <Input
                                                                {...other}
                                                                value={value || ''}
                                                            />
                                                        </Box>
                                                    )
                                                }}
                                            />
                                        </Box>
                                        <Box>
                                            <MinusCircleOutlined onClick={() => remove(field.name)} />
                                        </Box>
                                    </Flex>
                                )
                            })}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add option</Button>
                            </Form.Item>
                        </Box>
                    )}
                </Form.List>
            </Box>
        </Fragment>
    );
};

export default ProductOptionsCreate;