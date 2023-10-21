import {
  Container,
  LoadingOverlay,
  MultiSelect,
  TextInput,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { openModal } from "@mantine/modals";
import { IconEdit, IconInfoCircle, IconSearch } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import DeviationDetails from "components/DeviationDetails";
import ProgressBar from "components/ProgressBar";
import UserBadge from "components/UserBadge";
import MutateDeviation from "components/modals/MutateDeviation/MutateDeviation";
import { ServerError } from "components/pages/ServerError";
import { RedCardsProvider } from "contexts/RedCardsContext";
import sortBy from "lodash/sortBy";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useMemo, useState } from "react";
import { getDeviations } from "services/DeviationService";
import { DeviationWithTickets } from "types/db";
import { getDeviationDate } from "utils/utils";

const Deviations: React.FC = () => {
  // State hooks
  const [records, setRecords] = useState<DeviationWithTickets[]>([]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "date",
    direction: "asc",
  });
  const [titleQuery, setTitleQuery] = useState("");
  const [debouncedTitleQuery] = useDebouncedValue(titleQuery, 200);
  const [idQuery, setIdQuery] = useState("");
  const [debouncedIdQuery] = useDebouncedValue(idQuery, 200);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [graphData, setGraphData] = useState<any>(null); // TODO: Define proper type for graphData
  const [userImageUrls, setUserImageUrls] = useState<Record<string, string>>(
    {}
  );

  // Queries
  const deviationsQuery = useQuery({
    queryKey: ["deviations"],
    queryFn: getDeviations,
    staleTime: Infinity,
    cacheTime: 5 * 60 * 1000,
  });
  const deviations = deviationsQuery.data;

  // Effects
  useEffect(() => {
    if (!graphData) {
      axios
        .get("/api/get-tenant-users")
        .then((response) => {
          setGraphData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching graph data:", error);
        });
    }
  }, [graphData]);

  useEffect(() => {
    if (!deviations) return;

    let processedData = deviations;

    // Filter data
    processedData = processedData.filter(({ id, title, category, status }) => {
      return (
        (!debouncedTitleQuery ||
          title
            .toLowerCase()
            .includes(debouncedTitleQuery.trim().toLowerCase())) &&
        (!debouncedIdQuery ||
          `${id}`
            .toLowerCase()
            .includes(debouncedIdQuery.trim().toLowerCase())) &&
        (!selectedCategories.length || selectedCategories.includes(category)) &&
        (!selectedStatus.length || selectedStatus.includes(status))
      );
    });

    // Sort data
    processedData = sortBy(processedData, sortStatus.columnAccessor);
    if (sortStatus.direction === "desc") {
      processedData.reverse();
    }

    setRecords(processedData);
  }, [
    deviations,
    debouncedIdQuery,
    debouncedTitleQuery,
    selectedCategories,
    selectedStatus,
    sortStatus,
  ]);

  useEffect(() => {
    const fetchImageUrlForId = async (id: string) => {
      try {
        const response = await axios.get(`/api/user-photo/${id}`, {
          responseType: "blob",
        });
        const imageBlob = response.data;
        return URL.createObjectURL(imageBlob);
      } catch (error: any) {
        error.response.status !== 404 &&
          console.error(`Error fetching image for user ${id}:`, error);
        return "";
      }
    };

    if (!graphData || !records) return;

    const newUserImageUrls: Record<string, string> = {};
    const fetchImagesPromises: any = [];

    records.forEach(({ creator, assigneeId }) => {
      if (
        creator &&
        creator.toLowerCase() !== "zendesk" &&
        !userImageUrls[creator]
      ) {
        fetchImagesPromises.push(
          fetchImageUrlForId(creator).then((url) => {
            newUserImageUrls[creator] = url;
          })
        );
      }
      if (assigneeId && !userImageUrls[assigneeId]) {
        fetchImagesPromises.push(
          fetchImageUrlForId(assigneeId).then((url) => {
            newUserImageUrls[assigneeId] = url;
          })
        );
      }
    });

    Promise.all(fetchImagesPromises).then(() => {
      setUserImageUrls((prev) => ({ ...prev, ...newUserImageUrls }));
    });
  }, [graphData, records]);

  const categories = useMemo(
    () => Array.from(new Set(deviations?.map((e) => e.category))),
    [deviations]
  );
  const statuses = useMemo(
    () => Array.from(new Set(deviations?.map((e) => e.status))),
    [deviations]
  );

  // Render loading or error states
  if (deviationsQuery.isLoading) return <LoadingOverlay visible={true} />;
  if (deviationsQuery.isError) return <ServerError />;

  return (
    <Container fluid p="md">
      <DataTable
        records={records}
        shadow="xs"
        highlightOnHover
        withBorder
        withColumnBorders
        borderRadius="md"
        minHeight={records?.length === 0 ? "10rem" : ""}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        fetching={deviationsQuery.isLoading}
        columns={[
          {
            accessor: "id",
            textAlignment: "center",
            ellipsis: true,
            filter: (
              <TextInput
                label="ID"
                description="#12345"
                placeholder="Search id..."
                icon={<IconSearch size={16} />}
                value={idQuery}
                onChange={(e: any) => setIdQuery(e.currentTarget.value)}
              />
            ),
            filtering: idQuery !== "",
          },
          {
            accessor: "title",
            ellipsis: true,

            filter: (
              <TextInput
                label="Title"
                description="A bug in the system"
                placeholder="Search title..."
                icon={<IconSearch size={16} />}
                value={titleQuery}
                onChange={(e: any) => setTitleQuery(e.currentTarget.value)}
              />
            ),
            filtering: titleQuery !== "",
          },
          {
            accessor: "tickets",
            ellipsis: true,
            render: ({ tickets }) => tickets.length,
          },
          {
            accessor: "createdAt",
            render: ({ createdAt }) => getDeviationDate(createdAt),
            ellipsis: true,

            sortable: true,
          },
          {
            accessor: "category",
            ellipsis: true,

            filter: (
              <MultiSelect
                label="Category"
                description="Show different categories"
                data={categories}
                value={selectedCategories}
                placeholder="Search departments…"
                onChange={setSelectedCategories}
                icon={<IconSearch size={16} />}
                clearable
                searchable
              />
            ),
            filtering: selectedCategories.length > 0,
          },
          {
            accessor: "creator",
            ellipsis: true,

            render: ({ creator }) => (
              <UserBadge
                identifier={creator}
                userImageUrls={userImageUrls}
                graphData={graphData}
              />
            ),
          },
          {
            accessor: "status",
            ellipsis: true,

            filter: (
              <MultiSelect
                label="Status"
                description="Show different status"
                data={statuses}
                value={selectedStatus}
                placeholder="Search status…"
                onChange={setSelectedStatus}
                icon={<IconSearch size={16} />}
                clearable
                searchable
              />
            ),
            filtering: selectedStatus.length > 0,
          },
          {
            accessor: "assignee",
            ellipsis: true,

            render: ({ assigneeId }) => (
              <UserBadge
                identifier={assigneeId}
                userImageUrls={userImageUrls}
                graphData={graphData}
              />
            ),
          },
          {
            accessor: "progress",
            ellipsis: true,

            render: ({ progress }) => <ProgressBar progress={progress} />,
          },
        ]}
        rowContextMenu={{
          trigger: "click",
          borderRadius: "md",
          shadow: "lg",
          items: (record) => [
            {
              key: "details",
              title: `Vis detaljer`,
              icon: <IconInfoCircle size={16} />,
              onClick: () =>
                openModal({
                  title: `Avvik #${record.id}`,
                  size: "xl",
                  children: (
                    <RedCardsProvider>
                      <DeviationDetails
                        graphData={graphData}
                        record={record}
                        userImageUrls={userImageUrls}
                      />
                    </RedCardsProvider>
                  ),
                }),
            },
            {
              key: "edit",
              title: "Rediger",
              icon: <IconEdit size={16} />,
              onClick: () =>
                openModal({
                  title: `Rediger Avvik #${record.id}`,
                  size: "xl",
                  children: (
                    <RedCardsProvider>
                      <MutateDeviation
                        graphData={graphData}
                        record={record}
                        mode="edit"
                      />
                      ,
                    </RedCardsProvider>
                  ),
                }),
            },
          ],
        }}
      />
    </Container>
  );
};

export default Deviations;
