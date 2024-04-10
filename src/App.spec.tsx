import { describe, it, afterEach, expect } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from "./App.tsx";

afterEach(() => {
  cleanup();
});

describe('App.js', () => {
  it('처음에 숫자를 0으로 보여줘요.', () => {
    render(<App />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('증가버튼을 클릭하면 숫자가 올라가요', async () => {
    render(<App />);

    const countElement = screen.getByText('0');
    const increaseButtonElement = screen.getByText('증가');

    await userEvent.click(increaseButtonElement);
    await userEvent.click(increaseButtonElement);
    await userEvent.click(increaseButtonElement);

    expect(countElement).toHaveTextContent('3');
  });

  it('감소버튼을 클릭하면 숫자가 내려가요', async () => {
    render(<App />);

    const countElement = screen.getByText('0');
    const decreaseButtonElement = screen.getByText('감소');

    await userEvent.click(decreaseButtonElement);
    await userEvent.click(decreaseButtonElement);

    expect(countElement).toHaveTextContent('-2');
  });

  // it('방문 후 잠시 뒤 인사말이 보여져요', async () => {
  //   render(<App />);
  //
  //   const greetElement = await screen.findByTestId('greet');
  //
  //   expect(greetElement).toHaveTextContent('Hello');
  });