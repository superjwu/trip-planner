/**
 * Real US map — server-rendered at build time via d3-geo + us-atlas TopoJSON.
 *
 * Pre-computes Albers-USA state path strings + projected origin/pick coords
 * at module evaluation. The rendered HTML contains the SVG path data
 * directly — no client JS, no API keys, no runtime cost.
 *
 * Coastal-slate palette to match the rest of the trip surface.
 */
import { feature } from "topojson-client";
import { geoAlbersUsa, geoPath } from "d3-geo";
import type { FeatureCollection } from "geojson";
import statesTopoRaw from "us-atlas/states-10m.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const STATES_FC = feature(statesTopoRaw as any, (statesTopoRaw as any).objects.states) as unknown as FeatureCollection;

/** Common departure cities — mapped to [lng, lat]. Extendable. */
export const ORIGIN_COORDS: Record<string, [number, number]> = {
  NYC: [-74.006, 40.7128],
  CHI: [-87.6298, 41.8781],
  LAX: [-118.2437, 34.0522],
  SFO: [-122.4194, 37.7749],
  SEA: [-122.3321, 47.6062],
  BOS: [-71.0589, 42.3601],
  DCA: [-77.0369, 38.9072],
  ATL: [-84.388, 33.7490],
  DAL: [-96.797, 32.7767],
  DEN: [-104.9903, 39.7392],
  MIA: [-80.1918, 25.7617],
};

/** A pick rendered on the atlas. */
export interface AtlasPick {
  slug: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  rank?: number;
  hue?: string; // optional accent color override per pick
}

interface RouteAtlasProps {
  /** Origin code like "NYC" — looked up in ORIGIN_COORDS. Falls back to NYC if unknown. */
  originCode?: string;
  /** Optional explicit origin city label, e.g. "New York City". Defaults to `originCode`. */
  originLabel?: string;
  /** Destinations to plot. */
  picks: AtlasPick[];
  /** SVG width in viewBox units. Default 720. */
  width?: number;
  /** SVG height in viewBox units. Default 440. */
  height?: number;
}

/** Default per-rank hues if a pick doesn't specify one. */
const DEFAULT_RANK_HUES = [
  "#E76F51", // coral — rank 1
  "#2C5474", // slate-blue — rank 2
  "#84A98C", // soft sage — rank 3
  "#C0875F", // warm sand — rank 4
];

/** States/territories Albers-USA can't project — placed in a fixed inset row. */
const TERRITORY_STATES = new Set(["PR", "VI", "GU", "MP", "AS"]);

