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
    const {
        data: notifications = [],
        isLoading,
        error,
    } = usePublicDeckRequestNotifications([], true);

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

    // --- FILTER ---
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

    const submitReject = () => {
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
            {/* ================= NOTIFICATIONS ================= */}
            <section className="mb-12">
                <h1 className="text-3xl font-bold mb-6">Notifications</h1>

                <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="
                        w-full max-w-md mb-6
                        border border-gray-300 rounded-xl
                        px-4 py-2
                        focus:outline-none focus:ring-2 focus:ring-purple-400
                    "
                />

                <h2 className="text-2xl font-semibold mb-4">
                    Public Deck Requests
                </h2>

                <div className="flex flex-col gap-4">
                    {currentNotifications.map((n) => (
                        <div
                            key={n.deckId}
                            onClick={() => handleClickDeck(n.deckId)}
                            className="
                                group cursor-pointer
                                bg-white border border-gray-200
                                rounded-2xl p-5
                                flex gap-4
                                transition-all duration-200
                                hover:shadow-md hover:-translate-y-0.5
                            "
                        >
                            {/* Avatar */}
                            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden shrink-0">
                                {n.actorAvatar ? (
                                    <img
                                        src={n.actorAvatar}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-lg font-bold text-purple-600">
                                        {n.actorName.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-gray-800 group-hover:text-purple-600">
                                        {n.actorName}
                                    </p>
                                    <span className="text-xs text-gray-400">
                                        {formatDistanceToNow(
                                            new Date(n.sortTime),
                                            {
                                                addSuffix: true,
                                                locale: vi,
                                            }
                                        )}
                                    </span>
                                </div>

                                <p className="text-gray-700 mt-1">
                                    {n.message}
                                </p>

                                <div className="mt-2 inline-flex items-center gap-1 text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                                    📘 <span>{n.deckTitle}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-8 gap-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-4 py-2 rounded-xl border transition ${
                                    currentPage === i + 1
                                        ? "bg-purple-500 text-white border-purple-500"
                                        : "bg-white hover:bg-gray-100"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </section>

            {/* ================= PENDING PAYOUTS ================= */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">Pending Payouts</h2>

                {pendingPayouts.length === 0 && (
                    <p className="text-gray-600">No pending payout requests</p>
                )}

                <div className="flex flex-col gap-4">
                    {pendingPayouts.map((payout) => (
                        <div
                            key={payout._id}
                            className="
                                bg-white border border-gray-200
                                rounded-2xl p-5
                                shadow-sm
                                flex justify-between items-center
                            "
                        >
                            <div>
                                <p className="font-semibold text-lg">
                                    {payout.user.name}
                                </p>
                                <p className="text-gray-600">
                                    {payout.user.email}
                                </p>

                                <p className="mt-2">
                                    Amount:{" "}
                                    <b className="text-purple-600">
                                        ${payout.amount}
                                    </b>
                                </p>

                                <p className="text-gray-500 text-sm">
                                    Requested{" "}
                                    {formatDistanceToNow(
                                        new Date(payout.createdAt),
                                        {
                                            addSuffix: true,
                                            locale: vi,
                                        }
                                    )}
                                </p>
                            </div>

                            <button
                                className="
                                    px-4 py-2
                                    bg-red-500 text-white
                                    rounded-xl
                                    hover:bg-red-600
                                "
                                onClick={() => setRejectingId(payout._id)}
                            >
                                Reject
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= REJECT MODAL ================= */}
            {rejectingId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
                        <h3 className="text-xl font-bold mb-4">
                            Reject Payout
                        </h3>

                        <textarea
                            rows={4}
                            placeholder="Enter reject reason..."
                            className="
                                w-full border border-gray-300
                                rounded-xl p-3
                                focus:outline-none focus:ring-2 focus:ring-red-400
                            "
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />

                        <div className="flex justify-end gap-3 mt-5">
                            <button
                                className="px-4 py-2 rounded-xl bg-gray-200"
                                onClick={() => {
                                    setRejectingId(null);
                                    setRejectReason("");
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
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
