/** @jsxImportSource @emotion/react */

import { Input, Form, Select } from 'antd'
import { UserSelect } from 'components/user-select'
import { ChangeEvent } from 'react'
import { Project } from 'types/project'
import { User } from '../../types/user'

interface SearchPanelProps {
  users: User[]
  param: Partial<Pick<Project, 'name' | 'personId' | 'organization' | 'pin'>>
  setParam: (param: SearchPanelProps['param']) => void
}

export const SearchPanel = ({ param, setParam }: SearchPanelProps): JSX.Element => {
  return (
    <Form
      layout={'inline'}
      css={{
        marginBottom: '2rem',
        rowGap: '1.2rem',
        '.ant-form-item': {
          marginBottom: '1.2rem'
        },
        '@media (max-width: 768px)': {
          '.ant-form-item': {
            width: '100%',
            marginRight: 0
          },
          '.ant-input, .ant-select': {
            width: '100% !important'
          }
        }
      }}
    >
      <Form.Item>
        <Input
          placeholder={'项目名'}
          value={param.name}
          onChange={(evt: ChangeEvent<HTMLInputElement>) =>
            setParam({
              ...param,
              name: evt.target.value
            })
          }
          type="text"
        />
      </Form.Item>
      <Form.Item>
        <UserSelect
          defaultOptionName={'负责人'}
          value={param.personId}
          onChange={(value: number | undefined) =>
            setParam({
              ...param,
              personId: value
            })
          }
        />
      </Form.Item>
      <Form.Item>
        <Input
          placeholder={'部门'}
          value={param.organization}
          onChange={(evt: ChangeEvent<HTMLInputElement>) =>
            setParam({
              ...param,
              organization: evt.target.value
            })
          }
          type="text"
        />
      </Form.Item>
      <Form.Item>
        <Select
          style={{ width: '12rem' }}
          value={param.pin === undefined ? '' : String(param.pin)}
          onChange={value =>
            setParam({
              ...param,
              pin: value === '' ? undefined : value === 'true'
            })
          }
        >
          <Select.Option value={''}>全部项目</Select.Option>
          <Select.Option value={'true'}>已收藏</Select.Option>
          <Select.Option value={'false'}>未收藏</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  )
}
