import React from 'react'
import ReactDOM from 'react-dom'
import Router from './router'

import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';

moment.locale('zh-cn');

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <React.StrictMode>
      <Router />
    </React.StrictMode>
  </ConfigProvider>,
  document.getElementById('root')
)
