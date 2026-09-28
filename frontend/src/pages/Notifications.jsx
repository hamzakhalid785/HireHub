import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import {
  fetchNotifications,
  markNotificationRead,
} from "../features/notifications/notificationsSlice";

export default function Notifications() {
  const dispatch = useDispatch();

  const { notifications, loading, error } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleRead = (notification) => {
    if (!notification.is_read) {
      dispatch(markNotificationRead(notification.id));
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Notifications
          </h1>

          <p className="mt-1 text-gray-600">
            {unreadCount > 0
              ? `${unreadCount} unread notification${
                  unreadCount > 1 ? "s" : ""
                }`
              : "You're all caught up."}
          </p>
        </div>

        {loading && (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
              No notifications
            </h2>

            <p className="mt-2 text-gray-500">
              New updates will appear here.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleRead(notification)}
              className={`cursor-pointer rounded-xl border p-5 shadow-sm transition hover:shadow-md ${
                notification.is_read
                  ? "border-gray-200 bg-white"
                  : "border-blue-200 bg-blue-50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-gray-900">
                      {notification.title}
                    </h2>

                    {!notification.is_read && (
                      <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                        New
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-gray-600">
                    {notification.message}
                  </p>

                  <p className="mt-3 text-xs text-gray-400">
                    {notification.created_at
                      ? new Date(
                          notification.created_at
                        ).toLocaleString()
                      : ""}
                  </p>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                  {notification.notification_type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}