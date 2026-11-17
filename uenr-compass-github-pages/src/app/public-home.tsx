"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowRight, Bookmark, Building2, Check, ChevronRight, Compass, Crosshair, GraduationCap, HeartPulse, Leaf, LocateFixed, Map, MapPin, Moon, Navigation, Plus, Search, Shield, Sun, Trees, Utensils, X } from "lucide-react";
import type { CampusPlace, Coordinates } from "@/components/campus-map";

const LiveCampusMap = dynamic(() => import("@/components/campus-map"), { ssr: false, loading: () => <div className="real-map-loading"><span className="loading-spinner"/> Loading UENR campus map…</div> });
const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const campusPlaces: CampusPlace[] = [
  { name: "Lecture Hall and Library", type: "Lecture hall", area: "UENR main campus", time: "", distance: "", icon: "class", lat: 7.34959, lon: -2.34298 },
  { name: "UENR Cafeteria", type: "Food & drink", area: "UENR main campus", time: "", distance: "", icon: "food", lat: 7.34955, lon: -2.34238 },
  { name: "Campus Clinic", type: "Health & safety", area: "UENR main campus", time: "", distance: "", icon: "health", lat: 7.34903, lon: -2.34318 },
  { name: "UENR School Park", type: "Sports & recreation", area: "UENR main campus", time: "", distance: "", icon: "office", lat: 7.35074, lon: -2.34281 },
  { name: "UENR Main Campus", type: "University", area: "Fiapre, Sunyani", time: "", distance: "", icon: "office", lat: 7.34852, lon: -2.34166 },
];
function distanceBetween(a: Coordinates, b: Coordinates) {
  const rad = (n: number) => n * Math.PI / 180;
  const dLat = rad(b.lat - a.lat), dLon = rad(b.lon - a.lon);
  const n = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return Math.round(6371000 * 2 * Math.atan2(Math.sqrt(n), Math.sqrt(1 - n)));
}
function placeIcon(icon: CampusPlace["icon"]) {
  if (icon === "class") return <GraduationCap size={16}/>;
  if (icon === "food") return <Utensils size={16}/>;
  if (icon === "health") return <HeartPulse size={16}/>;
  if (icon === "library") return <Bookmark size={16}/>;
  return <Building2 size={16}/>;
}

