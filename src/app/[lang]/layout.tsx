

import React from "react";
import Header from "./tools/domain-generator/components/layout/Header";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
