import { GiftIcon, ShieldIcon, SparkleIcon, TruckIcon } from "../ui/Icons.jsx";
import "./Perks.css";

const PERKS = [
  { icon: TruckIcon, title: "Free shipping", text: "On every order, no minimum" },
  { icon: SparkleIcon, title: "Delivered in 2 days", text: "Dispatched within 24 hours" },
  { icon: GiftIcon, title: "Gift-ready packaging", text: "Every bottle arrives boxed" },
  { icon: ShieldIcon, title: "Secure checkout", text: "Your details stay protected" },
];

export default function Perks() {
  return (
    <section className="perks container" aria-label="Why shop with us">
      <ul className="perks__list">
        {PERKS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="perk">
            <span className="perk__icon">
              <Icon />
            </span>
            <span>
              <strong>{title}</strong>
              <span>{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
