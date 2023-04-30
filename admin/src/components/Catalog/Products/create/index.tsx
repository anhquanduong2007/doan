import React, { Fragment, useState } from 'react';
import { Breadcrumb, Col, Row, Card, Form, Input, Switch, Button, Divider, Space, Table, Select, SelectProps } from 'antd';
import { Link } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { columns, data } from './columns';

const options: SelectProps['options'] = [];

const ProductCreate: React.FC = () => {
    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            slug: '',
            description: '',
            enabled: true
        }
    });

    const [enabled, setEnabled] = useState(true);

    const onSubmit = data => console.log(data);

    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    return (
        <Fragment>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to='/'>Home</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to='/products'>Products</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Create</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col span={24}>
                    <Card>
                        <Form onFinish={handleSubmit(onSubmit)} autoComplete="off">
                            <div className='flex justify-between items-center'>
                                <div className='flex justify-center items-center'>
                                    <Switch checked={enabled} size='small' onChange={() => setEnabled(!enabled)} />
                                    <span className='ml-2 font-semibold'>Enabled</span>
                                </div>
                                <Button type="primary" htmlType="submit">Create</Button>
                            </div>
                            <Divider />
                            <Row gutter={[24, 0]}>
                                <Col span={14}>
                                    <div className='mb-3'>
                                        <label htmlFor='name' className='font-semibold'>Product name <span className="text-red-500 font-light">*</span></label>
                                        <Controller
                                            name="name"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field: { value, ...other } }) => {
                                                return (
                                                    <Fragment>
                                                        <Input
                                                            status={errors?.name ? 'error' : ''}
                                                            className='!my-1'
                                                            id='name'
                                                            placeholder='Eg: Bags'
                                                            {...other}
                                                            value={value || ''}
                                                        />
                                                        {errors?.name ? <span className="text-red-500">{errors.name?.type === 'required' ? "Product name is required!" : errors.name.message}</span> : null}
                                                    </Fragment>
                                                )
                                            }}
                                        />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='slug' className='font-semibold'>Slug <span className="text-red-500 font-light">*</span></label>
                                        <Controller
                                            name="slug"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field: { value, ...other } }) => {
                                                return (
                                                    <Fragment>
                                                        <Input
                                                            className='!my-1'
                                                            id='slug'
                                                            status={errors?.slug ? 'error' : ''}
                                                            placeholder='Eg: bags'
                                                            {...other}
                                                            value={value || ''}
                                                        />
                                                        {errors?.slug ? <span className="text-red-500">{errors.slug?.type === 'required' ? "Slug is required!" : errors.slug.message}</span> : null}
                                                    </Fragment>
                                                )
                                            }}
                                        />
                                    </div>
                                    <div className='mb-3'>
                                        <span className='inline-block font-semibold mb-1'>Description</span>
                                        <Controller
                                            name="description"
                                            control={control}
                                            render={({ field: { value, ...other } }) => {
                                                return (
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={value || ''}
                                                        onChange={(event, editor) => {
                                                            const data = editor.getData();
                                                            setValue('description', data)
                                                        }}
                                                    />
                                                )
                                            }}
                                        />
                                    </div>
                                    <div className='mb-3'>
                                        <span className='inline-block font-semibold mb-1'>Options</span>
                                        <Form.List name="users">
                                            {(fields, { add, remove }) => (
                                                <Fragment>
                                                    {fields.map(({ key, name, ...restField }) => (
                                                        <div key={key} className='flex w-full'>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'first']}
                                                                rules={[{ required: true, message: 'Missing first name' }]}
                                                            >
                                                                <Input placeholder="First Name" />
                                                            </Form.Item>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'last']}
                                                                rules={[{ required: true, message: 'Missing last name' }]}
                                                            >
                                                                <Select
                                                                    mode="tags"
                                                                    style={{ width: '300px' }}
                                                                    placeholder="Tags Mode"
                                                                    onChange={handleChange}
                                                                    options={options}
                                                                    
                                                                />
                                                            </Form.Item>
                                                            <Form.Item>
                                                                <MinusCircleOutlined onClick={() => remove(name)} />
                                                            </Form.Item>
                                                        </div>
                                                    ))}
                                                    <Form.Item>
                                                        <Button className="!flex items-center justify-center" type="dashed" onClick={() => add()} icon={<PlusCircleOutlined />}>Add option</Button>
                                                    </Form.Item>
                                                </Fragment>
                                            )}
                                        </Form.List>
                                    </div>
                                </Col>
                                <Col span={10}>
                                    assets here!
                                </Col>
                            </Row>
                            <div>
                                <Table columns={columns()} dataSource={data({ control, errors })} pagination={{ hideOnSinglePage: true }} />
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

export default ProductCreate;