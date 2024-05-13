
import { useRef, useState } from 'react'
import { Button, Flex } from 'antd'
import { CameraOutlined} from '@ant-design/icons';
import MediaCamera from './component/mediaCamera'
import './App.css'

function App() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cameraRef=useRef<any>(null);
  const openCamera=()=>{
    setMainVisibility(false)
    cameraRef?.current?.show();
  }
  const resetCamera=()=>{
    setMainVisibility(true)
  }
  const [mainVisibility,setMainVisibility]=useState(true);

  return (
    <>
      {mainVisibility?
        <Flex style={{marginTop:'50%'}} justify={'center'} align={'center'}>
          <Button type="primary" onClick={openCamera}><CameraOutlined/></Button>
        </Flex>:null
      }
      <MediaCamera ref={cameraRef} resetCamera={resetCamera}/>
    </>
  )
}

export default App
