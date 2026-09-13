import { useNavigate, useParams } from "react-router-dom";

import ObligationForm from "../components/ObligationForm";

import {
  useObligation,
  useUpdateObligation,
} from "../obligation.hooks";

import { mapObligationToFormValues } from "../obligation.mappers";

import type { ObligationFormValues } from "../obligation.form";

import { getApiErrorMessage } from "@/lib/api-error.utils";


const EditObligationPage = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const {
    data: obligation,
    isLoading,
    isError,
    error,
  } = useObligation(id ?? "");

  const updateMutation =
    useUpdateObligation();


  const handleSubmit = async (
    values: ObligationFormValues,
  ) => {
    if (!id) {
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id,
        data: values,
      });

      navigate(`/obligations/${id}`);
    } catch {
      // Error is displayed below.
    }
  };


  if (isLoading) {
    return (
      <div className="py-10 text-sm text-slate-500">
        Loading obligation...
      </div>
    );
  }


  if (isError) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() =>
            navigate(`/obligations/${id}`)
          }
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back to Obligation
        </button>

        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4"
        >
          <p className="text-sm text-red-700">
            {error instanceof Error
              ? error.message
              : "Unable to load obligation."}
          </p>
        </div>
      </div>
    );
  }


  if (!obligation) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() =>
            navigate("/obligations")
          }
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back to Obligations
        </button>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">
            Obligation not found.
          </p>
        </div>
      </div>
    );
  }


  const defaultValues =
    mapObligationToFormValues(obligation);


  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <button
          type="button"
          onClick={() =>
            navigate(`/obligations/${id}`)
          }
          disabled={updateMutation.isPending}
          className="text-sm font-medium text-slate-500 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          ← Back to Obligation
        </button>

        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          Edit Obligation
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update the obligation details below.
        </p>
      </div>


      {updateMutation.isError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3"
        >
          <p className="text-sm text-red-700">
            {getApiErrorMessage(
              updateMutation.error,
              "Unable to update obligation.",
            )}
          </p>
        </div>
      )}


      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <ObligationForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isSubmitting={
            updateMutation.isPending
          }
          submitLabel="Update Obligation"
        />
      </div>
    </div>
  );
};


export default EditObligationPage;