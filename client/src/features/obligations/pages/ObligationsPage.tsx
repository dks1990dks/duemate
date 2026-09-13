import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

import ObligationEmptyState from "../components/ObligationEmptyState";
import ObligationList from "../components/ObligationList";
import ObligationListError from "../components/ObligationListError";
import ObligationListLoading from "../components/ObligationListLoading";

import { useObligations } from "../obligation.hooks";

import { obligationStatuses, obligationTypes } from "../obligation.types";


const ObligationsPage = () => {
  const { data, isLoading, isError, error, refetch } = useObligations();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [typeFilter, setTypeFilter] = useState("ALL");

  type SortOption =
    | "NEXT_DUE_ASC"
    | "NEXT_DUE_DESC"
    | "AMOUNT_ASC"
    | "AMOUNT_DESC"
    | "UPDATED_DESC";

  const [sortBy, setSortBy] = useState<SortOption>("NEXT_DUE_ASC");

  const obligations = data?.data.obligations ?? [];

  const filteredObligations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = obligations.filter((obligation) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          obligation.title,
          obligation.providerName ?? "",
          obligation.accountReference ?? "",
          obligation.type,
        ].some((value) => value.toLowerCase().includes(normalizedSearch));

      const matchesStatus =
        statusFilter === "ALL" || obligation.status === statusFilter;

      const matchesType =
        typeFilter === "ALL" || obligation.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "NEXT_DUE_ASC":
          return (
            new Date(a.nextDueDate).getTime() -
            new Date(b.nextDueDate).getTime()
          );

        case "NEXT_DUE_DESC":
          return (
            new Date(b.nextDueDate).getTime() -
            new Date(a.nextDueDate).getTime()
          );

        case "AMOUNT_ASC":
          return a.amount - b.amount;

        case "AMOUNT_DESC":
          return b.amount - a.amount;

        case "UPDATED_DESC":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );

        default:
          return 0;
      }
    });
  }, [obligations, search, statusFilter, typeFilter, sortBy]);

  const renderContent = () => {
    if (isLoading) {
      return <ObligationListLoading />;
    }

    if (isError) {
      return (
        <ObligationListError
          message={error instanceof Error ? error.message : undefined}
          onRetry={() => {
            void refetch();
          }}
        />
      );
    }

    if (obligations.length === 0) {
      return <ObligationEmptyState />;
    }

    if (filteredObligations.length === 0) {
      return (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm font-medium text-slate-700">
            No obligations match your filters.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("ALL");
              setTypeFilter("ALL");
              setSortBy("NEXT_DUE_ASC");
            }}
            className="mt-3 text-sm font-medium text-slate-600 underline hover:text-slate-900"
          >
            Clear filters
          </button>
        </div>
      );
    }

    return <ObligationList obligations={filteredObligations} />;
  };

  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Obligations</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your upcoming payments, policies, EMIs, and other due dates.
          </p>
        </div>

        <Link
          to="/obligations/new"
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Add Obligation
        </Link>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search obligations..."
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500"
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-500"
            >
              <option value="ALL">All Statuses</option>

              {obligationStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-500"
            >
              <option value="ALL">All Types</option>

              {obligationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-500"
            >
              <option value="NEXT_DUE_ASC">
                Next Due Date — Nearest First
              </option>

              <option value="NEXT_DUE_DESC">
                Next Due Date — Latest First
              </option>

              <option value="AMOUNT_ASC">Amount — Low to High</option>

              <option value="AMOUNT_DESC">Amount — High to Low</option>

              <option value="UPDATED_DESC">Recently Updated</option>
            </select>
          </div>
        </div>
      </div>
      
      {!isLoading && !isError && obligations.length > 0 && (
        <p className="text-sm text-slate-500">
          Showing {filteredObligations.length} of {obligations.length} obligations
        </p>
      )}        
      {renderContent()}
    </div>
  );
};

export default ObligationsPage;
