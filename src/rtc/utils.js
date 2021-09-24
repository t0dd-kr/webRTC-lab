Object.size = function (obj) {
  let size = 0;

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      size++;
    }
  }
  return size;
};

export const RTCPeerConnection =
  window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
export const RTCSessionDescription =
  window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
export const RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;

export const getDefaultIceServers = () => [
  {
    urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
  },
  {
    urls: ['turn:107.150.19.220:3478'],
    credential: 'turnserver',
    username: 'subrosa',
  },
];

export const browserVersion = DetectRTC.browser.version;
export const isMobile = DetectRTC.isMobileDevice;
export const isFirefox = DetectRTC.browser.isFirefox;
export const isChrome = DetectRTC.browser.isChrome;
export const isOpera = DetectRTC.browser.isOpera;
export const isEdge = DetectRTC.browser.isEdge && browserVersion >= 15063; // edge 15버전 이상
export const isSafari = DetectRTC.browser.isSafari && browserVersion >= 11; // safari 11버전
export const isSupportedBrowser = isFirefox || isChrome || isOpera || isEdge || isSafari;
export const checkHasWebCam = () => DetectRTC.hasWebcam;
export const changeHTTPS = () => {
  if (location.protocol === 'http:') {
    location.protocol = 'https:';
  }
};

/**
 * inherit
 * @param {object} Parent
 * @param {object} Child
 *
 */
 export const inherit = (function(Parent, Child) {
  const F = function() {};
  return function(Parent, Child) {
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.super = Parent.prototype;
  };
})();

/**
 * Light EventEmitter. Ported from Node.js/events.js
 * Eric Zhang
 */

/**
 * EventEmitter class
 * Creates an object with event registering and firing methods
 */
export function EventEmitter() {
  // Initialise required storage variables
  this._events = {};
}

var isArray = Array.isArray;

EventEmitter.prototype.addListener = function(type, listener, scope, once) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, typeof listener.listener === 'function' ?
    listener.listener : listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // If we've already got an array, just append.
    this._events[type].push(listener);

  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }
  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener, scope) {
  if ('function' !== typeof listener) {
    throw new Error('.once only takes instances of Function');
  }

  var self = this;
  function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  };

  g.listener = listener;
  self.on(type, g);

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener, scope) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var position = -1;
    for (var i = 0, length = list.length; i < length; i++) {
      if (list[i] === listener ||
        (list[i].listener && list[i].listener === listener))
      {
        position = i;
        break;
      }
    }

    if (position < 0) return this;
    list.splice(position, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (list === listener ||
    (list.listener && list.listener === listener))
  {
    delete this._events[type];
  }

  return this;
};


EventEmitter.prototype.off = EventEmitter.prototype.removeListener;


EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

EventEmitter.prototype.emit = function(type) {
  var type = arguments[0];
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var l = arguments.length;
        var args = new Array(l - 1);
        for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var l = arguments.length;
    var args = new Array(l - 1);
    for (var i = 1; i < l; i++) args[i - 1] = arguments[i];

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;
  } else {
    return false;
  }
};

export function ScreenHandler() {
  console.log('Loaded ScreenHandler', arguments);

  // REF https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#Properties_of_shared_screen_tracks
  const constraints = {
    audio: true,
    video: {
      width: 1980, // 최대 너비
      height: 1080, // 최대 높이
      frameRate: 60, // 최대 프레임
    },
  };
  let localStream = null;

  /**
   * 스크린캡쳐 API를 브라우저 호환성 맞게 리턴합니다.
   * navigator.mediaDevices.getDisplayMedia 호출 (크롬 72 이상 지원)
   * navigator.getDisplayMedia 호출 (크롬 70 ~ 71 실험실기능 활성화 or Edge)
   */
  function getCrossBrowserScreenCapture() {
    if (navigator.getDisplayMedia) {
      return navigator.getDisplayMedia(constraints);
    } else if (navigator.mediaDevices.getDisplayMedia) {
      return navigator.mediaDevices.getDisplayMedia(constraints);
    }
  }

  /**
   * 스크린캡쳐 API를 호출합니다.
   * @returns localStream
   */
  async function start() {
    try {
      localStream = await getCrossBrowserScreenCapture();
    } catch (err) {
      console.error('Error getDisplayMedia', err);
    }

    return localStream;
  }

  /**
   * 스트림의 트렉을 stop()시켜 스트림이 전송을 중지합니다.
   */
  function end() {
    localStream.getTracks().forEach((track) => {
      track.stop();
    });
  }

  /**
   * extends
   */
  this.start = start;
  this.end = end;
}

