"use client";

import PublicHome from "./public-home";
import { useEffect, useMemo, useState, type FormEvent, type MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowDownLeft, ArrowRight, ArrowUpRight,
  Bookmark, Building2, Check, ChevronDown, ChevronRight, CircleHelp,
  Compass, Crosshair, GraduationCap, HeartPulse, Leaf, LocateFixed, Map,
  MapPin, Menu, Moon, MoreHorizontal, Navigation, Plus, Search, Settings2,
  Shield, Sun, Trees, Utensils, X,
} from "lucide-react";

type Place = { name: string; type: string; area: string; time: string; distance: string; icon: "class" | "library" | "food" | "health" | "office"; x: number; y: number };

const places: Place[] = [
  { name: "Lecture Hall 2", type: "Lecture hall", area: "School of Engineering", time: "6 min walk", distance: "420 m", icon: "class", x: 57, y: 40 },
  { name: "UENR Main Library", type: "Library", area: "University Avenue", time: "8 min walk", distance: "560 m", icon: "library", x: 73, y: 62 },
  { name: "ICT Centre", type: "Academic services", area: "Knowledge Park", time: "4 min walk", distance: "280 m", icon: "office", x: 43, y: 63 },
  { name: "Student Cafeteria", type: "Food & drink", area: "Campus Green", time: "3 min walk", distance: "190 m", icon: "food", x: 34, y: 40 },
  { name: "Campus Clinic", type: "Health & safety", area: "North Campus", time: "9 min walk", distance: "680 m", icon: "health", x: 79, y: 29 },
  { name: "School of Natural Resources", type: "Faculty building", area: "Forest Walk", time: "7 min walk", distance: "510 m", icon: "office", x: 26, y: 68 },
  { name: "Administration Block", type: "University offices", area: "Central Campus", time: "5 min walk", distance: "350 m", icon: "office", x: 63, y: 77 },
];

const iconFor = (kind: Place["icon"]) => {
  if (kind === "library") return <Bookmark size={16} />;
  if (kind === "food") return <Utensils size={16} />;
  if (kind === "health") return <HeartPulse size={16} />;
  if (kind === "office") return <Building2 size={16} />;
  return <GraduationCap size={16} />;
};

