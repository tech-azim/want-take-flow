import type { CSSProperties } from 'react';
import type { NodeColorTheme } from './ErpFlowGen.type';

export type ThemeStyle = {
  border: string;
  bg: string;
  headerBg: string;
  text: string;
  badgeBg: string;
  badgeText: string;
  glow: string;
};

export const COLOR_THEME_STYLES: Record<NodeColorTheme, ThemeStyle> = {
  indigo: {
    border: 'border-red-300',
    bg: 'bg-white',
    headerBg: 'bg-red-50/90',
    text: 'text-slate-900',
    badgeBg: 'bg-red-50 text-red-700 border border-red-200',
    badgeText: 'text-red-700',
    glow: 'shadow-red-500/10',
  },
  emerald: {
    border: 'border-emerald-300',
    bg: 'bg-white',
    headerBg: 'bg-emerald-50/90',
    text: 'text-slate-900',
    badgeBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    badgeText: 'text-emerald-700',
    glow: 'shadow-emerald-500/10',
  },
  amber: {
    border: 'border-amber-300',
    bg: 'bg-white',
    headerBg: 'bg-amber-50/90',
    text: 'text-slate-900',
    badgeBg: 'bg-amber-50 text-amber-800 border border-amber-200',
    badgeText: 'text-amber-800',
    glow: 'shadow-amber-500/10',
  },
  rose: {
    border: 'border-rose-300',
    bg: 'bg-white',
    headerBg: 'bg-rose-50/90',
    text: 'text-slate-900',
    badgeBg: 'bg-rose-50 text-rose-700 border border-rose-200',
    badgeText: 'text-rose-700',
    glow: 'shadow-rose-500/10',
  },
  cyan: {
    border: 'border-cyan-300',
    bg: 'bg-white',
    headerBg: 'bg-cyan-50/90',
    text: 'text-slate-900',
    badgeBg: 'bg-cyan-50 text-cyan-800 border border-cyan-200',
    badgeText: 'text-cyan-800',
    glow: 'shadow-cyan-500/10',
  },
  slate: {
    border: 'border-slate-300',
    bg: 'bg-white',
    headerBg: 'bg-slate-100',
    text: 'text-slate-900',
    badgeBg: 'bg-slate-100 text-slate-700 border border-slate-200',
    badgeText: 'text-slate-700',
    glow: 'shadow-slate-500/10',
  },
  violet: {
    border: 'border-violet-300',
    bg: 'bg-white',
    headerBg: 'bg-violet-50/90',
    text: 'text-slate-900',
    badgeBg: 'bg-violet-50 text-violet-700 border border-violet-200',
    badgeText: 'text-violet-700',
    glow: 'shadow-violet-500/10',
  },
};

export const INLINE_STYLES: Record<string, CSSProperties> = {
  canvasWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    userSelect: 'none',
  },
  canvasSurface: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transformOrigin: '0 0',
  },
};
