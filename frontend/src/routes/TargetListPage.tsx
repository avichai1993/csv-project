/**
 * Target List Page
 *
 * Main page displaying all targets in a table with CRUD operations.
 * Uses generated OpenAPI client - no hardcoded paths.
 * MSW intercepts calls transparently when mocking is enabled.
 */

import { useState, useEffect, useCallback } from "react";
import { Button, Alert } from "react-bootstrap";
import { Plus } from "lucide-react";
import Layout from "../components/Layout";
import TargetList from "../components/TargetList";
import TargetFormModal from "../components/TargetFormModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { TableSkeleton } from "../components/LoadingSkeleton";
import { targetsApi } from "../services/api";
import type { TargetDTO, TargetCreateDTO, TargetUpdateDTO } from "../generated/api";

export default function TargetListPage() {
  // State
  const [targets, setTargets] = useState<TargetDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingTarget, setEditingTarget] = useState<TargetDTO | null>(null);
  const [deletingTarget, setDeletingTarget] = useState<TargetDTO | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all targets using generated API client
  const fetchTargets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await targetsApi.getAllTargets();
      setTargets(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch targets");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load targets on mount
  useEffect(() => {
    fetchTargets();
  }, [fetchTargets]);

  // Handle add new target
  const handleAdd = () => {
    setEditingTarget(null);
    setShowFormModal(true);
  };

  // Handle edit target
  const handleEdit = (target: TargetDTO) => {
    setEditingTarget(target);
    setShowFormModal(true);
  };

  // Handle delete target
  const handleDelete = (target: TargetDTO) => {
    setDeletingTarget(target);
    setShowDeleteModal(true);
  };

  // Submit create/update using generated API client
  const handleFormSubmit = async (data: TargetCreateDTO | TargetUpdateDTO) => {
    try {
      setSubmitting(true);
      setError(null);

      if (editingTarget) {
        await targetsApi.updateTarget(editingTarget.id, data as TargetUpdateDTO);
      } else {
        await targetsApi.createTarget(data as TargetCreateDTO);
      }

      setShowFormModal(false);
      setEditingTarget(null);
      await fetchTargets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save target");
    } finally {
      setSubmitting(false);
    }
  };

  // Confirm delete using generated API client
  const handleConfirmDelete = async () => {
    if (!deletingTarget) return;

    try {
      setSubmitting(true);
      setError(null);
      await targetsApi.deleteTarget(deletingTarget.id);
      setShowDeleteModal(false);
      setDeletingTarget(null);
      await fetchTargets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete target");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Targets</h1>
        <Button variant="primary" onClick={handleAdd}>
          <Plus size={20} className="me-2" />
          Add Target
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <TableSkeleton rows={5} columns={8} />
      ) : targets.length === 0 ? (
        <Alert variant="info">
          No targets found. Click "Add Target" to create one.
        </Alert>
      ) : (
        <TargetList
          targets={targets}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Add/Edit Modal */}
      <TargetFormModal
        show={showFormModal}
        onHide={() => {
          setShowFormModal(false);
          setEditingTarget(null);
        }}
        onSubmit={handleFormSubmit}
        target={editingTarget}
        submitting={submitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setDeletingTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        target={deletingTarget}
        submitting={submitting}
      />
    </Layout>
  );
}
