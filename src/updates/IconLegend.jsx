/**
 * IconLegend - Visual legend for deadlock detection states
 * 
 * Usage Example:
 * import IconLegend from './updates/IconLegend.jsx';
 * import { getIcon } from './updates/iconRegistry';
 * 
 * // In your component:
 * <IconLegend compact={false} />
 * 
 * // Or import individual icons:
 * const DeadlockIcon = getIcon('deadlockProcess');
 * <DeadlockIcon size={32} title="Deadlocked Process" />
 */

import React from 'react';
import { getIcon } from './iconRegistry.js';

const IconLegend = ({ compact = false }) => {
  const legendItems = [
    {
      name: 'Safe Process',
      iconKey: 'safeProcess',
      color: '#3b82f6',
      description: 'Process in safe state'
    },
    {
      name: 'Deadlocked Process',
      iconKey: 'deadlockProcess',
      color: '#ef4444',
      description: 'Process involved in deadlock'
    },
    {
      name: 'Resource',
      iconKey: 'resourceNode',
      color: '#a855f7',
      description: 'System resource'
    },
    {
      name: 'Waiting / Request',
      iconKey: 'waitingState',
      color: '#eab308',
      description: 'Process waiting for resource'
    },
    {
      name: 'Cycle Detected',
      iconKey: 'cycleDetected',
      color: '#f59e0b',
      description: 'Circular wait detected'
    },
    {
      name: 'Recovery Candidate',
      iconKey: 'recoveryStrategy',
      color: '#10b981',
      description: 'Process eligible for recovery action'
    }
  ];

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: compact ? '8px' : '12px',
    padding: compact ? '12px' : '16px',
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    borderRadius: '8px',
    border: '1px solid rgba(75, 85, 99, 0.3)',
    maxWidth: '400px'
  };

  const titleStyle = {
    fontSize: compact ? '14px' : '16px',
    fontWeight: '600',
    color: '#f3f4f6',
    marginBottom: compact ? '4px' : '8px',
    letterSpacing: '0.025em'
  };

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: compact ? '8px' : '12px',
    fontSize: compact ? '13px' : '14px'
  };

  const labelStyle = {
    color: '#d1d5db',
    fontWeight: '500',
    minWidth: compact ? '120px' : '140px'
  };

  const descStyle = {
    color: '#9ca3af',
    fontSize: compact ? '12px' : '13px',
    fontStyle: 'italic'
  };

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>Legend</div>
      {legendItems.map((item) => {
        const IconComponent = getIcon(item.iconKey);
        return (
          <div key={item.iconKey} style={itemStyle}>
            {IconComponent && (
              <IconComponent 
                size={compact ? 20 : 24} 
                color={item.color}
                title={item.name}
              />
            )}
            <span style={labelStyle}>{item.name}</span>
            {!compact && <span style={descStyle}>{item.description}</span>}
          </div>
        );
      })}
    </div>
  );
};

export default IconLegend;
