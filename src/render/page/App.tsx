import { useNavigate } from 'react-router-dom';

import './App.css'

function App() {
  const navigate = useNavigate();

  return (
    <div className="App">   
      <div className='app-contain'>

        <span className="title">
          Clean 通用应用平台
        </span>
        <div className="doc">
          <p>
            采用electron+react+antd构建桌面系统
          </p>
        </div>
        <div className="login-input">
          <div className="login-input-info"> 用户名: <input placeholder="请输入用户名" /></div>
          <div className="login-input-info"> 密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码:
            <input
              type="password"
              placeholder="请输入密码"
            />
          </div>
          <button onClick={login}>登录系统</button>
          </div>
      </div>
    </div>
  )
  function login() {
    navigate("/home")
  }
}

export default App