export function RouteAtlas({
  originCode = "NYC",
  originLabel,
  picks,
  width = 720,
  height = 440,
}: RouteAtlasProps) {
  const originLL = ORIGIN_COORDS[originCode] ?? ORIGIN_COORDS.NYC;

  // Padding leaves room for markers + labels at the viewBox edges.
  // Wider on the sides (labels can extend ~110px), tighter top/bottom.
  const PAD_X = 90;
  const PAD_Y = 28;
  const projection = geoAlbersUsa().fitExtent(
    [
      [PAD_X, PAD_Y],
      [width - PAD_X, height - PAD_Y],
    ],
    STATES_FC,
  );
  const pathGen = geoPath(projection);

  const statePaths = STATES_FC.features
    .map((f, i) => ({ id: String(f.id ?? `state-${i}`), d: pathGen(f) ?? "" }))
    .filter((s) => s.d.length > 0);

  const origin = (projection(originLL) as [number, number] | null) ?? [width / 2, height / 2];

  // First pass: project picks. For territories Albers-USA can't handle, mark
  // them so we can drop them into an inset row at the bottom-right of the
  // canvas.
  const territoryPicks: { idx: number }[] = [];
  const firstPass = picks.map((p, idx) => {
    const xy = projection([p.lng, p.lat]) as [number, number] | null;
    if (xy) return { idx, xy, isTerritory: false };
    if (TERRITORY_STATES.has(p.state)) {
      territoryPicks.push({ idx });
      return { idx, xy: null, isTerritory: true };
    }
    return null;
  });

  // Assign each territory pick a fixed inset slot.
  const territorySlots = new Map<number, [number, number]>();
  territoryPicks.forEach((t, slotI) => {
    territorySlots.set(t.idx, [width - PAD_X - 20 - slotI * 70, height - PAD_Y - 14]);
  });

  const projectedPicks = firstPass
    .map((entry) => {
      if (!entry) return null;
      const p = picks[entry.idx];
      const xy = entry.xy ?? territorySlots.get(entry.idx);
      if (!xy) return null;
      return {
        ...p,
        x: xy[0],
        y: xy[1],
        isTerritory: entry.isTerritory,
        hue:
          p.hue ??
          DEFAULT_RANK_HUES[((p.rank ?? entry.idx + 1) - 1) % DEFAULT_RANK_HUES.length],
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  const labelText = originLabel ?? originCode;

  // ── Label placement with collision avoidance ─────────────────────────────
  // Each pick has four candidate placements (right / left / above / below the
  // marker). Greedy by rank: pick the first side whose label box doesn't
  // overlap any previously-reserved box (markers + origin label + earlier
  // labels). With ≤4 picks this is fast and gives clean, non-overlapping
  // layouts even for clustered Northeast picks.

  type Box = { x: number; y: number; w: number; h: number };
  type Side = "right" | "left" | "top" | "bottom";

  const overlaps = (a: Box, b: Box) =>
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

  const insideViewBox = (b: Box, margin = 2) =>
    b.x >= margin && b.y >= margin && b.x + b.w <= width - margin && b.y + b.h <= height - margin;

  // Approx label width — name vs state, take the wider one.
  const labelBoxFor = (
    side: Side,
    x: number,
    y: number,
    name: string,
    stateLine: string,
  ): { textX: number; textY: number; anchor: "start" | "end" | "middle"; box: Box } => {
    const nameW = name.length * 6.4;
    const stateW = stateLine.length * 6.6;
    const w = Math.max(nameW, stateW) + 4;
    const h = 22; // two stacked lines
    if (side === "right") {
      return { textX: x + 14, textY: y + 4.5, anchor: "start", box: { x: x + 14, y: y - 7, w, h } };
    }
    if (side === "left") {
      return { textX: x - 14, textY: y + 4.5, anchor: "end", box: { x: x - 14 - w, y: y - 7, w, h } };
    }
    if (side === "top") {
      return { textX: x, textY: y - 18, anchor: "middle", box: { x: x - w / 2, y: y - 32, w, h } };
    }
    // bottom
    return { textX: x, textY: y + 22, anchor: "middle", box: { x: x - w / 2, y: y + 14, w, h } };
  };

  // Reserved boxes: origin marker (concentric rings, r=14) + origin label.
  const reservedBoxes: Box[] = [
    // origin marker disc
    { x: origin[0] - 16, y: origin[1] - 16, w: 32, h: 32 },
    // origin label (two lines, anchored start at origin[0]+14)
    { x: origin[0] + 12, y: origin[1] - 16, w: Math.max(labelText.length, 6) * 7 + 8, h: 28 },
  ];

  // Reserve every pick's marker disc up front so labels can't sit on top of
  // another pick's pin.
  for (const p of projectedPicks) {
    reservedBoxes.push({ x: p.x - 11, y: p.y - 11, w: 22, h: 22 });
  }

  type PlacedPick = (typeof projectedPicks)[number] & {
    layout: { textX: number; textY: number; anchor: "start" | "end" | "middle"; side: Side };
  };

  // Place by rank order so #1 gets the most-preferred slot.
  const sortedPicks = [...projectedPicks].sort(
    (a, b) => (a.rank ?? 99) - (b.rank ?? 99),
  );

  const placedPicks: PlacedPick[] = [];
  for (const p of sortedPicks) {
    const stateLine = p.isTerritory ? `${p.state} · INSET` : p.state;
    // Preferred side: away from origin horizontally; if origin is roughly
    // east/west of pick, prefer right/left; if origin is above/below and
    // pick is hugging a viewBox edge, prefer top/bottom.
    const wantsRight = p.x >= origin[0];
    const sides: Side[] = wantsRight
      ? ["right", "left", "top", "bottom"]
      : ["left", "right", "top", "bottom"];

    let chosen: ReturnType<typeof labelBoxFor> & { side: Side } | null = null;
    for (const side of sides) {
      const candidate = labelBoxFor(side, p.x, p.y, p.name, stateLine);
      if (!insideViewBox(candidate.box)) continue;
      const collides = reservedBoxes.some((r) => overlaps(candidate.box, r));
      if (!collides) {
        chosen = { ...candidate, side };
        break;
      }
    }
    // Fallback: take the first in-bounds side even if it overlaps (rare with
    // ≤4 picks, but never crash). Last resort: the original right side.
    if (!chosen) {
      for (const side of sides) {
        const candidate = labelBoxFor(side, p.x, p.y, p.name, stateLine);
        if (insideViewBox(candidate.box)) {
          chosen = { ...candidate, side };
          break;
        }
      }
    }
    if (!chosen) {
      const fallback = labelBoxFor(sides[0], p.x, p.y, p.name, stateLine);
      chosen = { ...fallback, side: sides[0] };
    }

    reservedBoxes.push(chosen.box);
    placedPicks.push({
      ...p,
      layout: { textX: chosen.textX, textY: chosen.textY, anchor: chosen.anchor, side: chosen.side },
    });
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`US map showing routes from ${labelText} to ${picks.length} destination${picks.length === 1 ? "" : "s"}`}
      style={{ width: "100%", height: "auto", overflow: "visible" }}
    >
      {/* State silhouettes */}
      <g>
        {statePaths.map((s) => (
          <path
            key={s.id}
            d={s.d}
            fill="#FFFFFF"
            stroke="rgba(44,84,116,0.18)"
            strokeWidth={0.55}
            strokeLinejoin="round"
          />
        ))}
      </g>

      {/* Route lines */}
      {projectedPicks.map((p) => (
        <line
          key={`route-${p.slug}`}
          x1={origin[0]}
          y1={origin[1]}
          x2={p.x}
          y2={p.y}
          stroke={p.hue}
          strokeWidth={1.6}
          strokeOpacity={0.7}
          strokeDasharray="5 4"
          strokeLinecap="round"
        />
      ))}

      {/* Pick markers + collision-avoided labels */}
      {placedPicks.map((p) => {
        const stateLine = p.isTerritory ? `${p.state} · INSET` : p.state;
        return (
          <g key={`pick-${p.slug}`}>
            <circle cx={p.x} cy={p.y} r={9} fill="#F4F6F8" stroke={p.hue} strokeWidth={2.5} />
            <circle cx={p.x} cy={p.y} r={3.5} fill={p.hue} />
            <text
              x={p.layout.textX}
              y={p.layout.textY}
              textAnchor={p.layout.anchor}
              fontSize={11}
              fill="#1F2937"
              fontFamily="var(--font-display, system-ui)"
              fontWeight={500}
            >
              {p.name}
            </text>
            <text
              x={p.layout.textX}
              y={p.layout.textY + 13.5}
              textAnchor={p.layout.anchor}
              fontSize={9}
              fill="#4B5563"
              fontFamily="var(--font-body, system-ui)"
              letterSpacing="0.10em"
              style={{ textTransform: "uppercase" }}
            >
              {stateLine}
            </text>
          </g>
        );
      })}

      {/* Origin marker — concentric rings for emphasis */}
      <circle cx={origin[0]} cy={origin[1]} r={14} fill="rgba(44,84,116,0.10)" />
      <circle cx={origin[0]} cy={origin[1]} r={9} fill="rgba(44,84,116,0.18)" />
      <circle cx={origin[0]} cy={origin[1]} r={5} fill="#2C5474" />
      <text
        x={origin[0] + 14}
        y={origin[1] - 6}
        textAnchor="start"
        fontSize={11}
        fill="#1F2937"
        fontFamily="var(--font-display, system-ui)"
        fontWeight={600}
      >
        {labelText}
      </text>
      <text
        x={origin[0] + 14}
        y={origin[1] + 8}
        textAnchor="start"
        fontSize={9}
        fill="#4B5563"
        fontFamily="var(--font-body, system-ui)"
        letterSpacing="0.10em"
        style={{ textTransform: "uppercase" }}
      >
        Origin
      </text>
    </svg>
  );
}
