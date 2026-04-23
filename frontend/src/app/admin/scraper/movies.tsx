import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  applyMovieScrapeSnapshots,
  getMovieScrapeCompare,
  getScrapeRuns,
} from "@/services/scraper-admin.service";
import {
  ApplySnapshotAction,
  CompareRunsResponse,
  MovieCompareRow,
  ScrapeRun,
  SnapshotCompareStatus,
} from "@/types/scraper-admin";

const STATUS_OPTIONS: Array<"all" | SnapshotCompareStatus> = [
  "all",
  "new",
  "changed",
  "unchanged",
  "invalid",
  "failed",
];

const FIELD_LABELS: Record<string, string> = {
  title: "Title",
  poster_url: "Poster",
  show_date: "Release",
  genre: "Genre",
  duration: "Duration",
  description: "Description",
  rating: "Rating",
  trailer_url: "Trailer",
  link: "Link",
};

function formatDate(value?: string | null) {
  if (!value) {
    return "No date";
  }

  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function stringify(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "Empty";
  }

  return String(value);
}

function getStatusClass(status: string) {
  switch (status) {
    case "new":
      return "border-emerald-500/40 bg-emerald-500/15 text-emerald-100";
    case "changed":
      return "border-amber-500/40 bg-amber-500/15 text-amber-100";
    case "unchanged":
      return "border-slate-500/40 bg-slate-500/15 text-slate-100";
    case "invalid":
    case "failed":
      return "border-red-500/40 bg-red-500/15 text-red-100";
    default:
      return "border-sky-500/40 bg-sky-500/15 text-sky-100";
  }
}

function DiffField({ field, row }: { field: string; row: MovieCompareRow }) {
  const hasDiff = row.diffFields.includes(field as never);

  if (!hasDiff) {
    return null;
  }

  return (
    <View className="gap-2 border-t border-[#26314F] pt-3">
      <Text className="font-condensedBold text-body2regular text-[#F4C86A]">
        {FIELD_LABELS[field] ?? field}
      </Text>
      <View className="gap-2 md:flex-row">
        <View className="flex-1 bg-[#11182B] p-3">
          <Text className="font-condensed text-body3 text-[#8B93B0]">
            Current
          </Text>
          <Text className="mt-1 font-condensed text-body2regular text-[#DDE3F4]">
            {stringify(
              row.matchedMovie?.[field as keyof typeof row.matchedMovie],
            )}
          </Text>
        </View>
        <View className="flex-1 bg-[#101F1B] p-3">
          <Text className="font-condensed text-body3 text-[#8B93B0]">
            Snapshot
          </Text>
          <Text className="mt-1 font-condensed text-body2regular text-[#DDE3F4]">
            {stringify(row.snapshot[field as keyof typeof row.snapshot])}
          </Text>
        </View>
      </View>
    </View>
  );
}

