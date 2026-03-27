import { useState } from "react";

const C = {
  bg: "#070A10", sidebar: "#0B1018", card: "#0F1620",
  border: "#172030", orange: "#FF6B00", orangeDim: "#FF6B0014",
  green: "#00D4A0", greenDim: "#00D4A012", red: "#FF4A6E", redDim: "#FF4A6E12",
  blue: "#4A8FFF", blueDim: "#4A8FFF12", yellow: "#FFB830", yellowDim: "#FFB83012",
  purple: "#9B6DFF", purpleDim: "#9B6DFF12", maxit: "#FF8C00", maxitDim: "#FF8C0014",
  text: "#E0EAFF", textMuted: "#4A6080", textDim: "#182030",
};

const fmt = (n) => typeof n === "number" ? n.toLocaleString("fr-FR") + " F" : n;

const mockOrders = [
  { id: "CMD-0481", retailer: "Boutique Yoff Centre", zone: "Dakar Nord", amount: 45000, status: "en_attente", date: "25/03 14:22", items: 4, paymentStatus: "en_attente_maxit" },
  { id: "CMD-0480", retailer: "Kiosque Médina 12", zone: "Médina", amount: 28500, status: "validee", date: "25/03 13:45", items: 2, paymentStatus: "confirme_maxit" },
  { id: "CMD-0479", retailer: "Épicerie Grand Yoff", zone: "Grand Yoff", amount: 62000, status: "en_livraison", date: "25/03 11:30", items: 7, paymentStatus: "confirme_maxit" },
  { id: "CMD-0478", retailer: "Mamadou Faye Pikine", zone: "Pikine", amount: 18000, status: "livree", date: "24/03 16:10", items: 3, paymentStatus: "recu_maxit" },
  { id: "CMD-0477", retailer: "Boutique Touba Marché", zone: "Parcelles", amount: 95000, status: "validee", date: "24/03 09:00", items: 12, paymentStatus: "confirme_maxit" },
];

const mockProducts = [
  { id: 1, name: "Riz parfumé 25kg", cat: "Riz", price: 18500, stock: 240, status: "actif" },
  { id: 2, name: "Huile Jumbo 5L", cat: "Huile", price: 7200, stock: 180, status: "actif" },
  { id: 3, name: "Sucre cristal 50kg", cat: "Sucre", price: 34000, stock: 12, status: "alerte" },
  { id: 4, name: "Lait Gloria 400g", cat: "Lait", price: 2800, stock: 0, status: "rupture" },
  { id: 5, name: "Farine spéciale 50kg", cat: "Farine", price: 21000, stock: 130, status: "actif" },
];

const statusCfg = {
  en_attente: { label: "En attente", color: C.yellow, bg: C.yellowDim },
  validee: { label: "Validée", color: C.green, bg: C.greenDim },
  en_livraison: { label: "En livraison", color: C.blue, bg: C.blueDim },
  livree: { label: "Livrée ✓", color: C.green, bg: C.greenDim },
  annulee: { label: "Annulée", color: C.red, bg: C.redDim },
  actif: { label: "Actif", color: C.green, bg: C.greenDim },
  alerte: { label: "Stock bas", color: C.yellow, bg: C.yellowDim },
  rupture: { label: "Rupture", color: C.red, bg: C.redDim },
};
const paymentStatusCfg = {
  en_attente_maxit: { label: "En attente MaxIt", color: C.yellow, icon: "⏳" },
  confirme_maxit: { label: "Confirmé MaxIt", color: C.blue, icon: "📲" },
  recu_maxit: { label: "Reçu via MaxIt ✓", color: C.green, icon: "✅" },
  credit_maxit: { label: "Crédit actif MaxIt", color: C.purple, icon: "📊" },
};