export default function PublicHome() {
  const [extraPlaces, setExtraPlaces] = useState<CampusPlace[]>([]);
  const [selected, setSelected] = useState<CampusPlace>(campusPlaces[0]);
  const [position, setPosition] = useState<Coordinates | null>(null);
  const [tracking, setTracking] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [dark, setDark] = useState(false);
  const [adding, setAdding] = useState(false);
  const [pendingPoint, setPendingPoint] = useState<Coordinates | null>(null);
  const [placeName, setPlaceName] = useState("");
  const [toast, setToast] = useState("");
  const allPlaces = useMemo(() => [...campusPlaces, ...extraPlaces], [extraPlaces]);
  const results = allPlaces.filter((place) => `${place.name} ${place.type}`.toLowerCase().includes(query.toLowerCase()));
  const targetDistance = position ? distanceBetween(position, selected) : null;
  const arrived = targetDistance !== null && targetDistance <= Math.max(25, position?.accuracy ?? 25);
  useEffect(() => {
    try {
      const places = localStorage.getItem("uenr-compass-places");
      const savedNames = localStorage.getItem("uenr-compass-saved");
      if (places) setExtraPlaces(JSON.parse(places) as CampusPlace[]);
      if (savedNames) setSaved(JSON.parse(savedNames) as string[]);
      setDark(localStorage.getItem("uenr-theme") === "dark");
    } catch { /* Keep public campus browsing available if browser storage is disabled. */ }
  }, []);
  useEffect(() => { try { localStorage.setItem("uenr-compass-places", JSON.stringify(extraPlaces)); } catch { /* Browser storage is optional. */ } }, [extraPlaces]);
  useEffect(() => { try { localStorage.setItem("uenr-compass-saved", JSON.stringify(saved)); } catch { /* Browser storage is optional. */ } }, [saved]);
  useEffect(() => { try { localStorage.setItem("uenr-theme", dark ? "dark" : "light"); } catch { /* Browser storage is optional. */ } }, [dark]);
  useEffect(() => {
    if (!tracking) return;
    if (!navigator.geolocation) { setGpsError("This browser does not provide location access."); setTracking(false); return; }
    setGpsError("");
    const watchId = navigator.geolocation.watchPosition(
      (result) => setPosition({ lat: result.coords.latitude, lon: result.coords.longitude, accuracy: result.coords.accuracy }),
      (error) => { setGpsError(error.code === 1 ? "Allow location access in your browser to track your distance." : "Location is unavailable. Check your GPS and try again."); setTracking(false); },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [tracking]);
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 3000); };
  const choose = (place: CampusPlace) => { setSelected(place); setQuery(place.name); setShowSearch(false); setAdding(false); };
  const savePin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pendingPoint || !placeName.trim()) return;
    const place: CampusPlace = { ...pendingPoint, name: placeName.trim(), type: "Student-added place", area: "Added on this device", time: "", distance: "", icon: "office" };
    setExtraPlaces((current) => [...current, place]);
    choose(place);
    setPendingPoint(null); setPlaceName("");
    notify("Saved on this browser. This pin is not shared with other students yet.");
  };
  const current = position ? `${position.lat},${position.lon}` : "Current+Location";
  const googleDirections = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(current)}&destination=${selected.lat},${selected.lon}&travelmode=walking`;
  const appleDirections = `https://maps.apple.com/?saddr=${encodeURIComponent(current)}&daddr=${selected.lat},${selected.lon}&dirflg=w`;
  const distanceLabel = targetDistance === null ? "Enable location to see distance" : arrived ? "You’re at the destination" : `${targetDistance >= 1000 ? `${(targetDistance / 1000).toFixed(1)} km` : `${targetDistance} m`} away`;
  return <main className={`app-shell ${dark ? "theme-dark" : ""}`}>
    <aside className="sidebar"><a className="brand" href={`${publicBasePath}/`} aria-label="UENR Compass home"><span className="brand-mark"><img src={`${publicBasePath}/uenr-crest.png`} alt=""/></span><span><strong>UENR</strong><small>Compass</small></span></a>
      <div className="sidebar-section"><span className="section-label">CAMPUS</span><button className="side-link side-active"><Map size={18}/><span>Campus map</span></button><button className="side-link" onClick={()=>document.getElementById("campus-directory")?.scrollIntoView({behavior:"smooth"})}><Building2 size={18}/><span>Campus directory</span></button><button className="side-link" onClick={()=>document.getElementById("saved-places")?.scrollIntoView({behavior:"smooth"})}><Bookmark size={18}/><span>Saved places</span>{saved.length>0&&<i className="saved-dot"/>}</button></div>
      <div className="sidebar-section essentials"><span className="section-label">QUICK ACCESS</span>{campusPlaces.slice(1,4).map((place)=><button key={place.name} className="side-link" onClick={()=>choose(place)}>{placeIcon(place.icon)}<span>{place.name}</span></button>)}</div><div className="sidebar-spacer"/><div className="sustain-card"><span className="sustain-icon"><Leaf size={17}/></span><strong>Walk a little greener</strong><p>Explore the campus paths with live distance to your destination.</p></div><div className="public-access"><span><GraduationCap size={16}/></span><div><strong>Open to every student</strong><small>No account needed</small></div></div>
    </aside>
    <section className="main-panel"><header className="topbar"><div className="breadcrumbs"><span>UENR, Fiapre</span><ChevronRight size={14}/><strong>Campus map</strong></div><div className="top-actions"><span className="campus-status"><i/> Public campus guide</span><button className="icon-button" aria-label="Help" onClick={()=>notify("Location tracking needs browser permission and GPS enabled.")}><Shield size={18}/></button><button className="theme-button" aria-label={dark?"Switch to light mode":"Switch to dark mode"} onClick={()=>setDark(!dark)}>{dark?<Sun size={17}/>:<Moon size={17}/>}</button></div></header>
      <div className="content"><div className="page-heading"><div><div className="eyebrow"><span/> UNIVERSITY OF ENERGY AND NATURAL RESOURCES</div><h1>Find your way <em>forward.</em></h1><p>Live campus map · GPS proximity · Walking directions</p></div><button className="add-place" onClick={()=>{setAdding(!adding);notify(!adding?"Tap the map where you want to add a place.":"Add place mode closed.")}}><Plus size={16}/><span>Add a place</span></button></div>
        <div className="search-wrap"><Search size={19}/><input value={query} onChange={(event)=>{setQuery(event.target.value);setShowSearch(true)}} onFocus={()=>setShowSearch(true)} onKeyDown={(event)=>{if(event.key==="Enter"&&results[0])choose(results[0]);if(event.key==="Escape")setShowSearch(false)}} placeholder="Search mapped campus places…" aria-label="Search mapped campus places"/><button className="filter-button" onClick={()=>notify("Showing mapped campus places and your saved pins.")}><Crosshair size={16}/><span>Map places</span></button>{showSearch&&query&&<div className="search-results">{results.length?results.slice(0,7).map((place)=><button key={`${place.name}-${place.lat}`} onClick={()=>choose(place)}><span className="result-icon">{placeIcon(place.icon)}</span><span><strong>{place.name}</strong><small>{place.type} · {place.area}</small></span><MapPin size={15}/></button>):<div className="no-results">No mapped place found. Try another name.</div>}</div>}</div>
        <div className="map-summary"><div className="map-title"><span className="live-dot"/><strong>UENR Main Campus</strong><span className="map-divider"/> Fiapre, Sunyani · GhanaPost GPS BS-0061-2164</div><div className="map-summary-right"><span><Trees size={15}/> OpenStreetMap</span><a href="https://www.openstreetmap.org/?mlat=7.34852&mlon=-2.34166#map=17/7.34852/-2.34166" target="_blank" rel="noreferrer">Open full map <ArrowRight size={13}/></a></div></div>
        <div className="workspace"><section className="map-column" aria-label="Map of UENR main campus"><LiveCampusMap places={allPlaces} selected={selected} position={position} adding={adding} dark={dark} onSelect={choose} onAdd={(point)=>{setPendingPoint(point);setPlaceName("");setAdding(false)}}/><div className="map-footer"><span><span className="legend-current"/> {position?"Your live location":"GPS not started"}</span><span><span className="legend-destination"/> Campus places</span></div></section>
          <aside className="detail-column"><div className="route-card"><div className="card-topline"><span className="tag"><span/>{tracking&&position?"GPS TRACKING ACTIVE":"CAMPUS DESTINATION"}</span><button aria-label="Save destination" className={`save-button ${saved.includes(selected.name)?"is-saved":""}`} onClick={()=>setSaved((current)=>current.includes(selected.name)?current.filter((name)=>name!==selected.name):[...current,selected.name])}>{saved.includes(selected.name)?<Check size={16}/>:<Bookmark size={16}/>}</button></div><div className="route-destination"><span className="destination-icon">{placeIcon(selected.icon)}</span><div><span className="destination-type">{selected.type}</span><h2>{selected.name}</h2><p><MapPin size={13}/>{selected.area}</p></div></div><div className="proximity-panel"><div className={`proximity-symbol ${arrived?"arrived":""}`}><LocateFixed size={19}/></div><div><strong>{distanceLabel}</strong><span>{position?`GPS accuracy ±${Math.round(position.accuracy??0)} m`:"Your location stays on this device"}</span></div></div>{gpsError&&<div className="gps-error" role="status">{gpsError}</div>}<button className={`primary-button gps-button ${tracking?"gps-on":""}`} onClick={()=>setTracking(!tracking)}>{tracking?<Crosshair size={16}/>:<LocateFixed size={16}/>} {tracking?"Stop live tracking":"Track my location"}</button><div className="directions-label">OPEN WALKING DIRECTIONS</div><div className="external-maps"><a href={googleDirections} target="_blank" rel="noreferrer"><Navigation size={15}/> Google Maps <ArrowRight size={14}/></a><a href={appleDirections} target="_blank" rel="noreferrer"><Compass size={15}/> Apple Maps <ArrowRight size={14}/></a></div><p className="map-note">Coordinates are mapped campus features. Indoor rooms and paths need UENR verification.</p></div>
            <div className="steps-card"><div className="card-heading"><div><span className="heading-icon"><MapPin size={15}/></span><strong>Destination coordinates</strong></div></div><div className="coordinate-line"><span>LAT</span><code>{selected.lat.toFixed(5)}</code></div><div className="coordinate-line"><span>LON</span><code>{selected.lon.toFixed(5)}</code></div><a className="ghana-post-link" href="https://www.ghanapostgps.com/" target="_blank" rel="noreferrer">GhanaPost GPS address: BS-0061-2164 <ArrowRight size={13}/></a></div>
          </aside></div>
        <div className="bottom-row" id="campus-directory"><div className="nearby-heading"><div><h3>Mapped campus places</h3><span>Features currently present in OpenStreetMap</span></div><span className="source-pill">OSM sourced</span></div><div className="nearby-list">{allPlaces.map((place)=><button className="nearby-item" key={`${place.name}-${place.lat}`} onClick={()=>choose(place)}><span className={`nearby-icon ${place.icon}`}>{placeIcon(place.icon)}</span><span className="nearby-copy"><strong>{place.name}</strong><small>{place.type} · {place.lat.toFixed(4)}, {place.lon.toFixed(4)}</small></span>{saved.includes(place.name)&&<Bookmark size={14}/>}<ChevronRight size={15}/></button>)}</div></div>
        <div id="saved-places" className="saved-summary"><Bookmark size={14}/> {saved.length?`${saved.length} saved place${saved.length===1?"":"s"} on this device`:"Saved places stay on this device"}</div><footer className="footer"><span><span className="footer-mark"><Compass size={14}/></span> UENR Compass · Knowledge. Integrity. Impact.</span><span>Fiapre, Sunyani · Ghana</span></footer>
      </div></section>
    {pendingPoint&&<div className="dialog-scrim" onMouseDown={(event)=>{if(event.target===event.currentTarget)setPendingPoint(null)}}><form className="place-dialog" role="dialog" aria-modal="true" aria-labelledby="place-dialog-title" onSubmit={savePin}><button type="button" className="dialog-close" aria-label="Close" onClick={()=>setPendingPoint(null)}><X size={17}/></button><span className="dialog-icon"><MapPin size={18}/></span><h2 id="place-dialog-title">Add a campus place</h2><p>This pin is saved only in this browser. Shareable campus records need a university database.</p><label htmlFor="new-place-name">Place name</label><input autoFocus id="new-place-name" value={placeName} onChange={(event)=>setPlaceName(event.target.value)} placeholder="e.g. Department office" maxLength={48} required/><div className="dialog-actions"><button type="button" className="cancel-button" onClick={()=>setPendingPoint(null)}>Cancel</button><button type="submit" className="confirm-button" disabled={!placeName.trim()}>Save place <ArrowRight size={15}/></button></div></form></div>}
    {toast&&<div className="toast" role="status"><Check size={15}/>{toast}</div>}
  </main>;
}
