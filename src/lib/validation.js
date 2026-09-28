// Validators return `true` when valid, otherwise an error message.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const digitsOnly = (v) => v.replace(/\D/g, "");

/** Luhn checksum – catches typos in card numbers. */
export function luhn(number) {
  let sum = 0;
  let double = false;
  for (let i = number.length - 1; i >= 0; i--) {
    let d = Number(number[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

export function cardBrand(number) {
  const n = digitsOnly(number);
  if (/^4/.test(n)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "Mastercard";
  return null;
}

export const formatCardNumber = (v) =>
  digitsOnly(v)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");

export function formatExpiry(v) {
  const d = digitsOnly(v).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export const rules = {
  name: (v) => v.trim().length >= 2 || "Please enter your full name.",
  email: (v) => EMAIL_RE.test(v.trim()) || "Enter a valid email address.",
  phone: (v) => /^(\+?91|0)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, "")) || "Enter a valid 10-digit mobile number.",
  address: (v) => v.trim().length >= 6 || "Enter your house number and street.",
  city: (v) => v.trim().length >= 2 || "Enter your city.",
  pincode: (v) => /^\d{6}$/.test(v) || "Enter a 6-digit PIN code.",
  cardName: (v) => v.trim().length >= 2 || "Enter the name shown on the card.",
  cardNumber: (v) => {
    const n = digitsOnly(v);
    return (n.length >= 13 && luhn(n)) || "Enter a valid card number.";
  },
  expiry: (v) => {
    const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(v);
    if (!m) return "Use the format MM/YY.";
    const endOfMonth = new Date(2000 + Number(m[2]), Number(m[1]), 1);
    return endOfMonth > new Date() || "This card has expired.";
  },
  cvv: (v) => /^\d{3,4}$/.test(v) || "Enter the 3 or 4 digit code.",
};
