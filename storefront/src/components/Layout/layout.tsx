import React from 'react'

type LayoutProps = {
  children: React.ReactNode; // 👈️ type children
};

const Layout = (props: LayoutProps) => {
  return (
    <div className='pb-16 pt-6 mx-auto 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg lg:justify-center md:max-w-screen-md sm:max-w-screen-sm'>
      {props.children}
    </div>
  )
}

export default Layout
