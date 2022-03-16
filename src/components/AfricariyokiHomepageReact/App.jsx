import "./App.css";
import React from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import Homepage3 from "./components/Homepage3";

function HomePage() {
  return (
        <Homepage3
            overlapGroup="https://anima-uploads.s3.amazonaws.com/projects/623040abe80332f67bfa8a01/releases/623041e8bd306a70166065a8/img/background-1@2x.png"
            section1Props={homepage3Data.section1Props}
            trendingSliderProps={homepage3Data.trendingSliderProps}
            game11Props={homepage3Data.game11Props}
            game12Props={homepage3Data.game12Props}
        />
  );
}

export default HomePage;
const section1Data = {
    src: "https://anima-uploads.s3.amazonaws.com/projects/623040abe80332f67bfa8a01/releases/623043b3d84cbcd91c35097a/img/logo-4@2x.png",
};

const trending1Data = {
    spanText1: "Ginger",
    spanText2: "WizKid ft. Burna Boy",
};

const trending2Data = {
    spanText1: "Running",
    spanText2: "LADIPOE & Fireboy DML",
    className: "reveal-item",
};

const trending3Data = {
    spanText1: "Never Stopped",
    spanText2: "Buju",
    className: "reveal-item",
};

const trending4Data = {
    spanText1: "High",
    spanText2: "Adekunle Gold ft Davido",
    className: "reveal-item",
};

const trending5Data = {
    spanText1: "Door",
    spanText2: "Joeboy",
    className: "reveal-item",
};

const trending6Data = {
    spanText1: "For You",
    spanText2: "Teni ft. Davido",
    className: "reveal-item",
};

const trending7Data = {
    spanText1: "Testimony",
    spanText2: "Buju",
    className: "reveal-item",
};

const rightControl1Data = {
    src: "https://anima-uploads.s3.amazonaws.com/projects/623040abe80332f67bfa8a01/releases/623043b3d84cbcd91c35097a/img/arrow-drop-down-8@2x.png",
};

const trendingSliderData = {
    trending1Props: trending1Data,
    trending2Props: trending2Data,
    trending3Props: trending3Data,
    trending4Props: trending4Data,
    trending5Props: trending5Data,
    trending6Props: trending6Data,
    trending7Props: trending7Data,
    rightControl1Props: rightControl1Data,
};

const game11Data = {
    icon: "https://anima-uploads.s3.amazonaws.com/projects/623040abe80332f67bfa8a01/releases/623041e8bd306a70166065a8/img/icon-1@2x.png",
    spanText1: "Guess the song",
    spanText2: "Select the correct song title of random song instrumental",
};

const game12Data = {
    icon: "https://anima-uploads.s3.amazonaws.com/projects/623040abe80332f67bfa8a01/releases/623041e8bd306a70166065a8/img/icon-2@2x.png",
    spanText1: "Next line",
    spanText2: <>Choose the correct next line to a <br />random song instrumental</>,
    className: "game2",
};

const homepage3Data = {
    section1Props: section1Data,
    trendingSliderProps: trendingSliderData,
    game11Props: game11Data,
    game12Props: game12Data,
};
