/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, useState,useImperativeHandle,useRef } from 'react';
import { FloatButton,Image } from 'antd';
import adapter from 'webrtc-adapter';
import { CameraOutlined,CheckOutlined,CloseOutlined,RollbackOutlined} from '@ant-design/icons';

interface BaseProps {
  resetCamera?:any;
  getPhoto?:any;
  [key: string]: any;
}
const MediaCamera = forwardRef((props:BaseProps,ref)=>{
  console.log('props :>> ', adapter.browserDetails);
  const{resetCamera,getPhoto}=props;
  const CAMERA_CONFIG={video: {
    facingMode: 'environment',
    width: {min:320,max:1280},
    height: {min:240,max:720}
  }, audio: false};
  const [visibility,setVisibility]=useState(false);
  const videoRef=useRef<any>(null);
  const [file,setFile]=useState<any>(null);


  useImperativeHandle(ref, () => ({
    show,hide,getFile,resetFile,
  }));
  const show=()=>{
    setVisibility(true);
    detectiveCam();
  }
  const hide=()=>{
    setVisibility(false);
  }
  const resetFile=()=>{
    setFile(null);
  }
  // backward shotPage
  const backward=()=>{
    hide();
    resetCamera();
  }
  const getFile=()=>{
    return file;
  }
  // call the mediaAuth
  async function detectiveCam(){
    try {
      const curr_stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONFIG);
      if(videoRef){
        videoRef.current.srcObject = curr_stream;
      }
    } catch (err) {
      alert("Media access denied");
      backward();
    }
  }
  // do shot
  const shot=()=>{
    setFile(imageCapture());
  }


  // get Shot frame
  const imageCapture = () => {
    try {
      const videoElem = videoRef.current;
      if (!videoElem) throw Error("Video HTML element not defined");
      const mediaStream = videoElem.srcObject as MediaStream;
      if (!mediaStream) throw Error("Video MediaStream not defined");
      const track = mediaStream.getVideoTracks()[0];
      const image = generateImageWithCanvas(track, videoElem);
      mediaStream.getTracks().forEach((track) => track.stop());
      return image;
    } catch (error) {
      console.error("imageCapture error: " + error);
    }
  }
  // rend  frame in canvas
  const generateImageWithCanvas = (
    track: MediaStreamTrack,
    videoElem: HTMLVideoElement
  ) => {
    const canvas = document.createElement("canvas");
    const { width, height } = track.getSettings();
    canvas.width = width || 100;
    canvas.height = height || 100;
    canvas.getContext("2d")?.drawImage(videoElem, 0, 0);
    const image = canvas.toDataURL("image/png");
    return image;
  };
  // re-shot
  const reShot=()=>{
    setFile(null);
    detectiveCam();
  }

  // confirm Photo

  const comfirmPhoto=()=>{
    getPhoto(file);
    backward();
  }



  return (
    visibility?(
        <div style={{height:'100vh'}}>
          <video  ref={videoRef} playsInline autoPlay width={'100%'} height={'100%'} style={{display:file?'none':'block',objectFit: 'cover'}}/>
          {file?
            <>
              {/* <img
                style={{width:'100%',height:'auto'}}
                className="Frame"
                alt="Screen capture will be displayed here"
                src={file}
              ></img> */}
              <Image src={file}/>
              <FloatButton.Group shape="circle" style={{ right: 24 }}>
                <FloatButton icon={<CheckOutlined />} onClick={comfirmPhoto}/>
                <FloatButton icon={<CloseOutlined/>} onClick={reShot}/>
                <FloatButton icon={<RollbackOutlined/>} onClick={()=>{
                  setFile(null);
                  backward()
                }}/>
              </FloatButton.Group>
            </>
            :
            <FloatButton icon={<CameraOutlined/>} onClick={shot}/>
          }
        </div>
    ):null
  )
})

export default MediaCamera;
