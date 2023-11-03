'use client'
import React, { useCallback } from 'react'
import styles from './Carousel.module.css'
// External Libraries
import useEmblaCarousel from 'embla-carousel-react'
import {FaLongArrowAltLeft, FaLongArrowAltRight} from 'react-icons/fa';

interface CarouselProps {
    children: any,
}

export const Carousel = ({children}: CarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel()
  
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className={styles.embla}>
        {/* <FaLongArrowAltLeft className={styles.arrow_left} onClick={scrollPrev} /> */}
        <div className={styles.embla__viewport} ref={emblaRef}>
            <div className={styles.embla__container}>
                {children}
            </div>
        </div> 
        {/* <FaLongArrowAltRight className={styles.arrow_right} onClick={scrollNext}/> */}
    </div>
  )
}

