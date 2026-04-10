import { render, screen } from '@testing-library/react'
import { Mark } from 'components/mark'

test('Mark highlights keyword correctly', () => {
  const name = 'material management'
  const keyword = 'management'

  render(<Mark name={name} keyword={keyword} />)

  expect(screen.getByText(keyword)).toBeInTheDocument()
  expect(screen.getByText(keyword)).toHaveStyle('color: #2563EB')
  expect(screen.getByText('material')).not.toHaveStyle('color: #2563EB')
})
