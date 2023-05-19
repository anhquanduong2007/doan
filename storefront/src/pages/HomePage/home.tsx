import * as React from 'react';
import Slider from '../../components/Slider';
import Layout from '../../components/Layout'
import NewArrivalsProduct from 'src/components/NewArrivalsProduct/NewArrivalsProduct';

const HomePage = () => {
  return (
    <React.Fragment>
      <Slider />
      <Layout>
        <NewArrivalsProduct />
      </Layout>
    </React.Fragment>
  );
};

export default HomePage;