# Video Caption Tool
This is a React-based video captioning tool that allows users to add captions to videos and navigate through them. It includes features such as play/pause, seek control, and displaying the current playback time and duration.


https://github.com/Akshat171/Video-Caption/assets/81281246/84aef6c1-c311-43e4-89fd-d9e735bcbed5



### Features
* Video Playback: Play and pause video functionality.
* Caption Overlay: Display captions over the video at specified times.
* Add Captions: Add captions with start and end times.
* Seek Control: Seek through the video using a range slider.
* Playback Time Display: Display current playback time and total video duration.
* Jump to Caption: Click on a caption to jump to its start time in the video.



### Usage
Enter Video URL: In the input field provided, enter the URL of the video you want to add captions to.
#### Add Captions:

* Enter the caption text.
* Specify the start and end times in seconds.
* Click "Add Caption" to save the caption.
#### Play/Pause Video: Use the play/pause button to control video playback.
#### Seek Through Video: Use the range slider to seek through the video.
#### View Captions: Click on any caption in the list to jump to its start time in the video.


### Project Structure

components/
CaptionOverlay.jsx: Displays captions over the video.
MediaIcon.jsx: A placeholder icon or image to be displayed when no video URL is entered.

pages/
index.jsx: The main page containing the video player and captioning tool.


### Technologies

* Next.js
* TJavascript
* React
* React player


### How to Contribute
If you would like to contribute to this project, please feel free to fork the repository and submit a pull request.
First, run the development server:


```bash
git clone https://github.com/Akshat171/Video-Caption.git
cd video-caption-tool
npm install
npm run dev
# or
yarn dev
```
