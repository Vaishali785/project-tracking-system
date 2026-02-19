import { useEffect } from "react";

export default function Toast({ message, type = 'success', onClose }) {
    const colors = {
        success: { bg: '#dcfce7', text: '#166534', border: '#86efac' },
        error: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' }
    };

    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            backgroundColor: colors[type].bg,
            color: colors[type].text,
            padding: '12px 20px',
            borderRadius: '8px',
            border: `1px solid ${colors[type].border}`,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 9999,
            animation: 'slideIn 0.3s ease-out'
        }}>
            {message}
        </div>
    );
}