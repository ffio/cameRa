/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef, useState,useImperativeHandle,useRef, useMemo } from 'react';
import { FloatButton } from 'antd';

const MediaCamera = forwardRef((props,ref)=>{
  const CAMERA_CONFIG={video: {
    facingMode: 'environment',
    width: 750, height: 1080
  }, audio: false};
  const [visibility,setVisibility]=useState(false);
  const videoRef=useRef<any>(null);
  // const [stream,setStream]=useState<any>(null);
  const [file,setFile]=useState(null);

  useImperativeHandle(ref, () => ({
    show,hide
  }));
  const show=()=>{
    setVisibility(true);
    detectiveCam();
  }
  const hide=()=>{
    setVisibility(false);
  }
  // 调用相机授权
  async function detectiveCam(){
    try {
      const curr_stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONFIG);
      if(videoRef){
        videoRef.current.srcObject = curr_stream;
        // setStream(curr_stream);
      }
    } catch (err) {
      alert("false")
    }
  }
  // 拍照
  const shot=()=>{
    setFile(imageCapture());
  }

  // 获取图片
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
  // 渲染图片
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
  // 重拍
  const reShot=()=>{
    console.log("reShot");
    setFile(null);
    detectiveCam();
  }


  return (
    visibility?(
        <div style={{height:'100vh'}}>
          <video  ref={videoRef} playsInline autoPlay width={'100%'} style={{visibility:file?'hidden':'visible'}}/>
          {file?
            <>
              <img
                style={{width:'100%',height:'auto'}}
                className="Frame"
                alt="Screen capture will be displayed here"
                src={file}
              ></img>
              <FloatButton.Group shape="square" style={{ right: 24 }}>
                <FloatButton description={"OK"} />
                <FloatButton description={"RE"} onClick={reShot}/>
              </FloatButton.Group>
            </>
            :
            <FloatButton shape="square" description={"shot"} onClick={shot}/>
          }
        </div>
    ):null
  )
})

export default MediaCamera;
