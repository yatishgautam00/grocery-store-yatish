import CategoryList from '@/app/_component/CategoryList'
import ProductList from '@/app/_component/ProductList'
import React from 'react'

function ProductCategory({params}) {

  return (
    <div className='mt-8 px-10'>
      <h2 className="text-green-700 font-bold text-2xl mb-5">Popular categories</h2>
      <div className=''>
      <CategoryList title={"hide"} selected ={params?.categoryName}/>
      <ProductList selected ={params?.categoryName} />
      </div>
    </div>
  )
}

export default ProductCategory