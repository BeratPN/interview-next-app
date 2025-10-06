'use client';

import FloatingButton from './FloatingButton';

export default function FloatingButtonWrapper() {
  return <FloatingButton onClick={() => alert('Clicked!')}>+</FloatingButton>;
}
