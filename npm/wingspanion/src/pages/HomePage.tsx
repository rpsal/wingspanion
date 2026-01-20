import { useAppState } from "../app/AppContext";

export default function HomePage() {
  const { draftGame, setDraftGame } = useAppState();

  return (
    <div>
      <h1>Home</h1>
      <pre>{JSON.stringify(draftGame, null, 2)}</pre>
      <button
        onClick={() =>
          setDraftGame({
            id: "test",
            players: [],
            expansions: ["base"],
            startedAt: Date.now(),
            scores: {},
            currentCategoryId: "birds",
            schemaVersion: 1,
          })
        }
      >
        Create Draft
      </button>
      <button onClick={() => setDraftGame(null)}>Clear Draft</button>
    </div>
  );
}