const Badge = ({ status }) => {
  const cfg = statusCfg[status] || statusCfg["en_attente"];
  return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: cfg.color, background: cfg.bg }}>{cfg.label}</span>;
};
const MaxItBanner = ({ compact = false }) => (
  <div style={{ background: "linear-gradient(135deg, #1A0600, #0D0300)", border: `1px solid ${C.maxit}25`, borderRadius: compact ? 10 : 14, padding: compact ? "10px 14px" : "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
    <div>
      <div style={{ fontSize: compact ? 11 : 13, fontWeight: 800, color: C.maxit }}>💳 Détail financier dans MaxIt</div>
      {!compact && <div style={{ fontSize: 11, color: "#AA6633", marginTop: 3 }}>Solde · Virements · Relevé complet</div>}
    </div>
    <button onClick={() => alert("Ouverture MaxIt")} style={{ background: C.maxit, color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" }}>
      Ouvrir MaxIt
    </button>
  </div>
);

const Modal = ({ order, onClose, onValidate, onReject }) => {
  if (!order) return null;
  const pSt = paymentStatusCfg[order.paymentStatus];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: C.card, borderRadius: 20, padding: 28, width: 480, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 800 }}>{order.id}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[["Détaillant", order.retailer], ["Zone", order.zone], ["Montant commande", fmt(order.amount)], ["Articles", order.items + " art."]].map(([k, v]) => (
            <div key={k} style={{ background: C.bg, borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 3 }}>{k}</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{v}</div>
            </div>
          ))}
        </div>
        {/* RÈGLE D'OR : statut paiement seulement — pas le détail financier */}
        <div style={{ background: "linear-gradient(135deg, #1A0600, #0D0300)", border: `1px solid ${C.maxit}25`, borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: "#886633", marginBottom: 3 }}>Statut paiement (MaxIt)</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: pSt.color }}>{pSt.icon} {pSt.label}</div>
          </div>
          <MaxItBanner compact />
        </div>
        {order.status === "en_attente" && (
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => onValidate(order)} style={{ flex: 1, background: C.green, color: C.bg, border: "none", borderRadius: 12, padding: "13px", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>✓ Valider</button>
            <button onClick={() => onReject(order)} style={{ flex: 1, background: C.redDim, color: C.red, border: `1px solid ${C.red}30`, borderRadius: 12, padding: "13px", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>✕ Rejeter</button>
          </div>
        )}
      </div>
    </div>
  );
};

const MiniChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.val));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 56 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <div style={{ width: "100%", background: d.val === max ? C.orange : `${C.orange}30`, borderRadius: 4, height: `${(d.val / max) * 48}px`, transition: "height 0.3s" }} />
          <div style={{ fontSize: 10, color: C.textMuted }}>{d.day}</div>
        </div>
      ))}
    </div>
  );
};

