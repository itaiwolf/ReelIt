from pathlib import Path
from openai import OpenAI
import moviepy.editor as mpe
from retrieve_media import retrieve_random_video_and_audio_from_bucket

client = OpenAI()

MP3_FILE_NAME = "speech_audio.mp3"
SPEECH_FILE_PATH = Path(__file__).parent / MP3_FILE_NAME
SHORTEN_TEXT = True
CREATE_MP3 = True

def big_text_to_paragraph(text, length):
  # convert big text to paragraph
  if(length == "short"):
    num_words = 30
  elif(length == "medium"):
    num_words = 65
  else:
    num_words = 110
  completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
      {"role": "user", "content": "adjust this text to a" + str(num_words) + " words paragraph:" + text}
    ],
    temperature=0.6
  )

  shortened_text = completion.choices[0].message.content
  print("text was converted to a pargraph and there were" + str(len(shortened_text.split(" "))) + " words")
  return shortened_text
def create_mp3(shortened_text):
  # convert paragraph to mp3
  response = client.audio.speech.create(
    model="tts-1",
    voice="nova",
    input=shortened_text,
    speed=1, 
  )

  response.stream_to_file(SPEECH_FILE_PATH)

def combine_audio(vidname, speech_audio,random_audio, outname, fps=60,reduction_factor=0.1): 
    my_clip = mpe.VideoFileClip(vidname)
    
    speech_audio = mpe.AudioFileClip("app/"+speech_audio)
    # trim video
    my_clip = my_clip.subclip(0,speech_audio.duration)
    
    random_audio = mpe.AudioFileClip(random_audio)
    random_audio = random_audio.subclip(0,speech_audio.duration)
    random_audio = random_audio.volumex(reduction_factor)
    mixed = mpe.CompositeAudioClip([speech_audio, random_audio],)
    
    final_clip = my_clip.set_audio(mixed)
    final_clip.write_videofile(outname,fps=fps)

def main_script(text, length):
  shortened_text = "This is a test without shortening"
  status = retrieve_random_video_and_audio_from_bucket(bucket_name="reelit", destination_video_path="random_video.mp4",destination_audio_path="random_audio.mp3", service_account_file="key.json")
  if status == "success":
    if (SHORTEN_TEXT):
      shortened_text = big_text_to_paragraph(text, length)
    if (CREATE_MP3):
      create_mp3(shortened_text)
    combine_audio("random_video.mp4", MP3_FILE_NAME,"random_audio.mp3", "result.mp4") # i create a new file