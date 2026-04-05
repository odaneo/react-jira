import React from 'react'
import { useEpics } from 'utils/epic'
import { IdSelect } from './id-select'

export const EpicSelect = ({ projectId, ...props }: { projectId: number } & React.ComponentProps<typeof IdSelect>) => {
  const { data: epics } = useEpics({ projectId })
  return <IdSelect options={epics || []} {...props} />
}
