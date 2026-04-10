import React from 'react'
import { render, screen } from '@testing-library/react'
import { Drag, Drop, DropChild } from 'components/drag-and-drag'

jest.mock('react-beautiful-dnd', () => ({
  Droppable: ({ children }: any) =>
    children({
      droppableProps: { 'data-drop': 'ok' },
      innerRef: jest.fn(),
      placeholder: <span data-testid="drop-placeholder">placeholder</span>
    }),
  Draggable: ({ children }: any) =>
    children({
      draggableProps: { 'data-drag': 'ok' },
      dragHandleProps: { 'data-handle': 'ok' },
      innerRef: jest.fn()
    })
}))

test('Drop clones valid child and injects droppable props', () => {
  render(
    <Drop droppableId="drop-1">
      <DropChild data-testid="drop-child">item</DropChild>
    </Drop>
  )

  expect(screen.getByTestId('drop-child')).toHaveAttribute('data-drop', 'ok')
  expect(screen.getByTestId('drop-placeholder')).toBeInTheDocument()
})

test('Drag clones valid child and injects draggable props', () => {
  render(
    <Drag draggableId="drag-1" index={0}>
      <div data-testid="drag-child">drag</div>
    </Drag>
  )

  expect(screen.getByTestId('drag-child')).toHaveAttribute('data-drag', 'ok')
  expect(screen.getByTestId('drag-child')).toHaveAttribute('data-handle', 'ok')
})
