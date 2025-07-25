import React from "react";

import SEO, { type ISEOProps } from "./seo";

export interface IHelmetProps extends ISEOProps {
  children?: React.ReactNode;
}

function Helmet({ children, ...seoProps }: IHelmetProps) {
  return (
    <>
      <SEO {...seoProps} />

      {children}
    </>
  );
}

export default Helmet;
