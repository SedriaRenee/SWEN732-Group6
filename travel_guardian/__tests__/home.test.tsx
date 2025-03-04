import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'
 
test('Home Page', () => {
  render(<Home />)
  const welcome = "Welcome to Travel Guardian!";
  expect(screen.getByRole('heading', { level: 1, name: welcome })).toBeDefined()
})