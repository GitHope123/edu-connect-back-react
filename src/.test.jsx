import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

function Hola() {
  return <h1>Hola EduConnect</h1>;
}

describe('Componente Hola', () => {
  it('muestra el texto correcto', () => {
    render(<Hola />);
    expect(screen.getByText('Hola EduConnect')).toBeInTheDocument();
  });
});
