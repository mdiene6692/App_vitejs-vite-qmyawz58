import { useState } from "react";

const C = {
  bg: "#07090F",
  card: "#0F1520",
  cardBorder: "#192030",
  orange: "#FF6B00",
  orangeDim: "#FF6B0018",
  green: "#00C896",
  greenDim: "#00C89618",
  red: "#FF4A6E",
  redDim: "#FF4A6E18",
  blue: "#4A8FFF",
  blueDim: "#4A8FFF18",
  yellow: "#FFB830",
  yellowDim: "#FFB83018",
  maxit: "#FF8C00",
  maxitDim: "#FF8C0015",
  text: "#E8F0FF",
  textMuted: "#5A7090",
  textDim: "#1E2E45",
};

const fmt = (n) => n?.toLocaleString("fr-FR") + " F";

const mockData = {
  user: { name: "Mamadou Diallo", shop: "Boutique Yoff Centre", phone: "77 412 33 21" },
  credit: { available: 125000, used: 75000, limit: 200000, score: 72 },
  orders: [
    { id: "CMD-0481", supplier: "Dakar Céréales", amount: 45000, status: "en_livraison", date: "25/03", items: 4 },
    { id: "CMD-0479", supplier: "Grands Moulins", amount: 28500, status: "validee", date: "24/03", items: 2 },
    { id: "CMD-0477", supplier: "Orange Distri", amount: 62000, status: "livree", date: "23/03", items: 7 },
  ],
  suppliers: [
    { id: 1, name: "Dakar Céréales", cat: "Alimentaire", zone: "Plateau", rating: 4.8 },
    { id: 2, name: "Grands Moulins", cat: "Farine & Blé", zone: "Zone Franche", rating: 4.9 },
    { id: 3, name: "Orange Distri Pro", cat: "Télécom", zone: "Dakar", rating: 4.7 },
    { id: 4, name: "SOBOA Boissons", cat: "Boissons", zone: "Hann", rating: 4.6 },
    { id: 5, name: "PATISEN Biscuits", cat: "Snacks", zone: "Rufisque", rating: 4.5 },
  ],
  products: [
    { id: 1, name: "Riz parfumé 25kg", price: 18500, stock: 240, unit: "Sac", supplierId: 1 },
    { id: 2, name: "Huile Jumbo 5L", price: 7200, stock: 180, unit: "Bidon", supplierId: 1 },
    { id: 3, name: "Sucre cristal 50kg", price: 34000, stock: 95, unit: "Sac", supplierId: 1 },
    { id: 4, name: "Lait Gloria 400g", price: 2800, stock: 420, unit: "Boîte", supplierId: 1 },
    { id: 5, name: "Farine spéciale 50kg", price: 21000, stock: 130, unit: "Sac", supplierId: 2 },
  ],
  notifications: [
    { id: 1, type: "livraison", msg: "CMD-0481 en route — livraison prévue 14h30", time: "Il y a 15 min", read: false },
    { id: 2, type: "commande", msg: "CMD-0479 validée par Grands Moulins", time: "Il y a 2h", read: false },
    { id: 3, type: "commande", msg: "CMD-0477 livrée et confirmée", time: "Hier", read: true },
  ],
};

const statusConfig = {
  validee: { label: "Validée", color: C.green, bg: C.greenDim },
  en_livraison: { label: "En livraison", color: C.yellow, bg: C.yellowDim },
  livree: { label: "Livrée ✓", color: C.green, bg: C.greenDim },
  soumise: { label: "Soumise", color: C.blue, bg: C.blueDim },
  annulee: { label: "Annulée", color: C.red, bg: C.redDim },
};

