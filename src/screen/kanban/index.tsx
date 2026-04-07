import { useDocumentTitle } from 'utils'
import { useKanbans, useReorderKanban } from 'utils/kanban'
import {
  useKanbanQueryKey,
  useKanbanSearchParams,
  useProjectInUrl,
  useTasksQueryKey,
  useTasksSearchParams
} from './util'
import { KanbanColumn } from './kanban-column'
import styled from '@emotion/styled'
import { SearchPanel } from './search-panel'
import { Row, ScreenContainer } from 'components/libs'
import { useReorderTask, useTasks } from 'utils/task'
import { Spin } from 'antd'
import { CreateKanban } from './create-kanban'
import { TaskModal } from './task-modal'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { Drag, Drop, DropChild } from 'components/drag-and-drag'
import { useCallback } from 'react'

export const KanbanScreen = () => {
  useDocumentTitle('看板列表')

  const { data: kanbans, isLoading: kanbanIsLoading } = useKanbans(useKanbanSearchParams())
  const { data: currentProject } = useProjectInUrl()

  const { isLoading: taskIsLoading } = useTasks(useTasksSearchParams())

  const isLoading = taskIsLoading || kanbanIsLoading
  const onDragEnd = useDragEnd()

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <ScreenContainer>
        <PageHeader between={true} marginBottom={2}>
          <h1>{currentProject?.name}看板</h1>
        </PageHeader>
        <SearchPanel />
        {isLoading ? (
          <Spin size={'large'} />
        ) : (
          <ColumnsContainer>
            <Drop type={'COLUMN'} direction={'horizontal'} droppableId={'kanban'}>
              <DropChild style={{ display: 'flex' }}>
                {kanbans?.map((kanban, index) => (
                  <Drag key={kanban.id} draggableId={'kanban' + kanban.id} index={index}>
                    <KanbanColumn kanban={kanban} key={kanban.id} />
                  </Drag>
                ))}
              </DropChild>
            </Drop>
            <CreateKanban />
          </ColumnsContainer>
        )}
        <TaskModal />
      </ScreenContainer>
    </DragDropContext>
  )
}

export const useDragEnd = () => {
  const { data: kanbans } = useKanbans(useKanbanSearchParams())

  const { mutate: reorderKanban } = useReorderKanban(useKanbanQueryKey())
  const { mutate: reorderTask } = useReorderTask(useTasksQueryKey())

  const { data: allTasks = [] } = useTasks(useTasksSearchParams())
  return useCallback(
    ({ source, destination, type }: DropResult) => {
      if (!destination) {
        return
      }
      if (type === 'COLUMN') {
        const fromId = kanbans?.[source.index].id
        const toId = kanbans?.[destination.index].id
        if (!fromId || !toId || fromId === toId) {
          return
        }
        const dragType = destination.index > source.index ? 'after' : 'before'

        reorderKanban({ fromId, referenceId: toId, type: dragType })
      }
      if (type === 'ROW') {
        const fromKanbanId = +source.droppableId
        const toKanbanId = +destination.droppableId

        if (fromKanbanId === toKanbanId) {
          return
        }

        const fromTask = allTasks.filter(task => task.kanbanId === fromKanbanId)[source.index]
        const toTask = allTasks.filter(task => task.kanbanId === toKanbanId)[destination.index]
        if (fromTask?.id === toTask?.id) {
          return
        }
        reorderTask({
          fromId: fromTask?.id,
          referenceId: toTask?.id,
          fromKanbanId,
          toKanbanId,
          type: fromKanbanId === toKanbanId && destination.index > source.index ? 'after' : 'before'
        })
      }
    },
    [allTasks, kanbans, reorderKanban, reorderTask]
  )
}

const PageHeader = styled(Row)`
  min-height: 4.8rem;
`

export const ColumnsContainer = styled.div`
  display: flex;
  overflow-x: auto;
  flex: 1;
  gap: 1.6rem;
  padding: 0.4rem 0.4rem 1.2rem;

  @media (max-width: 768px) {
    padding-bottom: 0.8rem;
  }
`
