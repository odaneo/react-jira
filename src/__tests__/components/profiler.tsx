import React from 'react'
import { render } from '@testing-library/react'

beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
  jest.restoreAllMocks()
  jest.resetModules()
  jest.dontMock('react')
})

test('Profiler queues and flushes profile payload', () => {
  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

  jest.isolateModules(() => {
    jest.doMock('react', () => {
      const actual = jest.requireActual('react')
      return {
        ...actual,
        Profiler: ({ id, onRender, children }: any) => {
          onRender(id, 'mount', 1, 1, 1, 1, new Set())
          return <>{children}</>
        }
      }
    })

    const { Profiler } = require('components/profiler')

    render(
      <Profiler id="unit-profiler" metadata={{ page: 'kanban' }}>
        <div>content</div>
      </Profiler>
    )
  })

  jest.advanceTimersByTime(5000)

  expect(logSpy).toHaveBeenCalled()
  const firstCall = logSpy.mock.calls[0][0]
  expect(Array.isArray(firstCall)).toBe(true)
  expect(firstCall[0]).toEqual(expect.objectContaining({ id: 'unit-profiler', metadata: { page: 'kanban' } }))
})
