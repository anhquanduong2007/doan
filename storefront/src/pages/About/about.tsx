// import framework
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { BuilderComponent, builder } from '@builder.io/react'

// import component
import Loading from 'src/components/Loading';

// import style
// ...

builder.init(import.meta.env.VITE_BUILDERIO_KEY as string);
const About = () => {
    console.log(import.meta.env.VITE_BUILDERIO_KEY)
    const [builderContentJson, setBuilderContentJson] = React.useState<BuilderComponent | undefined>();

    const location = useLocation();
    React.useEffect(() => {
        builder.get('page', { url: location.pathname })
            .promise().then(setBuilderContentJson)
    }, [location.pathname])
    return (
        <React.Fragment>
            {builderContentJson ? <BuilderComponent model="page" content={builderContentJson} /> : <Loading />}
        </React.Fragment>
    )
};

export default About;