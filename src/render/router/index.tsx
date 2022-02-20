import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import App from '../page/App';

import { app_name } from '../config/index';
import HomeRouter from './homeRouter';

function MainRouter(props: any) {
    return (
        <HashRouter>
            <Routes>
                {/* exact 表示url匹配整个path而不是拦截所有以path开头的url */}
                <Route path='/' element={<App />}>
                </Route>
                <Route path="/home/*" element={<HomeRouter />}>
                </Route>
            </Routes>
        </HashRouter>
    )
}

export default MainRouter