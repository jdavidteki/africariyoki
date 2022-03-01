import React, { Component } from "react";
import Avatar from '@material-ui/core/Avatar';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Firebase from "../../firebase/firebase.js";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import "./UploadContent.css"

class ConnectedUploadContent extends Component {

    state = {
        albumName: "",
        singer: "",
        title: "",
        lyrics: "",
        videoID: "",
        addressID: "",
        isUploading: false,
        progress: 0,
        countries: ""
    };

    // componentDidMount(){
    //     let songs = [
    //     "-WqNQ49lYq0",
    //     "-avjU_Map1c",
    //     "0q4KRlPcnN4",
    //     "16eD47oOpH8",
    //     "1H1wBzvhWqA",
    //     "1P-AAhpqHfU",
    //     "1_bq1F9hV8g",
    //     "1ixK3IbdStc",
    //     "1kU5BzdfDfg",
    //     "1qgiNdSGx-c",
    //     "2-rcDs3R-zk",
    //     "21V7PKLPQqY",
    //     "229yBu1C-w0",
    //     "2geXXMO-Ny0",
    //     "2lY1oZq-8N0",
    //     "2tvThmAIlug",
    //     "33h-C2WI4UQ",
    //     "33xgszZJn_c",
    //     "3GrngaKe0g0",
    //     "3Ri26PZuzYc",
    //     "3Sxg8kBO_UM",
    //     "423z6m44bIA",
    //     "48nfwcGRBbQ",
    //     "4HHY-AcV33k",
    //     "4ad5yijeyBM",
    //     "4uIC_66FIAU",
    //     "518MKjVU9uQ",
    //     "55qMow6JAl8",
    //     "5VVdLympnQE",
    //     "5gvgDWmTFKA",
    //     "5zEj2LJSoQY",
    //     "65ZUr3n9NAI",
    //     "6F-LgGFEgWI",
    //     "6MI2hpDY0I0",
    //     "6PneePBdvrE",
    //     "6ZveEDoXAVc",
    //     "6unnNvyupos",
    //     "6wfIVUgI9ok",
    //     "6xWEh1nW1gQ",
    //     "7DxG33tEJKE",
    //     "7GME5jEkf2s",
    //     "7l22qaD31iE",
    //     "7sbj_7mRyAg",
    //     "7tw405ULbK8",
    //     "7vHjhgCvimc",
    //     "8pZGsNSAfLo",
    //     "8rOER0uOzz8",
    //     "8vC6TtSCYFo",
    //     "9410qCyQuJ4",
    //     "9DWKrtscyy0",
    //     "9ZGjg2i9q08",
    //     "9gchcyH4qv4",
    //     "9jIhNOrVG58",
    //     "9wBeNVp5UZY",
    //     "A2MVt9hc6uY",
    //     "AR5uz13lhB0",
    //     "AWdE6ivnA78",
    //     "BBzi69kOAW8",
    //     "BKtUjHzyeys",
    //     "BOgwB3tqSas",
    //     "C2ncGGiDZxA",
    //     "C3RV328knVE",
    //     "CDOl5EM2Xns",
    //     "CLGNCRaIYEA",
    //     "DGpwNm0A6gI",
    //     "DfLS0A5IAhk",
    //     "DsKiGfmEzKs",
    //     "EEvbOgy6KCg",
    //     "EMoFDGKDw6c",
    //     "EOrFWBjiRik",
    //     "ET0LuQ3_ZIw",
    //     "EUOD7JVmh8M",
    //     "En79C-61iD8",
    //     "EtbwTgY3AIk",
    //     "F9c4n7Wqtbk",
    //     "FCUk7rIBBAE",
    //     "FQ4dTb9Fo0I",
    //     "G0M8goEBVHU",
    //     "G7Er0z3zw2s",
    //     "GP_LpUoNx-I",
    //     "GTUIlOudlHI",
    //     "GWKdV6H7qZM",
    //     "HE8p1lJaPyg",
    //     "HEc92rbxxzI",
    //     "HdFaP0DniDQ",
    //     "Hz-AyMeKT1o",
    //     "I2I_5eraBPo",
    //     "I6wzhp4g2Cw",
    //     "IRm_2m-fnY8",
    //     "IahNmvmFOS4",
    //     "J90bPRcuQDc",
    //     "JDy-ZLlYEGw",
    //     "JFlBu5Gm7sU",
    //     "JcJhrOStkl4",
    //     "JtEv_3Rwn1o",
    //     "KErqMcZR0KA",
    //     "Kptz4gbB6Rs",
    //     "LLuegl7hrlE",
    //     "LaKIuNGc8c4",
    //     "Lk14JL-JcZQ",
    //     "M0im9Hl3BJA",
    //     "M7nLOhmMGfg",
    //     "MCnkHJ0HbDQ",
    //     "MIBYzlMG9a4",
    //     "MPlSogWaCOQ",
    //     "MQoyjrDUCuY",
    //     "MTehln05IBY",
    //     "M_DGSu4N32U",
    //     "MlQ3a5TkV20",
    //     "MrpVIkyjJrA",
    //     "MucSft25l6I",
    //     "MywolTUUMKY",
    //     "N5G7Mvo0tkM",
    //     "NDAOa6qp8Hg",
    //     "O-zmJw70iz8",
    //     "O7bOeffd48E",
    //     "OQuQV6u8-tk",
    //     "OdkPvFE2wac",
    //     "Os2Z5KdHy6w",
    //     "OxqODr2UmoE",
    //     "PB4blM5LYPM",
    //     "PFPfxcvRshk",
    //     "PUijDI6KWKw",
    //     "PUnx13A4XDs",
    //     "Q6-PdHoOcEY",
    //     "QUSc5al8JpY",
    //     "Qbx3UNcoC1Q",
    //     "QijcIH6Yc7Q",
    //     "Qtfslc-VAhA",
    //     "QzPIn036-HM",
    //     "RWoGI1WXjpM",
    //     "RbNkRBlLa1I",
    //     "Rsdopaqg85k",
    //     "S3PdBtY_no4",
    //     "SFmZKO35SfQ",
    //     "SbHx9Ps7B4g",
    //     "T8Neeqbp1Wo",
    //     "TFXBvT8hLnw",
    //     "TIKF16oagBY",
    //     "UCUfGghQfms",
    //     "UKSfQqYTFRo",
    //     "UVte8a_2q80",
    //     "UYZbkPNF0us",
    //     "UdKTx-8EvtM",
    //     "Uz07P-Df7AE",
    //     "VF47kno4Dro",
    //     "Vb_RkP67sFE",
    //     "W22pYvi9M2w",
    //     "WRLB5O1plrY",
    //     "WmNXBtmLtGY",
    //     "WoxN3b0jmlY",
    //     "X9A0L0MD6T4",
    //     "XE1ybI6we_A",
    //     "XjenB-EaqC4",
    //     "XlCPF3-IyIw",
    //     "Y5QUVma7_g4",
    //     "Y65E6xXyEF4",
    //     "YRhBfL3GEjQ",
    //     "Y_Y3F2wXOxs",
    //     "Yp9Bvu-qNeQ",
    //     "Yvdp4mWMDv8",
    //     "_02DNbCMlpk",
    //     "_GxzBuHAavo",
    //     "_IgD-qWC_ek",
    //     "_JrxV6Me604",
    //     "_KXHTdq9URg",
    //     "_TeJbkYLFIw",
    //     "_tNFyE_WPgI",
    //     "_znR5yFp2UM",
    //     "aK5FsO7n31E",
    //     "ai0RgtrRGSY",
    //     "bMyrBds_9Zc",
    //     "bkZ1_gNDQkg",
    //     "bp6UdUPtXxE",
    //     "cL51JxNZF7w",
    //     "cVQbyIEK_jQ",
    //     "chMsx-vKHug",
    //     "dHmN2sfVlnE",
    //     "dXeOBkKdiAg",
    //     "dyEfm68pcE8",
    //     "e7VDIy8JAuY",
    //     "eIaw1ZtthRg",
    //     "fCZVL_8D048",
    //     "fE3ePS8Umgo",
    //     "fev13TZr2TA",
    //     "g7akR7AEAxg",
    //     "gJ9hzRbN4BI",
    //     "gT69SMs486c",
    //     "gdtoVsK_eic",
    //     "h7WfPHHXCAY",
    //     "hVEp-P2-rqY",
    //     "hYTqUjT0ing",
    //     "hfSoRigVpWU",
    //     "hiZKMtwlYkg",
    //     "hxe6Ly4xfkE",
    //     "i-T4-4Hveo4",
    //     "i0ZMaGVJF-Y",
    //     "iGr4gjya_Pk",
    //     "iMti8KjkCsw",
    //     "ipZvlG-wwWk",
    //     "ir-DUnDxFQc",
    //     "izBpU_bOqbk",
    //     "jMpysHVdAe0",
    //     "jcD9olHl_XE",
    //     "jipQpjUA_o8",
    //     "jowVh4hblsg",
    //     "jqp_IVzVhP0",
    //     "lG_-2gU6kUk",
    //     "lGduJvOtuT8",
    //     "lPe09eE6Xio",
    //     "leCI_whBjOw",
    //     "lta5go9P-go",
    //     "m5-ef83x0pM",
    //     "m7VX0tHCxfY",
    //     "mFBJtuQ1Llc",
    //     "mMutBBeqLMQ",
    //     "mV_zjss2nlY",
    //     "mZKwbR1Kjr4",
    //     "mrDFizMiNVw",
    //     "n3hSeu2NYXU",
    //     "n4pS-2P1wiQ",
    //     "nedwzQSZwfE",
    //     "nh-rkFHyZ1s",
    //     "nxyay4m584Y",
    //     "o5KyLuuqFms",
    //     "oAcWCGgF-tY",
    //     "oNYiG6f9W_g",
    //     "ojvz49lSfM4",
    //     "osmCHfPKgLQ",
    //     "pQK4KpophPo",
    //     "qEEsc8j-FVI",
    //     "qGkDAAxrjv0",
    //     "qQ2uxHTmhIg",
    //     "qgNNKuMjJ_4",
    //     "qiwoG1CmJIU",
    //     "qm-8MuocmVY",
    //     "rL1RRLZIHGA",
    //     "rN00uYIDFOc",
    //     "rO49fDRz-3k",
    //     "rVFWZZ2rRZU",
    //     "rYiUHMF7upY",
    //     "rd0wx6kLNWs",
    //     "rs58TCZ8qJI",
    //     "rvnXUQTEEVA",
    //     "s5xiYjLF5Uo",
    //     "s6stHyWHt1U",
    //     "sRS8Afj3dOM",
    //     "s_14mfxlHSc",
    //     "so4dgTRaWFk",
    //     "ssvZdVkYg3I",
    //     "sz5EhyESHR8",
    //     "t73iPhEg-kg",
    //     "ts5NDTV4QIo",
    //     "tzQx8rhcRUE",
    //     "uHb9EcpiNZ4",
    //     "uLJSjW3FSvY",
    //     "uZ-_HIoEBE8",
    //     "ucVJrja8r6Q",
    //     "utPhQUnLqc4",
    //     "vEgmPQtIdT0",
    //     "vSCRRlkHDtI",
    //     "viPh2ourtb4",
    //     "w4gAllVrPVM",
    //     "wCX7Isw7HZw",
    //     "wDhJgEFtYAM",
    //     "wG0WBC17Arc",
    //     "wXByQ8zFVK4",
    //     "wYUFksYkgos",
    //     "whptJMsHQVI",
    //     "witjmEEV7Es",
    //     "x9a6kz1-mgo",
    //     "xUYb9kIBrQ4",
    //     "xYD2SQljwJo",
    //     "x_JsNa2oRnI",
    //     "xsLhAlYwFxY",
    //     "xygb3dw2nTY",
    //     "yC2qh3MANvs",
    //     "yfM_ctb0tOo",
    //     "yoRQg4ZIRuo",
    //     "zUU1bIWpH5c",
    //     "zgi30OqnKN4",
    //     "zhPUUEhkYOY",
    //     "zmrOBEOUV_c",
    //     "zxDAgjaxDWI"]

