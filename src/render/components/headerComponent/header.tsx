
import { Avatar, Button, Dropdown, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined } from '@ant-design/icons';
import "./header.css";

function HeaderComponent() {
    const navigate = useNavigate();
    const menu = (
        <Menu>
            <Menu.Item key="1">
                <a target="_blank" rel="noopener noreferrer">
                    提取照片GPS
                </a>
            </Menu.Item>
            <Menu.Item key="2">
                <a target="_blank" rel="noopener noreferrer">
                    创建缩略图
                </a>
            </Menu.Item>
            <Menu.Item key="3">
                <a target="_blank" rel="noopener noreferrer">
                    web地图保存
                </a>
            </Menu.Item>
        </Menu>
    );
    return (
        <div>
            <div>

            </div>
            <div className="header-toolbox">
                <Avatar icon={<UserOutlined />} />
                <Button onClick={() => { changeMap("/home") }}>主页面</Button>
                <Dropdown overlay={menu} placement="bottomCenter">
                    <Button>工具箱</Button>
                </Dropdown>
            </div>
        </div>
    )

    function changeMap(path: string) {
        navigate(path)
    }
}

export default HeaderComponent