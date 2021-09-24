import { PeerHandler, ScreenHandler, MediaHandler, isMobile } from "./utils.js";
import { io } from 'socket.io-client'

const mediaConstraints = {
  audio: false,
  video: {
    width: {
      ideal: 1280,
      min: 640,
      max: 1920,
    },
    height: {
      ideal: 720,
      min: 360,
      max: 1080,
    },
    frameRate: {
      ideal: 60,
    },
    // Select the front/user facing camera or the rear/environment facing camera if available (on Phone)
    facingMode: 'user',
  },
};

let screenHandler, mediaHandler, peerHandler, stream
let roomId = 't0dd'
let remoteUserId = null
let userId = `user${parseInt(Math.random() * 10000).toString(16)}`
let socket = null

export async function initialize(b) {
  socket = io('localhost:4444', { transports: ["websocket"], rejectUnauthorized: false })
  socket.on('connect_error', console.error)
  socket.on('connect', console.log)
  socket.onAny(console.log)

  screenHandler = new ScreenHandler();
  mediaHandler = new MediaHandler();
  peerHandler = new PeerHandler({ send });

  bindDomEvent();
  bindSocketEvent();
  bindPeerEvent();

  if(b === true) stream = await screenHandler.start();
}

export function onDetectUser() {
  console.log('onDetectUser');

  document.querySelector('.interface').innerHTML = `<button id="btn-join">Join</button>`;
  document.querySelector('#btn-join').addEventListener('click', handleJoinRoom);
}

/**
 * 참석자 핸들링
 * @param roomId
 * @param userList
 */
export function onJoin(roomId, { userInfo, participants }) {
  console.log('onJoin', roomId, userInfo, participants);

  if (Object.size(participants) >= 2) {
    onDetectUser();
  }
}

/**
 * 이탈자 핸들링
 * @param userId
 */
export function onLeave({ userInfo }) {
  console.log('onLeave', arguments);

  if (remoteUserId === userInfo.userId) {
    document.querySelector('#remote-video').remove();
    $body.classList.remove('connected');
    $body.classList.add('wait');
    remoteUserId = null;
  }
}

/**
 * 소켓 메세지 핸들링
 * @param data
 */
export function onMessage(data) {
  console.log('onMessage', arguments);

  if (!remoteUserId) {
    remoteUserId = data.sender;
  }

  if (data.sdp || data.candidate) {
    peerHandler.signaling(data);
  } else {
    // etc
  }
}

export function send(data) {
  console.log('send', arguments);

  data.roomId = roomId;
  data.sender = userId;
  socket.send(data);
}

export function onLocalStream() {
  console.log('onLocalStream', stream);

  mediaHandler.setVideoStream({
    type: 'local',
    el: document.querySelector('video'),
    stream: stream,
  });

  if (isMobile && isSafari) {
    mediaHandler.playForIOS(document.querySelector('video'));
  }
}

export function onRemoteStream(stream) {
  console.log('onRemoteStream', stream);

  const remoteVideo = document.querySelector('#remote')

  mediaHandler.setVideoStream({
    type: 'remote',
    el: remoteVideo,
    stream: stream,
  });

  if (isMobile && isSafari) {
    mediaHandler.playForIOS(remoteVideo);
  }
}

/**
 * 카메라 이벤트 처리
 */
export function handleCameraButton(e) {
  const $this = e.target;
  $this.classList.toggle('active');
  mediaHandler[$this.className === 'active' ? 'pauseVideo' : 'resumeVideo']();
}

/**
 * 오디오 이벤트 처리
 */
export function handleMicButton(e) {
  const $this = e.target;
  $this.classList.toggle('active');
  mediaHandler[$this.className === 'active' ? 'muteAudio' : 'unmuteAudio']();
}

/**
 * 방장 시작 처리
 */
export async function handleStartRoom() {
  try {
    // const stream = await peerHandler.getUserMedia(mediaConstraints);
    // onLocalStream(stream);
  } catch (error) {
    console.error('handleStartRoom :>> ', error);
  }
}

/**
 * 참석자 참여 처리
 */
export async function handleJoinRoom() {
  try {
    // const stream = await peerHandler.getUserMedia(mediaConstraints);
    // onRemoteStream(stream);
    // onLocalStream(stream);
    peerHandler.startRtcConnection();
  } catch (error) {
    console.error('handleJoinRoom :>> ', error);
  }
}

/**
 * DOM 이벤트 바인딩
 */
export function bindDomEvent() {
  function existOrCreate(id) {
    if(document.querySelector(`#${id}`) !== null) {
      return document.querySelector(`#${id}`)
    } else {
      let dom = document.createElement('button')
      dom.id = id;
      dom.innerHTML = id
      dom.style.width = '100%'
      dom.style.margin = '4px 0'
      document.querySelector('.interface').appendChild(dom)

      return dom
    }
  }

  existOrCreate('btn-start').addEventListener('click', handleStartRoom);
  existOrCreate('btn-camera').addEventListener('click', handleCameraButton);
  existOrCreate('btn-mic').addEventListener('click', handleMicButton);
  existOrCreate('btn-change-resolution')?.addEventListener('click', peerHandler.changeResolution);
}

/**
 * 웹소켓 이벤트 바인딩
 */
export function bindSocketEvent() {
  socket.emit('enter', roomId, { userId });
  socket.on('join', onJoin);
  socket.on('leave', onLeave);
  socket.on('message', onMessage);
}

/**
 * peer 이벤트 바인딩
 */
export function bindPeerEvent() {
  peerHandler.on('addRemoteStream', onRemoteStream);
}