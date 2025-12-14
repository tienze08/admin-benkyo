import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { usePublicDeckRequestNotifications } from "@/hooks/use-get-notification";
import { usePendingPayout } from "@/hooks/use-get-pending-payout";
import { useRejectPayout } from "@/hooks/use-reject-payout";

import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Notifications = () => {
  const navigate = useNavigate();

  // --- FLASHCARD NOTIFICATIONS ---
  const { data: notifications = [], isLoading, error } =
    usePublicDeckRequestNotifications([], true);

  // --- PENDING PAYOUTS ---
  const { data: pendingPayouts = [] } = usePendingPayout();
  const rejectMutation = useRejectPayout();

  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  // --- SEARCH & PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");

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

  // --- FILTER NOTIFICATIONS ---
  const filteredNotifications = notifications.filter((n) => {
    const term = searchTerm.toLowerCase();
    return (
      n.message.toLowerCase().includes(term) ||
      n.deckTitle.toLowerCase().includes(term) ||
      n.actorName.toLowerCase().includes(term)
    );
  });

  // --- PAGINATION ---
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const currentNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleClickDeck = (deckId: string) => {
    navigate(`/review/${deckId}`);
  };

  // --- HANDLE REJECT ---
  const submitReject = async () => {
    if (!rejectReason.trim()) {
      alert("Reason is required");
      return;
    }
    if (!rejectingId) return;

    rejectMutation.mutate(
      { transactionId: rejectingId, reason: rejectReason },
      {
        onSuccess: () => {
          setRejectingId(null);
          setRejectReason("");

        },
      }
    );
  };

  return (
    <DashboardLayout>

      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4">Deck Notifications</h1>

        <input
          type="text"
          placeholder="Search notifications..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded-lg p-2 w-full max-w-md mb-4"
        />
   <h2 className="text-3xl font-bold mb-4">Public Deck Request</h2>
        <div className="flex flex-col gap-6">
          {currentNotifications.map((n) => (
            <div
              key={n.deckId}
              onClick={() => handleClickDeck(n.deckId)}
              className="border rounded-2xl bg-purple-100 hover:bg-purple-200 cursor-pointer p-5"
            >
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                  {n.actorAvatar ? (
                    <img src={n.actorAvatar} className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex items-center justify-center h-full text-xl font-bold">
                      {n.actorName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="text-lg">{n.message}</div>
                  <div className="text-gray-600 text-sm">
                    Deck: <b>{n.deckTitle}</b>
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    Actor: {n.actorName}
                  </div>
                </div>
              </div>

              <div className="text-gray-600 text-xs mt-2 flex gap-1 items-center">
                ⏱ {formatDistanceToNow(new Date(n.sortTime), { addSuffix: true, locale: vi })}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === i + 1 ? "bg-purple-500 text-white" : "bg-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-4">Pending Payouts</h2>

        {pendingPayouts.length === 0 && (
          <p className="text-gray-600">No pending payout requests</p>
        )}

        <div className="flex flex-col gap-4">
          {pendingPayouts.map((payout) => (
            <div key={payout._id} className="border rounded-xl p-5 shadow-sm bg-white">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-lg">{payout.user.name}</p>
                  <p className="text-gray-600">{payout.user.email}</p>

                  <p className="mt-2">
                    Amount: <b>${payout.amount}</b>
                  </p>

                  <p className="text-gray-600 text-sm">
                    Requested:{" "}
                    {formatDistanceToNow(new Date(payout.createdAt), {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                    onClick={() => setRejectingId(payout._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {rejectingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h3 className="font-bold text-xl mb-3">Reject Payout</h3>

            <textarea
              placeholder="Enter reject reason..."
              className="border p-3 w-full rounded-lg"
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg"
                onClick={() => {
                  setRejectingId(null);
                  setRejectReason("");
                }}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                onClick={submitReject}
              >
                Submit Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Notifications;