// Composant MaxIt CTA — le seul point d'entrée vers le wallet
const MaxItButton = ({ label = "Ouvrir MaxIt", compact = false, onPress }) => (
  <button onClick={onPress || (() => alert("Ouverture MaxIt"))}
    style={{ background: `linear-gradient(135deg, ${C.maxit}, #CC5500)`, color: "#fff", border: "none", borderRadius: compact ? 10 : 14, padding: compact ? "8px 14px" : "14px 20px", fontSize: compact ? 12 : 14, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, width: compact ? "auto" : "100%", justifyContent: "center" }}>
    <span style={{ fontSize: compact ? 14 : 16 }}>💳</span>
    {label}
  </button>
);

// Carte "Accès MaxIt" — remplace l'ancien affichage wallet
const MaxItAccessCard = () => (
  <div style={{ background: `linear-gradient(135deg, #1A0800, #0F0500)`, borderRadius: 20, padding: "18px 20px", margin: "0 16px 12px", border: `1px solid ${C.maxit}30` }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
      <div>
        <div style={{ fontSize: 11, color: C.maxit, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>MaxIt</div>
        <div style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>MaxIt — Mon Wallet</div>
        <div style={{ fontSize: 12, color: "#AA7755", marginTop: 2 }}>Solde · Paiements · Transferts</div>
      </div>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${C.maxit}20`, border: `1px solid ${C.maxit}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>💳</div>
    </div>
    <MaxItButton label="Voir mon solde & payer" />
    <div style={{ marginTop: 10, fontSize: 11, color: "#886644", textAlign: "center" }}>
      Le paiement de vos commandes s'effectue dans MaxIt
    </div>
  </div>
);

export default function LiggeyApp() {
  const [screen, setScreen] = useState("home");
  const [activeTab, setActiveTab] = useState("home");
  const [cart, setCart] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const unread = mockData.notifications.filter(n => !n.read).length;

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = (p) => setCart(prev => {
    const ex = prev.find(i => i.id === p.id);
    return ex ? prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...p, qty: 1 }];
  });
  const updateQty = (id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));

  const nav = (s, data = null) => {
    if (s === "catalog" && data) setSelectedSupplier(data);
    if (s === "order_detail" && data) setSelectedOrder(data);
    setScreen(s);
    if (["home", "orders", "credit", "notifications", "profile"].includes(s)) setActiveTab(s);
    setSearchQ("");
  };
  const goToMaxItCheckout = () => {
    const id = "CMD-0" + (Math.floor(Math.random() * 900) + 100);
    setOrderSuccess({ id, amount: cartTotal, supplier: selectedSupplier?.name });
    setCart([]);
    setScreen("order_success");
  };

  const s = {
    app: { width: 390, minHeight: 844, background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif", margin: "0 auto", borderRadius: 32, boxShadow: "0 40px 80px rgba(0,0,0,0.7)", position: "relative", overflow: "hidden" },
    scr: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflowY: "auto", paddingBottom: 84 },
    hdr: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "52px 20px 14px" },
    card: { background: C.card, borderRadius: 14, padding: 16, margin: "0 16px 10px", border: `1px solid ${C.cardBorder}` },
    btn: (bg = C.orange, color = "#fff") => ({ background: bg, color, border: "none", borderRadius: 14, padding: "15px 20px", fontSize: 15, fontWeight: 800, width: "100%", cursor: "pointer" }),
    badge: (color, bg) => ({ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color, background: bg }),
    navBar: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 390, background: "rgba(7,9,15,0.97)", backdropFilter: "blur(20px)", borderTop: `1px solid ${C.cardBorder}`, display: "flex", justifyContent: "space-around", padding: "10px 8px 26px", zIndex: 100 },
    inp: { background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "11px 14px", color: C.text, fontSize: 14, width: "100%", outline: "none", boxSizing: "border-box" },
  };

  const NavBar = () => (
    <div style={s.navBar}>
      {[{ id: "home", icon: "🏠", label: "Accueil" }, { id: "orders", icon: "📦", label: "Commandes" }, { id: "credit", icon: "📊", label: "Crédit" }, { id: "notifications", icon: "🔔", label: "", badge: unread }, { id: "profile", icon: "👤", label: "Profil" }].map(t => (
        <div key={t.id} onClick={() => nav(t.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", opacity: activeTab === t.id ? 1 : 0.4 }}>
          <div style={{ position: "relative" }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            {t.badge > 0 && <div style={{ position: "absolute", top: -4, right: -6, background: C.red, borderRadius: "50%", width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff" }}>{t.badge}</div>}
          </div>
          <span style={{ fontSize: 9, fontWeight: 700, color: activeTab === t.id ? C.orange : C.textMuted }}>{t.label || t.id}</span>
        </div>
      ))}
    </div>
  );
  const BackBtn = ({ to }) => <button onClick={() => nav(to)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: C.text, padding: 0 }}>‹</button>;

  // ── HOME ──
  if (screen === "home") return (
    <div style={s.app}><div style={s.scr}>
      <div style={{ padding: "50px 20px 12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 11, color: C.orange, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>LIGGEY</div>
          <div style={{ fontSize: 19, fontWeight: 900, marginTop: 2 }}>{mockData.user.name}</div>
          <div style={{ fontSize: 13, color: C.textMuted }}>{mockData.user.shop}</div>
        </div>
        <div style={{ position: "relative", cursor: "pointer" }} onClick={() => nav("notifications")}>
          <span style={{ fontSize: 22 }}>🔔</span>
          {unread > 0 && <div style={{ position: "absolute", top: -3, right: -3, background: C.red, borderRadius: "50%", width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff" }}>{unread}</div>}
        </div>
      </div>

      {/* RÈGLE D'OR : MaxIt access card — pas de solde wallet ici */}
      <MaxItAccessCard />

      {/* Carte crédit — éligibilité visible, score visible, exécution dans MaxIt */}
      <div style={{ ...s.card, background: "linear-gradient(135deg, #0A1A1A, #051210)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Crédit B2B disponible</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: C.green, marginTop: 4 }}>{fmt(mockData.credit.available)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: C.textMuted }}>Score</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.green }}>{mockData.credit.score}<span style={{ fontSize: 12, color: C.textMuted }}>/100</span></div>
          </div>
        </div>
        <div style={{ height: 5, background: C.cardBorder, borderRadius: 3, overflow: "hidden", marginBottom: 10 }}>
          <div style={{ height: "100%", width: `${(mockData.credit.used / mockData.credit.limit) * 100}%`, background: `linear-gradient(90deg, ${C.green}, #00A07A)`, borderRadius: 3 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.textMuted, marginBottom: 12 }}>
          <span>Utilisé : {fmt(mockData.credit.used)}</span><span>Limite : {fmt(mockData.credit.limit)}</span>
        </div>
        <MaxItButton label="Rembourser via MaxIt" compact />
      </div>

      {/* Actions rapides */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 16px", marginBottom: 12 }}>
        {[
          { label: "Nouvelle commande", icon: "🛒", action: () => nav("suppliers"), primary: true },
          { label: "Historique", icon: "📋", action: () => nav("orders") },
        ].map((a, i) => (
          <button key={i} onClick={a.action} style={{ background: a.primary ? `${C.orange}15` : C.card, border: `1px solid ${a.primary ? C.orange + "40" : C.cardBorder}`, borderRadius: 14, padding: "16px 12px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 8, textAlign: "left" }}>
            <span style={{ fontSize: 22 }}>{a.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: a.primary ? C.orange : C.text }}>{a.label}</span>
          </button>
        ))}
      </div>

      {/* Commandes actives */}
      <div style={{ padding: "0 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 800 }}>Commandes actives</div>
          <div style={{ fontSize: 13, color: C.orange, cursor: "pointer" }} onClick={() => nav("orders")}>Tout voir</div>
        </div>
        {mockData.orders.slice(0, 2).map(o => {
          const st = statusConfig[o.status];
          return (
            <div key={o.id} style={{ ...s.card, margin: "0 0 8px", cursor: "pointer", padding: "14px 16px" }} onClick={() => nav("order_detail", o)}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>{o.id}</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>{o.supplier} · {o.items} art.</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{fmt(o.amount)}</div>
                  <div style={{ ...s.badge(st.color, st.bg), marginTop: 4 }}>{st.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div><NavBar /></div>
  );

  // ── SUPPLIERS ──
  if (screen === "suppliers") return (
    <div style={s.app}><div style={s.scr}>
      <div style={s.hdr}><BackBtn to="home" /><div style={{ fontSize: 17, fontWeight: 800 }}>Fournisseurs</div><div style={{ width: 24 }} /></div>
      <div style={{ padding: "0 16px 12px" }}>
        <input placeholder="Rechercher..." value={searchQ} onChange={e => setSearchQ(e.target.value)} style={s.inp} />
      </div>
      <div style={{ padding: "0 16px" }}>
        {mockData.suppliers.filter(f => f.name.toLowerCase().includes(searchQ.toLowerCase())).map(sup => (
          <div key={sup.id} style={{ ...s.card, margin: "0 0 10px", cursor: "pointer", padding: "14px 16px" }} onClick={() => nav("catalog", sup)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 44, height: 44, background: `${C.orange}15`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏭</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>{sup.name}</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>{sup.cat} · {sup.zone}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <span style={{ fontSize: 13 }}>⭐</span>
                <span style={{ fontSize: 13, fontWeight: 800 }}>{sup.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div><NavBar /></div>
  );

  // ── CATALOG ──
  if (screen === "catalog") return (
    <div style={s.app}><div style={s.scr}>
      <div style={s.hdr}>
        <BackBtn to="suppliers" />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 800 }}>{selectedSupplier?.name}</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>{selectedSupplier?.cat}</div>
        </div>
        <div style={{ position: "relative", cursor: "pointer" }} onClick={() => nav("cart")}>
          <span style={{ fontSize: 22 }}>🛒</span>
          {cartCount > 0 && <div style={{ position: "absolute", top: -5, right: -5, background: C.orange, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff" }}>{cartCount}</div>}
        </div>
      </div>
      <div style={{ padding: "0 16px 12px" }}>
        <input placeholder="Rechercher un produit..." value={searchQ} onChange={e => setSearchQ(e.target.value)} style={s.inp} />
      </div>
      <div style={{ padding: "0 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {mockData.products.filter(p => p.supplierId === selectedSupplier?.id && p.name.toLowerCase().includes(searchQ.toLowerCase())).map(p => {
          const inCart = cart.find(i => i.id === p.id);
          return (
            <div key={p.id} style={{ background: C.card, borderRadius: 14, padding: 14, border: `1px solid ${C.cardBorder}` }}>
              <div style={{ background: `${C.orange}10`, borderRadius: 10, height: 64, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 10 }}>🛍️</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>Stock: {p.stock} {p.unit}</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: C.orange, marginBottom: 10 }}>{fmt(p.price)}</div>
              {inCart ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: `${C.orange}15`, borderRadius: 10, padding: "6px 12px" }}>
                  <button onClick={() => updateQty(p.id, -1)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.orange }}>−</button>
                  <span style={{ fontWeight: 900, color: C.orange }}>{inCart.qty}</span>
                  <button onClick={() => updateQty(p.id, 1)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.orange }}>+</button>
                </div>
              ) : (
                <button onClick={() => addToCart(p)} style={{ ...s.btn(), padding: "10px", fontSize: 13, borderRadius: 10 }}>+ Ajouter</button>
              )}
            </div>
          );
        })}
      </div>
      {cartCount > 0 && (
        <div style={{ position: "absolute", bottom: 24, left: 16, right: 16, zIndex: 99 }}>
          <button onClick={() => nav("cart")} style={{ ...s.btn(), display: "flex", justifyContent: "space-between", borderRadius: 16 }}>
            <span style={{ background: "rgba(255,255,255,0.25)", borderRadius: 8, padding: "2px 8px" }}>{cartCount}</span>
            <span>Voir le panier</span>
            <span>{fmt(cartTotal)}</span>
          </button>
        </div>
      )}
    </div></div>
  );

  // ── CART ──
  if (screen === "cart") return (
    <div style={s.app}><div style={s.scr}>
      <div style={s.hdr}><BackBtn to="catalog" /><div style={{ fontSize: 17, fontWeight: 800 }}>Mon Panier</div><div style={{ width: 24 }} /></div>
      <div style={{ padding: "0 16px" }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: C.textMuted }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🛒</div>
            <div>Panier vide</div>
          </div>
        ) : (
          <>
            {cart.map(item => (
              <div key={item.id} style={{ ...s.card, margin: "0 0 8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{item.name}</div>
                    <div style={{ fontSize: 13, color: C.orange }}>{fmt(item.price)}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button onClick={() => updateQty(item.id, -1)} style={{ background: C.cardBorder, border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 16, color: C.text }}>−</button>
                    <span style={{ fontSize: 16, fontWeight: 800, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} style={{ background: C.orange, border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 16, color: "#fff" }}>+</button>
                  </div>
                </div>
                <div style={{ marginTop: 6, textAlign: "right", fontSize: 14, fontWeight: 800, color: C.orange }}>{fmt(item.price * item.qty)}</div>
              </div>
            ))}

            {/* RÈGLE D'OR : mode de paiement — pas de débit ici */}
            <div style={{ ...s.card, background: "linear-gradient(135deg, #1A0800, #0D0400)", border: `1px solid ${C.maxit}25` }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.maxit, marginBottom: 10 }}>💳 Paiement via MaxIt</div>
              <div style={{ fontSize: 12, color: "#AA7755", lineHeight: 1.6, marginBottom: 12 }}>
                Le paiement s'effectue dans MaxIt (MaxIt). Confirmez la commande ci-dessous — MaxIt s'ouvrira pour finaliser le paiement ou activer le crédit.
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["Wallet OM", "Crédit J+7", "Crédit J+30"].map((m, i) => (
                  <div key={i} style={{ flex: 1, background: C.cardBorder, borderRadius: 8, padding: "8px 6px", textAlign: "center", fontSize: 11, color: C.textMuted }}>{m}</div>
                ))}
              </div>
              <div style={{ fontSize: 10, color: "#664422", marginTop: 8, textAlign: "center" }}>Mode sélectionné dans MaxIt selon votre score crédit ({mockData.credit.score}/100)</div>
            </div>

            <div style={{ ...s.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Total commande</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: C.orange }}>{fmt(cartTotal)}</div>
            </div>

            {/* RÈGLE D'OR : ce bouton confirme la commande et ouvre MaxIt — ne débite PAS */}
            <button onClick={() => nav("confirm_order")} style={s.btn()}>Confirmer & passer dans MaxIt →</button>
          </>
        )}
      </div>
    </div></div>
  );

  // ── CONFIRM ──
  if (screen === "confirm_order") return (
    <div style={s.app}><div style={s.scr}>
      <div style={s.hdr}><BackBtn to="cart" /><div style={{ fontSize: 17, fontWeight: 800 }}>Récapitulatif</div><div style={{ width: 24 }} /></div>
      <div style={{ padding: "0 16px" }}>
        <div style={s.card}>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Fournisseur</div>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>{selectedSupplier?.name}</div>
          {cart.map(item => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
              <span>{item.name} × {item.qty}</span>
              <span style={{ fontWeight: 700 }}>{fmt(item.price * item.qty)}</span>
            </div>
          ))}
          <div style={{ height: 1, background: C.cardBorder, margin: "12px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 800 }}>Total</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: C.orange }}>{fmt(cartTotal)}</span>
          </div>
        </div>

        {/* RÈGLE D'OR : information claire — paiement dans MaxIt */}
        <div style={{ ...s.card, background: "linear-gradient(135deg, #1A0800, #0D0400)", border: `1px solid ${C.maxit}30` }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.maxit, marginBottom: 8 }}>📲 Prochaine étape : MaxIt</div>
          <div style={{ fontSize: 12, color: "#AA7755", lineHeight: 1.7 }}>
            En confirmant, votre commande est créée. MaxIt s'ouvre pour que vous choisissiez wallet immédiat ou crédit J+7 / J+30 selon votre score ({mockData.credit.score}/100).
          </div>
        </div>

        {/* Ce bouton crée la commande ET ouvre MaxIt */}
        <button onClick={goToMaxItCheckout} style={{ ...s.btn(`linear-gradient(135deg, ${C.maxit}, #AA4400)`) }}>
          ✓ Confirmer et ouvrir MaxIt
        </button>
      </div>
    </div></div>
  );

  // ── SUCCESS ──
  if (screen === "order_success") return (
    <div style={s.app}><div style={{ ...s.scr, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.greenDim, border: `2px solid ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 36 }}>✅</div>
      <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>Commande créée !</div>
      <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 24, textAlign: "center" }}>Finalisez le paiement dans MaxIt</div>
      <div style={{ ...s.card, width: "100%", textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: C.textMuted }}>Référence</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: C.orange }}>{orderSuccess?.id}</div>
        <div style={{ fontSize: 14, color: C.textMuted, marginTop: 2 }}>{fmt(orderSuccess?.amount)}</div>
      </div>
      <MaxItButton label="Payer dans MaxIt maintenant" />
      <button onClick={() => nav("orders")} style={{ ...s.btn(C.card, C.text), marginTop: 10, border: `1px solid ${C.cardBorder}` }}>Suivre ma commande</button>
      <button onClick={() => nav("home")} style={{ ...s.btn("none", C.textMuted), marginTop: 6, fontSize: 13 }}>Retour à l'accueil</button>
    </div></div>
  );

  // ── ORDERS ──
  if (screen === "orders") return (
    <div style={s.app}><div style={s.scr}>
      <div style={{ padding: "50px 20px 14px" }}><div style={{ fontSize: 20, fontWeight: 900 }}>Mes Commandes</div></div>
      <div style={{ padding: "0 16px" }}>
        {mockData.orders.map(o => {
          const st = statusConfig[o.status];
          return (
            <div key={o.id} style={{ ...s.card, margin: "0 0 10px", cursor: "pointer" }} onClick={() => nav("order_detail", o)}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 800 }}>{o.id}</div>
                <div style={s.badge(st.color, st.bg)}>{st.label}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 13, color: C.textMuted }}>{o.supplier}</div>
                  <div style={{ fontSize: 12, color: C.textDim }}>{o.date}</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{fmt(o.amount)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div><NavBar /></div>
  );

  // ── ORDER DETAIL ──
  if (screen === "order_detail" && selectedOrder) return (
    <div style={s.app}><div style={s.scr}>
      <div style={s.hdr}><BackBtn to="orders" /><div style={{ fontSize: 16, fontWeight: 800 }}>{selectedOrder.id}</div><div style={{ width: 24 }} /></div>
      <div style={{ padding: "0 16px" }}>
        <div style={s.card}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontSize: 13, color: C.textMuted }}>Fournisseur</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{selectedOrder.supplier}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontSize: 13, color: C.textMuted }}>Montant</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: C.orange }}>{fmt(selectedOrder.amount)}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: 13, color: C.textMuted }}>Statut</div>
            <div style={s.badge(statusConfig[selectedOrder.status].color, statusConfig[selectedOrder.status].bg)}>{statusConfig[selectedOrder.status].label}</div>
          </div>
        </div>

        {/* RÈGLE D'OR : statut paiement = OK/En attente — pas de montant détaillé ici */}
        <div style={{ ...s.card, background: "linear-gradient(135deg, #0A0800, #060400)", border: `1px solid ${C.maxit}20` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, color: "#887755", textTransform: "uppercase", letterSpacing: 1 }}>Paiement</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: selectedOrder.status === "livree" ? C.green : C.yellow, marginTop: 4 }}>
                {selectedOrder.status === "livree" ? "✓ Réglé via MaxIt" : "⏳ En attente dans MaxIt"}
              </div>
            </div>
            <MaxItButton label="MaxIt" compact />
          </div>
        </div>

        <div style={s.card}>
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 14 }}>Suivi livraison</div>
          {["soumise", "validee", "en_livraison", "livree"].map((step, i) => {
            const labels = { soumise: "Soumise", validee: "Validée", en_livraison: "En livraison", livree: "Livrée" };
            const steps = ["soumise", "validee", "en_livraison", "livree"];
            const done = steps.indexOf(step) <= steps.indexOf(selectedOrder.status);
            return (
              <div key={step} style={{ display: "flex", gap: 12, paddingBottom: i < 3 ? 14 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: done ? C.orange : C.cardBorder, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{done ? "✓" : ""}</div>
                  {i < 3 && <div style={{ width: 2, flex: 1, background: done ? C.orange : C.cardBorder, marginTop: 2, minHeight: 16 }} />}
                </div>
                <div style={{ fontSize: 13, fontWeight: done ? 600 : 400, color: done ? C.text : C.textDim, paddingTop: 3 }}>{labels[step]}</div>
              </div>
            );
          })}
        </div>
        {selectedOrder.status === "en_livraison" && (
          <button style={s.btn()}>Confirmer la réception</button>
        )}
      </div>
    </div><NavBar /></div>
  );

  // ── CREDIT ──
  if (screen === "credit") return (
    <div style={s.app}><div style={s.scr}>
      <div style={{ padding: "50px 20px 14px" }}><div style={{ fontSize: 20, fontWeight: 900 }}>Mon Crédit B2B</div></div>
      <div style={{ padding: "0 16px" }}>
        <div style={{ background: "linear-gradient(135deg, #051A10, #021008)", borderRadius: 20, padding: "22px 20px", marginBottom: 12, border: `1px solid ${C.green}20` }}>
          <div style={{ fontSize: 11, color: C.green, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Crédit disponible</div>
          <div style={{ fontSize: 34, fontWeight: 900, color: C.green, marginBottom: 14 }}>{fmt(mockData.credit.available)}</div>
          <div style={{ height: 7, background: C.cardBorder, borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ height: "100%", width: `${(mockData.credit.used / mockData.credit.limit) * 100}%`, background: `linear-gradient(90deg, ${C.green}, #00A07A)`, borderRadius: 4 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.textMuted }}>
            <span>Utilisé : {fmt(mockData.credit.used)}</span>
            <span>Limite : {fmt(mockData.credit.limit)}</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div style={s.card}>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Score crédit</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: C.green }}>{mockData.credit.score}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>/100 · Bon profil</div>
          </div>
          <div style={s.card}>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Prochaine échéance</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.yellow }}>28 Mars</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{fmt(45000)}</div>
          </div>
        </div>

        {/* RÈGLE D'OR : éligibilité visible, remboursement dans MaxIt */}
        <div style={{ ...s.card, background: "linear-gradient(135deg, #1A0800, #0D0400)", border: `1px solid ${C.maxit}25`, marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.maxit, marginBottom: 10 }}>Gérer mon crédit dans MaxIt</div>
          <div style={{ fontSize: 12, color: "#AA7755", marginBottom: 12, lineHeight: 1.6 }}>
            Le remboursement, l'activation et le détail de vos contrats crédit sont dans MaxIt (MaxIt).
          </div>
          <MaxItButton label="Rembourser dans MaxIt" />
        </div>

        <div style={s.card}>
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>Éligibilité J+7 / J+30</div>
          {[{ tenor: "J+7", min: 30, eligible: true }, { tenor: "J+30", min: 70, eligible: mockData.credit.score >= 70 }].map((e, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i === 0 ? `1px solid ${C.cardBorder}` : "none" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Crédit {e.tenor}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>Score min : {e.min}/100</div>
              </div>
              <div style={s.badge(e.eligible ? C.green : C.red, e.eligible ? C.greenDim : C.redDim)}>
                {e.eligible ? "Éligible ✓" : "Non éligible"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div><NavBar /></div>
  );

  // ── NOTIFICATIONS ──
  if (screen === "notifications") return (
    <div style={s.app}><div style={s.scr}>
      <div style={{ padding: "50px 20px 14px" }}><div style={{ fontSize: 20, fontWeight: 900 }}>Notifications</div><div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Activité commerciale — Paiements dans MaxIt</div></div>
      <div style={{ padding: "0 16px" }}>
        {mockData.notifications.map(n => {
          const icons = { livraison: "🚚", commande: "📦", credit: "💳" };
          return (
            <div key={n.id} style={{ ...s.card, margin: "0 0 8px", opacity: n.read ? 0.6 : 1, border: `1px solid ${n.read ? C.cardBorder : C.orange + "30"}` }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 20 }}>{icons[n.type]}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: n.read ? 500 : 700 }}>{n.msg}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{n.time}</div>
                </div>
                {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.orange, marginTop: 4 }} />}
              </div>
            </div>
          );
        })}
        
        <div style={{ ...s.card, background: "linear-gradient(135deg, #1A0800, #0D0400)", border: `1px solid ${C.maxit}20`, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#886644", marginBottom: 8 }}>Les notifications financières (paiements, solde) arrivent dans MaxIt</div>
          <MaxItButton label="Ouvrir MaxIt" compact />
        </div>
      </div>
    </div><NavBar /></div>
  );

  // ── PROFILE ──
  if (screen === "profile") return (
    <div style={s.app}><div style={s.scr}>
      <div style={{ padding: "50px 20px 14px" }}><div style={{ fontSize: 20, fontWeight: 900 }}>Mon Profil</div></div>
      <div style={{ padding: "0 16px" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: `${C.orange}20`, border: `2px solid ${C.orange}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontSize: 30 }}>👤</div>
          <div style={{ fontSize: 17, fontWeight: 800 }}>{mockData.user.name}</div>
          <div style={{ fontSize: 13, color: C.textMuted }}>{mockData.user.shop}</div>
          <div style={{ fontSize: 13, color: C.orange }}>{mockData.user.phone}</div>
        </div>
        <div style={{ ...s.card, background: "linear-gradient(135deg, #1A0800, #0D0400)", border: `1px solid ${C.maxit}25`, marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.maxit, marginBottom: 6 }}>💳 Mon Wallet Orange Money</div>
          <div style={{ fontSize: 12, color: "#AA7755", marginBottom: 10 }}>Solde, transactions, transferts → MaxIt</div>
          <MaxItButton label="Ouvrir MaxIt" compact />
        </div>
        {["Mon point de vente", "Sécurité & PIN", "Préférences", "Aide & Support"].map((item, i) => (
          <div key={i} style={{ ...s.card, margin: "0 0 8px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{item}</span>
            <span style={{ color: C.textMuted }}>›</span>
          </div>
        ))}
        <div style={{ ...s.card, margin: "0 0 8px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", border: `1px solid ${C.red}20` }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.red }}>Déconnexion</span>
          <span style={{ color: C.red }}>›</span>
        </div>
        <div style={{ textAlign: "center", marginTop: 12, fontSize: 10, color: C.textDim }}>Liggey v1.0 · Orange Money Sénégal</div>
      </div>
    </div><NavBar /></div>
  );

  return null;
}
