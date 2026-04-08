import { Table, TableProps } from 'antd'
import { User } from 'types/user'

type PersonRow = Pick<User, 'id' | 'name' | 'organization'>

type ListProps = TableProps<PersonRow>

export const List = ({ ...props }: ListProps) => {
  return (
    <Table<PersonRow>
      pagination={false}
      rowKey={'id'}
      locale={{ emptyText: 'No people found.' }}
      columns={[
        {
          title: 'Name',
          dataIndex: 'name'
        },
        {
          title: 'Organization',
          dataIndex: 'organization',
          render(value: PersonRow['organization']) {
            return value || '—'
          }
        }
      ]}
      {...props}
    />
  )
}
