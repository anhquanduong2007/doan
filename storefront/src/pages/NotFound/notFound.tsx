import * as React from "react";
import clsx from "clsx";

import NotFound from "src/components/NotFound";

import style from "./notFound.module.scss";

const NotFoundPage = () => {
  return (
    <div className={clsx(style.container)}>
      <NotFound />
    </div>
  );
};

export default NotFoundPage;