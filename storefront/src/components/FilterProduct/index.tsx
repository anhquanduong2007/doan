import { Collapse } from '@chakra-ui/react'
import React, { Fragment, useState } from 'react'
import { Checkbox, Slider } from 'antd'
import { Box, ChevronDown } from 'react-feather'
import { createAxiosClient } from 'src/axios/axiosInstance'
import { Cateogry, IAxiosResponse, ProductOption } from 'src/shared/types'
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

interface CategoryList {
    categories: Cateogry[]
    totalPage: number
    total: number
    skip: number
    take: number
}

interface FilterProductProps {
    setFilterCategories: (filterCategories: number[]) => void
    setPrice: (price: number) => void
    price: number
}
const FilterProduct = ({ setFilterCategories, setPrice, price }: FilterProductProps) => {
    // ** State
    const [categories, setCategories] = React.useState<CategoryList>()
    const [take, setTake] = useState<number>(12)
    const [skip, setSkip] = useState<number>(0)
    const [cateCb, setCateCb] = useState<boolean>(false)

    // ** Variables
    const axiosClient = createAxiosClient();

    // ** Effect
    React.useEffect(() => {
        axiosClient.get(`category`, {
            params: {
                skip,
                take,
            }
        }).then((res) => {
            const result = { ...res } as unknown as IAxiosResponse<Cateogry[]>
            setCategories(result.response.data as unknown as CategoryList)
        })
    }, [skip, take])

    const optionsCategoriesToRender = () => {
        if (categories) {
            const cates = categories.categories.map((category) => {
                return {
                    label: category.category_name,
                    value: category.id
                }
            })
            const nested = categories.categories.filter((cate) => {
                if (cate.other_category.length) {
                    return cate.other_category
                }
            })
            let cateNested: Cateogry[] = []
            nested.forEach((nt) => {
                cateNested = [...cateNested, ...nt.other_category]
            })
            const nt = cateNested.map((ha) => {
                return {
                    label: ha.category_name,
                    value: ha.id
                }
            })

            return cates.concat(nt)

        }
        return []
    }

    const onChange = (checkedValues: CheckboxValueType[]) => {
        setFilterCategories([...checkedValues] as number[])
    };

    const onChangePrice = (price: number) => {
        setPrice(price)
    }


    return (
        <Fragment>
            <div className='uppercase font-bold'>Filters</div>
            <div>
                <div className='flex flex-row justify-between mt-3 mb-3'>
                    <p className='font-semibold'>Categories</p>
                    <ChevronDown size={24} onClick={() => setCateCb(!cateCb)} className={`cursor-pointer`} />
                </div>
                <Collapse in={cateCb} animateOpacity>
                    <Checkbox.Group options={optionsCategoriesToRender()} onChange={onChange} />
                </Collapse>
            </div>
            <div>
                <div className='flex flex-row justify-between mt-3 mb-3'>
                    <p className='font-semibold'>Price</p>
                </div>
                <Slider value={price} onChange={onChangePrice} min={0} max={1000} />
            </div>
        </Fragment>
    )
}

export default FilterProduct