import React, { useState, useMemo } from "react";
import { ShoppingBag, Plus, Minus, X, MessageCircle, Truck, Smartphone, Check, ChevronRight } from "lucide-react";

// ====== CONFIG — à adapter par Cheick ======
const WHATSAPP_NUMBER = "22300000000"; // ⚠️ remplace par le vrai numéro WhatsApp de Top Deal Mali (format 223XXXXXXXX)
const STORE_NAME = "Top Deal Mali";

const PRODUCTS = [
  {
    id: "p1",
    name: "Ensemble pantalon jazz coton",
    category: "Mode",
    price: 12500,
    tag: "Nouveauté",
    desc: "Coupe ample, coton respirant, plusieurs coloris",
    emoji: "👖",
  },
  {
    id: "p2",
    name: "Hoodie Nike Therma-FIT",
    category: "Mode",
    price: 22000,
    tag: "Original",
    desc: "Doublure polaire, capuche doublée, coupe régulière",
    emoji: "🧥",
  },
  {
    id: "p3",
    name: "Bonnet Nike Dri-FIT",
    category: "Mode",
    price: 6500,
    tag: "Original",
    desc: "Tissu technique, évacuation de la transpiration",
    emoji: "🧢",
  },
  {
    id: "p4",
    name: "T-shirt oversize tendance",
    category: "Mode",
    price: 7500,
    tag: null,
    desc: "Coton lourd 220g, coupe oversize, 4 coloris",
    emoji: "👕",
  },
  {
    id: "p5",
    name: "Écouteurs sans fil",
    category: "Général",
    price: 9500,
    tag: "Populaire",
    desc: "Bluetooth 5.3, autonomie 20h avec boîtier",
    emoji: "🎧",
  },
  {
    id: "p6",
    name: "Powerbank 20000mAh",
    category: "Général",
    price: 13000,
    tag: null,
    desc: "Charge rapide, double port USB",
    emoji: "🔋",
  },
  {
    id: "p7",
    name: "Montre connectée",
    category: "Général",
    price: 17500,
    tag: "Populaire",
    desc: "Suivi santé, notifications, étanche",
    emoji: "⌚",
  },
  {
    id: "p8",
    name: "Sac à main tissé",
    category: "Mode",
    price: 11000,
    tag: null,
    desc: "Fait main, fermeture zip, doublure intérieure",
    emoji: "👜",
  },
];

const CATEGORIES = ["Tout", "Mode", "Général"];

const PAYMENT_METHODS = [
  { id: "cod", label: "Paiement à la livraison", sub: "Espèces, vous payez à la réception", icon: Truck },
  { id: "orange", label: "Orange Money", sub: "Paiement mobile", icon: Smartphone },
  { id: "moov", label: "Moov Money", sub: "Paiement mobile", icon: Smartphone },
  { id: "wave", label: "Wave", sub: "Paiement mobile", icon: Smartphone },
];

function formatFCFA(n) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

function StampBadge() {
  return (
    <div
      className="absolute top-3 right-3 w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center text-center leading-tight select-none pointer-events-none"
      style={{
        borderColor: "#8B4226",
        color: "#8B4226",
        transform: "rotate(-12deg)",
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: "7px",
        fontWeight: 800,
        letterSpacing: "0.02em",
        background: "rgba(237,232,214,0.55)",
        textTransform: "uppercase",
      }}
    >
      Payé à<br />la livraison
    </div>
  );
}

