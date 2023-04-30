import * as React from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

import style from "./notFound.module.scss";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={clsx(style.container)}>
      Not Found
    </div>
  )
}

export default NotFound