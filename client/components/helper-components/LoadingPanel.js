import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../../css/LoadingPanel.scss';

const LoadingPanel = () => 
    <div className='loading-panel'>
      <span><FontAwesomeIcon icon='spinner' size='3x' className='fa-spin fa-pulse' /></span>
    </div>

export default LoadingPanel;