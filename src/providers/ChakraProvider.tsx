'use client';

import React from 'react';
import { ChakraProvider as ChakraUIProvider, defaultSystem } from '@chakra-ui/react';

interface ChakraProviderProps {
  children: React.ReactNode;
}

export const ChakraProvider: React.FC<ChakraProviderProps> = ({ children }) => {
  return <ChakraUIProvider value={defaultSystem}>{children}</ChakraUIProvider>;
};

export default ChakraProvider;
