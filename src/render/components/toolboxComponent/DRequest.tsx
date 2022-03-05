import { Button, Modal } from "antd"
import { ChangeEvent, useState } from "react"
import service from "../../services/axios";


function DRequest() {
    const titles = ["测试GET请求", "测试POST请求", "测试文件与参数"]
    const [showUpload, setShowUpload] = useState(false);
    const [uploadFile, setUploadFile] = useState<File>()
    const [paramList, setParamList] = useState([
        { id: 0, name: "", value: "" }
    ])
    const [urlPath, setUrlPath] = useState("");
    const [modelTitle, setModelTitle] = useState(titles[0])
    const [requestType, setRequestType] = useState(0);
    const [fileParamName, setFileParamName] = useState();
    return (
        <div>
            <div>
                {
                    titles.map((title, index) => {
                        return <Button key={index} onClick={() => { showModel(title, index) }}>{title}</Button>
                    })
                }
            </div>
            <Modal
                visible={showUpload}
                title={modelTitle}
                onOk={sendRequest}
                onCancel={() => {
                    setShowUpload(false)
                }}>
                <div>
                    <div>
                        <span>url地址：<input onChange={changeValue} value={urlPath}></input></span>
                    </div>
                    {
                        requestType !== 0 &&
                        <div>
                            <Button onClick={addParam}>增加参数</Button>
                            {
                                paramList.map((param) => {
                                    return <div key={param.id}>
                                        <input placeholder="param name" value={param.name}
                                            onChange={(e) => { changeParam(param.id, e.target.value, "name") }} />
                                        <input placeholder="param value" value={param.value}
                                            onChange={(e) => { changeParam(param.id, e.target.value, "value") }}></input>
                                        <Button onClick={() => deleteParam(param.id)}>删除</Button>
                                    </div>
                                })
                            }
                        </div>
                    }
                    {
                        requestType === 2 &&
                        <div>
                            <input placeholder="文件参数名" value={fileParamName} onChange={changeValue} />
                            <input id="toolboxUploadFile" type="file" onChange={changeFile}></input>
                        </div>
                    }
                </div>
            </Modal>
        </div>
    )

    /**
     * 测试不同的http请求
     */
    function sendRequest() {
        switch (requestType) {
            case 0:
                getRequest()
                break
            case 1:
                postRequest()
                break
            case 2:
                postFileAndParam()
                break
        }
    }

    function getRequest() {

    }

    function postRequest() {
        let params: any = {}
        paramList.map((param) => {
            if (param.name.trim().length > 0 && param.value.trim().length > 0) {
                params[param.name] = param.value;
            }
        })
        service.post(urlPath, params).then(result => {
            console.log(result);

        }).catch(error => {
            console.log(error);
        })
    }

    /**
     * 通过post请求发送文件与参数
     */
    function postFileAndParam() {
        if (uploadFile) {
            let fileParam = new FormData()
            fileParam.append("file", uploadFile);
            let params: any = {}
            paramList.map((param) => {
                if (param.name.trim().length > 0 && param.value.trim().length > 0) {
                    params[param.name] = param.value;
                }
            })
            fileParam.append("softwarePackage", JSON.stringify(params))

            service.post(urlPath, fileParam).then(result => {
                console.log(result);

            }).catch(error => {
                console.log(error);

            })
        }

        setShowUpload(false)
    }

    /**
     * 显示对话框
     * @param title model标题
     */
    function showModel(title: string, requestType: number) {
        setShowUpload(true)
        setModelTitle(title)
        setRequestType(requestType)
    }

    /**
     * 修改请求url
     * @param e 
     */
    function changeValue(e: any) {
        setUrlPath(e.target.value)
    }

    function changeParam(paramId: number, value: string, paramType: string) {
        let newParamList: any = []
        paramList.map((param) => {
            if (param.id === paramId) {
                if (paramType === "name") {
                    param.name = value
                } else {
                    param.value = value
                }
            }
            newParamList.push(param)
        })
        setParamList(newParamList);
    }

    /**
     * 增加参数
     */
    function addParam() {
        let newParamList = Object.assign([], paramList)
        newParamList.push({
            id: newParamList.length,
            name: "",
            value: ""
        })
        setParamList(newParamList)
    }

    /**
     * 删除参数
     * @param paramId 
     */
    function deleteParam(paramId: number) {
        let newParamList: any = []
        let paramIndex = 0
        paramList.map((param) => {
            if (param.id !== paramId) {
                param.id = paramIndex
                newParamList.push(param)
                paramIndex++;
            }
        })
        setParamList(newParamList)
    }

    /**
     * 选择文件
     * @param e 
     */
    function changeFile(e: ChangeEvent) {
        let target: any = e.target
        if (target.files.length > 0) {
            console.log(target.files[0]);
            setUploadFile(target.files[0])
        }
    }


}
export default DRequest