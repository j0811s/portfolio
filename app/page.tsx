import { BreadcrumbJsonLd } from "@/app/components/common/Breadcrumb/BreadcrumbJsonLd"
import { Breadcrumb } from "@/app/components/common/Breadcrumb"

export default function Home() {
  return (
    <>
      <BreadcrumbJsonLd />
      <Breadcrumb />
      <h2 className="">
        TOP
      </h2>
    </>
  )
}
