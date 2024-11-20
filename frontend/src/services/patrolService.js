// services/patrolService.js

import axios from 'axios';
import globalConfig from './config';

export const assignPatrolToUrgence = (patrolId, urgenceId) => {
    return axios.post(`${globalConfig.BACKEND_URL}/api/patrols/assign/${patrolId}/${urgenceId}`);
};
