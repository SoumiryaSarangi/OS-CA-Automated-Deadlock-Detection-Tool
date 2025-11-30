/**
 * Icon Registry - Feather Icons for Deadlock Detective
 */

import React from 'react';
import { 
  Search,
  Lock,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  XCircle,
  RefreshCw,
  RotateCw,
  Circle,
  Cpu
} from 'feather-icons-react';

const icons = {
  Search: Search,
  DeadlockProcess: Lock,
  SafeProcess: CheckCircle,
  CycleDetected: AlertCircle,
  NoDeadlock: CheckCircle,
  Error: XCircle,
  Warning: AlertTriangle,
  Recovery: RefreshCw,
  Refresh: RotateCw,
  Terminate: XCircle,
  Process: Circle,
  Resource: Cpu,
};

export default icons;