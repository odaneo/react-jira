import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Pin } from 'components/pin'

jest.mock('antd', () => ({
  Rate: ({ value, onChange }: any) => (
    <div data-testid="rate" data-value={String(value)}>
      <button data-testid="rate-on" onClick={() => onChange?.(1)}>
        on
      </button>
      <button data-testid="rate-off" onClick={() => onChange?.(0)}>
        off
      </button>
    </div>
  )
}))

test('Pin maps checked to Rate value and emits checked state', () => {
  const onCheckedChange = jest.fn()
  render(<Pin checked={true} onCheckedChange={onCheckedChange} />)

  expect(screen.getByTestId('rate')).toHaveAttribute('data-value', '1')

  fireEvent.click(screen.getByTestId('rate-off'))
  fireEvent.click(screen.getByTestId('rate-on'))

  expect(onCheckedChange).toHaveBeenNthCalledWith(1, false)
  expect(onCheckedChange).toHaveBeenNthCalledWith(2, true)
})
