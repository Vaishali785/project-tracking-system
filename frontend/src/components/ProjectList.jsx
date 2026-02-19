import StatusBadge from './StatusBadge';

/**
 * ProjectList Component
 * Displays projects in a table format
 * Handles loading, empty, and error states
 */

export default function ProjectList({ projects, loading, error, onProjectClick }) {
    // Loading state
    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '48px' }}>
                <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading projects...</div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div style={{
                padding: '24px',
                backgroundColor: '#fee2e2',
                borderRadius: '8px',
                border: '1px solid #fecaca'
            }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#991b1b' }}>Error loading projects</h3>
                <p style={{ margin: 0, color: '#991b1b' }}>{error}</p>
            </div>
        );
    }

    // Empty state
    if (projects.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '48px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
            }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                <h3 style={{ margin: '0 0 8px 0', color: '#374151' }}>No projects found</h3>
                <p style={{ margin: 0, color: '#6b7280' }}>
                    Try adjusting your filters or create a new project
                </p>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Projects table
    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                backgroundColor: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
                <thead>
                    <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                            Project
                        </th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                            Client
                        </th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                            Status
                        </th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                            Start Date
                        </th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                            End Date
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <tr
                            key={project.id}
                            onClick={() => onProjectClick(project.id)}
                            style={{
                                borderBottom: '1px solid #e5e7eb',
                                cursor: 'pointer',
                                transition: 'background-color 0.15s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            <td style={{ padding: '16px', fontWeight: '500' }}>
                                {project.name}
                            </td>
                            <td style={{ padding: '16px', color: '#6b7280' }}>
                                {project.clientName}
                            </td>
                            <td style={{ padding: '16px' }}>
                                <StatusBadge status={project.status} />
                            </td>
                            <td style={{ padding: '16px', color: '#6b7280' }}>
                                {formatDate(project.startDate)}
                            </td>
                            <td style={{ padding: '16px', color: '#6b7280' }}>
                                {formatDate(project.endDate)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
