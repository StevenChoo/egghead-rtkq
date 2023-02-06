// @ts-expect-error - React needed for this component.
import React from 'react';

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Loader } from '../components/Loader';

describe('Loader Component', () => {
  it('should render a loader span element', () => {
    const { container } = render(<Loader />);
    const loaderElement = container.querySelector('.loader');
    expect(loaderElement).toBeInTheDocument();
  });

  it('should have the correct className and tag', () => {
    const { container } = render(<Loader />);
    const loaderElement = container.querySelector('.loader');
    expect(loaderElement).toBeInTheDocument();
    expect(loaderElement?.tagName).toBe('SPAN');
    expect(loaderElement).toHaveClass('loader');
  });
});
