import React from 'react'
import CardProduct from '../CardProduct'
import { useDispatch, useSelector } from 'react-redux'
import ReactPaginate from "react-paginate";
import { ChevronLeft, ChevronRight } from 'react-feather';

const ListProduct = () => {
  const dispatch = useDispatch()
  const [currentPage, setCurrentPage] = React.useState<number>(0)
  const storeProduct: any = useSelector<any>(state => state.product.list.data)

  const showNextButton = currentPage !== storeProduct?.data?.totalPage - 1;
  const showPrevButton = currentPage !== 0;

  const handlePageClick = ({ selected }:any) => {
    setCurrentPage(selected)
  }

  // React.useEffect(() => {
  //   dispatch(products({ skip: currentPage, take: 9 }))
  // }, [currentPage])

  

  return (
    <div>
      <div className='flex flex-row gap-4 flex-wrap'>
        {/* {
          storeProduct && storeProduct?.data?.products.map((item: any, index: number) => {
            return (
              <CardProduct style='lg:!w-[calc(calc(100%/3)-1rem)] md:!w-[calc(calc(100%/2)-1rem)] sm:!w-[calc(calc(100%/1)-1rem)]' data={item} key={index} />
            )
          })
        }
      </div>
      <div>
        {
          storeProduct && storeProduct?.data?.products && (
            <ReactPaginate
              previousLabel={
                showPrevButton ? (
                  <span className="w-10 h-10 flex items-center justify-center bg-[lightGray] rounded-md mr-4">
                    <ChevronLeft />
                  </span>
                ) : null
              }
              breakLabel={<span className="mr-4">...</span>}
              nextLabel={
                showNextButton ? (
                  <span className="w-10 h-10 flex items-center justify-center bg-[lightGray] rounded-md">
                    <ChevronRight />
                  </span>
                ) : null
              }
              pageCount={storeProduct?.data?.totalPage || 1}
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              containerClassName="flex items-center justify-center mt-8 mb-4"
              pageClassName="block border border-solid border-lightGray hover:bg-lightGray w-10 h-10 flex items-center justify-center rounded-md mr-4"
              activeClassName="bg-primary text-white"
            />
          )
        } */}
      </div>
    </div>
  )
}

export default ListProduct