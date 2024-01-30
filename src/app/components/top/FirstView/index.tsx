import { Movie } from "../../common/Movie"
import { siteTitle, firstViewContainer, titleTag, titleCode, srOnly, siteTitleInner, siteTitleParts, siteTitlePartsText } from "./index.css"

export const FirstView = () => {
  return (
    <div className={firstViewContainer}>
      <div className={siteTitle}>
        <div className={siteTitleInner}>
          <div className={siteTitleParts}>
            <div className={`${siteTitlePartsText} ${titleTag}`} data-index="0">J.Sato</div>
          </div>
          <div className={siteTitleParts}>
            <div className={`${siteTitlePartsText} ${titleCode}`} data-index="1">Portfolio Site</div>
          </div>
        </div>
      </div>
      <Movie src="/movies/top/fv.mp4" autoplay={true} />
    </div>
  )
}