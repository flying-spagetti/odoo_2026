"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"

export function Provider(props: ColorModeProviderProps) {
  const { children, ...colorModeProps } = props

  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...colorModeProps}>{children}</ColorModeProvider>
    </ChakraProvider>
  )
}
