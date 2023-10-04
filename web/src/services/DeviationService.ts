import Api from './Api';

export const getDeviations = async () => (await Api().get('/deviations')).data;
