import { MAX_QTY } from "../../context/cart.js";
import { MinusIcon, PlusIcon } from "../ui/Icons.jsx";
import "./QuantityStepper.css";

/** −  2  +   (min = 0 lets the minus button remove the item from the cart) */
export default function QuantityStepper({ value, onChange, min = 1, max = MAX_QTY, label = "Quantity", size = "md" }) {
  return (
    <div className={`stepper stepper--${size}`} role="group" aria-label={label}>
      <button
        type="button"
        className="stepper__btn"
        aria-label="Decrease quantity"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
      >
        <MinusIcon />
      </button>
      <output className="stepper__value" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className="stepper__btn"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
      >
        <PlusIcon />
      </button>
    </div>
  );
}
