import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { IdSelect } from 'components/id-select'

jest.mock('antd', () => {
  const Select = ({ value, onChange, children }: any) => (
    <div data-testid="select" data-value={String(value)}>
      <button data-testid="select-change" onClick={() => onChange?.('2')}>
        change
      </button>
      {children}
    </div>
  )
  Select.Option = ({ value, children }: any) => (
    <div data-testid={`option-${String(value)}`}>{children}</div>
  )
  return { Select }
})

test('IdSelect maps value to number and renders default option', () => {
  const onChange = jest.fn()
  render(
    <IdSelect
      value={'1'}
      onChange={onChange}
      defaultOptionName="全部"
      options={[
        { id: 1, name: 'A' },
        { id: 2, name: 'B' }
      ]}
    />
  )

  expect(screen.getByTestId('select')).toHaveAttribute('data-value', '1')
  expect(screen.getByTestId('option-0')).toHaveTextContent('全部')
  expect(screen.getByTestId('option-1')).toHaveTextContent('A')
  expect(screen.getByTestId('option-2')).toHaveTextContent('B')

  fireEvent.click(screen.getByTestId('select-change'))
  expect(onChange).toHaveBeenCalledWith(2)
})

test('IdSelect uses 0 when options are empty', () => {
  render(<IdSelect value={99} options={[]} />)
  expect(screen.getByTestId('select')).toHaveAttribute('data-value', '0')
})
