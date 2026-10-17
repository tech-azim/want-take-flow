import * as React from 'react';
import ErpFlowGenContainer from './ErpFlowGen.container';

/**
 * ErpFlowGen Wrapper Component
 * Acts as the module entry point and boundary
 * @returns {React.ReactElement} - rendered ErpFlowGen container
 */
const ErpFlowGenWrapper = (): React.ReactElement => {
  return <ErpFlowGenContainer />;
};

export default ErpFlowGenWrapper;
