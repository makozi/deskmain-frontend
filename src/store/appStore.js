import { create } from 'zustand';

/**
 * App Store - Manages general app state
 */
export const useAppStore = create((set) => ({
  // State
  theme: 'light',
  sidebarOpen: true,
  notifications: [],
  isOnline: navigator.onLine,

  // Actions
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
  setIsOnline: (isOnline) => set({ isOnline }),

  /**
   * Add notification
   */
  addNotification: (notification) => {
    const id = Date.now();
    const newNotification = { ...notification, id };

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto remove notification after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, notification.duration || 3000);
    }

    return id;
  },

  /**
   * Remove notification
   */
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  /**
   * Clear all notifications
   */
  clearNotifications: () => {
    set({ notifications: [] });
  },

  /**
   * Show success notification
   */
  showSuccess: (message, duration = 3000) => {
    return set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: Date.now(),
          type: 'success',
          message,
          duration,
        },
      ],
    }));
  },

  /**
   * Show error notification
   */
  showError: (message, duration = 5000) => {
    return set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: Date.now(),
          type: 'error',
          message,
          duration,
        },
      ],
    }));
  },

  /**
   * Show info notification
   */
  showInfo: (message, duration = 3000) => {
    return set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: Date.now(),
          type: 'info',
          message,
          duration,
        },
      ],
    }));
  },

  /**
   * Show warning notification
   */
  showWarning: (message, duration = 4000) => {
    return set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: Date.now(),
          type: 'warning',
          message,
          duration,
        },
      ],
    }));
  },
}));

// Listen for online/offline events
window.addEventListener('online', () => useAppStore.getState().setIsOnline(true));
window.addEventListener('offline', () => useAppStore.getState().setIsOnline(false));
