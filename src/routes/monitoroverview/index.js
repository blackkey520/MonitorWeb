import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Radio, Select, Cascader, Input } from 'antd'
import { Page } from 'components'
import { routerRedux } from 'dva/router'
import city from '../../utils/city'
import moment from 'moment'

const bodyStyle = {
  bodyStyle: {
    height: 432,
    background: '#fff',
  },
}
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const Option = Select.Option
const InputGroup = Input.Group
const Search = Input.Search
function MonitorOverview ({ dispatch, monitoroverview, loading, app, location }) {
  const { query = {}, pathname } = location
  const { pollutanttype } = app
  const listProps = {
    dataSource: monitoroverview.data,
    columns: monitoroverview.columns,
    loading: loading.effects['monitoroverview/querydata'],
    pagination: false,
    scroll: {
      y: monitoroverview.data.length * 45,
      x: monitoroverview.columns.length * 100,
    },
    bordered: true,
  }
  return (
    <Page loading={loading.models.dashboard && sales.length === 0}>
      <InputGroup compact >
        <RadioGroup onChange={({ target }) => {
          let time = moment().format('YYYY-MM-DD HH:mm:ss')
          if (moment().minute() < 10) {
            time = moment().add(-1, 'hours').format('YYYY-MM-DD HH:mm:ss')
          }
          dispatch(routerRedux.push({
            pathname,
            payload: {
              ...query,
              searchTime: time,
              monitortype: target.value,
            },
          }))
        }} defaultValue="realtime" size="default" style={{ marginLeft: 10 }}
        >
          <RadioButton value="realtime"> 实时 </RadioButton>
          <RadioButton value="minute"> 分钟 </RadioButton>
          <RadioButton value="hour"> 小时 </RadioButton>
          <RadioButton value="day"> 日均 </RadioButton>
        </RadioGroup>
        <Cascader options={city}placeholder="请选择行政区" style={{ width: 250, marginLeft: 10 }} />
        <Select onChange={(value) => {
          dispatch(routerRedux.push({
            pathname,
            payload: {
              ...query,
              pollutantType: value,
            },
          }))
        }} defaultValue={pollutanttype[0].Name} size="default" style={{ width: 70, marginLeft: 10 }}
        >
          {
              pollutanttype.map((item, key) => {
                return <Option key={key} value={item.ID}>{item.Name}</Option>
              })
          }
        </Select>

        <Search
          placeholder="输入条件模糊搜索"
          style={{ width: 270 }}
          onSearch={value => console.log(value)}
        />
      </InputGroup>
      <Table {...listProps} />
    </Page>
  )
}

MonitorOverview.propTypes = {
  dashboard: PropTypes.object,
  loading: PropTypes.object,
}

export default connect(({ monitoroverview, loading, app }) => ({ monitoroverview, loading, app }))(MonitorOverview)