export default function TopDealMali() {
  const [category, setCategory] = useState("Tout");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0); // 0 = cart, 1 = payment, 2 = confirm
  const [payment, setPayment] = useState(null);
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });

  const filtered = useMemo(
    () => (category === "Tout" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category)),
    [category]
  );

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => ({ ...PRODUCTS.find((p) => p.id === id), qty })),
    [cart]
  );

  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  function addToCart(id) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }
  function changeQty(id, delta) {
    setCart((c) => {
      const next = Math.max(0, (c[id] || 0) + delta);
      return { ...c, [id]: next };
    });
  }

  function openCart() {
    setCartOpen(true);
    setCheckoutStep(0);
  }
  function closeCart() {
    setCartOpen(false);
  }

  function buildWhatsAppMessage() {
    const lines = [
      `Bonjour ${STORE_NAME} 👋, je souhaite commander :`,
      "",
      ...cartItems.map((i) => `• ${i.name} x${i.qty} — ${formatFCFA(i.price * i.qty)}`),
      "",
      `Total : ${formatFCFA(total)}`,
      `Paiement : ${PAYMENT_METHODS.find((m) => m.id === payment)?.label || ""}`,
      "",
      `Nom : ${customer.name}`,
      `Téléphone : ${customer.phone}`,
      `Adresse de livraison : ${customer.address}`,
    ];
    return encodeURIComponent(lines.join("\n"));
  }

  function sendToWhatsApp() {
    const msg = buildWhatsAppMessage();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  }

  const canGoToPayment = cartItems.length > 0;
  const canConfirm = payment && customer.name.trim() && customer.phone.trim() && customer.address.trim();

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "#EDE8D9", fontFamily: "'Inter', sans-serif", color: "#201C15" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
      `}</style>

      {/* Header */}
      <header
        className="sticky top-0 z-20 px-4 py-3 flex items-center justify-between"
        style={{ background: "#201C15", color: "#EDE8D9" }}
      >
        <div>
          <div
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "20px", letterSpacing: "-0.01em" }}
          >
            TOP DEAL <span style={{ color: "#D4A017" }}>MALI</span>
          </div>
          <div style={{ fontSize: "10px", color: "#B9AF95", fontWeight: 500, letterSpacing: "0.03em" }}>
            BAMAKO · PAIEMENT À LA LIVRAISON DISPONIBLE
          </div>
        </div>
        <button
          onClick={openCart}
          className="relative p-2 rounded-full"
          style={{ background: "#2E4374" }}
          aria-label="Voir le panier"
        >
          <ShoppingBag size={20} color="#EDE8D9" />
          {cartCount > 0 && (
            <span
              className="absolute -top-1 -right-1 rounded-full flex items-center justify-center"
              style={{
                background: "#B5502E",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 700,
                width: 20,
                height: 20,
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </header>

      {/* Trust strip */}
      <div
        className="px-4 py-2 flex items-center gap-2 text-xs"
        style={{ background: "#2E4374", color: "#EDE8D9", fontFamily: "'IBM Plex Mono', monospace" }}
      >
        <Truck size={14} />
        <span>Vous vérifiez, vous payez. Zéro avance exigée.</span>
      </div>

      {/* Category tabs */}
      <nav className="px-4 pt-4 pb-2 flex gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="px-4 py-1.5 rounded-full text-sm font-semibold transition-colors"
            style={
              category === c
                ? { background: "#B5502E", color: "#fff" }
                : { background: "transparent", color: "#201C15", border: "1.5px solid #201C15" }
            }
          >
            {c}
          </button>
        ))}
      </nav>

      {/* Product grid */}
      <main className="px-4 pb-28 pt-2 grid grid-cols-2 gap-3 max-w-2xl mx-auto">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="relative rounded-2xl p-3 flex flex-col"
            style={{ background: "#F7F3E7", border: "1px solid #DDD5BE" }}
          >
            <StampBadge />
            <div
              className="w-full aspect-square rounded-xl flex items-center justify-center text-4xl mb-2"
              style={{ background: "#EDE8D9" }}
            >
              {p.emoji}
            </div>
            {p.tag && (
              <span
                className="self-start px-2 py-0.5 rounded-full text-[10px] font-bold mb-1"
                style={{ background: "#D4A017", color: "#201C15" }}
              >
                {p.tag.toUpperCase()}
              </span>
            )}
            <div className="text-sm font-semibold leading-snug mb-0.5">{p.name}</div>
            <div className="text-[11px] mb-2" style={{ color: "#6B6252" }}>
              {p.desc}
            </div>
            <div className="mt-auto flex items-center justify-between">
              <span
                style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: "13px", color: "#8B4226" }}
              >
                {formatFCFA(p.price)}
              </span>
              {cart[p.id] ? (
                <div className="flex items-center gap-1.5" style={{ background: "#201C15", borderRadius: 999, padding: "2px 6px" }}>
                  <button onClick={() => changeQty(p.id, -1)} aria-label="Retirer un">
                    <Minus size={13} color="#EDE8D9" />
                  </button>
                  <span style={{ color: "#EDE8D9", fontSize: 12, minWidth: 12, textAlign: "center", fontFamily: "'IBM Plex Mono', monospace" }}>
                    {cart[p.id]}
                  </span>
                  <button onClick={() => changeQty(p.id, 1)} aria-label="Ajouter un">
                    <Plus size={13} color="#EDE8D9" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(p.id)}
                  className="p-1.5 rounded-full"
                  style={{ background: "#201C15" }}
                  aria-label={`Ajouter ${p.name} au panier`}
                >
                  <Plus size={14} color="#EDE8D9" />
                </button>
              )}
            </div>
          </div>
        ))}
      </main>

      {/* Floating checkout bar */}
      {cartCount > 0 && !cartOpen && (
        <button
          onClick={openCart}
          className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto rounded-2xl px-4 py-3 flex items-center justify-between shadow-lg"
          style={{ background: "#B5502E", color: "#fff" }}
        >
          <span className="text-sm font-semibold">
            {cartCount} article{cartCount > 1 ? "s" : ""} · {formatFCFA(total)}
          </span>
          <span className="flex items-center gap-1 text-sm font-bold">
            Commander <ChevronRight size={16} />
          </span>
        </button>
      )}

      {/* Cart / Checkout drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-30 flex items-end justify-center">
          <div className="absolute inset-0" style={{ background: "rgba(32,28,21,0.55)" }} onClick={closeCart} />
          <div
            className="relative w-full max-w-2xl rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto"
            style={{ background: "#F7F3E7" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 18 }}>
                {checkoutStep === 0 && "Votre panier"}
                {checkoutStep === 1 && "Mode de paiement"}
                {checkoutStep === 2 && "Vos informations"}
              </div>
              <button onClick={closeCart} aria-label="Fermer">
                <X size={22} />
              </button>
            </div>

            {/* Step 0: cart items */}
            {checkoutStep === 0 && (
              <>
                {cartItems.length === 0 ? (
                  <div className="text-sm py-8 text-center" style={{ color: "#6B6252" }}>
                    Votre panier est vide. Ajoutez des articles pour commencer.
                  </div>
                ) : (
                  <div className="space-y-3 mb-4">
                    {cartItems.map((i) => (
                      <div key={i.id} className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-xl shrink-0"
                          style={{ background: "#EDE8D9" }}
                        >
                          {i.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">{i.name}</div>
                          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#8B4226" }}>
                            {formatFCFA(i.price)}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5" style={{ background: "#201C15", borderRadius: 999, padding: "2px 6px" }}>
                          <button onClick={() => changeQty(i.id, -1)} aria-label="Retirer un">
                            <Minus size={13} color="#EDE8D9" />
                          </button>
                          <span style={{ color: "#EDE8D9", fontSize: 12, minWidth: 12, textAlign: "center", fontFamily: "'IBM Plex Mono', monospace" }}>
                            {i.qty}
                          </span>
                          <button onClick={() => changeQty(i.id, 1)} aria-label="Ajouter un">
                            <Plus size={13} color="#EDE8D9" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {cartItems.length > 0 && (
                  <>
                    <div className="flex items-center justify-between py-3 border-t" style={{ borderColor: "#DDD5BE" }}>
                      <span className="text-sm font-semibold">Total</span>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>{formatFCFA(total)}</span>
                    </div>
                    <button
                      onClick={() => setCheckoutStep(1)}
                      disabled={!canGoToPayment}
                      className="w-full py-3 rounded-xl font-bold text-sm mt-1"
                      style={{ background: "#B5502E", color: "#fff" }}
                    >
                      Continuer
                    </button>
                  </>
                )}
              </>
            )}

            {/* Step 1: payment method */}
            {checkoutStep === 1 && (
              <>
                <div className="space-y-2 mb-4">
                  {PAYMENT_METHODS.map((m) => {
                    const Icon = m.icon;
                    const selected = payment === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setPayment(m.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl text-left"
                        style={{
                          background: selected ? "#2E4374" : "#EDE8D9",
                          color: selected ? "#fff" : "#201C15",
                          border: selected ? "1.5px solid #2E4374" : "1.5px solid #DDD5BE",
                        }}
                      >
                        <Icon size={18} />
                        <div className="flex-1">
                          <div className="text-sm font-semibold">{m.label}</div>
                          <div className="text-[11px]" style={{ opacity: 0.75 }}>
                            {m.sub}
                          </div>
                        </div>
                        {selected && <Check size={16} />}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCheckoutStep(0)}
                    className="flex-1 py-3 rounded-xl font-bold text-sm"
                    style={{ background: "#EDE8D9", color: "#201C15", border: "1.5px solid #DDD5BE" }}
                  >
                    Retour
                  </button>
                  <button
                    onClick={() => setCheckoutStep(2)}
                    disabled={!payment}
                    className="flex-1 py-3 rounded-xl font-bold text-sm"
                    style={{ background: payment ? "#B5502E" : "#DDD5BE", color: "#fff" }}
                  >
                    Continuer
                  </button>
                </div>
              </>
            )}

            {/* Step 2: customer info + confirm */}
            {checkoutStep === 2 && (
              <>
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-xs font-semibold block mb-1">Nom complet</label>
                    <input
                      value={customer.name}
                      onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
                      className="w-full p-2.5 rounded-lg text-sm"
                      style={{ background: "#EDE8D9", border: "1.5px solid #DDD5BE" }}
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1">Téléphone</label>
                    <input
                      value={customer.phone}
                      onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
                      className="w-full p-2.5 rounded-lg text-sm"
                      style={{ background: "#EDE8D9", border: "1.5px solid #DDD5BE" }}
                      placeholder="Ex : 76 00 00 00"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1">Adresse de livraison</label>
                    <input
                      value={customer.address}
                      onChange={(e) => setCustomer((c) => ({ ...c, address: e.target.value }))}
                      className="w-full p-2.5 rounded-lg text-sm"
                      style={{ background: "#EDE8D9", border: "1.5px solid #DDD5BE" }}
                      placeholder="Quartier, commune"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCheckoutStep(1)}
                    className="flex-1 py-3 rounded-xl font-bold text-sm"
                    style={{ background: "#EDE8D9", color: "#201C15", border: "1.5px solid #DDD5BE" }}
                  >
                    Retour
                  </button>
                  <button
                    onClick={sendToWhatsApp}
                    disabled={!canConfirm}
                    className="flex-[2] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                    style={{ background: canConfirm ? "#25D366" : "#DDD5BE", color: "#fff" }}
                  >
                    <MessageCircle size={16} /> Confirmer sur WhatsApp
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
