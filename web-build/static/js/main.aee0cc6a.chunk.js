(this["webpackJsonpreact-karaoke-challenge"]=this["webpackJsonpreact-karaoke-challenge"]||[]).push([[0],{101:function(e,t,a){},105:function(e,t,a){},106:function(e,t,a){},107:function(e,t,a){},108:function(e,t,a){},109:function(e,t,a){},116:function(e,t,a){},117:function(e,t,a){"use strict";a.r(t);var n=a(1),s=a(14),r=a.n(s),i=(a(85),a(86),a(19)),c=a(22),o=a(24),l=a(23),u=a(34),d=a.p+"static/media/logo.798a5878.png",p=(a(87),a(4)),h=function(e){Object(o.a)(a,e);var t=Object(l.a)(a);function a(){return Object(i.a)(this,a),t.apply(this,arguments)}return Object(c.a)(a,[{key:"render",value:function(){return Object(p.jsx)("div",{className:"Header",children:Object(p.jsxs)("div",{className:"Header-container",children:[Object(p.jsx)("div",{className:"Header-left",children:Object(p.jsx)(u.b,{to:"/africariyoki",children:Object(p.jsx)("img",{className:"Header-logo",src:d,alt:"Logo"})})}),Object(p.jsxs)("div",{className:"Header-right",children:[Object(p.jsx)(u.b,{className:"Header-navLink",variant:"outlined",color:"primary",to:"/africariyoki",children:"home"}),Object(p.jsx)(u.b,{className:"Header-navLink",variant:"outlined",color:"primary",to:"/africariyoki/about",children:"about"}),Object(p.jsx)(u.b,{className:"Header-navLink",variant:"outlined",color:"primary",to:"/africariyoki/upload",children:"upload"})]})]})})}}]),a}(n.Component),j=(a(96),function(e){return Object(p.jsxs)("div",{className:"Song",onClick:function(){return e.playSong(e.song.id)},children:[Object(p.jsx)("span",{children:e.song.title}),Object(p.jsx)("span",{children:e.song.singer})]})}),y=(a(97),function(e){var t="SongList";return 1==e.expandResults&&(t="SongList SongList-expandResults"),Object(p.jsx)("div",{className:t,children:e.filteredSongs.length>0?Object(p.jsx)("div",{className:"SongList-container",children:e.filteredSongs.map((function(t){return Object(p.jsx)(j,{song:t,playSong:e.playSong},t.id)}))}):Object(p.jsx)("div",{className:"SongList-emptySearch",children:"you too search something we have, mtchewww"})})}),f=a(35),g=a(31),m=new function e(){Object(i.a)(this,e),this.getLyrics=function(){return new Promise((function(e){g.a.database().ref("/lyrics/").once("value").then((function(t){t.val()?e(Object.values(t.val())):e({})}))}))},this.storage=function(){return g.a.storage()},this.deleteRecp=function(e,t){return new Promise((function(a){g.a.database().ref("/recipients/"+e).child(t).remove().then((function(){a(!0)}))}))},this.addAfricariyoki=function(e){return new Promise((function(t){g.a.database().ref("/lyrics/"+e.id+"/").set(Object(f.a)({id:e.id,title:e.title,lyricsurl:e.lyricsurl,singer:e.singer,audiourl:e.audiourl,lyrics:e.lyrics},"title",e.title)).then((function(e){t(!0)})).catch((function(e){console.warn("error",e)}))}))},this.updateLyrics=function(e,t){return new Promise((function(a){g.a.database().ref("/lyrics/"+e+"/").update({lyrics:t}).then((function(e){console.log("reposne",e),a(!0)})).catch((function(e){console.log("error",e)}))}))},this.postTransaction=function(e,t,a,n){return new Promise((function(s){g.a.database().ref("/userTransactions/"+e.user.uid+"/"+n.id+"/").set({transactionId:n.id,accountNumber:t.accountNumber,bankName:t.bankName,recpFirstName:t.firstName,recpLastName:t.lastName,cardUsed:a.number,recpAmt:n.recpAmt,sendAmt:n.sendAmt,recpCurrency:n.recpCurrency,sendCurrency:n.sendCurrency,rate:n.rate,isSuccessful:!0,time:"13:03"}).then((function(e){s(!0)})).catch((function(e){console.warn("error",e)}))}))}},b=a(149),v=a(54),x=a.n(v),O=a.p+"static/media/ankarabck1.1e316c1a.jpeg",S=a.p+"static/media/ankarabck2.6366ec5f.jpeg",k=a.p+"static/media/ankarabck3.220867ed.jpeg",N=a.p+"static/media/ankarabck4.34ffaddd.jpeg",L=a.p+"static/media/ankarabck5.02cf0f38.jpeg",w=a.p+"static/media/ankarabck6.4c11192b.jpeg",C=a.p+"static/media/ankarabck7.03156918.jpeg",I=a.p+"static/media/ankarabck8.c781466c.jpeg",D=a.p+"static/media/ankarabck9.364c5b2d.jpeg",T=a.p+"static/media/ankarabck10.90edc02c.jpeg",F=a.p+"static/media/ankarabck11.774c7ff8.jpeg",A=(a(101),function(e){Object(o.a)(a,e);var t=Object(l.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).filterSong=function(e){n.state.expandResults||n.setState({expandResults:!0}),""==e&&n.setState({expandResults:!1});var t=n.state.songsCopy.filter((function(t){return t.title.replace(" ","").toLowerCase().includes(e.replace(" ","").toLowerCase())||t.singer.replace(" ","").toLowerCase().includes(e.replace(" ","").toLowerCase())}));""==e?n.setState({songs:n.state.songsCopy}):(t.length,n.setState({filteredSongs:t}))},n.playSong=function(e){var t=n.state.songs.filter((function(t){return e===t.id}));n.props.history.push({pathname:"/africariyoki/karaokedisplay/"+e,state:{chooseSong:t,songs:n.state.songsCopy}}),n.setState({songs:t,currentSong:t})},n.state={songs:[],filteredSongs:[],currentSong:"",songsCopy:[],searchOptions:[],typingEffectSongs:[""],count:0,query:"",expandResults:!1,background:P()},n.searchTerm="",n}return Object(c.a)(a,[{key:"componentDidMount",value:function(){var e=this;m.getLyrics().then((function(t){var a=function(e){for(var t=e.length-1;t>0;t--){var a=Math.floor(Math.random()*(t+1)),n=[e[a],e[t]];e[t]=n[0],e[a]=n[1]}return e}(t.map((function(e){return e.title})));e.setState({songs:t,songsCopy:t,searchOptions:a,typingEffectSongs:a,songIds:t.map((function(e){return e.id}))})})),setInterval((function(){e.setState({count:(e.state.count+1)%20})}),6e3)}},{key:"render",value:function(){var e=this;return Object(p.jsxs)("div",{className:"Searcher",children:[Object(p.jsx)("div",{style:{backgroundImage:"url(".concat(this.state.background,")")},className:"Searcher-background",children:Object(p.jsx)("div",{className:"Searcher-backgroundOverlay"})}),Object(p.jsxs)("div",{className:"Searcher-container",children:[Object(p.jsx)("div",{className:"Searcher-inputWrapper",children:Object(p.jsx)(b.a,{className:"Searcher-input",label:"what do you want to sing today??",variant:"outlined",onChange:function(t){e.setState({query:t.target.value},(function(){e.filterSong(e.state.query)}))}})}),Object(p.jsx)(y,{songs:this.state.songs,filteredSongs:this.state.filteredSongs,playSong:this.playSong,expandResults:this.state.expandResults}),Object(p.jsx)("div",{className:"Searcher-typeEffectWrapper",children:Object(p.jsx)(x.a,{style:{marginTop:50,fontSize:12,color:"#3F51B5"},text:this.state.typingEffectSongs.slice(0,20)[this.state.count],speed:150,eraseDelay:150,typingDelay:150})})]})]})}}]),a}(n.Component));function P(){switch(Math.floor(10*Math.random())){case 1:return O;case 2:return S;case 3:return k;case 4:return N;case 5:return L;case 6:return w;case 7:return C;case 8:return I;case 9:return D;case 10:return T;default:return F}}var R=a(62),M=a.n(R),E=a(70),B=a(71),H=a.n(B),U=a(49),Y=a.n(U),_=a(72),K=a.n(_);a(105);function z(e){return e.replace(/[^\w\s]/gi,"").toLowerCase().replace("by rentanadvisercom","***")}var X,V=function(e){Object(o.a)(a,e);var t=Object(l.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).onPlayFunction=function(e,t){n.setState({lineNumber:e,currentLine:t})},n.onSetLyricFunction=function(e){n.setState({arrayLyrics:e})},n.updateTimer=function(){setInterval((function(){var e=n.state.eventDate;n.props.pause?n.state.lrc.pause():(e=e.add(1,"s"),n.state.lrc.play(6e4*e.minutes()+1e3*e.seconds()),n.setState({eventDate:e}))}),1e3)},n.state={title:"hersss",lineNumber:1,prevLine:"",currentLine:"",nextLine:"",arrayLyrics:[],eventDate:Y.a.duration().add({days:0,hours:0,minutes:0,seconds:0}),lrc:new K.a({onPlay:n.onPlayFunction,onSetLyric:n.onSetLyricFunction,offset:15e3})},n}return Object(c.a)(a,[{key:"componentDidMount",value:function(){this.updateTimer(),this.state.lrc.setLyric(this.props.lyrics),this.state.lrc.play(0)}},{key:"render",value:function(){return Object(p.jsxs)("div",{className:"Lyrics-container LRCParser-container",children:[this.state.arrayLyrics[this.state.lineNumber-1]&&Object(p.jsx)("p",{children:z(this.state.arrayLyrics[this.state.lineNumber-1].text)}),Object(p.jsx)("p",{className:"LRCParser-currentLine",children:z(this.state.currentLine)}),this.state.arrayLyrics[this.state.lineNumber+1]&&Object(p.jsx)("p",{children:z(this.state.arrayLyrics[this.state.lineNumber+1].text)})]})}}]),a}(n.Component),q=a(150);a(106);var G=function(e){Object(o.a)(a,e);var t=Object(l.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).handleChange=function(e){n.setState({lyrics:e.target.value},(function(){n.prepareLyricsForFixing()}))},n.prepareLyricsForFixing=function(){var e=n.state.lyrics;e=e.replace(/\d\d:\d\d.\d\d/gm,"").replace(/[^\w\s]/gi,""),n.setState({lyrics:e},(function(){for(var t=e.split("\n"),a=[],s=0;s<t.length;s++)" "!=t[s]&&a.push(t[s].trim());n.setState({lyricsArrayClean:a})}))},n.state={songId:e.songId,lyrics:e.lyrics,lyricsArrayClean:[],noTimeStamp:0},n}return Object(c.a)(a,[{key:"updateLyrics",value:function(){1==confirm("are you sure?")&&("saving lrc to firebase...",m.updateLyrics(this.state.songId,this.state.lyrics))}},{key:"componentDidMount",value:function(){!function(e){if("undefined"==typeof YT||"undefined"==typeof YT.Player){var t=document.createElement("script");t.src="https://www.youtube.com/iframe_api";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(t,a)}setTimeout((function(){!function(e){X=new YT.Player("video-placeholder",{width:600,height:100,videoId:e,playerVars:{color:"white"}})}(e)}),1e3)}(this.state.songId),this.prepareLyricsForFixing()}},{key:"timeStamp",value:function(){var e=this;this.setState({noTimeStamp:this.state.noTimeStamp+1},(function(){var t=e.state.lyricsArrayClean,a=t[e.state.noTimeStamp-1];a="[".concat(function(e){e=Math.round(e);var t=Math.floor(e/60),a=e-60*t;return"0"+t+":"+(a=a<10?"0"+a:a)+".00"}(X.getCurrentTime()),"]").concat(a),t[e.state.noTimeStamp-1]=a,e.setState({lyricsArrayClean:t,lyrics:t.join(" \n")})}))}},{key:"render",value:function(){var e=this;return Object(p.jsxs)("div",{className:"LRCFixer",children:[Object(p.jsx)("div",{id:"video-placeholder",style:{width:"100%"}}),Object(p.jsx)("textarea",{className:"Lyrics-container",onChange:this.handleChange,value:this.state.lyrics}),Object(p.jsxs)("div",{children:[Object(p.jsx)(q.a,{onClick:function(){return e.timeStamp()},children:"time stamp!"}),Object(p.jsx)(q.a,{onClick:function(){return e.updateLyrics()},children:"update lyrics"})]})]})}}]),a}(n.Component),J=(a(107),function(e){Object(o.a)(a,e);var t=Object(l.a)(a);function a(){var e;Object(i.a)(this,a);for(var n=arguments.length,s=new Array(n),r=0;r<n;r++)s[r]=arguments[r];return(e=t.call.apply(t,[this].concat(s))).state={albumName:""},e}return Object(c.a)(a,[{key:"render",value:function(){return Object(p.jsxs)("div",{className:"Clouds",id:"clouds",children:[Object(p.jsx)("div",{className:"cloud x1"}),Object(p.jsx)("div",{className:"cloud x2"}),Object(p.jsx)("div",{className:"cloud x3"}),Object(p.jsx)("div",{className:"cloud x4"}),Object(p.jsx)("div",{className:"cloud x5"})]})}}]),a}(n.Component)),W=(a(108),function(e){Object(o.a)(a,e);var t=Object(l.a)(a);function a(){var e;Object(i.a)(this,a);for(var n=arguments.length,s=new Array(n),r=0;r<n;r++)s[r]=arguments[r];return(e=t.call.apply(t,[this].concat(s))).state={singer:e.props.location.state.chooseSong[0],animatedTexts:[e.props.location.state.chooseSong[0].title,e.props.location.state.chooseSong[0].singer,e.props.location.state.chooseSong[0].album],showTimer:!1,count:0,eventDate:Y.a.duration().add({days:0,hours:0,minutes:0,seconds:5}),secs:0,pauseSong:!1,lrcFixer:!1},e.updateTimer=function(){var t=setInterval((function(){var a=e.state.eventDate;if(a<=0){var n=Q(0,e.props.location.state.songs.length);e.setState({singer:e.props.location.state.songs[n],animatedTexts:[e.props.location.state.songs[n].title,e.props.location.state.songs[n].singer,e.props.location.state.songs[n].album],count:0,eventDate:Y.a.duration().add({days:0,hours:0,minutes:0,seconds:5}),secs:0,showTimer:!1},(function(){window.history.pushState({},"update","".concat(e.state.singer.id))})),clearInterval(t)}else{var s=(a=a.subtract(1,"s")).seconds();e.setState({secs:s,eventDate:a,showTimer:!0})}}),1e3)},e.playAnotherSong=function(){e.updateTimer()},e}return Object(c.a)(a,[{key:"componentDidMount",value:function(){var e=Object(E.a)(M.a.mark((function e(){var t=this;return M.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:setInterval((function(){t.setState({count:(t.state.count+1)%2})}),5e3);case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},{key:"displayLyrics",value:function(){for(var e=this.state.singer.lyrics.replace('b"',""),t="",a="",n=0;n<e.length;n++)"\\"==e[n]?(t+=" \n ",a="t"):"t"==a?t+=e[n+1]:(t+=e[n],a="");return t.toLowerCase().replace("by rentanadvisercom","***")}},{key:"lrcFormat",value:function(){return this.state.singer.lyrics.includes("[00")}},{key:"toggleLrcFixer",value:function(){var e=prompt("Please enter master password","");null!=e&&"1226"==e?this.state.lrcFixer?this.setState({lrcFixer:!1}):this.setState({lrcFixer:!0}):alert("sorry, invalid password")}},{key:"render",value:function(){var e=this;if(this.props)return Object(p.jsxs)("div",{className:"KaraokeDisplay",children:[Object(p.jsxs)("div",{className:"KaraokeDisplay-cloudBackground",children:[Object(p.jsx)(J,{}),Object(p.jsx)("div",{className:"KaraokeDisplay-stars"})]}),Object(p.jsxs)("div",{className:"KaraokeDisplay-container",children:[!this.state.lrcFixer&&Object(p.jsx)(H.a,{src:this.state.singer.audiourl.includes("africariyoki-4b634")?this.state.singer.audiourl:this.state.singer.audiourl.replace("africariyoki","africariyoki-4b634"),autoPlay:!0,controls:!0,controlsList:"nodownload",className:"KaraokeDisplay-audio",onEnded:this.playAnotherSong,onPause:function(){e.setState({pauseSong:!0})},onPlay:function(){e.setState({pauseSong:!1})}}),this.state.showTimer&&Object(p.jsx)("div",{className:"KaraokeDisplay-showTimer",children:Object(p.jsxs)("span",{children:["Playing next song in... "," ".concat(this.state.secs)," secs"]})}),Object(p.jsxs)("h2",{style:{marginTop:20,fontSize:24,color:"white"},children:[this.state.singer.title," by ",this.state.singer.singer]}),this.state.lrcFixer?Object(p.jsx)("div",{className:"Lyrics Lyrics-LRCFixercontainer",children:Object(p.jsx)(G,{lyrics:this.displayLyrics(),songId:this.state.singer.id})}):Object(p.jsx)("div",{className:"Lyrics Lyrics-DisplayContainer",children:this.lrcFormat()?Object(p.jsx)(V,{lyrics:this.displayLyrics(),pause:this.state.pauseSong}):Object(p.jsx)("span",{className:"Lyrics-container",children:this.displayLyrics()})}),Object(p.jsxs)("div",{className:"Lyrics-lowerSection",children:[Object(p.jsx)(x.a,{style:{marginTop:20,fontSize:12,color:"#3F51B5"},text:this.state.animatedTexts[this.state.count],speed:150,eraseDelay:150,typingDelay:150}),Object(p.jsx)(q.a,{onClick:function(){return e.toggleLrcFixer()},children:"toggle lyrics"})]})]})]})}}]),a}(n.Component));function Q(e,t){var a=Math.random()*(t-e)+e;return Math.floor(a)}var Z=a(151),$=a(74),ee=a.n($),te=a(73),ae=a.n(te),ne=(a(109),function(e){Object(o.a)(a,e);var t=Object(l.a)(a);function a(){var e;Object(i.a)(this,a);for(var n=arguments.length,s=new Array(n),r=0;r<n;r++)s[r]=arguments[r];return(e=t.call.apply(t,[this].concat(s))).state={albumName:"",singer:"",title:"",lyrics:"",videoID:"",addressID:"",isUploading:!1,progress:0},e}return Object(c.a)(a,[{key:"uploadToFirebase",value:function(){if(""!=this.state.videoID){var e,t="https://storage.googleapis.com/africariyoki-4b634.appspot.com/music/".concat(this.state.videoID,".mp3"),a="https://storage.googleapis.com/africariyoki-4b634.appspot.com/lyrics/".concat(this.state.videoID,".txt"),n=this.state.addressID;n=""==n?"http://0.0.0.0:5000":"https://"+n+".ngrok.io",m.addAfricariyoki((e={title:this.state.title,singer:this.state.singer},Object(f.a)(e,"title",this.state.title),Object(f.a)(e,"audiourl",t),Object(f.a)(e,"lyricsurl",a),Object(f.a)(e,"lyrics",this.state.lyrics),Object(f.a)(e,"id",this.state.videoID),e));fetch("".concat(n,"/vr/").concat(this.state.videoID),{method:"GET",redirect:"follow"}).then((function(e){return e.text()})).then((function(e){return console.log(e)})).catch((function(e){return console.log("error",e)}))}}},{key:"render",value:function(){var e=this;return Object(p.jsx)("div",{className:"UploadContent",style:{height:"100%"},children:Object(p.jsxs)("div",{style:{height:"100%",display:"flex",justifyContent:"center",alignItems:"center"},children:[Object(p.jsx)(ae.a,{}),Object(p.jsxs)("div",{style:{width:320,padding:30,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"},children:[Object(p.jsx)(Z.a,{style:{marginBottom:10},children:Object(p.jsx)(ee.a,{})}),Object(p.jsxs)("div",{style:{marginBottom:20,fontSize:24,textAlign:"center"},children:[" ","Upload song information"," "]}),Object(p.jsx)(b.a,{value:this.state.title,placeholder:"Song title",onChange:function(t){e.setState({title:t.target.value})}}),Object(p.jsx)(b.a,{value:this.state.singer,placeholder:"Singer",onChange:function(t){e.setState({singer:t.target.value})}}),Object(p.jsx)(b.a,{value:this.state.albumName,placeholder:"Album",onChange:function(t){e.setState({albumName:t.target.value})}}),Object(p.jsx)(b.a,{value:this.state.videoID,placeholder:"Youtube Video ID",onChange:function(t){e.setState({videoID:t.target.value})}}),Object(p.jsx)(b.a,{value:this.state.addressID,placeholder:"address ID",onChange:function(t){e.setState({addressID:t.target.value})}}),Object(p.jsx)(b.a,{style:{height:100},value:this.state.lyrics,placeholder:"Lyrics - paste lyrics here",multiline:!0,rows:4,onChange:function(t){e.setState({lyrics:t.target.value})}}),Object(p.jsx)(q.a,{style:{marginTop:20,width:200},variant:"outlined",color:"primary",onClick:function(){e.uploadToFirebase()},children:"Upload"}),this.state.wrongCred&&Object(p.jsx)("div",{style:{color:"red"},children:this.state.SignUpErrorMsg})]})]})})}}]),a}(n.Component)),se=a(17),re=(a(116),function(e){Object(o.a)(a,e);var t=Object(l.a)(a);function a(){return Object(i.a)(this,a),t.apply(this,arguments)}return Object(c.a)(a,[{key:"render",value:function(){return Object(p.jsxs)("div",{className:"App",children:[Object(p.jsx)(h,{}),Object(p.jsx)("div",{className:"App-body",children:Object(p.jsx)("div",{className:"content",children:Object(p.jsxs)(se.c,{children:[Object(p.jsx)(se.a,{path:"/africariyoki",exact:!0,component:A}),Object(p.jsx)(se.a,{path:"/africariyoki/karaokedisplay/:id",exact:!0,component:W}),Object(p.jsx)(se.a,{path:"/africariyoki/upload",exact:!0,component:ne}),Object(p.jsx)(se.a,{component:function(){return Object(p.jsx)("div",{style:{padding:20},children:"Page not found"})}})]})})})]})}}]),a}(n.Component)),ie={apiKey:"AIzaSyCIg3Xc3yYNYgXL90XXwaW2cyMafnvusYE",authDomain:"africariyoki-4b634.firebaseapp.com",databaseURL:"https://africariyoki-4b634-default-rtdb.firebaseio.com",projectId:"africariyoki-4b634",storageBucket:"africariyoki-4b634.appspot.com",messagingSenderId:"171492275085",appId:"1:171492275085:web:f2c1364b0feee41e1083c4",measurementId:"G-TSPVJ130EK"};g.a.apps.length||g.a.initializeApp(ie);var ce=Object(p.jsx)(u.a,{children:Object(p.jsx)(re,{})});window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__=!0,r.a.render(ce,document.getElementById("root"))},85:function(e,t,a){},86:function(e,t,a){},87:function(e,t,a){},96:function(e,t,a){},97:function(e,t,a){}},[[117,1,2]]]);
//# sourceMappingURL=main.aee0cc6a.chunk.js.map