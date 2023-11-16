from pathlib import Path
from openai import OpenAI
import moviepy.editor as mpe
from retrieve_media import retrieve_random_video_and_audio_from_bucket

client = OpenAI()

MP3_FILE_NAME = "speech_audio.mp3"
SPEECH_FILE_PATH = Path(__file__).parent / MP3_FILE_NAME
SHORTEN_TEXT = True
CREATE_MP3 = True
shortened_text = "This is a test without shortening"

def big_text_to_paragraph():

  # convert big text to paragraph
  text = """Israel emphasizes its inherent right to self-defense, citing ongoing threats from Hamas, a group with a history of launching rocket attacks on Israeli civilians.

  The country underscores its commitment to minimizing civilian casualties, pointing out that Hamas often employs civilian infrastructure as shields for military activities, putting innocent lives at risk.

  Israel highlights diplomatic efforts for peaceful resolution, asserting its dedication to establishing stability in the region for the well-being of both Israelis and Palestinians.

  Concerns about regional stability are voiced, with Israel citing Hamas' ties to extremist groups, emphasizing the need to address this threat for the broader Middle East's security.

  Israel points to international support, indicating recognition of its right to self-defense and underscoring the importance of global cooperation in addressing the complex root causes of the conflict."""

  completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
      {"role": "user", "content": "adjust this text to a 60 words paragraph: {}".format(text)}
    ],
    temperature=0.6
  )

  shortened_text = completion.choices[0].message.content
  return shortened_text
def create_mp3():
  # convert paragraph to mp3
  response = client.audio.speech.create(
    model="tts-1",
    voice="alloy",
    input=shortened_text,
    speed=1.3, 
  )

  response.stream_to_file(SPEECH_FILE_PATH)

def combine_audio(vidname, audio_background,audio_speech, outname, fps=60): 
    my_clip = mpe.VideoFileClip(vidname)
    audio_background = mpe.AudioFileClip("app/"+audio_background)
    audio_speech = mpe.AudioFileClip(audio_speech)
    mixed = mpe.CompositeAudioClip([audio_background, audio_speech])
    final_clip = my_clip.set_audio(mixed)
    final_clip.write_videofile(outname,fps=fps)

if __name__ == '__main__':
  status = retrieve_random_video_and_audio_from_bucket(bucket_name="reelit", destination_video_path="random_video.mp4",destination_audio_path="random_audio.mp3", service_account_file="key.json")
  if status == "success":
    if (SHORTEN_TEXT):
      shortened_text = big_text_to_paragraph()
    if (CREATE_MP3):
      create_mp3()
    combine_audio("random_video.mp4", MP3_FILE_NAME, "result.mp4") # i create a new file