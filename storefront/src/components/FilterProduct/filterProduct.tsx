import { Checkbox, CheckboxGroup, Collapse, Stack, useDisclosure } from '@chakra-ui/react'
import React from 'react'

import { Box, ChevronDown } from 'react-feather'

const FilterProduct = () => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <div>
      <div className='uppercase font-bold'>
        Filters
      </div>
      <div>
        <div className='flex flex-row justify-between mt-3 mb-3'>
          <p>Categories</p>
          <ChevronDown size={24} onClick={onToggle} className={`cursor-pointer`} />
        </div>
        <Collapse in={isOpen} animateOpacity>
          <div className=''>
            <CheckboxGroup >
              <Stack spacing={[1, 2]} direction={['column', 'column']}>
                <Checkbox value='women'>women</Checkbox>
                <Checkbox value='man'>man</Checkbox>
                <Checkbox value='bloms'>bloms</Checkbox>
              </Stack>
            </CheckboxGroup>
          </div>
        </Collapse>
      </div>
    </div>
  )
}

export default FilterProduct