import { Deviation } from '../../../api/shared/dbTypes';
import Api from '../configs/Api';

export const getDeviations = async (): Promise<Deviation[]> => {
  return (await Api().get('/deviations')).data;
};
