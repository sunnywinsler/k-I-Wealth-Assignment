import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AppProvider } from '../src/context/AppContext';
import { RequirementForm } from '../src/components/RequirementForm';

function renderForm() {
  return render(
    <AppProvider>
      <RequirementForm />
    </AppProvider>,
  );
}

describe('RequirementForm', () => {
  it('shows a validation error when the amount is below the minimum', async () => {
    const user = userEvent.setup();
    renderForm();

    const amount = screen.getByLabelText(/required loan amount/i);
    await user.clear(amount);
    await user.type(amount, '1000');
    await user.click(screen.getByRole('button', { name: /discover matching opportunities/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/minimum ₹50,000/i);
  });

  it('keeps the user on the requirement form when input is invalid', async () => {
    const user = userEvent.setup();
    renderForm();

    const amount = screen.getByLabelText(/required loan amount/i);
    await user.clear(amount);
    await user.click(screen.getByRole('button', { name: /discover matching opportunities/i }));

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /find your best lending opportunities/i })).toBeInTheDocument();
  });
});
