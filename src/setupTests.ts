// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

if (!process.env.REACT_APP_API_URL) {
  process.env.REACT_APP_API_URL = 'http://localhost'
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    media: query,
    matches: false,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  })
})

class ResizeObserverMock {
  callback: ResizeObserverCallback

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }

  observe(target: Element) {
    this.callback(
      [
        {
          target,
          contentRect: {
            width: 640,
            height: 320,
            x: 0,
            y: 0,
            top: 0,
            left: 0,
            bottom: 320,
            right: 640,
            toJSON() {
              return {}
            }
          }
        } as ResizeObserverEntry
      ],
      (this as unknown) as ResizeObserver
    )
  }

  unobserve() {}

  disconnect() {}
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: ResizeObserverMock
})

Object.defineProperty(global, 'ResizeObserver', {
  writable: true,
  value: ResizeObserverMock
})
