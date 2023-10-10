import { Deviation } from '../../../api/shared/dbTypes';
import Api from '../configs/Api';

export const getDeviations = async (): Promise<Deviation[]> => {
  return (await Api().get('/deviations')).data;
};

export const updateDeviation = async (
  id: number,
  updateData: Partial<Deviation>
): Promise<Deviation> => {
  return (await Api().put(`/deviations/${id}`, updateData)).data;
};
