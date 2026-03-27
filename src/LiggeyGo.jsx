import { useState } from "react";

const C = {
  bg: "#060810", card: "#0D1420", cardBorder: "#182030",
  accent: "#00D4A0", accentDim: "#00D4A014", accentDark: "#009E78",
  orange: "#FF6B00", orangeDim: "#FF6B0014",
  red: "#FF3D5A", redDim: "#FF3D5A14",
  yellow: "#FFB020", yellowDim: "#FFB02014",
  blue: "#4A8FFF", blueDim: "#4A8FFF14",
  maxit: "#FF8C00", maxitDim: "#FF8C0014",
  text: "#E0EAFF", textMuted: "#4A6080", textDim: "#182030",
};

const fmt = (n) => n?.toLocaleString("fr-FR") + " F";

const mockMissions = [
  {
    id: "LIV-0201", orderId: "CMD-0479", client: "Épicerie Grand Yoff", phone: "77 412 33 21",
    address: "Rue 12, Grand Yoff, Dakar", zone: "Grand Yoff", amount: 62000,
    paymentStatus: "confirme_maxit",
    items: [{ name: "Riz parfumé 25kg", qty: 2 }, { name: "Huile Jumbo 5L", qty: 3 }, { name: "Sucre cristal 50kg", qty: 1 }],
    status: "en_route", priority: "haute", eta: "14:30"
  },
  {
    id: "LIV-0202", orderId: "CMD-0480", client: "Kiosque Médina 12", phone: "76 234 55 88",
    address: "Av. Blaise Diagne, Médina", zone: "Médina", amount: 28500,
    paymentStatus: "en_attente_maxit",
    items: [{ name: "Farine spéciale 50kg", qty: 1 }, { name: "Semoule fine 10kg", qty: 1 }],
    status: "planifie", priority: "normale", eta: "15:45"
  },
  {
    id: "LIV-0203", orderId: "CMD-0481", client: "Boutique Yoff Centre", phone: "77 520 11 44",
    address: "Yoff Village, Dakar", zone: "Yoff", amount: 45000,
    paymentStatus: "en_attente_maxit",
    items: [{ name: "Riz parfumé 25kg", qty: 2 }, { name: "Lait Gloria 400g", qty: 6 }],
    status: "planifie", priority: "normale", eta: "16:15"
  },
];

const mockHistory = [
  { id: "LIV-0198", client: "Alimentation Colobane", amount: 38000, status: "livree", date: "25/03 11:20", paymentStatus: "recu_maxit" },
  { id: "LIV-0197", client: "Mini-Mart HLM", amount: 19500, status: "incident", date: "25/03 09:45", paymentStatus: "en_attente_maxit" },
  { id: "LIV-0196", client: "Boulangerie de Thiès", amount: 54000, status: "livree", date: "24/03 16:10", paymentStatus: "recu_maxit" },
];

const statusCfg = {
  en_route: { label: "En route 🚚", color: C.blue },
  planifie: { label: "Planifié 📅", color: C.accent },
  livree: { label: "Livrée ✓", color: C.accent },
  incident: { label: "Incident ⚠️", color: C.red },
};
const paymentStatusCfg = {
  en_attente_maxit: { label: "En attente MaxIt", color: C.yellow, icon: "⏳" },
  confirme_maxit: { label: "Confirmé MaxIt", color: C.blue, icon: "📲" },
  recu_maxit: { label: "Réglé via MaxIt ✓", color: C.accent, icon: "✅" },
};

