from google.cloud import storage
import random
import os
from parameters import MEDIA_DIRECTORY_NAME
def retrieve_random_video_and_audio_from_bucket(bucket_name, destination_video_path,destination_audio_path, service_account_file):
    try:
        if not os.path.exists(MEDIA_DIRECTORY_NAME):
            os.mkdir(MEDIA_DIRECTORY_NAME)
        # Initialize a GCS client
        client = storage.Client.from_service_account_json(service_account_file)

        # Get the bucket
        bucket = client.get_bucket(bucket_name)

        # List all objects in the bucket
        videos = list(bucket.list_blobs(prefix="videos/",delimiter="/", match_glob="**.mp4"))

        if not videos:
            print("No videos found in the specified bucket.")
            return "failed"

        # Choose a random blob (object) from the list
        random_video = random.choice(videos)

        # Download the random blob to the specified file path
        random_video.download_to_filename(destination_video_path)

        print(f"Video object '{random_video.name}' retrieved and saved to '{destination_video_path}'.")

        audios = list(bucket.list_blobs(prefix="audios/",delimiter="/", match_glob="**.mp3"))

        if not audios:
            print("No audios found in the specified bucket.")
            return

        # Choose a random blob (object) from the list
        random_audio = random.choice(audios)

        # Download the random blob to the specified file path
        random_audio.download_to_filename(destination_audio_path)

        print(f"Audio object '{random_audio.name}' retrieved and saved to '{destination_audio_path}'.")
        return "success"
    except Exception as e:
        print(f"Error: {e}")
        return "failed"
# hey mom you are very nice. i like that you always remember to give me your car keys
