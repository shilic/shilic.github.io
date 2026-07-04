import{c as I}from"./chunk-JQRUD6KW-LBLu4dMX.js";import{l as S}from"./cynefin-VYW2F7L2-2VAHYKR6-Bz7a0y1t.js";import{m as c,h as E,n as F,g as z,d as P,a as R,l as B,a2 as D,s as W,L as y,I as w,w as G,p as V,a7 as _,o as j}from"./mermaid.esm.min-D-lQNh-f.js";import"./app-CXfodF6j.js";var h={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},b={axes:[],curves:[],options:h},x=structuredClone(b),H=G.radar,U=c(()=>y({...H,...w().radar}),"getConfig"),C=c(()=>x.axes,"getAxes"),Z=c(()=>x.curves,"getCurves"),q=c(()=>x.options,"getOptions"),J=c(a=>{x.axes=a.map(t=>({name:t.name,label:t.label??t.name}))},"setAxes"),K=c(a=>{x.curves=a.map(t=>({name:t.name,label:t.label??t.name,entries:N(t.entries)}))},"setCurves"),N=c(a=>{if(a[0].axis==null)return a.map(e=>e.value);let t=C();if(t.length===0)throw new Error("Axes must be populated before curves for reference entries");return t.map(e=>{let r=a.find(i=>{var s;return((s=i.axis)==null?void 0:s.$refText)===e.name});if(r===void 0)throw new Error("Missing entry for axis "+e.label);return r.value})},"computeCurveEntries"),Q=c(a=>{var e,r,i,s,o;let t=a.reduce((l,n)=>(l[n.name]=n,l),{});x.options={showLegend:((e=t.showLegend)==null?void 0:e.value)??h.showLegend,ticks:((r=t.ticks)==null?void 0:r.value)??h.ticks,max:((i=t.max)==null?void 0:i.value)??h.max,min:((s=t.min)==null?void 0:s.value)??h.min,graticule:((o=t.graticule)==null?void 0:o.value)??h.graticule}},"setOptions"),X=c(()=>{W(),x=structuredClone(b)},"clear"),f={getAxes:C,getCurves:Z,getOptions:q,setAxes:J,setCurves:K,setOptions:Q,getConfig:U,clear:X,setAccTitle:B,getAccTitle:R,setDiagramTitle:P,getDiagramTitle:z,getAccDescription:F,setAccDescription:E},Y=c(a=>{I(a,f);let{axes:t,curves:e,options:r}=a;f.setAxes(t),f.setCurves(e),f.setOptions(r)},"populate"),tt={parse:c(async a=>{let t=await S("radar",a);V.debug(t),Y(t)},"parse")},et=c((a,t,e,r)=>{let i=r.db,s=i.getAxes(),o=i.getCurves(),l=i.getOptions(),n=i.getConfig(),d=i.getDiagramTitle(),p=D(t),g=at(p,n),u=l.max??Math.max(...o.map(v=>Math.max(...v.entries))),m=l.min,$=Math.min(n.width,n.height)/2;rt(g,s,$,l.ticks,l.graticule),it(g,s,$,n),L(g,s,o,m,u,l.graticule,n),k(g,o,l.showLegend,n),g.append("text").attr("class","radarTitle").text(d).attr("x",0).attr("y",-n.height/2-n.marginTop)},"draw"),at=c((a,t)=>{let e=t.width+t.marginLeft+t.marginRight,r=t.height+t.marginTop+t.marginBottom,i={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return j(a,r,e,t.useMaxWidth??!0),a.attr("viewBox",`0 0 ${e} ${r}`).attr("overflow","visible"),a.append("g").attr("transform",`translate(${i.x}, ${i.y})`)},"drawFrame"),rt=c((a,t,e,r,i)=>{if(i==="circle")for(let s=0;s<r;s++){let o=e*(s+1)/r;a.append("circle").attr("r",o).attr("class","radarGraticule")}else if(i==="polygon"){let s=t.length;for(let o=0;o<r;o++){let l=e*(o+1)/r,n=t.map((d,p)=>{let g=2*p*Math.PI/s-Math.PI/2,u=l*Math.cos(g),m=l*Math.sin(g);return`${u},${m}`}).join(" ");a.append("polygon").attr("points",n).attr("class","radarGraticule")}}},"drawGraticule"),it=c((a,t,e,r)=>{let i=t.length;for(let s=0;s<i;s++){let o=t[s].label,l=2*s*Math.PI/i-Math.PI/2,n=Math.cos(l),d=Math.sin(l);a.append("line").attr("x1",0).attr("y1",0).attr("x2",e*r.axisScaleFactor*n).attr("y2",e*r.axisScaleFactor*d).attr("class","radarAxisLine");let p=n>.01?"start":n<-.01?"end":"middle",g=d>.01?"hanging":d<-.01?"auto":"central",u=4;a.append("text").text(o).attr("x",e*r.axisLabelFactor*n+u*n).attr("y",e*r.axisLabelFactor*d+u*d).attr("text-anchor",p).attr("dominant-baseline",g).attr("class","radarAxisLabel")}},"drawAxes");function L(a,t,e,r,i,s,o){let l=t.length,n=Math.min(o.width,o.height)/2;e.forEach((d,p)=>{if(d.entries.length!==l)return;let g=d.entries.map((u,m)=>{let $=2*Math.PI*m/l-Math.PI/2,v=M(u,r,i,n),A=v*Math.cos($),O=v*Math.sin($);return{x:A,y:O}});s==="circle"?a.append("path").attr("d",T(g,o.curveTension)).attr("class",`radarCurve-${p}`):s==="polygon"&&a.append("polygon").attr("points",g.map(u=>`${u.x},${u.y}`).join(" ")).attr("class",`radarCurve-${p}`)})}c(L,"drawCurves");function M(a,t,e,r){let i=Math.min(Math.max(a,t),e);return r*(i-t)/(e-t)}c(M,"relativeRadius");function T(a,t){let e=a.length,r=`M${a[0].x},${a[0].y}`;for(let i=0;i<e;i++){let s=a[(i-1+e)%e],o=a[i],l=a[(i+1)%e],n=a[(i+2)%e],d={x:o.x+(l.x-s.x)*t,y:o.y+(l.y-s.y)*t},p={x:l.x-(n.x-o.x)*t,y:l.y-(n.y-o.y)*t};r+=` C${d.x},${d.y} ${p.x},${p.y} ${l.x},${l.y}`}return`${r} Z`}c(T,"closedRoundCurve");function k(a,t,e,r){if(!e)return;let i=(r.width/2+r.marginRight)*3/4,s=-(r.height/2+r.marginTop)*3/4,o=20;t.forEach((l,n)=>{let d=a.append("g").attr("transform",`translate(${i}, ${s+n*o})`);d.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${n}`),d.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(l.label)})}c(k,"drawLegend");var st={draw:et},lt=c((a,t)=>{let e="";for(let r=0;r<a.THEME_COLOR_LIMIT;r++){let i=a[`cScale${r}`];e+=`
		.radarCurve-${r} {
			color: ${i};
			fill: ${i};
			fill-opacity: ${t.curveOpacity};
			stroke: ${i};
			stroke-width: ${t.curveStrokeWidth};
		}
		.radarLegendBox-${r} {
			fill: ${i};
			fill-opacity: ${t.curveOpacity};
			stroke: ${i};
		}
		`}return e},"genIndexStyles"),nt=c(a=>{let t=_(),e=w(),r=y(t,e.themeVariables),i=y(r.radar,a);return{themeVariables:r,radarOptions:i}},"buildRadarStyleOptions"),ot=c(({radar:a}={})=>{let{themeVariables:t,radarOptions:e}=nt(a);return`
	.radarTitle {
		font-size: ${t.fontSize};
		color: ${t.titleColor};
		dominant-baseline: hanging;
		text-anchor: middle;
	}
	.radarAxisLine {
		stroke: ${e.axisColor};
		stroke-width: ${e.axisStrokeWidth};
	}
	.radarAxisLabel {
		font-size: ${e.axisLabelFontSize}px;
		color: ${e.axisColor};
	}
	.radarGraticule {
		fill: ${e.graticuleColor};
		fill-opacity: ${e.graticuleOpacity};
		stroke: ${e.graticuleColor};
		stroke-width: ${e.graticuleStrokeWidth};
	}
	.radarLegendText {
		text-anchor: start;
		font-size: ${e.legendFontSize}px;
		dominant-baseline: hanging;
	}
	${lt(t,e)}
	`},"styles"),ut={parser:tt,db:f,renderer:st,styles:ot};export{ut as diagram};
