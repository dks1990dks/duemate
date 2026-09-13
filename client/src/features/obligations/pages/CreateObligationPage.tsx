import { useNavigate } from "react-router-dom";

import ObligationForm from "../components/ObligationForm";
import { useCreateObligation } from "../obligation.hooks";

import type { CreateObligationData } from "../obligation.types";

import type { ObligationFormValues } from "../obligation.form";

import { getApiErrorMessage } from "@/lib/api-error.utils";

const CreateObligationPage = () => {
  const navigate = useNavigate();

  const createMutation = useCreateObligation();

  const handleSubmit = async (values: ObligationFormValues) => {
    const data: CreateObligationData = {
      ...values,

      // Convert empty optional strings to undefined.
      description: values.description || undefined,

      providerName: values.providerName || undefined,

      accountReference: values.accountReference || undefined,
    };

    try {
      await createMutation.mutateAsync(data);

      navigate("/obligations");
    } catch {
      // Error UI will be added below.
      // Keeping the user on the form allows retry.
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => navigate("/obligations")}
          className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← Back to Obligations
        </button>

        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          Add Obligation
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Add a payment, policy, EMI, subscription, or other upcoming
          obligation.
        </p>
      </div>

      {createMutation.isError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3"
        >
          <p className="text-sm text-red-700">
            {getApiErrorMessage(
              createMutation.error,
              "Unable to create obligation. Please try again.",
            )}
          </p>
        </div>
      )}

      <ObligationForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/obligations")}
        isSubmitting={createMutation.isPending}
        submitLabel="Create Obligation"
      />
    </div>
  );
};

export default CreateObligationPage;
