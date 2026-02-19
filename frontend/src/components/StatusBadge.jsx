/**
 * StatusBadge Component
 * Displays project status with color coding
 */

export default function StatusBadge({ status }) {
  const styles = {
    active: {
      backgroundColor: '#dcfce7',
      color: '#166534',
    },
    on_hold: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
    },
    completed: {
      backgroundColor: '#dbeafe',
      color: '#1e40af',
    }
  };

  const labels = {
    active: 'Active',
    on_hold: 'On Hold',
    completed: 'Completed'
  };

  return (
    <span 
      style={{
        ...styles[status],
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
      }}
    >
      {labels[status]}
    </span>
  );
}
