import { useEffect, useState } from "react";
import GoalCard from "../components/GoalCard";
import "../styles/Goals.css";

function Goals() {

    const [goals, setGoals] = useState(() => {
        const saved = localStorage.getItem("fintrack_goals");

        return saved
            ? JSON.parse(saved)
            : [
                {
                    id: 1,
                    name: "Emergency Fund",
                    saved: 25000,
                    target: 50000,
                },
                {
                    id: 2,
                    name: "Vacation Fund",
                    saved: 10000,
                    target: 20000,
                },
            ];
    });

    const [showModal, setShowModal] = useState(false);

    const [goalName, setGoalName] = useState("");
    const [target, setTarget] = useState("");
    const [saved, setSaved] = useState("");

    const [error, setError] = useState("");

    useEffect(() => {
        localStorage.setItem(
            "fintrack_goals",
            JSON.stringify(goals)
        );
    }, [goals]);

    const handleAddGoal = (e) => {
        e.preventDefault();

        if (!goalName.trim()) {
            setError("Please enter a goal name.");
            return;
        }

        if (!target || Number(target) <= 0) {
            setError("Please enter a valid target amount.");
            return;
        }

        if (Number(saved) < 0) {
            setError("Saved amount cannot be negative.");
            return;
        }

        if (Number(saved) > Number(target)) {
            setError("Saved amount cannot exceed the target.");
            return;
        }

        const newGoal = {
            id: Date.now(),
            name: goalName.trim(),
            target: Number(target),
            saved: Number(saved) || 0,
        };

        setGoals((current) => [
            ...current,
            newGoal,
        ]);

        setGoalName("");
        setTarget("");
        setSaved("");
        setError("");
        setShowModal(false);
    };

    const totalTarget = goals.reduce(
        (sum, goal) => sum + Number(goal.target),
        0
    );

    const totalSaved = goals.reduce(
        (sum, goal) => sum + Number(goal.saved),
        0
    );

    const completedGoals = goals.filter(
        (goal) => Number(goal.saved) >= Number(goal.target)
    ).length;

    const overallProgress = totalTarget
        ? Math.min(
            100,
            Math.round((totalSaved / totalTarget) * 100)
        )
        : 0;

    return (
        <div className="goals-page">

            {/* Header */}

            <div className="goals-header">

                <div>
                    <p className="page-label">
                        FINANCIAL PLANNING
                    </p>

                    <h1>My Goals</h1>

                    <p className="goals-subtitle">
                        Turn your plans into progress and reach your
                        financial milestones.
                    </p>
                </div>

                <button
                    className="add-goal-btn"
                    onClick={() => {
                        setError("");
                        setShowModal(true);
                    }}
                >
                    + Add Goal
                </button>

            </div>

            {/* Summary */}

            <div className="goals-summary">

                <div className="goal-summary-card">

                    <div className="summary-icon">
                        🎯
                    </div>

                    <div>
                        <span>Total Goals</span>
                        <strong>{goals.length}</strong>
                    </div>

                </div>

                <div className="goal-summary-card">

                    <div className="summary-icon">
                        💰
                    </div>

                    <div>
                        <span>Total Saved</span>
                        <strong>
                            ₹{totalSaved.toLocaleString("en-IN")}
                        </strong>
                    </div>

                </div>

                <div className="goal-summary-card">

                    <div className="summary-icon">
                        📈
                    </div>

                    <div>
                        <span>Overall Progress</span>
                        <strong>{overallProgress}%</strong>
                    </div>

                </div>

                <div className="goal-summary-card">

                    <div className="summary-icon">
                        ✓
                    </div>

                    <div>
                        <span>Completed</span>
                        <strong>
                            {completedGoals}/{goals.length}
                        </strong>
                    </div>

                </div>

            </div>

            {/* Overall progress */}

            <div className="overall-goal-card">

                <div className="overall-goal-top">

                    <div>
                        <h2>Overall savings progress</h2>
                        <p>
                            ₹{totalSaved.toLocaleString("en-IN")}
                            {" "}saved of{" "}
                            ₹{totalTarget.toLocaleString("en-IN")}
                        </p>
                    </div>

                    <strong>{overallProgress}%</strong>

                </div>

                <div className="overall-progress">
                    <div
                        className="overall-progress-fill"
                        style={{
                            width: `${overallProgress}%`,
                        }}
                    ></div>
                </div>

            </div>

            {/* Goals */}

            <div className="goals-section-header">

                <div>
                    <h2>Your Goals</h2>
                    <p>Track your progress towards each milestone.</p>
                </div>

                <span>
                    {goals.length} {goals.length === 1 ? "goal" : "goals"}
                </span>

            </div>

            <div className="goals-container">

                {goals.map((goal) => (
                    <GoalCard
                        key={goal.id}
                        goalName={goal.name}
                        saved={goal.saved}
                        target={goal.target}
                    />
                ))}

            </div>

            {/* Add Goal Modal */}

            {showModal && (

                <div
                    className="goal-modal-overlay"
                    onClick={() => setShowModal(false)}
                >

                    <div
                        className="goal-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="modal-header">

                            <div>
                                <p className="page-label">
                                    GOAL PLANNER
                                </p>

                                <h2>Create New Goal</h2>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>

                        </div>

                        <form onSubmit={handleAddGoal}>

                            <label>Goal Name</label>

                            <input
                                type="text"
                                placeholder="e.g. New Laptop"
                                value={goalName}
                                onChange={(e) =>
                                    setGoalName(e.target.value)
                                }
                            />

                            <label>Target Amount</label>

                            <div className="amount-input">

                                <span>₹</span>

                                <input
                                    type="number"
                                    min="1"
                                    placeholder="50000"
                                    value={target}
                                    onChange={(e) =>
                                        setTarget(e.target.value)
                                    }
                                />

                            </div>

                            <label>Already Saved</label>

                            <div className="amount-input">

                                <span>₹</span>

                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={saved}
                                    onChange={(e) =>
                                        setSaved(e.target.value)
                                    }
                                />

                            </div>

                            {error && (
                                <p className="goal-error">
                                    {error}
                                </p>
                            )}

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-goal-btn"
                                >
                                    Create Goal
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Goals;