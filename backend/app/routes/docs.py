from flask import Blueprint, current_app, send_from_directory


docs_bp = Blueprint("docs", __name__)


@docs_bp.get("/docs")
def api_docs():
    return """
    <!doctype html>
    <html>
      <head>
        <title>SkillConnect API Documentation</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div id="app"></div>

        <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
        <script>
          Scalar.createApiReference("#app", {
            url: "/api/openapi.yaml",
            theme: "purple"
          })
        </script>
      </body>
    </html>
    """


@docs_bp.get("/openapi.yaml")
def openapi_file():
    return send_from_directory(
        current_app.static_folder,
        "openapi.yaml",
    )
