import { Deviation } from '../../../api/shared/dbTypes';
import Api from './Api';

export const getDeviations = async (): Promise<Deviation[]> => {
  return (await Api().get('/deviations')).data;
};
