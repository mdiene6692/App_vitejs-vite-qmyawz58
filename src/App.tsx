import { useState } from "react"
import LiggeyApp from './LiggeyApp'
import LiggeyPro from './LiggeyPro'
import LiggeyGo from './LiggeyGo'

export default function App() {
  const [active, setActive] = useState("detaillant")

  return (
    <div>
      <div style={{ display:"flex", gap:12, padding:16, background:"#FF6B00", justifyContent:"center" }}>
        <button onClick={() => setActive("detaillant")}
          style={{ background: active==="detaillant" ? "#fff" : "transparent", color: active==="detaillant" ? "#FF6B00" : "#fff", border:"2px solid #fff", borderRadius:10, padding:"8px 20px", fontWeight:800, cursor:"pointer" }}>
          Liggey
        </button>
        <button onClick={() => setActive("fournisseur")}
          style={{ background: active==="fournisseur" ? "#fff" : "transparent", color: active==="fournisseur" ? "#FF6B00" : "#fff", border:"2px solid #fff", borderRadius:10, padding:"8px 20px", fontWeight:800, cursor:"pointer" }}>
          Liggey Pro
        </button>
        <button onClick={() => setActive("commercial")}
          style={{ background: active==="commercial" ? "#fff" : "transparent", color: active==="commercial" ? "#FF6B00" : "#fff", border:"2px solid #fff", borderRadius:10, padding:"8px 20px", fontWeight:800, cursor:"pointer" }}>
          Liggey Go
        </button>
      </div>

      {active === "detaillant" && <LiggeyApp />}
      {active === "fournisseur" && <LiggeyPro />}
      {active === "commercial" && <LiggeyGo />}
    </div>
  )
}