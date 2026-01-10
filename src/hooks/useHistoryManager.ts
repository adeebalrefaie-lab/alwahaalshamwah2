import { useEffect, useCallback, useRef } from 'react';

export type HistoryState = {
  page: 'landing' | 'builder' | 'alacarte';
  timestamp: number;
};

export type ModalState = {
  isContainerSelectionOpen: boolean;
  isContactOpen: boolean;
  isMenuOpen: boolean;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isAdminLoginOpen: boolean;
};

interface UseHistoryManagerProps {
  currentPage: 'landing' | 'builder' | 'alacarte';
  modalState: ModalState;
  onPageChange: (page: 'landing' | 'builder' | 'alacarte') => void;
  onCloseModals: () => void;
}

export function useHistoryManager({
  currentPage,
  modalState,
  onPageChange,
  onCloseModals,
}: UseHistoryManagerProps) {
  const isInitialMount = useRef(true);
  const isHandlingPopState = useRef(false);
  const lastPushedPage = useRef<'landing' | 'builder' | 'alacarte'>('landing');

  const hasOpenModal = useCallback(() => {
    return Object.values(modalState).some((isOpen) => isOpen);
  }, [modalState]);

  const pushHistoryState = useCallback((page: 'landing' | 'builder' | 'alacarte') => {
    if (isHandlingPopState.current) return;

    const state: HistoryState = {
      page,
      timestamp: Date.now(),
    };

    if (lastPushedPage.current !== page || isInitialMount.current) {
      window.history.pushState(state, '', `#${page}`);
      lastPushedPage.current = page;
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      const initialState: HistoryState = {
        page: 'landing',
        timestamp: Date.now(),
      };
      window.history.replaceState(initialState, '', '#landing');
      lastPushedPage.current = 'landing';
      isInitialMount.current = false;
    }
  }, []);

  useEffect(() => {
    if (!isInitialMount.current && !isHandlingPopState.current) {
      pushHistoryState(currentPage);
    }
  }, [currentPage, pushHistoryState]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      isHandlingPopState.current = true;

      if (hasOpenModal()) {
        onCloseModals();
        const state: HistoryState = {
          page: currentPage,
          timestamp: Date.now(),
        };
        window.history.pushState(state, '', `#${currentPage}`);
        setTimeout(() => {
          isHandlingPopState.current = false;
        }, 50);
        return;
      }

      const state = event.state as HistoryState | null;

      if (state && state.page) {
        if (state.page !== currentPage) {
          onPageChange(state.page);
        }
        setTimeout(() => {
          isHandlingPopState.current = false;
        }, 50);
      } else {
        if (currentPage !== 'landing') {
          onPageChange('landing');
          setTimeout(() => {
            isHandlingPopState.current = false;
          }, 50);
        } else {
          setTimeout(() => {
            isHandlingPopState.current = false;
          }, 50);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentPage, hasOpenModal, onCloseModals, onPageChange]);

  return {
    pushHistoryState,
  };
}
