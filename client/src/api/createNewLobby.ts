export async function createNewLobby({
  playerId,
  name,
}: {
  playerId: string;
  name: string;
}) {
  try {
    const res = await fetch("http://localhost:4000/lobby", {
      method: "POST",
      body: JSON.stringify({ playerId, name }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    return data;
  } catch (err) {
    console.error("Failed to create lobby", err);
    alert("Could not create a lobby, please try again.");
  }
}
