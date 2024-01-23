import { Movie } from "../../common/Movie"
import { siteTitle, firstViewContainer, titleTag, titleCode, srOnly, siteTitleInner } from "./index.css"

export const FirstView = () => {
  return (
    <div className={firstViewContainer}>
      <div className={siteTitle}>
        <span className={siteTitleInner}>
          <span className={titleTag}>&lt;J.Sato&gt;</span>
          <span className={titleCode}>Portfolio Site</span>
          <span className={titleTag}>&lt;/J.Sato&gt;</span>
        </span>
      </div>
      <Movie src="/movies/top/fv.mp4" autoplay={true} />
    </div>
  )
}