export async function createNewRoom({
  playerId,
  name,
}: {
  playerId: string;
  name: string;
}) {
  try {
    const res = await fetch("http://localhost:4000/rooms", {
      method: "POST",
      body: JSON.stringify({ playerId, name }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    return data;
  } catch (err) {
    console.error("Failed to create room", err);
    alert("Could not create a room, please try again.");
  }
}
