import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { usePublicDeckRequestNotifications } from "@/hooks/use-get-notification";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const { data: notifications = [], isLoading, error } =
    usePublicDeckRequestNotifications([], true);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  if (isLoading) {
    return (
      <DashboardLayout>
        <p>Loading notifications...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <p className="text-red-500">Failed to load notifications</p>
      </DashboardLayout>
    );
  }

  // Phân trang
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotifications = notifications.slice(startIndex, endIndex);

  const handleClick = (deckId: string) => {
    navigate(`/review/${deckId}`);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Notifications</h1>
        <p className="text-gray-600">
          You have {notifications.length} notifications
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-5xl">
        {currentNotifications.map((n) => (
          <div
            key={n.deckId}
            onClick={() => handleClick(n.deckId)}
            className="border rounded-2xl shadow-sm overflow-hidden cursor-pointer transition bg-purple-100 hover:bg-purple-200"
          >
            <div className="p-6 flex gap-6">
              <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden text-xl font-bold">
                {n.actorAvatar ? (
                  <img
                    src={n.actorAvatar}
                    alt={n.actorName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{n.actorName.charAt(0).toUpperCase()}</span>
                )}
              </div>

              <div className="flex-1">
                <div className="text-lg">{n.message}</div>
                <div className="text-gray-600 text-sm mt-1">
                  Deck: <span className="font-medium">{n.deckTitle}</span>
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  Actor: {n.actorName}
                </div>
              </div>
            </div>

            <div className="px-6 pb-4 text-gray-500 text-sm flex items-center gap-2">
              <span>⏱</span>
              {formatDistanceToNow(new Date(n.sortTime), {
                addSuffix: true,
                locale: vi,
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg border transition ${
                currentPage === i + 1
                  ? "bg-purple-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Notifications;
