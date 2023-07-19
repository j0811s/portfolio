import { JsonLd } from "@/app/components/common/Breadcrumb/JsonLd"
import { Breadcrumb } from "@/app/components/common/Breadcrumb"

export default function Home() {
  return (
    <>
      <JsonLd />
      <Breadcrumb />
      <h2 className="">
        TOP
      </h2>
    </>
  )
}
