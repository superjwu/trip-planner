import { type GalleryPick, type GalleryTrip } from "./_mock";

export function formatDateRange(trip: GalleryTrip) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });
  const year = new Date(trip.returnOn).getFullYear();
  return `${fmt.format(new Date(trip.departOn))} – ${fmt.format(
    new Date(trip.returnOn),
  )}, ${year}`;
}

export function formatLongDateRange(trip: GalleryTrip) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
  });
  const year = new Date(trip.returnOn).getFullYear();
  return `${fmt.format(new Date(trip.departOn))} – ${fmt.format(
    new Date(trip.returnOn),
  )}, ${year}`;
}

export function formatMoney(amount: number) {
  return `$${amount.toLocaleString()}`;
}

export function miscSpend(pick: GalleryPick) {
  return pick.cost.totalUsd - pick.cost.flightUsd - pick.cost.lodgingUsd;
}

export function rankLabel(rank: number) {
  return String(rank).padStart(2, "0");
}
