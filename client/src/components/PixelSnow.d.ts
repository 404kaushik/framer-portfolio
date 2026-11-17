import type { HTMLAttributes } from 'react';

export type PixelSnowVariant = 'square' | 'round' | 'snowflake' | 'rain';

export interface PixelSnowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  color?: string;
  variant?: PixelSnowVariant;
  density?: number;
  speed?: number;
  wind?: number;
  sway?: number;
  flakeSize?: number;
  pixelSize?: number;
  depth?: number;
  brightness?: number;
  glow?: number;
  twinkle?: number;
  accumulate?: boolean;
  mouseInteraction?: boolean;
  intro?: boolean;
  fade?: number;
  opacity?: number;
  lightMode?: boolean;
  paused?: boolean;
  dpr?: number;
  className?: string;
}

declare function PixelSnow(props: PixelSnowProps): JSX.Element;
export default PixelSnow;
