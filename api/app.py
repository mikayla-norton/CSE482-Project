import os
from flask_app import create_app

app=create_app()
if __name__=="__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT",8081)), use_reloader=True)