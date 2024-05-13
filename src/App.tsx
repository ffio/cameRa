
import { useRef, useState } from 'react'
import { Button, Flex,Modal,Image,Space } from 'antd'
import { CameraOutlined,SwapOutlined,RotateLeftOutlined,RotateRightOutlined,ZoomOutOutlined,ZoomInOutlined,DeleteOutlined} from '@ant-design/icons';
import MediaCamera from './component/mediaCamera'
import './App.css'

function App() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cameraRef=useRef<any>(null);
  const [photo,setPhoto]=useState<any>(null);
  const { confirm } = Modal;

  const openCamera=()=>{
    setMainVisibility(false)
    cameraRef?.current?.show();
  }
  const resetCamera=()=>{
    setMainVisibility(true)
  }
  const [mainVisibility,setMainVisibility]=useState(true);

  const getPhoto=(file:any)=>{
    uploadFile(file);
  }

  const onDeletePhoto=()=>{
    cameraRef?.current?.resetFile();
    setPhoto(null);
  }

  // use img in other place
  const uploadFile=async (data:any) => {
    const config = {
      title: 'uploadFile!',
      destroyOnClose:true,
      maskClosable:false,
      content: (
        <>
          <img
          style={{width:'auto',height:'200px'}}
          alt="Screen capture will be displayed here"
          src={data}
          ></img>
        </>
      ),
      onOk() {
        // this is place to do upload
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          setPhoto(data);
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {
        cameraRef?.current?.resetFile();
      },
    };
    confirm(config);
  }

  return (
    <>
      {mainVisibility?
        <>
        <Flex style={{marginTop:'50%'}} justify={'center'} align={'center'}>
        {photo?
          <Image
            width={200}
            src={photo}
            preview={{
              toolbarRender: (
                _,
                {
                  transform: { scale },
                  actions: { onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn },
                },
              ) => (
                <Space size={18} className="toolbar-wrapper">
                  <DeleteOutlined style={{fontSize:24}} onClick={onDeletePhoto} />
                  <ZoomOutOutlined style={{fontSize:24}} disabled={scale === 1} onClick={onZoomOut} />
                  <ZoomInOutlined style={{fontSize:24}}  disabled={scale === 50} onClick={onZoomIn} />
                </Space>
              ),
            }}
          />:
          <Button type="primary" onClick={openCamera}><CameraOutlined/></Button>
        }
        </Flex>
        </>
        :null
      }
      <MediaCamera ref={cameraRef} resetCamera={resetCamera} getPhoto={getPhoto}/>
    </>
  )
}

export default App