function CampusMap({ selected, routeOn, adding, customPlaces, zoom, onZoom, onPick, onAdd }: { selected: Place; routeOn: boolean; adding: boolean; customPlaces: Place[]; zoom: number; onZoom: (zoom:number) => void; onPick: (p: Place) => void; onAdd: (point: {x:number;y:number}) => void }) {
  const handleMapClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!adding) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.round(((event.clientX - bounds.left) / bounds.width) * 100);
    const y = Math.round(((event.clientY - bounds.top) / bounds.height) * 100);
    onAdd({x,y});
  };
  return <div className={`map-canvas ${adding ? "map-adding" : ""}`} onClick={handleMapClick}>
    <svg className="map-art" style={{transform:`scale(${zoom})`}} viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="1000" height="700" fill="#e9f0e3" />
      <path d="M-30 280 C120 220 165 320 280 275 S455 235 550 300 S760 340 1030 260" fill="none" stroke="#b6dce4" strokeWidth="78" opacity=".85" />
      <path d="M-30 280 C120 220 165 320 280 275 S455 235 550 300 S760 340 1030 260" fill="none" stroke="#d3eef0" strokeWidth="64" />
      <path d="M90 -30 C180 120 155 220 260 345 S370 470 340 730" fill="none" stroke="#fffdf5" strokeWidth="40" />
      <path d="M90 -30 C180 120 155 220 260 345 S370 470 340 730" fill="none" stroke="#dce2d1" strokeWidth="2" strokeDasharray="7 9" />
      <path d="M690 -30 C620 105 690 180 600 310 S540 510 690 730" fill="none" stroke="#fffdf5" strokeWidth="36" />
      <path d="M690 -30 C620 105 690 180 600 310 S540 510 690 730" fill="none" stroke="#dce2d1" strokeWidth="2" strokeDasharray="7 9" />
      <path d="M-30 510 C160 460 260 535 425 490 S740 420 1030 490" fill="none" stroke="#fffdf5" strokeWidth="34" />
      <path d="M-30 510 C160 460 260 535 425 490 S740 420 1030 490" fill="none" stroke="#dce2d1" strokeWidth="2" strokeDasharray="7 9" />
      <path d="M430 0 C400 110 470 180 430 280 S430 420 460 700" fill="none" stroke="#fffdf5" strokeWidth="24" />
      <path d="M430 0 C400 110 470 180 430 280 S430 420 460 700" fill="none" stroke="#dce2d1" strokeWidth="2" strokeDasharray="7 9" />
      <g fill="#bed1aa" opacity=".72"><path d="M20 35h205v93H20z"/><path d="M755 46h218v130H755z"/><path d="M36 560h205v105H36z"/><path d="M750 550h205v125H750z"/><path d="M440 55h130v74H440z"/><path d="M810 360h150v82H810z"/></g>
      <g fill="#d8dfca"><rect x="270" y="80" width="105" height="68" rx="9"/><rect x="472" y="150" width="130" height="74" rx="9"/><rect x="310" y="365" width="122" height="76" rx="9"/><rect x="710" y="214" width="112" height="68" rx="9"/><rect x="748" y="443" width="104" height="70" rx="9"/><rect x="500" y="535" width="115" height="80" rx="9"/></g>
      <g fill="#fff" stroke="#d9e0d2" strokeWidth="2"><rect x="354" y="160" width="108" height="72" rx="8"/><rect x="636" y="84" width="96" height="72" rx="8"/><rect x="530" y="365" width="124" height="82" rx="8"/><rect x="115" y="366" width="116" height="75" rx="8"/><rect x="700" y="530" width="90" height="72" rx="8"/><rect x="818" y="195" width="94" height="70" rx="8"/><rect x="498" y="70" width="95" height="62" rx="8"/><rect x="860" y="475" width="70" height="58" rx="8"/></g>
      <g fontFamily="Inter, sans-serif" fontSize="13" fill="#65806c" fontWeight="600"><text x="80" y="190">CAMPUS GREEN</text><text x="360" y="315">UNIVERSITY AVENUE</text><text x="740" y="340">KNOWLEDGE PARK</text><text x="100" y="485">FOREST WALK</text><text x="450" y="655">SCHOOL OF ENGINEERING</text></g>
      <g fill="#8eaf79"><circle cx="86" cy="355" r="12"/><circle cx="102" cy="370" r="8"/><circle cx="260" cy="190" r="9"/><circle cx="290" cy="210" r="13"/><circle cx="880" cy="400" r="11"/><circle cx="900" cy="420" r="8"/><circle cx="690" cy="635" r="12"/><circle cx="720" cy="650" r="9"/><circle cx="480" cy="275" r="10"/><circle cx="500" cy="292" r="8"/><circle cx="195" cy="140" r="10"/><circle cx="210" cy="160" r="7"/></g>
      {routeOn && <path d={`M520 483 C510 440 ${selected.x * 10 - 85} ${selected.y * 7 + 100} ${selected.x * 10} ${selected.y * 7}`} fill="none" stroke="#0B7A3B" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />}
    </svg>
    <div className="map-label label-library"><span className="map-building"><Bookmark size={14}/></span><span>MAIN LIBRARY</span></div>
    <div className="map-label label-ict"><span className="map-building"><Building2 size={14}/></span><span>ICT CENTRE</span></div>
    <div className="map-label label-cafe"><span className="map-building"><Utensils size={14}/></span><span>CAFETERIA</span></div>
    <div className="map-label label-lh"><span className="map-building"><GraduationCap size={14}/></span><span>LECTURE HALL 2</span></div>
    <div className="map-start"><span className="start-pulse"/><span className="start-core"/></div>
    <button className="destination-pin" style={{ left: `${selected.x}%`, top: `${selected.y}%` }} aria-label={`${selected.name} destination`} onClick={(e) => { e.stopPropagation(); onPick(selected); }}><MapPin size={19} fill="currentColor"/><span className="pin-label">{selected.name}</span></button>
    {customPlaces.filter((place)=>place.name!==selected.name).map((place)=><button key={place.name} className="destination-pin custom-pin" style={{left:`${place.x}%`,top:`${place.y}%`}} aria-label={place.name} onClick={(e)=>{e.stopPropagation();onPick(place)}}><MapPin size={17} fill="currentColor"/><span className="pin-label">{place.name}</span></button>)}
    <div className="map-scale"><span/> 100 m</div>
    {adding && <div className="map-tip"><Plus size={14}/> Tap the map to place a pin</div>}
    <div className="map-controls"><button aria-label="Zoom in" onClick={()=>onZoom(Math.min(zoom+0.15,1.75))}><Plus size={17}/></button><button aria-label="Zoom out" onClick={()=>onZoom(Math.max(zoom-0.15,1))}><span className="minus">−</span></button><span className="control-rule"/><button aria-label="Reset map view" onClick={()=>onZoom(1)}><Crosshair size={16}/></button></div>
  </div>;
}

