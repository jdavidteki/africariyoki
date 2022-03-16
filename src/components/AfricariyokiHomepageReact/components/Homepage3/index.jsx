import React from "react";
import Section1 from "../Section1";
import Section2 from "../Section2";
import Input2 from "../Input2";
import Section3 from "../Section3";
import TrendingSlider from "../TrendingSlider";
import Section from "../Section";
import Game1 from "../Game1";
import FooterMenuFooterDefault from "../FooterMenuFooterDefault";
import "./Homepage3.css";

function Homepage3(props) {
  const { overlapGroup, section1Props, trendingSliderProps, game11Props, game12Props } = props;

  return (
    <div className="container-center-horizontal">
      <div className="homepage screen">
        <div className="overlap-group" style={{ backgroundImage: `url(${overlapGroup})` }}>
          <Section1 src={section1Props.src} />
          <div className="section2">
            <Section2 />
            <Input2 />
            <div className="frame-231">
              <Section3 />
              <TrendingSlider {...trendingSliderProps} />
            </div>
          </div>
          <div className="section3">
            <Section />
            <div className="games">
              <Game1 icon={game11Props.icon} spanText1={game11Props.spanText1} spanText2={game11Props.spanText2} />
              <Game1
                icon={game12Props.icon}
                spanText1={game12Props.spanText1}
                spanText2={game12Props.spanText2}
                className={game12Props.className}
              />
            </div>
          </div>
          <FooterMenuFooterDefault />
        </div>
      </div>
    </div>
  );
}

export default Homepage3;
