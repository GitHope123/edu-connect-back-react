import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';

// Mock de window.matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: () => {},
    removeListener: () => {},
  };
};

// Configuración global para limpiar mocks después de cada test
afterEach(() => {
  vi.clearAllMocks();
});