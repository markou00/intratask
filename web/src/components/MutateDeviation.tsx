import { useMsal } from '@azure/msal-react';
import { Button, Divider, Flex, Select, TextInput, Textarea, createStyles } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useRedCards } from '../contexts/RedCardsContext';
import { createDeviation, updateDeviation } from '../services/DeviationService';
import TicketsAccordion from './TicketsAccordion';

interface IMutateDeviation {
  record?: DeviationWithTickets;
  graphData: {
    value: Array<{ id: string; displayName: string }>;
  };
  mode: 'edit' | 'create';
  closeModal?: () => void;
}

const useStyles = createStyles((theme) => ({
  input: {
    backgroundColor: theme.white,
    borderColor: theme.colors.gray[4],
    color: theme.black,

    '&::placeholder': {
      color: theme.colors.gray[5],
    },
  },

  inputLabel: {
    color: theme.black,
  },

  statusDescription: {
    color: 'red',
  },
}));

const MutateDeviation: React.FC<IMutateDeviation> = ({ record, graphData, mode, closeModal }) => {
  const { classes } = useStyles();
  const { redCardIds } = useRedCards();
  const { instance } = useMsal();
  const activeAccountId = instance.getActiveAccount()?.localAccountId;

  const [title, setTitle] = useState(mode === 'edit' ? record?.title.toLowerCase() || '' : '');
  const [priority, setPriority] = useState<string | null>(
    mode === 'edit' ? record?.priority.toLowerCase() || null : ''
  );
  const [category, setCategory] = useState<string | null>(
    mode === 'edit' ? record?.category.toLowerCase() || null : ''
  );
  const [status, setStatus] = useState<string | null>(
    mode === 'edit' ? record?.status.toLowerCase() || null : ''
  );
  const [description, setDescription] = useState(
    mode === 'edit' ? record?.description.toLowerCase() : ''
  );
  const [solution, setSolution] = useState(
    mode === 'edit' ? record?.solution && record.solution.toLowerCase() : ''
  );
  const [employees, setEmployees] = useState<Array<{ value: string; label: string }>>([]);

  const [assigneeName, setAssigneeName] = useState<string | null>(
    mode === 'edit'
      ? graphData.value.find((user: any) => user.id === record?.assigneeId)?.displayName || null
      : ''
  );

  useEffect(() => {
    setEmployees(
      graphData.value.map((employee) => {
        return { value: employee.displayName, label: employee.displayName };
      })
    );
  }, []);

  const queryClient = useQueryClient();
  const updateDeviationMutation = useMutation(
    (args: { deviationId: number; devationData: Partial<DeviationWithTickets> }) =>
      updateDeviation(args.deviationId, args.devationData),
    {
      onSuccess: () => queryClient.invalidateQueries(['deviations']),
    }
  );

  const handleUpdate = (deviationId: number, devationData: Partial<DeviationWithTickets>) =>
    updateDeviationMutation.mutate({ deviationId, devationData });

  const createDeviationMutation = useMutation(
    (args: { devationData: Partial<DeviationWithTickets> }) => createDeviation(args.devationData),
    {
      onSuccess: () => queryClient.invalidateQueries(['deviations']),
    }
  );

  const handleCreate = (devationData: Partial<DeviationWithTickets>) =>
    createDeviationMutation.mutate({ devationData });

  return (
    <Flex p="xs" direction="column" gap="md">
      <Flex direction="column" gap="sm">
        <TextInput
          label="Tittel"
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
        />
        <Select
          classNames={{ input: classes.input, label: classes.inputLabel }}
          label="Prioritet:"
          data={[
            { value: 'lav', label: 'Lav' },
            { value: 'normal', label: 'Normal' },
            { value: 'høy', label: 'Høy' },
          ]}
          value={priority}
          onChange={setPriority}
        />

        <Select
          classNames={{ input: classes.input, label: classes.inputLabel }}
          label="Kategori:"
          data={[
            { value: 'hms', label: 'HMS' },
            { value: 'intern rutiner', label: 'Interne rutiner' },
            { value: 'kvalitet', label: 'Kvalitet' },
            { value: 'ytre miljø', label: 'Ytre miljø' },
            { value: 'intern revisjon', label: 'Intern revisjon' },
            { value: 'leverandører', label: 'Leverandører' },
          ]}
          value={category}
          onChange={setCategory}
        />

        <Select
          classNames={{
            input: classes.input,
            label: classes.inputLabel,
            description: classes.statusDescription,
          }}
          label="Status:"
          description={status === 'ferdig' && !solution ? 'Beskriv løsningen nederst her!' : ''}
          data={[
            { value: 'ny', label: 'Ny' },
            { value: 'pågår', label: 'Pågår' },
            { value: 'ferdig', label: 'Ferdig' },
          ]}
          value={status}
          onChange={setStatus}
        />

        <Select
          classNames={{ input: classes.input, label: classes.inputLabel }}
          label="Tildel til:"
          data={employees}
          maxDropdownHeight={300}
          withinPortal
          value={assigneeName}
          onChange={setAssigneeName}
        />

        <Textarea
          classNames={{ input: classes.input, label: classes.inputLabel }}
          label="Beskrivelse:"
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
        />
      </Flex>

      {mode === 'edit' && record && record.tickets.length > 0 && (
        <>
          <Divider />
          <TicketsAccordion record={record} editMode={true} />

          <Divider />
        </>
      )}
      {(solution || status === 'ferdig') && (
        <>
          <Textarea
            classNames={{ input: classes.input, label: classes.inputLabel }}
            label="Løsning:"
            value={solution || ''}
            onChange={(event) => setSolution(event.currentTarget.value)}
          />
          <Divider />
        </>
      )}

      {mode === 'edit' && record && (
        <Flex gap="sm" justify="end">
          <Button sx={{ width: '100%', maxWidth: 100 }} onClick={() => closeAllModals()}>
            Avbryt
          </Button>
          <Button
            sx={{ width: '100%', maxWidth: 100 }}
            disabled={updateDeviationMutation.isLoading}
            onClick={() => {
              handleUpdate(record.id, {
                title,
                priority: priority || undefined,
                category: category || undefined,
                status: status || undefined,
                description,
                solution,
                progress:
                  status?.toLowerCase() === 'ferdig'
                    ? 100
                    : status?.toLowerCase() === 'pågår'
                    ? 50
                    : status?.toLowerCase() === 'ny'
                    ? 0
                    : record.progress,
                tickets: record.tickets.filter((item) => !redCardIds.includes(item.id)),
                assigneeId: graphData.value.find(
                  (employee) => employee.displayName === assigneeName
                )?.id,
              });
              closeAllModals();
            }}
          >
            Bekreft
          </Button>
        </Flex>
      )}

      {mode === 'create' && closeModal && (
        <Flex mt="sm" gap="sm" justify="end">
          <Button
            sx={{ width: '100%', maxWidth: 100 }}
            onClick={() => {
              closeModal();
            }}
          >
            Avbryt
          </Button>
          <Button
            sx={{ width: '100%', maxWidth: 100 }}
            onClick={() => {
              handleCreate({
                title,
                priority: priority || undefined,
                category: category || undefined,
                status: status || undefined,
                description,
                solution,
                progress:
                  status?.toLowerCase() === 'ferdig'
                    ? 100
                    : status?.toLowerCase() === 'pågår'
                    ? 50
                    : status?.toLowerCase() === 'ny'
                    ? 0
                    : 0,
                creator: activeAccountId,
                assigneeId: graphData.value.find(
                  (employee) => employee.displayName === assigneeName
                )?.id,
              });
              closeModal();
            }}
          >
            Opprett
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default MutateDeviation;
