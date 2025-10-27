import { describe, expect, it, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App, { LOCAL_STORAGE_KEY } from '../App.jsx';

const renderApp = () => render(<App />);

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('bootstraps data from localStorage when available', () => {
    const stored = {
      personal: {
        name: 'Test Person',
        email: 'test@example.com',
        phone: '01234 567890',
        showAddress: false,
        showTitle: true,
        showLinkedin: false,
        primaryColor: 'blue',
      },
      summary: 'Summary from storage.',
      experience: [],
      education: [],
      skills: '',
    };

    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stored));

    renderApp();

    expect(screen.getByLabelText(/Full Name/i)).toHaveValue('Test Person');
    expect(screen.getByLabelText(/Email \*/i)).toHaveValue('test@example.com');
  });

  it('allows toggling address visibility in the preview', () => {
    renderApp();

    expect(screen.getByText(/Guiseley, Leeds LS20 1BG/i)).toBeInTheDocument();

    const toggle = screen.getByLabelText(/Show Full Address/i);
    fireEvent.click(toggle);

    expect(screen.queryByText(/Guiseley, Leeds LS20 1BG/i)).not.toBeInTheDocument();
  });

  it('updates the preview colour when selecting a new scheme', () => {
    renderApp();

    const blueButton = screen.getByTitle('Use Blue theme');
    fireEvent.click(blueButton);

    const summaryHeading = screen.getByRole('heading', { level: 2, name: /Professional Summary/i });
    expect(summaryHeading).toHaveClass('text-blue-600');
  });
});
