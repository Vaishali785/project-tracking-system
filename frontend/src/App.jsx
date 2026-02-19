import { useState } from 'react';
import Filters from './components/Filters';
import ProjectDetail from './components/ProjectDetail';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import Toast from './components/Toast';

// Custom hooks
import useFilters from './hooks/useFilters';
import useProjectDetail from './hooks/useProjectDetail';
import useProjects from './hooks/useProjects';
import useToast from './hooks/useToast';

/**
 * Main App Component
 * 
 * Orchestrates the application using custom hooks:
 * - useFilters: Filter state with URL persistence
 * - useProjects: Project data and CRUD operations
 * - useToast: Toast notifications
 * - useProjectDetail: Project detail modal
 */

function App() {
    // Custom hooks handle all the complex logic
    const { filters, updateFilters } = useFilters();
    const { projects, loading, error, createProject, updateProjectStatus, deleteProject } = useProjects(filters);
    const { toast, showToast, hideToast } = useToast();
    const { selectedProject, loadingDetail, openProjectDetail, closeProjectDetail } = useProjectDetail();

    // Simple UI state
    const [showForm, setShowForm] = useState(false);

    /**
     * Handlers - Just coordinate between hooks and show toasts
     */

    const handleCreateProject = async (projectData) => {
        await createProject(projectData);
        showToast('✓ Project created successfully');
    };

    const handleStatusUpdate = async (id, newStatus) => {
        await updateProjectStatus(id, newStatus);
        showToast('✓ Status updated');
    };

    const handleDeleteProject = async (id) => {
        await deleteProject(id);
        showToast('✓ Project deleted successfully');
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f3f4f6',
            padding: '24px'
        }}>
            {/* Header */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                marginBottom: '32px'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                }}>
                    <h1 style={{
                        margin: 0,
                        fontSize: '32px',
                        fontWeight: '700',
                        color: '#111827'
                    }}>
                        Project Tracking System
                    </h1>
                    <button
                        onClick={() => setShowForm(true)}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        + New Project
                    </button>
                </div>
                <p style={{
                    margin: 0,
                    color: '#6b7280',
                    fontSize: '14px'
                }}>
                    Manage and track all your projects in one place
                </p>
            </div>

            {/* Main Content */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* Filters with integrated count */}
                <div style={{ marginBottom: '24px' }}>
                    <Filters
                        onFilterChange={updateFilters}
                        projectCount={loading || error ? null : projects.length}
                    />
                </div>

                {/* Project List */}
                <ProjectList
                    projects={projects}
                    loading={loading}
                    error={error}
                    onProjectClick={openProjectDetail}
                />
            </div>

            {/* Modals */}
            {showForm && (
                <ProjectForm
                    onClose={() => setShowForm(false)}
                    onSubmit={handleCreateProject}
                />
            )}

            {(selectedProject || loadingDetail) && (
                <ProjectDetail
                    project={selectedProject}
                    loading={loadingDetail}
                    onClose={closeProjectDetail}
                    onStatusUpdate={handleStatusUpdate}
                    onDelete={handleDeleteProject}
                />
            )}

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}
        </div>
    );
}

export default App;