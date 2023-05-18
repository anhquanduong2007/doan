import { Input } from 'antd';
import React, { Fragment } from 'react';
import { Control, Controller, FieldErrors, UseFormSetValue, useFieldArray } from 'react-hook-form';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormValues } from '.';
import { Box } from '@chakra-ui/react';

interface ProductCreateProps {
    control: Control<FormValues>
    errors: FieldErrors<FormValues>
    setValue: UseFormSetValue<FormValues>
}
const ProductCreate = ({ control, errors, setValue }: ProductCreateProps) => {
    return (
        <Fragment>
            <Box mb={3}>
                <Box as="label" htmlFor='name' fontWeight="semibold">Product name <Box as="span" textColor="red.500" fontWeight="light">*</Box></Box>
                <Controller
                    name="name"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, ...other } }) => {
                        return (
                            <Box my={1}>
                                <Input
                                    status={errors?.name ? 'error' : ''}
                                    id='name'
                                    placeholder='Eg: Bags'
                                    {...other}
                                    value={value || ''}
                                />
                                {errors?.name ? <Box as="span" textColor="red.500">{errors.name?.type === 'required' ? "Product name is required!" : errors.name.message}</Box> : null}
                            </Box>
                        )
                    }}
                />
            </Box>
            <Box mb={3}>
                <Box as="label" htmlFor='name' fontWeight="semibold">Slug <Box as="span" textColor="red.500" fontWeight="light">*</Box></Box>
                <Controller
                    name="slug"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, ...other } }) => {
                        return (
                            <Box my={1}>
                                <Input
                                    id='slug'
                                    status={errors?.slug ? 'error' : ''}
                                    placeholder='Eg: bags'
                                    {...other}
                                    value={value || ''}
                                />
                                {errors?.slug ? <Box as="span" textColor="red.500">{errors.slug?.type === 'required' ? "Slug is required!" : errors.slug.message}</Box> : null}
                            </Box>
                        )
                    }}
                />
            </Box>
            <Box mb={3}>
                <Box as="span" fontWeight="semibold" mb={1} sx={{ display: "inline-block" }}>Description</Box>
                <Controller
                    name="description"
                    control={control}
                    render={({ field: { value, ...other } }) => {
                        return (
                            <CKEditor
                                editor={ClassicEditor}
                                data={value || ''}
                                onChange={(_event, editor) => {
                                    setValue('description', editor.getData())
                                }}
                            />
                        )
                    }}
                />
            </Box>
        </Fragment>
    );
};

export default ProductCreate;