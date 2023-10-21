import { useMsal } from "@azure/msal-react";
import {
  Button,
  Divider,
  Flex,
  Select,
  TextInput,
  Textarea,
  createStyles,
} from "@mantine/core";
import { closeAllModals } from "@mantine/modals";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TicketsAccordion from "components/TicketsAccordion";
import { useRedCards } from "contexts/RedCardsContext";
import React, { useEffect, useState } from "react";
import { createDeviation, updateDeviation } from "services/DeviationService";
import { DeviationWithTickets } from "types/db";

interface IMutateDeviation {
  record?: DeviationWithTickets;
  users: any[];
  mode: "edit" | "create";
  closeModal?: () => void;
}

const useStyles = createStyles((theme) => ({
  input: {
    backgroundColor: theme.white,
    borderColor: theme.colors.gray[4],
    color: theme.black,

    "&::placeholder": {
      color: theme.colors.gray[5],
    },
  },

  inputLabel: {
    color: theme.black,
  },

  statusDescription: {
    color: "red",
  },
}));

const MutateDeviation: React.FC<IMutateDeviation> = ({
  record,
  users,
  mode,
  closeModal,
}) => {
  const { classes } = useStyles();
  const { redCardIds } = useRedCards();
  const { instance } = useMsal();
  const activeAccountId = instance.getActiveAccount()?.localAccountId;

  const [title, setTitle] = useState(
    mode === "edit" ? record?.title || "" : ""
  );
  const [priority, setPriority] = useState<string | null>(
    mode === "edit" ? record?.priority || null : ""
  );
  const [category, setCategory] = useState<string | null>(
    mode === "edit" ? record?.category || null : ""
  );
  const [status, setStatus] = useState<string | null>(
    mode === "edit" ? record?.status || null : ""
  );
  const [description, setDescription] = useState(
    mode === "edit" ? record?.description : ""
  );
  const [solution, setSolution] = useState(
    mode === "edit" ? record?.solution && record.solution : ""
  );
  const [employees, setEmployees] = useState<
    Array<{ value: string; label: string }>
  >([]);

  const [assigneeName, setAssigneeName] = useState<string | null>(
    mode === "edit"
      ? users.find((user: any) => user.id === record?.assigneeId)?.name || null
      : ""
  );

  useEffect(() => {
    setEmployees(
      users.map((user) => {
        return { value: user.name, label: user.name };
      })
    );
  }, [users]);

  const queryClient = useQueryClient();
  const updateDeviationMutation = useMutation(
    (args: {
      deviationId: number;
      devationData: Partial<DeviationWithTickets>;
    }) => updateDeviation(args.deviationId, args.devationData),
    {
      onSuccess: () => queryClient.invalidateQueries(["deviations"]),
    }
  );

  const handleUpdate = (
    deviationId: number,
    devationData: Partial<DeviationWithTickets>
  ) => updateDeviationMutation.mutate({ deviationId, devationData });

  const createDeviationMutation = useMutation(
    (args: { devationData: Partial<DeviationWithTickets> }) =>
      createDeviation(args.devationData),
    {
      onSuccess: () => queryClient.invalidateQueries(["deviations"]),
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
            { value: "Lav", label: "Lav" },
            { value: "Normal", label: "Normal" },
            { value: "Høy", label: "Høy" },
          ]}
          value={priority}
          onChange={setPriority}
        />

        <Select
          classNames={{ input: classes.input, label: classes.inputLabel }}
          label="Kategori:"
          data={[
            { value: "HMS", label: "HMS" },
            { value: "Intern rutiner", label: "Interne rutiner" },
            { value: "Kvalitet", label: "Kvalitet" },
            { value: "Ytre miljø", label: "Ytre miljø" },
            { value: "Intern revisjon", label: "Intern revisjon" },
            { value: "Leverandører", label: "Leverandører" },
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
          description={
            status === "Løst" && !solution
              ? "Beskriv løsningen nederst her!"
              : ""
          }
          data={[
            { value: "Forslag", label: "Forslag" },
            { value: "Ny", label: "Ny" },
            { value: "Tildelt", label: "Tildelt" },
            { value: "Pågår", label: "Pågår" },
            { value: "Løst", label: "Løst" },
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

      {mode === "edit" && record && record.tickets.length > 0 && (
        <>
          <Divider />
          <TicketsAccordion record={record} editMode={true} />

          <Divider />
        </>
      )}
      {(solution || status === "Løst") && (
        <>
          <Textarea
            classNames={{ input: classes.input, label: classes.inputLabel }}
            label="Løsning:"
            value={solution || ""}
            onChange={(event) => setSolution(event.currentTarget.value)}
          />
          <Divider />
        </>
      )}

      {mode === "edit" && record && (
        <Flex gap="sm" justify="end">
          <Button
            sx={{ width: "100%", maxWidth: 100 }}
            onClick={() => closeAllModals()}
          >
            Avbryt
          </Button>
          <Button
            sx={{ width: "100%", maxWidth: 100 }}
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
                  status === "Løst"
                    ? 100
                    : status === "Pågår"
                    ? 60
                    : status === "Tildelt"
                    ? 40
                    : status === "Ny"
                    ? 20
                    : status === "Forslag"
                    ? 0
                    : record.progress,
                tickets: record.tickets.filter(
                  (item) => !redCardIds.includes(item.id)
                ),
                assigneeId: users.find((user) => user.name === assigneeName)
                  ?.id,
              });
              closeAllModals();
            }}
          >
            Bekreft
          </Button>
        </Flex>
      )}

      {mode === "create" && closeModal && (
        <Flex mt="sm" gap="sm" justify="end">
          <Button
            sx={{ width: "100%", maxWidth: 100 }}
            onClick={() => {
              closeModal();
            }}
          >
            Avbryt
          </Button>
          <Button
            sx={{ width: "100%", maxWidth: 100 }}
            onClick={() => {
              handleCreate({
                title,
                priority: priority || undefined,
                category: category || undefined,
                status: status || undefined,
                description,
                solution,
                progress:
                  status === "Løst"
                    ? 100
                    : status === "Pågår"
                    ? 60
                    : status === "Tildelt"
                    ? 40
                    : status === "Ny"
                    ? 20
                    : 0,
                creator: activeAccountId,
                assigneeId: users.find((user) => user.name === assigneeName)
                  ?.id,
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