export default function LiggeyPro() {
  const [page, setPage] = useState("dashboard");
  const [orders, setOrders] = useState(mockOrders);
  const [products, setProducts] = useState(mockProducts);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", cat: "", price: "", stock: "" });

  const validateOrder = (o) => { setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: "validee" } : x)); setSelectedOrder(null); };
  const rejectOrder = (o) => { setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: "annulee" } : x)); setSelectedOrder(null); };
  const pending = orders.filter(o => o.status === "en_attente").length;
  const filteredOrders = orders.filter(o => (filterStatus === "all" || o.status === filterStatus) && (!search || o.retailer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase())));

  const chartData = [{ day: "L", val: 4.2 }, { day: "M", val: 5.8 }, { day: "M", val: 3.9 }, { day: "J", val: 7.1 }, { day: "V", val: 6.4 }, { day: "S", val: 8.4 }, { day: "D", val: 0 }];

  const s = {
    app: { display: "flex", minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif" },
    sidebar: { width: 220, background: C.sidebar, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" },
    main: { flex: 1, padding: "24px 28px", overflowY: "auto" },
    navItem: (active) => ({ display: "flex", alignItems: "center", gap: 9, padding: "10px 16px", borderRadius: 10, cursor: "pointer", background: active ? `${C.orange}14` : "transparent", color: active ? C.orange : C.textMuted, fontWeight: active ? 700 : 500, fontSize: 13, border: active ? `1px solid ${C.orange}25` : "1px solid transparent", marginBottom: 2 }),
    card: { background: C.card, borderRadius: 14, padding: 18, border: `1px solid ${C.border}` },
    tableHead: { display: "grid", padding: "9px 14px", background: C.bg, borderRadius: "10px 10px 0 0", fontSize: 10, fontWeight: 800, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.8 },
    tableRow: { display: "grid", padding: "13px 14px", borderTop: `1px solid ${C.border}`, fontSize: 13, alignItems: "center" },
    btn: (bg = C.orange, color = "#fff") => ({ background: bg, color, border: "none", borderRadius: 9, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }),
    inp: { background: C.bg, border: `1px solid ${C.border}`, borderRadius: 9, padding: "9px 12px", color: C.text, fontSize: 13, outline: "none" },
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "orders", label: "Commandes", icon: "📦", badge: pending },
    { id: "products", label: "Produits", icon: "🏷️" },
    { id: "deliveries", label: "Livraisons", icon: "🚚" },
    { id: "payments", label: "Paiements", icon: "💳" },
    { id: "reporting", label: "Reporting", icon: "📈" },
    { id: "settings", label: "Paramètres", icon: "⚙️" },
  ];

  return (
    <div style={s.app}>
      {/* SIDEBAR */}
      <div style={s.sidebar}>
        <div style={{ padding: "24px 16px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `${C.orange}20`, border: `1px solid ${C.orange}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏭</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: C.orange }}>LIGGEY PRO</div>
              <div style={{ fontSize: 10, color: C.textMuted }}>Dakar Céréales</div>
            </div>
          </div>
        </div>
        <div style={{ padding: "0 10px", flex: 1 }}>
          {navItems.map(item => (
            <div key={item.id} style={{ ...s.navItem(page === item.id), position: "relative" }} onClick={() => setPage(item.id)}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge > 0 && <span style={{ background: C.orange, color: "#fff", borderRadius: 20, fontSize: 10, fontWeight: 800, padding: "1px 6px" }}>{item.badge}</span>}
            </div>
          ))}
        </div>
        {/* RÈGLE D'OR : MaxIt dans le sidebar */}
        <div style={{ padding: "12px 10px 20px" }}>
          <button onClick={() => alert("Ouverture MaxIt")} style={{ ...s.btn(C.maxit), width: "100%", display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
            <span>💳</span> MaxIt
          </button>
          <div style={{ fontSize: 10, color: "#664422", textAlign: "center", marginTop: 6 }}>Wallet · Paiements · Crédit</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={s.main}>
        {/* TOPBAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, color: C.orange, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 }}>Liggey Pro</div>
            <div style={{ fontSize: 20, fontWeight: 900 }}>{navItems.find(n => n.id === page)?.label}</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ position: "relative" }}>
              <input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...s.inp, paddingLeft: 32, width: 200 }} />
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.textMuted, fontSize: 13 }}>🔍</span>
            </div>
          </div>
        </div>

        {/* ── DASHBOARD ── */}
        {page === "dashboard" && (
          <div>
            {/* RÈGLE D'OR : KPIs commerciaux OK — accès financier via MaxIt */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
              {[
                { label: "Commandes du jour", value: "47", icon: "📦", color: C.blue },
                { label: "GMV du jour", value: "8.4M F", icon: "📊", color: C.orange, note: "commercial" },
                { label: "En attente validation", value: pending, icon: "⏳", color: C.yellow },
                { label: "Taux validation", value: "89%", icon: "✅", color: C.green },
              ].map((k, i) => (
                <div key={i} style={s.card}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>{k.label}</div>
                    <span style={{ fontSize: 18 }}>{k.icon}</span>
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: k.color }}>{k.value}</div>
                  {k.note && <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>Flux commercial</div>}
                </div>
              ))}
            </div>

            {/* RÈGLE D'OR : bannière MaxIt pour les paiements encaissés */}
            <div style={{ marginBottom: 20 }}>
              <MaxItBanner />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 20 }}>
              <div style={s.card}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 14 }}>Dernières commandes</div>
                {orders.slice(0, 4).map(o => (
                  <div key={o.id} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{o.id}</div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>{o.retailer}</div>
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{fmt(o.amount)}</div>
                      <Badge status={o.status} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={s.card}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>GMV — 7 jours</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 14 }}>Volume commercial (M FCFA)</div>
                <MiniChart data={chartData} />
                <div style={{ marginTop: 14, paddingTop: 10, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
                  <div><div style={{ fontSize: 11, color: C.textMuted }}>Semaine</div><div style={{ fontSize: 17, fontWeight: 900 }}>35.8M F</div></div>
                  <div style={{ textAlign: "right" }}><div style={{ fontSize: 11, color: C.textMuted }}>Tendance</div><div style={{ fontSize: 14, fontWeight: 700, color: C.green }}>↑ +22%</div></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {page === "orders" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
              {[["all", "Toutes"], ["en_attente", "En attente"], ["validee", "Validées"], ["en_livraison", "En livraison"], ["livree", "Livrées"]].map(([k, l]) => (
                <button key={k} onClick={() => setFilterStatus(k)} style={{ ...s.btn(filterStatus === k ? C.orange : C.card, filterStatus === k ? "#fff" : C.textMuted), border: `1px solid ${filterStatus === k ? C.orange : C.border}` }}>{l}</button>
              ))}
            </div>
            <div style={s.card}>
              <div style={{ ...s.tableHead, gridTemplateColumns: "130px 1fr 110px 100px 120px 90px 90px" }}>
                <div>Référence</div><div>Détaillant</div><div>Zone</div><div>Montant</div><div>Paiement MaxIt</div><div>Statut</div><div>Action</div>
              </div>
              {filteredOrders.map(o => {
                const pSt = paymentStatusCfg[o.paymentStatus];
                return (
                  <div key={o.id} style={{ ...s.tableRow, gridTemplateColumns: "130px 1fr 110px 100px 120px 90px 90px" }}>
                    <div style={{ fontWeight: 800, color: C.orange }}>{o.id}</div>
                    <div><div style={{ fontWeight: 600 }}>{o.retailer}</div><div style={{ fontSize: 11, color: C.textMuted }}>{o.date}</div></div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>{o.zone}</div>
                    <div style={{ fontWeight: 800 }}>{fmt(o.amount)}</div>
                    {/* RÈGLE D'OR : statut paiement MaxIt — pas de montant déboursé */}
                    <div><span style={{ fontSize: 10, color: pSt.color }}>{pSt.icon} {pSt.label.replace(" MaxIt", "")}</span></div>
                    <div><Badge status={o.status} /></div>
                    <div style={{ display: "flex", gap: 5 }}>
                      <button onClick={() => setSelectedOrder(o)} style={{ background: C.blueDim, color: C.blue, border: "none", borderRadius: 7, padding: "5px 9px", fontSize: 12, cursor: "pointer" }}>Voir</button>
                      {o.status === "en_attente" && <button onClick={() => validateOrder(o)} style={{ background: C.greenDim, color: C.green, border: "none", borderRadius: 7, padding: "5px 9px", fontSize: 12, cursor: "pointer" }}>✓</button>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {page === "products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ fontSize: 12, color: C.textMuted }}>{products.length} produits</div>
              <button onClick={() => setShowProductForm(!showProductForm)} style={s.btn()}>+ Nouveau produit</button>
            </div>
            {showProductForm && (
              <div style={{ ...s.card, marginBottom: 18, border: `1px solid ${C.orange}30` }}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 14 }}>Nouveau produit</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
                  {[["Nom", "name"], ["Catégorie", "cat"], ["Prix FCFA", "price"], ["Stock", "stock"]].map(([ph, k]) => (
                    <input key={k} placeholder={ph} value={newProduct[k]} onChange={e => setNewProduct({ ...newProduct, [k]: e.target.value })} style={{ ...s.inp, width: "100%", boxSizing: "border-box" }} />
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => { if (newProduct.name) { setProducts(prev => [...prev, { ...newProduct, id: Date.now(), status: "actif", price: parseInt(newProduct.price) || 0, stock: parseInt(newProduct.stock) || 0 }]); setNewProduct({ name: "", cat: "", price: "", stock: "" }); setShowProductForm(false); } }} style={s.btn()}>Enregistrer</button>
                  <button onClick={() => setShowProductForm(false)} style={{ ...s.btn(C.card, C.text), border: `1px solid ${C.border}` }}>Annuler</button>
                </div>
              </div>
            )}
            <div style={s.card}>
              <div style={{ ...s.tableHead, gridTemplateColumns: "1fr 110px 120px 80px 120px 100px" }}>
                <div>Produit</div><div>Catégorie</div><div>Prix</div><div>Stock</div><div>Statut</div><div>Actions</div>
              </div>
              {products.map(p => (
                <div key={p.id} style={{ ...s.tableRow, gridTemplateColumns: "1fr 110px 120px 80px 120px 100px" }}>
                  <div style={{ fontWeight: 700 }}>{p.name}</div>
                  <div style={{ color: C.textMuted }}>{p.cat}</div>
                  <div style={{ fontWeight: 700 }}>{fmt(p.price)}</div>
                  <div style={{ fontWeight: 700, color: p.stock === 0 ? C.red : p.stock < 20 ? C.yellow : C.text }}>{p.stock}</div>
                  <div><Badge status={p.status} /></div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{ ...s.btn(C.blueDim, C.blue) }}>Éditer</button>
                    <button onClick={() => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, status: x.status === "actif" ? "rupture" : "actif" } : x))} style={{ ...s.btn(C.yellowDim, C.yellow) }}>{p.status === "actif" ? "Off" : "On"}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PAYMENTS ── */}
        {page === "payments" && (
          <div>
            {/* RÈGLE D'OR : page paiements = statuts MaxIt seulement */}
            <div style={{ marginBottom: 20 }}>
              <MaxItBanner />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
              {[
                { label: "Commandes payées (MaxIt)", val: orders.filter(o => o.paymentStatus === "recu_maxit").length, color: C.green, note: "Confirmé par MaxIt" },
                { label: "En attente MaxIt", val: orders.filter(o => o.paymentStatus === "en_attente_maxit").length, color: C.yellow, note: "Paiement en cours" },
                { label: "Crédit B2B actif", val: orders.filter(o => o.paymentStatus === "confirme_maxit").length, color: C.blue, note: "Géré par MaxIt" },
              ].map((k, i) => (
                <div key={i} style={s.card}>
                  <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>{k.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: k.color }}>{k.val}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{k.note}</div>
                </div>
              ))}
            </div>
            <div style={s.card}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>Statuts paiements commandes</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 14 }}>Les montants encaissés sont disponibles dans MaxIt</div>
              <div style={{ ...s.tableHead, gridTemplateColumns: "140px 1fr 120px 120px" }}>
                <div>Commande</div><div>Détaillant</div><div>Montant</div><div>Statut MaxIt</div>
              </div>
              {orders.map(o => {
                const pSt = paymentStatusCfg[o.paymentStatus];
                return (
                  <div key={o.id} style={{ ...s.tableRow, gridTemplateColumns: "140px 1fr 120px 120px" }}>
                    <div style={{ fontWeight: 700, color: C.orange }}>{o.id}</div>
                    <div style={{ fontWeight: 600 }}>{o.retailer}</div>
                    <div style={{ fontWeight: 800 }}>{fmt(o.amount)}</div>
                    <div style={{ fontSize: 12, color: pSt.color, fontWeight: 700 }}>{pSt.icon} {pSt.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── DELIVERIES ── */}
        {page === "deliveries" && (
          <div style={s.card}>
            <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 14 }}>Livraisons en cours</div>
            <div style={{ ...s.tableHead, gridTemplateColumns: "130px 140px 1fr 110px 90px" }}>
              <div>Livraison</div><div>Commande</div><div>Commercial B2B</div><div>Zone</div><div>Statut</div>
            </div>
            {[
              { id: "LIV-0201", orderId: "CMD-0479", agent: "Moussa Ndiaye", zone: "Grand Yoff", status: "en_route" },
              { id: "LIV-0200", orderId: "CMD-0480", agent: "Non assigné", zone: "Médina", status: "a_assigner" },
              { id: "LIV-0199", orderId: "CMD-0477", agent: "Ibrahima Sow", zone: "Parcelles", status: "planifie" },
            ].map(d => (
              <div key={d.id} style={{ ...s.tableRow, gridTemplateColumns: "130px 140px 1fr 110px 90px" }}>
                <div style={{ fontWeight: 800, color: C.orange }}>{d.id}</div>
                <div style={{ color: C.textMuted }}>{d.orderId}</div>
                <div style={{ fontWeight: d.agent === "Non assigné" ? 400 : 600, color: d.agent === "Non assigné" ? C.red : C.text }}>{d.agent}</div>
                <div style={{ color: C.textMuted }}>{d.zone}</div>
                <div><span style={{ fontSize: 11, fontWeight: 700, color: d.status === "en_route" ? C.blue : d.status === "a_assigner" ? C.red : C.green }}>{d.status === "en_route" ? "En route 🚚" : d.status === "a_assigner" ? "À assigner ⚠️" : "Planifié 📅"}</span></div>
              </div>
            ))}
          </div>
        )}

        {/* ── REPORTING ── */}
        {page === "reporting" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
              <div style={s.card}><div style={{ fontSize: 14, fontWeight: 800, marginBottom: 14 }}>GMV hebdomadaire</div><MiniChart data={chartData} /></div>
              <div style={s.card}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 14 }}>Top produits</div>
                {mockProducts.slice(0, 4).map((p, i) => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={{ width: 22, height: 22, borderRadius: 5, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: C.orange }}>{i + 1}</div>
                      <div style={{ fontSize: 13 }}>{p.name}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{fmt(p.price * Math.floor(Math.random() * 50 + 10))}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={s.card}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 14 }}>KPIs commerciaux</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                {[{ l: "Taux validation", v: "89%", c: C.green }, { l: "Délai livraison", v: "4.2h", c: C.blue }, { l: "Nb commandes", v: "47", c: C.orange }, { l: "Défaut crédit*", v: "2.1%", c: C.red }, { l: "NPS détaillants", v: "+68", c: C.purple }].map((k, i) => (
                  <div key={i} style={{ background: C.bg, borderRadius: 10, padding: 12, textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: k.c }}>{k.v}</div>
                    <div style={{ fontSize: 10, color: C.textMuted, marginTop: 3 }}>{k.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 10, color: C.textMuted, marginTop: 10 }}>* Taux défaut = données comportementales B2B — gestion financière dans MaxIt</div>
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {page === "settings" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { title: "Profil fournisseur", items: ["Nom entreprise", "Adresse", "Contact", "Logo"] },
              { title: "Utilisateurs", items: ["Rôles & accès", "Inviter", "Journal d'accès", "Permissions"] },
              { title: "Notifications commerciales", items: ["Alertes commandes", "Alertes stock", "Alertes livraison", "SMS"] },
              { title: "Intégrations", items: ["Liggey Go (terrain)", "API Catalogue", "Export données", "Webhooks"] },
            ].map((sec, i) => (
              <div key={i} style={s.card}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 14 }}>{sec.title}</div>
                {sec.items.map((item, j) => (
                  <div key={j} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: j < sec.items.length - 1 ? `1px solid ${C.border}` : "none", cursor: "pointer" }}>
                    <span style={{ fontSize: 13, color: C.textMuted }}>{item}</span>
                    <span style={{ color: C.textDim }}>›</span>
                  </div>
                ))}
              </div>
            ))}
            <div style={{ ...s.card, border: `1px solid ${C.maxit}25`, background: "linear-gradient(135deg, #1A0600, #0D0300)" }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.maxit, marginBottom: 10 }}>💳 Paramètres MaxIt</div>
              <div style={{ fontSize: 12, color: "#AA6633", marginBottom: 12 }}>Compte marchand · Relevés · Virements</div>
              <button onClick={() => alert("Ouverture MaxIt")} style={{ ...s.btn(C.maxit), width: "100%" }}>Ouvrir MaxIt Pro</button>
            </div>
          </div>
        )}
      </div>

      {selectedOrder && <Modal order={selectedOrder} onClose={() => setSelectedOrder(null)} onValidate={validateOrder} onReject={rejectOrder} />}
    </div>
  );
}
