export interface Task {
  id: number
  name: string
  projectId?: number
  processorId?: number
  reporterId?: number
  kanbanId?: number
  epicId?: number
  typeId?: number
  tags?: number[]
  favorite?: boolean
  note?: string
  created?: number
  ownerId?: number
  deleted?: boolean
}
