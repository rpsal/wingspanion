import type { EndOfRoundPlacement } from "../domain/endOfRoundScoring";

type Props = {
  value: EndOfRoundPlacement;
  onChange: (value: EndOfRoundPlacement) => void;
  disabled?: boolean;
};

const OPTIONS: { value: EndOfRoundPlacement; label: string }[] = [
  { value: 0, label: "—" },
  { value: 1, label: "1st" },
  { value: 2, label: "2nd" },
  { value: 3, label: "3rd" },
];

export default function PlacementSelector({
  value,
  onChange,
  disabled,
}: Props) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) =>
        onChange(Number(e.target.value) as EndOfRoundPlacement)
      }
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
