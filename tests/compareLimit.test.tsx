import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AppProvider, useApp } from '../src/context/AppContext';

function CompareHarness() {
  const { state, toggleCompare, startCompare } = useApp();
  return (
    <div>
      <button type="button" onClick={() => toggleCompare('OPP-1001')}>
        Toggle 1
      </button>
      <button type="button" onClick={() => toggleCompare('OPP-1002')}>
        Toggle 2
      </button>
      <button type="button" onClick={() => toggleCompare('OPP-1003')}>
        Toggle 3
      </button>
      <button type="button" onClick={() => toggleCompare('OPP-1004')}>
        Toggle 4
      </button>
      <button type="button" onClick={() => startCompare()}>
        Start compare
      </button>
      <p data-testid="count">{state.compareIds.length}</p>
      <p data-testid="screen">{state.screen}</p>
      {state.compareNotice && <p role="alert">{state.compareNotice}</p>}
    </div>
  );
}

describe('comparison selection limits', () => {
  it('caps comparison at 3 opportunities and explains the limit', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <CompareHarness />
      </AppProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Toggle 1' }));
    await user.click(screen.getByRole('button', { name: 'Toggle 2' }));
    await user.click(screen.getByRole('button', { name: 'Toggle 3' }));
    await user.click(screen.getByRole('button', { name: 'Toggle 4' }));

    expect(screen.getByTestId('count')).toHaveTextContent('3');
    expect(screen.getByRole('alert')).toHaveTextContent(/maximum of 3/i);
  });

  it('blocks the comparison screen until at least two opportunities are selected', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <CompareHarness />
      </AppProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Toggle 1' }));
    await user.click(screen.getByRole('button', { name: 'Start compare' }));

    expect(screen.getByTestId('screen')).toHaveTextContent('requirement');
    expect(screen.getByRole('alert')).toHaveTextContent(/at least 2 opportunities/i);
  });
});