/**
 * MediaHandler
 * @constructor
 */
export function MediaHandler() {
  console.log('Loaded MediaHandler', arguments);

  let localStream;

  /**
   * 비디오 엘리먼트에 재생을 위해 stream 바인딩 한다
   * @param data
   */
  function setVideoStream(data) {
    const type = data.type;
    const targetEl = data.el;
    const stream = data.stream;

    targetEl.srcObject = stream;

    if (type === 'local') {
      localStream = stream;
    }
  }

  /**
   * 비디오 정지
   * @param callback
   */
  function pauseVideo(callback) {
    console.log('pauseVideo', arguments);
    localStream.getVideoTracks()[0].enabled = false;
    callback && callback();
  }

  /**
   * 비디오 정지 해제
   * @param callback
   */
  function resumeVideo(callback) {
    console.log('resumeVideo', arguments);
    localStream.getVideoTracks()[0].enabled = true;
    callback && callback();
  }

  /**
   * 오디오 정지
   * @param callback
   */
  function muteAudio(callback) {
    console.log('muteAudio', arguments);
    localStream.getAudioTracks()[0].enabled = false;
    callback && callback();
  }

  /**
   * 오디오 정지 해제
   * @param callback
   */
  function unmuteAudio(callback) {
    console.log('unmuteAudio', arguments);
    localStream.getAudioTracks()[0].enabled = true;
    callback && callback();
  }

  /**
   * IOS 11이상 비디오 컨트롤 인터페이스가 있어야 실행이 된다.
   * 속성을 추가했다 제거하는 트릭으로 자동 재생되도록 한다.
   * @param videoEl
   */
  function playForIOS(videoEl) {
    videoEl.setAttribute('playsinline', true);
    videoEl.setAttribute('controls', true);
    setTimeout(() => {
      videoEl.removeAttribute('controls');
    }, 1);
  }

  /**
   * 비디오 엘리먼트를 생성 후 반환합니다.
   * @param id
   * @returns
   */
  function createVideoEl(id) {
    const $video = document.createElement('video');
    $video.id = id || 'new-video';
    $video.muted = true;
    $video.autoplay = true;

    return $video;
  }

  /**
   * extends
   */
  this.setVideoStream = setVideoStream;
  this.pauseVideo = pauseVideo;
  this.resumeVideo = resumeVideo;
  this.muteAudio = muteAudio;
  this.unmuteAudio = unmuteAudio;
  this.playForIOS = playForIOS;
  this.createVideoEl = createVideoEl;
}

/**
 * PeerHandler
 * @param options
 * @constructor
 */
