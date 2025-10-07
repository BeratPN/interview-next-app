'use client';


import FloatingButton from './FloatingButton';
import { useRouter } from 'next/navigation';

export default function FloatingButtonWrapper() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/add-product'); 
  }

  return <FloatingButton onClick={handleClick}>+</FloatingButton>;
}
