export interface Epic {
  id: number
  name: string
  projectId?: number
  start?: number
  end?: number
  description?: string
  created?: number
  ownerId?: number
  deleted?: boolean
}
