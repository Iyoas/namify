

import React, { Suspense } from "react";
import Header from "./tools/domain-generator/components/layout/Header";
import Footer from "./tools/domain-generator/components/layout/Footer";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <main>{children}</main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
