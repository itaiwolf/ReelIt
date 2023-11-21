from flask import Flask, request, send_file,jsonify
from main_script import main_script
from flask_cors import CORS  # Import CORS from flask_cors
from parameters import MEDIA_DIRECTORY_NAME,OUTPUT_FILE_NAME

app = Flask(__name__)

CORS(app)  # Enable CORS for all routes
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/')
def checkalive():
    return 'true'

@app.route('/reelgenerator', methods=['POST'])
def handle_post_request():
    # Access data from the POST request
    data = request.get_json()

    text = data.get("text")

    length = data.get("length")
    # TODO: add support for this
    language = data.get("language")

    status_code = main_script(text, length)

    if (status_code != "success"):
        return jsonify({'error': 'Something went wrong'}), 500

    video_path = MEDIA_DIRECTORY_NAME+'/'+OUTPUT_FILE_NAME
    
    # Specify the MIME type for MP4
    mime_type = 'video/mp4'

    # Return the video file as a response
    return send_file(video_path, mimetype=mime_type)

if __name__ == '__main__':
    app.run(host="0.0.0.0",debug=True)
