import { Button, Divider, Flex, Select, TextInput, Textarea, createStyles } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { DeviationWithTickets } from '../../../api/shared/dbTypes';
import { useRedCards } from '../contexts/RedCardsContext';
import { updateDeviation } from '../services/DeviationService';
import TicketsAccordion from './TicketsAccordion';

interface IMutateDeviation {
  record: DeviationWithTickets;
  graphData: {
    value: Array<{ id: string; displayName: string }>;
  };
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

const MutateDeviation: React.FC<IMutateDeviation> = ({ record, graphData }) => {
  const { classes } = useStyles();
  const { redCardIds } = useRedCards();

  const [title, setTitle] = useState(record.title.toLowerCase());
  const [priority, setPriority] = useState<string | null>(record.priority.toLowerCase());
  const [category, setCategory] = useState<string | null>(record.category.toLowerCase());
  const [status, setStatus] = useState<string | null>(record.status.toLowerCase());
  const [description, setDescription] = useState(record.description.toLowerCase());
  const [solution, setSolution] = useState(record.solution && record.solution.toLowerCase());
  const [employees, setEmployees] = useState<Array<{ value: string; label: string }>>([]);

  const [assigneeName, setAssigneeName] = useState<string | null>(
    graphData.value.find((user: any) => user.id === record.assigneeId)?.displayName || null
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

      <Divider />

      <TicketsAccordion record={record} editMode={true} />

      <Divider />

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
              assigneeId: graphData.value.find((employee) => employee.displayName === assigneeName)
                ?.id,
            });
            closeAllModals();
          }}
        >
          Bekreft
        </Button>
      </Flex>
    </Flex>
  );
};

export default MutateDeviation;
