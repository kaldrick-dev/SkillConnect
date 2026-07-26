import os

from dotenv import load_dotenv

load_dotenv()

from app import create_app

app = create_app()

if __name__ == "__main__":
    from gunicorn.app.base import BaseApplication

    class StandaloneApplication(BaseApplication):
        def __init__(self, app, options):
            self.application = app
            self.options = options
            super().__init__()

        def load_config(self):
            for key, value in self.options.items():
                self.cfg.set(key, value)

        def load(self):
            return self.application

    StandaloneApplication(app, {
        "bind": f"0.0.0.0:{os.environ.get('PORT', 8000)}",
        "reload": True,
    }).run()
