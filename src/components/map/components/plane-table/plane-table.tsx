import { useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { useShowPlanes, useShowPlaneTable } from '~/hooks/local-storage'
import { useScrambler } from '~/hooks/useScrambler'
import { useStore } from '~/lib/stores'
import type { TablePlane } from '~/lib/types'
import { tableScrambleAttr } from './constants'
import { PlaneTableCore } from './plane-table-core'

export default function PlaneTable({ data }: { data: TablePlane[] }) {
  const isPlaneTableFrozen = useStore((s) => s.isPlaneTableFrozen)

  useScrambler(tableScrambleAttr, isPlaneTableFrozen)

  const [showPlaneTable] = useShowPlaneTable()
  const [showPlanes] = useShowPlanes()

  const [isFirstRender, setIsFirstRender] = useState<boolean>(true)
  useEffect(() => {
    setIsFirstRender(false)
  }, [])

  return (
    <AnimatePresence>
      {showPlaneTable && (
        <m.div
          initial={isFirstRender ? { x: 0 } : { x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ ease: 'easeInOut', duration: 0.2 }}
          className="table:block absolute top-0 right-0 z-10 hidden h-full w-180 bg-black/80"
          aria-label="a table showing all the planes in view"
        >
          {data.length && showPlanes ? (
            <PlaneTableCore data={data} />
          ) : (
            <div
              {...{ [tableScrambleAttr]: 'no planes in view' }}
              className="flex h-full items-center justify-center"
            >
              no planes in view
            </div>
          )}
          {/*prevents scroll*/}
          {isPlaneTableFrozen && <div className="absolute inset-0" />}
        </m.div>
      )}
    </AnimatePresence>
  )
}
