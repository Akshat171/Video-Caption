"use client";

//All Imports
import { useState, useRef } from "react";
import ReactPlayer from "react-player";
import CaptionOverlay from "../components/CaptionOverlay";
import MediaIcon from "../../public/media.webp";
import Image from "next/image";
import { CiPause1, CiPlay1 } from "react-icons/ci";
import { IoTrashBinOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { LuSave } from "react-icons/lu";

//Function starts from here
export default function Home() {
  // All states
  const [videoUrl, setVideoUrl] = useState("");
  const [captions, setCaptions] = useState([]);
  const [currentCaption, setCurrentCaption] = useState("");
  const [currentStart, setCurrentStart] = useState("");
  const [currentEnd, setCurrentEnd] = useState("");
  const [currentDisplayedCaption, setCurrentDisplayedCaption] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [editedCaption, setEditedCaption] = useState("");

  // Reference
  const playerRef = useRef(null);

  // Expression to add Captions
  const addCaption = () => {
    if (currentCaption && currentStart && currentEnd) {
      //if click on edit button to edit/update caption
      if (isEditing) {
        const updatedCaptions = captions.map((caption, index) =>
          index === editIndex
            ? {
                ...caption,
                text: editedCaption,
              }
            : caption
        );
        setCaptions(updatedCaptions);
        setIsEditing(false);
        setEditIndex(-1);
        setEditedCaption("");
      }
      //if it is new caption
      else {
        const newCaption = {
          text: currentCaption,
          start: parseFloat(currentStart),
          end: parseFloat(currentEnd),
        };

        //check if time is overlaps by passing newcaption in validateTimeRange function
        if (!validateTimeRange(newCaption)) {
          alert("Error: Caption time overlaps with existing captions!");
          return;
        }

        //spreading previous captions and insert new caption
        setCaptions((prevCaptions) => [...prevCaptions, newCaption]);
      }

      //all inputs setted to empty string

      setCurrentCaption("");
      setCurrentStart("");
      setCurrentEnd("");
    }
  };

  //function to edit caption and store at that same index
  const editCaption = (index) => {
    setIsEditing(true);
    setEditIndex(index);
    setEditedCaption(captions[index].text);
  };

  //checking for which caption is called to edit based on index and setted time stamp same
  //only changing its time in the object
  const updateCaption = () => {
    if (editedCaption.trim() !== "") {
      const updatedCaptions = captions.map((caption, index) =>
        index === editIndex
          ? {
              //all state remain same
              ...caption,
              //only text will get change
              text: editedCaption,
            }
          : caption
      );
      setCaptions(updatedCaptions);
      setIsEditing(false);
      setEditIndex(-1);
      setEditedCaption("");
    }
  };

  //function to remove caption
  const removeCaption = (index) => {
    setCaptions((prevCaptions) => prevCaptions.filter((_, i) => i !== index));
  };

  // getting caption based on the time
  const getCurrentCaption = (currentTime) => {
    return (
      captions.find(
        (caption) => currentTime >= caption.start && currentTime < caption.end
      )?.text || ""
    );
  };

  //function to set video URL
  const handleVideoUrlChange = (e) => {
    setVideoUrl(e.target.value);
  };

  //function to set video duration
  const handleCaptionClick = (startTime) => {
    playerRef.current?.seekTo(startTime);
  };

  //function to handle video play pause
  const handlePlayPause = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  //function to handle video seek
  const handleSeekChange = (e) => {
    setCurrentTime(parseFloat(e.target.value));
  };

  //function to handle video seek end
  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (e) => {
    setSeeking(false);
    playerRef.current.seekTo(parseFloat(e.target.value));
  };

  //function to write format of time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // function/logic to check if new time is not overlaps with previous stored time
  const validateTimeRange = (newCaption) => {
    const { start: newStart, end: newEnd } = newCaption;
    for (const caption of captions) {
      const { start, end } = caption;
      if (
        (newStart >= start && newStart < end) ||
        (newEnd > start && newEnd <= end) ||
        (newStart <= start && newEnd >= end)
      ) {
        return false; // Overlapping time range found
      }
    }
    return true; // No overlapping time ranges
  };

  //if overlaps then disabled the addCaption button
  const isAddButtonDisabled = () => {
    const newCaption = {
      text: currentCaption,
      start: parseFloat(currentStart),
      end: parseFloat(currentEnd),
    };
    return !validateTimeRange(newCaption);
  };

  return (
    <div className="flex min-h-screen bg-[#F1F1F2]">
      <div className="flex-auto flex flex-col justify-center items-center p-8">
        <div className="max-w-6xl w-full bg-[#1995AD] rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-8 relative space-y-2">
              <h1 className="text-3xl font-bold text-[#F1F1F2] mb-4">
                Video Player
              </h1>
              {videoUrl ? (
                <div className="relative mb-8" style={{ paddingTop: "56.25%" }}>
                  {/*Video Player */}
                  <ReactPlayer
                    ref={playerRef} // Assign ref here
                    url={videoUrl}
                    playing={isPlaying}
                    controls={false}
                    width="100%"
                    height="100%"
                    className="absolute top-0 left-0 w-full h-full"
                    onProgress={({ playedSeconds }) => {
                      if (!seeking) {
                        setCurrentTime(playedSeconds);
                        setCurrentDisplayedCaption(
                          getCurrentCaption(playedSeconds)
                        );
                      }
                    }}
                    onDuration={setDuration}
                  />
                  {/*Caption Display using component */}
                  <CaptionOverlay caption={currentDisplayedCaption} />
                </div>
              ) : (
                <div className="flex items-center justify-center bg-gray-200 h-96 rounded-lg">
                  <Image src={MediaIcon} className="w-8 h-8" />{" "}
                  {/* Replace with your media icon or image component */}
                </div>
              )}
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={handlePlayPause}
                  className="bg-white text-black font-bold border-2 px-4 py-2 rounded-md focus:outline-none border-gray-300 "
                >
                  {isPlaying ? <CiPause1 /> : <CiPlay1 />}
                </button>
                <div className="text-white">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
              <div className="flex items-center mb-8">
                {/*seek Slider */}
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeekChange}
                  onMouseDown={handleSeekMouseDown}
                  onMouseUp={handleSeekMouseUp}
                  className="w-full focus:bg-[#002C54] bg-[#002C54] text-[#002C54]"
                />
              </div>
              {/* Video Url link input */}
              <div className="mb-3">
                <input
                  type="text"
                  value={videoUrl}
                  onChange={handleVideoUrlChange}
                  placeholder="Enter video URL"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[#002C54]"
                />
              </div>
              <div className="mb-8">
                {/*Caption Text */}
                <input
                  type="text"
                  value={currentCaption}
                  onChange={(e) => setCurrentCaption(e.target.value)}
                  placeholder="Enter caption"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring focus:ring-[#002C54]"
                />
                {/* Caption start input */}
                <div className="flex justify-between">
                  <input
                    type="number"
                    value={currentStart}
                    onChange={(e) => setCurrentStart(e.target.value)}
                    placeholder="Start time (seconds)"
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md mr-2 focus:outline-none focus:ring ring-[#002C54]"
                  />
                  {/* Caption end input */}
                  <input
                    type="number"
                    value={currentEnd}
                    onChange={(e) => setCurrentEnd(e.target.value)}
                    placeholder="End time (seconds)"
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring ring-[#002C54]"
                  />
                </div>
                <button
                  onClick={addCaption}
                  className={`mt-4 w-full bg-[#002C54] text-white px-4 py-2 rounded-md ${
                    isAddButtonDisabled() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isAddButtonDisabled()}
                >
                  {isEditing ? "Save Caption" : "Add Caption"}
                </button>
              </div>
            </div>
            {/* Display of all Captions */}
            <div className="lg:w-1/2 bg-[#A1D6E2] p-8">
              <div className="max-h-full overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-gray-20">
                  Captions:
                </h2>
                <ul>
                  {captions.map((caption, index) => (
                    <li
                      key={index}
                      className="mb-2 flex items-center text-white"
                    >
                      {/* Checking if current index is editable or not */}
                      {index === editIndex ? (
                        <>
                          <input
                            type="text"
                            value={editedCaption}
                            onChange={(e) => setEditedCaption(e.target.value)}
                            className="w-full px-3 py-1 border text-black border-gray-300 rounded-md mb-2"
                          />
                          <button
                            onClick={updateCaption}
                            className="bg-[#002C54] ml-2 text-white px-2 py-2 rounded-md mr-2 focus:outline-none"
                          >
                            <LuSave />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 font-semibold mx-2 text-gray-700">
                            {caption.start}s - {caption.end}s:{" "}
                            <span className="text-gray-50 font-normal">
                              {caption.text}
                            </span>
                          </span>
                          <div className="flex space-x-2">
                            <button
                              className="bg-gray-50 text-gray-500 px-2 rounded-lg border-2 border-gray-500"
                              onClick={() => handleCaptionClick(caption.start)}
                            >
                              Jump to
                            </button>
                            <button
                              className="bg-gray-500 text-white px-1 rounded-lg border-2"
                              onClick={() => editCaption(index)}
                            >
                              <FiEdit />
                            </button>
                            <button
                              className="bg-gray-500 text-white px-1 rounded-lg border-2"
                              onClick={() => removeCaption(index)}
                            >
                              <IoTrashBinOutline />
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
