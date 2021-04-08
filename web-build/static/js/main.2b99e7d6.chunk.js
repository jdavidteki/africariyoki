(this["webpackJsonpreact-karaoke-challenge"]=this["webpackJsonpreact-karaoke-challenge"]||[]).push([[0],{107:function(t,e,n){},110:function(t,e,n){},112:function(t,e,n){},113:function(t,e,n){},114:function(t,e,n){},121:function(t,e,n){},122:function(t,e,n){"use strict";n.r(e);var a=n(1),s=n(16),r=n.n(s),i=(n(93),n(94),n(20)),c=n(23),o=n(25),l=n(24),u=(n(95),n(43)),d=n(4),h=function(t){Object(o.a)(n,t);var e=Object(l.a)(n);function n(){return Object(i.a)(this,n),e.apply(this,arguments)}return Object(c.a)(n,[{key:"render",value:function(){return Object(d.jsxs)("div",{className:"Header",children:[Object(d.jsx)(u.b,{style:{fontWeight:900,textDecoration:"none",color:"green"},to:"/africariyoki",children:"africariyoki!"}),Object(d.jsx)("div",{className:"right-part",children:Object(d.jsx)(u.b,{variant:"outlined",style:{marginRight:20,fontSize:18},color:"primary",to:"/africariyoki/upload",children:"upload"})})]})}}]),n}(a.Component),p=n(64),y=(a.Component,function(t){return Object(d.jsxs)("tr",{className:"song",children:[Object(d.jsx)("td",{children:t.song.title}),Object(d.jsx)("td",{children:t.song.singer}),Object(d.jsx)("td",{children:Object(d.jsx)("button",{onClick:function(){return t.playSong(t.song.id)},children:"Play"})})]})}),f=function(t){return Object(d.jsx)("table",{className:"song-list",children:Object(d.jsx)("tbody",{children:t.songs.map((function(e){return Object(d.jsx)(y,{song:e,playSong:t.playSong},e.id)}))})})},g=n(34),j=n(35),m=new function t(){Object(i.a)(this,t),this.getLyrics=function(){return new Promise((function(t){j.a.database().ref("/lyrics/").once("value").then((function(e){e.val()?t(Object.values(e.val())):t({})}))}))},this.storage=function(){return j.a.storage()},this.deleteRecp=function(t,e){return new Promise((function(n){j.a.database().ref("/recipients/"+t).child(e).remove().then((function(){n(!0)}))}))},this.addAfricariyoki=function(t){return new Promise((function(e){j.a.database().ref("/lyrics/"+t.id+"/").set(Object(g.a)({id:t.id,title:t.title,lyricsurl:t.lyricsurl,singer:t.singer,audiourl:t.audiourl,lyrics:t.lyrics},"title",t.title)).then((function(t){e(!0)})).catch((function(t){console.warn("error",t)}))}))},this.updateLyrics=function(t,e){return new Promise((function(n){j.a.database().ref("/lyrics/"+t+"/").update({lyrics:e}).then((function(t){console.log("reposne",t),n(!0)})).catch((function(t){console.log("error",t)}))}))},this.postTransaction=function(t,e,n,a){return new Promise((function(s){j.a.database().ref("/userTransactions/"+t.user.uid+"/"+a.id+"/").set({transactionId:a.id,accountNumber:e.accountNumber,bankName:e.bankName,recpFirstName:e.firstName,recpLastName:e.lastName,cardUsed:n.number,recpAmt:a.recpAmt,sendAmt:a.sendAmt,recpCurrency:a.recpCurrency,sendCurrency:a.sendCurrency,rate:a.rate,isSuccessful:!0,time:"13:03"}).then((function(t){s(!0)})).catch((function(t){console.warn("error",t)}))}))}},b=n(161),v=n(56),O=n.n(v),x=n(162),S=(n(107),function(t){Object(o.a)(n,t);var e=Object(l.a)(n);function n(t){var a;return Object(i.a)(this,n),(a=e.call(this,t)).filterSong=function(t){var e=a.state.songsCopy.filter((function(e){return t.replace(" ","").toLowerCase()===e.title.replace(" ","").toLowerCase()}));""==t?a.setState({songs:a.state.songsCopy}):a.setState({songs:e})},a.playSong=function(t){var e=a.state.songs.filter((function(e){return t===e.id}));a.props.history.push({pathname:"/africariyoki/karaokedisplay/"+t,state:{chooseSong:e,songs:a.state.songsCopy}}),a.setState({songs:e,currentSong:e})},a.state={songs:[],filteredSongs:"",currentSong:"",songsCopy:[],searchOptions:[],typingEffectSongs:[""],count:0},a.searchTerm="",a}return Object(c.a)(n,[{key:"componentDidMount",value:function(){var t=this;m.getLyrics().then((function(e){var n=function(t){for(var e=t.length-1;e>0;e--){var n=Math.floor(Math.random()*(e+1)),a=[t[n],t[e]];t[e]=a[0],t[n]=a[1]}return t}(e.map((function(t){return t.title})));t.setState({songs:e,songsCopy:e,searchOptions:n,typingEffectSongs:n,songIds:e.map((function(t){return t.id}))})})),setInterval((function(){t.setState({count:(t.state.count+1)%20})}),4e3)}},{key:"render",value:function(){var t=this;return Object(d.jsx)("div",{className:"Searcher",children:Object(d.jsxs)("div",{className:"Searcher-container",children:[Object(d.jsx)(x.a,{id:"controllable-states-demo",value:this.searchTerm,options:this.state.searchOptions,renderInput:function(t){return Object(d.jsx)(b.a,Object(p.a)(Object(p.a)({},t),{},{className:"Searcher-input",label:"what do you want to sing today",variant:"outlined"}))},onInputChange:function(e,n){t.searchTerm=n},onChange:function(e,n){t.filterSong(t.searchTerm)},onKeyUp:function(e){"Enter"===e.key&&t.filterSong(t.searchTerm)}}),Object(d.jsx)(f,{songs:this.state.songs,filteredSongs:this.state.filteredSongs,playSong:this.playSong}),Object(d.jsx)(O.a,{style:{marginTop:50,fontSize:24,color:"#3F51B5"},text:this.state.typingEffectSongs.slice(0,20)[this.state.count],speed:150,eraseDelay:150,typingDelay:150})]})})}}]),n}(a.Component));var k=n(65),w=n.n(k),C=n(76),L=(n(110),n(77)),N=n.n(L),I=n(50),T=n.n(I),D=n(78),P=n.n(D);n(112);function A(t){return t.replace(/[^\w\s]/gi,"").toLowerCase().replace("by rentanadvisercom","***")}var F,E=function(t){Object(o.a)(n,t);var e=Object(l.a)(n);function n(t){var a;return Object(i.a)(this,n),(a=e.call(this,t)).onPlayFunction=function(t,e){a.setState({lineNumber:t,currentLine:e})},a.onSetLyricFunction=function(t){a.setState({arrayLyrics:t})},a.updateTimer=function(){setInterval((function(){var t=a.state.eventDate;a.props.pause?a.state.lrc.pause():(t=t.add(1,"s"),a.state.lrc.play(6e4*t.minutes()+1e3*t.seconds()),a.setState({eventDate:t}))}),1e3)},a.state={title:"hersss",lineNumber:1,prevLine:"",currentLine:"",nextLine:"",arrayLyrics:[],eventDate:T.a.duration().add({days:0,hours:0,minutes:0,seconds:0}),lrc:new P.a({onPlay:a.onPlayFunction,onSetLyric:a.onSetLyricFunction,offset:15e3})},a}return Object(c.a)(n,[{key:"componentDidMount",value:function(){this.updateTimer(),this.state.lrc.setLyric(this.props.lyrics),this.state.lrc.play(0)}},{key:"render",value:function(){return Object(d.jsxs)("div",{className:"Lyrics-container LRCParser-container",children:[this.state.arrayLyrics[this.state.lineNumber-1]&&Object(d.jsx)("p",{children:A(this.state.arrayLyrics[this.state.lineNumber-1].text)}),Object(d.jsx)("p",{className:"LRCParser-currentLine",children:A(this.state.currentLine)}),this.state.arrayLyrics[this.state.lineNumber+1]&&Object(d.jsx)("p",{children:A(this.state.arrayLyrics[this.state.lineNumber+1].text)})]})}}]),n}(a.Component),M=n(160);n(113);var U=function(t){Object(o.a)(n,t);var e=Object(l.a)(n);function n(t){var a;return Object(i.a)(this,n),(a=e.call(this,t)).handleChange=function(t){a.setState({lyrics:t.target.value})},a.state={songId:t.songId,lyrics:t.lyrics,lyricsArrayClean:[],noTimeStamp:0},a}return Object(c.a)(n,[{key:"updateLyrics",value:function(){1==confirm("are you sure?")&&("saving lrc to firebase...",m.updateLyrics(this.state.songId,this.state.lyrics))}},{key:"componentDidMount",value:function(){!function(t){if("undefined"==typeof YT||"undefined"==typeof YT.Player){var e=document.createElement("script");e.src="https://www.youtube.com/iframe_api";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)}setTimeout((function(){!function(t){F=new YT.Player("video-placeholder",{width:600,height:400,videoId:t,playerVars:{color:"white"}})}(t)}),1e3)}(this.state.songId);var t=this.state.lyrics;t=t.replace(/\d\d:\d\d.\d\d/gm,"").replace(/[^\w\s]/gi,""),this.setState({lyrics:t});for(var e=t.split("\n"),n=[],a=0;a<e.length;a++)" "!=e[a]&&n.push(e[a].trim());this.setState({lyricsArrayClean:n})}},{key:"timeStamp",value:function(){var t=this;this.setState({noTimeStamp:this.state.noTimeStamp+1},(function(){var e=t.state.lyricsArrayClean,n=e[t.state.noTimeStamp-1];n="[".concat(function(t){t=Math.round(t);var e=Math.floor(t/60),n=t-60*e;return"0"+e+":"+(n=n<10?"0"+n:n)+".00"}(F.getCurrentTime()),"]").concat(n),e[t.state.noTimeStamp-1]=n,t.setState({lyricsArrayClean:e,lyrics:e.join(" \n")})}))}},{key:"render",value:function(){var t=this;return Object(d.jsxs)("div",{className:"LRCFixer",children:[Object(d.jsx)("div",{id:"video-placeholder",style:{width:"100%"}}),Object(d.jsx)("textarea",{className:"Lyrics-container",onChange:this.handleChange,value:this.state.lyrics}),Object(d.jsxs)("div",{children:[Object(d.jsx)(M.a,{onClick:function(){return t.timeStamp()},children:"time stamp!"}),Object(d.jsx)(M.a,{onClick:function(){return t.updateLyrics()},children:"update lyrics"})]})]})}}]),n}(a.Component),Y=function(t){Object(o.a)(n,t);var e=Object(l.a)(n);function n(){var t;Object(i.a)(this,n);for(var a=arguments.length,s=new Array(a),r=0;r<a;r++)s[r]=arguments[r];return(t=e.call.apply(e,[this].concat(s))).state={singer:t.props.location.state.chooseSong[0],animatedTexts:[t.props.location.state.chooseSong[0].title,t.props.location.state.chooseSong[0].singer,t.props.location.state.chooseSong[0].album],showTimer:!1,count:0,eventDate:T.a.duration().add({days:0,hours:0,minutes:0,seconds:5}),secs:0,pauseSong:!1,lrcFixer:!1},t.updateTimer=function(){var e=setInterval((function(){var n=t.state.eventDate;if(n<=0){var a=_(0,t.props.location.state.songs.length);t.setState({singer:t.props.location.state.songs[a],animatedTexts:[t.props.location.state.songs[a].title,t.props.location.state.songs[a].singer,t.props.location.state.songs[a].album],count:0,eventDate:T.a.duration().add({days:0,hours:0,minutes:0,seconds:5}),secs:0,showTimer:!1},(function(){window.history.pushState({},"update","".concat(t.state.singer.id))})),clearInterval(e)}else{var s=(n=n.subtract(1,"s")).seconds();t.setState({secs:s,eventDate:n,showTimer:!0})}}),1e3)},t.playAnotherSong=function(){t.updateTimer()},t}return Object(c.a)(n,[{key:"componentDidMount",value:function(){var t=Object(C.a)(w.a.mark((function t(){var e=this;return w.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:setInterval((function(){e.setState({count:(e.state.count+1)%2})}),5e3);case 1:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}()},{key:"displayLyrics",value:function(){for(var t=this.state.singer.lyrics.replace('b"',""),e="",n="",a=0;a<t.length;a++)"\\"==t[a]?(e+=" \n ",n="t"):"t"==n?e+=t[a+1]:(e+=t[a],n="");return e.toLowerCase().replace("by rentanadvisercom","***")}},{key:"lrcFormat",value:function(){return this.state.singer.lyrics.includes("[00")}},{key:"toggleLrcFixer",value:function(){var t=prompt("Please enter master password","");null!=t&&"1226"==t?this.state.lrcFixer?this.setState({lrcFixer:!1}):this.setState({lrcFixer:!0}):alert("sorry, invalid password")}},{key:"render",value:function(){var t=this;if(this.props)return Object(d.jsxs)("div",{className:"KaraokeDisplay-container",children:[!this.state.lrcFixer&&Object(d.jsx)(N.a,{src:this.state.singer.audiourl.includes("africariyoki-4b634")?this.state.singer.audiourl:this.state.singer.audiourl.replace("africariyoki","africariyoki-4b634"),autoPlay:!0,controls:!0,controlsList:"nodownload",className:"KaraokeDisplay-audio",onEnded:this.playAnotherSong,onPause:function(){t.setState({pauseSong:!0})},onPlay:function(){t.setState({pauseSong:!1})}}),this.state.showTimer&&Object(d.jsx)("div",{className:"KaraokeDisplay-showTimer",children:Object(d.jsxs)("span",{children:["Playing next song in... "," ".concat(this.state.secs)," secs"]})}),Object(d.jsxs)("h2",{children:[this.state.singer.title," by ",this.state.singer.singer]}),this.state.lrcFixer?Object(d.jsx)("div",{className:"Lyrics",children:Object(d.jsx)(U,{lyrics:this.displayLyrics(),songId:this.state.singer.id})}):Object(d.jsx)("pre",{className:"Lyrics",children:this.lrcFormat()?Object(d.jsx)(E,{lyrics:this.displayLyrics(),pause:this.state.pauseSong}):Object(d.jsx)("span",{className:"Lyrics-container",children:this.displayLyrics()})}),Object(d.jsxs)("div",{className:"Lyrics-lowerSection",children:[Object(d.jsx)(O.a,{style:{marginTop:20,fontSize:24,color:"#3F51B5"},text:this.state.animatedTexts[this.state.count],speed:150,eraseDelay:150,typingDelay:150}),Object(d.jsx)(M.a,{onClick:function(){return t.toggleLrcFixer()},children:"toggle lyrics display"})]})]})}}]),n}(a.Component);function _(t,e){var n=Math.random()*(e-t)+t;return Math.floor(n)}var B=n(163),R=n(80),z=n.n(R),K=n(79),X=n.n(K),V=(n(114),function(t){Object(o.a)(n,t);var e=Object(l.a)(n);function n(){var t;Object(i.a)(this,n);for(var a=arguments.length,s=new Array(a),r=0;r<a;r++)s[r]=arguments[r];return(t=e.call.apply(e,[this].concat(s))).state={albumName:"",singer:"",title:"",lyrics:"",videoID:"",addressID:"",isUploading:!1,progress:0},t}return Object(c.a)(n,[{key:"uploadToFirebase",value:function(){if(""!=this.state.videoID){var t,e="https://storage.googleapis.com/africariyoki-4b634.appspot.com/music/".concat(this.state.videoID,".mp3"),n="https://storage.googleapis.com/africariyoki-4b634.appspot.com/lyrics/".concat(this.state.videoID,".txt"),a=this.state.addressID;a=""==a?"http://0.0.0.0:5000":"https://"+a+".ngrok.io",m.addAfricariyoki((t={title:this.state.title,singer:this.state.singer},Object(g.a)(t,"title",this.state.title),Object(g.a)(t,"audiourl",e),Object(g.a)(t,"lyricsurl",n),Object(g.a)(t,"lyrics",this.state.lyrics),Object(g.a)(t,"id",this.state.videoID),t));fetch("".concat(a,"/vr/").concat(this.state.videoID),{method:"GET",redirect:"follow"}).then((function(t){return t.text()})).then((function(t){return console.log(t)})).catch((function(t){return console.log("error",t)}))}}},{key:"render",value:function(){var t=this;return Object(d.jsx)("div",{style:{height:"100%"},children:Object(d.jsxs)("div",{style:{height:"100%",display:"flex",justifyContent:"center",alignItems:"center"},children:[Object(d.jsx)(X.a,{}),Object(d.jsxs)("div",{style:{width:320,padding:30,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"},children:[Object(d.jsx)(B.a,{style:{marginBottom:10},children:Object(d.jsx)(z.a,{})}),Object(d.jsxs)("div",{style:{marginBottom:20,fontSize:24,textAlign:"center"},children:[" ","Upload song information"," "]}),Object(d.jsx)(b.a,{value:this.state.title,placeholder:"Song title",onChange:function(e){t.setState({title:e.target.value})}}),Object(d.jsx)(b.a,{value:this.state.singer,placeholder:"Singer",onChange:function(e){t.setState({singer:e.target.value})}}),Object(d.jsx)(b.a,{value:this.state.albumName,placeholder:"Album",onChange:function(e){t.setState({albumName:e.target.value})}}),Object(d.jsx)(b.a,{value:this.state.videoID,placeholder:"Youtube Video ID",onChange:function(e){t.setState({videoID:e.target.value})}}),Object(d.jsx)(b.a,{value:this.state.addressID,placeholder:"address ID",onChange:function(e){t.setState({addressID:e.target.value})}}),Object(d.jsx)(b.a,{style:{height:100},value:this.state.lyrics,placeholder:"Lyrics - paste lyrics here",multiline:!0,rows:4,onChange:function(e){t.setState({lyrics:e.target.value})}}),Object(d.jsx)(M.a,{style:{marginTop:20,width:200},variant:"outlined",color:"primary",onClick:function(){t.uploadToFirebase()},children:"Upload"}),this.state.wrongCred&&Object(d.jsx)("div",{style:{color:"red"},children:this.state.SignUpErrorMsg})]})]})})}}]),n}(a.Component)),G=n(18),J=(n(121),function(t){Object(o.a)(n,t);var e=Object(l.a)(n);function n(){return Object(i.a)(this,n),e.apply(this,arguments)}return Object(c.a)(n,[{key:"render",value:function(){return Object(d.jsxs)("div",{className:"app",children:[Object(d.jsx)(h,{}),Object(d.jsx)("div",{className:"app-body",children:Object(d.jsx)("div",{className:"content",children:Object(d.jsxs)(G.c,{children:[Object(d.jsx)(G.a,{path:"/africariyoki",exact:!0,component:S}),Object(d.jsx)(G.a,{path:"/africariyoki/karaokedisplay/:id",exact:!0,component:Y}),Object(d.jsx)(G.a,{path:"/africariyoki/upload",exact:!0,component:V}),Object(d.jsx)(G.a,{component:function(){return Object(d.jsx)("div",{style:{padding:20},children:"Page not found"})}})]})})})]})}}]),n}(a.Component)),H={apiKey:"AIzaSyCIg3Xc3yYNYgXL90XXwaW2cyMafnvusYE",authDomain:"africariyoki-4b634.firebaseapp.com",databaseURL:"https://africariyoki-4b634-default-rtdb.firebaseio.com",projectId:"africariyoki-4b634",storageBucket:"africariyoki-4b634.appspot.com",messagingSenderId:"171492275085",appId:"1:171492275085:web:f2c1364b0feee41e1083c4",measurementId:"G-TSPVJ130EK"};j.a.apps.length||j.a.initializeApp(H);var W=Object(d.jsx)(u.a,{children:Object(d.jsx)(J,{})});window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__=!0,r.a.render(W,document.getElementById("root"))},93:function(t,e,n){},94:function(t,e,n){},95:function(t,e,n){}},[[122,1,2]]]);
//# sourceMappingURL=main.2b99e7d6.chunk.js.map