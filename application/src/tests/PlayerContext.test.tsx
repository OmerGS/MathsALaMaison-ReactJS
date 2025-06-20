import React from "react";
import { render, screen, act } from "@testing-library/react";
import { PlayerProvider, usePlayer } from "../context/PlayerContext";
import '@testing-library/jest-dom';

const TestComponent = () => {
  const {
    players,
    points,
    currentPlayerIndex,
    currentPlayer,
    setPlayers,
    setPoints,
    addPointToCurrentPlayer,
    getPointsOfPlayer,
    nextPlayer,
    resetPlayers,
  } = usePlayer();

  return (
    <div>
      <div data-testid="players">{players.join(",")}</div>
      <div data-testid="points">{JSON.stringify(points)}</div>
      <div data-testid="currentPlayerIndex">{currentPlayerIndex}</div>
      <div data-testid="currentPlayer">{currentPlayer || ""}</div>

      {/* Boutons pour déclencher les méthodes */}
      <button onClick={() => setPlayers(["Alice", "Bob"])}>setPlayers</button>
      <button onClick={() => setPoints({ Alice: 5, Bob: 3 })}>setPoints</button>
      <button onClick={() => addPointToCurrentPlayer(2)}>addPointToCurrentPlayer</button>
      <button onClick={() => nextPlayer()}>nextPlayer</button>
      <button onClick={() => resetPlayers()}>resetPlayers</button>

      {/* Affichage getPointsOfPlayer */}
      <div data-testid="pointsAlice">{getPointsOfPlayer("Alice")}</div>
      <div data-testid="pointsBob">{getPointsOfPlayer("Bob")}</div>
    </div>
  );
};

describe("PlayerContext", () => {
  beforeEach(() => {
    // Nettoyer localStorage entre tests pour éviter interférence
    localStorage.clear();
  });

  test("initial state is empty", () => {
    render(
      <PlayerProvider>
        <TestComponent />
      </PlayerProvider>
    );

    expect(screen.getByTestId("players").textContent).toBe("");
    expect(screen.getByTestId("points").textContent).toBe("{}");
    expect(screen.getByTestId("currentPlayerIndex").textContent).toBe("0");
    expect(screen.getByTestId("currentPlayer").textContent).toBe("");
  });

  test("setPlayers initializes players and points", () => {
    render(
      <PlayerProvider>
        <TestComponent />
      </PlayerProvider>
    );

    act(() => {
      screen.getByText("setPlayers").click();
    });

    expect(screen.getByTestId("players").textContent).toBe("Alice,Bob");
    expect(screen.getByTestId("points").textContent).toBe(JSON.stringify({ Alice: 0, Bob: 0 }));
    expect(screen.getByTestId("currentPlayerIndex").textContent).toBe("0");
    expect(screen.getByTestId("currentPlayer").textContent).toBe("Alice");
  });

  test("setPoints updates points correctly", () => {
    render(
      <PlayerProvider>
        <TestComponent />
      </PlayerProvider>
    );

    // D'abord initialiser les joueurs
    act(() => {
      screen.getByText("setPlayers").click();
    });

    // Puis modifier les points
    act(() => {
      screen.getByText("setPoints").click();
    });

    expect(screen.getByTestId("points").textContent).toBe(JSON.stringify({ Alice: 5, Bob: 3 }));
  });

  test("addPointToCurrentPlayer adds points to current player", () => {
    render(
      <PlayerProvider>
        <TestComponent />
      </PlayerProvider>
    );

    act(() => {
      screen.getByText("setPlayers").click();
    });

    // Alice est joueur courant, ajoute 2 points
    act(() => {
      screen.getByText("addPointToCurrentPlayer").click();
    });

    expect(screen.getByTestId("pointsAlice").textContent).toBe("2");
    expect(screen.getByTestId("pointsBob").textContent).toBe("0");
  });

  test("nextPlayer cycles to next player", () => {
    render(
      <PlayerProvider>
        <TestComponent />
      </PlayerProvider>
    );

    act(() => {
      screen.getByText("setPlayers").click();
    });

    expect(screen.getByTestId("currentPlayer").textContent).toBe("Alice");

    act(() => {
      screen.getByText("nextPlayer").click();
    });

    expect(screen.getByTestId("currentPlayer").textContent).toBe("Bob");

    // Retour au premier joueur
    act(() => {
      screen.getByText("nextPlayer").click();
    });

    expect(screen.getByTestId("currentPlayer").textContent).toBe("Alice");
  });

  test("resetPlayers clears players, points and index", () => {
    render(
      <PlayerProvider>
        <TestComponent />
      </PlayerProvider>
    );

    act(() => {
      screen.getByText("setPlayers").click();
    });

    act(() => {
      screen.getByText("resetPlayers").click();
    });

    expect(screen.getByTestId("players").textContent).toBe("");
    expect(screen.getByTestId("points").textContent).toBe("{}");
    expect(screen.getByTestId("currentPlayerIndex").textContent).toBe("0");
    expect(screen.getByTestId("currentPlayer").textContent).toBe("");
  });
});
