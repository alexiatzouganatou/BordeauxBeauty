/* main.js (FULL) */

// -----------------------------
// BURGER MENU
// -----------------------------
const burger = document.getElementById("burger");
const navMenu = document.getElementById("navMenu");
const navOverlay = document.getElementById("navOverlay");

const openMenu = () => {
  if (!navMenu || !burger) return;
  navMenu.classList.add("open");
  burger.classList.add("open");
  document.body.style.overflow = "hidden";
  if (navOverlay) {
    navOverlay.style.opacity = "1";
    navOverlay.style.pointerEvents = "auto";
  }
};

const closeMenu = () => {
  if (!navMenu || !burger) return;
  navMenu.classList.remove("open");
  burger.classList.remove("open");
  document.body.style.overflow = "";
  if (navOverlay) {
    navOverlay.style.opacity = "0";
    navOverlay.style.pointerEvents = "none";
  }
};

if (burger) {
  burger.addEventListener("click", () => {
    if (navMenu.classList.contains("open")) closeMenu();
    else openMenu();
  });
}

if (navOverlay) {
  navOverlay.addEventListener("click", closeMenu);
}

if (navMenu) {
  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

// -----------------------------
// BOOKING FORM (CONTACT)
// -----------------------------
const bookingForm = document.getElementById("bookingForm");
const successMessage = document.getElementById("successMessage");

// ✅ ADDED: buttons inside success box
const openWhatsAppBtn = document.getElementById("openWhatsAppBtn");
const newBookingBtn = document.getElementById("newBookingBtn");

const API_URL = "http://localhost:3000/book"; // change later when you deploy backend

const buildWhatsAppText = ({ name, phone, service, date, time, message }) => {
  const lines = [
    "Γεια σας! Θα ήθελα να κλείσω ραντεβού 💅",
    `Ονοματεπώνυμο: ${name}`,
    `Τηλέφωνο: ${phone}`,
    `Υπηρεσία: ${service}`,
    `Ημερομηνία: ${date}`,
    `Ώρα: ${time}`,
  ];

  if (message && message.trim()) {
    lines.push(`Μήνυμα: ${message.trim()}`);
  }

  return lines.join("\n");
};

const openWhatsApp = (prefilledText) => {
  const salonPhone = "306973563253"; // +30 697 356 3253 (digits only)
  const url = `https://wa.me/${salonPhone}?text=${encodeURIComponent(prefilledText)}`;
  window.open(url, "_blank");
};
const showSuccess = () => {
  if (!successMessage) return;
  successMessage.style.display = "block";
};

const hideSuccess = () => {
  if (!successMessage) return;
  successMessage.style.display = "none";
};

if (bookingForm) {
  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      name: document.getElementById("name")?.value.trim(),
      phone: document.getElementById("phone")?.value.trim(),
      service: document.getElementById("service")?.value,
      date: document.getElementById("date")?.value,
      time: document.getElementById("time")?.value,
      message: document.getElementById("message")?.value || "",
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data) {
        alert("Σφάλμα σύνδεσης με τον server. Δες Console (F12).");
        console.error("Server response:", data);
        return;
      }

      if (data.ok === false && data.error) {
        alert(data.error);
        return;
      }

      // success
      showSuccess();

      // prepare WhatsApp message for the button
      const waText = buildWhatsAppText(payload);
      if (openWhatsAppBtn) {
        openWhatsAppBtn.onclick = () => openWhatsApp(waText);
      }

      // reset form after success (so user can book again if they click "New booking")
      bookingForm.reset();
      bookingForm.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      alert("Σφάλμα σύνδεσης με τον server. Δες Console (F12).");
      console.error(err);
    }
  });
}

// ✅ ADDED: New booking button behavior
if (newBookingBtn && bookingForm) {
  newBookingBtn.addEventListener("click", () => {
    bookingForm.reset();
    hideSuccess();
    bookingForm.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// ✅ OPTIONAL: WhatsApp button fallback (in case user clicks it without a recent booking)
if (openWhatsAppBtn) {
  openWhatsAppBtn.addEventListener("click", () => {
    // If onclick was already set after booking, this won't matter.
    // This is just a fallback to avoid "dead" button.
    if (!openWhatsAppBtn.onclick) {
      alert("Κάνε πρώτα μια κράτηση για να δημιουργηθεί το μήνυμα WhatsApp 🙂");
    }
  });
}
