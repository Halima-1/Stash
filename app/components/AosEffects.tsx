'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import AOS from 'aos'
import 'aos/dist/aos.css'

const CARD_SELECTOR =
  '.surface, .surface-soft, .glass-card, .panel, .table-wrap, .settings-list li, .list-lines li, .activity-feed li, .overview-statline > div, .allocation-bars > div, .yield-grid article, [class*="card"]'

const TEXT_SELECTOR = 'h1, h2, h3, .hero-caption, .home-hero-copy p, .home-section-header p, .page-heading p, .panel > p, .product-card p'
const TYPEWRITER_SELECTOR = '.hero-caption, .home-hero-copy p, .home-section-header p, .page-heading p, .product-page > p'

const CARD_ANIMATIONS = ['fade-up', 'zoom-in-up', 'fade-right', 'flip-up']
const TEXT_ANIMATIONS = ['fade-up', 'fade-right', 'fade-left']

const isCardLike = (element: HTMLElement) => {
  const classes = Array.from(element.classList)

  return classes.some((className) => {
    const value = className.toLowerCase()
    return value === 'card' || value.endsWith('card') || value.includes('-card') || value.includes('_card')
  })
}

const collectEligibleElements = (selector: string, minWidth: number, minHeight: number, cardMode = false) => {
  const seen = new Set<HTMLElement>()
  const elements = Array.from(document.querySelectorAll<HTMLElement>(selector))

  return elements.filter((element) => {
    if (seen.has(element)) return false
    if (element.closest('[data-aos-ignore="true"]')) return false

    const rect = element.getBoundingClientRect()
    if (rect.width < minWidth || rect.height < minHeight) return false

    if (cardMode && !isCardLike(element)) {
      const cardContainers = ['DIV', 'ARTICLE', 'SECTION', 'ASIDE', 'LI', 'FORM', 'A', 'HEADER']
      if (!cardContainers.includes(element.tagName)) return false
    }

    seen.add(element)
    return true
  })
}

const decorate = (elements: HTMLElement[], animations: string[], delayStep: number, baseDuration: number) => {
  elements.forEach((element, index) => {
    element.dataset.aos = animations[index % animations.length]
    element.dataset.aosAuto = 'true'
    element.dataset.aosDelay = String((index % 6) * delayStep)
    element.dataset.aosDuration = String(baseDuration + (index % 3) * 80)
    element.dataset.aosEasing = 'ease-out-cubic'
  })
}

export function AosEffects() {
  const pathname = usePathname()

  useEffect(() => {
    AOS.init({
      offset: 48,
      once: false,
      duration: 760,
      easing: 'ease-out-cubic',
      anchorPlacement: 'top-bottom',
    })
  }, [])

  useEffect(() => {
    const timers: number[] = []
    const intervals: number[] = []
    let observer: IntersectionObserver | null = null

    const isInViewport = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth

      return rect.bottom > 0 && rect.right > 0 && rect.top < viewportHeight * 0.92 && rect.left < viewportWidth
    }

    const applyTypewriter = () => {
      const candidates = collectEligibleElements(TYPEWRITER_SELECTOR, 140, 18).slice(0, 6)

      candidates.forEach((element, index) => {
        if (element.dataset.typewriterApplied === 'true') return

        const sourceText = element.textContent?.trim()
        if (!sourceText || sourceText.length > 180) return

        element.dataset.typewriterApplied = 'true'
        element.classList.add('typewriter-text')
        element.setAttribute('aria-label', sourceText)
        element.textContent = ''

        const typingDelay = 220 + index * 170
        const timeoutId = window.setTimeout(() => {
          let cursor = 0
          const speed = Math.max(18, Math.min(56, Math.floor(1500 / Math.max(sourceText.length, 1))))
          const intervalId = window.setInterval(() => {
            cursor += 1
            element.textContent = sourceText.slice(0, cursor)

            if (cursor >= sourceText.length) {
              window.clearInterval(intervalId)
              element.classList.remove('typewriter-text')
            }
          }, speed)

          intervals.push(intervalId)
        }, typingDelay)

        timers.push(timeoutId)
      })
    }

    const wireReentryAnimations = (targets: HTMLElement[]) => {
      if (targets.length === 0) return

      if (observer) {
        observer.disconnect()
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const element = entry.target as HTMLElement
            const inView = entry.isIntersecting && entry.intersectionRatio > 0.22

            if (inView) {
              if (element.dataset.aosInView === 'true') return
              element.dataset.aosInView = 'true'
              element.classList.remove('aos-animate')
              void element.offsetWidth
              requestAnimationFrame(() => element.classList.add('aos-animate'))
              return
            }

            element.dataset.aosInView = 'false'
            element.classList.remove('aos-animate')
          })
        },
        {
          threshold: [0, 0.22, 0.55],
          rootMargin: '0px 0px -8% 0px',
        },
      )

      targets.forEach((target) => observer?.observe(target))
    }

    const replayInitialViewportAnimations = (targets: HTMLElement[]) => {
      const initial = targets.filter(isInViewport)

      initial.forEach((element, index) => {
        element.classList.remove('aos-animate')
        element.dataset.aosInView = 'false'

        const timeoutId = window.setTimeout(() => {
          requestAnimationFrame(() => {
            element.classList.add('aos-animate')
            element.dataset.aosInView = 'true'
          })
        }, 120 + index * 75)

        timers.push(timeoutId)
      })
    }

    const applyAnimations = () => {
      const cards = collectEligibleElements(CARD_SELECTOR, 64, 26, true)
      const texts = collectEligibleElements(TEXT_SELECTOR, 70, 16)
      const targets = Array.from(new Set([...cards, ...texts]))

      decorate(cards, CARD_ANIMATIONS, 70, 720)
      decorate(texts, TEXT_ANIMATIONS, 36, 620)
      targets.forEach((target) => {
        target.dataset.aosOnce = 'false'
        target.dataset.aosAnchorPlacement = 'top-bottom'
      })
      AOS.refreshHard()
      wireReentryAnimations(targets)
      replayInitialViewportAnimations(targets)
      applyTypewriter()
    }

    applyAnimations()
    const rafId = window.requestAnimationFrame(applyAnimations)
    const timer = window.setTimeout(applyAnimations, 320)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.clearTimeout(timer)
      timers.forEach((value) => window.clearTimeout(value))
      intervals.forEach((value) => window.clearInterval(value))
      observer?.disconnect()
    }
  }, [pathname])

  return null
}
