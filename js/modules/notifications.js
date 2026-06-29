/**
 * Notifications Module
 * Handles user notifications and alerts
 */

class Notifications {
    static show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.innerHTML = `
            <span class="alert-icon">${this.getIcon(type)}</span>
            <div class="alert-content">
                <p>${message}</p>
            </div>
        `;

        const container = document.body;
        container.appendChild(notification);

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }

        return notification;
    }

    static success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    }

    static error(message, duration = 5000) {
        return this.show(message, 'danger', duration);
    }

    static warning(message, duration = 3000) {
        return this.show(message, 'warning', duration);
    }

    static info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }

    static confirm(message, onConfirm, onCancel) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content modal-sm">
                <div class="modal-header">
                    <h2>تأكيد</h2>
                    <p>${message}</p>
                </div>
                <div class="form-actions">
                    <button class="btn-cancel" onclick="this.closest('.modal').remove()">إلغاء</button>
                    <button class="btn-submit">تأكيد</button>
                </div>
            </div>
        `;

        const confirmBtn = modal.querySelector('.btn-submit');
        confirmBtn.addEventListener('click', () => {
            onConfirm();
            modal.remove();
        });

        document.body.appendChild(modal);
        return modal;
    }

    static getIcon(type) {
        const icons = {
            'success': '✅',
            'danger': '❌',
            'warning': '⚠️',
            'info': 'ℹ️'
        };
        return icons[type] || 'ℹ️';
    }
}

export default Notifications;