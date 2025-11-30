/**
 * Icon Registry - Centralized semantic icon mapping
 * Usage: import { getIcon } from './updates/iconRegistry';
 *        const DeadlockIcon = getIcon('deadlockProcess');
 *        <DeadlockIcon size={32} color="#ef4444" title="Deadlocked Process" />
 */

import React from 'react';
import { Workflow, CheckCircle2, XCircle, PlayCircle, AlertCircle, RotateCw, Lock, CheckCircle, AlertTriangle, Circle as LucideCircle, RefreshCw } from 'lucide-react';
import { IconCpu, IconServer, IconPlug, IconNetwork, IconCircleDot } from '@tabler/icons-react';
import { HomeIcon, ChartBarIcon, EyeIcon } from '@heroicons/react/24/outline';
import { InfoCircledIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons';

/**
 * Derives semantic color from icon name when no color prop provided
 */
function getSemanticColor(name) {
  if (name.startsWith('deadlock')) return '#ef4444';
  if (name.startsWith('safe')) return '#3b82f6';
  if (name.startsWith('resource')) return '#a855f7';
  if (name.startsWith('cycle')) return '#f59e0b';
  if (name.startsWith('recovery')) return '#10b981';
  return 'var(--icon-fg, #d1d5db)';
}

/**
 * Creates a normalized icon component wrapper
 */
function createIconWrapper(IconComponent) {
  return function WrappedIcon({ size = 24, color, className = '', title, style: customStyle, ...rest }) {
    const finalColor = color || getSemanticColor(rest['data-semantic-name'] || '');
    const ariaProps = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': 'true' };
    const style = { width: size, height: size, color: finalColor, ...customStyle };
    
    return (
      <IconComponent
        size={size}
        style={style}
        className={className}
        {...ariaProps}
        {...rest}
      />
    );
  };
}

/**
 * Semantic icon registry
 * Maps semantic identifiers to icon components from various packs
 */
const icons = {
  // Algorithm progression (Lucide)
  algorithmStep: createIconWrapper(PlayCircle),
  algorithmFinish: createIconWrapper(CheckCircle2),
  algorithmError: createIconWrapper(XCircle),
  algorithmWorkflow: createIconWrapper(Workflow),
  
  // Process states (Lucide - replacing Phosphor)
  deadlockProcess: createIconWrapper(Lock),
  safeProcess: createIconWrapper(CheckCircle),
  waitingState: createIconWrapper(AlertTriangle),
  processNode: createIconWrapper(LucideCircle),
  
  // Resource metaphors (Tabler)
  resourceNode: createIconWrapper(IconCircleDot),
  cpuResource: createIconWrapper(IconCpu),
  serverResource: createIconWrapper(IconServer),
  networkResource: createIconWrapper(IconNetwork),
  plugResource: createIconWrapper(IconPlug),
  
  // Detection & recovery (Lucide)
  cycleDetected: createIconWrapper(AlertCircle),
  noDeadlock: createIconWrapper(CheckCircle2),
  recoveryStrategy: createIconWrapper(RefreshCw),
  refreshAction: createIconWrapper(RotateCw),
  
  // Navigation (Heroicons)
  navigationHome: createIconWrapper(HomeIcon),
  navigationResults: createIconWrapper(ChartBarIcon),
  navigationVisualization: createIconWrapper(EyeIcon),
  
  // Tooltips & help (Radix)
  tooltipInfo: createIconWrapper(InfoCircledIcon),
  tooltipHelp: createIconWrapper(QuestionMarkCircledIcon),
};

/**
 * Retrieves icon component by semantic name
 * @param {string} name - Semantic identifier (e.g., 'deadlockProcess')
 * @returns {React.Component|null} Icon component or null if not found
 */
export function getIcon(name) {
  const IconComponent = icons[name];
  if (IconComponent) {
    // Inject semantic name for color derivation
    return (props) => <IconComponent data-semantic-name={name} {...props} />;
  }
  return null;
}

/**
 * Returns all available icon names for discovery
 */
export function getAvailableIcons() {
  return Object.keys(icons);
}

export default icons;
