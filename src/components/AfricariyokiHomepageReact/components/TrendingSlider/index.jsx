import React from "react";
import Trending from "../Trending";
import RightControl1 from "../RightControl1";
import "./TrendingSlider.css";

function TrendingSlider(props) {
  const {
    trending1Props,
    trending2Props,
    trending3Props,
    trending4Props,
    trending5Props,
    trending6Props,
    trending7Props,
    rightControl1Props,
  } = props;

  return (
    <div className="trending-slider">
      <div className="reveal">
        <Trending spanText1={trending1Props.spanText1} spanText2={trending1Props.spanText2} />
        <Trending
          spanText1={trending2Props.spanText1}
          spanText2={trending2Props.spanText2}
          className={trending2Props.className}
        />
        <Trending
          spanText1={trending3Props.spanText1}
          spanText2={trending3Props.spanText2}
          className={trending3Props.className}
        />
        <Trending
          spanText1={trending4Props.spanText1}
          spanText2={trending4Props.spanText2}
          className={trending4Props.className}
        />
        <Trending
          spanText1={trending5Props.spanText1}
          spanText2={trending5Props.spanText2}
          className={trending5Props.className}
        />
        <Trending
          spanText1={trending6Props.spanText1}
          spanText2={trending6Props.spanText2}
          className={trending6Props.className}
        />
        <Trending
          spanText1={trending7Props.spanText1}
          spanText2={trending7Props.spanText2}
          className={trending7Props.className}
        />
      </div>
      <RightControl1 src={rightControl1Props.src} />
    </div>
  );
}

export default TrendingSlider;
