import type { FlowProjectTab } from './ErpFlowGen.type';
import flowData from '../../../flow.json';

export const DEFAULT_DAILY_APP_TABS: FlowProjectTab[] = (flowData.tabs || []) as FlowProjectTab[];