export function PeerHandler(options) {
  console.log('Loaded PeerHandler', arguments);
  EventEmitter.call(this);

  const that = this;
  const send = options.send;
  const peerConnectionConfig = {
    iceServers: options.iceServers || getDefaultIceServers(),
  };

  let peer = null; // peer connection instance (offer or answer peer)
  let localStream = null;
  let resolution = {
    width: 1280,
    height: 720,
  };

  /**
   * 미디어 접근 후 커넥션 요청
   */
  async function getUserMedia(constraints) {
    console.log('getUserMedia');

    try {
      localStream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
      return new Promise((_, reject) => reject(error));
    }

    return localStream;
  }

  /**
   * 커넥션 오퍼 전송을 시작을 합니다.
   */
  function startRtcConnection() {
    peer = createPeerConnection();
    createOffer(peer);
  }

  /**
   * offer SDP를 생성 한다.
   */
  function createOffer(peer) {
    console.log('createOffer', arguments);

    if (localStream) {
      addTrack(peer, localStream); // addTrack 제외시 recvonly로 SDP 생성됨
    }

    peer
      .createOffer()
      .then((SDP) => {
        peer.setLocalDescription(SDP);
        console.log('Sending offer description', SDP);

        send({
          to: 'all',
          sdp: SDP,
        });
      })
      .catch((error) => {
        console.error('Error createOffer', error);
      });
  }

  /**
   * offer에 대한 응답 SDP를 생성 한다.
   * @param peer
   * @param msg offer가 보내온 signaling massage
   */
  function createAnswer(peer, offerSdp) {
    console.log('createAnswer', arguments);

    if (localStream) {
      addTrack(peer, localStream);
    }

    peer
      .setRemoteDescription(new RTCSessionDescription(offerSdp))
      .then(() => {
        peer
          .createAnswer()
          .then((SDP) => {
            peer.setLocalDescription(SDP);
            console.log('Sending answer to peer.', SDP);

            send({
              to: 'all',
              sdp: SDP,
            });
          })
          .catch((error) => {
            console.error('Error createAnswer', error);
          });
      })
      .catch((error) => {
        console.error('Error setRemoteDescription', error);
      });
  }

  /**
   * createPeerConnection
   * offer, answer 공통 함수로 peer를 생성하고 관련 이벤트를 바인딩 한다.
   */
  function createPeerConnection() {
    console.log('createPeerConnection', arguments);

    peer = new RTCPeerConnection(peerConnectionConfig);
    console.log('New peer ', peer);

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        send({
          to: 'all',
          label: event.candidate.sdpMLineIndex,
          id: event.candidate.sdpMid,
          candidate: event.candidate.candidate,
        });
      } else {
        console.info('Candidate denied', event.candidate);
      }
    };

    /**
     * 크로스브라우징
     */
    if (peer.ontrack) {
      peer.ontrack = (event) => {
        console.log('ontrack', event);
        const stream = event.streams[0];
        that.emit('addRemoteStream', stream);
      };

      peer.onremovetrack = (event) => {
        console.log('onremovetrack', event);
        const stream = event.streams[0];
        that.emit('removeRemoteStream', stream);
      };
      // 삼성 모바일에서 필요
    } else {
      peer.onaddstream = (event) => {
        console.log('onaddstream', event);
        that.emit('addRemoteStream', event.stream);
      };

      peer.onremovestream = (event) => {
        console.log('onremovestream', event);
        that.emit('removeRemoteStream', event.stream);
      };
    }

    peer.onnegotiationneeded = (event) => {
      console.log('onnegotiationneeded', event);
    };

    peer.onsignalingstatechange = (event) => {
      console.log('onsignalingstatechange', event);
    };

    peer.oniceconnectionstatechange = (event) => {
      console.log(
        'oniceconnectionstatechange',
        `iceGatheringState: ${peer.iceGatheringState} / iceConnectionState: ${peer.iceConnectionState}`
      );

      that.emit('iceconnectionStateChange', event);
    };

    return peer;
  }

  /**
   * addStream 이후 스펙 적용 (크로스브라우징)
   * 스트림을 받아서 PeerConnection track과 stream을 추가 한다.
   * @param peer
   * @param stream
   */
  function addTrack(peer, stream) {
    if (peer.addTrack) {
      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
      });
    } else {
      peer.addStream(stream);
    }
  }

  /**
   * removeStream 이후 스펙 적용 (크로스브라우징)
   * @param peer
   * @param stream
   */
  function removeTrack(peer, stream) {
    if (peer.removeTrack) {
      stream.getTracks().forEach((track) => {
        const sender = peer.getSenders().find((s) => s.track === track);
        if (sender) {
          peer.removeTrack(sender);
        }
      });
    } else {
      peer.removeStream(stream);
    }
  }

  /**
   * 전송중인 영상 해상도를 다이나믹하게 변경합니다.
   */
  function changeResolution() {
    localStream.getVideoTracks().forEach((track) => {
      console.log('changeResolution', track, track.getConstraints(), track.applyConstraints);

      if (resolution.height > 90) {
        resolution = {
          width: 160,
          height: 90,
        };
      } else {
        resolution = {
          width: 1280,
          height: 720,
        };
      }

      track.applyConstraints(resolution).then(() => {
        console.log('changeResolution result', track.getConstraints());
      });
    });
  }

  /**
   * signaling
   * @param data
   */
  function signaling(data) {
    console.log('signaling', data);

    const sdp = data?.sdp;
    const candidate = data?.candidate;

    // 접속자가 보내온 offer처리
    if (sdp) {
      if (sdp.type === 'offer') {
        peer = createPeerConnection();
        createAnswer(peer, sdp);

        // offer에 대한 응답 처리
      } else if (sdp.type === 'answer') {
        peer.setRemoteDescription(new RTCSessionDescription(sdp));
      }

      // offer or answer cadidate처리
    } else if (candidate) {
      const iceCandidate = new RTCIceCandidate({
        sdpMid: data.id,
        sdpMLineIndex: data.label,
        candidate: candidate,
      });

      peer.addIceCandidate(iceCandidate);
    } else {
      // do something
    }
  }

  /**
   * extends
   */
  this.getUserMedia = getUserMedia;
  this.startRtcConnection = startRtcConnection;
  this.signaling = signaling;
  this.changeResolution = changeResolution;
}

inherit(EventEmitter, PeerHandler);