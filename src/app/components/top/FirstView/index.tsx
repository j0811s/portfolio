import { Movie } from "../../common/Movie"
import { siteTitle, firstViewContainer, titleTag, titleCode, srOnly, siteTitleInner, siteTitleParts, siteTitlePartsText, movie } from "./index.css"

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
      <div className={movie}>
        <Movie src="/movies/top/fv.mp4" autoplay={true} width={2160} height={1350} />
      </div>
    </div>
  )
}