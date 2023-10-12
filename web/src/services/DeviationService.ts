import Api from '../configs/Api';

export const getDeviations = async (): Promise<DeviationWithTickets[]> => {
  return (await Api().get('/deviations')).data;
};

export const createDeviation = async (deviationData: Partial<Deviation>): Promise<Deviation> => {
  return (await Api().post('/deviations', deviationData)).data;
};

export const updateDeviation = async (
  id: number,
  updateData: Partial<Deviation>
): Promise<Deviation> => {
  return (await Api().put(`/deviations/${id}`, updateData)).data;
};