    //     var i = 1;
    //     const x = setInterval(function() {
    //         i++;
    //         console.log("i", i)
    //         if (i < songs.length) {
    //             let addressID = "http://0.0.0.0:5000"

    //             var requestOptions = {
    //                 method: 'GET',
    //                 redirect: 'follow'
    //             };
    //             fetch(`${addressID}/vr/${songs[i]}`, requestOptions)
    //             .then(response => response.text())
    //             .then(result => console.log(result))
    //             .catch(error => console.log('error', error));

    //             console.log("updating only instruments", addressID, songs[i])
    //         }else{
    //             clearInterval(x)
    //         }
    //     }, 240000)
    // }

    uploadToFirebase(){
        let addressID = this.state.addressID
        if(addressID == ''){
            addressID = "http://0.0.0.0:5000"
        }else{
            addressID = "https://"+addressID+".ngrok.io"
        }
        //TODO: refactor this: but we might just want to update instrumetals
        if (this.state.title == "ji"){
            //use ai to extract vocall from music and upload instrumental
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
            fetch(`${addressID}/vr/${this.state.videoID}`, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

            console.log("updating only instruments", addressID, this.state.videoID)
            return
        }

        //uZ-_HIoEBE8
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        // 05fa60b49afa -- use amazon ec2 to do downaloda

        today = yyyy+mm+dd

        if (this.state.videoID != ""){
            let audioUrl = `https://storage.googleapis.com/africariyoki-4b634.appspot.com/music/${this.state.videoID}.mp3`
            let lyricsTextUrl = `https://storage.googleapis.com/africariyoki-4b634.appspot.com/lyrics/${this.state.videoID}.txt`

            Firebase.addAfricariyoki({
                title: this.state.title,
                singer: this.state.singer,
                title: this.state.title,
                audiourl: audioUrl,
                lyricsurl: lyricsTextUrl,
                lyrics: this.state.lyrics,
                id: this.state.videoID,
                albumName: this.state.albumName,
                countries: this.state.countries,
                dateAdded: today,
            })

            //use ai to extract vocall from music and upload instrumental
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
            fetch(`${addressID}/vr/${this.state.videoID}`, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
        }
    }

    render() {
        return (
            <div className="UploadContent">
                <div style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <div
                    style={{
                        width: 320,
                        padding: 30,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column"
                    }}
                    >
                    <Avatar style={{ marginBottom: 10 }}>
                        <MusicNoteIcon />
                    </Avatar>
                    <div
                        style={{
                        marginBottom: 20,
                        fontSize: 24,
                        textAlign: "center"
                        }}
                    >
                        {" "}
                        Upload song information
                        {" "}
                    </div>
                    <TextField
                        value={this.state.title}
                        placeholder="Song title"
                        onChange={e => {
                        this.setState({ title: e.target.value });
                        }}
                    />
                    <TextField
                        value={this.state.singer}
                        placeholder="Singer"
                        onChange={e => {
                        this.setState({ singer: e.target.value });
                        }}
                    />
                    <TextField
                        value={this.state.albumName}
                        placeholder="Album"
                        onChange={e => {
                        this.setState({ albumName: e.target.value });
                        }}
                    />
                    <TextField
                        value={this.state.videoID}
                        placeholder="Youtube Video ID"
                        onChange={e => {
                        this.setState({ videoID: e.target.value });
                        }}
                    />
                    <TextField
                        value={this.state.addressID}
                        placeholder="address ID"
                        onChange={e => {
                            this.setState({ addressID: e.target.value });
                        }}
                    />
                    <TextField
                        value={this.state.countries}
                        placeholder="Countries - seperate with comma"
                        onChange={e => {
                            this.setState({ countries: e.target.value });
                        }}
                    />
                    <TextField
                        style={{ height: 100}}
                        value={this.state.lyrics}
                        placeholder="Lyrics - paste lyrics here"
                        multiline
                        rows={4}
                        onChange={e => {
                        this.setState({ lyrics: e.target.value });
                        }}
                    />
                    <Button
                        style={{ marginTop: 20, width: 200, textTransform: 'lowercase'}}
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            this.uploadToFirebase()
                        }}
                    >
                    Upload
                    </Button>
                    {this.state.wrongCred && (
                        <div style={{ color: "red" }}>{this.state.SignUpErrorMsg}</div>
                    )}
                    </div>
                </div>
            </div>

        )
    }
}


const mapStateToProps = state => {
    return {};
};

const UploadContent = withRouter(connect(mapStateToProps)(ConnectedUploadContent));
export default UploadContent;


//https://material-ui.com/components/material-icons/#material-icons