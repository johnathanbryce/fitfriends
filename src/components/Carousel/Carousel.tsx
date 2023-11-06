'use client'
import React, { useCallback } from 'react'
import styles from './Carousel.module.css'

// External Libraries
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import {IoIosArrowBack, IoIosArrowForward} from 'react-icons/io'

interface CarouselProps {
    children: any,
}

export const Carousel = ({children}: CarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({loop: true}, [Autoplay()])
  
  

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className={styles.embla}>    
        <div className={styles.arrow_wrapper}  onClick={scrollPrev}>
          <IoIosArrowBack className={styles.arrow} />
        </div>
        <div className={styles.arrow_wrapper} onClick={scrollNext}>
            <IoIosArrowForward className={styles.arrow} />
        </div>   
        <div className={styles.embla__viewport} ref={emblaRef}>
            <div className={styles.embla__container}>
                {children}
            </div>
        </div> 
    </div>
  )
}

