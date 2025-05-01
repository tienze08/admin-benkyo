export const mockDecks = [
    {
      id: "1",
      title: "Learn Spanish Basics",
      description: "A simple deck to help you learn basic Spanish phrases.",
      status: "pending",
      cardsCount: 20,
      createdAt: "2025-04-10T12:00:00Z",
      updatedAt: "2025-04-15T09:00:00Z",
      creator: {
        id: "u001",
        name: "Carlos Ruiz",
        avatar: "https://i.pravatar.cc/100?u=carlos",
      },
      reviewNote: "",
      reviewedBy: null
    },
    {
      id: "2",
      title: "Javascript Interview Prep",
      description: "Deck covering JS interview questions and answers.",
      status: "approved",
      cardsCount: 45,
      createdAt: "2025-03-20T08:00:00Z",
      updatedAt: "2025-03-25T10:00:00Z",
      creator: {
        id: "u002",
        name: "Emma Tran",
        avatar: "https://i.pravatar.cc/100?u=emma",
      },
      reviewNote: "Great structure, well explained concepts.",
      reviewedBy: {
        id: "admin01",
        name: "Admin User"
      }
    },
    {
      id: "3",
      title: "English Idioms",
      description: "Common English idioms and their meanings.",
      status: "rejected",
      cardsCount: 30,
      createdAt: "2025-02-11T15:00:00Z",
      updatedAt: "2025-02-13T10:30:00Z",
      creator: {
        id: "u003",
        name: "Sarah Lee",
        avatar: "https://i.pravatar.cc/100?u=sarah",
      },
      reviewNote: "Missing sample answers and too few cards.",
      reviewedBy: {
        id: "admin02",
        name: "Moderator Bob"
      }
    }
  ];
  