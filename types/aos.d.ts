declare module 'aos' {
  export type AosEasing =
    | 'linear'
    | 'ease'
    | 'ease-in'
    | 'ease-out'
    | 'ease-in-out'
    | 'ease-in-back'
    | 'ease-out-back'
    | 'ease-in-out-back'
    | 'ease-in-sine'
    | 'ease-out-sine'
    | 'ease-in-out-sine'
    | 'ease-in-quad'
    | 'ease-out-quad'
    | 'ease-in-out-quad'
    | 'ease-in-cubic'
    | 'ease-out-cubic'
    | 'ease-in-out-cubic'
    | 'ease-in-quart'
    | 'ease-out-quart'
    | 'ease-in-out-quart'

  export type AosAnchorPlacement =
    | 'top-bottom'
    | 'top-center'
    | 'top-top'
    | 'center-bottom'
    | 'center-center'
    | 'center-top'
    | 'bottom-bottom'
    | 'bottom-center'
    | 'bottom-top'

  export interface AosOptions {
    offset?: number
    delay?: number
    duration?: number
    easing?: AosEasing
    once?: boolean
    mirror?: boolean
    anchorPlacement?: AosAnchorPlacement
    disable?: boolean | 'phone' | 'tablet' | 'mobile' | (() => boolean)
    startEvent?: string
    debounceDelay?: number
    throttleDelay?: number
    disableMutationObserver?: boolean
  }

  export interface AosApi {
    init: (options?: AosOptions) => void
    refresh: () => void
    refreshHard: () => void
  }

  const AOS: AosApi
  export default AOS
}
