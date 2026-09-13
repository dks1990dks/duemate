interface NotificationListErrorProps {
  message?: string;
}

const NotificationListError = ({
  message = "Unable to load notifications.",
}: NotificationListErrorProps) => {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 p-5"
    >
      <p className="text-sm font-medium text-red-700">
        {message}
      </p>
    </div>
  );
};

export default NotificationListError;