export default function LiggeyGo() {
  const [tab, setTab] = useState("missions");
  const [screen, setScreen] = useState("list");
  const [missions, setMissions] = useState(mockMissions);
  const [selected, setSelected] = useState(null);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [incidentType, setIncidentType] = useState("");
  const [incidentNote, setIncidentNote] = useState("");
  const [deliveredIds, setDeliveredIds] = useState([]);

  const nav = (s, m = null) => {
    if (m) setSelected(m);
    setScreen(s); setOtpValue(""); setOtpError(false); setOtpSuccess(false); setIncidentType(""); setIncidentNote("");
  };
  const confirmDelivery = () => {
    if (otpValue === "1234") {
      setOtpSuccess(true);
      setDeliveredIds(prev => [...prev, selected.id]);
      setMissions(prev => prev.map(m => m.id === selected.id ? { ...m, status: "livree" } : m));
      setTimeout(() => nav("list"), 2200);
    } else setOtpError(true);
  };

  const submitIncident = () => {
    if (incidentType) {
      setMissions(prev => prev.map(m => m.id === selected.id ? { ...m, status: "incident" } : m));
      nav("list");
    }
  };

  const s = {
    app: { width: 390, minHeight: 844, background: C.bg, color: C.text, fontFamily: "'DM Mono', 'DM Sans', monospace", margin: "0 auto", borderRadius: 32, boxShadow: "0 40px 80px rgba(0,0,0,0.75)", position: "relative", overflow: "hidden" },
    scr: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflowY: "auto", paddingBottom: 90 },
    card: { background: C.card, borderRadius: 13, padding: 15, border: `1px solid ${C.cardBorder}`, marginBottom: 9 },
    btn: (bg, color = "#000") => ({ background: bg, color, border: "none", borderRadius: 13, padding: "15px 18px", fontSize: 14, fontWeight: 800, width: "100%", cursor: "pointer" }),
    navBar: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 390, background: "rgba(6,8,16,0.97)", backdropFilter: "blur(20px)", borderTop: `1px solid ${C.cardBorder}`, display: "flex", justifyContent: "space-around", padding: "10px 8px 26px", zIndex: 100 },
    tag: (color) => ({ display: "inline-block", padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 800, color, background: `${color}18`, letterSpacing: 0.5, textTransform: "uppercase" }),
  };

  const NavBar = () => (
    <div style={s.navBar}>
      {[{ id: "missions", icon: "📋", label: "Missions" }, { id: "history", icon: "🕐", label: "Historique" }, { id: "profile", icon: "👤", label: "Profil" }].map(t => (
        <div key={t.id} onClick={() => { setTab(t.id); setScreen("list"); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", opacity: tab === t.id ? 1 : 0.35 }}>
          <span style={{ fontSize: 21 }}>{t.icon}</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: tab === t.id ? C.accent : C.textMuted }}>{t.label}</span>
        </div>
      ))}
    </div>
  );

  const BackBtn = ({ to }) => <button onClick={() => nav(to)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: C.text, padding: 0 }}>‹</button>;

  const activeMissions = missions.filter(m => m.status !== "livree" && m.status !== "incident");
  const doneMissions = missions.filter(m => m.status === "livree" || m.status === "incident");

  // ── MISSION LIST ──
  if (tab === "missions" && screen === "list") return (
    <div style={s.app}><div style={s.scr}>
      <div style={{ padding: "50px 18px 14px" }}>
        <div style={{ fontSize: 10, color: C.accent, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 3 }}>LIGGEY GO</div>
        <div style={{ fontSize: 21, fontWeight: 900, letterSpacing: -0.5, marginBottom: 1 }}>Tournée du jour</div>
        <div style={{ fontSize: 12, color: C.textMuted }}>25 Mars 2026 · Dakar Nord</div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 9, padding: "0 18px 16px" }}>
        {[{ label: "Total", val: missions.length, color: C.text }, { label: "Faites", val: doneMissions.length, color: C.accent }, { label: "Restantes", val: activeMissions.length, color: C.orange }].map((k, i) => (
          <div key={i} style={{ flex: 1, background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 11, padding: "9px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: k.color }}>{k.val}</div>
            <div style={{ fontSize: 10, color: C.textMuted }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={{ margin: "0 18px 18px" }}>
        <div style={{ height: 5, background: C.cardBorder, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(doneMissions.length / missions.length) * 100}%`, background: `linear-gradient(90deg, ${C.accentDark}, ${C.accent})`, borderRadius: 3 }} />
        </div>
        <div style={{ fontSize: 10, color: C.textMuted, marginTop: 3 }}>{Math.round((doneMissions.length / missions.length) * 100)}% complété</div>
      </div>

      <div style={{ padding: "0 18px" }}>
        {activeMissions.length > 0 && <>
          <div style={{ fontSize: 10, fontWeight: 800, color: C.textMuted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 9 }}>En cours</div>
          {activeMissions.map((m, i) => {
            const pSt = paymentStatusCfg[m.paymentStatus];
            return (
              <div key={m.id} style={{ ...s.card, cursor: "pointer", border: `1px solid ${i === 0 ? C.accent + "40" : C.cardBorder}` }} onClick={() => nav("detail", m)}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9 }}>
                  <div>
                    <div style={{ fontSize: 10, color: C.textMuted }}>{m.id}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, marginTop: 1 }}>{m.client}</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>{m.zone} · ETA {m.eta}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={s.tag(statusCfg[m.status].color)}>{statusCfg[m.status].label}</div>
                    <div style={{ fontSize: 10, color: m.priority === "haute" ? C.red : C.textMuted, marginTop: 5, fontWeight: 700 }}>
                      {m.priority === "haute" ? "● Urgente" : "● Normale"}
                    </div>
                  </div>
                </div>
                {/* RÈGLE D'OR : montant visible (commercial) + statut paiement MaxIt (lecture seule) */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: `1px solid ${C.cardBorder}` }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: C.accent }}>{fmt(m.amount)}</div>
                  <div style={{ fontSize: 10, color: pSt.color, fontWeight: 700 }}>{pSt.icon} {pSt.label}</div>
                </div>
              </div>
            );
          })}
        </>}
        {doneMissions.length > 0 && <>
          <div style={{ fontSize: 10, fontWeight: 800, color: C.textMuted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 9, marginTop: 6 }}>Complétées</div>
          {doneMissions.map(m => (
            <div key={m.id} style={{ ...s.card, opacity: 0.5 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div><div style={{ fontSize: 13, fontWeight: 700 }}>{m.client}</div><div style={{ fontSize: 11, color: C.textMuted }}>{m.id}</div></div>
                <div style={{ textAlign: "right" }}>
                  <div style={s.tag(statusCfg[m.status].color)}>{statusCfg[m.status].label}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, marginTop: 4 }}>{fmt(m.amount)}</div>
                </div>
              </div>
            </div>
          ))}
        </>}
      </div>
    </div><NavBar /></div>
  );

  // ── MISSION DETAIL ──
  if (tab === "missions" && screen === "detail" && selected) {
    const pSt = paymentStatusCfg[selected.paymentStatus];
    return (
      <div style={s.app}><div style={s.scr}>
        <div style={{ padding: "50px 18px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <BackBtn to="list" />
          <div style={{ fontSize: 12, color: C.textMuted }}>{selected.id}</div>
          <div style={{ width: 24 }} />
        </div>

        <div style={{ padding: "0 18px" }}>
          {/* Client */}
          <div style={{ ...s.card, border: `1px solid ${C.accent}25` }}>
            <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Client</div>
            <div style={{ fontSize: 17, fontWeight: 900 }}>{selected.client}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{selected.address}</div>
            <div style={{ display: "flex", gap: 9, marginTop: 12 }}>
              <a href={`tel:${selected.phone}`} style={{ flex: 1, background: `${C.accent}14`, border: `1px solid ${C.accent}30`, borderRadius: 9, padding: "9px 12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, color: C.accent, textDecoration: "none", fontWeight: 700, fontSize: 12 }}>
                📞 {selected.phone}
              </a>
              <button style={{ background: C.blueDim, border: `1px solid ${C.blue}30`, borderRadius: 9, padding: "9px 14px", color: C.blue, cursor: "pointer", fontSize: 16 }}>🗺️</button>
            </div>
          </div>

          {/* Articles */}
          <div style={s.card}>
            <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 9, textTransform: "uppercase", letterSpacing: 1 }}>Articles</div>
            {selected.items.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < selected.items.length - 1 ? `1px solid ${C.cardBorder}` : "none" }}>
                <span style={{ fontSize: 13 }}>{item.name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>× {item.qty}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 9, marginTop: 4, borderTop: `1px solid ${C.accent}25` }}>
              <span style={{ fontWeight: 800 }}>Total commande</span>
              <span style={{ fontSize: 15, fontWeight: 900, color: C.accent }}>{fmt(selected.amount)}</span>
            </div>
          </div>

          
          <div style={{ ...s.card, background: "linear-gradient(135deg, #1A0600, #0D0300)", border: `1px solid ${C.maxit}25` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 10, color: "#886633", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Paiement (MaxIt)</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: pSt.color }}>{pSt.icon} {pSt.label}</div>
                <div style={{ fontSize: 10, color: "#664422", marginTop: 3 }}>Géré automatiquement par MaxIt</div>
              </div>
              <div style={{ fontSize: 24 }}>💳</div>
            </div>
          </div>

          {/* Actions — uniquement livraison physique, pas de validation paiement */}
          {!deliveredIds.includes(selected.id) ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <button onClick={() => nav("confirm_otp", selected)} style={s.btn(C.accent)}>
                ✓ Confirmer la livraison (OTP)
              </button>
              <button onClick={() => nav("incident", selected)} style={{ ...s.btn(C.redDim, C.red), border: `1px solid ${C.red}30` }}>
                ⚠ Signaler un incident
              </button>
            </div>
          ) : (
            <div style={{ ...s.card, background: C.accentDim, border: `1px solid ${C.accent}30`, textAlign: "center", padding: 20 }}>
              <div style={{ fontSize: 30, marginBottom: 6 }}>✅</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.accent }}>Livraison confirmée</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Paiement traité automatiquement par MaxIt</div>
            </div>
          )}
        </div>
      </div></div>
    );
  }

  // ── OTP CONFIRM — livraison physique uniquement ──
  if (screen === "confirm_otp") return (
    <div style={s.app}><div style={s.scr}>
      <div style={{ padding: "50px 18px 14px", display: "flex", alignItems: "center", gap: 12 }}>
        <BackBtn to="detail" />
        <div style={{ fontSize: 15, fontWeight: 800 }}>Confirmation livraison</div>
      </div>
      <div style={{ padding: "0 18px", textAlign: "center" }}>
        <div style={{ width: 68, height: 68, borderRadius: "50%", background: C.accentDim, border: `2px solid ${C.accent}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "20px auto 16px", fontSize: 30 }}>📲</div>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 5 }}>OTP de livraison client</div>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 24 }}>Demandez le code à {selected?.client}</div>

        
        <div style={{ background: "linear-gradient(135deg, #1A0600, #0D0300)", border: `1px solid ${C.maxit}20`, borderRadius: 11, padding: "10px 14px", marginBottom: 20, textAlign: "left" }}>
          <div style={{ fontSize: 11, color: "#886633", fontWeight: 700 }}>
            ℹ️ Cet OTP confirme la livraison physique. Le paiement est géré automatiquement par MaxIt.
          </div>
        </div>

        {otpSuccess ? (
          <div style={{ padding: 32 }}>
            <div style={{ fontSize: 52, marginBottom: 10 }}>✅</div>
            <div style={{ fontSize: 17, fontWeight: 900, color: C.accent }}>Livraison confirmée !</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 6 }}>MaxIt traite le paiement · Retour à la liste…</div>
          </div>
        ) : (
          <>
            <input type="tel" maxLength={4} value={otpValue} onChange={e => { setOtpValue(e.target.value.replace(/\D/g, "")); setOtpError(false); }}
              style={{ width: 140, height: 56, background: C.card, border: `2px solid ${otpError ? C.red : C.accent}40`, borderRadius: 13, color: C.text, fontSize: 28, fontWeight: 900, textAlign: "center", outline: "none", letterSpacing: 8, fontFamily: "DM Mono, monospace" }}
              placeholder="••••" />
            {otpError && <div style={{ color: C.red, fontSize: 12, fontWeight: 700, margin: "10px 0" }}>Code invalide. Réessayez.</div>}
            <div style={{ fontSize: 10, color: C.textMuted, margin: "10px 0 18px" }}>Code démo : 1234</div>
            <button onClick={confirmDelivery} disabled={otpValue.length < 4} style={s.btn(otpValue.length === 4 ? C.accent : C.textDim, otpValue.length === 4 ? "#000" : C.textMuted)}>
              Valider la livraison
            </button>
          </>
        )}
      </div>
    </div></div>
  );

  // ── INCIDENT ──
  if (screen === "incident") return (
    <div style={s.app}><div style={s.scr}>
      <div style={{ padding: "50px 18px 14px", display: "flex", alignItems: "center", gap: 12 }}>
        <BackBtn to="detail" />
        <div style={{ fontSize: 15, fontWeight: 800 }}>Signaler un incident</div>
      </div>
      <div style={{ padding: "0 18px" }}>
        <div style={{ ...s.card, background: C.redDim, border: `1px solid ${C.red}25`, display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 22 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{selected?.client}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{selected?.id} · {fmt(selected?.amount)}</div>
          </div>
        </div>
        <div style={{ fontSize: 10, fontWeight: 800, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 11, marginTop: 4 }}>Type d'incident</div>
        {[
          { id: "absent", label: "Client absent", icon: "🚫" },
          { id: "produit", label: "Produit manquant / endommagé", icon: "📦" },
          { id: "refus", label: "Refus de livraison", icon: "❌" },
          { id: "adresse", label: "Adresse incorrecte", icon: "📍" },
          { id: "autre", label: "Autre incident terrain", icon: "🔧" },
        ].map(opt => (
          <div key={opt.id} onClick={() => setIncidentType(opt.id)} style={{ ...s.card, display: "flex", gap: 12, alignItems: "center", cursor: "pointer", border: `1px solid ${incidentType === opt.id ? C.red : C.cardBorder}`, marginBottom: 7 }}>
            <span style={{ fontSize: 18 }}>{opt.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{opt.label}</span>
            <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${incidentType === opt.id ? C.red : C.textDim}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {incidentType === opt.id && <div style={{ width: 9, height: 9, borderRadius: "50%", background: C.red }} />}
            </div>
          </div>
        ))}

        {/* RÈGLE D'OR : pas d'option "problème de paiement" ici — paiement = MaxIt */}
        <div style={{ background: "linear-gradient(135deg, #1A0600, #0D0300)", border: `1px solid ${C.maxit}20`, borderRadius: 10, padding: "9px 12px", marginBottom: 12, fontSize: 10, color: "#886633" }}>
          💳 Problème de paiement → géré automatiquement par MaxIt. Non reportable ici.
        </div>

        <textarea placeholder="Commentaire (optionnel)..." value={incidentNote} onChange={e => setIncidentNote(e.target.value)}
          style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 11, padding: 12, color: C.text, fontSize: 13, width: "100%", boxSizing: "border-box", minHeight: 72, resize: "none", outline: "none", marginBottom: 12 }} />
        <button onClick={submitIncident} disabled={!incidentType} style={s.btn(incidentType ? C.red : C.textDim, incidentType ? "#fff" : C.textMuted)}>
          Soumettre l'incident
        </button>
      </div>
    </div></div>
  );

  // ── HISTORY ──
  if (tab === "history") return (
    <div style={s.app}><div style={s.scr}>
      <div style={{ padding: "50px 18px 16px" }}>
        <div style={{ fontSize: 10, color: C.accent, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 3 }}>LIGGEY GO</div>
        <div style={{ fontSize: 20, fontWeight: 900 }}>Historique</div>
      </div>
      <div style={{ padding: "0 18px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 18 }}>
          {[
            { label: "Livrées", val: [...missions, ...mockHistory].filter(m => m.status === "livree").length, color: C.accent },
            { label: "Incidents", val: [...missions, ...mockHistory].filter(m => m.status === "incident").length, color: C.red },
          ].map((k, i) => (
            <div key={i} style={s.card}>
              <div style={{ fontSize: 24, fontWeight: 900, color: k.color }}>{k.val}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{k.label}</div>
            </div>
          ))}
        </div>
        {[...missions.filter(m => m.status === "livree" || m.status === "incident"), ...mockHistory].map((item, i) => {
          const pSt = paymentStatusCfg[item.paymentStatus];
          return (
            <div key={i} style={s.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{item.client}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{item.id} · {item.date || "Aujourd'hui"}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={s.tag(statusCfg[item.status].color)}>{statusCfg[item.status].label}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, marginTop: 5 }}>{fmt(item.amount)}</div>
                  {/* RÈGLE D'OR : statut paiement MaxIt visible mais pas actionnable */}
                  <div style={{ fontSize: 10, color: pSt.color, marginTop: 3 }}>{pSt.icon} {pSt.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div><NavBar /></div>
  );

  // ── PROFILE ──
  if (tab === "profile") return (
    <div style={s.app}><div style={s.scr}>
      <div style={{ padding: "50px 18px 16px" }}>
        <div style={{ fontSize: 10, color: C.accent, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 3 }}>LIGGEY GO</div>
        <div style={{ fontSize: 20, fontWeight: 900 }}>Profil</div>
      </div>
      <div style={{ padding: "0 18px" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: C.accentDim, border: `2px solid ${C.accent}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontSize: 30 }}>👤</div>
          <div style={{ fontSize: 17, fontWeight: 800 }}>Moussa Ndiaye</div>
          <div style={{ fontSize: 12, color: C.textMuted }}>Commercial B2B · Zone Dakar Nord</div>
          <div style={{ fontSize: 12, color: C.accent, marginTop: 3 }}>77 812 44 55</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9, marginBottom: 18 }}>
          {[{ l: "Livrées", v: "124", c: C.accent }, { l: "Ce mois", v: "31", c: C.blue }, { l: "Succès", v: "96%", c: C.orange }].map((k, i) => (
            <div key={i} style={{ ...s.card, textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: k.c }}>{k.v}</div>
              <div style={{ fontSize: 10, color: C.textMuted }}>{k.l}</div>
            </div>
          ))}
        </div>
        {[{ l: "Zone", v: "Dakar Nord" }, { l: "Fournisseur", v: "Dakar Céréales" }, { l: "Superviseur", v: "Fatou Diop" }].map((r, i) => (
          <div key={i} style={{ ...s.card, display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: C.textMuted, fontSize: 12 }}>{r.l}</span>
            <span style={{ fontWeight: 700, fontSize: 12 }}>{r.v}</span>
          </div>
        ))}
        {/* RÈGLE D'OR : accès MaxIt pour les finances personnelles */}
        <div style={{ ...s.card, background: "linear-gradient(135deg, #1A0600, #0D0300)", border: `1px solid ${C.maxit}25`, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#AA6633", marginBottom: 8 }}>Mes revenus & commissions → MaxIt</div>
          <button onClick={() => alert("Ouverture MaxIt")} style={{ background: C.maxit, color: "#fff", border: "none", borderRadius: 9, padding: "9px 20px", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>💳 Ouvrir MaxIt</button>
        </div>
        <button style={{ ...s.btn(C.redDim, C.red), border: `1px solid ${C.red}30`, marginTop: 9 }}>Déconnexion</button>
        <div style={{ textAlign: "center", marginTop: 10, fontSize: 10, color: C.textDim }}>Liggey Go v1.0 · Orange Money Sénégal</div>
      </div>
    </div><NavBar /></div>
  );

  return null;
}