function ConfirmModal({
  action,
  count,
  visible,
  onClose,
  onConfirm,
}: {
  action: ApplySnapshotAction | null;
  count: number;
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/70 px-4">
        <View className="w-full max-w-md border border-[#26314F] bg-[#070C1B] p-5">
          <Text className="font-condensedBold text-headline3 text-white">
            Confirm action
          </Text>
          <Text className="mt-3 font-condensed text-body2regular text-[#B7BED4]">
            Apply {action ?? "selected action"} to {count} selected snapshot
            {count === 1 ? "" : "s"}.
          </Text>
          <View className="mt-5 flex-row justify-end gap-3">
            <Pressable
              className="border border-[#35405F] px-4 py-3"
              onPress={onClose}
            >
              <Text className="font-condensedBold text-body2regular text-[#DDE3F4]">
                Cancel
              </Text>
            </Pressable>
            <Pressable className="bg-[#4E7BEE] px-4 py-3" onPress={onConfirm}>
              <Text className="font-condensedBold text-body2regular text-white">
                Apply
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function AdminMovieScraperScreen() {
  const [apiKey, setApiKey] = useState("");
  const [runs, setRuns] = useState<ScrapeRun[]>([]);
  const [selectedRunId, setSelectedRunId] = useState("");
  const [status, setStatus] = useState<"all" | SnapshotCompareStatus>("all");
  const [query, setQuery] = useState("");
  const [compare, setCompare] = useState<CompareRunsResponse | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loadingRuns, setLoadingRuns] = useState(false);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pendingAction, setPendingAction] =
    useState<ApplySnapshotAction | null>(null);

  const selectedCount = selectedIds.size;

  const selectedRun = useMemo(
    () => runs.find((run) => run.id === selectedRunId) ?? null,
    [runs, selectedRunId],
  );

  const loadRuns = useCallback(async () => {
    setLoadingRuns(true);
    setError("");
    setNotice("");

    try {
      const data = await getScrapeRuns(apiKey, 20);
      setRuns(data);

      if (!selectedRunId && data[0]) {
        setSelectedRunId(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoadingRuns(false);
    }
  }, [apiKey, selectedRunId]);

  const loadCompare = useCallback(async () => {
    if (!selectedRunId) {
      return;
    }

    setLoadingCompare(true);
    setError("");

    try {
      const data = await getMovieScrapeCompare(apiKey, {
        runId: selectedRunId,
        status,
        q: query,
        page: 1,
        pageSize: 50,
      });
      setCompare(data);
      setSelectedIds(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoadingCompare(false);
    }
  }, [apiKey, query, selectedRunId, status]);

  useEffect(() => {
    if (apiKey.trim() && selectedRunId) {
      void loadCompare();
    }
  }, [apiKey, loadCompare, selectedRunId]);

  const toggleSelected = (snapshotId: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (next.has(snapshotId)) {
        next.delete(snapshotId);
      } else {
        next.add(snapshotId);
      }

      return next;
    });
  };

  const selectVisible = () => {
    setSelectedIds(new Set(compare?.rows.map((row) => row.snapshot.id) ?? []));
  };

  const applyAction = async () => {
    if (!pendingAction || !selectedRunId) {
      return;
    }

    setApplying(true);
    setError("");
    setNotice("");

    try {
      const result = await applyMovieScrapeSnapshots(apiKey, selectedRunId, {
        action: pendingAction,
        snapshotIds: Array.from(selectedIds),
      });
      setNotice(
        `${result.action}: applied ${result.applied}, failed ${result.failed}`,
      );
      setPendingAction(null);
      await loadCompare();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setApplying(false);
    }
  };

  return (
    <View className="min-h-screen flex-1 bg-[#070C1B]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 56 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-auto w-full max-w-6xl gap-5 px-4 pt-28">
          <View>
            <Text className="font-condensedBold text-headline1 text-white">
              Movie Scrape Compare
            </Text>
            <Text className="mt-2 font-condensed text-body1regular text-[#9AA4C1]">
              Review staged Major Cineplex snapshots before updating canonical
              movies.
            </Text>
          </View>

          <View className="gap-3 border border-[#26314F] bg-[#0D1426] p-4">
            <Text className="font-condensedBold text-headline4 text-white">
              API key
            </Text>
            <View className="gap-3 md:flex-row">
              <TextInput
                className="min-h-12 flex-1 border border-[#35405F] px-3 font-condensed text-body2regular text-white"
                onChangeText={setApiKey}
                placeholder="Enter SCRAPER_API_KEY"
                placeholderTextColor="#68708C"
                secureTextEntry
                value={apiKey}
              />
              <Pressable
                className="items-center justify-center bg-[#4E7BEE] px-5 py-3"
                disabled={loadingRuns}
                onPress={loadRuns}
              >
                <Text className="font-condensedBold text-body2regular text-white">
                  {loadingRuns ? "Loading" : "Load runs"}
                </Text>
              </Pressable>
            </View>
          </View>

          {error ? (
            <View className="border border-red-500/40 bg-red-500/10 p-4">
              <Text className="font-condensedBold text-body2regular text-red-100">
                {error}
              </Text>
            </View>
          ) : null}

          {notice ? (
            <View className="border border-emerald-500/40 bg-emerald-500/10 p-4">
              <Text className="font-condensedBold text-body2regular text-emerald-100">
                {notice}
              </Text>
            </View>
          ) : null}

          <View className="gap-3 border border-[#26314F] bg-[#0D1426] p-4">
            <Text className="font-condensedBold text-headline4 text-white">
              Runs
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {runs.map((run) => {
                  const isSelected = run.id === selectedRunId;

                  return (
                    <Pressable
                      key={run.id}
                      className={`min-w-64 border p-3 ${
                        isSelected
                          ? "border-[#4E7BEE] bg-[#13254D]"
                          : "border-[#26314F] bg-[#070C1B]"
                      }`}
                      onPress={() => setSelectedRunId(run.id)}
                    >
                      <Text className="font-condensedBold text-body2regular text-white">
                        {run.status.toUpperCase()}
                      </Text>
                      <Text className="mt-1 font-condensed text-body3 text-[#9AA4C1]">
                        {formatDate(run.started_at)}
                      </Text>
                      <Text className="mt-2 font-condensed text-body3 text-[#DDE3F4]">
                        fetched {run.fetched} / saved {run.upserted} / failed{" "}
                        {run.failed}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          <View className="gap-4 border border-[#26314F] bg-[#0D1426] p-4">
            <View className="gap-3 lg:flex-row lg:items-end">
              <View className="flex-1">
                <Text className="font-condensedBold text-headline4 text-white">
                  Compare
                </Text>
                <Text className="mt-1 font-condensed text-body3 text-[#9AA4C1]">
                  {selectedRun
                    ? `Run ${selectedRun.id}`
                    : "Select a run to inspect snapshots"}
                </Text>
              </View>
              <TextInput
                className="min-h-12 min-w-72 border border-[#35405F] px-3 font-condensed text-body2regular text-white"
                onChangeText={setQuery}
                placeholder="Search title or link"
                placeholderTextColor="#68708C"
                value={query}
              />
              <Pressable
                className="items-center justify-center border border-[#4E7BEE] px-5 py-3"
                disabled={loadingCompare || !selectedRunId}
                onPress={loadCompare}
              >
                <Text className="font-condensedBold text-body2regular text-[#AFC4FF]">
                  Refresh
                </Text>
              </Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {STATUS_OPTIONS.map((option) => {
                  const isSelected = status === option;
                  const count =
                    option === "all"
                      ? compare?.total
                      : compare?.totals[option as SnapshotCompareStatus];

                  return (
                    <Pressable
                      key={option}
                      className={`border px-4 py-3 ${
                        isSelected
                          ? "border-[#4E7BEE] bg-[#4E7BEE]"
                          : "border-[#26314F] bg-[#070C1B]"
                      }`}
                      onPress={() => setStatus(option)}
                    >
                      <Text className="font-condensedBold text-body2regular text-white">
                        {option} {typeof count === "number" ? `(${count})` : ""}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            <View className="gap-3 md:flex-row md:items-center md:justify-between">
              <Text className="font-condensed text-body2regular text-[#B7BED4]">
                Selected {selectedCount} / showing {compare?.rows.length ?? 0}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                <Pressable
                  className="border border-[#35405F] px-4 py-3"
                  onPress={selectVisible}
                >
                  <Text className="font-condensedBold text-body2regular text-white">
                    Select visible
                  </Text>
                </Pressable>
                <Pressable
                  className="border border-[#35405F] px-4 py-3"
                  onPress={() => setSelectedIds(new Set())}
                >
                  <Text className="font-condensedBold text-body2regular text-white">
                    Clear
                  </Text>
                </Pressable>
                {(
                  [
                    "approve",
                    "ignore",
                    "mark_inactive",
                  ] as ApplySnapshotAction[]
                ).map((action) => (
                  <Pressable
                    key={action}
                    className="bg-[#4E7BEE] px-4 py-3 disabled:opacity-40"
                    disabled={selectedCount === 0 || applying}
                    onPress={() => setPendingAction(action)}
                  >
                    <Text className="font-condensedBold text-body2regular text-white">
                      {action}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          {loadingCompare ? (
            <View className="items-center justify-center py-12">
              <ActivityIndicator color="#4E7BEE" />
            </View>
          ) : null}

          <View className="gap-4">
            {compare?.rows.map((row) => {
              const isSelected = selectedIds.has(row.snapshot.id);

              return (
                <View
                  key={row.snapshot.id}
                  className="gap-4 border border-[#26314F] bg-[#0D1426] p-4"
                >
                  <View className="gap-3 md:flex-row md:items-start">
                    <Pressable
                      className={`h-7 w-7 items-center justify-center border ${
                        isSelected
                          ? "border-[#4E7BEE] bg-[#4E7BEE]"
                          : "border-[#52607F]"
                      }`}
                      onPress={() => toggleSelected(row.snapshot.id)}
                    >
                      <Text className="font-condensedBold text-body3 text-white">
                        {isSelected ? "X" : ""}
                      </Text>
                    </Pressable>

                    <View className="flex-1">
                      <View className="flex-row flex-wrap items-center gap-2">
                        <Text className="font-condensedBold text-headline4 text-white">
                          {row.snapshot.title || "Untitled"}
                        </Text>
                        <View
                          className={`border px-2 py-1 ${getStatusClass(
                            row.compareStatus,
                          )}`}
                        >
                          <Text className="font-condensedBold text-body3 text-white">
                            {row.compareStatus}
                          </Text>
                        </View>
                      </View>
                      <Text className="mt-1 font-condensed text-body3 text-[#9AA4C1]">
                        {row.snapshot.link ||
                          row.snapshot.source_key ||
                          "No source key"}
                      </Text>
                      <Text className="mt-2 font-condensed text-body3 text-[#B7BED4]">
                        Match:{" "}
                        {row.matchedMovie
                          ? `${row.matchedMovie.title} (${row.matchedMovie.id})`
                          : "No current movie"}
                      </Text>
                    </View>
                  </View>

                  {row.diffFields.length > 0 ? (
                    <View className="gap-3">
                      {row.diffFields.map((field) => (
                        <DiffField key={field} field={field} row={row} />
                      ))}
                    </View>
                  ) : (
                    <Text className="font-condensed text-body2regular text-[#9AA4C1]">
                      No field diffs.
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <ConfirmModal
        action={pendingAction}
        count={selectedCount}
        visible={Boolean(pendingAction)}
        onClose={() => setPendingAction(null)}
        onConfirm={applyAction}
      />
    </View>
  );
}
