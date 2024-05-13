
import { Button, Flex } from 'antd'
import MediaCamera from './component/mediaCamera'
import { useRef, useState } from 'react'
import './App.css'

function App() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cameraRef=useRef<any>(null);
  const openCamera=()=>{
    setMainVisibility(false)
    cameraRef?.current?.show();
  }
  const [mainVisibility,setMainVisibility]=useState(true);

  return (
    <>
      {mainVisibility?
        <Flex style={{marginTop:'50%'}} justify={'center'} align={'center'}>
          <Button type="primary" onClick={openCamera}>拍照</Button>
        </Flex>:null
      }
      <MediaCamera ref={cameraRef}/>
    </>
  )
}

export default App