function LegacyHome() {
  const [selected, setSelected] = useState(places[0]);
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [routeOn, setRouteOn] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [travelMode, setTravelMode] = useState("Walk");
  const [dark, setDark] = useState(false);
  const [activeTab, setActiveTab] = useState("Explore");
  const [savedPlaces, setSavedPlaces] = useState<string[]>([]);
  const saved = savedPlaces.includes(selected.name);
  const [adding, setAdding] = useState(false);
  const [customPlaces, setCustomPlaces] = useState<Place[]>([]);
  const [pendingPoint, setPendingPoint] = useState<{x:number;y:number}|null>(null);
  const [placeName, setPlaceName] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const allPlaces = useMemo(() => [...places, ...customPlaces], [customPlaces]);
  useEffect(() => {
    const storedPlaces = window.localStorage.getItem("uenr-saved-places");
    if (storedPlaces) {
      try { setSavedPlaces(JSON.parse(storedPlaces) as string[]); } catch { setSavedPlaces([]); }
    }
    const storedCustomPlaces = window.localStorage.getItem("uenr-custom-places");
    if (storedCustomPlaces) {
      try { setCustomPlaces(JSON.parse(storedCustomPlaces) as Place[]); } catch { setCustomPlaces([]); }
    }
    setDark(window.localStorage.getItem("uenr-theme") === "dark");
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem("uenr-saved-places", JSON.stringify(savedPlaces));
  }, [hydrated, savedPlaces]);
  useEffect(() => { if (hydrated) window.localStorage.setItem("uenr-theme", dark ? "dark" : "light"); }, [dark, hydrated]);
  useEffect(() => { if (hydrated) window.localStorage.setItem("uenr-custom-places", JSON.stringify(customPlaces)); }, [customPlaces, hydrated]);
  const filtered = useMemo(() => allPlaces.filter((place) => `${place.name} ${place.type} ${place.area}`.toLowerCase().includes(query.toLowerCase())), [allPlaces, query]);
  const choose = (place: Place) => { setSelected(place); setQuery(place.name); setShowResults(false); setRouteOn(true); setActiveTab("Explore"); };
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2400); };
  const addPin = () => { setAdding((value) => !value); if (!adding) notify("Tap anywhere on the map to add a place"); };
  const savePin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pendingPoint || !placeName.trim()) return;
    const place: Place = { name: placeName.trim(), type: "Campus place", area: "Added by student", time: "6 min walk", distance: "400 m", icon: "office", ...pendingPoint };
    setCustomPlaces((current) => [...current, place]);
    choose(place);
    setPendingPoint(null);
    setPlaceName("");
    notify("Place saved on this device");
  };
  return <main className={`app-shell ${dark ? "theme-dark" : ""}`}>
    <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
      <a className="brand" href="#" aria-label="UENR Compass home"><span className="brand-mark"><img src="/uenr-crest.png" alt=""/></span><span><strong>UENR</strong><small>Compass</small></span></a>
      <div className="sidebar-section"><span className="section-label">CAMPUS</span>
        {[{label:"Explore",icon:<Map size={18}/>},{label:"Directory",icon:<Building2 size={18}/>},{label:"Saved places",icon:<Bookmark size={18}/>}].map(item=><button key={item.label} className={`side-link ${activeTab===item.label?"side-active":""}`} onClick={()=>{setActiveTab(item.label);setMobileMenu(false);}}>{item.icon}<span>{item.label}</span>{item.label==="Saved places"&&savedPlaces.length>0&&<i className="saved-dot"/>}</button>)}
      </div>
      <div className="sidebar-section essentials"><span className="section-label">QUICK ACCESS</span>
        <button className="side-link" onClick={()=>choose(places[1])}><Bookmark size={18}/><span>Library</span></button>
        <button className="side-link" onClick={()=>choose(places[3])}><Utensils size={18}/><span>Food & drink</span></button>
        <button className="side-link" onClick={()=>choose(places[4])}><HeartPulse size={18}/><span>Health & safety</span></button>
      </div>
      <div className="sidebar-spacer"/>
      <div className="sustain-card"><span className="sustain-icon"><Leaf size={17}/></span><strong>Walk a little greener</strong><p>Explore campus on foot and find the quiet paths under the trees.</p><button onClick={()=>setTravelMode("Walk")}>Explore walking routes <ArrowRight size={13}/></button></div>
      <button className="side-link settings-link" onClick={()=>notify("Settings are coming soon")}><Settings2 size={18}/><span>Settings</span></button>
      <div className="public-access"><span><GraduationCap size={16}/></span><div><strong>Open to every student</strong><small>No account needed</small></div></div>
    </aside>

    <section className="main-panel">
      <header className="topbar"><button className="mobile-menu" aria-label="Open menu" onClick={()=>setMobileMenu(!mobileMenu)}><Menu size={20}/></button><div className="breadcrumbs"><span>Campus</span><ChevronRight size={14}/><strong>{activeTab}</strong></div><div className="top-actions"><span className="campus-status"><i/> Public campus guide</span><button className="icon-button" aria-label="Help" onClick={()=>notify("Need help? Ask a campus guide.")}><CircleHelp size={19}/></button><button className="theme-button" aria-label={dark?"Switch to light mode":"Switch to dark mode"} onClick={()=>setDark(!dark)}>{dark?<Sun size={17}/>:<Moon size={17}/>}</button></div></header>
      <div className="content">
        <div className="page-heading"><div><div className="eyebrow"><span/> UNIVERSITY OF ENERGY AND NATURAL RESOURCES</div><h1>Find your way <em>forward.</em></h1><p>Your campus, a little easier to navigate.</p></div><button className="add-place" onClick={addPin}><Plus size={16}/><span>Add a place</span></button></div>
        <div className="search-wrap"><Search size={19}/><input value={query} onChange={(e)=>{setQuery(e.target.value);setShowResults(true);}} onFocus={()=>setShowResults(true)} onKeyDown={(e)=>{if(e.key==="Enter"&&filtered[0])choose(filtered[0]);if(e.key==="Escape")setShowResults(false);}} placeholder="Where do you want to go?" aria-label="Search campus places"/><kbd>⌘ K</kbd><button className="filter-button" aria-label="Search filters" onClick={()=>notify("Showing all campus locations")}><Settings2 size={17}/><span>Filters</span></button>
          {showResults&&query&&<div className="search-results">{filtered.length?filtered.slice(0,5).map(place=><button key={place.name} onClick={()=>choose(place)}><span className="result-icon">{iconFor(place.icon)}</span><span><strong>{place.name}</strong><small>{place.type} · {place.area}</small></span><ArrowUpRight size={15}/></button>):<div className="no-results">No places found. Try a building or service name.</div>}</div>}
        </div>
        <div className="map-summary"><div className="map-title"><span className="live-dot"/><strong>UENR, Sunyani</strong><span className="map-divider"/> Bono Region, Ghana</div><div className="map-summary-right"><span><Trees size={15}/> Campus map</span><button onClick={()=>notify("This map is a visual preview. Add verified campus data when ready.")}>Illustrative map <ChevronDown size={14}/></button></div></div>
        <div className="workspace">
          <section className="map-column" aria-label="Campus map"><CampusMap selected={selected} routeOn={routeOn} adding={adding} customPlaces={customPlaces} zoom={zoom} onZoom={setZoom} onPick={choose} onAdd={(point)=>{setAdding(false);setPendingPoint(point);setPlaceName("")}}/><div className="map-footer"><span><span className="legend-current"/> Approximate start</span><span><span className="legend-destination"/> Destination</span><span className="legend-path"/> Sample route</div></section>
          <aside className="detail-column">
            <div className="route-card"><div className="card-topline"><span className="tag"><span/> SAMPLE ROUTE</span><button aria-label="More route options" onClick={()=>notify("More route options coming soon")}><MoreHorizontal size={19}/></button></div><div className="route-destination"><span className="destination-icon">{iconFor(selected.icon)}</span><div><span className="destination-type">{selected.type}</span><h2>{selected.name}</h2><p><MapPin size={13}/>{selected.area}</p></div></div><div className="route-metrics"><div><strong>{travelMode==="Walk"?selected.time.replace(" walk",""):travelMode==="Cycle"?"3 min":"2 min"}</strong><span>estimated</span></div><i/><div><strong>{selected.distance}</strong><span>distance</span></div></div><div className="travel-modes">{["Walk","Cycle","Drive"].map((mode,i)=><button key={mode} className={travelMode===mode?"mode-active":""} onClick={()=>setTravelMode(mode)}><span>{i===0?<Navigation size={15}/>:i===1?<Compass size={15}/>:<MapPin size={15}/>}</span>{mode}</button>)}</div><div className="route-actions"><Button className="primary-button" onClick={()=>{setRouteOn(true);notify(`Sample route shown to ${selected.name}`)}}><Navigation size={16}/> Get directions <ArrowRight size={15}/></Button><button className={`save-button ${saved?"is-saved":""}`} aria-label={saved?"Remove saved place":"Save place"} onClick={()=>{setSavedPlaces((current)=>saved?current.filter((name)=>name!==selected.name):[...current,selected.name]);notify(saved?"Removed from saved places":"Saved for later")}}>{saved?<Check size={17}/>:<Bookmark size={17}/>}</button></div></div>
            <div className="steps-card"><div className="card-heading"><div><span className="heading-icon"><Navigation size={15}/></span><strong>From approximate start</strong></div><button onClick={()=>notify("Precise GPS and starting point selection need the live map connection")}><ArrowDownLeft size={14}/> Change</button></div><div className="route-step"><span className="step-icon"><LocateFixed size={16}/></span><div><strong>Head east on University Ave</strong><small>towards the central quad</small></div><span className="step-time">2 min</span></div><div className="route-step"><span className="step-icon turn"><ArrowRight size={16}/></span><div><strong>Turn right at the library</strong><small>Follow the covered walkway</small></div><span className="step-time">2 min</span></div><div className="route-step"><span className="step-icon arrive"><MapPin size={16}/></span><div><strong>Arrive at {selected.name}</strong><small>{selected.area}</small></div><span className="step-time">2 min</span></div><button className="all-steps" onClick={()=>setRouteOn(!routeOn)}>{routeOn?"Hide route on map":"Show route on map"}<ChevronRight size={15}/></button></div>
            <button className="help-card" onClick={()=>notify("Campus guides are happy to help you find your way")}><span className="help-icon"><Shield size={18}/></span><span><strong>Need a hand?</strong><small>Ask a campus guide for help.</small></span><ArrowRight size={16}/></button>
          </aside>
        </div>
        <div className="bottom-row"><div className="nearby-heading"><div><h3>{activeTab==="Saved places"?"Your saved places":activeTab==="Directory"?"Campus directory":"Around you"}</h3><span>{activeTab==="Saved places"?"Pick up where you left off":"Useful places near your location"}</span></div><button onClick={()=>setActiveTab(activeTab==="Directory"?"Explore":"Directory")}>{activeTab==="Directory"?"Back to map":"View directory"}<ArrowRight size={14}/></button></div><div className="nearby-list">{(activeTab==="Saved places"?allPlaces.filter((place)=>savedPlaces.includes(place.name)):activeTab==="Directory"?allPlaces:[places[3],places[2],places[1],places[4]]).length===0?<div className="empty-saved"><Bookmark size={17}/> No saved places yet. Save a destination to find it here.</div>:(activeTab==="Saved places"?allPlaces.filter((place)=>savedPlaces.includes(place.name)):activeTab==="Directory"?allPlaces:[places[3],places[2],places[1],places[4]]).map(place=><button className="nearby-item" key={place.name} onClick={()=>choose(place)}><span className={`nearby-icon ${place.icon}`}>{iconFor(place.icon)}</span><span className="nearby-copy"><strong>{place.name}</strong><small>{place.area}</small></span><span className="nearby-distance">{place.distance}</span><ChevronRight size={15}/></button>)}</div></div>
        <footer className="footer"><span><span className="footer-mark"><Compass size={14}/></span> Knowledge. Integrity. Impact.</span><span>Made for the UENR community <span className="footer-star">✳</span></span></footer>
      </div>
    </section>
    {pendingPoint&&<div className="dialog-scrim" onMouseDown={(event)=>{if(event.target===event.currentTarget)setPendingPoint(null)}}><form className="place-dialog" role="dialog" aria-modal="true" aria-labelledby="place-dialog-title" onSubmit={savePin}><button type="button" className="dialog-close" aria-label="Close" onClick={()=>setPendingPoint(null)}><X size={17}/></button><span className="dialog-icon"><MapPin size={18}/></span><h2 id="place-dialog-title">Add a campus place</h2><p>This pin will be saved in this browser so you can find it again.</p><label htmlFor="new-place-name">Place name</label><input autoFocus id="new-place-name" value={placeName} onChange={(event)=>setPlaceName(event.target.value)} placeholder="e.g. Engineering lab" maxLength={48} required/><div className="dialog-actions"><button type="button" className="cancel-button" onClick={()=>setPendingPoint(null)}>Cancel</button><button type="submit" className="confirm-button" disabled={!placeName.trim()}>Save place <ArrowRight size={15}/></button></div></form></div>}
    {toast&&<div className="toast" role="status"><Check size={15}/>{toast}</div>}
    {mobileMenu&&<button className="sidebar-scrim" aria-label="Close menu" onClick={()=>setMobileMenu(false)}/>}
  </main>;
}

export default function Home() {
  return <PublicHome />;
}
