import { Table, TableProps } from 'antd'
import { Link } from 'react-router-dom'
import { User } from 'types/user'

type PersonRow = Pick<User, 'id' | 'name' | 'organization'>

type ListProps = TableProps<PersonRow>

export const List = ({ ...props }: ListProps) => {
  return (
    <Table<PersonRow>
      pagination={false}
      rowKey={'id'}
      locale={{ emptyText: '暂无成员数据' }}
      columns={[
        {
          title: '姓名',
          dataIndex: 'name',
          render(value: PersonRow['name'], person: PersonRow) {
            return <Link to={`/people/${person.id}`}>{value}</Link>
          }
        },
        {
          title: '组织',
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
