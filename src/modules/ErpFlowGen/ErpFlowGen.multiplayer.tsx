import type { PeerPresence } from './ErpFlowGen.type';

export const MULTIPLAYER_PALETTE = [
  '#4f46e5', // Indigo
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#f43f5e', // Rose
  '#14b8a6', // Teal
  '#d946ef', // Fuchsia
  '#3b82f6', // Blue
];

export const FUN_PEER_NAMES = [
  'Creative Fox',
  'Agile Panda',
  'Swift Falcon',
  'Curious Otter',
  'Bold Eagle',
  'Clever Beaver',
  'Bright Dolphin',
  'Dynamic Lynx',
  'Wise Owl',
  'Noble Wolf',
];

// Unique peer ID generated fresh per tab window instance (never cloned by sessionStorage)
const _instanceTabPeerId = `peer_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36).substring(4)}`;

/**
 * Generate unique local peer identity for multiplayer per browser window/tab
 */
export const _getLocalPeerIdentity = (): { peerId: string; name: string; color: string } => {
  if (typeof window === 'undefined') {
    return { peerId: 'peer_ssr', name: 'Collaborator', color: '#4f46e5' };
  }

  try {
    const peerId = _instanceTabPeerId;
    const randomName = FUN_PEER_NAMES[Math.floor(Math.random() * FUN_PEER_NAMES.length)];
    const randomColor = MULTIPLAYER_PALETTE[Math.floor(Math.random() * MULTIPLAYER_PALETTE.length)];
    return { peerId, name: randomName, color: randomColor };
  } catch (_) {
    return {
      peerId: `peer_${Math.random().toString(36).substring(2, 8)}`,
      name: 'Collaborator',
      color: '#4f46e5',
    };
  }
};

/**
 * SVG Arrow Cursor Component for Remote Peers with sleek Figma-like pill badge
 */
export const _renderRemotePeerCursor = (
  peer: PeerPresence,
  isFollowed: boolean,
  canvasScale: number = 1,
): React.ReactElement | null => {
  if (!peer.cursor) return null;

  const inverseScale = canvasScale > 0 ? 1 / canvasScale : 1;

  return (
    <div
      key={peer.peerId}
      style={{
        position: 'absolute',
        left: `${peer.cursor.x}px`,
        top: `${peer.cursor.y}px`,
        pointerEvents: 'none',
        zIndex: isFollowed ? 60 : 45,
        transition: 'left 60ms linear, top 60ms linear',
        transform: `scale(${inverseScale})`,
        transformOrigin: '0 0',
      }}
      className="select-none"
    >
      {/* 1. Custom SVG Pointer Arrow */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="-translate-x-1 -translate-y-1 drop-shadow-md"
      >
        <path
          d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
          fill={peer.color}
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* 2. Floating Name Pill Badge */}
      <div
        style={{ backgroundColor: peer.color }}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-white text-[10px] font-bold shadow-md -mt-1 ml-3 whitespace-nowrap transform scale-95 transition-all ${
          isFollowed ? 'ring-2 ring-white ring-offset-2 ring-offset-indigo-600 animate-pulse' : ''
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
        <span>{peer.name}</span>
        {isFollowed && <span className="text-[9px] opacity-90">(Following)</span>}
      </div>
    </div>
  );
};
