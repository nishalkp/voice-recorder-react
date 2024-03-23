import { useState } from "react";
import "./App.css";

const constraints = { audio: true };
let recorder,
  onRec = false;
let audioChunks = [];
const audio = new Audio();
function handleDataAvailable(event) {
  audioChunks=[];
  audioChunks.push(event.data);
  console.log("Recording Saved", event, new Date());
}

const playRecordedAudio = (blob) => {
  audio.src = URL.createObjectURL(blob);
  audio
    .play()
    .then(() => {
      // Handle successful playback (optional)
      console.log("Played", new Date());
    })
    .catch((error) => {
      console.error("Error playing audio:", error, new Date());
    });
};

function App() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = handleDataAvailable;
      recorder.onstop = () => {
        var blob = new Blob(audioChunks, { type: "audio/webm" }); // Or other supported format
        addRecording(blob);
      };
    })
    .catch((error) => {
      console.error("Error accessing microphone:", error);
    });
  var [recordings, setRecordings] = useState([]);
  var [recStatus,setRecStatus]=useState("Recording Ended");
  // Function to add a new recording to the recordings array
  const addRecording = (blob) => {
    const newRecording = {
      id: recordings.length + 1,
      title: `Recording ${recordings.length + 1}`,
      description: `Description of Recording ${recordings.length + 1}`,
      blob: blob,
    };
    setRecordings([...recordings, newRecording]);
  };
  function  startRecord() {
    if (!onRec) {
      console.log("Started Recording", new Date());
      // setRecStatus("Started Recording");
      recorder.start();
    } else {
      alert("Recording already in progress");
    }
    onRec = true;
  }
  function stopRecording() {
    if (onRec) {
      console.log("Stoped Recording", new Date());
      recorder.stop();
      setRecStatus("Recording Ended");
    } else {
      alert("Please Start a Recording");
    }
    onRec = false;
  }
  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-gray-200 flex flex-col items-center justify-center">
        <div className="border-2 border-blue-400 w-1/3 h-1/2 text-center shadow-md shadow-blue-500 rounded-md">
        <div
            className={onRec ? "h-4/5 text-green-400" : "h-4/5 text-red-400"}
          >
            {recStatus}
          </div>
          <div>
            <button
              className="fa-solid fa-microphone bottom-0 mr-10"
              onClick={startRecord}
            ></button>
            <button
              className="fa-regular fa-circle-stop ml-5"
              onClick={stopRecording}
            ></button>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-gray-300 flex flex-col">
        <div className="bg-gray-400 text-lg p-3"> All Recordings</div>
        {recordings.length > 0 ? (
          recordings.map((item) => (
            <div
              className="bg-gray-200 p-2 rounded shadow m-2"
              key={item.id}
              onClick={() => {
                playRecordedAudio(item.blob);
              }}
            >
              <h2 className="text-lg font-bold ">{item.title}</h2>
              <p className="text-gray-700 ">{item.description}</p>
            </div>
          ))
        ) : (
          <div className="bg-gray-200 p-4 rounded shadow m-2" key="1">
            List is Empty, Please do rercord
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
