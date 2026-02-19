import { useState } from 'react';
import StatusBadge from './StatusBadge';

/**
 * ProjectDetail Component
 * Modal that shows full project details
 * Allows status updates and deletion
 */

export default function ProjectDetail({ project, onClose, onStatusUpdate, onDelete }) {
    const [selectedStatus, setSelectedStatus] = useState(project?.status);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    /**
     * Determine which status transitions are allowed
     * Based on backend validation rules
     */
    const getAvailableStatuses = () => {
        const transitions = {
            'active': ['on_hold', 'completed'],
            'on_hold': ['active', 'completed'],
            'completed': [] // No transitions from completed
        };
        return transitions[project?.status] || [];
    };

    const availableStatuses = getAvailableStatuses();
    const canUpdateStatus = availableStatuses.length > 0;

    const handleStatusUpdate = async () => {
        if (selectedStatus === project?.status) {
            return; // No change
        }

        setIsUpdating(true);
        setError(null);

        try {
            await onStatusUpdate(project.id, selectedStatus);
            onClose(); // Close modal on success
        } catch (err) {
            setError(err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);

        try {
            await onDelete(project.id);
            onClose(); // Close modal on success
        } catch (err) {
            setError(err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        // Modal backdrop
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}
            onClick={onClose} // Add this
        >
            {/* Modal content */}
            <div style={{
                backgroundColor: 'white',
                padding: '32px',
                borderRadius: '12px',
                width: '90%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflow: 'auto'
            }}
                onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                    <h2 style={{ margin: 0 }}>Project Details</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            padding: '0',
                            color: '#6b7280'
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Project Information */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                            PROJECT NAME
                        </label>
                        <p style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{project?.name}</p>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                            CLIENT
                        </label>
                        <p style={{ margin: 0, fontSize: '16px' }}>{project?.clientName}</p>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                            STATUS
                        </label>
                        <StatusBadge status={project?.status} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                                START DATE
                            </label>
                            <p style={{ margin: 0, fontSize: '16px' }}>{formatDate(project?.startDate)}</p>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                                END DATE
                            </label>
                            <p style={{ margin: 0, fontSize: '16px' }}>{formatDate(project?.endDate)}</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                                CREATED
                            </label>
                            <p style={{ margin: 0, fontSize: '14px' }}>{formatDate(project?.createdAt)}</p>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                                LAST UPDATED
                            </label>
                            <p style={{ margin: 0, fontSize: '14px' }}>{formatDate(project?.updatedAt)}</p>
                        </div>
                    </div>
                </div>

                {/* Status Update Section */}
                {canUpdateStatus && (
                    <div style={{
                        padding: '16px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        marginBottom: '16px'
                    }}>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Update Status</h3>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                disabled={isUpdating}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '14px',
                                    flex: 1
                                }}
                            >
                                <option value={project?.status}>{project?.status.replace('_', ' ')}</option>
                                {availableStatuses.map(status => (
                                    <option key={status} value={status}>
                                        {status.replace('_', ' ')}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleStatusUpdate}
                                disabled={isUpdating || selectedStatus === project?.status}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: isUpdating || selectedStatus === project?.status ? '#9ca3af' : '#3b82f6',
                                    color: 'white',
                                    cursor: isUpdating || selectedStatus === project?.status ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            >
                                {isUpdating ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </div>
                )}

                {project?.status === 'completed' && (
                    <div style={{
                        padding: '12px',
                        backgroundColor: '#dbeafe',
                        borderRadius: '6px',
                        marginBottom: '16px'
                    }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#1e40af' }}>
                            This project is completed and cannot be updated.
                        </p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div style={{
                        padding: '12px',
                        backgroundColor: '#fee2e2',
                        borderRadius: '6px',
                        marginBottom: '16px'
                    }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#991b1b' }}>{error}</p>
                    </div>
                )}

                {/* Delete Section */}
                {!showDeleteConfirm ? (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={isDeleting}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ef4444',
                            backgroundColor: 'white',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        Delete Project
                    </button>
                ) : (
                    <div style={{
                        padding: '16px',
                        backgroundColor: '#fee2e2',
                        borderRadius: '8px'
                    }}>
                        <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#991b1b' }}>
                            Are you sure you want to delete this project? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    borderRadius: '6px',
                                    border: '1px solid #d1d5db',
                                    backgroundColor: 'white',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: isDeleting ? '#9ca3af' : '#ef4444',
                                    color: 'white',
                                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            >
                                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
