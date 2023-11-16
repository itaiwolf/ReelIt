from flask import Flask, request, send_file
from main import main_script
from flask_cors import CORS  # Import CORS from flask_cors
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def checkalive():
    return 'true'

@app.route('/reelgenerator', methods=['POST'])
def handle_post_request():
    # Access data from the POST request
    data = request.get_json()

    text = data.get("text")

    # TODO: add support for those
    length = data.get("length")
    language = data.get("language")

    main_script(text)

    video_path = '../result.mp4'
    
    # Specify the MIME type for MP4
    mime_type = 'video/mp4'

    # Return the video file as a response
    return send_file(video_path, mimetype=mime_type)

if __name__ == '__main__':
    app.run(debug=True)
