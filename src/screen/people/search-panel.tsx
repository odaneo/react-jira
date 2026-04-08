/** @jsxImportSource @emotion/react */

import { Form, Input } from 'antd'
import { ChangeEvent } from 'react'
import { User } from 'types/user'

interface SearchPanelProps {
  param: Partial<Pick<User, 'name' | 'organization'>>
  setParam: (param: SearchPanelProps['param']) => void
}

export const SearchPanel = ({ param, setParam }: SearchPanelProps) => {
  return (
    <Form
      layout={'inline'}
      css={{
        rowGap: '1.2rem',
        '.ant-form-item': {
          marginBottom: 0
        },
        '@media (max-width: 768px)': {
          display: 'grid',
          '.ant-form-item': {
            width: '100%'
          }
        }
      }}
    >
      <Form.Item>
        <Input
          placeholder={'按姓名搜索'}
          value={param.name}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setParam({
              ...param,
              name: event.target.value
            })
          }
        />
      </Form.Item>

      <Form.Item>
        <Input
          placeholder={'按组织筛选'}
          value={param.organization}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setParam({
              ...param,
              organization: event.target.value
            })
          }
        />
      </Form.Item>
    </Form>
  )
}
