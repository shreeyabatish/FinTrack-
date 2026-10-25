
import { useEffect, useState } from "react";
import { useFinance } from "../context/FinanceContext";
import GoalCard from "../components/GoalCard";
import "../styles/Goals.css";
import "../styles/Modal.css";

function Goals() {
  const {
    goals,
    fetchGoals,
    addGoal,
    deleteGoal,
    updateGoal,
  } = useFinance();

  // =========================
  // STATE
  // =========================

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [activeGoal, setActiveGoal] = useState(null);

  const [goalName, setGoalName] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");
  const [addAmount, setAddAmount] = useState("");

  const [error, setError] = useState("");
  const [pageError, setPageError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================
  // LOAD GOALS FROM MONGODB
  // =========================

  useEffect(() => {
    fetchGoals();
  }, []);

  // =========================
  // HELPERS
  // =========================

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-IN");

  const getGoalId = (goal) =>
    goal?._id || goal?.id;

  const getGoalName = (goal) =>
    goal?.title || goal?.name || "";

  const resetForm = () => {
    setGoalName("");
    setTarget("");
    setSaved("");
    setAddAmount("");
    setError("");
    setActiveGoal(null);
  };

  const closeModal = () => {
    if (isSubmitting) return;

    setShowModal(false);
    resetForm();
  };

  // =========================
  // OPEN MODALS
  // =========================

  const openCreateModal = () => {
    resetForm();
    setModalMode("create");
    setPageError("");
    setShowModal(true);
  };

  const openEditModal = (goalId) => {
    const goal = goals.find(
      (item) =>
        String(getGoalId(item)) === String(goalId)
    );

    if (!goal) return;

    setActiveGoal(goal);
    setGoalName(getGoalName(goal));
    setTarget(String(goal.target ?? ""));
    setSaved(String(goal.saved ?? 0));
    setError("");
    setPageError("");
    setModalMode("edit");
    setShowModal(true);
  };

  const openAddMoneyModal = (goalId) => {
    const goal = goals.find(
      (item) =>
        String(getGoalId(item)) === String(goalId)
    );

    if (!goal) return;

    setActiveGoal(goal);
    setAddAmount("");
    setError("");
    setPageError("");
    setModalMode("addMoney");
    setShowModal(true);
  };

  // =========================
  // CREATE / EDIT GOAL
  // =========================

  const handleCreateOrEditGoal = async (e) => {
    e.preventDefault();
    setError("");

    const cleanName = goalName.trim();
    const targetAmount = Number(target);
    const savedAmount = Number(saved);

    if (!cleanName) {
      setError("Please enter a goal name.");
      return;
    }

    if (
      !Number.isFinite(targetAmount) ||
      targetAmount <= 0
    ) {
      setError("Please enter a valid target amount.");
      return;
    }

    if (
      !Number.isFinite(savedAmount) ||
      savedAmount < 0
    ) {
      setError("Saved amount cannot be negative.");
      return;
    }

    if (savedAmount > targetAmount) {
      setError("Saved amount cannot exceed the target.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (modalMode === "create") {
        await addGoal({
          name: cleanName,
          target: targetAmount,
          saved: savedAmount,
        });
      } else {
        const id = getGoalId(activeGoal);

        if (!id) {
          throw new Error("Goal ID is missing.");
        }

        await updateGoal({
          id,
          title: cleanName,
          target: targetAmount,
          saved: savedAmount,
        });
      }

      setShowModal(false);
      resetForm();
      setPageError("");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Could not save the goal. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // ADD MONEY TO GOAL
  // =========================

  const handleAddMoney = async (e) => {
    e.preventDefault();
    setError("");

    const amount = Number(addAmount);
    const currentSaved = Number(activeGoal?.saved ?? 0);
    const targetAmount = Number(activeGoal?.target ?? 0);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    if (currentSaved + amount > targetAmount) {
      const remaining = Math.max(
        0,
        targetAmount - currentSaved
      );

      setError(
        `You only need ₹${formatMoney(
          remaining
        )} more to reach this goal.`
      );

      return;
    }

    setIsSubmitting(true);

    try {
      const id = getGoalId(activeGoal);

      if (!id) {
        throw new Error("Goal ID is missing.");
      }

      await updateGoal({
        id,
        title: getGoalName(activeGoal),
        target: targetAmount,
        saved: currentSaved + amount,
      });

      setShowModal(false);
      resetForm();
      setPageError("");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Could not update your savings. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // DELETE GOAL
  // =========================

  const handleDeleteGoal = async (goalId) => {
    const goal = goals.find(
      (item) =>
        String(getGoalId(item)) === String(goalId)
    );

    if (!goal) return;

    const confirmed = window.confirm(
      `Delete the goal "${getGoalName(
        goal
      )}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setPageError("");

    try {
      await deleteGoal(goalId);
    } catch (err) {
      setPageError(
        err.response?.data?.error ||
          err.message ||
          "Could not delete the goal. Please try again."
      );
    }
  };

  // =========================
  // SUMMARY CALCULATIONS
  // =========================

  const totalTarget = goals.reduce(
    (sum, goal) =>
      sum + Number(goal.target || 0),
    0
  );

  const totalSaved = goals.reduce(
    (sum, goal) =>
      sum + Number(goal.saved || 0),
    0
  );

  const completedGoals = goals.filter(
    (goal) =>
      Number(goal.target) > 0 &&
      Number(goal.saved) >= Number(goal.target)
  ).length;

  const overallProgress =
    totalTarget > 0
      ? Math.min(
          100,
          Math.round((totalSaved / totalTarget) * 100)
        )
      : 0;

  // =========================
  // UI
  // =========================

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
          type="button"
          className="add-goal-btn"
          onClick={openCreateModal}
        >
          + Add Goal
        </button>
      </div>

      {pageError && (
        <p className="goal-error" role="alert">
          {pageError}
        </p>
      )}

      {/* Summary cards */}
      <div className="goals-summary">
        <div className="goal-summary-card">
          <div className="summary-icon">🎯</div>

          <div>
            <span>Total Goals</span>
            <strong>{goals.length}</strong>
          </div>
        </div>

        <div className="goal-summary-card">
          <div className="summary-icon">💰</div>

          <div>
            <span>Total Saved</span>
            <strong>₹{formatMoney(totalSaved)}</strong>
          </div>
        </div>

        <div className="goal-summary-card">
          <div className="summary-icon">📈</div>

          <div>
            <span>Overall Progress</span>
            <strong>{overallProgress}%</strong>
          </div>
        </div>

        <div className="goal-summary-card">
          <div className="summary-icon">✓</div>

          <div>
            <span>Completed</span>
            <strong>
              {completedGoals}/{goals.length}
            </strong>
          </div>
        </div>
      </div>

      {/* Overall savings progress */}
      <div className="overall-goal-card">
        <div className="overall-goal-top">
          <div>
            <h2>Overall savings progress</h2>

            <p>
              ₹{formatMoney(totalSaved)} saved of ₹
              {formatMoney(totalTarget)}
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
          />
        </div>
      </div>

      {/* Goals list header */}
      <div className="goals-section-header">
        <div>
          <h2>Your Goals</h2>
          <p>
            Track your progress towards each milestone.
          </p>
        </div>

        <span>
          {goals.length}{" "}
          {goals.length === 1 ? "goal" : "goals"}
        </span>
      </div>

      {/* Goal cards */}
      {goals.length > 0 ? (
        <div className="goals-container">
          {goals.map((goal) => {
            const id = getGoalId(goal);

            return (
              <GoalCard
                key={id}
                goalId={id}
                goalName={getGoalName(goal)}
                saved={goal.saved}
                target={goal.target}
                onAddMoney={openAddMoneyModal}
                onEdit={openEditModal}
                onDelete={handleDeleteGoal}
              />
            );
          })}
        </div>
      ) : (
        <div className="goals-empty">
          <span>🎯</span>
          <h3>No goals yet</h3>

          <p>
            Create your first savings goal and start
            tracking your progress.
          </p>

          <button
            type="button"
            className="add-goal-btn"
            onClick={openCreateModal}
          >
            + Create Your First Goal
          </button>
        </div>
      )}

      {/* Create / Edit / Add Money modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={closeModal}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="page-label">
                  GOAL PLANNER
                </p>

                <h2>
                  {modalMode === "create"
                    ? "Create New Goal"
                    : modalMode === "edit"
                    ? "Edit Goal"
                    : "Add Savings"}
                </h2>

                {modalMode === "addMoney" &&
                  activeGoal && (
                    <p>{getGoalName(activeGoal)}</p>
                  )}
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
                disabled={isSubmitting}
                aria-label="Close modal"
              >
                ✖
              </button>
            </div>

            {/* Add Money form */}
            {modalMode === "addMoney" ? (
              <form onSubmit={handleAddMoney}>
                <label>Amount to Add</label>

                <div className="amount-input">
                  <span>₹</span>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="e.g. 2000"
                    value={addAmount}
                    onChange={(e) =>
                      setAddAmount(e.target.value)
                    }
                    required
                  />
                </div>

                <p className="goal-modal-hint">
                  Currently saved: ₹
                  {formatMoney(activeGoal?.saved)}
                  <br />
                  Remaining: ₹
                  {formatMoney(
                    Math.max(
                      0,
                      Number(activeGoal?.target || 0) -
                        Number(activeGoal?.saved || 0)
                    )
                  )}
                </p>

                {error && (
                  <p className="goal-error" role="alert">
                    {error}
                  </p>
                )}

                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={closeModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Saving..."
                      : "Save Money"}
                  </button>
                </div>
              </form>
            ) : (
              /* Create / Edit form */
              <form onSubmit={handleCreateOrEditGoal}>
                <label>Goal Name</label>

                <input
                  type="text"
                  placeholder="e.g. New Laptop"
                  value={goalName}
                  onChange={(e) =>
                    setGoalName(e.target.value)
                  }
                  maxLength={100}
                  required
                />

                <label>Target Amount</label>

                <div className="amount-input">
                  <span>₹</span>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="50000"
                    value={target}
                    onChange={(e) =>
                      setTarget(e.target.value)
                    }
                    required
                  />
                </div>

                <label>Already Saved</label>

                <div className="amount-input">
                  <span>₹</span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={saved}
                    onChange={(e) =>
                      setSaved(e.target.value)
                    }
                    required
                  />
                </div>

                {error && (
                  <p className="goal-error" role="alert">
                    {error}
                  </p>
                )}

                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={closeModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Saving..."
                      : modalMode === "create"
                      ? "Create Goal"
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Goals;
